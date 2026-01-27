# 🚀 Quick Start Guide

## For End Users (Supervisors/HR)

### 1. Access the App
Visit: `https://yourusername.github.io/steelwool-kpi-pwa/`
(Your admin will provide the actual URL)

### 2. Install the App (Optional but Recommended)

**On Desktop (Chrome/Edge):**
- Look for the install icon (⊕) in the address bar
- Click it and select "Install"
- App will open in its own window

**On Mobile (Android/iOS):**
- Tap the menu button (⋮ or share icon)
- Select "Add to Home Screen"
- App icon will appear on your home screen

### 3. Use Offline
- Once installed, the app works without internet
- All data is stored on your device
- Sync happens automatically when online

### 4. Create Your First Evaluation

1. **Fill Employee Info:**
   - Enter employee name and ID
   - Select evaluation week (e.g., "Week 1, Jan 2026")
   - Enter your name as supervisor

2. **Select Department:**
   - Click the department button (e.g., "Production Steelex")

3. **Score Department KPIs:**
   - Enter scores 0-100 for each KPI
   - Higher is better
   - Progress bars show your scores

4. **Score Universal KPIs:**
   - Rate punctuality, attendance, safety, etc.
   - Same 0-100 scale

5. **Review & Save:**
   - Check the total score (calculated automatically)
   - Click "Download PDF Report" for a formatted report
   - Click "Save Evaluation" to store it locally

### 5. View Past Evaluations
- Click "View Saved" tab
- Search by employee name or ID
- Filter by department
- Download PDFs or delete old records

### 6. Export Data
- Click "Export Data" tab
- Export to CSV (open in Excel)
- Export to JSON (full backup)
- Regular exports recommended!

---

## For Developers/IT Staff

### Prerequisites
- Git installed
- GitHub account
- Code editor (VS Code recommended)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/steelwool-kpi-pwa.git
cd steelwool-kpi-pwa

# Generate icons
# Open icon-generator.html in browser
# Download all sizes to icons/ folder

# Test locally
python -m http.server 8000
# Or: npx http-server
# Or: php -S localhost:8000

# Open browser
http://localhost:8000
```

### Deploy to GitHub Pages

```bash
# Create repository on GitHub
# Then push code:

git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/steelwool-kpi-pwa.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Settings > Pages > Source: main branch
```

### File Structure

```
steelwool-kpi-pwa/
├── index.html              # Main UI
├── styles.css              # All styling
├── app.js                  # Core logic
├── pdfGenerator.js         # PDF creation
├── service-worker.js       # Offline support
├── manifest.json           # PWA config
├── icon-generator.html     # Icon creation tool
├── icons/                  # App icons
│   ├── icon-72x72.png
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── README.md               # Documentation
├── DEPLOYMENT.md           # Deployment guide
└── QUICK_START.md          # This file
```

### Configuration

**To Customize:**

1. **Change Company Name:**
   - Edit `index.html`: Search for "Steelwool Africa"
   - Update all instances

2. **Modify KPIs:**
   - Edit `app.js`: Update `departments` object
   - Adjust weights as needed

3. **Change Colors:**
   - Edit `styles.css`: Search for color codes
   - Primary blue: `#2563eb`

4. **Add New Department:**
   - Edit `app.js`: Add to `departments` object
   - Edit `index.html`: Add department button

### Testing Checklist

- [ ] Create evaluation
- [ ] Save evaluation
- [ ] Download PDF
- [ ] View saved evaluations
- [ ] Search/filter evaluations
- [ ] Export to CSV
- [ ] Export to JSON
- [ ] Test offline mode
- [ ] Install as PWA
- [ ] Test on mobile
- [ ] Test on different browsers

### Browser DevTools

**Test Offline:**
1. Open DevTools (F12)
2. Go to "Network" tab
3. Set throttling to "Offline"
4. Refresh page - should still work

**Check Service Worker:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Service Workers" - should be active
4. Check "Storage" - data in localStorage

**Audit PWA:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Aim for 100% score

### Common Issues

**Service Worker Not Registering:**
- Must be served over HTTPS (or localhost)
- Check browser console for errors
- Try in incognito mode

**Icons Not Showing:**
- Generate all required sizes
- Check filenames match manifest.json
- Clear cache and reload

**Data Not Saving:**
- Check browser localStorage settings
- Ensure localStorage isn't disabled
- Try different browser

### API Integration (Future)

To add backend sync:

```javascript
// In app.js
async function syncToBackend(data) {
  try {
    const response = await fetch('YOUR_API_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
```

### Performance Optimization

- All assets cached by Service Worker
- LocalStorage for instant data access
- Minimal dependencies (only jsPDF from CDN)
- Responsive images and lazy loading

### Security Considerations

- No authentication (add if deploying publicly)
- No backend (all data local)
- HTTPS required for Service Workers
- Consider adding user login for multi-user scenarios

---

## Support

**For Users:**
- Contact your IT department
- Check the in-app guidelines
- Export data regularly

**For Developers:**
- Check browser console for errors
- Review DEPLOYMENT.md for setup
- Test in multiple browsers
- Use browser DevTools for debugging

---

## Version History

**v1.0.0** - January 2026
- Initial release
- 5 departments supported
- Offline functionality
- PDF export
- Local data storage

---

**Need Help?**

1. Read the full README.md
2. Check DEPLOYMENT.md for setup
3. Review browser console for errors
4. Test in incognito mode
5. Try a different browser

**Ready to go!** 🎉
