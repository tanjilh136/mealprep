// frontend/js/menu.js
// Public weekly menu view

const menuContainer = document.getElementById("menuContainer");

let currentMenuWeekDate = null;  // a Date inside the current displayed service week

function formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

// =============================
// RENDER MENU
// =============================
function renderMenuWeek(days) {
    if (!menuContainer) return;

    menuContainer.innerHTML = "";

    if (!days || days.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No menu is defined for this week yet.";
        menuContainer.appendChild(p);
        return;
    }

    // header controls (week navigation)
    const controls = document.createElement("div");
    controls.className = "menu-controls";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "Previous Week";
    prevBtn.addEventListener("click", () => {
        shiftMenuWeek(-7);
    });

    const todayBtn = document.createElement("button");
    todayBtn.type = "button";
    todayBtn.textContent = "This Week";
    todayBtn.addEventListener("click", () => {
        currentMenuWeekDate = new Date();
        loadPublicMenu();
    });

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = "Next Week";
    nextBtn.addEventListener("click", () => {
        shiftMenuWeek(7);
    });

    controls.appendChild(prevBtn);
    controls.appendChild(todayBtn);
    controls.appendChild(nextBtn);

    menuContainer.appendChild(controls);

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    days.forEach((day) => {
        const card = document.createElement("div");
        card.className = "menu-day-card";

        // backend sends ISO date string ("YYYY-MM-DD")
        const dateObj = new Date(day.date);
        const dateLabel = dateObj.toLocaleDateString("pt-PT", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
        });

        const title = document.createElement("h4");
        title.textContent = `${dateLabel}`;

        const dishesWrapper = document.createElement("div");
        dishesWrapper.className = "menu-day-dishes";

        const dishA = document.createElement("div");
        dishA.className = "menu-dish";
        const aName = day.dish_a?.name || "—";
        const aKcal =
            day.dish_a?.calories != null
                ? ` <span class="calories">(${day.dish_a.calories} kcal)</span>`
                : "";
        dishA.innerHTML = `<strong>A:</strong> ${aName}${aKcal}`;

        const dishB = document.createElement("div");
        dishB.className = "menu-dish";
        const bName = day.dish_b?.name || "—";
        const bKcal =
            day.dish_b?.calories != null
                ? ` <span class="calories">(${day.dish_b.calories} kcal)</span>`
                : "";
        dishB.innerHTML = `<strong>B:</strong> ${bName}${bKcal}`;

        dishesWrapper.appendChild(dishA);
        dishesWrapper.appendChild(dishB);

        card.appendChild(title);
        card.appendChild(dishesWrapper);

        grid.appendChild(card);
    });

    menuContainer.appendChild(grid);
}

// =============================
// FETCH MENU FROM BACKEND
// =============================
async function loadPublicMenu() {
    if (!menuContainer) return;

    // default: if we don't have a "week date", use today
    if (!currentMenuWeekDate) {
        currentMenuWeekDate = new Date();
    }

    const weekDateStr = formatDate(currentMenuWeekDate);

    menuContainer.innerHTML = "<p>Loading menu...</p>";

    try {
        const res = await fetch(
            `${window.API_BASE || API_BASE}/menu/public-week?week_for=${weekDateStr}`
        );

        if (!res.ok) {
            menuContainer.innerHTML = "<p>Failed to load menu.</p>";
            return;
        }

        const data = await res.json();
        renderMenuWeek(data);
    } catch (err) {
        console.error("loadPublicMenu error:", err);
        menuContainer.innerHTML = "<p>Error loading menu.</p>";
    }
}

function shiftMenuWeek(days) {
    if (!currentMenuWeekDate) {
        currentMenuWeekDate = new Date();
    }
    currentMenuWeekDate.setDate(currentMenuWeekDate.getDate() + days);
    loadPublicMenu();
}

// expose for auth.js on initial load
window.loadPublicMenu = loadPublicMenu;
