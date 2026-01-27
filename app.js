/* ==========================
   CONFIG
========================== */
const API_URL = "https://script.google.com/macros/s/AKfycbxMNQBfj1UR4smtdH_Cjp9xNghU_fUEiOTd3XSTtYuS31qaFBBuHrtb5xfaISlcsV28Zg/exec";

/* ==========================
   API HELPER
========================== */
function callAPI(action, payload = {}) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  }).then(res => res.json());
}

/* ==========================
   DOWNLOAD / SAVE
========================== */
function downloadReport() {
  const data = collectReportData();
  if (!data) return;

  callAPI("generatePDF", { payload: data })
    .then(res => {
      if (res.success) window.open(res.fileUrl, "_blank");
      else showAlert(res.message, "error");
    })
    .catch(err => showAlert(err.toString(), "error"));
}

function saveToSheet() {
  const data = collectSaveData();
  if (!data) return;

  callAPI("saveEvaluation", { payload: data })
    .then(res => {
      if (res.success) {
        showAlert(res.message, "success");
        resetForm();
      } else {
        showAlert(res.message, "error");
      }
    })
    .catch(err => showAlert(err.toString(), "error"));
}

/* ==========================
   VIEW / LOAD
========================== */
function loadWeeksForEmployee() {
  const empId = document.getElementById("searchEmployeeId").value;
  const dept = document.getElementById("searchDepartment").value;
  if (!empId || !dept) return;

  callAPI("getWeeks", { empId, dept })
    .then(weeks => {
      const sel = document.getElementById("searchWeek");
      sel.innerHTML = '<option value="">Select week</option>';
      weeks.forEach(w => (sel.innerHTML += `<option value="${w}">${w}</option>`));
      sel.disabled = false;
    })
    .catch(err => showAlert(err.toString(), "error"));
}

function loadEvaluation() {
  const empId = document.getElementById("searchEmployeeId").value;
  const dept = document.getElementById("searchDepartment").value;
  const week = document.getElementById("searchWeek").value;
  if (!empId || !dept || !week) {
    showAlert("Please select all fields", "error");
    return;
  }

  callAPI("getEvaluation", { empId, dept, week })
    .then(res => {
      if (!res.success) return showAlert(res.message, "error");

      const d = res.data;
      document.getElementById("dispName").textContent = d.employeeName;
      document.getElementById("dispId").textContent = d.employeeId;
      document.getElementById("dispDept").textContent = dept;
      document.getElementById("dispWeek").textContent = d.week;
      document.getElementById("dispSupervisor").textContent = d.supervisor;
      document.getElementById("dispScore").textContent = d.totalScore + "%";
      document.getElementById("dispRating").textContent = d.rating;
      document.getElementById("evalDisplay").classList.add("show");
    })
    .catch(err => showAlert(err.toString(), "error"));
}

/* ==========================
   CUMULATIVE
========================== */
function generateCumulative() {
  const empId = document.getElementById("cumulativeEmployeeId").value;
  const dept = document.getElementById("cumulativeDepartment").value;
  if (!empId || !dept) {
    showAlert("Please enter Employee ID and Department", "error");
    return;
  }

  callAPI("cumulative", { empId, dept })
    .then(res => {
      if (res.success) window.open(res.fileUrl, "_blank");
      else showAlert(res.message, "error");
    })
    .catch(err => showAlert(err.toString(), "error"));
}

/* ==========================
   SUPPORTING HELPERS (UI)
========================== */
function showAlert(msg, type) {
  const a = document.getElementById("alert");
  a.textContent = msg;
  a.className = `alert ${type} show`;
  setTimeout(() => a.classList.remove("show"), 4000);
}
