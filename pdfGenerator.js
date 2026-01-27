// PDF Generator using jsPDF (loaded from CDN)
// This file handles PDF generation for evaluation reports

function downloadReport() {
  const employeeName = document.getElementById('employeeName').value;
  const employeeId = document.getElementById('employeeId').value;
  const evaluationWeek = document.getElementById('evaluationWeek').value;
  const supervisorName = document.getElementById('supervisorName').value;
  
  if (!employeeName || !employeeId) {
    showAlert('Please enter employee name and ID', 'error');
    return;
  }
  
  const deptKPIs = departments[currentDepartment].kpis;
  const totalScore = document.getElementById('totalScore').textContent;
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
  
  const reportData = {
    employeeName: employeeName,
    employeeId: employeeId,
    department: currentDepartment,
    evaluationWeek: evaluationWeek,
    supervisorName: supervisorName,
    deptKPIs: deptKPIData,
    universalKPIs: universalKPIData,
    totalScore: totalScore,
    rating: rating,
    timestamp: new Date().toLocaleDateString()
  };
  
  generatePDF(reportData);
}

function generatePDF(data) {
  // Check if jsPDF is loaded
  if (typeof jspdf === 'undefined') {
    showAlert('PDF library is loading. Please try again in a moment.', 'error');
    return;
  }
  
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  let yPosition = 20;
  
  // Header
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('STEELWOOL AFRICA LIMITED', 105, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(14);
  doc.text('EMPLOYEE PERFORMANCE EVALUATION REPORT', 105, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Employee Information
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Employee Information:', 20, yPosition);
  
  yPosition += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Employee Name: ${data.employeeName}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Employee ID: ${data.employeeId}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Department: ${data.department}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Evaluation Week: ${data.evaluationWeek || 'N/A'}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Supervisor: ${data.supervisorName || 'N/A'}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Evaluation Date: ${data.timestamp}`, 20, yPosition);
  
  yPosition += 12;
  
  // Department-Specific KPIs
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('DEPARTMENT-SPECIFIC KPIs', 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  data.deptKPIs.forEach(kpi => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${kpi.name}`, 20, yPosition);
    doc.text(`${kpi.score}/100`, 150, yPosition);
    doc.text(`Weight: ${kpi.weight}%`, 170, yPosition);
    yPosition += 6;
  });
  
  yPosition += 8;
  
  // Universal KPIs
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('UNIVERSAL KPIs (All Departments)', 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  data.universalKPIs.forEach(kpi => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${kpi.name}`, 20, yPosition);
    doc.text(`${kpi.score}/100`, 150, yPosition);
    doc.text(`Weight: ${kpi.weight}%`, 170, yPosition);
    yPosition += 6;
  });
  
  yPosition += 12;
  
  // Overall Performance Summary
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('OVERALL PERFORMANCE SUMMARY', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(16);
  doc.text(`Total Score: ${data.totalScore}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Performance Rating: ${data.rating}`, 20, yPosition);
  
  yPosition += 15;
  
  // Rating Scale
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('PERFORMANCE RATING SCALE', 20, yPosition);
  
  yPosition += 6;
  doc.setFont(undefined, 'normal');
  doc.text('90-100%: Outstanding', 20, yPosition);
  yPosition += 5;
  doc.text('80-89%: Exceeds Expectations', 20, yPosition);
  yPosition += 5;
  doc.text('70-79%: Meets Expectations', 20, yPosition);
  yPosition += 5;
  doc.text('60-69%: Needs Improvement', 20, yPosition);
  yPosition += 5;
  doc.text('Below 60%: Unsatisfactory', 20, yPosition);
  
  // Save the PDF
  const filename = `${data.employeeName.replace(/\s/g, '_')}_${data.department.replace(/\s/g, '_')}_${data.evaluationWeek || 'Evaluation'}.pdf`;
  doc.save(filename);
  
  showAlert('PDF report downloaded successfully!', 'success');
}
