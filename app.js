// Department KPI Definitions
const departments = {
  'Production Steelex': {
    kpis: [
      { name: 'Daily Production Target Achievement', weight: 40 },
      { name: 'Product Quality (Defect Rate)', weight: 30 },
      { name: 'Machine Utilization Efficiency', weight: 20 },
      { name: 'Raw Material Wastage Control', weight: 10 }
    ]
  },
  'Production Steelwool': {
    kpis: [
      { name: 'Daily Production Volume vs Target', weight: 40 },
      { name: 'Quality Standards Compliance', weight: 30 },
      { name: 'Production Line Efficiency', weight: 20 },
      { name: 'Scrap/Waste Minimization', weight: 10 }
    ]
  },
  'Production Electrodes': {
    kpis: [
      { name: 'Production Output Achievement', weight: 40 },
      { name: 'Product Specification Adherence', weight: 30 },
      { name: 'Machine Runtime/Availability Ratio', weight: 20 },
      { name: 'Machine Utilisation Efficiency', weight: 10 }
    ]
  },
  'Inventory': {
    kpis: [
      { name: 'Stock Accuracy (Physical vs System)', weight: 40 },
      { name: 'Timely Stock Replenishment', weight: 30 },
      { name: 'Proper Documentation & Records', weight: 20 },
      { name: 'Storage & Organization Standards', weight: 10 }
    ]
  },
  'Maintenance': {
    kpis: [
      { name: 'Preventive Maintenance Schedule Completion', weight: 40 },
      { name: 'Equipment Breakdown Response Time', weight: 30 },
      { name: 'Maintenance Quality (Repeat Failures)', weight: 20 },
      { name: 'Tools & Equipment Management', weight: 10 }
    ]
  }
};

const universalKPIs = [
  { name: 'Discipline & Work Conduct', weight: 30 },
  { name: 'SOP Adherence', weight: 30 },
  { name: 'Safety Compliance & PPE Usage', weight: 15 },
  { name: 'Punctuality (On-time Reporting)', weight: 15 },
  { name: 'Attendance (Days Present)', weight: 10 }
];

let currentDepartment = 'Production Steelex';
let scores = {};

// LocalStorage Manager
const storage = {
  saveEvaluation(data) {
    const evaluations = this.getAllEvaluations();
    evaluations.push({
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('steelwool_evaluations', JSON.stringify(evaluations));
  },
  
  getAllEvaluations() {
    const data = localStorage.getItem('steelwool_evaluations');
    return data ? JSON.parse(data) : [];
  },
  
  getEvaluation(id) {
    const evaluations = this.getAllEvaluations();
    return evaluations.find(e => e.id === id);
  },
  
  deleteEvaluation(id) {
    const evaluations = this.getAllEvaluations();
    const filtered = evaluations.filter(e => e.id !== id);
    localStorage.setItem('steelwool_evaluations', JSON.stringify(filtered));
  },
  
  clearAll() {
    localStorage.removeItem('steelwool_evaluations');
  }
};

// Tab Switching
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
  
  // Load data when switching to relevant tabs
  if (tabName === 'view-eval') {
    loadEvaluationsList();
  } else if (tabName === 'export') {
    updateExportStats();
  }
}

// Initialize
function init() {
  renderDepartmentKPIs();
  renderUniversalKPIs();
  
  // Check if offline
  if (!navigator.onLine) {
    document.getElementById('offline-indicator').classList.add('show');
  }
}

function selectDepartment(dept) {
  currentDepartment = dept;
  
  document.querySelectorAll('.dept-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === dept) {
      btn.classList.add('active');
    }
  });
  
  renderDepartmentKPIs();
  calculateTotal();
}

function renderDepartmentKPIs() {
  const container = document.getElementById('deptKPIs');
  const kpis = departments[currentDepartment].kpis;
  
  container.innerHTML = kpis.map((kpi, index) => `
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
    </div>
  `).join('');
}

function renderUniversalKPIs() {
  const container = document.getElementById('universalKPIs');
  
  container.innerHTML = universalKPIs.map((kpi, index) => `
    <div class="kpi-item">
      <div class="kpi-header">
        <div class="kpi-info">
          <h3>${kpi.name}</h3>
          <p>Weight: ${kpi.weight}%</p>
        </div>
        <input type="number" 
               class="kpi-score-input" 
               id="universal_${index}"
               min="0" 
               max="100" 
               placeholder="0-100"
               onchange="updateScore('universal_${index}', this.value)">
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress_universal_${index}" style="width: 0%"></div>
      </div>
    </div>
  `).join('');
}

