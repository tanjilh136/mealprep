// frontend/js/export.js
// This file does NOT use ES modules. Everything is global-scope.
// Assumes getToken() and window.API_BASE are available globally from auth.js.

// ------------------------
// 1. Kitchen Export Today
// ------------------------
async function exportTodayCSV() {
    const token = getToken();
    if (!token) {
        alert("Not logged in");
        return;
    }

    const res = await fetch(`${window.API_BASE}/export/today/csv`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Failed to export today's CSV.");
        return;
    }

    const data = await res.json();

    const blob = new Blob([data.content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = data.filename || "kitchen_today.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}

// ------------------------
// 2. Weekly Export (Admin)
// ------------------------
async function exportWeekCSV() {
    const token = getToken();
    if (!token) {
        alert("Not logged in");
        return;
    }

    const res = await fetch(`${window.API_BASE}/export/week/csv`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Failed to export week CSV.");
        return;
    }

    const data = await res.json();

    const blob = new Blob([data.content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = data.filename || "week_export.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}

// ------------------------
// 3. Driver Sheet (Admin)
// ------------------------
async function exportDriverSheet() {
    const token = getToken();
    if (!token) {
        alert("Not logged in");
        return;
    }

    const res = await fetch(`${window.API_BASE}/export/driver/today`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Failed to export driver sheet.");
        return;
    }

    const data = await res.json();

    const blob = new Blob([data.content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "driver_sheet_today.txt";
    a.click();

    window.URL.revokeObjectURL(url);
}

// Attach to window so HTML buttons can use them
window.exportTodayCSV = exportTodayCSV;
window.exportWeekCSV = exportWeekCSV;
window.exportDriverSheet = exportDriverSheet;
