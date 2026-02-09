import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../firebase/AuthContext'
import { db } from '../firebase/config'
import { parseGpxRoute, compressImage, validatePhotos } from '../utils/fileUtils'
import '../styles/UploadWalk.css'

export default function UploadWalk() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    distance: '',
    duration: '',
    startLocation: '',
    difficulty: 'Easy',
    description: ''
  })
  
  const [gpxFile, setGpxFile] = useState(null)
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGpxChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith('.gpx')) {
      setGpxFile(file)
      setError('')
    } else {
      setError('Please upload a valid GPX file')
      setGpxFile(null)
    }
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    
    const validation = validatePhotos(files)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    setPhotos(files)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!gpxFile) {
      setError('Please upload a GPX file')
      return
    }

    if (photos.length === 0) {
      setError('Please upload at least one photo')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Parse GPX route and get raw GPX data
      const route = await parseGpxRoute(gpxFile)
      
      // Compress and convert photos to base64
      const photoBase64Array = []
      for (let i = 0; i < photos.length; i++) {
        const base64 = await compressImage(photos[i])
        photoBase64Array.push(base64)
      }

      // Create walk document with all data stored in Firestore
      await addDoc(collection(db, 'walks'), {
        ...formData,
        route,
        photos: photoBase64Array,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/walks')
      }, 2000)

    } catch (error) {
      console.error('Error uploading walk:', error)
      setError(error.message || 'Failed to upload walk. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <button className="back-button" onClick={() => navigate('/walks')}>
        ← Back to Walks
      </button>

      <div className="upload-card">
        <header className="upload-header">
          <h1>📤 Upload New Walk</h1>
          <p>Share your walking route with others</p>
        </header>

        {success && (
          <div className="success-message">
            ✅ Walk uploaded successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h3>Walk Details</h3>
            
            <div className="form-group">
              <label htmlFor="title">Walk Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Coastal Path Walk"
                required
                disabled={uploading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="distance">Distance *</label>
                <input
                  id="distance"
                  name="distance"
                  type="text"
                  value={formData.distance}
                  onChange={handleInputChange}
                  placeholder="e.g., 5.2 km"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration *</label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.5 hours"
                  required
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="startLocation">Start Location *</label>
              <input
                id="startLocation"
                name="startLocation"
                type="text"
                value={formData.startLocation}
                onChange={handleInputChange}
                placeholder="e.g., Main Beach Car Park"
                required
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                disabled={uploading}
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the walk, highlights, terrain, etc."
                rows="4"
                required
                disabled={uploading}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>GPX Route *</h3>
            <div className="form-group">
              <label htmlFor="gpx-file" className="file-label">
                📁 Choose GPX File
                <input
                  id="gpx-file"
                  type="file"
                  accept=".gpx"
                  onChange={handleGpxChange}
                  required
                  disabled={uploading}
                />
              </label>
              {gpxFile && (
                <p className="file-info">Selected: {gpxFile.name}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Photos * (1-6 images)</h3>
            <div className="form-group">
              <label htmlFor="photos" className="file-label">
                🖼️ Choose Photos
                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  required
                  disabled={uploading}
                />
              </label>
              {photos.length > 0 && (
                <p className="file-info">
                  {photos.length} photo{photos.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Walk'}
          </button>
        </form>
      </div>
    </div>
  )
}
