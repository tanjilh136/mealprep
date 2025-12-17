// frontend/js/admin.js
// Admin panel: regions + weekly menu planning (aligned with FastAPI backend)

const regionForm = document.getElementById("regionForm");
const regionIdInput = document.getElementById("regionId");
const regionNameInput = document.getElementById("regionName");
const regionNotesInput = document.getElementById("regionNotes");
const regionListBody = document.getElementById("regionList");

const menuPlanListDiv = document.getElementById("menuPlanList");

let adminInitialized = false;

// =============== INIT ===============
async function initializeAdminPage() {
    if (adminInitialized) {
        await loadRegions();
        await loadMenuPlan();
        return;
    }
    adminInitialized = true;

    if (!ensureLoggedIn()) return;
    const user = window.getCurrentUser && window.getCurrentUser();
    if (!user || user.role !== "admin") {
        alert("Admin only.");
        return;
    }

    if (regionForm) {
        regionForm.addEventListener("submit", handleRegionSubmit);
    }

    // set up export buttons once
    setupAdminExports();

    await loadRegions();
    await loadMenuPlan();
}
window.initializeAdminPage = initializeAdminPage;

// =============== REGIONS ===============

// GET /regions
async function loadRegions() {
    if (!regionListBody) return;
    if (!ensureLoggedIn()) return;

    try {
        const res = await fetch(`${API_BASE}/regions`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            console.error("Failed to load regions", res.status);
            regionListBody.innerHTML = "";
            return;
        }

        const regions = await res.json();
        renderRegionList(regions);

    } catch (err) {
        console.error("loadRegions error:", err);
    }
}

function renderRegionList(regions) {
    regionListBody.innerHTML = "";

    if (!regions || regions.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.textContent = "No regions defined.";
        tr.appendChild(td);
        regionListBody.appendChild(tr);
        return;
    }

    regions.forEach(r => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = r.name || "";

        const notesTd = document.createElement("td");
        notesTd.textContent = r.description || "";

        const actionsTd = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.type = "button";
        editBtn.addEventListener("click", () => fillRegionForm(r));

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.type = "button";
        delBtn.addEventListener("click", () => deleteRegion(r.id));

        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(delBtn);

        tr.appendChild(nameTd);
        tr.appendChild(notesTd);
        tr.appendChild(actionsTd);

        regionListBody.appendChild(tr);
    });
}

function fillRegionForm(region) {
    regionIdInput.value = region.id;
    regionNameInput.value = region.name || "";
    regionNotesInput.value = region.description || "";
}

function resetRegionForm() {
    regionIdInput.value = "";
    regionNameInput.value = "";
    regionNotesInput.value = "";
}

async function handleRegionSubmit(e) {
    e.preventDefault();
    if (!ensureLoggedIn()) return;

    const id = regionIdInput.value;
    const name = regionNameInput.value.trim();
    const notes = regionNotesInput.value.trim();

    if (!name) {
        alert("Region name is required.");
        return;
    }

    const payload = { name, description: notes || null };

    const url = id
        ? `${API_BASE}/regions/${id}`
        : `${API_BASE}/regions`;
    const method = id ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(errData.detail || "Failed to save region.");
            return;
        }

        resetRegionForm();
        loadRegions();

    } catch (err) {
        console.error("handleRegionSubmit error:", err);
        alert("Network error while saving region.");
    }
}

