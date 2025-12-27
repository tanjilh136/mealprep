// frontend/js/user.js – max-3-address logic + default selection
// Aligned with backend /addresses routes

const addressForm      = document.getElementById("addressForm");
const addrIdInput      = document.getElementById("addrId");

// OLD label input (might not exist anymore if you changed HTML)
const addrLabelInput   = document.getElementById("addrLabel");

// NEW dropdown + custom label inputs
const addrLabelSelect      = document.getElementById("addressLabelSelect");
const customLabelWrapper   = document.getElementById("customLabelWrapper");
const customLabelInput     = document.getElementById("customLabelInput");

const addrLine1Input   = document.getElementById("addrLine1");
const addrLine2Input   = document.getElementById("addrLine2");
const addrCityInput    = document.getElementById("addrCity");
const addrPostalInput  = document.getElementById("addrPostal");
const addrNotesInput   = document.getElementById("addrNotes");
const addrDefaultInput = document.getElementById("addrDefault");

const addressList      = document.getElementById("addressList");

// cache of last-loaded addresses so editAddress doesn't need extra API calls
let currentAddresses = [];

// =====================
// DROPDOWN LABEL LOGIC
// =====================
if (addrLabelSelect && customLabelWrapper && customLabelInput) {
    addrLabelSelect.addEventListener("change", () => {
        if (addrLabelSelect.value === "Other") {
            customLabelWrapper.classList.remove("hidden");
        } else {
            customLabelWrapper.classList.add("hidden");
            customLabelInput.value = "";
        }
    });
}

// Called when user opens the account page
async function initializeUserPage() {
    if (!ensureLoggedIn()) return;
    await loadAddresses();
    renderBehaviourTableFromLocalStorage();
}

window.initializeUserPage = initializeUserPage;

// --------------------------------------------
// LOAD ADDRESSES  -> GET /addresses
// --------------------------------------------
async function loadAddresses() {
    if (!ensureLoggedIn()) return;

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
        currentAddresses = addresses;

        renderAddressList(addresses);

        // Also refresh the dropdown in the booking page if needed
        if (typeof loadClientAddresses === "function") {
            await loadClientAddresses();
        }

    } catch (err) {
        console.error("loadAddresses error:", err);
        if (addressList) {
            addressList.innerHTML = `<tr><td colspan="6">Error loading.</td></tr>`;
        }
    }
}
window.loadAddresses = loadAddresses;

// --------------------------------------------
// RENDER IN TABLE
// --------------------------------------------
function renderAddressList(addresses) {
    if (!addressList) return;

    if (!addresses.length) {
        addressList.innerHTML = `<tr><td colspan="6">No addresses yet.</td></tr>`;
        return;
    }

    addressList.innerHTML = "";

    addresses.forEach((a) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${a.label}</td>
            <td>${a.line1}</td>
            <td>${a.city}</td>
            <td>${a.postal_code}</td>
            <td>${a.is_default ? "Yes" : "-"}</td>
            <td>
                <button class="btn ghost small" type="button" onclick="editAddress(${a.id})">Edit</button>
                <button class="btn ghost small" type="button" onclick="deleteAddress(${a.id})">Delete</button>
            </td>
        `;

        addressList.appendChild(tr);
    });
}

// --------------------------------------------
// EDIT ADDRESS (no extra API call; use cache)
// --------------------------------------------
function editAddress(id) {
    const a = currentAddresses.find((addr) => addr.id === id);
    if (!a) {
        alert("Address not found in local cache. Try reloading.");
        return;
    }

    addrIdInput.value = a.id;

    // Handle label depending on what exists in DOM
    if (addrLabelSelect && customLabelWrapper && customLabelInput) {
        if (["Home", "Office", "Gym", "School", "Restaurant"].includes(a.label)) {
            addrLabelSelect.value = a.label;
            customLabelWrapper.classList.add("hidden");
            customLabelInput.value = "";
        } else {
            addrLabelSelect.value = "Other";
            customLabelWrapper.classList.remove("hidden");
            customLabelInput.value = a.label || "";
        }
    } else if (addrLabelInput) {
        // Fallback to old simple text field
        addrLabelInput.value = a.label || "";
    }

    addrLine1Input.value  = a.line1 || "";
    addrLine2Input.value  = a.line2 || "";
    addrCityInput.value   = a.city || "";
    addrPostalInput.value = a.postal_code || "";
    addrNotesInput.value  = a.notes || "";
    addrDefaultInput.checked = !!a.is_default;
}
window.editAddress = editAddress;

// --------------------------------------------
// DELETE ADDRESS -> DELETE /addresses/{id}
// --------------------------------------------
async function deleteAddress(id) {
    if (!ensureLoggedIn()) return;
    if (!confirm("Delete this address?")) return;

    try {
        const res = await fetch(`${window.API_BASE}/addresses/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            clearToken();
            window.location.reload();
            return;
        }

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(errData.detail || "Error deleting address.");
            return;
        }

        await loadAddresses();

    } catch (err) {
        console.error("deleteAddress error:", err);
        alert("Error deleting address.");
    }
}
window.deleteAddress = deleteAddress;

