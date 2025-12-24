// frontend/js/auth.js

// =============================
// GLOBAL CONFIG
// =============================

// Priority:
// 1) localStorage override (handy for production/proxy)
// 2) <meta name="api-base" content="..."> (optional)
// 3) Same-origin "/api" (best for production behind reverse proxy)
// 4) Local dev fallback (127.0.0.1:8000)
function resolveApiBase() {
  const fromStorage = localStorage.getItem("API_BASE");
  if (fromStorage) return fromStorage.replace(/\/$/, "");

  const meta = document.querySelector('meta[name="api-base"]');
  if (meta && meta.content) return meta.content.replace(/\/$/, "");

  // If you serve frontend + backend from same domain via reverse proxy, use /api
  // (Example: https://mesa.pt/api)
  const sameOriginApi = `${window.location.origin}/api`;

  // Local dev fallback
  const localDev = "http://127.0.0.1:8000";

  // If running on localhost/127.0.0.1, prefer local dev backend
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return localDev;

  // Otherwise assume reverse-proxy production
  return sameOriginApi;
}

const API_BASE = resolveApiBase();
// Attach to window so all other scripts can use it
window.API_BASE = API_BASE;


// =============================
// TOKEN STORAGE HELPERS
// =============================
function setToken(token) {
    localStorage.setItem("mealprep_token", token);
}

function getToken() {
    return localStorage.getItem("mealprep_token");
}

function clearToken() {
    localStorage.removeItem("mealprep_token");
}

function getAuthHeaders() {
    const token = getToken();
    if (!token) {
        return {
            "Content-Type": "application/json",
        };
    }
    return {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
    };
}

function updateUserProfileUI(user) {
    const accountBtn = document.getElementById("accountBtn");
    const loginBtn   = document.getElementById("loginBtn");
    const registerBtn= document.getElementById("registerBtn");
    const logoutBtn  = document.getElementById("logoutBtn");

    if (user) {
        // display name for header button
        let displayName;
        if (user.name && user.name.trim()) {
            displayName = user.name.trim();
        } else if (user.email) {
            displayName = user.email.split("@")[0];
        } else {
            displayName = "Account";
        }

        if (accountBtn) {
            accountBtn.classList.remove("hidden");
            accountBtn.textContent = displayName;
        }
        if (loginBtn)    loginBtn.classList.add("hidden");
        if (registerBtn) registerBtn.classList.add("hidden");
        if (logoutBtn)   logoutBtn.classList.remove("hidden");
    } else {
        // logged out
        if (accountBtn) {
            accountBtn.classList.add("hidden");
            accountBtn.textContent = "My Account";
        }
        if (loginBtn)    loginBtn.classList.remove("hidden");
        if (registerBtn) registerBtn.classList.remove("hidden");
        if (logoutBtn)   logoutBtn.classList.add("hidden");
    }

    // Account page read-only fields
    const nameEl  = document.getElementById("userNameDisplay");
    const emailEl = document.getElementById("userEmailDisplay");
    const phoneEl = document.getElementById("userPhoneDisplay");

    if (user) {
        if (nameEl)  nameEl.textContent  = user.name  || "–";
        if (emailEl) emailEl.textContent = user.email || "–";
        if (phoneEl) phoneEl.textContent = user.phone || "–";
    } else {
        if (nameEl)  nameEl.textContent  = "–";
        if (emailEl) emailEl.textContent = "–";
        if (phoneEl) phoneEl.textContent = "–";
    }
}


// expose helpers globally
window.setToken = setToken;
window.getToken = getToken;
window.clearToken = clearToken;
window.getAuthHeaders = getAuthHeaders;


// =============================
// DOM ELEMENTS
// =============================
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const accountBtn = document.getElementById("accountBtn");
const menuPageBtn = document.getElementById("menuPageBtn");
const bookingPageBtn = document.getElementById("bookingPageBtn");
const adminPageBtn = document.getElementById("adminPageBtn");
const kitchenPageBtn = document.getElementById("kitchenPageBtn");

