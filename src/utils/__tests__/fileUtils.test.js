import {
  parseGpxText,
  parseGpxRoute,
  compressImage,
  validatePhotos,
  calculateCompressedDimensions,
} from '../fileUtils'
import { readFileSync } from 'fs'
import { join } from 'path'
import GPXParser from 'gpxparser'

// Sample GPX data for testing
const validGpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test">
  <trk>
    <name>Test Track</name>
    <trkseg>
      <trkpt lat="51.5074" lon="-0.1278">
        <ele>10</ele>
      </trkpt>
      <trkpt lat="51.5075" lon="-0.1279">
        <ele>11</ele>
      </trkpt>
      <trkpt lat="51.5076" lon="-0.1280">
        <ele>12</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`

const emptyGpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test">
  <metadata>
    <name>Empty GPX</name>
  </metadata>
</gpx>`

describe('GPX Parser Utils', () => {
  describe('parseGpxText', () => {
    test('should parse valid GPX data and extract coordinates', () => {
      const result = parseGpxText(validGpxData)
      
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual([51.5074, -0.1278])
      expect(result[1]).toEqual([51.5075, -0.1279])
      expect(result[2]).toEqual([51.5076, -0.1280])
    })

    test('should throw error for GPX with no tracks', () => {
      expect(() => parseGpxText(emptyGpxData)).toThrow('No track data found in GPX file')
    })

    test('should throw error for invalid GPX data', () => {
      expect(() => parseGpxText('invalid xml')).toThrow()
    })

    test('should throw error for empty string', () => {
      expect(() => parseGpxText('')).toThrow()
    })
  })

  describe('parseGpxText with real test.gpx file', () => {
    let testGpxContent
    let gpx

    beforeAll(() => {
      // Load the actual test.gpx file
      const gpxPath = join(process.cwd(), 'resources', 'test.gpx')
      testGpxContent = readFileSync(gpxPath, 'utf-8')
      
      // Parse with GPXParser to extract detailed information
      gpx = new GPXParser()
      gpx.parse(testGpxContent)
    })

    test('should load test.gpx file successfully', () => {
      expect(testGpxContent).toBeDefined()
      expect(testGpxContent.length).toBeGreaterThan(0)
      expect(testGpxContent).toContain('<?xml')
    })

    test('should parse test.gpx and extract track name', () => {
      expect(gpx.tracks).toHaveLength(1)
      expect(gpx.tracks[0].name).toBe('Crook Peak and Strawberry Path')
    })

    test('should parse test.gpx and extract track type', () => {
      expect(gpx.tracks[0].type).toBe('running')
    })

    test('should parse test.gpx and extract first track point coordinates', () => {
      const firstPoint = gpx.tracks[0].points[0]
      
      expect(firstPoint.lat).toBe(51.290091)
      expect(firstPoint.lon).toBe(-2.827882)
    })

    test('should parse test.gpx and extract first track point elevation', () => {
      const firstPoint = gpx.tracks[0].points[0]
      
      expect(firstPoint.ele).toBe(46.0)
    })

    test('should successfully parse test.gpx with parseGpxText function', () => {
      const coordinates = parseGpxText(testGpxContent)
      
      expect(coordinates).toBeDefined()
      expect(coordinates.length).toBeGreaterThan(0)
      
      // Verify first coordinate matches
      expect(coordinates[0][0]).toBe(51.290091)
      expect(coordinates[0][1]).toBe(-2.827882)
    })

    test('should return Firestore-compatible format when asObjects is true', () => {
      const coordinates = parseGpxText(testGpxContent, true)
      
      expect(coordinates).toBeDefined()
      expect(coordinates.length).toBeGreaterThan(0)
      
      // Verify it's in object format (not nested arrays)
      expect(coordinates[0]).toHaveProperty('lat')
      expect(coordinates[0]).toHaveProperty('lng')
      expect(coordinates[0].lat).toBe(51.290091)
      expect(coordinates[0].lng).toBe(-2.827882)
      
      // Ensure it's not a nested array
      expect(Array.isArray(coordinates[0])).toBe(false)
    })

    test('should parse test.gpx with parseGpxRoute in Firestore-compatible format', async () => {
      // Create a mock File object from the GPX content
      const blob = new Blob([testGpxContent], { type: 'text/xml' })
      const mockFile = new File([blob], 'test.gpx', { type: 'text/xml' })
      
      // Mock FileReader to return the actual test.gpx content
      const originalFileReader = global.FileReader
      global.FileReader = class {
        readAsText() {
          if (this.onload) {
            this.onload({ target: { result: testGpxContent } })
          }
        }
      }
      
      const coordinates = await parseGpxRoute(mockFile)
      
      // Restore original FileReader
      global.FileReader = originalFileReader
      
      expect(coordinates).toBeDefined()
      expect(coordinates.length).toBeGreaterThan(0)
      
      // Verify it's in object format (Firestore-compatible)
      expect(coordinates[0]).toHaveProperty('lat')
      expect(coordinates[0]).toHaveProperty('lng')
      expect(coordinates[0].lat).toBe(51.290091)
      expect(coordinates[0].lng).toBe(-2.827882)
      
      // Ensure it's not a nested array (which Firestore doesn't support)
      expect(Array.isArray(coordinates[0])).toBe(false)
    })
  })
})

