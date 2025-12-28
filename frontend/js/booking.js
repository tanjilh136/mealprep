// frontend/js/booking.js



// state
let bookingInitialized = false;
// total meals booked per delivery_date in current service week (only active bookings)
let bookedMealsByDate = {};

let bookingWeekMenu = null;   // cache weekly menu for dish labels
let bookingAddressCache = []; // cache client addresses for table display


// DOM
const bookingDateSelect = document.getElementById("bookingDate");
const bookingMealsSelect = document.getElementById("bookingMeals");
const bookingDishSelect = document.getElementById("bookingDish");
const bookingAddressSelect = document.getElementById("bookingAddress");
const bookingSlotSelect = document.getElementById("bookingSlot");
const bookingForm = document.getElementById("bookingForm");
const bookingTableBody = document.getElementById("bookingTableBody");
const bookingPricingDiv = document.getElementById("bookingPricing");


// ----------------------------------
// TIME BLOCKS (MUST MATCH BACKEND)
// Backend expects: "HH:MM-HH:MM"
// ----------------------------------
function generateBlocks(startHHMM, endHHMM, intervalMinutes) {
    const [sh, sm] = startHHMM.split(":").map(Number);
    const [eh, em] = endHHMM.split(":").map(Number);

    const blocks = [];
    let h = sh;
    let m = sm;

    while (h < eh || (h === eh && m < em)) {
        const startH = String(h).padStart(2, "0");
        const startM = String(m).padStart(2, "0");

        const endDate = new Date(2000, 0, 1, h, m + intervalMinutes);
        const endH = String(endDate.getHours()).padStart(2, "0");
        const endM = String(endDate.getMinutes()).padStart(2, "0");

        blocks.push(`${startH}:${startM}-${endH}:${endM}`);

        m += intervalMinutes;
        if (m >= 60) {
            h += 1;
            m -= 60;
        }
    }
    return blocks;
}

const LUNCH_BLOCKS = generateBlocks("11:30", "14:00", 15);
const DINNER_BLOCKS = generateBlocks("18:00", "21:00", 15);


// ----------------------------------
// SERVICE WEEK LOGIC (Wed→Tue)
// Cutoff: Monday 23:59 of *this* week
// ----------------------------------
function getActiveServiceWeekDates() {
  const now = new Date();

  // 1) This week's Monday 23:59:59 (MOST RECENT Monday)
  const cutoff = new Date(now);
  cutoff.setHours(23, 59, 59, 0);

  const day = cutoff.getDay();          // Sun=0..Sat=6
  const diffToMonday = (day + 6) % 7;   // Mon=0, Tue=1, ... Sun=6
  cutoff.setDate(cutoff.getDate() - diffToMonday);

  // 2) This week's Wednesday (weekStart = Monday + 2)
  const weekStart = new Date(cutoff);
  weekStart.setDate(weekStart.getDate() + 2);

  // 3) If we're past cutoff, move to next service week
  if (now > cutoff) {
    weekStart.setDate(weekStart.getDate() + 7);
  }

  // 4) Return Wed..Tue (7 days)
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  return days;
}



function toYMD(d) {
    return d.toISOString().split("T")[0];
}


// ----------------------------------
// WEEK MENU HELPERS FOR DISH NAMES
// ----------------------------------

// Fetch weekly public menu once for booking page
async function loadBookingWeekMenu() {
    const weekDates = getActiveServiceWeekDates();
    if (!weekDates.length) {
        bookingWeekMenu = null;
        return;
    }
    const weekForStr = toYMD(weekDates[0]);

    try {
        const res = await fetch(`${window.API_BASE}/menu/public-week?week_for=${weekForStr}`);
        if (!res.ok) {
            console.error("Failed to load week menu for booking page");
            bookingWeekMenu = null;
            return;
        }
        bookingWeekMenu = await res.json();
    } catch (err) {
        console.error("loadBookingWeekMenu error:", err);
        bookingWeekMenu = null;
    }
}

// Normalize “days array” regardless of exact JSON shape
function getBookingMenuDaysArray() {
    if (!bookingWeekMenu) return [];
    if (Array.isArray(bookingWeekMenu)) return bookingWeekMenu;
    if (Array.isArray(bookingWeekMenu.days)) return bookingWeekMenu.days;
    return [];
}

