import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Location.css'

function Location() {
  const navigate = useNavigate()
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load blog content
  useEffect(() => {
    import('../data/blog-posts.json')
      .then((data) => {
        setBlogPosts(data.posts || [])
        setIsLoading(false)
      })
      .catch(() => {
        // Content not built yet - will show fallback message
        setBlogPosts([])
        setIsLoading(false)
      })
  }, [])

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
        {isLoading ? (
          <div className="no-content">
            <p>⏳ Loading content...</p>
          </div>
        ) : blogPosts.length === 0 ? (
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
    </div>
  )
}

export default Location
