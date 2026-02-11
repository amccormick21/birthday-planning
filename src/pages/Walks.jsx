import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useAuth } from '../firebase/AuthContext'
import { db } from '../firebase/config'
import gpxParser from 'gpxparser'
import 'leaflet/dist/leaflet.css'
import '../styles/Walks.css'

// Fix for default marker icon
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function Walks() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [walksData, setWalksData] = useState([])
  const [selectedWalk, setSelectedWalk] = useState(null)
  const [gpxRoute, setGpxRoute] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch walks from Firestore
  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const walksQuery = query(
          collection(db, 'walks'),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(walksQuery)
        const walks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setWalksData(walks)
        if (walks.length > 0) {
          setSelectedWalk(walks[0])
        }
      } catch (error) {
        console.error('Error fetching walks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalks()
  }, [])

  const handleGpxUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.gpx')) {
      setUploadError('Please upload a valid GPX file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const gpx = new gpxParser()
        gpx.parse(e.target.result)
        
        if (gpx.tracks.length > 0) {
          const points = gpx.tracks[0].points.map(point => [point.lat, point.lon])
          setGpxRoute(points)
          setUploadError('')
        } else {
          setUploadError('No track data found in GPX file')
        }
      } catch (error) {
        setUploadError('Error parsing GPX file: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  const clearGpxRoute = () => {
    setGpxRoute(null)
    setUploadError('')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Convert route to array format for Leaflet (handles both object and array formats)
  const convertRouteForLeaflet = (route) => {
    if (!route || route.length === 0) return null
    
    // Check if route is in object format {lat, lng} or array format [lat, lng]
    if (route[0].lat !== undefined && route[0].lng !== undefined) {
      // Convert objects to arrays for Leaflet
      return route.map(point => [point.lat, point.lng])
    }
    
    // Already in array format
    return route
  }

  const rawRoute = gpxRoute || (selectedWalk?.route || selectedWalk?.defaultRoute)
  const routeToDisplay = convertRouteForLeaflet(rawRoute)
  const mapCenter = routeToDisplay?.[0] || [51.505, -0.09]

  if (loading) {
    return (
      <div className="walks-container">
        <div className="loading-message">Loading walks...</div>
      </div>
    )
  }

  if (walksData.length === 0) {
    return (
      <div className="walks-container">
        <div className="walks-header-bar">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        <header className="walks-header">
          <h1>🥾 Walks & Trails</h1>
          <p>Routes, plans, and photos can be uploaded here - and will be, as trail runs are added to the list</p>
        </header>

        <div className="empty-state">
          <h2>No walks yet</h2>
          <p>Be the first to upload a walking route!</p>
          <button 
            className="upload-walk-button"
            onClick={() => navigate('/upload-walk')}
          >
            📤 Upload Your First Walk
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="walks-container">
      <div className="walks-header-bar">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="header-buttons">
          <button 
            className="upload-walk-button"
            onClick={() => navigate('/upload-walk')}
          >
            📤 Upload Walk
          </button>
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <header className="walks-header">
        <h1>🥾 Walks & Trails</h1>
        <p>Discover beautiful walking routes</p>
      </header>

      <div className="walks-content">
        {/* Sidebar with walk list */}
        <aside className="walks-sidebar">
          <h3>Select a Walk</h3>
          {walksData.map((walk) => (
            <button
              key={walk.id}
              className={`walk-tab ${selectedWalk?.id === walk.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedWalk(walk)
                setGpxRoute(null)
                setUploadError('')
              }}
            >
              <h4>{walk.title}</h4>
              <span className="difficulty-badge">{walk.difficulty}</span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="walks-main">
          {selectedWalk && (
          <div className="walk-details">
            <h2>{selectedWalk.title}</h2>
            <p className="walk-description">{selectedWalk.description}</p>

            {/* Photos */}
            <div className="walk-photos">
              {selectedWalk.photos && selectedWalk.photos.length > 0 ? (
                selectedWalk.photos.map((photo, index) => (
                  <div key={index} className="photo-container">
                    <img 
                      src={photo} 
                      alt={`${selectedWalk.title} - Photo ${index + 1}`}
                      className="walk-photo"
                    />
                  </div>
                ))
              ) : (
                <p className="no-photos">No photos available</p>
              )}
            </div>

            {/* Walk Info Table */}
            <table className="walk-info-table">
              <thead>
                <tr>
                  <th>Distance</th>
                  <th>Duration</th>
                  <th>Start Location</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedWalk.distance}</td>
                  <td>{selectedWalk.duration}</td>
                  <td>{selectedWalk.startLocation}</td>
                  <td>
                    <span className={`difficulty-badge ${selectedWalk.difficulty.toLowerCase()}`}>
                      {selectedWalk.difficulty}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* GPX Upload */}
            <div className="gpx-upload-section">
              <h3>Upload Custom Route</h3>
              <div className="upload-controls">
                <label htmlFor="gpx-upload" className="upload-button">
                  📁 Choose GPX File
                  <input
                    id="gpx-upload"
                    type="file"
                    accept=".gpx"
                    onChange={handleGpxUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {gpxRoute && (
                  <button className="clear-button" onClick={clearGpxRoute}>
                    Clear Route
                  </button>
                )}
              </div>
              {uploadError && <p className="error-message">{uploadError}</p>}
              {gpxRoute && <p className="success-message">✅ GPX route loaded successfully!</p>}
            </div>

            {/* Map */}
            <div className="walk-map">
              <h3>Route Map</h3>
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '500px', width: '100%' }}
                key={`${selectedWalk.id}-${gpxRoute ? 'gpx' : 'default'}`}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={routeToDisplay} color="blue" weight={4} />
                <Marker position={routeToDisplay[0]}>
                  <Popup>Start: {selectedWalk.startLocation}</Popup>
                </Marker>
                <Marker position={routeToDisplay[routeToDisplay.length - 1]}>
                  <Popup>End Point</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Walks
