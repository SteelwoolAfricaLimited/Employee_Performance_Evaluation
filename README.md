# PWA Application - Google Apps Script Integration

A Progressive Web App (PWA) that integrates with your Google Apps Script web application.

## Features

- ✅ **Progressive Web App** - Install on mobile and desktop
- ✅ **Offline Support** - Works offline with Service Worker caching
- ✅ **Responsive Design** - Works on all devices
- ✅ **Fast Loading** - Optimized performance
- ✅ **App-like Experience** - Runs in standalone mode when installed
- ✅ **Google Apps Script Integration** - Seamlessly embeds your web app

## Files Included

- `index.html` - Main HTML file
- `app.js` - Application JavaScript
- `sw.js` - Service Worker for offline functionality
- `manifest.json` - PWA manifest file
- `icon-192.png` - App icon (192x192)
- `icon-512.png` - App icon (512x512)

## Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `my-pwa-app`)
4. Make it **Public**
5. Click "Create repository"

### Step 2: Upload Your Files

**Option A: Using GitHub Web Interface**

1. In your new repository, click "uploading an existing file"
2. Drag and drop all the PWA files:
   - index.html
   - app.js
   - sw.js
   - manifest.json
   - icon-192.png
   - icon-512.png
3. Click "Commit changes"

**Option B: Using Git Command Line**

```bash
# Initialize git in your project folder
cd pwa-project
git init

# Add all files
git add .

# Commit
git commit -m "Initial PWA commit"

# Add remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" (top menu)
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select **main** branch
5. Select **/ (root)** folder
6. Click "Save"
7. Wait a few minutes for deployment

### Step 4: Access Your PWA

Your PWA will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

For example: `https://johnsmith.github.io/my-pwa-app/`

## Installing the PWA

### On Mobile (iOS)
1. Open the PWA URL in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### On Mobile (Android)
1. Open the PWA URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Tap "Add"

### On Desktop (Chrome/Edge)
1. Open the PWA URL
2. Click the install icon in the address bar (or three dots menu)
3. Click "Install"

## Customization

### Update App Name
Edit `manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "App Name"
}
```

### Update Colors
Edit `manifest.json`:
```json
{
  "background_color": "#ffffff",
  "theme_color": "#4285f4"
}
```

### Update Icons
Replace `icon-192.png` and `icon-512.png` with your own icons.

### Update Google Apps Script URL
Edit `index.html` and change the iframe src:
```html
<iframe src="YOUR_GOOGLE_APPS_SCRIPT_URL"></iframe>
```

## Testing Locally

To test locally, you need a local web server (Service Workers require HTTPS or localhost):

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

## Troubleshooting

### PWA Install Banner Not Showing
- Make sure you're using HTTPS (GitHub Pages uses HTTPS by default)
- Clear your browser cache
- Check that all manifest.json fields are correct

### Service Worker Not Registering
- Check browser console for errors
- Make sure sw.js is in the root directory
- Verify HTTPS is being used

### Icons Not Displaying
- Ensure icon files are in the correct location
- Verify file names match manifest.json
- Check that icons are PNG format

## Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please create an issue on GitHub.