// Try to find correct menu entry for a yyyy-mm-dd date
function findMenuForDate(dateYMD) {
    const days = getBookingMenuDaysArray();
    return (
        days.find((day) => {
            if (day.service_date) return String(day.service_date).slice(0, 10) === dateYMD;
            if (day.date)         return String(day.date).slice(0, 10) === dateYMD;
            if (day.day_date)     return String(day.day_date).slice(0, 10) === dateYMD;
            return false;
        }) || null
    );
}

// Turn whatever is in dish_a / dish_b into a readable label
function formatDishLabel(val) {
    if (!val) return "";
    if (typeof val === "string") return val;

    if (typeof val === "object") {
        if (val.name)        return val.name;
        if (val.label)       return val.label;
        if (val.title)       return val.title;
        if (val.description) return val.description;
        // last resort: show JSON text, but never "[object Object]"
        try {
            return JSON.stringify(val);
        } catch {
            return String(val);
        }
    }
    return String(val);
}

// Fill dish selector with real names, values still "A" / "B"
function populateDishSelectForDay(dayMenu) {
    if (!bookingDishSelect) return;

    bookingDishSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select dish (only if 1 meal)";
    bookingDishSelect.appendChild(placeholder);

    if (!dayMenu) {
        bookingDishSelect.disabled = true;
        return;
    }

    const labelA = formatDishLabel(dayMenu.dish_a);
    const labelB = formatDishLabel(dayMenu.dish_b);

    if (labelA) {
        const optA = document.createElement("option");
        optA.value = "A";      // backend still gets "A"
        optA.textContent = labelA;
        bookingDishSelect.appendChild(optA);
    }

    if (labelB) {
        const optB = document.createElement("option");
        optB.value = "B";
        optB.textContent = labelB;
        bookingDishSelect.appendChild(optB);
    }

    bookingDishSelect.disabled = false;
}

function updateDishSelectForCurrentDate() {
    if (!bookingDishSelect || !bookingDateSelect) return;

    const selectedDate = bookingDateSelect.value;
    if (!selectedDate) {
        bookingDishSelect.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select dish (only if 1 meal)";
        bookingDishSelect.appendChild(placeholder);
        bookingDishSelect.disabled = true;
        return;
    }

    const dayMenu = findMenuForDate(selectedDate);
    populateDishSelectForDay(dayMenu);
}


// ----------------------------------
// POPULATE DATE + TIME SLOT INPUTS
// ----------------------------------
function populateBookingDates() {
    if (!bookingDateSelect) return;

    const weekDates = getActiveServiceWeekDates();
    if (!weekDates.length) return;

    const firstDay = weekDates[0];
    const lastDay  = weekDates[weekDates.length - 1];

    const minStr = toYMD(firstDay);
    const maxStr = toYMD(lastDay);

    // limit calendar to the active service week (7 days)
    bookingDateSelect.min = minStr;
    bookingDateSelect.max = maxStr;

    // default selection: today if inside the week, otherwise the first day
    const todayStr = toYMD(new Date());
    if (todayStr >= minStr && todayStr <= maxStr) {
        bookingDateSelect.value = todayStr;
    } else {
        bookingDateSelect.value = minStr;
    }
}

function populateTimeSlots() {
    if (!bookingSlotSelect) return;

    bookingSlotSelect.innerHTML = "";

    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "Select time";
    bookingSlotSelect.appendChild(opt0);

    LUNCH_BLOCKS.forEach((block) => {
        const o = document.createElement("option");
        o.value = block;
        o.textContent = `Lunch – ${block}`;
        bookingSlotSelect.appendChild(o);
    });

    DINNER_BLOCKS.forEach((block) => {
        const o = document.createElement("option");
        o.value = block;
        o.textContent = `Dinner – ${block}`;
        bookingSlotSelect.appendChild(o);
    });
}


