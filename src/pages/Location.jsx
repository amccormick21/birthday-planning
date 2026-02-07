import { useNavigate } from 'react-router-dom'
import '../styles/Location.css'

// Try to import generated blog content, fall back to default if not built yet
let blogData = { posts: [] }
try {
  blogData = await import('../data/blog-posts.json')
} catch {
  // Content not built yet - will show fallback message
}

const blogPosts = blogData.posts || []

function Location() {
  const navigate = useNavigate()

  return (
    <div className="location-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <header className="location-header">
        <h1>📍 Location Guide</h1>
        <p>Everything you need to know about our destination</p>
      </header>

      <div className="blog-container">
        {blogPosts.length === 0 ? (
          <div className="no-content">
            <p>📝 No blog content yet.</p>
            <p>Run <code>npm run build:content</code> to generate content from markdown files in <code>content/blog/</code></p>
          </div>
        ) : (
          blogPosts.map((post) => (
            <article key={post.id} className="blog-post">
              <div className="post-icon">{post.icon}</div>
              <div className="post-content">
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                </div>
                <h2>{post.title}</h2>
                <div 
                  className="post-text"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              </div>
            </article>
          ))
        )}
      </div>

      <div className="edit-note">
        <p>💡 <strong>Tip:</strong> Add or edit markdown files in <code>content/blog/</code> then run <code>npm run build:content</code></p>
      </div>
    </div>
  )
}

export default Location
