# 🗺️ Mapping & GPX Resources

## Current Implementation

This project uses:
- **Leaflet** - Open-source JavaScript mapping library
- **React-Leaflet** - React components for Leaflet
- **OpenStreetMap** - Free tile provider
- **GPXParser** - JavaScript GPX file parsing

## 🌍 Map Providers

### 1. OpenStreetMap (Current)

**Pros:**
- ✅ Free and open-source
- ✅ No API key required
- ✅ Good worldwide coverage
- ✅ Community maintained

**Cons:**
- ❌ Basic styling options
- ❌ Limited 3D features

**Implementation:**
```jsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; OpenStreetMap contributors'
/>
```

### 2. Mapbox

**Pros:**
- ✅ Beautiful custom styles
- ✅ 3D terrain support
- ✅ Excellent performance
- ✅ Advanced features

**Cons:**
- ❌ Requires API key
- ❌ Free tier limits (50,000 loads/month)

**Setup:**
```bash
npm install mapbox-gl
npm install react-map-gl
```

**Implementation:**
```jsx
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

<Map
  mapboxAccessToken="YOUR_TOKEN"
  initialViewState={{
    longitude: -0.09,
    latitude: 51.505,
    zoom: 13
  }}
  style={{width: '100%', height: 400}}
  mapStyle="mapbox://styles/mapbox/streets-v12"
/>
```

**Get Token:** https://account.mapbox.com/

### 3. Google Maps

**Pros:**
- ✅ Most detailed data
- ✅ Street View integration
- ✅ Places API
- ✅ Familiar to users

**Cons:**
- ❌ Requires API key and billing
- ❌ More restrictive terms
- ❌ Can be expensive at scale

**Setup:**
```bash
npm install @react-google-maps/api
```

**Implementation:**
```jsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

<LoadScript googleMapsApiKey="YOUR_API_KEY">
  <GoogleMap
    center={{ lat: 51.505, lng: -0.09 }}
    zoom={13}
    mapContainerStyle={{ height: '400px', width: '100%' }}
  >
    <Marker position={{ lat: 51.505, lng: -0.09 }} />
  </GoogleMap>
</LoadScript>
```

**Get API Key:** https://console.cloud.google.com/

### 4. Thunderforest

**Pros:**
- ✅ Specialized outdoor maps
- ✅ Hiking trail emphasis
- ✅ Topographic styles
- ✅ Good for walking routes

**Cons:**
- ❌ Requires API key
- ❌ Free tier limited (150,000 tiles/month)

**Implementation:**
```jsx
<TileLayer
  url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_KEY"
  attribution='Maps © Thunderforest, Data © OpenStreetMap contributors'
/>
```

**Get API Key:** https://www.thunderforest.com/

### 5. Stamen Terrain

**Pros:**
- ✅ Free to use
- ✅ Beautiful terrain visualization
- ✅ No API key needed
- ✅ Good for hiking routes

**Implementation:**
```jsx
<TileLayer
  url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.jpg"
  attribution='&copy; Stamen Design, OpenStreetMap'
/>
```

## 📍 GPX Creation Tools

### 1. GPX Editor (Recommended)

**Website:** https://www.gpxeditor.co.uk

**Features:**
- ✅ Free, browser-based
- ✅ Draw routes on map
- ✅ Download GPX files
- ✅ Edit existing GPX
- ✅ No account required

**How to Use:**
1. Click on map to add points
2. Drag points to adjust route
3. Export as GPX file
4. Upload to your app

### 2. Komoot

**Website:** https://www.komoot.com

**Features:**
- ✅ Route planning with terrain
- ✅ Export GPX files
- ✅ Community routes
- ✅ Mobile app available

**How to Use:**
1. Create free account
2. Plan route on map
3. Click "Export" → "GPX"
4. Upload to your app

### 3. AllTrails

**Website:** https://www.alltrails.com

**Features:**
- ✅ Huge trail database
- ✅ User reviews and photos
- ✅ Download GPX (Pro feature)
- ✅ Mobile app

**Pricing:**
- Free: Browse trails
- Pro ($36/year): Download GPX

### 4. Strava

**Website:** https://www.strava.com

**Features:**
- ✅ Route builder
- ✅ Track activities
- ✅ Export GPX files
- ✅ Social features

**How to Use:**
1. Create free account
2. Use Route Builder
3. Export as GPX
4. Upload to your app

### 5. RideWithGPS

**Website:** https://ridewithgps.com

