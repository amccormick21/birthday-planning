/**
 * Content Build Script
 * 
 * This script processes content from the content/ folder:
 * 1. Converts blog markdown files to JSON
 * 2. Processes gallery images and creates manifest
 * 
 * Usage: node scripts/build-content.js
 */

import { readdir, readFile, writeFile, mkdir, copyFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')

// Content directories
const BLOG_CONTENT_DIR = join(ROOT_DIR, 'content', 'blog')
const IMAGES_CONTENT_DIR = join(ROOT_DIR, 'content', 'images')

// Output directories
const DATA_OUTPUT_DIR = join(ROOT_DIR, 'src', 'data')
const PUBLIC_IMAGES_DIR = join(ROOT_DIR, 'public', 'images', 'gallery')

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content) {
  // Normalize line endings (Windows \r\n to \n)
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { metadata: {}, body: content }
  }
  
  const frontmatter = match[1]
  const body = match[2].trim()
  
  // Simple YAML parser for our needs
  const metadata = {}
  const lines = frontmatter.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      // Parse numbers
      if (!isNaN(value) && value !== '') {
        value = Number(value)
      }
      
      metadata[key] = value
    }
  }
  
  return { metadata, body }
}

/**
 * Convert markdown to HTML (simple implementation)
 */
function markdownToHtml(markdown) {
  let html = markdown
  
  // Escape HTML entities first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Headers (h1-h6)
  html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // Unordered lists
  html = html.replace(/^[-*]\s+(.*)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
  
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
  
  // Paragraphs
  const lines = html.split('\n\n')
  html = lines.map(block => {
    block = block.trim()
    if (!block) return ''
    if (block.match(/^<(h[1-6]|ul|ol|li|p|div|blockquote)/)) {
      return block
    }
    if (!block) return ''
    return `<p>${block.replace(/\n/g, '<br>')}</p>`
  }).join('\n')
  
  // Clean up
  html = html.replace(/<p><p>/g, '<p>')
  html = html.replace(/<\/p><\/p>/g, '</p>')
  
  return html.trim()
}

/**
 * Build blog content from markdown files
 */
async function buildBlogContent() {
  console.log('📝 Building blog content...\n')
  
  if (!existsSync(BLOG_CONTENT_DIR)) {
    console.log('   No blog content directory found, skipping...\n')
    return
  }
  
  const files = await readdir(BLOG_CONTENT_DIR)
  const markdownFiles = files.filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
  
  if (markdownFiles.length === 0) {
    console.log('   No markdown files found in content/blog/\n')
    return
  }
  
  console.log(`   Found ${markdownFiles.length} markdown file(s):\n`)
  
  const posts = []
  
  for (const file of markdownFiles) {
    const filePath = join(BLOG_CONTENT_DIR, file)
    const content = await readFile(filePath, 'utf-8')
    const { metadata, body } = parseFrontmatter(content)
    
    if (!metadata.id) {
      console.warn(`   ⚠️  Skipping ${file}: missing 'id' in frontmatter`)
      continue
    }
    if (!metadata.title) {
      console.warn(`   ⚠️  Skipping ${file}: missing 'title' in frontmatter`)
      continue
    }
    
    const post = {
      id: metadata.id,
      title: metadata.title,
      date: metadata.date || 'Unknown date',
      icon: metadata.icon || '📄',
      order: metadata.order ?? metadata.id,
      content: body,
      contentHtml: markdownToHtml(body)
    }
    
    posts.push(post)
    console.log(`   ✓ ${file} → "${post.title}"`)
  }
  
  posts.sort((a, b) => a.order - b.order)
  
  // Ensure output directory exists
  if (!existsSync(DATA_OUTPUT_DIR)) {
    await mkdir(DATA_OUTPUT_DIR, { recursive: true })
  }
  
  const output = {
    generatedAt: new Date().toISOString(),
    posts
  }
  
  const outputFile = join(DATA_OUTPUT_DIR, 'blog-posts.json')
  await writeFile(outputFile, JSON.stringify(output, null, 2), 'utf-8')
  
  console.log(`\n   ✅ Generated blog-posts.json (${posts.length} posts)\n`)
}

/**
 * Parse a date string like "March 2016" into a sortable Date object
 */
function parseDateString(dateStr) {
  if (!dateStr) return new Date(0) // Sort items without dates first
  
  // Handle "Month Year" format
  const months = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3,
    'may': 4, 'june': 5, 'july': 6, 'august': 7,
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  }
  
  const parts = dateStr.trim().toLowerCase().split(/\s+/)
  if (parts.length >= 2) {
    const month = months[parts[0]]
    const year = parseInt(parts[parts.length - 1], 10)
    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1)
    }
  }
  
  // Fallback: try to parse as-is
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? new Date(0) : parsed
}