const modalOverlay = document.getElementById("modalOverlay");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const closeModalButtons = document.querySelectorAll(".closeModal");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const resetPasswordModal = document.getElementById("resetPasswordModal");
const resetPasswordForm = document.getElementById("resetPasswordForm");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");


// pages
const accountSection = document.getElementById("account-section");
const menuSection = document.getElementById("menu-section");
const bookingSection = document.getElementById("booking-section");
const adminSection = document.getElementById("admin-section");
const kitchenSection = document.getElementById("kitchen-section");

let currentUser = null; // cached user info after /users/me


// =============================
// MODAL HELPERS
// =============================
function openModal(modalEl) {
    if (!modalEl || !modalOverlay) return;
    modalOverlay.classList.remove("hidden");
    modalEl.classList.remove("hidden");
}

function closeModals() {
    if (!modalOverlay) return;
    modalOverlay.classList.add("hidden");
    if (loginModal) loginModal.classList.add("hidden");
    if (registerModal) registerModal.classList.add("hidden");
    if (resetPasswordModal) resetPasswordModal.classList.add("hidden");
}


if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        closeModals();
        openModal(loginModal);
    });
}

if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        closeModals();
        openModal(registerModal);
    });
}
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", () => {
        closeModals();
        openModal(resetPasswordModal);
    });
}

closeModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        closeModals();
    });
});

if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        // only close when clicking on the overlay, not inside modal
        if (e.target === modalOverlay) {
            closeModals();
        }
    });
}


// =============================
// PAGE NAVIGATION
// =============================
function hideAllPages() {
    const pages = document.querySelectorAll(".page");
    pages.forEach((p) => p.classList.add("hidden"));
}

function showPage(sectionId) {
    hideAllPages();
    const el = document.getElementById(sectionId);
    if (el) el.classList.remove("hidden");
}

if (menuPageBtn) {
    menuPageBtn.addEventListener("click", () => {
        showPage("menu-section");
        if (window.loadPublicMenu) {
            window.loadPublicMenu();
        }
    });
}

if (bookingPageBtn) {
    bookingPageBtn.addEventListener("click", () => {
        if (!ensureLoggedIn()) return;
        showPage("booking-section");
        if (window.initializeBookingPage) {
            window.initializeBookingPage();
        }
    });
}

if (accountBtn) {
    accountBtn.addEventListener("click", () => {
        if (!ensureLoggedIn()) return;
        showPage("account-section");
        if (window.loadAddresses) {
            window.loadAddresses();
        }
    });
}

if (adminPageBtn) {
    adminPageBtn.addEventListener("click", () => {
        if (!ensureLoggedIn()) return;
        if (!currentUser || currentUser.role !== "admin") {
            alert("Admin only.");
            return;
        }
        showPage("admin-section");
        if (window.initializeAdminPage) {
            window.initializeAdminPage();
        }
    });
}

if (kitchenPageBtn) {
    kitchenPageBtn.addEventListener("click", () => {
        if (!ensureLoggedIn()) return;
        if (!currentUser || currentUser.role !== "kitchen") {
            alert("Kitchen-only access.");
            return;
        }
        showPage("kitchen-section");
        if (window.initializeKitchenPage) {
            window.initializeKitchenPage();
        }
    });
}


// =============================
// LOGIN / LOGOUT / REGISTER
// =============================
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const res = await fetch(`${window.API_BASE}/auth/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                alert(errData.detail || "Login failed.");
                return;
            }

            const data = await res.json();
            if (!data.access_token) {
                alert("No token received from server.");
                return;
            }

            setToken(data.access_token);

            // fetch current user
            await fetchCurrentUser();

            // NEW: update header + account details
            updateUserProfileUI(currentUser);

            closeModals();
            updateAuthUI();

            // after login: show account addresses by default
            showPage("account-section");
            if (window.loadAddresses) {
                window.loadAddresses();
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Network error during login.");
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const phone = document.getElementById("regPhone").value.trim();
        const password = document.getElementById("regPassword").value;

        if (!name || !email || !password) {
            alert("Name, email and password are required.");
            return;
        }

        try {
            const res = await fetch(`${window.API_BASE}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                alert(errData.detail || "Registration failed.");
                return;
            }

            alert("Registration successful. You can now login.");
            closeModals();
            openModal(loginModal);
        } catch (err) {
            console.error("Register error:", err);
            alert("Network error during registration.");
        }
    });
}