**Features:**
- ✅ Advanced route planning
- ✅ Elevation profiles
- ✅ Turn-by-turn navigation
- ✅ GPX export

**Pricing:**
- Free: Basic features
- Premium ($8/month): Advanced features

### 6. Garmin Connect

**Website:** https://connect.garmin.com

**Features:**
- ✅ Free to use
- ✅ Course creator
- ✅ Export GPX
- ✅ Works without Garmin device

### 7. Gaia GPS

**Website:** https://www.gaiagps.com

**Features:**
- ✅ Topographic maps
- ✅ Offline support
- ✅ GPX import/export
- ✅ Mobile app

**Pricing:**
- Free: Basic features
- Premium ($20/year): Advanced maps

## 📦 GPX Parsing Libraries

### 1. gpxparser (Current)

```bash
npm install gpxparser
```

**Usage:**
```jsx
import gpxParser from 'gpxparser'

const gpx = new gpxParser()
gpx.parse(gpxString)

// Get coordinates
const points = gpx.tracks[0].points.map(p => [p.lat, p.lon])

// Get metadata
const distance = gpx.tracks[0].distance.total // in meters
const elevation = gpx.tracks[0].elevation // elevation data
```

### 2. togeojson

```bash
npm install @mapbox/togeojson
```

**Usage:**
```jsx
import * as toGeoJSON from '@mapbox/togeojson'

const geojson = toGeoJSON.gpx(xmlDocument)
```

### 3. leaflet-gpx

```bash
npm install leaflet-gpx
```

**Usage:**
```jsx
import 'leaflet-gpx'

L.gpx(gpxData, {
  async: true,
  marker_options: {
    startIconUrl: 'start.png',
    endIconUrl: 'end.png'
  }
}).addTo(map)
```

## 🎯 Recommended Setup by Use Case

### For Basic Walking Routes
- **Maps:** OpenStreetMap (free, simple)
- **GPX Tool:** GPX Editor (browser-based)
- **Parser:** gpxparser (current implementation)

### For Advanced Hiking
- **Maps:** Thunderforest Outdoors
- **GPX Tool:** Komoot or AllTrails
- **Parser:** gpxparser with elevation data

### For Beautiful Presentation
- **Maps:** Mapbox with custom styling
- **GPX Tool:** Any professional tool
- **Parser:** togeojson for GeoJSON features

### For Maximum Detail
- **Maps:** Google Maps
- **GPX Tool:** Strava or RideWithGPS
- **Parser:** gpxparser with full metadata

## 🔧 Implementation Examples

### Switch to Mapbox

1. **Install:**
   ```bash
   npm install mapbox-gl react-map-gl
   ```

2. **Update Walks.jsx:**
   ```jsx
   import Map, { Source, Layer } from 'react-map-gl'
   import 'mapbox-gl/dist/mapbox-gl.css'

   <Map
     mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
     initialViewState={{
       longitude: routeToDisplay[0][1],
       latitude: routeToDisplay[0][0],
       zoom: 13
     }}
     style={{width: '100%', height: '500px'}}
     mapStyle="mapbox://styles/mapbox/outdoors-v12"
   >
     <Source type="geojson" data={routeGeoJSON}>
       <Layer
         type="line"
         paint={{
           'line-color': '#3b82f6',
           'line-width': 4
         }}
       />
     </Source>
   </Map>
   ```

3. **Add to .env:**
   ```
   REACT_APP_MAPBOX_TOKEN=your_token_here
   ```

### Add Elevation Profile

```jsx
// After parsing GPX
const elevationData = gpx.tracks[0].points.map((p, i) => ({
  distance: gpx.tracks[0].distance.cumul[i] / 1000, // km
  elevation: p.ele
}))

// Render with a chart library (e.g., recharts)
```

## 📚 Additional Resources

### Learning
- [Leaflet Tutorials](https://leafletjs.com/examples.html)
- [Mapbox Documentation](https://docs.mapbox.com/)
- [GPX Format Spec](https://www.topografix.com/gpx.asp)

### Communities
- [/r/openstreetmap](https://reddit.com/r/openstreetmap)
- [Stack Overflow - Leaflet](https://stackoverflow.com/questions/tagged/leaflet)
- [Mapbox Community](https://community.mapbox.com/)

### Tools
- [Geojson.io](http://geojson.io/) - GeoJSON editor
- [GPSVisualizer](https://www.gpsvisualizer.com/) - GPX tools
- [OpenRouteService](https://openrouteservice.org/) - Routing API

---

**Happy Mapping! 🗺️**
