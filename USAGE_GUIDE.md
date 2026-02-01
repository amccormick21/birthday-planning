# 🎯 Complete Setup & Usage Guide

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Running Locally](#running-locally)
3. [Customizing Content](#customizing-content)
4. [Adding Images](#adding-images)
5. [Working with Maps](#working-with-maps)
6. [GPX Routes](#gpx-routes)
7. [Styling](#styling)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)
- Git
- Code editor (VS Code recommended)

### Installation

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual:**
```bash
npm install
```

This installs all dependencies including:
- React 18
- React Router
- Leaflet & React-Leaflet
- GPX Parser
- Vite

---

## 💻 Running Locally

### Start Development Server

**Windows:**
```bash
start-dev.bat
```

**Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Manual:**
```bash
npm run dev
```

### Access the App
Open browser to: `http://localhost:5173/birthday-planning/`

### Other Commands

```bash
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Check code quality
```

---

## ✏️ Customizing Content

### Home Page

**File:** `src/pages/Home.jsx`

Edit the `galleryItems` array:

```jsx
const galleryItems = [
  {
    id: 1,
    title: 'Your Title',
    description: 'Your description',
    path: '/your-route',
    icon: '🎨'  // Any emoji or change to image
  },
  // Add more items...
]
```

### Location Blog Posts

**File:** `src/pages/Location.jsx`

Edit the `blogPosts` array:

```jsx
const blogPosts = [
  {
    id: 1,
    title: 'Your Post Title',
    date: 'February 2026',
    content: `Your blog content here.
    Use multiple lines.
    Add bullet points with •`,
    image: '🌄'  // Emoji or image path
  },
  // Add more posts...
]
```

### Accommodation Details

**File:** `src/pages/Accommodation.jsx`

1. **Update details:**
```jsx
const accommodationDetails = {
  name: 'Your Accommodation Name',
  address: 'Full Address',
  description: `Detailed description...`,
  amenities: ['WiFi', 'Parking', 'Kitchen'],
  checkIn: '3:00 PM',
  checkOut: '11:00 AM'
}
```

2. **Change map location:**
```jsx
const position = [latitude, longitude]  // e.g., [51.505, -0.09]
```

### Walking Routes

**File:** `src/pages/Walks.jsx`

Add or edit walks in the `walksData` array:

```jsx
{
  id: 1,
  title: 'Walk Name',
  distance: '5.2 km',
  duration: '1.5 hours',
  startLocation: 'Starting Point',
  difficulty: 'Easy',  // Easy, Moderate, or Challenging
  description: 'Walk description',
  photos: ['🌊', '🏖️', '⛰️'],  // Replace with image paths
  defaultRoute: [
    [lat1, lng1],
    [lat2, lng2],
    [lat3, lng3]
  ]
}
```

---

## 🖼️ Adding Images

### Method 1: Public Folder (Recommended)

1. Create folder structure:
```
public/
  images/
    location/
    accommodation/
    walks/
```

2. Add your images to appropriate folders

3. Reference in components:
```jsx
<img src="/images/accommodation/photo1.jpg" alt="Description" />
```

### Method 2: Import Assets

1. Create folder:
```
src/
  assets/
    images/
```

2. Import in component:
```jsx
import photo from '../assets/images/photo.jpg'
<img src={photo} alt="Description" />
```

### Replace Emoji Placeholders

**Accommodation Gallery:**

```jsx
// Before:
const galleryImages = [
  { id: 1, title: 'View', emoji: '🌅' }
]

// After:
const galleryImages = [
  { id: 1, title: 'View', src: '/images/accommodation/view.jpg' }
]

// Update JSX:
<img src={img.src} alt={img.title} />
```

**Walk Photos:**

```jsx
// Before:
photos: ['🌊', '🏖️']

// After:
photos: ['/images/walks/beach1.jpg', '/images/walks/beach2.jpg']

// Update JSX:
<img src={photo} alt={`Photo ${index + 1}`} />
```

---

## 🗺️ Working with Maps

### Get Coordinates

1. Visit [OpenStreetMap](https://www.openstreetmap.org)
2. Right-click on location
3. Select "Show address"
4. Copy latitude and longitude

### Update Map Center

```jsx
const position = [51.505, -0.09]  // [latitude, longitude]

<MapContainer center={position} zoom={13}>
```

### Adjust Zoom Level

- `zoom={10}` - City level
- `zoom={13}` - Neighborhood (default)
- `zoom={15}` - Street level
- `zoom={18}` - Building level

### Add Multiple Markers

```jsx
const markers = [
  { pos: [51.505, -0.09], name: 'Location 1' },
  { pos: [51.51, -0.1], name: 'Location 2' }
]

{markers.map((marker, i) => (
  <Marker key={i} position={marker.pos}>
    <Popup>{marker.name}</Popup>
  </Marker>
))}
```

### Change Map Style

Replace OpenStreetMap with other providers:

**Thunderforest Outdoors:**
```jsx
<TileLayer
  url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_KEY"
  attribution='Maps © Thunderforest'
/>
```

**Stamen Terrain:**
```jsx
<TileLayer
  url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.jpg"
  attribution='© Stamen Design'
/>
```

See [MAPPING_RESOURCES.md](MAPPING_RESOURCES.md) for more options.

---

## 🥾 GPX Routes

### Create GPX Files

**Recommended Tools:**

1. **GPX Editor** (Free, browser-based)
   - Visit: https://www.gpxeditor.co.uk
   - Click on map to add points
   - Export as GPX

2. **Komoot** (Free account)
   - Visit: https://www.komoot.com
   - Plan route
   - Export GPX

3. **AllTrails** (Pro subscription)
   - Download from existing trails

### Upload to App

1. Navigate to Walks page
2. Select a walk
3. Click "Choose GPX File"
4. Select your .gpx file
5. Route displays automatically

### Programmatic Route

Add default routes in `src/pages/Walks.jsx`:

```jsx
defaultRoute: [
  [51.505, -0.09],   // Start
  [51.51, -0.1],     // Waypoint 1
  [51.515, -0.095],  // Waypoint 2
  [51.52, -0.11]     // End
]
```

### Customize Route Appearance

```jsx
<Polyline 
  positions={routeToDisplay} 
  color="blue"      // Change color
  weight={4}        // Line thickness
  opacity={0.8}     // Transparency
/>
```

---

## 🎨 Styling

### Change Colors

**File:** `src/styles/index.css`

```css
:root {
  --primary-color: #4a90e2;      /* Blue - buttons, links */
  --secondary-color: #50c878;    /* Green - accents */
  --accent-color: #f39c12;       /* Orange - highlights */
  --text-color: #333;            /* Dark gray - text */
  --background-color: #f5f7fa;   /* Light gray - page bg */
  --card-background: #ffffff;    /* White - cards */
}
```

### Custom CSS

**File:** `src/styles/custom.css`

Add your own styles without modifying core files:

```css
/* Change button style */
.explore-button {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  border-radius: 50px;
  font-size: 1.2rem;
}

/* Modify card hover effect */
.gallery-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* Custom animation */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.walk-tab:hover {
  animation: pulse 0.5s ease-in-out;
}
```

### Change Fonts

```css
/* Add to src/styles/index.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
```

### Modify Home Page Gradient

**File:** `src/styles/Home.css`

```css
.home-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Try: */
  /* background: linear-gradient(135deg, #ff6b6b, #feca57); */
  /* background: linear-gradient(135deg, #11998e, #38ef7d); */
}
```

---

## 🚀 Deployment

### GitHub Pages Setup

1. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages
   - Source: Select "GitHub Actions"

2. **Verify Configuration:**

   Check `vite.config.js`:
   ```javascript
   base: '/birthday-planning/',  // Must match repo name
   ```

   Check `src/main.jsx`:
   ```jsx
   <BrowserRouter basename="/birthday-planning">
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Access:**
   Visit: `https://amccormick21.github.io/birthday-planning/`

### Different Repository Name

If your repo name differs from "birthday-planning":

1. Update `vite.config.js`:
   ```javascript
   base: '/your-repo-name/',
   ```

2. Update `src/main.jsx`:
   ```jsx
   <BrowserRouter basename="/your-repo-name">
   ```

3. Rebuild and push:
   ```bash
   npm run build
   git add .
   git commit -m "Update base path"
   git push origin main
   ```

### Monitor Deployment

1. Go to GitHub repository
2. Click "Actions" tab
3. Watch workflow progress
4. Wait for ✅ checkmark

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed checklist.

---

## 🔧 Troubleshooting

### Dev Server Won't Start

**Issue:** Port already in use

**Fix:**
```bash
npm run dev -- --port 3000
```

### Blank Page After Deployment

**Issue:** Incorrect base path

**Fix:**
1. Check `vite.config.js` base matches repo name
2. Check `src/main.jsx` basename matches
3. Rebuild: `npm run build`
4. Push changes

### Maps Not Loading

**Issue:** Missing Leaflet CSS

**Fix:** Verify in `index.html`:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

**Issue:** Network blocked

**Fix:** Check browser console, disable ad blockers

### GPX Upload Not Working

**Issue:** Invalid file format

**Fix:**
- Ensure file extension is .gpx
- Test file at https://www.gpsvisualizer.com/
- Try creating new file with GPX Editor

**Issue:** No tracks in file

**Fix:**
- File must contain `<trk>` elements
- Waypoint-only files won't work
- Convert waypoints to track

### Build Fails

**Fix:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Images Not Showing

**Issue:** Wrong path

**Fix:**
- For public folder: Use `/images/photo.jpg`
- For src assets: Import first
- Check file names (case-sensitive)

### Styles Not Applied

**Issue:** CSS not imported

**Fix:** Check imports in `main.jsx`:
```jsx
import './styles/index.css'
```

**Issue:** Cached styles

**Fix:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

---

## 📚 Additional Resources

- [README.md](README.md) - Full documentation
- [QUICK_START.md](QUICK_START.md) - 3-step setup
- [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [MAPPING_RESOURCES.md](MAPPING_RESOURCES.md) - Map & GPX tools
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview

---

## 🆘 Still Need Help?

1. Check all documentation files
2. Review GitHub Actions logs
3. Check browser console for errors
4. Search GitHub issues
5. Open new issue with details

---

**Happy Planning! 🎉**
