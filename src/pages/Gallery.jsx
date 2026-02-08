import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Gallery.css'

// Years to display (2016-2026)
const GALLERY_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

function Gallery() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [loadedImages, setLoadedImages] = useState({})
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load gallery data
  useEffect(() => {
    import('../data/gallery-images.json')
      .then((data) => {
        setImages(data.images || [])
        setIsLoading(false)
      })
      .catch(() => {
        // Gallery not built yet - will show placeholder message
        setImages([])
        setIsLoading(false)
      })
  }, [])

  // Group images by year
  const imagesByYear = useMemo(() => {
    return GALLERY_YEARS.reduce((acc, year) => {
      acc[year] = images.filter(img => img.year === year)
      return acc
    }, {})
  }, [images])

  // Track which images have loaded successfully
  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }

  const handleImageError = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: false }))
  }

  const openLightbox = (image) => {
    setSelectedImage(image)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateLightbox = (direction) => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    const newIndex = (currentIndex + direction + images.length) % images.length
    setSelectedImage(images[newIndex])
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
      if (e.key === 'ArrowRight') navigateLightbox(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  return (
    <div className="gallery-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <header className="gallery-header">
        <h1>📸 Over The Years</h1>
        <p>A collection of memories and moments</p>
      </header>

      {isLoading ? (
        <div className="gallery-placeholder">
          <div className="placeholder-icon">⏳</div>
          <h2>Loading Gallery...</h2>
        </div>
      ) : images.length === 0 ? (
        <div className="gallery-placeholder">
          <div className="placeholder-icon">🖼️</div>
          <h2>Photos Coming Soon</h2>
          <p>
            Add images to <code>content/images/</code> and run <code>npm run build:content</code> to populate this gallery.
          </p>
          <div className="placeholder-instructions">
            <h3>How to add photos:</h3>
            <ol>
              <li>Place your images in the <code>content/images/</code> folder</li>
              <li>Optionally create a <code>gallery.json</code> file to add captions and dates</li>
              <li>Run <code>npm run build:content</code> to process the images</li>
              <li>The gallery will automatically display your photos</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="gallery-years">
          {GALLERY_YEARS.map((year) => (
            <div key={year} className="gallery-year-row">
              <h2 className="year-heading">{year}</h2>
              {imagesByYear[year].length === 0 ? (
                <div className="year-empty">
                  <span>No photos yet</span>
                </div>
              ) : (
                <div className="gallery-scroll-row">
                  {imagesByYear[year].map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      className={`gallery-item ${loadedImages[image.id] === false ? 'error' : ''}`}
                      onClick={() => loadedImages[image.id] !== false && openLightbox(image)}
                      aria-label={`View ${image.caption || image.filename}`}
                    >
                      <img
                        src={image.src}
                        alt={image.caption || image.filename}
                        loading="lazy"
                        onLoad={() => handleImageLoad(image.id)}
                        onError={() => handleImageError(image.id)}
                      />
                      {loadedImages[image.id] === false && (
                        <div className="image-error">
                          <span>📷</span>
                          <p>Image not found</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            
            <button 
              className="lightbox-nav lightbox-prev" 
              onClick={() => navigateLightbox(-1)}
              aria-label="Previous image"
            >
              ‹
            </button>

            <div className="lightbox-image-container">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.caption || selectedImage.filename} 
              />
              {(selectedImage.caption || selectedImage.date) && (
                <div className="lightbox-info">
                  {selectedImage.caption && <p>{selectedImage.caption}</p>}
                  {selectedImage.location && <p>{selectedImage.location}</p>}
                  {selectedImage.date && <span>{selectedImage.date}</span>}
                </div>
              )}
            </div>

            <button 
              className="lightbox-nav lightbox-next" 
              onClick={() => navigateLightbox(1)}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
