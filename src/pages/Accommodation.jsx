import { useState } from 'react'
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

// Sample images (using emojis as placeholders)
const galleryImages = [
  { id: 1, title: 'Exterior View', emoji: '🏡' },
  { id: 2, title: 'Living Room', emoji: '🛋️' },
  { id: 3, title: 'Bedroom', emoji: '🛏️' },
  { id: 4, title: 'Kitchen', emoji: '🍳' },
  { id: 5, title: 'Garden', emoji: '🌳' },
  { id: 6, title: 'View', emoji: '🌅' }
]

function Accommodation() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  
  // Default coordinates (London - replace with actual location)
  const position = [51.505, -0.09]

  const accommodationDetails = {
    name: 'Accommodation Name',
    address: 'Address to be determined',
    description: `This beautiful accommodation offers everything you need for a comfortable stay. 
    
    Features include:
    • Spacious rooms with modern amenities
    • Fully equipped kitchen
    • Beautiful garden and outdoor space
    • Close to local attractions and transport
    • Peaceful and relaxing atmosphere`,
    amenities: [
      'WiFi',
      'Parking',
      'Kitchen',
      'Garden',
      'Heating',
      'Washer/Dryer'
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
        {/* Image Gallery */}
        <section className="gallery-section">
          <h3>Photo Gallery</h3>
          <div className="main-image">
            <div className="image-placeholder">
              <span className="emoji-large">{galleryImages[selectedImage].emoji}</span>
              <p>{galleryImages[selectedImage].title}</p>
            </div>
          </div>
          <div className="thumbnail-grid">
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <span className="emoji-small">{img.emoji}</span>
              </div>
            ))}
          </div>
          <p className="edit-note">
            💡 Replace emoji placeholders with actual images in <code>src/pages/Accommodation.jsx</code>
          </p>
        </section>

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
          <p className="edit-note">
            💡 Update the coordinates in <code>src/pages/Accommodation.jsx</code> to show the actual location
          </p>
        </section>
      </div>
    </div>
  )
}

export default Accommodation
