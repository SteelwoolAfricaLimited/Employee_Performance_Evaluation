// =============================================================================
// GOOGLE API CONFIGURATION
// IMPORTANT: Replace these values with your own from Google Cloud Console
// =============================================================================

const GOOGLE_CONFIG = {
  apiKey: 'YOUR_GOOGLE_API_KEY_HERE',
  clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
};

// =============================================================================
// DATA DEFINITIONS
// =============================================================================

const departments = {
  'Production Steelex': {
    kpis: [
      { name: 'Daily Production Target Achievement', weight: 40, type: 'input' },
      { name: 'Product Quality (Defect Rate)', weight: 30, type: 'input' },
      { name: 'Machine Utilization Efficiency', weight: 20, type: 'input' },
      { name: 'Raw Material Wastage Control', weight: 10, type: 'input' }
    ]
  },
  'Production Steelwool': {
    kpis: [
      { name: 'Daily Production Volume vs Target', weight: 40, type: 'input' },
      { name: 'Quality Standards Compliance', weight: 30, type: 'input' },
      { name: 'Production Line Efficiency', weight: 20, type: 'input' },
      { name: 'Scrap/Waste Minimization', weight: 10, type: 'input' }
    ]
  },
  'Production Electrodes': {
    kpis: [
      { name: 'Production Output Achievement', weight: 40, type: 'input' },
      { name: 'Product Specification Adherence', weight: 30, type: 'input' },
      { name: 'Machine Runtime/Availability Ratio', weight: 20, type: 'input' },
      { name: 'Machine Utilisation Efficiency', weight: 10, type: 'input' }
    ]
  },
  'Inventory': {
    kpis: [
      { name: 'Stock Accuracy (Physical vs System)', weight: 40, type: 'input' },
      { name: 'Timely Stock Replenishment', weight: 30, type: 'input' },
      { name: 'Proper Documentation & Records', weight: 20, type: 'input' },
      { name: 'Storage & Organization Standards', weight: 10, type: 'input' }
    ]
  },
  'Maintenance': {
    kpis: [
      { name: 'Preventive Maintenance Schedule Completion', weight: 40, type: 'rating' },
      { name: 'Equipment Breakdown Response Time', weight: 30, type: 'rating' },
      { name: 'Maintenance Quality (Repeat Failures)', weight: 20, type: 'rating' },
      { name: 'Tools & Equipment Management', weight: 10, type: 'rating' }
    ]
  }
};

const productionUnits = {
  'Production Steelex': [
    'Pot Scrubber Knitting', 'Pot Scrubber Cutting', 'Pot Scrubber Sealing',
    'Pot Scrubber Trimming', 'Post Scrubber Sorting', 'Pot Scrubber Stuffing',
    'Mesh and Spiral Scourer', 'Slitting Unit', 'Mop Production', 'Packing'
  ],
  'Production Steelwool': [
    'Webo Unit', 'Flow Wrap', 'Cut and Rolling', 'Winding', 'Packing'
  ],
  'Production Electrodes': [
    'Wire Cutting', 'Flux Wet Mix', 'Flux Dry Mix', 'Electrode Extrusion', 'Packing'
  ],
  'Inventory': [
    'Packing Material', 'Unpacked Material', 'Raw Materials and Finished Goods'
  ],
  'Maintenance': [
    'Electrical', 'Mechanical'
  ]
};

const universalKPIs = [
  { name: 'Discipline & Work Conduct', weight: 30 },
  { name: 'SOP Adherence', weight: 30 },
  { name: 'Safety Compliance & PPE Usage', weight: 15 },
  { name: 'Punctuality (On-time Reporting)', weight: 15 },
  { name: 'Attendance (Days Present)', weight: 10 }
];

// =============================================================================
// GLOBAL STATE
// =============================================================================

let currentDepartment = 'Production Steelex';
let scores = {};
let subQuestionData = {};
let loadedEvalData = null;
let employeeData = [];
let gapiInited = false;
let gisInited = false;
let tokenClient;
let accessToken = null;

// =============================================================================
// GOOGLE API INITIALIZATION
// =============================================================================

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: GOOGLE_CONFIG.apiKey,
      discoveryDocs: GOOGLE_CONFIG.discoveryDocs,
    });
    gapiInited = true;
    maybeEnableButtons();
  } catch (err) {
    console.error('Error initializing GAPI client:', err);
    showAlert('Error initializing Google API: ' + err.message, 'error');
  }
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CONFIG.clientId,
    scope: GOOGLE_CONFIG.scopes,
    callback: '',
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    console.log('Google APIs ready');
  }
}

function handleSignIn() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    accessToken = gapi.client.getToken().access_token;
    
    try {
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      const user = await userInfo.json();
      
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('authScreen').style.display = 'none';
      document.getElementById('appContainer').classList.add('show');
      
      await initApp();
    } catch (err) {
      console.error('Error getting user info:', err);
      showAlert('Error signing in: ' + err.message, 'error');
    }
  };
  
  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}

function handleSignOut() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('appContainer').classList.remove('show');
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('userEmail').textContent = 'Not signed in';
  }
}

