# 🔥 Firebase Setup Guide

This guide will walk you through setting up Firebase for authentication, database, and storage.

## 📋 Prerequisites

- Google account
- Project code from this repository
- Node.js and npm installed

## 🚀 Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `birthday-planning` (or your choice)
   - Click "Continue"

3. **Google Analytics** (Optional)
   - Enable or disable Google Analytics (optional for this project)
   - Click "Create project"
   - Wait for project creation (takes ~30 seconds)

## 🌐 Step 2: Register Web App & Add to GitHub Secrets

1. **Add Web App**
   - In project overview, click the **web icon** (`</>`)
   - Enter app nickname: `birthday-planning-web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Configuration Values**
   - You'll see Firebase SDK configuration code
   - **IMPORTANT**: Keep this page open, you'll need these values
   - The configuration looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

3. **Add Firebase Config to GitHub Secrets** 🔐
   - Go to your GitHub repository: https://github.com/amccormick21/birthday-planning
   - Click **Settings** (top menu)
   - In left sidebar, click **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add each Firebase config value as a separate secret:

   | Secret Name | Value from Firebase |
   |-------------|---------------------|
   | `VITE_FIREBASE_API_KEY` | Copy the `apiKey` value |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Copy the `authDomain` value |
   | `VITE_FIREBASE_PROJECT_ID` | Copy the `projectId` value |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Copy the `storageBucket` value |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Copy the `messagingSenderId` value |
   | `VITE_FIREBASE_APP_ID` | Copy the `appId` value |

   - For each secret:
     1. Click **New repository secret**
     2. Enter the **Name** (e.g., `VITE_FIREBASE_API_KEY`)
     3. Paste the **Value** from Firebase
     4. Click **Add secret**
     5. Repeat for all 6 values

4. **Create Local Environment File**
   - In your project root, create `.env.local` file
   - Add your Firebase configuration:
   ```bash
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```
   - **IMPORTANT**: `.env.local` is already in `.gitignore` and will NOT be committed to Git
   - This file is for local development only

## 🔐 Step 3: Verify Configuration

1. **Check GitHub Secrets**
   - Go to your repo → Settings → Secrets and variables → Actions
   - You should see 6 secrets listed:
     - VITE_FIREBASE_API_KEY
     - VITE_FIREBASE_AUTH_DOMAIN
     - VITE_FIREBASE_PROJECT_ID
     - VITE_FIREBASE_STORAGE_BUCKET
     - VITE_FIREBASE_MESSAGING_SENDER_ID
     - VITE_FIREBASE_APP_ID

2. **Verify Local Environment**
   - Confirm `.env.local` exists in project root
   - Confirm it contains all 6 `VITE_FIREBASE_*` variables
   - The app code in `src/firebase/config.js` is already configured to read these environment variables

3. **How It Works**
   - **Local Development**: Vite reads from `.env.local` file
   - **GitHub Actions**: Workflow injects secrets as environment variables during build
   - **Production Build**: Environment variables are embedded in the built JavaScript
   - Your Firebase credentials are **never committed to Git**

## 🔐 Step 4: Enable Authentication

1. **Go to Authentication**
   - In Firebase Console sidebar, click "Authentication"
   - Click "Get started"

2. **Enable Email/Password**
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## 💾 Step 5: Set Up Firestore Database

1. **Create Database**
   - In Firebase Console sidebar, click "Firestore Database"
   - Click "Create database"

2. **Choose Mode**
   - Select "Start in **production mode**" (we'll add rules next)
   - Click "Next"

3. **Select Location**
   - Choose closest Cloud Firestore location (e.g., `us-central`, `europe-west`)
   - Click "Enable"

4. **Add Security Rules**
   - Click "Rules" tab
   - Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - readable by authenticated users, writable by admins only
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Walks - readable by authenticated users, writable by all authenticated users
    match /walks/{walkId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               (resource.data.createdBy == request.auth.uid ||
                                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

5. **Publish Rules**
   - Click "Publish"

## � Important: No Storage Required!

This app **does NOT use Firebase Storage**. All data (including images and GPX files) is stored directly in Firestore as base64-encoded data. This means:

✅ **Works with free Firebase plan** (Spark)
✅ **No Storage setup required**
✅ **Simpler configuration**
❌ **Images are automatically compressed** (max 800x600, 70% quality)
❌ **Best for personal use** (not recommended for high-traffic production apps)

**Firestore Free Tier Limits:**
- 1 GB storage (plenty for compressed images)
- 50K reads/day, 20K writes/day
- 1 GB network egress/month

For a personal birthday planning app, this is more than sufficient!

## 👤 Step 6: Create Admin User

1. **Create First User via Console**
   - Go to "Authentication" in Firebase Console
   - Click "Users" tab
   - Click "Add user"
   - Enter email: `admin@example.com` (use your real email)
   - Enter password (min 6 characters)
   - Click "Add user"
   - **Copy the User UID** (you'll need this)

2. **Add User to Firestore**
   - Go to "Firestore Database"
   - Click "Start collection"
   - Collection ID: `users`
   - Click "Next"
   - Document ID: Paste the **User UID** you copied
   - Add fields:
     - Field: `email`, Type: string, Value: `admin@example.com`
     - Field: `displayName`, Type: string, Value: `Admin User`
     - Field: `isAdmin`, Type: boolean, Value: `true`
     - Field: `createdAt`, Type: timestamp, Value: (current time)
   - Click "Save"

## 📦 Step 7: Install Dependencies

In your project directory:

```bash
npm install
```

This will install Firebase and all other dependencies.

## 🧪 Step 8: Test Authentication

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Login**
   - Navigate to `http://localhost:5173/birthday-planning/login`
   - Enter the admin email and password you created
   - Click "Sign In"
   - You should be redirected to the Walks page

