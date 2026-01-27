# Steelwool Africa KPI Evaluation System - PWA

A Progressive Web App for employee performance evaluation at Steelwool Africa. This application works offline and can be installed on any device.

## Features

✅ **Offline Support** - Works without internet connection  
✅ **Installable** - Can be installed on mobile and desktop devices  
✅ **Local Storage** - All data stored securely on your device  
✅ **PDF Export** - Generate professional evaluation reports  
✅ **Data Export** - Export to CSV or JSON for backup  
✅ **Multi-Department** - Supports 5 different departments  
✅ **Responsive Design** - Works on all screen sizes  

## Departments Supported

1. Production Steelex
2. Production Steelwool
3. Production Electrodes
4. Inventory
5. Maintenance

## KPI Structure

### Department-Specific KPIs (50% of total score)
- Customized for each department
- 4 KPIs per department with different weights

### Universal KPIs (50% of total score)
- Discipline & Work Conduct (30%)
- SOP Adherence (30%)
- Safety Compliance & PPE Usage (15%)
- Punctuality (15%)
- Attendance (10%)

## Performance Ratings

- **90-100%**: Outstanding
- **80-89%**: Exceeds Expectations
- **70-79%**: Meets Expectations
- **60-69%**: Needs Improvement
- **Below 60%**: Unsatisfactory

## Installation

### Option 1: Deploy to GitHub Pages

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/yourusername/steelwool-kpi-pwa.git
   cd steelwool-kpi-pwa
   ```

2. **Create icons folder and generate icons**
   ```bash
   mkdir icons
   ```
   
   Use an online tool like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) to create icons from your logo, or use the provided icon generator script.

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "main" branch as source
   - Click Save
   - Your app will be available at: `https://yourusername.github.io/steelwool-kpi-pwa/`

### Option 2: Deploy to Netlify

1. **Create account** at [netlify.com](https://netlify.com)

2. **Deploy**
   - Drag and drop the project folder to Netlify
   - Or connect your GitHub repository

3. **Your app will be live** at a Netlify URL (e.g., `steelwool-kpi.netlify.app`)

### Option 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to complete deployment

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/steelwool-kpi-pwa.git
   cd steelwool-kpi-pwa
   ```

2. **Serve locally**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js:
   ```bash
   npx http-server
   ```
   
   Or use any other local web server.

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Usage Guide

### Creating a New Evaluation

1. Navigate to the "New Evaluation" tab
2. Fill in employee information (Name, ID, Week, Supervisor)
3. Select the appropriate department
4. Score each Department-Specific KPI (0-100)
5. Score each Universal KPI (0-100)
6. Review the calculated total score and rating
7. Click "Download PDF Report" to generate a PDF
8. Click "Save Evaluation" to store locally

### Viewing Saved Evaluations

1. Navigate to the "View Saved" tab
2. Use the search box to filter by employee name or ID
3. Filter by department if needed
4. Click on any evaluation to:
   - View details
   - Download PDF report
   - Delete the evaluation

### Exporting Data

1. Navigate to the "Export Data" tab
2. View statistics (total evaluations, unique employees)
3. Choose export format:
   - **CSV**: Compatible with Excel/Google Sheets
   - **JSON**: Full data backup
4. Import the CSV into Google Sheets or Excel for analysis

## Data Storage

- All data is stored **locally** in your browser's localStorage
- No data is sent to any server
- Data persists even when offline
- Regular exports recommended for backup

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### Technologies Used

- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript (No frameworks)
- jsPDF (PDF generation via CDN)
- Service Workers (Offline functionality)
- LocalStorage API (Data persistence)
- Web App Manifest (Installability)

### File Structure

```
steelwool-kpi-pwa/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── app.js             # Application logic
├── pdfGenerator.js    # PDF generation
├── service-worker.js  # Offline functionality
├── manifest.json      # PWA manifest
├── icons/            # App icons
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md         # This file
```

## CDN Dependencies

The app loads jsPDF from CDN for PDF generation. Add this to your `index.html` before the closing `</body>` tag:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

## Offline Functionality

The app uses a Service Worker to:
- Cache all static assets
- Enable offline access
- Provide fast loading times
- Auto-update when online

## Security Notes

- All data is stored locally on the user's device
- No authentication or backend required
- Suitable for internal use within secure networks
- Consider adding authentication if deploying publicly

## Future Enhancements

Potential features for future versions:
- [ ] Multi-user authentication
- [ ] Backend integration for data sync
- [ ] Advanced analytics dashboard
- [ ] Email report generation
- [ ] Bulk import/export
- [ ] Cumulative reports (averages across weeks)
- [ ] Performance trends and charts
- [ ] Customizable KPI templates

## Support

For issues or questions:
1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Clear browser cache and reload
4. Export data before clearing cache

## License

This project is proprietary software for Steelwool Africa Limited.

## Version

**Version 1.0.0** - January 2026

---

**Steelwool Africa Limited**  
Employee Performance Evaluation System