// =============================================================================
// GOOGLE SHEETS HELPER FUNCTIONS
// =============================================================================

async function getSheetData(sheetName, range) {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
      range: `${sheetName}!${range}`,
    });
    return response.result.values || [];
  } catch (err) {
    console.error('Error reading sheet:', err);
    throw err;
  }
}

async function appendSheetData(sheetName, values) {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
      range: `${sheetName}!A:AZ`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values]
      }
    });
    return response.result;
  } catch (err) {
    console.error('Error writing to sheet:', err);
    throw err;
  }
}

async function createSheetIfNotExists(sheetName) {
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_CONFIG.spreadsheetId
    });
    
    const sheets = response.result.sheets;
    const sheetExists = sheets.some(s => s.properties.title === sheetName);
    
    if (!sheetExists) {
      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }]
        }
      });
      
      await initializeSheetHeaders(sheetName);
    }
  } catch (err) {
    console.error('Error creating sheet:', err);
    throw err;
  }
}

async function initializeSheetHeaders(sheetName) {
  let headers;
  
  if (sheetName === 'Maintenance') {
    headers = [
      'Timestamp', 'Employee Name', 'Employee ID', 'Production Unit', 'Week', 'Supervisor',
      'Dept KPI 1', 'Dept KPI 1 Remarks', 'Dept KPI 1 Rating',
      'Dept KPI 2', 'Dept KPI 2 Remarks', 'Dept KPI 2 Rating',
      'Dept KPI 3', 'Dept KPI 3 Remarks', 'Dept KPI 3 Rating',
      'Dept KPI 4', 'Dept KPI 4 Remarks', 'Dept KPI 4 Rating',
      'Discipline Score', 'Discipline Remarks', 'Discipline Instruction', 'Discipline Housekeeping', 
      'Discipline Teamwork', 'Discipline Time Mgmt',
      'SOP Score', 'SOP Remarks', 'SOP Adherence',
      'Safety Score', 'Safety Remarks', 'Safety PPE', 'Safety Workplace', 'Safety Equipment',
      'Punctuality Score', 'Punctuality Remarks', 'Punctuality Reporting', 'Punctuality Lunch', 'Punctuality Clockout',
      'Attendance Score', 'Attendance Remarks',
      'Total Score', 'Rating'
    ];
  } else {
    headers = [
      'Timestamp', 'Employee Name', 'Employee ID', 'Production Unit', 'Week', 'Supervisor',
      'Dept KPI 1', 'Dept KPI 1 Remarks',
      'Dept KPI 2', 'Dept KPI 2 Remarks',
      'Dept KPI 3', 'Dept KPI 3 Remarks',
      'Dept KPI 4', 'Dept KPI 4 Remarks',
      'Discipline Score', 'Discipline Remarks', 'Discipline Instruction', 'Discipline Housekeeping', 
      'Discipline Teamwork', 'Discipline Time Mgmt',
      'SOP Score', 'SOP Remarks', 'SOP Adherence',
      'Safety Score', 'Safety Remarks', 'Safety PPE', 'Safety Workplace', 'Safety Equipment',
      'Punctuality Score', 'Punctuality Remarks', 'Punctuality Reporting', 'Punctuality Lunch', 'Punctuality Clockout',
      'Attendance Score', 'Attendance Remarks',
      'Total Score', 'Rating'
    ];
  }
  
  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
    range: `${sheetName}!A1:AZ1`,
    valueInputOption: 'RAW',
    resource: {
      values: [headers]
    }
  });
}

// =============================================================================
// APP INITIALIZATION
// =============================================================================

async function initApp() {
  try {
    showLoading(true);
    
    await loadEmployeeList();
    populateWeekDropdown();
    updateProductionUnits('Production Steelex');
    renderDepartmentKPIs();
    renderUniversalKPIs();
    
    showLoading(false);
    showAlert('System loaded successfully!', 'success');
  } catch (err) {
    console.error('Error initializing app:', err);
    showAlert('Error loading system: ' + err.message, 'error');
    showLoading(false);
  }
}

async function loadEmployeeList() {
  try {
    const data = await getSheetData('Employee', 'A2:D1000');
    employeeData = [];
    
    const dropdown = document.getElementById('employeeName');
    dropdown.innerHTML = '<option value="">Select employee...</option>';
    
    data.forEach(row => {
      if (row[0] && row[1]) {
        let attendanceValue = 0;
        if (row[3]) {
          const numValue = Number(row[3]);
          if (numValue > 0 && numValue <= 1) {
            attendanceValue = Math.round(numValue * 100);
          } else if (numValue > 1 && numValue <= 100) {
            attendanceValue = Math.round(numValue);
          }
        }
        
        const emp = {
          id: String(row[0]),
          name: String(row[1]),
          department: String(row[2] || ''),
          attendance: attendanceValue
        };
        
        employeeData.push(emp);
        dropdown.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;
      }
    });
    
    console.log('Loaded ' + employeeData.length + ' employees');
  } catch (err) {
    console.error('Error loading employees:', err);
    throw err;
  }
}

