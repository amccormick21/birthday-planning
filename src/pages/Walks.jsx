import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
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

// Sample walks data
const walksData = [
  {
    id: 1,
    title: 'Coastal Path Walk',
    distance: '5.2 km',
    duration: '1.5 hours',
    startLocation: 'Main Beach Car Park',
    difficulty: 'Easy',
    description: 'A beautiful coastal walk with stunning sea views.',
    photos: ['🌊', '🏖️', '⛰️'],
    defaultRoute: [
      [51.505, -0.09],
      [51.51, -0.1],
      [51.515, -0.095]
    ]
  },
  {
    id: 2,
    title: 'Forest Trail',
    distance: '8.5 km',
    duration: '2.5 hours',
    startLocation: 'Forest Visitor Centre',
    difficulty: 'Moderate',
    description: 'Explore ancient woodland and wildlife habitats.',
    photos: ['🌲', '🦊', '🍄'],
    defaultRoute: [
      [51.52, -0.12],
      [51.525, -0.115],
      [51.53, -0.125]
    ]
  },
  {
    id: 3,
    title: 'Mountain Summit',
    distance: '12.3 km',
    duration: '4 hours',
    startLocation: 'Mountain Base Station',
    difficulty: 'Challenging',
    description: 'Challenging climb with panoramic views from the summit.',
    photos: ['⛰️', '🥾', '☁️'],
    defaultRoute: [
      [51.54, -0.14],
      [51.545, -0.135],
      [51.55, -0.145]
    ]
  }
]

function Walks() {
  const navigate = useNavigate()
  const [selectedWalk, setSelectedWalk] = useState(walksData[0])
  const [gpxRoute, setGpxRoute] = useState(null)
  const [uploadError, setUploadError] = useState('')

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

  const routeToDisplay = gpxRoute || selectedWalk.defaultRoute
  const mapCenter = routeToDisplay[0]

  return (
    <div className="walks-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

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
              className={`walk-tab ${selectedWalk.id === walk.id ? 'active' : ''}`}
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
          <div className="walk-details">
            <h2>{selectedWalk.title}</h2>
            <p className="walk-description">{selectedWalk.description}</p>

            {/* Photos */}
            <div className="walk-photos">
              {selectedWalk.photos.map((photo, index) => (
                <div key={index} className="photo-placeholder">
                  <span className="emoji-photo">{photo}</span>
                </div>
              ))}
            </div>
            <p className="edit-note">
              💡 Replace emoji placeholders with actual photos
            </p>

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

            <div className="map-providers-info">
              <h4>📚 Recommended Mapping & GPX Resources:</h4>
              <ul>
                <li><strong>Leaflet</strong> - Open-source mapping library (currently used)</li>
                <li><strong>Mapbox GL JS</strong> - Advanced styling and 3D terrain</li>
                <li><strong>GPX Editor</strong> - Create routes at <a href="https://www.gpxeditor.co.uk" target="_blank" rel="noopener noreferrer">gpxeditor.co.uk</a></li>
                <li><strong>AllTrails</strong> - Download GPX files from popular trails</li>
                <li><strong>Komoot</strong> - Plan routes and export as GPX</li>
                <li><strong>Strava</strong> - Track and export your own walks</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Walks
