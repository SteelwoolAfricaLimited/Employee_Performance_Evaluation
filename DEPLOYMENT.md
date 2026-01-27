# GitHub Pages Deployment Guide

## Quick Start (5 minutes)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Name it: `steelwool-kpi-pwa`
5. Make it **Public** (required for free GitHub Pages)
6. Click **"Create repository"**

### Step 2: Generate Icons

1. Open `icon-generator.html` in your browser
2. Click each button to download all icon sizes:
   - 72x72
   - 96x96
   - 128x128
   - 144x144
   - 152x152
   - 192x192
   - 384x384
   - 512x512
3. Create an `icons` folder in your project
4. Save all downloaded icons to the `icons` folder

### Step 3: Upload Files to GitHub

#### Option A: Using GitHub Web Interface (Easiest)

1. Go to your new repository on GitHub
2. Click **"uploading an existing file"**
3. Drag and drop ALL files:
   - index.html
   - styles.css
   - app.js
   - pdfGenerator.js
   - service-worker.js
   - manifest.json
   - README.md
   - .gitignore
   - icons folder (with all icons inside)
4. Scroll down and click **"Commit changes"**

#### Option B: Using Git Command Line

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/steelwool-kpi-pwa.git
cd steelwool-kpi-pwa

# Copy all files to this directory

# Add all files
git add .

# Commit
git commit -m "Initial deployment"

# Push to GitHub
git push origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under "Source", select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **"Save"**
6. Wait 1-2 minutes for deployment

### Step 5: Access Your App

Your app will be available at:
```
https://YOUR-USERNAME.github.io/steelwool-kpi-pwa/
```

Example: `https://johnsmith.github.io/steelwool-kpi-pwa/`

## Testing Your Deployment

1. **Open the URL** in your browser
2. **Test offline mode:**
   - Open Developer Tools (F12)
   - Go to "Network" tab
   - Select "Offline" from throttling dropdown
   - Refresh the page - it should still work!
3. **Install the app:**
   - Look for an install button in your browser's address bar
   - On mobile: "Add to Home Screen"

## Troubleshooting

### Icons Not Showing
- Make sure the `icons` folder is uploaded
- Check that icon filenames match manifest.json exactly
- Clear browser cache and reload

### App Not Loading
- Check that all files are uploaded
- Verify GitHub Pages is enabled in Settings
- Check browser console (F12) for errors

### Offline Mode Not Working
- Service workers require HTTPS (GitHub Pages provides this)
- Check browser compatibility
- Open in an incognito/private window to test fresh

### "Not Found" Error
- Wait 2-3 minutes after enabling GitHub Pages
- Check that the repository is Public
- Verify the branch is set to "main" in Pages settings

## Custom Domain (Optional)

To use your own domain:

1. **In GitHub Settings > Pages:**
   - Enter your custom domain (e.g., `kpi.steelwoolafrica.com`)
   - Click Save

2. **In your DNS provider:**
   - Add a CNAME record pointing to: `YOUR-USERNAME.github.io`

3. **Wait for DNS propagation** (can take up to 48 hours)

## Updating Your App

### Using GitHub Web Interface:

1. Go to your repository
2. Click on the file you want to update
3. Click the pencil icon (Edit)
4. Make your changes
5. Scroll down and click "Commit changes"

### Using Git:

```bash
# Make your changes locally

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

Changes will be live in 1-2 minutes!

## Security Notes

- This deployment is **PUBLIC** - anyone with the URL can access it
- All data is stored **locally** on users' devices
- No authentication is included by default
- For internal-only use, consider:
  - Private repository (requires GitHub Pro)
  - Adding authentication layer
  - Self-hosting on internal servers

## Performance Tips

1. **Enable caching:** Already configured in service-worker.js
2. **Minimize file sizes:** Files are already optimized
3. **Use CDN for libraries:** jsPDF loaded from CDN
4. **Test on mobile:** Use Chrome DevTools Device Mode

## Monitoring

GitHub provides:
- **Traffic stats:** Repository > Insights > Traffic
- **Commit history:** Repository > Commits
- **Issues tracking:** Repository > Issues (if enabled)

## Cost

GitHub Pages is **100% FREE** for:
- Public repositories
- Custom domains
- HTTPS
- Unlimited bandwidth*

*Subject to GitHub's fair use policy (100GB bandwidth/month, 100GB storage)

## Support

If you encounter issues:

1. Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
2. Verify all files are uploaded correctly
3. Check browser console for errors
4. Test in a different browser
5. Clear cache and try again

## Next Steps

After deployment:

- [ ] Test all features thoroughly
- [ ] Install on your devices
- [ ] Test offline functionality
- [ ] Create some sample evaluations
- [ ] Export data to verify backups work
- [ ] Share URL with your team
- [ ] Set up regular data export schedule

---

**Congratulations!** 🎉 Your Steelwool Africa KPI System is now live!

Visit: `https://YOUR-USERNAME.github.io/steelwool-kpi-pwa/`