function populateWeekDropdown() {
  const dropdown = document.getElementById('evaluationWeek');
  dropdown.innerHTML = '<option value="">Select week...</option>';
  
  for (let i = 1; i <= 52; i++) {
    dropdown.innerHTML += `<option value="Week ${i}">Week ${i}</option>`;
  }
}

function updateProductionUnits(dept) {
  const dropdown = document.getElementById('productionUnit');
  dropdown.innerHTML = '<option value="">Select production unit...</option>';
  
  const units = productionUnits[dept] || [];
  units.forEach(unit => {
    dropdown.innerHTML += `<option value="${unit}">${unit}</option>`;
  });
}

function autoFillEmployeeId() {
  const selectedId = document.getElementById('employeeName').value;
  const employee = employeeData.find(emp => emp.id === selectedId);
  
  if (employee) {
    document.getElementById('employeeId').value = employee.id;
    
    const attendanceScore = employee.attendance || 0;
    const attendanceInput = document.getElementById('universal_4');
    if (attendanceInput) {
      attendanceInput.value = attendanceScore;
      updateScore('universal_4', attendanceScore);
    }
    
    showAlert('Employee ID and Attendance (' + attendanceScore + '%) auto-filled', 'success');
  } else {
    document.getElementById('employeeId').value = '';
    const attendanceInput = document.getElementById('universal_4');
    if (attendanceInput) {
      attendanceInput.value = '';
      updateScore('universal_4', 0);
    }
  }
}

// =============================================================================
// UI HELPER FUNCTIONS
// =============================================================================

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
}

function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = 'alert ' + type + ' show';
  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

function showLoading(show) {
  document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

function selectDepartment(dept) {
  currentDepartment = dept;
  
  document.querySelectorAll('.dept-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === dept) {
      btn.classList.add('active');
    }
  });
  
  updateProductionUnits(dept);
  renderDepartmentKPIs();
  calculateTotal();
}

function getRatingLabel(score) {
  if (score == 95) return 'Outstanding';
  if (score == 85) return 'Exceeding Expectations';
  if (score == 75) return 'Meeting Expectations';
  if (score == 65) return 'Need Improvement';
  return 'N/A';
}

function getPerformanceRating(score) {
  if (score >= 90) return { text: 'Outstanding', class: 'outstanding' };
  if (score >= 80) return { text: 'Exceeds Expectations', class: 'exceeds' };
  if (score >= 70) return { text: 'Meets Expectations', class: 'meets' };
  if (score >= 60) return { text: 'Needs Improvement', class: 'needs' };
  return { text: 'Unsatisfactory', class: 'unsatisfactory' };
}

// =============================================================================
// RENDERING FUNCTIONS
// =============================================================================

function renderDepartmentKPIs() {
  const container = document.getElementById('deptKPIs');
  const kpis = departments[currentDepartment].kpis;
  
  container.innerHTML = kpis.map((kpi, index) => {
    if (kpi.type === 'rating') {
      return `
        <div class="kpi-item">
          <div class="kpi-header">
            <div class="kpi-info">
              <h3>${kpi.name}</h3>
              <p>Weight: ${kpi.weight}%</p>
            </div>
            <div class="kpi-score-display" id="dept_${index}_display">0</div>
          </div>
          
          <div class="sub-question">
            <label class="sub-question-label">${kpi.name}</label>
            <select id="dept_${index}_rating" onchange="updateDeptRatingScore(${index})">
              <option value="">Select...</option>
              <option value="95">Outstanding (95%)</option>
              <option value="85">Exceeding Expectations (85%)</option>
              <option value="75">Meeting Expectations (75%)</option>
              <option value="65">Need Improvement (65%)</option>
            </select>
          </div>
          
          <div class="progress-bar">
            <div class="progress-fill" id="progress_dept_${index}" style="width: 0%"></div>
          </div>
          <div class="form-group" style="margin-top: 12px;">
            <label>Remarks (Required)</label>
            <textarea id="dept_${index}_remarks" 
                      placeholder="Enter observations..." 
                      rows="2" 
                      style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="kpi-item">
          <div class="kpi-header">
            <div class="kpi-info">
              <h3>${kpi.name}</h3>
              <p>Weight: ${kpi.weight}%</p>
            </div>
            <input type="number" 
                   class="kpi-score-input" 
                   id="dept_${index}"
                   min="0" 
                   max="100" 
                   placeholder="0-100"
                   onchange="updateScore('dept_${index}', this.value)">
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress_dept_${index}" style="width: 0%"></div>
          </div>
          <div class="form-group" style="margin-top: 12px;">
            <label>Remarks (Required)</label>
            <textarea id="dept_${index}_remarks" 
                      placeholder="Enter observations..." 
                      rows="2" 
                      style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
          </div>
        </div>
      `;
    }
  }).join('');
}

