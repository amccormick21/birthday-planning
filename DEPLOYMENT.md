# 🚀 Deployment Checklist

Use this checklist before deploying to GitHub Pages.

## ✅ Pre-Deployment Checklist

### 1. Content Review

- [ ] All placeholder content replaced with real information
- [ ] Location blog posts updated with destination details
- [ ] Accommodation details filled in (name, address, amenities)
- [ ] Walk routes configured with correct coordinates
- [ ] All emoji placeholders replaced with real images (optional)

### 2. Configuration Check

- [ ] Repository name matches `base` in `vite.config.js`
- [ ] Repository name matches `basename` in `src/main.jsx`
- [ ] Map coordinates updated for Location/Accommodation
- [ ] Walk route coordinates updated

### 3. Visual Check

- [ ] Test on Chrome/Edge
- [ ] Test on Firefox
- [ ] Test on Safari (if available)
- [ ] Test on mobile viewport (DevTools)
- [ ] Check all navigation links work
- [ ] Verify maps display correctly
- [ ] Test GPX upload functionality

### 4. Build Test

- [ ] Run `npm run build` successfully
- [ ] Run `npm run preview` and test locally
- [ ] No console errors in production build
- [ ] All routes accessible in production mode

### 5. GitHub Setup

- [ ] Repository created on GitHub
- [ ] Code pushed to main/master branch
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Source set to "GitHub Actions"

## 📝 Step-by-Step Deployment

### 1. Verify Repository Name

Check your GitHub repository URL:
```
https://github.com/amccormick21/birthday-planning
                    ^^^^^^^^^^^   ^^^^^^^^^^^^^^^^
                    owner         repo-name
```

### 2. Update Configuration Files

If repo name is different from "birthday-planning", update:

**vite.config.js:**
```javascript
base: '/your-repo-name/',
```

**src/main.jsx:**
```jsx
<BrowserRouter basename="/your-repo-name">
```

### 3. Test Build Locally

```bash
npm run build
npm run preview
```

Visit: `http://localhost:4173/your-repo-name/`

### 4. Commit and Push

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 5. Monitor Deployment

1. Go to GitHub repository
2. Click "Actions" tab
3. Watch "Deploy to GitHub Pages" workflow
4. Wait for green checkmark ✅

### 6. Access Your Site

Visit: `https://amccormick21.github.io/birthday-planning/`

## 🔧 Troubleshooting Deployment

### Issue: 404 Page Not Found

**Cause:** Incorrect base path configuration

**Fix:**
1. Verify repo name in `vite.config.js` base
2. Verify repo name in `src/main.jsx` basename
3. Rebuild and redeploy

### Issue: Blank Page

**Cause:** Missing base path or routing issue

**Fix:**
1. Check browser console for errors
2. Verify `<BrowserRouter basename>` matches repo name
3. Check GitHub Pages is enabled

### Issue: Maps Not Loading

**Cause:** Missing Leaflet CSS or network issues

**Fix:**
1. Verify Leaflet CSS link in `index.html`
2. Check browser console for blocked requests
3. Ensure HTTPS (GitHub Pages uses HTTPS)

### Issue: Workflow Failed

**Cause:** Build errors or permission issues

**Fix:**
1. Check Actions tab for error details
2. Verify `package.json` scripts are correct
3. Check if GitHub Pages is enabled
4. Verify workflow file syntax

## 📊 Post-Deployment Verification

### Check These Pages:

- [ ] Home page loads and spinner works
- [ ] Location page displays blog posts
- [ ] Accommodation page shows gallery and map
- [ ] Walks page loads with sidebar navigation
- [ ] GPX upload button appears
- [ ] Maps display correctly on all pages
- [ ] Back buttons work
- [ ] Navigation between pages works
- [ ] Mobile responsive design works

### Test Functionality:

- [ ] Gallery spinner navigation (prev/next)
- [ ] Dot indicator selection
- [ ] Walk tab switching
- [ ] Accommodation image gallery
- [ ] Map markers clickable
- [ ] All external links open

## 🔄 Updating Deployed Site

### Make Changes Locally

1. Edit files in your local workspace
2. Test with `npm run dev`
3. Verify with `npm run build && npm run preview`

### Deploy Updates

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

The site updates automatically in 1-2 minutes.

## 🎯 Custom Domain (Optional)

To use a custom domain:

1. Add file `public/CNAME` with your domain:
   ```
   yourdomain.com
   ```

2. Update DNS settings at your domain registrar:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

3. Update `vite.config.js`:
   ```javascript
   base: '/',  // Root path for custom domain
   ```

4. Update `src/main.jsx`:
   ```jsx
   <BrowserRouter basename="/">
   ```

5. Rebuild and push changes

## 📈 Analytics (Optional)

Add Google Analytics by adding to `index.html`:

```html
<head>
  <!-- ... existing tags ... -->
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
</head>
```

## 🎉 Deployment Complete!

Share your site:
- URL: `https://amccormick21.github.io/birthday-planning/`
- QR Code: Generate at [qr-code-generator.com](https://www.qr-code-generator.com/)

---

## 📞 Need Help?

- Check [README.md](README.md) for documentation
- Review GitHub Actions logs for errors
- Open an issue on GitHub
- Check Vite documentation for build issues

**Good luck with your deployment! 🚀**
