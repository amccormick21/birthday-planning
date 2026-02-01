import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

const galleryItems = [
  {
    id: 1,
    title: 'Location',
    description: 'Explore the destination',
    path: '/location',
    icon: '📍'
  },
  {
    id: 2,
    title: 'Accommodation',
    description: 'Your home away from home',
    path: '/accommodation',
    icon: '🏠'
  },
  {
    id: 3,
    title: 'Walks',
    description: 'Discover scenic routes',
    path: '/walks',
    icon: '🥾'
  }
]

function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
  }

  const handleSelect = (index) => {
    setActiveIndex(index)
  }

  const handleNavigate = () => {
    navigate(galleryItems[activeIndex].path)
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Birthday Planning</h1>
        <p>Your Adventure Awaits</p>
      </header>

      <div className="gallery-spinner">
        <button className="nav-button prev" onClick={handlePrev} aria-label="Previous">
          ‹
        </button>

        <div className="gallery-content">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`gallery-item ${index === activeIndex ? 'active' : ''} ${
                index < activeIndex ? 'left' : index > activeIndex ? 'right' : ''
              }`}
            >
              <div className="gallery-card">
                <div className="icon">{item.icon}</div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {index === activeIndex && (
                  <button className="explore-button" onClick={handleNavigate}>
                    Explore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="nav-button next" onClick={handleNext} aria-label="Next">
          ›
        </button>
      </div>

      <div className="gallery-indicators">
        {galleryItems.map((item, index) => (
          <button
            key={item.id}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleSelect(index)}
            aria-label={`Go to ${item.title}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
