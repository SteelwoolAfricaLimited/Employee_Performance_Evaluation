# Steelwool Africa KPI Evaluation System - PWA

A Progressive Web App for employee performance evaluation.

## Prerequisites

1. Google Account
2. GitHub Account
3. Google Cloud Project

## Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Steelwool KPI System"
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

### Step 2: Create OAuth Credentials

1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `https://yourusername.github.io` (replace with your GitHub username)
   - `http://localhost:8000` (for local testing)
5. Add authorized redirect URIs:
   - `https://yourusername.github.io/steelwool-kpi` (replace with your repo name)
6. Save and copy the **Client ID**

### Step 3: Create API Key

1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy the **API Key**
4. (Recommended) Click **Edit API Key** and restrict it to:
   - Google Sheets API
   - Google Drive API

### Step 4: Create Google Sheet

1. Create a new Google Sheet
2. Name it "Steelwool Africa KPI Evaluations"
3. Create a sheet named "Employee" with columns:
   - Column A: Employee ID
   - Column B: Employee Name
   - Column C: Department
   - Column D: Attendance (%)
4. Copy the Spreadsheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
5. Make the spreadsheet accessible:
   - Click **Share**
   - Change to "Anyone with the link can edit" (or manage permissions via API)

### Step 5: Configure the App

1. Open `config.js`
2. Replace the placeholder values:
   ```javascript
   apiKey: 'YOUR_API_KEY_FROM_STEP_3',
   clientId: 'YOUR_CLIENT_ID_FROM_STEP_2',
   spreadsheetId: 'YOUR_SPREADSHEET_ID_FROM_STEP_4'
Step 6: Deploy to GitHub Pages
Create a new GitHub repository (e.g., steelwool-kpi)
Upload all files:
index.html
manifest.json
service-worker.js
config.js
README.md
icon-192.png (create a 192x192 icon)
icon-512.png (create a 512x512 icon)
Go to Settings > Pages
Select Source: Deploy from a branch
Choose main branch and / (root) folder
Click Save
Your app will be available at: https://yourusername.github.io/steelwool-kpi/
Step 7: Update OAuth Settings
Go back to Google Cloud Console > Credentials
Edit your OAuth 2.0 Client ID
Update the authorized origins and redirect URIs with your actual GitHub Pages URL