function renderUniversalKPIs() {
  const container = document.getElementById('universalKPIs');
  
  container.innerHTML = `
    <div class="kpi-item">
      <div class="kpi-header">
        <div class="kpi-info">
          <h3>Discipline & Work Conduct</h3>
          <p>Weight: 30% | Average of 4 criteria</p>
        </div>
        <div class="kpi-score-display" id="discipline_score_display">0</div>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Instruction Following</label>
        <select id="discipline_instruction" onchange="calculateDisciplineScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">House Keeping</label>
        <select id="discipline_housekeeping" onchange="calculateDisciplineScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Team Work</label>
        <select id="discipline_teamwork" onchange="calculateDisciplineScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Work in Progress Time Management</label>
        <select id="discipline_timemanagement" onchange="calculateDisciplineScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="progress-bar" style="margin-top: 12px;">
        <div class="progress-fill" id="progress_universal_0" style="width: 0%"></div>
      </div>
      
      <div class="form-group" style="margin-top: 12px;">
        <label>Remarks (Required)</label>
        <textarea id="universal_0_remarks" 
                  placeholder="Enter observations..." 
                  rows="2" 
                  style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
      </div>
    </div>
    
    <div class="kpi-item">
      <div class="kpi-header">
        <div class="kpi-info">
          <h3>SOP Adherence</h3>
          <p>Weight: 30%</p>
        </div>
        <div class="kpi-score-display" id="sop_score_display">0</div>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">SOP Adherence</label>
        <select id="sop_adherence" onchange="calculateSOPScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="progress-bar" style="margin-top: 12px;">
        <div class="progress-fill" id="progress_universal_1" style="width: 0%"></div>
      </div>
      
      <div class="form-group" style="margin-top: 12px;">
        <label>Remarks (Required)</label>
        <textarea id="universal_1_remarks" 
                  placeholder="Enter observations..." 
                  rows="2" 
                  style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
      </div>
    </div>
    
    <div class="kpi-item">
      <div class="kpi-header">
        <div class="kpi-info">
          <h3>Safety Compliance & PPE Usage</h3>
          <p>Weight: 15% | Average of 3 criteria</p>
        </div>
        <div class="kpi-score-display" id="safety_score_display">0</div>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Always on PPE</label>
        <select id="safety_ppe" onchange="calculateSafetyScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Work Place Organisation</label>
        <select id="safety_workplace" onchange="calculateSafetyScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Equipment Handling</label>
        <select id="safety_equipment" onchange="calculateSafetyScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="progress-bar" style="margin-top: 12px;">
        <div class="progress-fill" id="progress_universal_2" style="width: 0%"></div>
      </div>
      
      <div class="form-group" style="margin-top: 12px;">
        <label>Remarks (Required)</label>
        <textarea id="universal_2_remarks" 
                  placeholder="Enter observations..." 
                  rows="2" 
                  style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
      </div>
    </div>
    
    <div class="kpi-item">
      <div class="kpi-header">
        <div class="kpi-info">
          <h3>Punctuality (On-time Reporting)</h3>
          <p>Weight: 15% | Average of 3 criteria</p>
        </div>
        <div class="kpi-score-display" id="punctuality_score_display">0</div>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Reporting Time to Work Commencement</label>
        <select id="punctuality_reporting" onchange="calculatePunctualityScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Lunch Break to Work Resumption</label>
        <select id="punctuality_lunch" onchange="calculatePunctualityScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="sub-question">
        <label class="sub-question-label">Clock out from Machine to Scanner</label>
        <select id="punctuality_clockout" onchange="calculatePunctualityScore()">
          <option value="">Select...</option>
          <option value="95">Outstanding (95%)</option>
          <option value="85">Exceeding Expectations (85%)</option>
          <option value="75">Meeting Expectations (75%)</option>
          <option value="65">Need Improvement (65%)</option>
        </select>
      </div>
      
      <div class="progress-bar" style="margin-top: 12px;">
        <div class="progress-fill" id="progress_universal_3" style="width: 0%"></div>
      </div>
      
      <div class="form-group" style="margin-top: 12px;">
        <label>Remarks (Required)</label>
        <textarea id="universal_3_remarks" 
                  placeholder="Enter observations..." 
                  rows="2" 
                  style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
      </div>
    </div>
    
    <div class="kpi-item">
      <div class="kpi-header">
        <div class="kpi-info">
          <h3>Attendance (Days Present)</h3>
          <p>Weight: 10% | Auto-filled</p>
        </div>
        <input type="number" 
               class="kpi-score-input" 
               id="universal_4"
               min="0" 
               max="100" 
               placeholder="Auto-filled"
               onchange="updateScore('universal_4', this.value)">
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress_universal_4" style="width: 0%"></div>
      </div>
      <div class="form-group" style="margin-top: 12px;">
        <label>Remarks (Required)</label>
        <textarea id="universal_4_remarks" 
                  placeholder="Enter observations..." 
                  rows="2" 
                  style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical;"></textarea>
      </div>
    </div>
  `;
}

// =============================================================================
// SCORE CALCULATION FUNCTIONS
// =============================================================================

function updateDeptRatingScore(index) {
  const ratingValue = parseInt(document.getElementById('dept_' + index + '_rating').value) || 0;
  document.getElementById('dept_' + index + '_display').textContent = ratingValue;
  
  if (!subQuestionData.deptRatings) {
    subQuestionData.deptRatings = {};
  }
  subQuestionData.deptRatings['dept_' + index] = ratingValue;
  
  updateScore('dept_' + index, ratingValue);
}