async function deleteRegion(id) {
    if (!ensureLoggedIn()) return;
    if (!confirm("Delete this region?")) return;

    try {
        const res = await fetch(`${API_BASE}/regions/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(errData.detail || "Failed to delete region.");
            return;
        }

        loadRegions();

    } catch (err) {
        console.error("deleteRegion error:", err);
        alert("Network error while deleting region.");
    }
}

// =============== MENU PLAN (ADMIN) ===============

// service-week helper: Wed–Tue for a given base date
function getServiceWeekRange(baseDate) {
    const d = new Date(baseDate);
    const weekday = d.getDay(); // Sun=0, Mon=1, Tue=2, Wed=3, ...
    const distanceToWed = (weekday - 3 + 7) % 7; // days back to Wednesday
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - distanceToWed);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return { weekStart, weekEnd };
}

function toYMD(d) {
    return d.toISOString().split("T")[0];
}

async function loadMenuPlan() {
    if (!menuPlanListDiv) return;
    if (!ensureLoggedIn()) return;

    menuPlanListDiv.innerHTML = "Loading menu plan...";

    try {
        const { weekStart, weekEnd } = getServiceWeekRange(new Date());
        const startStr = toYMD(weekStart);
        const endStr = toYMD(weekEnd);

        const res = await fetch(
            `${API_BASE}/admin/menu?start=${startStr}&end=${endStr}`,
            {
                method: "GET",
                headers: getAuthHeaders(),
            }
        );

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            menuPlanListDiv.textContent = "Failed to load menu plan.";
            return;
        }

        const days = await res.json();
        renderMenuPlan(days);

    } catch (err) {
        console.error("loadMenuPlan error:", err);
        menuPlanListDiv.textContent = "Error loading menu plan.";
    }
}

function renderMenuPlan(days) {
    menuPlanListDiv.innerHTML = "";

    // simple day-edit form
    const form = document.createElement("form");
    form.className = "menu-day-form";

    const hiddenId = document.createElement("input");
    hiddenId.type = "hidden";
    hiddenId.id = "menuDayId";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "menuDayDate";

    const dishAInput = document.createElement("input");
    dishAInput.type = "text";
    dishAInput.id = "menuDishA";
    dishAInput.placeholder = "Dish A name";

    const kcalAInput = document.createElement("input");
    kcalAInput.type = "number";
    kcalAInput.id = "menuKcalA";
    kcalAInput.placeholder = "A kcal";

    const dishBInput = document.createElement("input");
    dishBInput.type = "text";
    dishBInput.id = "menuDishB";
    dishBInput.placeholder = "Dish B name";

    const kcalBInput = document.createElement("input");
    kcalBInput.type = "number";
    kcalBInput.id = "menuKcalB";
    kcalBInput.placeholder = "B kcal";

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.textContent = "Save Day";

    form.appendChild(hiddenId);
    form.appendChild(dateInput);
    form.appendChild(dishAInput);
    form.appendChild(kcalAInput);
    form.appendChild(dishBInput);
    form.appendChild(kcalBInput);
    form.appendChild(saveBtn);

    form.addEventListener("submit", handleMenuDaySubmit);

    menuPlanListDiv.appendChild(form);

    // existing days for current week
    const table = document.createElement("table");
    table.className = "menu-admin-table";

    const header = document.createElement("tr");
    header.innerHTML = `
        <th>Date</th>
        <th>Dish A</th>
        <th>Dish B</th>
        <th></th>
    `;
    table.appendChild(header);

    if (!days || days.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 4;
        td.textContent = "No menu set for this service week.";
        tr.appendChild(td);
        table.appendChild(tr);
    } else {
        days.forEach(day => {
            const tr = document.createElement("tr");

            const dateTd = document.createElement("td");
            const d = new Date(day.date);
            dateTd.textContent = d.toLocaleDateString("pt-PT", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit"
            });

            const dishATd = document.createElement("td");
            dishATd.textContent = day.dish_a || "";

            const dishBTd = document.createElement("td");
            dishBTd.textContent = day.dish_b || "";

            const actionsTd = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => fillMenuDayForm(day));

            actionsTd.appendChild(editBtn);

            tr.appendChild(dateTd);
            tr.appendChild(dishATd);
            tr.appendChild(dishBTd);
            tr.appendChild(actionsTd);

            table.appendChild(tr);
        });
    }

    menuPlanListDiv.appendChild(table);
}

function fillMenuDayForm(day) {
    const idInput = document.getElementById("menuDayId");
    const dateInput = document.getElementById("menuDayDate");
    const dishAInput = document.getElementById("menuDishA");
    const kcalAInput = document.getElementById("menuKcalA");
    const dishBInput = document.getElementById("menuDishB");
    const kcalBInput = document.getElementById("menuKcalB");

    if (!dateInput) return;

    idInput.value = day.id || "";
    // FastAPI returns ISO date; if it's not plain YYYY-MM-DD, slice it
    const iso = typeof day.date === "string" ? day.date : new Date(day.date).toISOString();
    dateInput.value = iso.split("T")[0];
    dishAInput.value = day.dish_a || "";
    kcalAInput.value = day.calories_a || "";
    dishBInput.value = day.dish_b || "";
    kcalBInput.value = day.calories_b || "";
}

async function handleMenuDaySubmit(e) {
    e.preventDefault();
    if (!ensureLoggedIn()) return;

    const dateInput = document.getElementById("menuDayDate");
    const dishAInput = document.getElementById("menuDishA");
    const kcalAInput = document.getElementById("menuKcalA");
    const dishBInput = document.getElementById("menuDishB");
    const kcalBInput = document.getElementById("menuKcalB");

    const date = dateInput.value;
    const dish_a = dishAInput.value.trim();
    const dish_b = dishBInput.value.trim();
    const calories_a = kcalAInput.value ? parseInt(kcalAInput.value, 10) : null;
    const calories_b = kcalBInput.value ? parseInt(kcalBInput.value, 10) : null;

    if (!date) {
        alert("Date is required.");
        return;
    }
    if (!dish_a && !dish_b) {
        alert("At least one dish must be set.");
        return;
    }

    const payload = {
        date,
        dish_a,
        dish_b,
        calories_a,
        calories_b
    };

    try {
        // Backend upserts by date on POST /admin/menu
        const res = await fetch(`${API_BASE}/admin/menu`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(errData.detail || "Failed to save menu day.");
            return;
        }

        // Clear form
        document.getElementById("menuDayId").value = "";
        dateInput.value = "";
        dishAInput.value = "";
        kcalAInput.value = "";
        dishBInput.value = "";
        kcalBInput.value = "";

        loadMenuPlan();

    } catch (err) {
        console.error("handleMenuDaySubmit error:", err);
        alert("Network error while saving menu day.");
    }
}

// =====================
// Admin CSV export logic
// =====================

async function adminDownloadCsv(path, filename) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            console.error("Failed to download admin CSV:", res.status, await res.text());
            alert("Failed to download CSV.");
            return;
        }

        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Error downloading admin CSV:", err);
        alert("Error downloading CSV.");
    }
}

function setupAdminExports() {
    const clientsBtn = document.getElementById("admin-export-clients-btn");
    const bookingsBtn = document.getElementById("admin-export-bookings-btn");
    const weekInput = document.getElementById("admin-export-week-start");

    if (clientsBtn) {
        clientsBtn.addEventListener("click", () => {
            adminDownloadCsv("/admin/export/clients", "clients.csv");
        });
    }

    if (bookingsBtn && weekInput) {
        bookingsBtn.addEventListener("click", () => {
            const weekStart = weekInput.value;
            if (!weekStart) {
                alert("Select the Monday of the week first.");
                return;
            }

            const path =
                "/admin/export/bookings?service_week_start=" +
                encodeURIComponent(weekStart);
            const filename = "bookings_" + weekStart + ".csv";

            adminDownloadCsv(path, filename);
        });
    }
}
