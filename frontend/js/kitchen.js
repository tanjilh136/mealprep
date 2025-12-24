// frontend/js/kitchen.js
// Kitchen dashboard: list daily deliveries grouped by time blocks + CSV export

const kitchenDateInput       = document.getElementById("kitchenDate");
const kitchenDeliveryListDiv = document.getElementById("kitchenDeliveryList");
const kitchenExportBtn       = document.getElementById("kitchenExportCsv");
const kitchenPrintBtn        = document.getElementById("kitchenPrint");

let kitchenPageInitialized = false;

// =============== INIT ===============
async function initializeKitchenPage() {
    if (kitchenPageInitialized) {
        await loadKitchenDeliveries();
        return;
    }
    kitchenPageInitialized = true;

    if (!ensureLoggedIn()) return;
    const user = window.getCurrentUser && window.getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "kitchen")) {
        alert("Kitchen access only.");
        return;
    }

    // default = today
    const today = new Date();
    if (kitchenDateInput) {
        kitchenDateInput.value = formatKitchenDate(today);
        kitchenDateInput.addEventListener("change", loadKitchenDeliveries);
    }

    // CSV download from backend
    if (kitchenExportBtn) {
        kitchenExportBtn.addEventListener("click", exportKitchenCsv);
    }

    // print current view
    if (kitchenPrintBtn) {
        kitchenPrintBtn.addEventListener("click", () => {
            window.print();
        });
    }

    await loadKitchenDeliveries();
}
window.initializeKitchenPage = initializeKitchenPage;

// Format date YYYY-MM-DD
function formatKitchenDate(date) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

// =============== HELPERS FOR MENU / DISH LABELS ===============

function formatDishLabelKitchen(val) {
    if (!val) return "";
    if (typeof val === "string") return val;

    if (typeof val === "object") {
        if (val.name)        return val.name;
        if (val.label)       return val.label;
        if (val.title)       return val.title;
        if (val.description) return val.description;
        try {
            return JSON.stringify(val);
        } catch {
            return String(val);
        }
    }
    return String(val);
}

function extractDaysFromWeekMenu(weekData) {
    if (!weekData) return [];
    if (Array.isArray(weekData)) return weekData;
    if (Array.isArray(weekData.days)) return weekData.days;
    return [];
}

function findDayMenuFor(dateStr, weekData) {
    const days = extractDaysFromWeekMenu(weekData);
    return (
        days.find((day) => {
            if (day.service_date) return String(day.service_date).slice(0, 10) === dateStr;
            if (day.date)         return String(day.date).slice(0, 10) === dateStr;
            if (day.day_date)     return String(day.day_date).slice(0, 10) === dateStr;
            return false;
        }) || null
    );
}

// This is the important part – keep your A/B → full-name logic
function buildKitchenDishText(booking, dayMenu) {
    // If backend already sends a full label, respect it
    if (booking.dish_label) {
        return booking.dish_label;
    }

    const meals = Number(booking.meals || 0);

    // No menu found for that day
    if (!dayMenu) {
        if (meals >= 2) {
            return "Both dishes (A + B)";
        }
        return booking.dish_choice || "-";
    }

    const labelA = formatDishLabelKitchen(dayMenu.dish_a);
    const labelB = formatDishLabelKitchen(dayMenu.dish_b);

    // 2 meals -> real names of both dishes, comma-separated
    if (meals >= 2) {
        if (labelA && labelB) {
            // Example: "Strogonoff fit (iogurte) + arroz, Sardinhas assadas (época) + legumes"
            return `${labelA}, ${labelB}`;
        }
        if (labelA) return labelA;
        if (labelB) return labelB;
        return "Both dishes (A + B)";
    }

    // 1 meal only
    if (!booking.dish_choice) {
        return "-";
    }

    if (booking.dish_choice === "A") {
        return labelA || "Dish A";
    }
    if (booking.dish_choice === "B") {
        return labelB || "Dish B";
    }

    return booking.dish_choice;
}

// =============== CLIENT / ADDRESS HELPERS (NO EXTRA FETCHES) ===============

function getKitchenClientName(b) {
    if (b.client_name) return b.client_name;
    if (b.user_name)   return b.user_name;
    if (b.user && b.user.name) return b.user.name;

    if (b.user_email) return b.user_email.split("@")[0];
    if (b.user && b.user.email) return b.user.email.split("@")[0];

    return "—";
}

function getKitchenClientPhone(b) {
    if (b.client_phone) return b.client_phone;
    if (b.user_phone)   return b.user_phone;
    if (b.user && b.user.phone) return b.user.phone;
    if (b.user && b.user.phone_number) return b.user.phone_number;
    return "—";
}

