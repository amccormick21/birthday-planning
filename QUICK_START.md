# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
npm install
```

### 2. Start Development Server

**Windows:**
```bash
start-dev.bat
```

**Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

Or manually:
```bash
npm run dev
```

### 3. Open Your Browser

Navigate to: `http://localhost:5173/birthday-planning/`

---

## 📝 First Steps After Setup

### 1. Update Content

- **Location Blog**: Edit `src/pages/Location.jsx`
- **Accommodation**: Edit `src/pages/Accommodation.jsx`
- **Walks**: Edit `src/pages/Walks.jsx`

### 2. Replace Placeholder Images

Replace emoji placeholders with real images:

1. Add images to `public/images/` folder
2. Update component code:
   ```jsx
   <img src="/images/your-photo.jpg" alt="Description" />
   ```

### 3. Update Map Coordinates

Find coordinates at [OpenStreetMap](https://www.openstreetmap.org):

```jsx
const position = [latitude, longitude]
```

### 4. Customize Colors

Edit `src/styles/index.css` CSS variables:

```css
:root {
  --primary-color: #4a90e2;
  --secondary-color: #50c878;
  /* ... */
}
```

Or add custom styles to `src/styles/custom.css`

---

## 🌐 Deploy to GitHub Pages

### One-Time Setup

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Update `vite.config.js` if your repo name differs:
   ```javascript
   base: '/your-repo-name/',
   ```
4. Update `src/main.jsx`:
   ```jsx
   <BrowserRouter basename="/your-repo-name">
   ```

### Deploy

Just push to main branch:
```bash
git add .
git commit -m "Your message"
git push origin main
```

The app will automatically deploy to:
`https://amccormick21.github.io/birthday-planning/`

---

## 🗺️ GPX Walking Routes

### Create GPX Files

Use these free tools:

- **GPX Editor**: https://www.gpxeditor.co.uk
- **Komoot**: https://www.komoot.com
- **AllTrails**: https://www.alltrails.com

### Upload to App

1. Go to Walks page
2. Click "Choose GPX File"
3. Select your .gpx file
4. Route appears on map automatically

---

## 🎨 Styling Tips

### Change Gallery Spinner Colors

```css
/* src/styles/Home.css */
.home-container {
  background: linear-gradient(135deg, #your-color1, #your-color2);
}
```

### Modify Button Styles

```css
/* src/styles/custom.css */
.explore-button {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  border-radius: 25px;
}
```

### Add Custom Fonts

```css
/* src/styles/index.css */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
```

---

## ❓ Troubleshooting

### Port Already in Use

Kill the process or use different port:
```bash
npm run dev -- --port 3000
```

### Map Not Loading

- Check internet connection
- Verify Leaflet CSS in `index.html`
- Open browser console for errors

### Build Fails

```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📦 Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Build output goes to `dist/` folder.

---

## 🆘 Need Help?

- Check [README.md](README.md) for detailed documentation
- Review code comments in component files
- Open an issue on GitHub

---

**Happy Coding! 🎉**
