import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/Accommodation.css'

// Fix for default marker icon in react-leaflet
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

function Accommodation() {
  const navigate = useNavigate()
  
  // Default coordinates (London - replace with actual location)
  const position = [51.27368, -2.59226]

  const accommodationDetails = {
    name: 'Somewhere in the Mendip Hills',
    address: 'To be arranged...',
    description: `A beautiful cottage to stay in, with walks from the door and great pubs, restaurants, and scenery only moments away.
    
    Features include:
    • Walks from the front door
    • Your home away from home
    • Space to get the maps out on the floor
    • Unblemished kerb appeal
    • Local stone circles`,
    amenities: [
      'Roof',
      'Bed',
      'Possibly another bed',
      'Almost certianly a hairdryer',
      'Doorbell',
      'Four walls',
      'A floor (for maps)',
    ],
    checkIn: 'To be determined',
    checkOut: 'To be determined'
  }

  return (
    <div className="accommodation-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <header className="accommodation-header">
        <h1>🏠 Accommodation</h1>
        <h2>{accommodationDetails.name}</h2>
      </header>

      <div className="accommodation-content">

        {/* Details */}
        <section className="details-section">
          <h3>Details</h3>
          <div className="detail-item">
            <strong>Address:</strong>
            <p>{accommodationDetails.address}</p>
          </div>
          <div className="detail-item">
            <strong>Description:</strong>
            <p style={{ whiteSpace: 'pre-line' }}>{accommodationDetails.description}</p>
          </div>
          <div className="detail-item">
            <strong>Amenities:</strong>
            <div className="amenities-list">
              {accommodationDetails.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Check-in:</strong>
              <p>{accommodationDetails.checkIn}</p>
            </div>
            <div className="detail-item">
              <strong>Check-out:</strong>
              <p>{accommodationDetails.checkOut}</p>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="map-section">
          <h3>Location Map</h3>
          <div className="map-container">
            <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
              <TileLayer
                zoom={13}
                center={position}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  {accommodationDetails.name}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Accommodation
