import { useNavigate } from 'react-router-dom'
import '../styles/Location.css'

const blogPosts = [
  {
    id: 1,
    title: 'Welcome to Our Destination',
    date: 'February 2026',
    content: `Welcome to this beautiful location! This is where we'll be celebrating together. 
    This area is known for its stunning landscapes, rich history, and warm hospitality.`,
    image: '🌄'
  },
  {
    id: 2,
    title: 'Things to Know',
    date: 'February 2026',
    content: `Here are some helpful tips for your visit:
    • Best time to visit: Spring and Summer
    • Local currency: [To be determined]
    • Language: [To be determined]
    • Weather: Generally pleasant with mild temperatures`,
    image: '📝'
  },
  {
    id: 3,
    title: 'Local Attractions',
    date: 'February 2026',
    content: `There's so much to explore in the area:
    • Historic landmarks
    • Natural parks and trails
    • Local markets and shops
    • Restaurants featuring regional cuisine
    • Cultural sites and museums`,
    image: '🗺️'
  }
]

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
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-post">
            <div className="post-icon">{post.image}</div>
            <div className="post-content">
              <div className="post-meta">
                <span className="post-date">{post.date}</span>
              </div>
              <h2>{post.title}</h2>
              <p className="post-text">{post.content}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="edit-note">
        <p>💡 <strong>Note:</strong> Edit the blog posts in <code>src/pages/Location.jsx</code> to add your own content!</p>
      </div>
    </div>
  )
}

export default Location
