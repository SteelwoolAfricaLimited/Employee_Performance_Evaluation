/* ===============================
   CONFIG
================================ */
const API_URL = "https://script.google.com/macros/s/AKfycbxMNQBfj1UR4smtdH_Cjp9xNghU_fUEiOTd3XSTtYuS31qaFBBuHrtb5xfaISlcsV28Zg/exec";

/* ===============================
   CORE API CALL
================================ */
function callAPI(action, payload = {}) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  }).then(res => res.json());
}

/* ===============================
   SAVE EVALUATION
================================ */
function saveEvaluation(data) {
  return callAPI("saveEvaluation", { payload: data });
}

/* ===============================
   GENERATE WEEKLY PDF
================================ */
function generatePDF(data) {
  return callAPI("generatePDF", { payload: data })
    .then(res => {
      if (res.success) window.open(res.fileUrl, "_blank");
      else alert(res.message);
    });
}

/* ===============================
   LOAD WEEKS
================================ */
function loadWeeks(employeeId, department) {
  return callAPI("getWeeks", { empId: employeeId, dept: department });
}

/* ===============================
   LOAD EVALUATION
================================ */
function loadEvaluation(employeeId, week, department) {
  return callAPI("getEvaluation", {
    empId: employeeId,
    week: week,
    dept: department
  });
}

/* ===============================
   GENERATE CUMULATIVE PDF
================================ */
function generateCumulative(employeeId, department) {
  return callAPI("cumulative", {
    empId: employeeId,
    dept: department
  }).then(res => {
    if (res.success) window.open(res.fileUrl, "_blank");
    else alert(res.message);
  });
}

/* ===============================
   SERVICE WORKER REGISTRATION
================================ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("SW registration failed:", err));
  });
}