if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("resetEmail").value.trim();
        const phone = document.getElementById("resetPhone").value.trim();
        const newPassword = document.getElementById("resetNewPassword").value;

        if (!email || !newPassword) {
            alert("Email and new password are required.");
            return;
        }

        try {
            const res = await fetch(`${window.API_BASE}/auth/reset-password-simple`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    phone: phone || null,
                    new_password: newPassword,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                alert(data.detail || "Failed to reset password.");
                return;
            }

            alert("Password updated. You can login with the new password.");
            closeModals();
            openModal(loginModal);
        } catch (err) {
            console.error("resetPassword error:", err);
            alert("Network error while resetting password.");
        }
    });
}


if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        clearToken();
        currentUser = null;
        updateAuthUI();
        updateUserProfileUI(null);  // NEW

        hideAllPages();
        showPage("menu-section");
        if (window.loadPublicMenu) {
            window.loadPublicMenu();
        }
    });
}


// =============================
// CURRENT USER / ROLE HANDLING
// =============================
async function fetchCurrentUser() {
    const token = getToken();
    if (!token) {
        currentUser = null;
        return null;
    }

    try {
        const res = await fetch(`${window.API_BASE}/users/me`, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        if (!res.ok) {
            clearToken();
            currentUser = null;
            return null;
        }

        currentUser = await res.json();
        return currentUser;
    } catch (err) {
        console.error("fetchCurrentUser error:", err);
        currentUser = null;
        return null;
    }
}

window.getCurrentUser = () => currentUser;


// =============================
// AUTH UI UPDATE
// =============================
function updateAuthUI() {
    const isLoggedIn = !!getToken();

    if (loginBtn) loginBtn.classList.toggle("hidden", isLoggedIn);
    if (registerBtn) registerBtn.classList.toggle("hidden", isLoggedIn);
    if (logoutBtn) logoutBtn.classList.toggle("hidden", !isLoggedIn);
    if (accountBtn) accountBtn.classList.toggle("hidden", !isLoggedIn);

    const role = currentUser?.role || null;

    if (adminPageBtn) {
        adminPageBtn.classList.toggle("hidden", role !== "admin");
        adminPageBtn.classList.toggle("admin-only", role === "admin");
    }
    if (kitchenPageBtn) {
        kitchenPageBtn.classList.toggle("hidden", role !== "kitchen");
        kitchenPageBtn.classList.toggle("kitchen-only", role === "kitchen");
    }
}


// =============================
// ENSURE LOGGED IN HELPER
// =============================
function ensureLoggedIn() {
    if (!getToken()) {
        alert("You need to login first.");
        openModal(loginModal);
        return false;
    }
    return true;
}
window.ensureLoggedIn = ensureLoggedIn;

// =============================
// PASSWORD VISIBILITY TOGGLES
// =============================
function initPasswordToggles() {
    const toggles = document.querySelectorAll(".password-toggle");
    toggles.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                btn.textContent = "Hide";
            } else {
                input.type = "password";
                btn.textContent = "Show";
            }
        });
    });
}

// =============================
// INITIALIZATION ON PAGE LOAD
// =============================
(async function initAuth() {
    if (getToken()) {
        await fetchCurrentUser();
    }

    updateAuthUI();
    initPasswordToggles();
    updateUserProfileUI(currentUser);  // NEW

    // default public page = menu
    showPage("menu-section");
    if (window.loadPublicMenu) {
        window.loadPublicMenu();
    }
})();
