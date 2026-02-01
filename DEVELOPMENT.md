# 🔧 Development Guide

## Project Overview

This React application uses:
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **GPXParser** - Route file parsing

## 📁 File Structure

```
src/
├── pages/              # Page components
│   ├── Home.jsx       # Gallery spinner
│   ├── Location.jsx   # Blog page
│   ├── Accommodation.jsx  # Gallery + map
│   └── Walks.jsx      # Routes + GPX
├── styles/            # CSS files
│   ├── index.css      # Global + variables
│   ├── Home.css       # Home page
│   ├── Location.css   # Location page
│   ├── Accommodation.css  # Accommodation
│   ├── Walks.css      # Walks page
│   └── custom.css     # User customizations
├── App.jsx            # Router setup
└── main.jsx           # Entry point
```

## 🎨 CSS Variables

All theme colors and common values are in `src/styles/index.css`:

```css
:root {
  --primary-color: #4a90e2;      /* Links, buttons */
  --secondary-color: #50c878;    /* Accents */
  --accent-color: #f39c12;       /* Highlights */
  --text-color: #333;            /* Body text */
  --background-color: #f5f7fa;   /* Page bg */
  --card-background: #ffffff;    /* Cards/panels */
  --border-color: #e1e8ed;       /* Borders */
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
  --border-radius: 8px;
  --transition: all 0.3s ease;
}
```

## 🧩 Component Structure

### Home Page (Gallery Spinner)

**Key Features:**
- 3D carousel effect
- Navigation buttons
- Dot indicators
- Auto-routing to sections

**Edit:** `src/pages/Home.jsx`

### Location Page (Blog)

**Key Features:**
- Blog post cards
- Icon + content layout
- Responsive design

**Edit:** `src/pages/Location.jsx`

### Accommodation Page

**Key Features:**
- Image gallery with thumbnails
- Interactive map (Leaflet)
- Details sections
- Amenities tags

**Edit:** `src/pages/Accommodation.jsx`

### Walks Page

**Key Features:**
- Sidebar tab selector
- GPX file upload
- Route visualization
- Walk details table

**Edit:** `src/pages/Walks.jsx`

## 🗺️ Working with Maps

### Basic Map Setup

```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

<MapContainer center={[lat, lng]} zoom={13}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; OpenStreetMap contributors'
  />
  <Marker position={[lat, lng]}>
    <Popup>Your text</Popup>
  </Marker>
</MapContainer>
```

### Drawing Routes

```jsx
import { Polyline } from 'react-leaflet'

const route = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.515, -0.11]
]

<Polyline positions={route} color="blue" weight={4} />
```

### Parsing GPX Files

```jsx
import gpxParser from 'gpxparser'

const handleGpxUpload = (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const gpx = new gpxParser()
    gpx.parse(e.target.result)
    
    const points = gpx.tracks[0].points.map(p => 
      [p.lat, p.lon]
    )
    // Use points array for Polyline
  }
  
  reader.readAsText(file)
}
```

## 🎯 Adding New Features

### Add a New Page

1. Create component: `src/pages/NewPage.jsx`
2. Create styles: `src/styles/NewPage.css`
3. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```
4. Add to Home gallery (optional)

### Add New Walk

Edit `src/pages/Walks.jsx`:

```jsx
const walksData = [
  // ... existing walks
  {
    id: 4,
    title: 'New Walk',
    distance: '10 km',
    duration: '3 hours',
    startLocation: 'Start Point',
    difficulty: 'Moderate',
    description: 'Description here',
    photos: ['🏔️', '🌲', '🦌'],
    defaultRoute: [
      [lat1, lng1],
      [lat2, lng2],
      [lat3, lng3]
    ]
  }
]
```

### Customize Gallery Spinner

Edit `src/pages/Home.jsx`:

```jsx
const galleryItems = [
  {
    id: 1,
    title: 'Your Title',
    description: 'Your description',
    path: '/your-route',
    icon: '🎨'
  },
  // Add more items...
]
```

## 📸 Adding Real Images

### Option 1: Public Folder

1. Add images to `public/images/`
2. Reference in components:
   ```jsx
   <img src="/images/photo.jpg" alt="Description" />
   ```

### Option 2: Import Images

1. Add images to `src/assets/images/`
2. Import and use:
   ```jsx
   import photo from '../assets/images/photo.jpg'
   <img src={photo} alt="Description" />
   ```

### Replace Gallery Placeholders

**Accommodation:**
```jsx
// Replace this:
const galleryImages = [
  { id: 1, title: 'View', emoji: '🌅' }
]

// With this:
const galleryImages = [
  { 
    id: 1, 
    title: 'View', 
    src: '/images/view.jpg' 
  }
]

// Update render:
<img src={img.src} alt={img.title} />
```

## 🔄 State Management

### Local State (useState)

Used for:
- Selected gallery item
- Active walk
- GPX route data
- Form inputs

```jsx
const [selectedItem, setSelectedItem] = useState(0)
```

### Router State

Used for:
- Navigation between pages
- URL parameters

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/walks')
```

## 🎨 Styling Best Practices

### Use CSS Variables

```css
/* Good */
.button {
  background: var(--primary-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

/* Avoid hardcoding */
.button {
  background: #4a90e2;
  border-radius: 8px;
  transition: all 0.3s ease;
}
```

### Responsive Design

```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 15px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 30px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## 🧪 Testing Changes

### Development Mode

```bash
npm run dev
```
- Hot reload enabled
- Changes reflect immediately
- Check browser console for errors

### Production Build

```bash
npm run build
npm run preview
```
- Tests production bundle
- Catches build errors
- Verifies optimization

## 📦 Build Configuration

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/birthday-planning/',  // GitHub Pages path
  build: {
    outDir: 'dist',              // Output directory
  },
})
```

### Changing Base Path

For different deployment:
1. Update `vite.config.js` base
2. Update `src/main.jsx` basename
3. Rebuild: `npm run build`

## 🔍 Debugging Tips

### React DevTools

Install browser extension:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### Console Logging

```jsx
// Debug state changes
useEffect(() => {
  console.log('State updated:', selectedWalk)
}, [selectedWalk])
```

### Map Issues

```jsx
// Verify coordinates
console.log('Map center:', position)

// Check GPX parsing
console.log('Parsed route:', gpxRoute)
```

## 🚀 Performance Tips

### Lazy Loading Images

```jsx
<img 
  src={imageSrc} 
  loading="lazy" 
  alt="Description" 
/>
```

### Optimize Maps

```jsx
<MapContainer
  zoom={13}
  scrollWheelZoom={false}  // Prevent accidental zooming
  zoomControl={true}
>
```

## 📚 Resources

### React
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)

### Mapping
- [Leaflet](https://leafletjs.com)
- [React-Leaflet](https://react-leaflet.js.org)
- [OpenStreetMap](https://www.openstreetmap.org)

### Build Tools
- [Vite](https://vitejs.dev)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)

### GPX Tools
- [GPX Editor](https://www.gpxeditor.co.uk)
- [GPX Parser](https://github.com/Luuka/GPXParser.js)

---

**Happy Developing! 🛠️**