/**
 * Extract year from a date string like "March 2016"
 */
function extractYear(dateStr) {
  if (!dateStr) return null
  const match = dateStr.match(/\b(20\d{2})\b/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Build gallery content from images
 */
async function buildGalleryContent() {
  console.log('🖼️  Building gallery content...\n')
  
  if (!existsSync(IMAGES_CONTENT_DIR)) {
    console.log('   No images directory found, creating placeholder...\n')
    await mkdir(IMAGES_CONTENT_DIR, { recursive: true })
  }
  
  // Read all files in images directory
  const files = await readdir(IMAGES_CONTENT_DIR)
  const imageFiles = files.filter(f => {
    const ext = extname(f).toLowerCase()
    return IMAGE_EXTENSIONS.includes(ext)
  })
  
  // Try to read gallery.json for metadata
  let galleryMeta = { images: [] }
  const metaPath = join(IMAGES_CONTENT_DIR, 'gallery.json')
  if (existsSync(metaPath)) {
    try {
      let metaContent = await readFile(metaPath, 'utf-8')
      // Strip UTF-8 BOM if present (appears as \uFEFF after utf-8 decoding)
      metaContent = metaContent.replace(/^\uFEFF/, '')
      galleryMeta = JSON.parse(metaContent)
      console.log('   Found gallery.json with metadata\n')
    } catch (e) {
      console.warn('   ⚠️  Could not parse gallery.json:', e.message)
    }
  }
  
  // Create a map of metadata by filename
  const metaMap = new Map()
  galleryMeta.images?.forEach((img, index) => {
    metaMap.set(img.filename, { ...img, metaOrder: index })
  })
  
  // Ensure public images directory exists
  if (!existsSync(PUBLIC_IMAGES_DIR)) {
    await mkdir(PUBLIC_IMAGES_DIR, { recursive: true })
  }
  
  const images = []
  let copiedCount = 0
  
  // Process each image
  for (const file of imageFiles) {
    const sourcePath = join(IMAGES_CONTENT_DIR, file)
    const destPath = join(PUBLIC_IMAGES_DIR, file)
    
    // Copy image to public folder
    try {
      await copyFile(sourcePath, destPath)
      copiedCount++
    } catch (e) {
      console.warn(`   ⚠️  Failed to copy ${file}:`, e.message)
      continue
    }
    
    // Get metadata if available
    const meta = metaMap.get(file) || {}
    
    const image = {
      id: basename(file, extname(file)),
      filename: file,
      src: `/birthday-planning/images/gallery/${file}`,
      caption: meta.caption || null,
      date: meta.date || null,
      location: meta.location || null,
      year: extractYear(meta.date),
      order: meta.order ?? meta.metaOrder ?? 999
    }
    
    images.push(image)
    
    const metaInfo = meta.caption ? ` ("${meta.caption}")` : ''
    console.log(`   ✓ ${file}${metaInfo}`)
  }
  
  // Sort images by date (oldest first)
  images.sort((a, b) => {
    const dateA = parseDateString(a.date)
    const dateB = parseDateString(b.date)
    return dateA.getTime() - dateB.getTime()
  })
  
  // Ensure output directory exists
  if (!existsSync(DATA_OUTPUT_DIR)) {
    await mkdir(DATA_OUTPUT_DIR, { recursive: true })
  }
  
  const output = {
    generatedAt: new Date().toISOString(),
    images
  }
  
  const outputFile = join(DATA_OUTPUT_DIR, 'gallery-images.json')
  await writeFile(outputFile, JSON.stringify(output, null, 2), 'utf-8')
  
  if (images.length === 0) {
    console.log('   No images found. Add images to content/images/ to populate the gallery.\n')
  } else {
    console.log(`\n   ✅ Generated gallery-images.json (${images.length} images)`)
    console.log(`   ✅ Copied ${copiedCount} images to public/images/gallery/\n`)
  }
}

/**
 * Main build function
 */
async function buildContent() {
  console.log('\n========================================')
  console.log('       Building Content')
  console.log('========================================\n')
  
  await buildBlogContent()
  await buildGalleryContent()
  
  console.log('========================================')
  console.log('       Build Complete!')
  console.log('========================================\n')
}

// Run the build
buildContent().catch(console.error)