function calculateDisciplineScore() {
  const instruction = parseInt(document.getElementById('discipline_instruction').value) || 0;
  const housekeeping = parseInt(document.getElementById('discipline_housekeeping').value) || 0;
  const teamwork = parseInt(document.getElementById('discipline_teamwork').value) || 0;
  const timemanagement = parseInt(document.getElementById('discipline_timemanagement').value) || 0;
  
  subQuestionData.discipline = {
    instruction: instruction,
    housekeeping: housekeeping,
    teamwork: teamwork,
    timemanagement: timemanagement
  };
  
  const average = Math.round((instruction + housekeeping + teamwork + timemanagement) / 4);
  document.getElementById('discipline_score_display').textContent = average;
  
  updateScore('universal_0', average);
}

function calculateSOPScore() {
  const sopValue = parseInt(document.getElementById('sop_adherence').value) || 0;
  
  subQuestionData.sop = {
    adherence: sopValue
  };
  
  document.getElementById('sop_score_display').textContent = sopValue;
  
  updateScore('universal_1', sopValue);
}

function calculateSafetyScore() {
  const ppe = parseInt(document.getElementById('safety_ppe').value) || 0;
  const workplace = parseInt(document.getElementById('safety_workplace').value) || 0;
  const equipment = parseInt(document.getElementById('safety_equipment').value) || 0;
  
  subQuestionData.safety = {
    ppe: ppe,
    workplace: workplace,
    equipment: equipment
  };
  
  const average = Math.round((ppe + workplace + equipment) / 3);
  document.getElementById('safety_score_display').textContent = average;
  
  updateScore('universal_2', average);
}

function calculatePunctualityScore() {
  const reporting = parseInt(document.getElementById('punctuality_reporting').value) || 0;
  const lunch = parseInt(document.getElementById('punctuality_lunch').value) || 0;
  const clockout = parseInt(document.getElementById('punctuality_clockout').value) || 0;
  
  subQuestionData.punctuality = {
    reporting: reporting,
    lunch: lunch,
    clockout: clockout
  };
  
  const average = Math.round((reporting + lunch + clockout) / 3);
  document.getElementById('punctuality_score_display').textContent = average;
  
  updateScore('universal_3', average);
}

function updateScore(id, value) {
  value = Math.min(100, Math.max(0, parseFloat(value) || 0));
  scores[id] = value;
  
  const progressBar = document.getElementById('progress_' + id);
  if (progressBar) {
    progressBar.style.width = value + '%';
  }
  
  calculateTotal();
}

function calculateTotal() {
  const deptKPIs = departments[currentDepartment].kpis;
  
  let deptScore = 0;
  deptKPIs.forEach((kpi, index) => {
    const score = scores['dept_' + index] || 0;
    deptScore += (score * kpi.weight) / 100;
  });
  
  let universalScore = 0;
  universalKPIs.forEach((kpi, index) => {
    const score = scores['universal_' + index] || 0;
    universalScore += (score * kpi.weight) / 100;
  });
  
  const finalScore = ((deptScore * 0.5) + (universalScore * 0.5)).toFixed(1);
  
  document.getElementById('totalScore').textContent = finalScore + '%';
  
  const rating = getPerformanceRating(parseFloat(finalScore));
  document.getElementById('rating').textContent = rating.text;
  
  const scoreCard = document.getElementById('scoreCard');
  scoreCard.className = 'score-card ' + rating.class;
}

// =============================================================================
// SAVE TO SHEETS FUNCTION
// =============================================================================