describe('Image Compression Utils', () => {
  describe('compressImage', () => {
    let mockFile

    beforeEach(() => {
      // Create a mock image file
      mockFile = new File(['fake image content'], 'test.jpg', { type: 'image/jpeg' })
    })

    test('should reject if no file provided', async () => {
      await expect(compressImage(null)).rejects.toThrow('No file provided')
    })

    test('should reject if file is not an image', async () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' })
      await expect(compressImage(textFile)).rejects.toThrow('File is not an image')
    })

    test('should reject if dimensions are invalid', async () => {
      await expect(compressImage(mockFile, 0, 600)).rejects.toThrow('Invalid dimensions')
      await expect(compressImage(mockFile, 800, -1)).rejects.toThrow('Invalid dimensions')
    })

    test('should reject if quality is invalid', async () => {
      await expect(compressImage(mockFile, 800, 600, -0.1)).rejects.toThrow('Quality must be between 0 and 1')
      await expect(compressImage(mockFile, 800, 600, 1.5)).rejects.toThrow('Quality must be between 0 and 1')
    })

    // Note: Full integration tests for compressImage require a browser environment with actual canvas
    // These tests verify the validation logic works correctly
    test.skip('should accept valid quality values', async () => {
      // TODO: This test requires full browser environment simulation
      // The compressImage function is tested manually in the browser
      const result = await compressImage(mockFile, 800, 600, 0.7)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    test.skip('should use default parameters', async () => {
      // TODO: This test requires full browser environment simulation
      // The compressImage function is tested manually in the browser
      const result = await compressImage(mockFile)
      expect(result).toBeDefined()
    })
  })

  describe('calculateCompressedDimensions', () => {
    test('should maintain aspect ratio for landscape images', () => {
      const result = calculateCompressedDimensions(1600, 1200, 800, 600)
      expect(result.width).toBe(800)
      expect(result.height).toBe(600)
    })

    test('should maintain aspect ratio for portrait images', () => {
      const result = calculateCompressedDimensions(1200, 1600, 800, 600)
      expect(result.width).toBe(450)
      expect(result.height).toBe(600)
    })

    test('should not upscale smaller images', () => {
      const result = calculateCompressedDimensions(400, 300, 800, 600)
      expect(result.width).toBe(400)
      expect(result.height).toBe(300)
    })

    test('should handle square images', () => {
      const result = calculateCompressedDimensions(1000, 1000, 800, 600)
      expect(result.width).toBe(600)
      expect(result.height).toBe(600)
    })

    test('should handle extreme aspect ratios', () => {
      const result = calculateCompressedDimensions(3000, 500, 800, 600)
      expect(result.width).toBe(800)
      expect(result.height).toBe(133) // Rounded
    })
  })
})

describe('Photo Validation Utils', () => {
  describe('validatePhotos', () => {
    test('should accept valid photo array', () => {
      const photos = [
        new File([''], 'photo1.jpg', { type: 'image/jpeg' }),
        new File([''], 'photo2.png', { type: 'image/png' }),
      ]
      
      const result = validatePhotos(photos)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should reject empty array', () => {
      const result = validatePhotos([])
      expect(result.valid).toBe(false)
      expect(result.error).toBe('At least one photo is required')
    })

    test('should reject non-array input', () => {
      const result = validatePhotos(null)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Photos must be an array')
    })

    test('should reject too many photos', () => {
      const photos = Array(7).fill(new File([''], 'photo.jpg', { type: 'image/jpeg' }))
      const result = validatePhotos(photos, 6)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Maximum 6 photos allowed')
    })

    test('should reject non-image files', () => {
      const photos = [
        new File([''], 'photo.jpg', { type: 'image/jpeg' }),
        new File([''], 'document.pdf', { type: 'application/pdf' }),
      ]
      
      const result = validatePhotos(photos)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Only image files are allowed')
    })

    test('should accept different image formats', () => {
      const photos = [
        new File([''], 'photo.jpg', { type: 'image/jpeg' }),
        new File([''], 'photo.png', { type: 'image/png' }),
        new File([''], 'photo.gif', { type: 'image/gif' }),
        new File([''], 'photo.webp', { type: 'image/webp' }),
      ]
      
      const result = validatePhotos(photos)
      expect(result.valid).toBe(true)
    })

    test('should respect custom max photos limit', () => {
      const photos = Array(3).fill(new File([''], 'photo.jpg', { type: 'image/jpeg' }))
      
      const result1 = validatePhotos(photos, 2)
      expect(result1.valid).toBe(false)
      
      const result2 = validatePhotos(photos, 10)
      expect(result2.valid).toBe(true)
    })
  })
})
