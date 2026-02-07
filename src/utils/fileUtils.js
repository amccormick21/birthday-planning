import gpxParser from 'gpxparser'

/**
 * Parse a GPX file and extract route coordinates
 * @param {File} file - GPX file to parse
 * @returns {Promise<Array<{lat: number, lng: number}>>} Array of coordinate objects (Firestore-compatible)
 */
export const parseGpxRoute = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const gpx = new gpxParser()
        gpx.parse(e.target.result)
        
        if (gpx.tracks.length > 0) {
          // Convert to array of objects instead of nested arrays for Firestore compatibility
          const points = gpx.tracks[0].points.map(point => ({
            lat: point.lat,
            lng: point.lon
          }))
          resolve(points)
        } else {
          reject(new Error('No track data found in GPX file'))
        }
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read GPX file'))
    reader.readAsText(file)
  })
}

/**
 * Parse GPX text content directly
 * @param {string} gpxText - GPX XML content as string
 * @param {boolean} asObjects - If true, return objects instead of arrays (for Firestore)
 * @returns {Array<[number, number]> | Array<{lat: number, lng: number}>} Array of coordinates
 */
export const parseGpxText = (gpxText, asObjects = false) => {
  const gpx = new gpxParser()
  gpx.parse(gpxText)
  
  if (gpx.tracks.length === 0) {
    throw new Error('No track data found in GPX file')
  }
  
  if (asObjects) {
    // Return as objects for Firestore compatibility
    return gpx.tracks[0].points.map(point => ({
      lat: point.lat,
      lng: point.lon
    }))
  }
  
  return gpx.tracks[0].points.map(point => [point.lat, point.lon])
}

/**
 * Compress an image file to base64 with specified dimensions and quality
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} maxHeight - Maximum height in pixels (default: 600)
 * @param {number} quality - JPEG quality 0-1 (default: 0.7)
 * @returns {Promise<string>} Base64 encoded image data URL
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!file) {
      reject(new Error('No file provided'))
      return
    }
    
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    if (maxWidth <= 0 || maxHeight <= 0) {
      reject(new Error('Invalid dimensions'))
      return
    }

    if (quality < 0 || quality > 1) {
      reject(new Error('Quality must be between 0 and 1'))
      return
    }

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Read a text file and return its content
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Validate photo array
 * @param {File[]} photos - Array of photo files
 * @param {number} maxPhotos - Maximum allowed photos (default: 6)
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validatePhotos = (photos, maxPhotos = 6) => {
  if (!Array.isArray(photos)) {
    return { valid: false, error: 'Photos must be an array' }
  }

  if (photos.length === 0) {
    return { valid: false, error: 'At least one photo is required' }
  }

  if (photos.length > maxPhotos) {
    return { valid: false, error: `Maximum ${maxPhotos} photos allowed` }
  }

  const invalidFiles = photos.filter(file => !file.type.startsWith('image/'))
  if (invalidFiles.length > 0) {
    return { valid: false, error: 'Only image files are allowed' }
  }

  return { valid: true }
}

/**
 * Calculate compressed image dimensions
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Object} { width: number, height: number }
 */
export const calculateCompressedDimensions = (width, height, maxWidth, maxHeight) => {
  let newWidth = width
  let newHeight = height

  if (width > height) {
    if (width > maxWidth) {
      newHeight *= maxWidth / width
      newWidth = maxWidth
    }
  } else {
    if (height > maxHeight) {
      newWidth *= maxHeight / height
      newHeight = maxHeight
    }
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) }
}