async function saveToSheet() {
  const employeeName = document.getElementById('employeeName').selectedOptions[0]?.text || '';
  const employeeId = document.getElementById('employeeId').value;
  const evaluationWeek = document.getElementById('evaluationWeek').value;
  const supervisorName = document.getElementById('supervisorName').value;
  const productionUnit = document.getElementById('productionUnit').value;
  
  if (!employeeName || !employeeId || !evaluationWeek || !supervisorName) {
    showAlert('Please fill in all employee information fields', 'error');
    return;
  }
  
  if (!productionUnit) {
    showAlert('Please select a production unit', 'error');
    return;
  }
  
  let missingRemarks = false;
  for (let i = 0; i < 4; i++) {
    if (!document.getElementById('dept_' + i + '_remarks').value.trim()) {
      missingRemarks = true;
      break;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (!document.getElementById('universal_' + i + '_remarks').value.trim()) {
      missingRemarks = true;
      break;
    }
  }
  
  if (missingRemarks) {
    showAlert('Please fill in remarks for ALL KPIs', 'error');
    return;
  }
  
  try {
    showLoading(true);
    
    const totalScore = parseFloat(document.getElementById('totalScore').textContent);
    const rating = document.getElementById('rating').textContent;
    const timestamp = new Date().toISOString();
    
    await createSheetIfNotExists(currentDepartment);
    
    let rowData;
    
    if (currentDepartment === 'Maintenance') {
      rowData = [
        timestamp,
        employeeName,
        "'" + employeeId,
        productionUnit,
        evaluationWeek,
        supervisorName,
        scores['dept_0'] || 0,
        document.getElementById('dept_0_remarks').value,
        subQuestionData.deptRatings?.['dept_0'] || 0,
        scores['dept_1'] || 0,
        document.getElementById('dept_1_remarks').value,
        subQuestionData.deptRatings?.['dept_1'] || 0,
        scores['dept_2'] || 0,
        document.getElementById('dept_2_remarks').value,
        subQuestionData.deptRatings?.['dept_2'] || 0,
        scores['dept_3'] || 0,
        document.getElementById('dept_3_remarks').value,
        subQuestionData.deptRatings?.['dept_3'] || 0,
        scores['universal_0'] || 0,
        document.getElementById('universal_0_remarks').value,
        subQuestionData.discipline?.instruction || 0,
        subQuestionData.discipline?.housekeeping || 0,
        subQuestionData.discipline?.teamwork || 0,
        subQuestionData.discipline?.timemanagement || 0,
        scores['universal_1'] || 0,
        document.getElementById('universal_1_remarks').value,
        subQuestionData.sop?.adherence || 0,
        scores['universal_2'] || 0,
        document.getElementById('universal_2_remarks').value,
        subQuestionData.safety?.ppe || 0,
        subQuestionData.safety?.workplace || 0,
        subQuestionData.safety?.equipment || 0,
        scores['universal_3'] || 0,
        document.getElementById('universal_3_remarks').value,
        subQuestionData.punctuality?.reporting || 0,
        subQuestionData.punctuality?.lunch || 0,
        subQuestionData.punctuality?.clockout || 0,
        scores['universal_4'] || 0,
        document.getElementById('universal_4_remarks').value,
        totalScore,
        rating
      ];
    } else {
      rowData = [
        timestamp,
        employeeName,
        "'" + employeeId,
        productionUnit,
        evaluationWeek,
        supervisorName,
        scores['dept_0'] || 0,
        document.getElementById('dept_0_remarks').value,
        scores['dept_1'] || 0,
        document.getElementById('dept_1_remarks').value,
        scores['dept_2'] || 0,
        document.getElementById('dept_2_remarks').value,
        scores['dept_3'] || 0,
        document.getElementById('dept_3_remarks').value,
        scores['universal_0'] || 0,
        document.getElementById('universal_0_remarks').value,
        subQuestionData.discipline?.instruction || 0,
        subQuestionData.discipline?.housekeeping || 0,
        subQuestionData.discipline?.teamwork || 0,
        subQuestionData.discipline?.timemanagement || 0,
        scores['universal_1'] || 0,
        document.getElementById('universal_1_remarks').value,
        subQuestionData.sop?.adherence || 0,
        scores['universal_2'] || 0,
        document.getElementById('universal_2_remarks').value,
        subQuestionData.safety?.ppe || 0,
        subQuestionData.safety?.workplace || 0,
        subQuestionData.safety?.equipment || 0,
        scores['universal_3'] || 0,
        document.getElementById('universal_3_remarks').value,
        subQuestionData.punctuality?.reporting || 0,
        subQuestionData.punctuality?.lunch || 0,
        subQuestionData.punctuality?.clockout || 0,
        scores['universal_4'] || 0,
        document.getElementById('universal_4_remarks').value,
        totalScore,
        rating
      ];
    }
    
    await appendSheetData(currentDepartment, rowData);
    
    showLoading(false);
    showAlert('Evaluation saved successfully! Form will reset.', 'success');
    
    setTimeout(() => {
      resetForm();
    }, 1500);
    
  } catch (err) {
    showLoading(false);
    console.error('Error saving to sheet:', err);
    showAlert('Error saving to sheet: ' + err.message, 'error');
  }
}

function resetForm() {
  document.getElementById('employeeName').value = '';
  document.getElementById('employeeId').value = '';
  document.getElementById('evaluationWeek').value = '';
  document.getElementById('supervisorName').value = '';
  document.getElementById('productionUnit').value = '';
  
  scores = {};
  subQuestionData = {};
  
  const deptKPIs = departments[currentDepartment].kpis;
  deptKPIs.forEach((kpi, index) => {
    if (kpi.type === 'rating') {
      const ratingSelect = document.getElementById('dept_' + index + '_rating');
      if (ratingSelect) ratingSelect.value = '';
      const display = document.getElementById('dept_' + index + '_display');
      if (display) display.textContent = '0';
    } else {
      const input = document.getElementById('dept_' + index);
      if (input) input.value = '';
    }
    const remarks = document.getElementById('dept_' + index + '_remarks');
    if (remarks) remarks.value = '';
    const progress = document.getElementById('progress_dept_' + index);
    if (progress) progress.style.width = '0%';
  });
  
  document.getElementById('discipline_instruction').value = '';
  document.getElementById('discipline_housekeeping').value = '';
  document.getElementById('discipline_teamwork').value = '';
  document.getElementById('discipline_timemanagement').value = '';
  document.getElementById('discipline_score_display').textContent = '0';
  document.getElementById('universal_0_remarks').value = '';
  document.getElementById('progress_universal_0').style.width = '0%';
  
  document.getElementById('sop_adherence').value = '';
  document.getElementById('sop_score_display').textContent = '0';
  document.getElementById('universal_1_remarks').value = '';
  document.getElementById('progress_universal_1').style.width = '0%';
  
  document.getElementById('safety_ppe').value = '';
  document.getElementById('safety_workplace').value = '';
  document.getElementById('safety_equipment').value = '';
  document.getElementById('safety_score_display').textContent = '0';
  document.getElementById('universal_2_remarks').value = '';
  document.getElementById('progress_universal_2').style.width = '0%';
  
  document.getElementById('punctuality_reporting').value = '';
  document.getElementById('punctuality_lunch').value = '';
  document.getElementById('punctuality_clockout').value = '';
  document.getElementById('punctuality_score_display').textContent = '0';
  document.getElementById('universal_3_remarks').value = '';
  document.getElementById('progress_universal_3').style.width = '0%';
  
  document.getElementById('universal_4').value = '';
  document.getElementById('universal_4_remarks').value = '';
  document.getElementById('progress_universal_4').style.width = '0%';
  
  document.getElementById('totalScore').textContent = '0.0%';
  document.getElementById('rating').textContent = 'Not Rated';
  document.getElementById('scoreCard').className = 'score-card';
}

// =============================================================================
// PDF GENERATION
// =============================================================================

function downloadReport() {
  const employeeName = document.getElementById('employeeName').selectedOptions[0]?.text || '';
  const employeeId = document.getElementById('employeeId').value;
  const evaluationWeek = document.getElementById('evaluationWeek').value;
  const supervisorName = document.getElementById('supervisorName').value;
  const productionUnit = document.getElementById('productionUnit').value;
  
  if (!employeeName || !employeeId) {
    showAlert('Please enter employee name and ID', 'error');
    return;
  }
  
  if (!productionUnit) {
    showAlert('Please select a production unit', 'error');
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('STEELWOOL AFRICA LIMITED', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('EMPLOYEE PERFORMANCE EVALUATION REPORT', 105, 23, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let y = 35;
    doc.text('Employee Name: ' + employeeName, 15, y); y += 7;
    doc.text('Employee ID: ' + employeeId, 15, y); y += 7;
    doc.text('Department: ' + currentDepartment, 15, y); y += 7;
    doc.text('Production Unit: ' + productionUnit, 15, y); y += 7;
    doc.text('Week: ' + evaluationWeek, 15, y); y += 7;
    doc.text('Supervisor: ' + supervisorName, 15, y); y += 7;
    doc.text('Date: ' + new Date().toLocaleDateString(), 15, y); y += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DEPARTMENT-SPECIFIC KPIs', 15, y); y += 5;
    
    const deptKPIs = departments[currentDepartment].kpis;
    const deptKPIData = deptKPIs.map((kpi, index) => {
      const score = scores['dept_' + index] || 0;
      const remarks = document.getElementById('dept_' + index + '_remarks').value || '';
      const ratingValue = kpi.type === 'rating' ? (subQuestionData.deptRatings?.['dept_' + index] || 0) : null;
      
      return [
        kpi.name,
        score + '/100',
        kpi.weight + '%',
        ((score * kpi.weight) / 100).toFixed(1),
        ratingValue ? getRatingLabel(ratingValue) + '\n' + remarks : remarks
      ];
    });
    
    doc.autoTable({
      startY: y,
      head: [['KPI', 'Score', 'Weight', 'Weighted', 'Details']],
      body: deptKPIData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 20 },
        2: { cellWidth: 18 },
        3: { cellWidth: 22 },
        4: { cellWidth: 70 }
      }
    });
    
    y = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSAL KPIs', 15, y); y += 5;
    
    const universalKPIData = [
      [
        'Discipline & Work Conduct',
        (scores['universal_0'] || 0) + '/100',
        '30%',
        ((scores['universal_0'] || 0) * 0.30).toFixed(1),
        'Instruction: ' + getRatingLabel(subQuestionData.discipline?.instruction || 0) + '\n' +
        'Housekeeping: ' + getRatingLabel(subQuestionData.discipline?.housekeeping || 0) + '\n' +
        'Teamwork: ' + getRatingLabel(subQuestionData.discipline?.teamwork || 0) + '\n' +
        'Time Mgmt: ' + getRatingLabel(subQuestionData.discipline?.timemanagement || 0)
      ],
      [
        'SOP Adherence',
        (scores['universal_1'] || 0) + '/100',
        '30%',
        ((scores['universal_1'] || 0) * 0.30).toFixed(1),
        'SOP: ' + getRatingLabel(subQuestionData.sop?.adherence || 0)
      ],
      [
        'Safety & PPE',
        (scores['universal_2'] || 0) + '/100',
        '15%',
        ((scores['universal_2'] || 0) * 0.15).toFixed(1),
        'PPE: ' + getRatingLabel(subQuestionData.safety?.ppe || 0) + '\n' +
        'Workplace: ' + getRatingLabel(subQuestionData.safety?.workplace || 0) + '\n' +
        'Equipment: ' + getRatingLabel(subQuestionData.safety?.equipment || 0)
      ],
      [
        'Punctuality',
        (scores['universal_3'] || 0) + '/100',
        '15%',
        ((scores['universal_3'] || 0) * 0.15).toFixed(1),
        'Reporting: ' + getRatingLabel(subQuestionData.punctuality?.reporting || 0) + '\n' +
        'Lunch: ' + getRatingLabel(subQuestionData.punctuality?.lunch || 0) + '\n' +
        'Clockout: ' + getRatingLabel(subQuestionData.punctuality?.clockout || 0)
      ],
      [
        'Attendance',
        (scores['universal_4'] || 0) + '/100',
        '10%',
        ((scores['universal_4'] || 0) * 0.10).toFixed(1),
        'Auto-filled'
      ]
    ];
    
    doc.autoTable({
      startY: y,
      head: [['KPI', 'Score', 'Weight', 'Weighted', 'Details']],
      body: universalKPIData,
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 20 },
        2: { cellWidth: 18 },
        3: { cellWidth: 22 },
        4: { cellWidth: 70 }
      }
    });
    
    y = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('OVERALL PERFORMANCE', 15, y); y += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Score: ' + document.getElementById('totalScore').textContent, 15, y); y += 7;
    doc.text('Rating: ' + rating, 15, y);
    
    const fileName = employeeName.replace(/\s/g, '_') + '_' + 
                    currentDepartment.replace(/\s/g, '_') + '_Week_' + 
                    evaluationWeek + '_Evaluation.pdf';
    doc.save(fileName);
    
    showAlert('PDF downloaded successfully!', 'success');
    
  } catch (err) {
    console.error('Error generating PDF:', err);
    showAlert('Error generating PDF: ' + err.message, 'error');
  }
}