3. **Verify Upload Access**
   - Click "Upload Walk" button
   - You should see the upload form
   - (Don't upload yet, we'll test that next)

## ✅ Step 9: Create Test Walk

1. **Prepare Test Files**
   - Download a sample GPX file from https://www.gpxeditor.co.uk
   - Prepare 1-3 test images

2. **Upload Test Walk**
   - Go to upload page
   - Fill in walk details:
     - Title: "Test Walk"
     - Distance: "5 km"
     - Duration: "1.5 hours"
     - Start Location: "Test Location"
     - Difficulty: "Easy"
     - Description: "This is a test walk"
   - Upload GPX file
   - Upload 1-3 photos
   - Click "Upload Walk"

3. **Verify Walk Appears**
   - Should redirect to Walks page
   - Test walk should appear in sidebar
   - Click on it to view details
   - Map should show route
   - Photos should display

## 🔐 Step 10: Create Additional Users (Admin Only)

1. **As Admin, Add New Users**
   - Go to Firebase Console → Authentication
   - Click "Add user"
   - Enter user's email and temporary password
   - Copy User UID

2. **Add User to Firestore**
   - Go to Firestore Database → users collection
   - Click "Add document"
   - Document ID: User UID
   - Add fields:
     - `email`: user's email
     - `displayName`: user's name
     - `isAdmin`: `false` (regular user)
     - `createdAt`: current timestamp
   - Click "Save"

3. **Share Credentials**
   - Give user their email and temporary password
   - User can log in and change password in Firebase Authentication

## 🚀 Step 11: Deploy to Production

### Update Firebase Config for Production

If deploying to GitHub Pages with a different domain, ensure your Firebase config is correct in GitHub Secrets.

The GitHub Actions workflow will automatically inject your secrets during build.

## 🛠️ Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that `.env.local` file exists in project root with all 6 Firebase variables
- Verify all environment variable values are correct (no extra quotes or spaces)
- Restart the dev server after creating or modifying `.env.local`
- For production, verify GitHub Secrets are set correctly

### "Missing or insufficient permissions"
- Check Firestore Security Rules are published
- Verify user document exists in `users` collection
- Ensure user is authenticated

### Images Not Loading
- Images are stored as base64 in Firestore - check browser console for errors
- Verify walk document has `photos` array field
- Check that images were properly compressed during upload
- Large images (>1MB original) may fail to upload - try smaller images

### "No walks yet" message
- Check Firestore rules allow read access
- Verify walks collection exists
- Check browser console for errors

## 📊 Firebase Console Quick Links

After setup, bookmark these:
- **Authentication**: Users, sign-in methods
- **Firestore**: View/edit walks and users
- **Storage**: View uploaded GPX and images
- **Usage**: Monitor quotas and usage

## 💰 Firebase Free Tier Limits

The Spark (free) plan includes:
- **Authentication**: Unlimited users
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5 GB, 1 GB downloads/day
- **Hosting**: 10 GB bandwidth/month

For most personal projects, this is sufficient!

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Storage](https://firebase.google.com/docs/storage)

---

**Need Help?** Open an issue in the GitHub repository with:
- Steps you've completed
- Error messages (if any)
- Screenshots of Firebase Console

**Happy Building! 🔥**
