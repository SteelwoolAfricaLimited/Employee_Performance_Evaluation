# Progressive Web App (PWA)

A Progressive Web App connected to Google Apps Script API.

## Features

- 📱 **Installable**: Can be installed on desktop and mobile devices
- 🔌 **Offline Support**: Works offline with service worker caching
- 🚀 **Fast Loading**: Optimized performance with caching strategies
- 📡 **API Integration**: Connected to Google Apps Script endpoint
- 🎨 **Responsive Design**: Works on all device sizes
- 🔔 **App-like Experience**: Runs in standalone mode when installed

## API Endpoint

This PWA connects to:
```
https://script.google.com/macros/s/AKfycbxMNQBfj1UR4smtdH_Cjp9xNghU_fUEiOTd3XSTtYuS31qaFBBuHrtb5xfaISlcsV28Zg/exec
```

## File Structure

```
├── index.html           # Main HTML file
├── manifest.json        # PWA manifest
├── service-worker.js    # Service worker for offline support
├── app.js              # Main JavaScript logic
├── styles.css          # Styling
├── icons/              # App icons (various sizes)
└── README.md           # This file
```

## Deployment on GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it whatever you like (e.g., `my-pwa-app`)
3. Make it public (required for GitHub Pages)
4. Don't initialize with README (you already have files)

### Step 2: Upload Files

**Option A: Using GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop all files from this project
3. Commit the files

**Option B: Using Git Command Line**
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial PWA commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few minutes for deployment

### Step 4: Access Your PWA

Your PWA will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Testing the PWA

### Desktop (Chrome/Edge)
1. Open the deployed URL
2. Look for the install icon in the address bar
3. Click to install the app
4. The app will open in a standalone window

### Mobile (Android)
1. Open the deployed URL in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home screen"
4. The app will be added to your home screen

### iOS (Safari)
1. Open the deployed URL in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

## Customization

### Change App Name
Edit `manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "App Name"
}
```

### Change Colors
Edit `manifest.json`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

Edit CSS variables in `styles.css`:
```css
:root {
  --primary-color: #your-color;
}
```

### Change API Endpoint
Edit `app.js`:
```javascript
const API_URL = 'your-api-endpoint';
```

### Update Icons
Replace files in the `icons/` directory with your own icons. Make sure to keep the same sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## PWA Requirements

This PWA meets all requirements:
- ✅ HTTPS (provided by GitHub Pages)
- ✅ Web App Manifest
- ✅ Service Worker
- ✅ Responsive Design
- ✅ App Icons

## Troubleshooting

### Service Worker Not Registering
- Make sure you're accessing via HTTPS
- Check browser console for errors
- Clear browser cache and reload

### Install Prompt Not Showing
- PWA criteria must be met (HTTPS, manifest, service worker)
- Some browsers hide the prompt after dismissal
- Try accessing from browser menu: "Install app"

### API Not Working
- Check CORS settings on your Google Apps Script
- Verify the API endpoint URL
- Check browser console for errors

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Partial support)
- ✅ Samsung Internet (Full support)

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or questions, please open an issue on GitHub.
