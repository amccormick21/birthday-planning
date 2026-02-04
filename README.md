# 🎉 Birthday Planning Web App

A beautiful, interactive React web application for planning birthday celebrations, featuring location guides, accommodation details, and walking route planners with GPX support.

## 📚 Documentation

- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - 🔥 Complete Firebase authentication & database setup (no Storage required!)
- **[STORAGE_ALTERNATIVE.md](STORAGE_ALTERNATIVE.md)** - 🗄️ How we store images in Firestore (no Storage needed)
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Complete setup and usage guide
- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 easy steps
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete developer guide with code examples
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment checklist and troubleshooting
- **[MAPPING_RESOURCES.md](MAPPING_RESOURCES.md)** - Map providers and GPX tools guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and statistics

## 🌟 Features

- **Interactive Home Page**: Gallery-style spinner showcasing three main sections
- **Location Guide**: Blog-style page with destination information
- **Accommodation Details**: Image gallery, interactive map, and comprehensive accommodation information
- **Walks & Trails**: Advanced route planner with:
  - User authentication (Firebase)
  - Walk upload with photos and GPX files
  - Multiple walk profiles
  - GPX file upload and visualization
  - Interactive maps using Leaflet
  - Distance, duration, and difficulty information
  - Photo galleries for each walk
- **Firestore-Only Storage**: Images and GPX data stored directly in database (no Storage service needed!)
  - Works with free Firebase tier
  - Automatic image compression
  - Perfect for personal projects

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amccormick21/birthday-planning.git
   cd birthday-planning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** 🔥
   
   For authentication and user uploads, set up Firebase:
   
   a. **Create `.env.local` file**:
   ```bash
   cp .env.example .env.local
   ```
   
   b. **Add your Firebase configuration** to `.env.local` (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for details)
   
   c. **For production**: Add Firebase config to [GitHub Secrets](https://github.com/amccormick21/birthday-planning/settings/secrets/actions)
   
   See complete Firebase setup guide: **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the app.

## 📝 Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🎨 Customization Guide

### Editing Content

#### Home Page
Edit [src/pages/Home.jsx](src/pages/Home.jsx) to modify the gallery items and navigation.

#### Location Blog
Edit [src/pages/Location.jsx](src/pages/Location.jsx) to add or modify blog posts about the destination.

#### Accommodation
Edit [src/pages/Accommodation.jsx](src/pages/Accommodation.jsx) to:
- Update accommodation details
- Change map coordinates
- Replace emoji placeholders with actual images
- Modify amenities list

#### Walks
Edit [src/pages/Walks.jsx](src/pages/Walks.jsx) to:
- Add or modify walk profiles
- Change route coordinates
- Update walk details (distance, duration, etc.)
- Replace emoji photo placeholders with actual images

### Styling

All CSS variables are defined in [src/styles/index.css](src/styles/index.css). You can customize:

```css
:root {
  --primary-color: #4a90e2;      /* Main brand color */
  --secondary-color: #50c878;    /* Accent color */
  --accent-color: #f39c12;       /* Highlight color */
  --text-color: #333;            /* Default text */
  --background-color: #f5f7fa;   /* Page background */
  --card-background: #ffffff;    /* Card/section background */
  /* ... and more */
}
```

Individual page styles can be found in:
- [src/styles/Home.css](src/styles/Home.css)
- [src/styles/Location.css](src/styles/Location.css)
- [src/styles/Accommodation.css](src/styles/Accommodation.css)
- [src/styles/Walks.css](src/styles/Walks.css)

### Adding Images

Replace emoji placeholders with actual images:

1. Create a `public/images` folder in the project root
2. Add your images to this folder
3. Update the component code to reference the images:

```jsx
// Instead of emoji:
<img src="/images/your-image.jpg" alt="Description" />
```

### Updating Maps

To change map locations:

1. Get coordinates from [OpenStreetMap](https://www.openstreetmap.org) or [Google Maps](https://maps.google.com)
2. Update the `position` array in the component:

```jsx
const position = [latitude, longitude]
```

### Adding GPX Files

To add walking routes:

1. Create GPX files using tools like:
   - [GPX Editor](https://www.gpxeditor.co.uk)
   - [Komoot](https://www.komoot.com)
   - [AllTrails](https://www.alltrails.com)
   - [Strava](https://www.strava.com)

2. Upload GPX files using the upload button on the Walks page
3. The route will be automatically plotted on the map

## 🗺️ Map & GPX Libraries

This project uses:

- **Leaflet** - Open-source JavaScript library for interactive maps
- **React-Leaflet** - React components for Leaflet maps
- **gpxparser** - JavaScript library for parsing GPX files

### Alternative Mapping Solutions

If you want more advanced mapping features, consider:

- **Mapbox GL JS** - Advanced styling, 3D terrain, custom layers
- **Google Maps API** - Comprehensive mapping with Places API
- **OpenLayers** - Powerful open-source mapping library

## 📦 Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

2. **Update Repository Name**
   
   If your repository name is different from "birthday-planning", update the base path in two files:

   **vite.config.js**:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ...
   })
   ```

   **src/main.jsx**:
   ```jsx
   <BrowserRouter basename="/your-repo-name">
   ```

3. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Automatic Deployment**
   
   The GitHub Actions workflow will automatically:
   - Build your application
   - Deploy to GitHub Pages
   - Make it available at `https://amccormick21.github.io/birthday-planning/`

### Manual Deployment

If you need to trigger a deployment manually:
1. Go to the "Actions" tab in your GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## 🛠️ Technology Stack

- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Leaflet** - Interactive mapping
- **GPXParser** - GPX file parsing
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting

## 📂 Project Structure

```
birthday-planning/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── public/                      # Static assets
├── src/
│   ├── pages/
│   │   ├── Home.jsx            # Homepage with gallery spinner
│   │   ├── Location.jsx        # Location blog page
│   │   ├── Accommodation.jsx   # Accommodation details
│   │   └── Walks.jsx           # Walks with GPX support
│   ├── styles/
│   │   ├── index.css           # Global styles and CSS variables
│   │   ├── App.css             # App component styles
│   │   ├── Home.css            # Home page styles
│   │   ├── Location.css        # Location page styles
│   │   ├── Accommodation.css   # Accommodation page styles
│   │   └── Walks.css           # Walks page styles
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # Application entry point
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🔧 Troubleshooting

### Development server won't start
- Ensure Node.js version 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Map not displaying
- Check browser console for errors
- Ensure internet connection (maps load from CDN)
- Verify Leaflet CSS is loaded in `index.html`

### GPX upload not working
- Verify file is valid GPX format
- Check file contains track data (not just waypoints)
- Test with sample GPX from [GPX Editor](https://www.gpxeditor.co.uk)

### GitHub Pages deployment fails
- Verify repository name matches `base` in `vite.config.js`
- Check GitHub Actions logs for specific errors
- Ensure GitHub Pages is enabled in repository settings

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and customize it for your own events!

## 📧 Contact

For questions or suggestions, please open an issue in the GitHub repository.

---

**Happy Planning! 🎂**