function updateScore(id, value) {
  value = Math.min(100, Math.max(0, parseInt(value) || 0));
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

function getPerformanceRating(score) {
  if (score >= 90) return { text: 'Outstanding', class: 'outstanding' };
  if (score >= 80) return { text: 'Exceeds Expectations', class: 'exceeds' };
  if (score >= 70) return { text: 'Meets Expectations', class: 'meets' };
  if (score >= 60) return { text: 'Needs Improvement', class: 'needs' };
  return { text: 'Unsatisfactory', class: 'unsatisfactory' };
}

function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = 'alert ' + type + ' show';
  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

function saveEvaluation() {
  const employeeName = document.getElementById('employeeName').value;
  const employeeId = document.getElementById('employeeId').value;
  const evaluationWeek = document.getElementById('evaluationWeek').value;
  const supervisorName = document.getElementById('supervisorName').value;
  
  if (!employeeName || !employeeId || !evaluationWeek || !supervisorName) {
    showAlert('Please fill in all employee information fields', 'error');
    return;
  }
  
  const deptKPIs = departments[currentDepartment].kpis;
  const totalScore = parseFloat(document.getElementById('totalScore').textContent);
  const rating = document.getElementById('rating').textContent;
  
  const deptKPIData = deptKPIs.map((kpi, index) => {
    const score = scores['dept_' + index] || 0;
    return {
      name: kpi.name,
      score: score,
      weight: kpi.weight,
      weighted: ((score * kpi.weight) / 100).toFixed(1)
    };
  });
  
  const universalKPIData = universalKPIs.map((kpi, index) => {
    const score = scores['universal_' + index] || 0;
    return {
      name: kpi.name,
      score: score,
      weight: kpi.weight,
      weighted: ((score * kpi.weight) / 100).toFixed(1)
    };
  });
  
  const evaluationData = {
    employeeName,
    employeeId,
    department: currentDepartment,
    evaluationWeek,
    supervisorName,
    deptKPIs: deptKPIData,
    universalKPIs: universalKPIData,
    totalScore,
    rating
  };
  
  storage.saveEvaluation(evaluationData);
  showAlert('Evaluation saved successfully! Form cleared for next evaluation.', 'success');
  
  setTimeout(() => {
    resetForm();
  }, 1500);
}

function resetForm() {
  document.getElementById('employeeName').value = '';
  document.getElementById('employeeId').value = '';
  document.getElementById('evaluationWeek').value = '';
  document.getElementById('supervisorName').value = '';
  
  scores = {};
  
  const deptKPIs = departments[currentDepartment].kpis;
  deptKPIs.forEach((kpi, index) => {
    const input = document.getElementById('dept_' + index);
    if (input) input.value = '';
    const progress = document.getElementById('progress_dept_' + index);
    if (progress) progress.style.width = '0%';
  });
  
  universalKPIs.forEach((kpi, index) => {
    const input = document.getElementById('universal_' + index);
    if (input) input.value = '';
    const progress = document.getElementById('progress_universal_' + index);
    if (progress) progress.style.width = '0%';
  });
  
  document.getElementById('totalScore').textContent = '0.0%';
  document.getElementById('rating').textContent = 'Not Rated';
  document.getElementById('scoreCard').className = 'score-card';
}

// Load Evaluations List
function loadEvaluationsList() {
  const container = document.getElementById('evaluationsList');
  const evaluations = storage.getAllEvaluations();
  
  if (evaluations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No Evaluations Found</h3>
        <p>Start by creating a new evaluation in the "New Evaluation" tab.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = evaluations
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(eval => `
      <div class="evaluation-card">
        <div class="evaluation-header">
          <div class="evaluation-info">
            <h4>${eval.employeeName} (${eval.employeeId})</h4>
            <p>${eval.department} - ${eval.evaluationWeek}</p>
          </div>
          <div class="evaluation-score">
            <div class="score">${eval.totalScore}%</div>
            <div class="rating">${eval.rating}</div>
          </div>
        </div>
        <div class="evaluation-meta">
          <span>Supervisor: ${eval.supervisorName}</span>
          <span>Date: ${new Date(eval.timestamp).toLocaleDateString()}</span>
        </div>
        <div class="evaluation-actions">
          <button onclick="viewEvaluation(${eval.id})">📄 View Details</button>
          <button onclick="downloadEvaluationPDF(${eval.id})">⬇ Download PDF</button>
          <button onclick="deleteEvaluation(${eval.id})" style="color: #dc2626;">🗑️ Delete</button>
        </div>
      </div>
    `).join('');
}

function filterEvaluations() {
  const query = document.getElementById('searchQuery').value.toLowerCase();
  const dept = document.getElementById('filterDepartment').value;
  
  const container = document.getElementById('evaluationsList');
  const evaluations = storage.getAllEvaluations();
  
  const filtered = evaluations.filter(eval => {
    const matchesQuery = eval.employeeName.toLowerCase().includes(query) || 
                        eval.employeeId.toLowerCase().includes(query);
    const matchesDept = !dept || eval.department === dept;
    return matchesQuery && matchesDept;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No Matching Evaluations</h3>
        <p>Try adjusting your search criteria.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(eval => `
      <div class="evaluation-card">
        <div class="evaluation-header">
          <div class="evaluation-info">
            <h4>${eval.employeeName} (${eval.employeeId})</h4>
            <p>${eval.department} - ${eval.evaluationWeek}</p>
          </div>
          <div class="evaluation-score">
            <div class="score">${eval.totalScore}%</div>
            <div class="rating">${eval.rating}</div>
          </div>
        </div>
        <div class="evaluation-meta">
          <span>Supervisor: ${eval.supervisorName}</span>
          <span>Date: ${new Date(eval.timestamp).toLocaleDateString()}</span>
        </div>
        <div class="evaluation-actions">
          <button onclick="viewEvaluation(${eval.id})">📄 View Details</button>
          <button onclick="downloadEvaluationPDF(${eval.id})">⬇ Download PDF</button>
          <button onclick="deleteEvaluation(${eval.id})" style="color: #dc2626;">🗑️ Delete</button>
        </div>
      </div>
    `).join('');
}

function viewEvaluation(id) {
  const evaluation = storage.getEvaluation(id);
  if (!evaluation) return;
  
  let details = `
    Employee: ${evaluation.employeeName} (${evaluation.employeeId})
    Department: ${evaluation.department}
    Week: ${evaluation.evaluationWeek}
    Supervisor: ${evaluation.supervisorName}
    Total Score: ${evaluation.totalScore}%
    Rating: ${evaluation.rating}
    
    Department KPIs:
  `;
  
  evaluation.deptKPIs.forEach(kpi => {
    details += `\n  - ${kpi.name}: ${kpi.score}/100 (Weight: ${kpi.weight}%)`;
  });
  
  details += '\n\nUniversal KPIs:';
  evaluation.universalKPIs.forEach(kpi => {
    details += `\n  - ${kpi.name}: ${kpi.score}/100 (Weight: ${kpi.weight}%)`;
  });
  
  alert(details);
}

function deleteEvaluation(id) {
  if (confirm('Are you sure you want to delete this evaluation? This action cannot be undone.')) {
    storage.deleteEvaluation(id);
    showAlert('Evaluation deleted successfully', 'success');
    loadEvaluationsList();
    updateExportStats();
  }
}

function downloadEvaluationPDF(id) {
  const evaluation = storage.getEvaluation(id);
  if (!evaluation) {
    showAlert('Evaluation not found', 'error');
    return;
  }
  
  generatePDF(evaluation);
}

// Export Functions
function updateExportStats() {
  const evaluations = storage.getAllEvaluations();
  const uniqueEmployees = new Set(evaluations.map(e => e.employeeId)).size;
  
  document.getElementById('totalEvaluations').textContent = evaluations.length;
  document.getElementById('totalEmployees').textContent = uniqueEmployees;
}

function exportToCSV() {
  const evaluations = storage.getAllEvaluations();
  
  if (evaluations.length === 0) {
    showAlert('No evaluations to export', 'error');
    return;
  }
  
  let csv = 'Timestamp,Employee Name,Employee ID,Department,Week,Supervisor,Total Score,Rating\n';
  
  evaluations.forEach(eval => {
    csv += `"${eval.timestamp}","${eval.employeeName}","${eval.employeeId}","${eval.department}","${eval.evaluationWeek}","${eval.supervisorName}","${eval.totalScore}","${eval.rating}"\n`;
  });
  
  downloadFile(csv, 'steelwool_evaluations.csv', 'text/csv');
  showAlert('CSV file downloaded successfully', 'success');
}

function exportToJSON() {
  const evaluations = storage.getAllEvaluations();
  
  if (evaluations.length === 0) {
    showAlert('No evaluations to export', 'error');
    return;
  }
  
  const json = JSON.stringify(evaluations, null, 2);
  downloadFile(json, 'steelwool_evaluations.json', 'application/json');
  showAlert('JSON file downloaded successfully', 'success');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function clearAllData() {
  if (confirm('Are you sure you want to clear ALL evaluation data? This action cannot be undone and all saved evaluations will be permanently deleted.')) {
    if (confirm('This is your final warning. Click OK to permanently delete all data.')) {
      storage.clearAll();
      showAlert('All data has been cleared', 'success');
      loadEvaluationsList();
      updateExportStats();
    }
  }
}

// Initialize on load
window.onload = init;