// --------------------------------------------
// SUBMIT ADDRESS FORM -> POST/PUT /addresses
// --------------------------------------------
if (addressForm) {
    addressForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!ensureLoggedIn()) return;

        const editing = !!addrIdInput.value;

        // Client-side max 3 (backend also enforces)
        if (!editing && currentAddresses.length >= 3) {
            alert("You can only save a maximum of 3 addresses.");
            return;
        }

        // ===== label resolution (extra safe) =====
        let finalLabel = "";

        if (addrLabelSelect) {
            const sel = addrLabelSelect;
            const opt = sel.options[sel.selectedIndex] || null;

            const rawValue = (opt && opt.value ? opt.value : sel.value || "").trim();
            const rawText  = (opt && opt.text  ? opt.text  : "").trim();

            // use value if present, otherwise visible text
            let selectedLabel = rawValue || rawText;

            // normalize “other” in any case (Other, other, OUTRO, etc if you want)
            const isOther =
                /^other$/i.test(selectedLabel) || /^outro$/i.test(selectedLabel);

            if (isOther) {
                if (!customLabelInput) {
                    alert("Custom label input missing in DOM.");
                    return;
                }
                finalLabel = (customLabelInput.value || "").trim();
                if (!finalLabel) {
                    alert("Please enter a custom label.");
                    return;
                }
            } else {
                finalLabel = selectedLabel;
            }
        } else if (addrLabelInput) {
            // Fallback to old simple text mode
            finalLabel = (addrLabelInput.value || "").trim();
        }

        if (!finalLabel) {
            alert("Please choose a label.");
            return;
        }

        const payload = {
            label: finalLabel,
            line1: addrLine1Input.value.trim(),
            line2: addrLine2Input.value.trim() || null,
            city: addrCityInput.value.trim(),
            postal_code: addrPostalInput.value.trim(),
            notes: addrNotesInput.value.trim() || null,
            is_default: !!addrDefaultInput.checked,
            // region_id is optional; you can add a field in the form later if needed
        };

        if (!payload.line1 || !payload.city || !payload.postal_code) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            let url;
            let method;

            if (editing) {
                const id = addrIdInput.value;
                url = `${window.API_BASE}/addresses/${id}`;
                method = "PUT";
            } else {
                url = `${window.API_BASE}/addresses`;
                method = "POST";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert("Session expired. Please login again.");
                clearToken();
                window.location.reload();
                return;
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                alert(errData.detail || "Error saving address.");
                return;
            }

            resetAddressForm();
            await loadAddresses();
        } catch (err) {
            console.error("addressForm submit error:", err);
            alert("Network error saving address.");
        }
    });
}

// --------------------------------------------
// RESET FORM
// --------------------------------------------
function resetAddressForm() {
    addrIdInput.value = "";

    // Reset label depending on what exists
    if (addrLabelSelect && customLabelWrapper && customLabelInput) {
        addrLabelSelect.value = "Home";           // default
        customLabelWrapper.classList.add("hidden");
        customLabelInput.value = "";
    } else if (addrLabelInput) {
        addrLabelInput.value = "";
    }

    addrLine1Input.value  = "";
    addrLine2Input.value  = "";
    addrCityInput.value   = "";
    addrPostalInput.value = "";
    addrNotesInput.value  = "";
    addrDefaultInput.checked = false;
}
window.resetAddressForm = resetAddressForm;

function renderBehaviourTableFromLocalStorage() {
    let raw = null;
    try {
        raw = localStorage.getItem("mesaOnboardingBehaviour");
    } catch (_) {
        return;
    }
    if (!raw) return;

    let grid;
    try {
        grid = JSON.parse(raw);
    } catch (_) {
        return;
    }
    if (!grid || typeof grid !== "object") return;

    const body = document.getElementById("behaviourTableBody");
    if (!body) return;

    const order = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];
    body.innerHTML = "";

    for (const day of order) {
        const v = grid[day] || {};
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${day}</td>
            <td>${v.meal1 || "-"}</td>
            <td>${v.meal2 || "-"}</td>
            <td>-</td>
        `;
        body.appendChild(tr);
    }
}