// =============================================================================
// VIEW/LOAD EVALUATION
// =============================================================================

async function loadEvaluation() {
  const empId = document.getElementById('searchEmployeeId').value;
  const dept = document.getElementById('searchDepartment').value;
  const week = document.getElementById('searchWeek').value;
  
  if (!empId || !dept || !week) {
    showAlert('Please enter Employee ID, Department, and Week', 'error');
    return;
  }
  
  try {
    showLoading(true);
    
    const data = await getSheetData(dept, 'A2:AZ1000');
    
    let foundRow = null;
    for (let row of data) {
      if (String(row[2]) === empId && String(row[4]) === week) {
        foundRow = row;
        break;
      }
    }
    
    if (!foundRow) {
      showAlert('No evaluation found', 'error');
      document.getElementById('evalDisplay').classList.remove('show');
      showLoading(false);
      return;
    }
    
    loadedEvalData = {
      employeeName: String(foundRow[1] || ''),
      employeeId: String(foundRow[2] || ''),
      productionUnit: String(foundRow[3] || ''),
      week: String(foundRow[4] || ''),
      supervisor: String(foundRow[5] || ''),
      department: dept
    };
    
    if (dept === 'Maintenance') {
      loadedEvalData.totalScore = Number(foundRow[39]) || 0;
      loadedEvalData.rating = String(foundRow[40] || '');
    } else {
      loadedEvalData.totalScore = Number(foundRow[35]) || 0;
      loadedEvalData.rating = String(foundRow[36] || '');
    }
    
    document.getElementById('dispName').textContent = loadedEvalData.employeeName;
    document.getElementById('dispId').textContent = loadedEvalData.employeeId;
    document.getElementById('dispDept').textContent = dept;
    document.getElementById('dispUnit').textContent = loadedEvalData.productionUnit;
    document.getElementById('dispWeek').textContent = loadedEvalData.week;
    document.getElementById('dispSupervisor').textContent = loadedEvalData.supervisor;
    document.getElementById('dispScore').textContent = loadedEvalData.totalScore + '%';
    document.getElementById('dispRating').textContent = loadedEvalData.rating;
    
    document.getElementById('evalDisplay').classList.add('show');
    
    showLoading(false);
    showAlert('Evaluation loaded successfully!', 'success');
    
  } catch (err) {
    showLoading(false);
    console.error('Error loading evaluation:', err);
    showAlert('Error loading evaluation: ' + err.message, 'error');
  }
}

// =============================================================================
// PLACEHOLDER REPORT FUNCTIONS
// =============================================================================

async function generateCumulative() {
  showAlert('Advanced reports require the Google Apps Script version', 'error');
}

async function generateOverallReport() {
  showAlert('Advanced reports require the Google Apps Script version', 'error');
}

async function generateRankingsReport() {
  showAlert('Advanced reports require the Google Apps Script version', 'error');
}

async function generateUniversalRankingsReport() {
  showAlert('Advanced reports require the Google Apps Script version', 'error');
}

// =============================================================================
// PWA SERVICE WORKER REGISTRATION
// =============================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  });
}

// =============================================================================
// WINDOW LOAD EVENTS
// =============================================================================

window.addEventListener('load', () => {
  gapiLoaded();
  gisLoaded();
});
