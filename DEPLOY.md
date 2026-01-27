# Quick Deployment Guide

## 🚀 Deploy to GitHub Pages in 5 Minutes

### Method 1: GitHub Web Interface (Easiest)

1. **Create Repository**
   - Go to https://github.com/new
   - Name: `my-pwa-app` (or any name you want)
   - Public repository
   - Click "Create repository"

2. **Upload Files**
   - Click "uploading an existing file"
   - Drag all files from this folder into the upload area
   - Write commit message: "Initial PWA"
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Source: Select "main" branch
   - Click "Save"
   - Wait 2-3 minutes

4. **Access Your PWA**
   - URL: `https://YOUR_USERNAME.github.io/my-pwa-app/`
   - Bookmark this URL
   - Try installing the app!

### Method 2: Using Git Command Line

```bash
# Navigate to this folder in terminal
cd path/to/pwa-project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial PWA commit"

# Add your GitHub repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main

# Then enable GitHub Pages in repository settings
```

### Method 3: GitHub Desktop

1. Open GitHub Desktop
2. File > Add Local Repository
3. Choose this folder
4. Publish repository
5. Enable Pages in repository settings on GitHub.com

## ✅ Verify Deployment

After deployment, check:
- [ ] URL loads correctly
- [ ] Install button appears (may need to wait a few seconds)
- [ ] Service worker registers (check browser DevTools > Application)
- [ ] API connection works (click "Fetch from API")

## 🎨 Customize Your PWA

Before deploying, you might want to:
1. Change app name in `manifest.json`
2. Update colors in `manifest.json` and `styles.css`
3. Replace icons in `icons/` folder
4. Modify content in `index.html`

## 📱 Install on Devices

**Desktop:**
- Look for install icon in address bar (Chrome/Edge)
- Click to install

**Android:**
- Chrome menu > "Install app"

**iOS:**
- Safari > Share > "Add to Home Screen"

## 🔧 Troubleshooting

**Install prompt not showing?**
- Wait 30 seconds after page load
- Try refreshing the page
- Check browser console for errors

**API not working?**
- CORS might need configuration on Google Apps Script
- Check browser console for error messages

**Page not found after deployment?**
- Wait 5 minutes for GitHub Pages to build
- Check repository settings > Pages for status

## 📚 Need Help?

Check the full README.md for detailed information.