// ----------------------------------
// +EAL CAPACITY PER DAY (max 2 meals)
// ----------------------------------
function applyDayCapacityForSelectedDate(silent = false) {
    if (!bookingDateSelect || !bookingMealsSelect) return;

    const dateStr = bookingDateSelect.value;

    // reset "2 meals" option by default
    const options = bookingMealsSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === "2") {
            options[i].disabled = false;
        }
    }

    if (!dateStr) {
        return;
    }

    const usedMeals = bookedMealsByDate[dateStr] || 0;

    if (usedMeals >= 2) {
        // Day already fully booked – don't allow it
        if (!silent) {
            alert("You already booked 2 meals on this day. Please choose another date.");
        }
        bookingDateSelect.value = "";
        return;
    }

    if (usedMeals === 1) {
        // Only 1 meal left available → disable "2 meals"
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === "2") {
                options[i].disabled = true;
            }
        }
        if (bookingMealsSelect.value === "2") {
            bookingMealsSelect.value = "1";
        }
    }
    // usedMeals === 0 → nothing special; both options available
}


// ----------------------------------
// INIT PAGE
// ----------------------------------
async function initializeBookingPage() {
    if (bookingInitialized) {
        await loadBookings();
        applyDayCapacityForSelectedDate(true);
        return;
    }
    bookingInitialized = true;

    if (!ensureLoggedIn()) return;

    populateBookingDates();
    populateTimeSlots();

    // Load weekly menu and set initial dish labels
    await loadBookingWeekMenu();
    updateDishSelectForCurrentDate();

    if (bookingDateSelect) {
        bookingDateSelect.addEventListener("change", () => {
            applyDayCapacityForSelectedDate(false);
            updateDishSelectForCurrentDate();
        });
    }

    await loadClientAddresses();
    // Subscriber Week 2+ auto-create bookings if missing
    try {
    const days = getActiveServiceWeekDates();
    const weekStart = days[0]; // Wednesday Date object
    const iso = weekStart.toISOString().slice(0, 10);

    await fetch(`${window.API_BASE}/booking/ensure-week?week_start=${iso}`, {
        method: "POST",
        headers: getAuthHeaders(),
    });
    } catch (e) {
    console.warn("ensure-week failed", e);
    }

    await loadBookings(); // builds bookedMealsByDate
    applyDayCapacityForSelectedDate(true);

    if (bookingMealsSelect && bookingDishSelect) {
        bookingMealsSelect.addEventListener("change", () => {
            const isTwoMeals = bookingMealsSelect.value === "2";

            // Disable when 2 meals, enable when 1
            bookingDishSelect.disabled = isTwoMeals;

            if (isTwoMeals) {
                // Keep the options visible, just clear the selection
                bookingDishSelect.value = "";
            } else {
                // 1 meal -> make sure options are loaded for the current date
                updateDishSelectForCurrentDate();
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", submitBooking);
    }
}
window.initializeBookingPage = initializeBookingPage;


// ----------------------------------
// LOAD ADDRESSES (from /addresses)
// ----------------------------------
async function loadClientAddresses() {
    if (!bookingAddressSelect) return;

    bookingAddressSelect.innerHTML = "<option>Loading...</option>";

    try {
        const res = await fetch(`${window.API_BASE}/addresses`, {
            headers: getAuthHeaders(),
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            throw new Error("Failed to load addresses");
        }

        const addresses = await res.json();
        bookingAddressCache = addresses; // keep them for the table

        bookingAddressSelect.innerHTML = "";
        if (!addresses.length) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "No addresses yet (add one in My Account)";
            bookingAddressSelect.appendChild(opt);
            return;
        }

        addresses.forEach((a) => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = `${a.label} – ${a.line1}`;
            bookingAddressSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("loadClientAddresses error:", err);
        bookingAddressSelect.innerHTML = "<option>Error loading</option>";
    }
}

function getAddressDisplayText(addressId) {
    const addr = bookingAddressCache.find(a => a.id === addressId);
    if (!addr) return `Address #${addressId}`;

    const parts = [
        addr.label,
        addr.line1,
        addr.city,
        addr.postal_code
    ].filter(Boolean);

    return parts.join(" – ");
}

window.loadClientAddresses = loadClientAddresses;


// ----------------------------------
// SUBMIT BOOKING -> POST /booking/
// ----------------------------------
async function submitBooking(e) {
    e.preventDefault();
    if (!ensureLoggedIn()) return;

    const delivery_date = bookingDateSelect.value;
    const meals = Number(bookingMealsSelect.value);
    const dish_choice =
        meals === 2 ? null : (bookingDishSelect.value || null);
    const address_id = Number(bookingAddressSelect.value);
    const time_block = bookingSlotSelect.value;

    if (!delivery_date || !address_id || !time_block || !meals) {
        alert("Please fill in all required fields.");
        return;
    }

    // Enforce max 2 meals per day (front-end safety)
    const alreadyMeals = bookedMealsByDate[delivery_date] || 0;
    if (alreadyMeals + meals > 2) {
        alert(
            `You can book at most 2 meals per day. ` +
            `This day already has ${alreadyMeals} meal(s) booked.`
        );
        return;
    }

    const payload = {
        delivery_date,
        meals,
        dish_choice,
        address_id,
        time_block,
    };

    try {
        const res = await fetch(`${window.API_BASE}/booking/`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            alert(data.detail || "Booking failed.");
            return;
        }

        await loadBookings();
        await updatePricingFromBackend();
        alert("Booking added.");

        // After successful booking, clear date – user must choose again
        if (bookingDateSelect) {
            bookingDateSelect.value = "";
        }

        // Reset other fields to a clean state
        if (bookingMealsSelect) {
            bookingMealsSelect.value = "1";
            // re-enable "2 meals" by default; capacity rules will adjust again when date is picked
            const options = bookingMealsSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === "2") {
                    options[i].disabled = false;
                }
            }
        }
        if (bookingDishSelect) {
            bookingDishSelect.disabled = false;
            bookingDishSelect.value = "";
        }
        if (bookingSlotSelect) {
            bookingSlotSelect.value = "";
        }

    } catch (err) {
        console.error("submitBooking error:", err);
        alert("Network error.");
    }
}


// ----------------------------------
// LOAD BOOKINGS -> GET /booking/
// ----------------------------------
function getCurrentServiceWeekRange() {
    const days = getActiveServiceWeekDates();
    if (!days.length) return null;
    const start = days[0];
    const end = days[days.length - 1];
    return { start, end };
}

function isDateInRange(isoDateStr, start, end) {
    if (!isoDateStr) return false;

    // Normalize everything to plain YYYY-MM-DD strings
    const dStr = String(isoDateStr).slice(0, 10); // handles "2025-11-26" or "2025-11-26T00:00:00Z"
    const sStr = toYMD(start);
    const eStr = toYMD(end);

    return dStr >= sStr && dStr <= eStr;
}

async function loadBookings() {
    if (!bookingTableBody) return;
    if (!ensureLoggedIn()) return;

    try {
        const res = await fetch(`${window.API_BASE}/booking/`, {
            headers: getAuthHeaders(),
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            throw new Error("Failed to load bookings");
        }

        const allBookings = await res.json();
        const range = getCurrentServiceWeekRange();

        if (!range) {
            bookingTableBody.innerHTML =
                `<tr><td colspan="6">No active service week.</td></tr>`;
            bookedMealsByDate = {};
            return;
        }

        // Filter to this week only
        const weekBookings = allBookings.filter((b) =>
            isDateInRange(b.delivery_date, range.start, range.end)
        );

        // BUILD MEAL MAP using ONLY ACTIVE bookings
        bookedMealsByDate = {};
        for (const b of weekBookings) {
            if (b.status && b.status !== "active") continue; // ignore cancelled
            const d = b.delivery_date;
            const meals = Number(b.meals || 0);
            bookedMealsByDate[d] = (bookedMealsByDate[d] || 0) + meals;
        }

        // FIX: table must also show ONLY ACTIVE bookings
        const activeBookings = weekBookings.filter(
            (b) => !b.status || b.status === "active"
        );

        renderBookingTable(activeBookings);
        await updatePricingFromBackend();
    } catch (err) {
        console.error("loadBookings error:", err);
        bookingTableBody.innerHTML =
            `<tr><td colspan="6">Error loading.</td></tr>`;
        bookedMealsByDate = {};
    }
}



// ----------------------------------
// BOOKING TABLE HELPERS
// ----------------------------------
function getDishDisplayTextForBooking(b) {
    const dayMenu = findMenuForDate(b.delivery_date);

    // 2 meals -> we want the *real names* of both dishes
    if (b.meals >= 2) {
        if (!dayMenu) {
            return "Both dishes (A + B)";
        }

        const labelA = formatDishLabel(dayMenu.dish_a);
        const labelB = formatDishLabel(dayMenu.dish_b);

        if (labelA && labelB) {
            // ex: "Strogonoff fit (iogurte) + arroz, Sardinhas assadas (época) + legumes"
            return `${labelA}, ${labelB}`;
        }
        if (labelA) return labelA;
        if (labelB) return labelB;

        return "Both dishes (A + B)";
    }

    // 1 meal only
    if (!b.dish_choice) {
        return "-";
    }

    if (!dayMenu) {
        // fallback: show letter if menu not loaded
        return b.dish_choice;
    }

    if (b.dish_choice === "A") {
        return formatDishLabel(dayMenu.dish_a) || "Dish A";
    }
    if (b.dish_choice === "B") {
        return formatDishLabel(dayMenu.dish_b) || "Dish B";
    }

    return b.dish_choice;
}

window.getAddressDisplayText = getAddressDisplayText;


function renderBookingTable(bookings) {
    if (!bookingTableBody) return;

    if (!bookings.length) {
        bookingTableBody.innerHTML =
            `<tr><td colspan="6">No bookings yet.</td></tr>`;
        return;
    }

    bookingTableBody.innerHTML = "";

    bookings.forEach((b) => {
        const tr = document.createElement("tr");

        const dishDisplay    = getDishDisplayTextForBooking(b);
        const addressDisplay = getAddressDisplayText(b.address_id);

        tr.innerHTML = `
            <td>${b.delivery_date}</td>
            <td>${b.time_block}</td>
            <td>${b.meals}</td>
            <td>${dishDisplay}</td>
            <td>${addressDisplay}</td>
            <td><button data-id="${b.id}" class="btn ghost small del-booking-btn">X</button></td>
        `;

        bookingTableBody.appendChild(tr);
    });

    document.querySelectorAll(".del-booking-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            await deleteBooking(id);
        });
    });
}


