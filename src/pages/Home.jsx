import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

const WELCOME_SHOWN_KEY = 'birthday-welcome-shown'
const DEFAULT_TAB = 'Location'

const spinnerItems = [
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
  },
  {
    id: 4,
    title: 'Over The Years',
    description: 'A journey through memories',
    path: '/gallery',
    icon: '📸'
  }
]

function GetTransform(index, activeIndex) {
  const offset = index - activeIndex

  if (offset === 0) {
    return 0;
  }

  const absOffset = Math.abs(offset)

  const firstTranslate = 0.75; // Base distance to move for each step
  const subsequentTranslate = 0.15; // Additional distance for each subsequent step
  const translateX = firstTranslate + (absOffset * subsequentTranslate);

  return offset < 0 ? -translateX : translateX
}

function Home() {
  const defaultIndex = Math.max(0, spinnerItems.findIndex(item => item.title === DEFAULT_TAB))
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [showWelcome, setShowWelcome] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY)
    if (!hasSeenWelcome) {
      setShowWelcome(true)
      localStorage.setItem(WELCOME_SHOWN_KEY, 'true')
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle keys if welcome modal is open
      if (showWelcome) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + spinnerItems.length) % spinnerItems.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % spinnerItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        navigate(spinnerItems[activeIndex].path)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showWelcome, activeIndex, navigate])

  const handleCloseWelcome = () => {
    setShowWelcome(false)
  }

  const handleShowWelcome = () => {
    setShowWelcome(true)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % spinnerItems.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + spinnerItems.length) % spinnerItems.length)
  }

  const handleSelect = (index) => {
    setActiveIndex(index)
  }

  const handleNavigate = () => {
    navigate(spinnerItems[activeIndex].path)
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Happy Birthday Dad!</h1>
        <p>We&apos;ve planned an adventure... explore the site to find out more</p>
      </header>

      <div className="spinner-spinner" role="region" aria-label="Content navigation">
        <button className="nav-button prev" onClick={handlePrev} aria-label="Previous item">
          ‹
        </button>

        <div className="spinner-content">
          {spinnerItems.map((item, index) => {
            const offset = Math.abs(index - activeIndex)
            const zIndex = spinnerItems.length - offset
            return (
              <div
                key={item.id}
                className={`spinner-item ${index === activeIndex ? 'active' : ''}`}
                onClick={() => index !== activeIndex && handleSelect(index)}
                style={{ 
                  position: `absolute`,
                  left: '50%',
                  top: '50%',
                  width: '600px',
                  height: '400px',
                  marginLeft: '-300px',
                  marginTop: '-200px',
                  transform: `translateX(${GetTransform(index, activeIndex) * 100}%) scale(${index === activeIndex ? 1 : 0.8})`,
                  zIndex: zIndex
                }}
                role="button"
                tabIndex={index === activeIndex ? 0 : -1}
                aria-label={`${item.title}: ${item.description}`}
              >
                <div className="spinner-card">
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
            )
          })}
        </div>

        <button className="nav-button next" onClick={handleNext} aria-label="Next item">
          ›
        </button>
      </div>

      <div className="spinner-indicators">
        {spinnerItems.map((item, index) => (
          <button
            key={item.id}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleSelect(index)}
            aria-label={`Go to ${item.title}`}
          />
        ))}
      </div>

      <footer className="home-footer">
        <button 
          className="footer-link" 
          onClick={handleShowWelcome}
          aria-label="Show welcome message"
        >
          🎁 View Welcome Message
        </button>
      </footer>

      {showWelcome && (
        <div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="welcome-modal">
            <button 
              className="welcome-close" 
              onClick={handleCloseWelcome}
              aria-label="Close welcome message"
            >
              ×
            </button>
            
            <div className="welcome-content">
              <div className="welcome-icon">🎂</div>
              <h2 id="welcome-title">Happy Birthday!</h2>
              
              <p>
                Welcome to your very own birthday adventure planner! We&apos;ve planned you
                a bit of an adventure in the Mendip hills but the exact details are up to you.
              </p>
              
              <p>
                Hidden within these pages are all the detail so far, along with some little
                treats and memories. Have a look around to find out more. There&apos;s opportunities
                to find out more about the surroundings and to add your own touches!
              </p>
              
              <p>
                Have the most fantastic birthday - it&apos;s is going to be a brilliant year ahead!
              </p>
              
              <p>
                Thank you for always being there and for always being Dad. Knowing that you&apos;re always
                there to lean on for support means the world.
              </p>
              
              <p className="welcome-signature">
                With love and best wishes for an amazing year ahead! 🎉
              </p>
            </div>
            
            <button className="welcome-button" onClick={handleCloseWelcome}>
              Read on and explore...
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
