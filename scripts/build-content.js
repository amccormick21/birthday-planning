/**
 * Blog Content Build Script
 * 
 * This script reads markdown files from content/blog/ and converts them
 * to a JSON file that can be imported by the React application.
 * 
 * Usage: node scripts/build-content.js
 * 
 * Markdown files should have YAML frontmatter with:
 * - id: unique identifier
 * - title: post title
 * - date: display date
 * - icon: emoji icon (optional, defaults to 📄)
 * - order: sort order (optional, defaults to id)
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')
const CONTENT_DIR = join(ROOT_DIR, 'content', 'blog')
const OUTPUT_FILE = join(ROOT_DIR, 'src', 'data', 'blog-posts.json')

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
 * Handles: headers, bold, italic, lists, links, paragraphs
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
  // Wrap consecutive <li> that aren't already in <ul> into <ol>
  html = html.replace(/(<li>.*<\/li>\n?)(?!<\/ul>)/g, (match, p1, offset, string) => {
    // Check if this li is already part of a ul
    const before = string.slice(0, offset)
    const lastUlOpen = before.lastIndexOf('<ul>')
    const lastUlClose = before.lastIndexOf('</ul>')
    if (lastUlOpen > lastUlClose) {
      return match // Already in a ul
    }
    return match
  })
  
  // Paragraphs - wrap lines that aren't already wrapped
  const lines = html.split('\n\n')
  html = lines.map(block => {
    block = block.trim()
    if (!block) return ''
    // Don't wrap if already an HTML block element
    if (block.match(/^<(h[1-6]|ul|ol|li|p|div|blockquote)/)) {
      return block
    }
    // Don't wrap empty lines
    if (!block) return ''
    return `<p>${block.replace(/\n/g, '<br>')}</p>`
  }).join('\n')
  
  // Clean up any double-wrapped paragraphs
  html = html.replace(/<p><p>/g, '<p>')
  html = html.replace(/<\/p><\/p>/g, '</p>')
  
  return html.trim()
}

/**
 * Main build function
 */
async function buildBlogContent() {
  console.log('📝 Building blog content...\n')
  
  // Check if content directory exists
  if (!existsSync(CONTENT_DIR)) {
    console.log(`Creating content directory: ${CONTENT_DIR}`)
    await mkdir(CONTENT_DIR, { recursive: true })
    console.log('⚠️  No blog content found. Add markdown files to content/blog/')
    return
  }
  
  // Read all markdown files (excluding README)
  const files = await readdir(CONTENT_DIR)
  const markdownFiles = files.filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
  
  if (markdownFiles.length === 0) {
    console.log('⚠️  No markdown files found in content/blog/')
    return
  }
  
  console.log(`Found ${markdownFiles.length} markdown file(s):\n`)
  
  const posts = []
  
  for (const file of markdownFiles) {
    const filePath = join(CONTENT_DIR, file)
    const content = await readFile(filePath, 'utf-8')
    const { metadata, body } = parseFrontmatter(content)
    
    // Validate required fields
    if (!metadata.id) {
      console.warn(`⚠️  Skipping ${file}: missing 'id' in frontmatter`)
      continue
    }
    if (!metadata.title) {
      console.warn(`⚠️  Skipping ${file}: missing 'title' in frontmatter`)
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
    console.log(`  ✓ ${file} → "${post.title}"`)
  }
  
  // Sort by order
  posts.sort((a, b) => a.order - b.order)
  
  // Ensure output directory exists
  const outputDir = dirname(OUTPUT_FILE)
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true })
  }
  
  // Write JSON file
  const output = {
    generatedAt: new Date().toISOString(),
    posts
  }
  
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8')
  
  console.log(`\n✅ Generated ${OUTPUT_FILE}`)
  console.log(`   ${posts.length} blog post(s) processed`)
}

// Run the build
buildBlogContent().catch(console.error)