// ----------------------------------
// DELETE BOOKING -> DELETE /booking/{id}
// ----------------------------------
async function deleteBooking(id) {
    if (!ensureLoggedIn()) return;
    if (!confirm("Cancel this booking?")) return;

    try {
        const res = await fetch(`${window.API_BASE}/booking/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        let data = null;
        try {
            data = await res.json();
        } catch (_) {
            // DELETE may return 204 No Content; that's fine
            data = null;
        }

        if (!res.ok) {
            const msg = (data && data.detail) || "Failed to cancel booking.";
            alert(msg);
            return;
        }

        // Hard, reliable sync with backend state
        window.location.reload();
    } catch (err) {
        console.error("deleteBooking error:", err);
        alert("Network error while cancelling booking.");
    }
}


// ----------------------------------
// PRICING -> GET /booking/week-pricing
// ----------------------------------
async function updatePricingFromBackend() {
    if (!bookingPricingDiv) return;
    if (!ensureLoggedIn()) return;

    const days = getActiveServiceWeekDates();
    if (!days.length) {
        bookingPricingDiv.innerHTML = "";
        return;
    }

    const weekForStr = toYMD(days[0]);

    try {
        const res = await fetch(
            `${window.API_BASE}/booking/week-pricing?week_for=${weekForStr}`,
            {
                headers: getAuthHeaders(),
            }
        );

        if (!res.ok) {
            bookingPricingDiv.innerHTML = "";
            return;
        }

        const data = await res.json();

        if (!data.ok) {
            bookingPricingDiv.innerHTML = `
                <p>${data.reason || "Minimum meals not reached."}</p>
                <p>Total meals booked: <strong>${data.total_meals}</strong></p>
            `;
            return;
        }

        bookingPricingDiv.innerHTML = `
            <p><strong>${data.total_meals}</strong> meals this week</p>
            <p>Price per meal: <strong>${data.unit_price.toFixed(2)}€</strong></p>
            <p>Base total: <strong>${data.base_total.toFixed(2)}€</strong></p>
            <p>${data.promo_applied ? "Launch promo applied: 50% discount" : ""}</p>
            <p>Final total: <strong>${data.final_total.toFixed(2)}€</strong></p>
        `;
    } catch (err) {
        console.error("updatePricingFromBackend error:", err);
        bookingPricingDiv.innerHTML = "";
    }
}