function getKitchenAddressText(b) {
    // If backend already sends a combined field
    if (b.address_full) return b.address_full;

    // If backend flattens address_* directly on booking
    const flatParts = [
        b.address_label,
        b.address_line1,
        b.address_city,
        b.address_postal_code,
    ].filter(Boolean);
    if (flatParts.length) return flatParts.join(" – ");

    // If backend sends an address object
    if (b.address && typeof b.address === "object") {
        const parts = [
            b.address.label,
            b.address.line1,
            b.address.city,
            b.address.postal_code,
        ].filter(Boolean);
        if (parts.length) return parts.join(" – ");
    }

    // Fallback: reuse booking.js helper if it exists
    if (typeof window.getAddressDisplayText === "function" && b.address_id) {
        return window.getAddressDisplayText(b.address_id);
    }

    if (b.address_id) return `Address #${b.address_id}`;
    return "—";
}

// =============== LOAD DELIVERIES ===============
// Backend: GET /kitchen/day?day=YYYY-MM-DD -> List[Dict]
async function loadKitchenDeliveries() {
    if (!kitchenDeliveryListDiv || !kitchenDateInput) return;
    if (!ensureLoggedIn()) return;

    const dateStr = kitchenDateInput.value;
    if (!dateStr) {
        kitchenDeliveryListDiv.innerHTML = "<p>Please select a date.</p>";
        return;
    }

    kitchenDeliveryListDiv.innerHTML = "Loading deliveries...";

    try {
        // request kitchen day + menu in parallel
        const [resBookings, resWeekMenu] = await Promise.all([
            fetch(
                `${window.API_BASE}/kitchen/day?day=${encodeURIComponent(dateStr)}`,
                { headers: getAuthHeaders() }
            ),
            fetch(
                `${window.API_BASE}/menu/public-week?week_for=${encodeURIComponent(dateStr)}`
            ),
        ]);

        if (resBookings.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (resBookings.status === 404) {
            kitchenDeliveryListDiv.innerHTML = "<p>No bookings for this day.</p>";
            return;
        }

        if (!resBookings.ok) {
            kitchenDeliveryListDiv.innerHTML = "Failed to load deliveries.";
            return;
        }

        const bookings = await resBookings.json();

        let dayMenu = null;
        if (resWeekMenu.ok) {
            const weekData = await resWeekMenu.json();
            dayMenu = findDayMenuFor(dateStr, weekData);
        }

        renderKitchenDeliveries(bookings, dayMenu);
    } catch (err) {
        console.error("loadKitchenDeliveries error:", err);
        kitchenDeliveryListDiv.innerHTML = "Error loading deliveries.";
    }
}

// Group bookings by time_block
function groupByTimeBlock(bookings) {
    const groups = {};
    bookings.forEach((b) => {
        const slot = b.time_block || "Unknown";
        if (!groups[slot]) groups[slot] = [];
        groups[slot].push(b);
    });
    return groups;
}

// =============== RENDER UI ===============
function renderKitchenDeliveries(bookings, dayMenu) {
    kitchenDeliveryListDiv.innerHTML = "";

    if (!bookings || bookings.length === 0) {
        kitchenDeliveryListDiv.innerHTML = "<p>No deliveries for this day.</p>";
        return;
    }

    const groups = groupByTimeBlock(bookings);

    Object.keys(groups)
        .sort() // chronological order
        .forEach((slot) => {
            const slotBlock = document.createElement("div");
            slotBlock.className = "kitchen-slot-block";

            const title = document.createElement("h3");
            title.textContent = `Time Block: ${slot}`;
            slotBlock.appendChild(title);

            const table = document.createElement("table");
            table.className = "kitchen-table";

            const header = document.createElement("tr");
            header.innerHTML = `
                <th>#</th>
                <th>Meals</th>
                <th>Dishes</th>
                <th>Client</th>
                <th>Phone</th>
                <th>Address</th>
            `;
            table.appendChild(header);

            groups[slot].forEach((b, idx) => {
                const tr = document.createElement("tr");

                const dishText     = buildKitchenDishText(b, dayMenu);
                const clientName   = getKitchenClientName(b);
                const clientPhone  = getKitchenClientPhone(b);
                const addressText  = getKitchenAddressText(b);

                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${b.meals}</td>
                    <td>${dishText}</td>
                    <td>${clientName}</td>
                    <td>${clientPhone}</td>
                    <td>${addressText}</td>
                `;

                table.appendChild(tr);
            });

            slotBlock.appendChild(table);
            kitchenDeliveryListDiv.appendChild(slotBlock);
        });
}

// =============== EXPORT CSV (backend) ===============
// Uses backend route: GET /kitchen/export/day?service_date=YYYY-MM-DD
async function exportKitchenCsv() {
    if (!ensureLoggedIn()) return;

    const dateStr = kitchenDateInput.value;
    if (!dateStr) {
        alert("Select a date first.");
        return;
    }

    try {
        const url =
            `${window.API_BASE}/kitchen/export/day?service_date=${encodeURIComponent(
                dateStr
            )}`;

        const res = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            console.error(
                "Failed to download kitchen CSV:",
                res.status,
                await res.text()
            );
            alert("Failed to download kitchen CSV.");
            return;
        }

        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `kitchen_${dateStr}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Error downloading kitchen CSV:", err);
        alert("Error downloading kitchen CSV.");
    }
}
