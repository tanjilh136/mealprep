/* M•ESA Onboarding
   - Developer language: English
   - UI text: translations (PT default, EN optional)
   - Psychological steps: not persisted outside this flow
   - Real steps: kept in memory for now; backend submit later
   - IMPORTANT: No inline styles. Uses existing .btn.primary + scoped onboarding CSS.
*/

(() => {
  // If you want zero hardcoding later:
  // In onboarding.html set: <script>window.MESA_API_BASE="http://127.0.0.1:8000"</script>
  // BEFORE loading onboarding.js
  // Do NOT redeclare API_BASE globally. Use window.API_BASE.
  window.API_BASE = window.API_BASE || "http://127.0.0.1:8000";


  const LS_LANG_KEY = "mesaLang";
  const DEFAULT_LANG = "pt";

  const translations = {
    pt: {
      ob_s1_title: "Bem-vindo à M•ESA.",
      ob_s1_line2: "Comida portuguesa real. Disciplina sem esforço.",
      ob_s1_line3a: "Vamos criar a tua semana à M•ESA.",
      ob_s1_line3b: "Demora menos de 1 minuto.",
      ob_start: "Começar",
      ob_continue: "Continuar",

      ob_s2_q: "Qual é o teu objetivo principal?",
      ob_s2_o1: "Comer melhor sem perder tempo",
      ob_s2_o2: "Ganhar disciplina",
      ob_s2_o3: "Melhorar resultados no treino",
      ob_s2_o4: "Perder peso / controlar calorias",
      ob_s2_o5: "Ter refeições sempre prontas",
      ob_s2_o6: "Todas as acima!",
      ob_err_pick_one_min: "Escolhe pelo menos uma opção.",

      ob_s3_q: "Quantas vezes por semana pensas no que vais comer?",
      ob_s3_o1: "1–2 vezes",
      ob_s3_o2: "3–5 vezes",
      ob_s3_o3: "6+ vezes",
      ob_s3_o4: "Estou sempre a improvisar",
      ob_s3_o5: "Não quero pensar nisso",
      ob_err_pick_one_exact: "Escolhe uma opção.",

      ob_s4_q: "Como preferes as tuas refeições?",
      ob_s4_o1: "Alta proteína",
      ob_s4_o2: "Baixos hidratos",
      ob_s4_o3: "Equilibradas",
      ob_s4_o4: "Qualquer opção",

      ob_s5_q: "Onde queres receber as tuas refeições?",
      ob_s5_home: "Casa",
      ob_s5_work: "Trabalho",
      ob_s5_gym: "Levantar no ginásio",
      ob_s5_other: "Outro",

      ob_s5_address_title: "Detalhes da morada",
      ob_s5_label: "Etiqueta",
      ob_s5_address: "Morada",
      ob_s5_city: "Cidade",
      ob_s5_postcode: "Código Postal",
      ob_s5_country: "País",
      ob_s5_country_pt: "Portugal",

      ob_s5_gym_title: "Seleciona o ginásio",
      ob_s5_gym_placeholder: "Seleciona um ginásio",
      ob_s5_gym_other: "O meu ginásio não está na lista",
      ob_s5_gym_hint:
        "Se não encontrares o teu ginásio, escolhe a opção abaixo e adiciona o endereço.",

      ob_s6_q: "A que horas costumas receber as tuas refeições?",
      ob_s6_hint: "Escolhe 1 ou 2 horários (máximo 2).",
      ob_err_max_two: "Máximo 2 horários.",

      ob_err_fill_address:
        "Preenche a etiqueta, morada, cidade e código postal.",
      ob_err_pick_gym:
        "Seleciona um ginásio ou escolhe a opção de adicionar manualmente.",

      // --- Step 11
      ob_s11_title: "Legalmente, para te proteger:",
      ob_s11_tc: "TERMOS E CONDIÇÕES",
      ob_s11_pp: "POLÍTICA DE PRIVACIDADE",
      ob_s11_accept:
        "Aceito os Termos e Condições e a Política de Privacidade.",
      ob_s11_err: "Tens de aceitar para criar conta.",

      // --- Step 12
      ob_s12_title: "Bem-vindo à M•ESA.",
      ob_s12_sub1: "A tua semana está pronta para começar.",
      ob_s12_sub2: "Vais receber a primeira entrega na data que escolheste.",
      ob_s12_sub3: "Podes gerir tudo no teu painel.",
      ob_s12_btn: "Ir para o painel",
      // --- Step 10
      ob_s10_title: "Criar conta",
      ob_s10_name: "Nome completo",
      ob_s10_email: "Email",
      ob_s10_phone: "Telemóvel",
      ob_s10_pass: "Palavra-passe",
      ob_s10_pass2: "Confirmar palavra-passe",
      ob_s10_create: "Criar conta",
      ob_s10_err_required: "Preenche todos os campos.",
      ob_s10_err_email: "Email inválido.",
      ob_s10_err_phone: "Número inválido.",
      ob_s10_err_pass_len: "A palavra-passe deve ter pelo menos 8 caracteres.",
      ob_s10_err_pass_match: "As palavras-passe não coincidem.",
      ob_s10_err_backend: "Falha ao criar conta. Tenta novamente."

    },

    en: {
      ob_s1_title: "Welcome to M•ESA.",
      ob_s1_line2: "Real Portuguese food. Discipline without effort.",
      ob_s1_line3a: "Let’s build your M•ESA week.",
      ob_s1_line3b: "Takes less than 1 minute.",
      ob_start: "Start",
      ob_continue: "Continue",

      ob_s2_q: "What is your main goal?",
      ob_s2_o1: "Eat better without wasting time",
      ob_s2_o2: "Build discipline",
      ob_s2_o3: "Improve training results",
      ob_s2_o4: "Lose weight / control calories",
      ob_s2_o5: "Always have meals ready",
      ob_s2_o6: "All of the above!",
      ob_err_pick_one_min: "Please choose at least one option.",

      ob_s3_q:
        "How many times per week do you think about what you’re going to eat?",
      ob_s3_o1: "1–2 times",
      ob_s3_o2: "3–5 times",
      ob_s3_o3: "6+ times",
      ob_s3_o4: "I’m always improvising",
      ob_s3_o5: "I don’t want to think about it",
      ob_err_pick_one_exact: "Please choose one option.",

      ob_s4_q: "How do you prefer your meals?",
      ob_s4_o1: "High protein",
      ob_s4_o2: "Low carbs",
      ob_s4_o3: "Balanced",
      ob_s4_o4: "Any option",

      ob_s5_q: "Where do you want to receive your meals?",
      ob_s5_home: "Home",
      ob_s5_work: "Work",
      ob_s5_gym: "Pick up at the gym",
      ob_s5_other: "Other",

      ob_s5_address_title: "Address details",
      ob_s5_label: "Label",
      ob_s5_address: "Address",
      ob_s5_city: "City",
      ob_s5_postcode: "Postcode",
      ob_s5_country: "Country",
      ob_s5_country_pt: "Portugal",

      ob_s5_gym_title: "Select the gym",
      ob_s5_gym_placeholder: "Select a gym",
      ob_s5_gym_other: "My gym is not listed",
      ob_s5_gym_hint:
        "If you can’t find your gym, choose the option below and add the address.",

      ob_s6_q: "At what time do you usually receive your meals?",
      ob_s6_hint: "Choose 1 or 2 time slots (max 2).",
      ob_err_max_two: "Maximum 2 time slots.",

      ob_err_fill_address: "Fill label, address, city and postcode.",
      ob_err_pick_gym: "Select a gym or choose the manual option.",

      ob_s11_title: "Legally, to protect you:",
      ob_s11_tc: "TERMS & CONDITIONS",
      ob_s11_pp: "PRIVACY POLICY",
      ob_s11_accept: "I accept the Terms & Conditions and the Privacy Policy.",
      ob_s11_err: "You must accept to create an account.",

      ob_s12_title: "Welcome to M•ESA.",
      ob_s12_sub1: "Your week is ready to start.",
      ob_s12_sub2: "You’ll receive your first delivery on the date you chose.",
      ob_s12_sub3: "You can manage everything in your dashboard.",
      ob_s12_btn: "Go to dashboard",
      // --- Step 10
      ob_s10_title: "Create account",
      ob_s10_name: "Full name",
      ob_s10_email: "Email",
      ob_s10_phone: "Phone",
      ob_s10_pass: "Password",
      ob_s10_pass2: "Confirm password",
      ob_s10_create: "Create account",
      ob_s10_err_required: "Please fill all fields.",
      ob_s10_err_email: "Invalid email.",
      ob_s10_err_phone: "Invalid phone number.",
      ob_s10_err_pass_len: "Password must be at least 8 characters.",
      ob_s10_err_pass_match: "Passwords do not match.",
      ob_s10_err_backend: "Account creation failed. Please try again.",

    }
  };

  function getLang() {
    const v = localStorage.getItem(LS_LANG_KEY);
    return v === "en" ? "en" : DEFAULT_LANG;
  }

  function t(key) {
    const lang = getLang();
    return (
      (translations[lang] && translations[lang][key]) ||
      (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key]) ||
      key
    );
  }

  async function loadOnboardingWeekMenu(weekStartISO) {
    // Uses backend: GET /menu/public-week?week_for=YYYY-MM-DD
    const res = await fetch(`${window.API_BASE}/menu/public-week?week_for=${weekStartISO}`);
    if (!res.ok) {
      let msg = "Failed to load weekly menu.";
      try {
        const j = await res.json();
        msg = j?.detail || msg;
      } catch {}
      throw new Error(msg);
    }
    return await res.json(); // array of {date, weekday, dish_a:{name...}, dish_b:{name...}}
  }

  function findOnboardingMenuForDate(menuWeek, dateISO) {
    if (!Array.isArray(menuWeek)) return null;
    return menuWeek.find((d) => String(d.date).slice(0, 10) === String(dateISO).slice(0, 10)) || null;
  }

  function safeDishName(dishObj, fallback) {
    const name = dishObj?.name;
    if (typeof name === "string" && name.trim()) return name.trim();
    return fallback;
  }


  const state = {
    step: 1,

    goalsMulti: new Set(),
    thinkFreqSingle: null,
    mealPrefsMulti: new Set(),

    deliveryType: null, // home|work|gym|other
    gymId: null,
    gymManual: false, // if true => show address form
    address: { label: "", line1: "", city: "", postcode: "", country: "Portugal" },

    preferredSlots: new Set(),
    acceptedTerms: false, // Step 11

    clientType: null, // "weekly" | "subscriber"
    isFounder: false, // future

    // Step 7 / 7.1 (Slice 1)
    weekStartISO: null, // "YYYY-MM-DD" Wednesday
    firstWeekDays: [], // [{date, meals, dish_choice}, ... 7 items]
    draftId: null, // UUID from backend
    // behaviourGrid example:
    // { Wednesday:{meal1:"meat",meal2:"blank"}, ... }
    behaviourGrid: null,    // Step 10 (Account)
    account: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
      iban: "",
    }
  };

  // Founder flag wiring (UI-only)
  const params = new URLSearchParams(window.location.search);

  const founderParam = (params.get("founder") || "").toLowerCase();
  const isFounderFromUrl = (founderParam === "1" || founderParam === "true" || founderParam === "yes");

  if (isFounderFromUrl) {
    state.isFounder = true;
    localStorage.setItem("mesaFounder", "1");
  } else {
    state.isFounder = localStorage.getItem("mesaFounder") === "1";
  }



  const $screen = document.getElementById("obScreen");
  const $actions = document.getElementById("obActions");
  const $bar = document.getElementById("obProgressBar");

  if (!$screen || !$actions || !$bar) {
    console.warn("Onboarding: missing required DOM nodes.");
    return;
  }

  function setProgress(step) {
    const total = 12;
    const pct = Math.min(100, Math.max(0, Math.round((step / total) * 100)));
    $bar.style.width = pct + "%";
  }

  function clearUI() {
    $screen.innerHTML = "";
    $actions.innerHTML = "";
  }

  function clearError() {
    const existing = $actions.querySelector(".ob-error");
    if (existing) existing.remove();
  }

  function showError(msg) {
    clearError();
    const d = document.createElement("div");
    d.className = "ob-error";
    d.textContent = String(msg || "Something went wrong.");
    $actions.prepend(d);
  }

  function makePrimaryButton(labelKey, onClick, disabled = false) {
    const btn = document.createElement("button");
    btn.className = "btn primary";
    btn.type = "button";
    btn.textContent = t(labelKey);
    btn.disabled = !!disabled;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function makeSecondaryButton(text, onClick, disabled = false) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = text;
    btn.disabled = !!disabled;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function makeError(msgKey) {
    const d = document.createElement("div");
    d.className = "ob-error";
    d.textContent = t(msgKey);
    return d;
  }

  function placeError(errKey) {
    clearError();
    $actions.prepend(makeError(errKey));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  function isValidPhone(phone) {
    // permissive: digits + spaces + + () -
    const v = String(phone || "").trim();
    if (v.length < 7) return false;
    return /^[0-9+\-\s()]+$/.test(v);
  }


  function makeOption({ mode, name, value, labelKey, selected, onChange }) {
    const row = document.createElement("label");
    row.className = "ob-option";
    row.dataset.selected = selected ? "true" : "false";

    const input = document.createElement("input");
    input.type = mode;
    input.name = name;
    input.value = value;
    input.checked = !!selected;

    const span = document.createElement("span");
    span.className = "ob-option-label";
    span.textContent = t(labelKey);

    row.appendChild(input);
    row.appendChild(span);

    row.addEventListener("click", (e) => {
      e.preventDefault();
      clearError();
      if (mode === "checkbox") input.checked = !input.checked;
      else input.checked = true;
      onChange(input.checked);
    });

    return row;
  }

  function inputField(labelKey, value, type = "text", onInput, full = true) {
    const box = document.createElement("div");
    if (full) box.classList.add("full");

    const label = document.createElement("div");
    label.className = "ob-sub";
    label.textContent = t(labelKey);

    const input = document.createElement("input");
    input.type = type;
    input.className = "ob-input";
    input.value = value || "";
    input.autocomplete = "off";

    input.addEventListener("input", (e) => {
      clearError();
      onInput(e.target.value);
    });

    box.appendChild(label);
    box.appendChild(input);
    return box;
  }


  function nextWednesdayISO() {
    const now = new Date();
    const day = now.getDay(); // Sun=0..Sat=6
    const diff = (3 - day + 7) % 7; // Wed=3
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

  function addDaysISO(startISO, offset) {
    const d = new Date(startISO + "T00:00:00");
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }

    // --------------------------------------------
  // MENU HELPERS (for Step 7 dish names)
  // --------------------------------------------
  async function loadOnboardingWeekMenu(weekStartISO) {
    const res = await fetch(`${window.API_BASE}/menu/public-week?week_for=${weekStartISO}`);
    if (!res.ok) {
      let msg = "Failed to load weekly menu.";
      try {
        const j = await res.json();
        msg = j?.detail || msg;
      } catch {}
      throw new Error(msg);
    }
    return await res.json();
  }

  function findOnboardingMenuForDate(menuWeek, dateISO) {
    if (!Array.isArray(menuWeek)) return null;
    return menuWeek.find((d) => String(d.date).slice(0, 10) === String(dateISO).slice(0, 10)) || null;
  }

  function safeDishName(dishObj, fallback) {
    const name = dishObj?.name;
    if (typeof name === "string" && name.trim()) return name.trim();
    return fallback;
  }


  function renderStep1() {
    clearUI();
    setProgress(1);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s1_title");

    const l2 = document.createElement("p");
    l2.className = "ob-line";
    l2.textContent = t("ob_s1_line2");

    const l3a = document.createElement("p");
    l3a.className = "ob-line";
    l3a.textContent = t("ob_s1_line3a");

    const l3b = document.createElement("p");
    l3b.className = "ob-line";
    l3b.textContent = t("ob_s1_line3b");

    $screen.appendChild(h);
    $screen.appendChild(l2);
    $screen.appendChild(l3a);
    $screen.appendChild(l3b);

    $actions.appendChild(makePrimaryButton("ob_start", () => goTo(2)));
  }

  function renderStep2() {
    clearUI();
    setProgress(2);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s2_q");

    const list = document.createElement("div");
    list.className = "ob-options";

    const opts = [
      { v: "o1", k: "ob_s2_o1" },
      { v: "o2", k: "ob_s2_o2" },
      { v: "o3", k: "ob_s2_o3" },
      { v: "o4", k: "ob_s2_o4" },
      { v: "o5", k: "ob_s2_o5" },
      { v: "o6", k: "ob_s2_o6" }
    ];

    opts.forEach((o) => {
      list.appendChild(
        makeOption({
          mode: "checkbox",
          name: "goals",
          value: o.v,
          labelKey: o.k,
          selected: state.goalsMulti.has(o.v),
          onChange: (checked) => {
            if (checked) state.goalsMulti.add(o.v);
            else state.goalsMulti.delete(o.v);
            rerender();
          }
        })
      );
    });

    const btn = makePrimaryButton("ob_continue", () => {
      if (state.goalsMulti.size < 1) return placeError("ob_err_pick_one_min");
      goTo(3);
    });

    $screen.appendChild(h);
    $screen.appendChild(list);
    $actions.appendChild(btn);
  }

  function renderStep3() {
    clearUI();
    setProgress(3);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s3_q");

    const list = document.createElement("div");
    list.className = "ob-options";

    const opts = [
      { v: "1-2", k: "ob_s3_o1" },
      { v: "3-5", k: "ob_s3_o2" },
      { v: "6+", k: "ob_s3_o3" },
      { v: "improv", k: "ob_s3_o4" },
      { v: "dont", k: "ob_s3_o5" }
    ];

    opts.forEach((o) => {
      list.appendChild(
        makeOption({
          mode: "radio",
          name: "thinkFreq",
          value: o.v,
          labelKey: o.k,
          selected: state.thinkFreqSingle === o.v,
          onChange: () => {
            state.thinkFreqSingle = o.v;
            rerender();
          }
        })
      );
    });

    const btn = makePrimaryButton("ob_continue", () => {
      if (!state.thinkFreqSingle) return placeError("ob_err_pick_one_exact");
      goTo(4);
    });

    $screen.appendChild(h);
    $screen.appendChild(list);
    $actions.appendChild(btn);
  }

  function renderStep4() {
    clearUI();
    setProgress(4);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s4_q");

    const list = document.createElement("div");
    list.className = "ob-options";

    const opts = [
      { v: "hp", k: "ob_s4_o1" },
      { v: "lc", k: "ob_s4_o2" },
      { v: "bal", k: "ob_s4_o3" },
      { v: "any", k: "ob_s4_o4" }
    ];

    opts.forEach((o) => {
      list.appendChild(
        makeOption({
          mode: "checkbox",
          name: "mealPrefs",
          value: o.v,
          labelKey: o.k,
          selected: state.mealPrefsMulti.has(o.v),
          onChange: (checked) => {
            if (checked) state.mealPrefsMulti.add(o.v);
            else state.mealPrefsMulti.delete(o.v);
            rerender();
          }
        })
      );
    });

    const btn = makePrimaryButton("ob_continue", () => {
      if (state.mealPrefsMulti.size < 1) return placeError("ob_err_pick_one_min");
      goTo(5);
    });

    $screen.appendChild(h);
    $screen.appendChild(list);
    $actions.appendChild(btn);
  }

  function renderStep5() {
    clearUI();
    setProgress(5);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s5_q");

    const list = document.createElement("div");
    list.className = "ob-options";

    const deliveryOpts = [
      { v: "home", k: "ob_s5_home" },
      { v: "work", k: "ob_s5_work" },
      { v: "gym", k: "ob_s5_gym" },
      { v: "other", k: "ob_s5_other" }
    ];

    deliveryOpts.forEach((o) => {
      list.appendChild(
        makeOption({
          mode: "radio",
          name: "deliveryType",
          value: o.v,
          labelKey: o.k,
          selected: state.deliveryType === o.v,
          onChange: () => {
            state.deliveryType = o.v;
            if (o.v !== "gym") {
              state.gymId = null;
              state.gymManual = false;
            }
            rerender();
          }
        })
      );
    });

    const detailWrap = document.createElement("div");
    detailWrap.className = "ob-detail";

    if (state.deliveryType && state.deliveryType !== "gym") {
      const title = document.createElement("p");
      title.className = "ob-sub";
      title.textContent = t("ob_s5_address_title");
      detailWrap.appendChild(title);
      detailWrap.appendChild(makeAddressForm());
    }

    if (state.deliveryType === "gym") {
      const title = document.createElement("p");
      title.className = "ob-sub";
      title.textContent = t("ob_s5_gym_title");

      const select = document.createElement("select");
      select.className = "ob-select";
      select.innerHTML = `
        <option value="">${escapeHtml(t("ob_s5_gym_placeholder"))}</option>
        <option value="gym_1">Gym 1 (demo)</option>
        <option value="gym_2">Gym 2 (demo)</option>
      `;
      select.value = state.gymId || "";
      select.addEventListener("change", () => {
        clearError();
        state.gymId = select.value || null;
        if (state.gymId) state.gymManual = false;
        rerender();
      });

      const hint = document.createElement("p");
      hint.className = "ob-sub";
      hint.textContent = t("ob_s5_gym_hint");

      const manualRow = document.createElement("label");
      manualRow.className = "ob-manual-row";

      const manualCb = document.createElement("input");
      manualCb.type = "checkbox";
      manualCb.checked = !!state.gymManual;
      manualCb.addEventListener("change", () => {
        clearError();
        state.gymManual = manualCb.checked;
        if (state.gymManual) state.gymId = null;
        rerender();
      });

      const manualText = document.createElement("span");
      manualText.textContent = t("ob_s5_gym_other");

      manualRow.appendChild(manualCb);
      manualRow.appendChild(manualText);

      detailWrap.appendChild(title);
      detailWrap.appendChild(select);
      detailWrap.appendChild(hint);
      detailWrap.appendChild(manualRow);

      if (state.gymManual) {
        const addrTitle = document.createElement("p");
        addrTitle.className = "ob-sub";
        addrTitle.textContent = t("ob_s5_address_title");
        detailWrap.appendChild(addrTitle);

        if (!state.address.label) state.address.label = getLang() === "en" ? "Gym" : "Ginásio";
        detailWrap.appendChild(makeAddressForm());
      }
    }

    const btn = makePrimaryButton("ob_continue", () => {
      if (!state.deliveryType) return placeError("ob_err_pick_one_exact");

      if (state.deliveryType === "gym") {
        if (!state.gymId && !state.gymManual) return placeError("ob_err_pick_gym");
        if (state.gymManual) {
          const a = state.address;
          if (!a.label || !a.line1 || !a.city || !a.postcode) return placeError("ob_err_fill_address");
        }
      } else {
        const a = state.address;
        if (!a.label || !a.line1 || !a.city || !a.postcode) return placeError("ob_err_fill_address");
      }

      goTo(6);
    });

    $screen.appendChild(h);
    $screen.appendChild(list);
    $screen.appendChild(detailWrap);
    $actions.appendChild(btn);
  }

  function makeAddressForm() {
    const wrap = document.createElement("div");
    wrap.className = "ob-form-grid";

    function field(labelKey, value, onInput, full = false) {
      const box = document.createElement("div");
      if (full) box.classList.add("full");

      const label = document.createElement("div");
      label.className = "ob-sub";
      label.textContent = t(labelKey);

      const input = document.createElement("input");
      input.type = "text";
      input.className = "ob-input";
      input.value = value || "";
      input.addEventListener("input", (e) => {
        clearError();
        onInput(e.target.value);
      });

      box.appendChild(label);
      box.appendChild(input);
      return box;
    }

    wrap.appendChild(field("ob_s5_label", state.address.label, (v) => (state.address.label = v), true));
    wrap.appendChild(field("ob_s5_address", state.address.line1, (v) => (state.address.line1 = v), true));
    wrap.appendChild(field("ob_s5_city", state.address.city, (v) => (state.address.city = v)));
    wrap.appendChild(field("ob_s5_postcode", state.address.postcode, (v) => (state.address.postcode = v)));

    const countryBox = document.createElement("div");

    const cl = document.createElement("div");
    cl.className = "ob-sub";
    cl.textContent = t("ob_s5_country");

    const c = document.createElement("input");
    c.type = "text";
    c.className = "ob-input ob-input-disabled";
    c.value = t("ob_s5_country_pt");
    c.disabled = true;

    countryBox.appendChild(cl);
    countryBox.appendChild(c);
    wrap.appendChild(countryBox);

    return wrap;
  }

  function renderStep6() {
    clearUI();
    setProgress(6);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s6_q");

    const hint = document.createElement("p");
    hint.className = "ob-sub";
    hint.textContent = t("ob_s6_hint");

    const grid = document.createElement("div");
    grid.className = "ob-grid-slots";

    const slots = buildSlots();

    slots.forEach((slot) => {
      const selected = state.preferredSlots.has(slot);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ob-slot";
      btn.dataset.selected = selected ? "true" : "false";
      btn.textContent = slot;

      btn.addEventListener("click", () => {
        clearError();

        const isSelected = state.preferredSlots.has(slot);
        if (isSelected) {
          state.preferredSlots.delete(slot);
          return rerender();
        }

        if (state.preferredSlots.size >= 2) return placeError("ob_err_max_two");

        state.preferredSlots.add(slot);
        rerender();
      });

      grid.appendChild(btn);
    });

    const btnContinue = makePrimaryButton("ob_continue", () => {
      if (state.preferredSlots.size < 1) return placeError("ob_err_pick_one_min");
      goTo(7);
    });

    $screen.appendChild(h);
    $screen.appendChild(hint);
    $screen.appendChild(grid);
    $actions.appendChild(btnContinue);
  }

  // ------------------ Step 7 (NEW UI, registration-only) ------------------

  function renderStep7() {
    clearUI();
    clearError();
    setProgress(7);

    if (!state.weekStartISO) state.weekStartISO = nextWednesdayISO();
    if (!Array.isArray(state.firstWeekDays) || state.firstWeekDays.length !== 7) {
      state.firstWeekDays = Array.from({ length: 7 }, (_, i) => ({
        date: addDaysISO(state.weekStartISO, i),
        meals: 0,
        dish_choice: null
      }));
    }
    // Ensure we have the menu for this onboarding week (so Step 7 shows real dish names)
    if (state.weekMenuStartISO !== state.weekStartISO || !Array.isArray(state.weekMenu)) {
      const $title = document.createElement("h2");
      $title.textContent = "Step 7 — First Week Booking";

      const $loading = document.createElement("p");
      $loading.textContent = "Loading menu for your week...";

      $screen.appendChild($title);
      $screen.appendChild($loading);

      if (!state.weekMenuLoading) {
        state.weekMenuLoading = true;
        loadOnboardingWeekMenu(state.weekStartISO)
          .then((week) => {
            state.weekMenu = week;
            state.weekMenuStartISO = state.weekStartISO;
          })
          .catch((err) => {
            console.error(err);
            placeError("ob_err_generic");
          })
          .finally(() => {
            state.weekMenuLoading = false;
            rerender();
          });
      }
      return;
    }

    const $title = document.createElement("h2");
    $title.textContent = "Step 7 — First Week Booking";
    $screen.appendChild($title);

    const $note = document.createElement("p");
    $note.textContent = "Choose meals for Wed→Tue. If 1 meal, pick A or B. If 2 meals, it’s A+B.";
    $screen.appendChild($note);

    const dayNames = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];

    const $table = document.createElement("table");
    $table.className = "ob-table";

    const $thead = document.createElement("thead");
    $thead.innerHTML = `
      <tr>
        <th>Day</th>
        <th>Date</th>
        <th>Meals</th>
        <th>Dish (only if 1 meal)</th>
      </tr>
    `;
    $table.appendChild($thead);

    const $tbody = document.createElement("tbody");

    state.firstWeekDays.forEach((d, idx) => {
      const tr = document.createElement("tr");

      const mealsSel = document.createElement("select");
      mealsSel.innerHTML = `
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
      `;
      mealsSel.value = String(d.meals);

      const dishSel = document.createElement("select");

      // Lookup real dish names for this date
      const dayMenu = findOnboardingMenuForDate(state.weekMenu, d.date);

      const labelA = safeDishName(dayMenu?.dish_a, "Dish A");
      const labelB = safeDishName(dayMenu?.dish_b, "Dish B");

      // Values stay A/B (backend expects that), labels become actual names
      dishSel.innerHTML = `
        <option value="">—</option>
        <option value="A">${labelA}</option>
        <option value="B">${labelB}</option>
      `;

      dishSel.value = d.dish_choice || "";
      dishSel.disabled = d.meals !== 1;

      mealsSel.addEventListener("change", () => {
        d.meals = Number(mealsSel.value);
        if (d.meals !== 1) {
          d.dish_choice = null;
          dishSel.value = "";
          dishSel.disabled = true;
        } else {
          dishSel.disabled = false;
        }
      });

      dishSel.addEventListener("change", () => {
        d.dish_choice = dishSel.value || null;
      });

      tr.innerHTML = `
        <td>${dayNames[idx]}</td>
        <td>${d.date}</td>
      `;

      const tdMeals = document.createElement("td");
      tdMeals.appendChild(mealsSel);

      const tdDish = document.createElement("td");
      tdDish.appendChild(dishSel);

      tr.appendChild(tdMeals);
      tr.appendChild(tdDish);
      $tbody.appendChild(tr);
    });

    $table.appendChild($tbody);
    $screen.appendChild($table);

    const backBtn = makeSecondaryButton("Back", () => goTo(6));
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn primary";
    nextBtn.type = "button";
    nextBtn.textContent = "Continue";
    nextBtn.addEventListener("click", async () => {
      try {
        clearError();

        for (const d of state.firstWeekDays) {
          if (d.meals === 1 && !["A", "B"].includes(d.dish_choice)) {
            throw { detail: "For any day with 1 meal, you must choose A or B." };
          }
          if (![0, 1, 2].includes(d.meals)) {
            throw { detail: "Meals must be 0, 1 or 2." };
          }
        }

        const payload = {
          week_start: state.weekStartISO,
          days: state.firstWeekDays.map((d) => ({
            date: d.date,
            meals: d.meals,
            dish_choice: d.meals === 1 ? d.dish_choice : null
          }))
        };

        const res = await fetch(`${window.API_BASE}/onboarding/first-week`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw data;

        state.draftId = data.draft_id;
        state.behaviourGrid = data.behaviour.grid;

        localStorage.setItem("mesaOnboardingDraftId", state.draftId);
        localStorage.setItem("mesaOnboardingBehaviour", JSON.stringify(state.behaviourGrid));

        goTo(71);
      } catch (err) {
        showError(typeof err?.detail === "string" ? err.detail : "Step 7 failed. Check your input.");
        console.error(err);
      }
    });

    $actions.appendChild(backBtn);
    $actions.appendChild(nextBtn);
  }

  // ------------------ Step 7.1 ------------------

  function renderStep71() {
    clearUI();
    clearError();
    setProgress(7);

    if (!state.draftId) state.draftId = localStorage.getItem("mesaOnboardingDraftId");
    if (!state.behaviourGrid) {
      const raw = localStorage.getItem("mesaOnboardingBehaviour");
      state.behaviourGrid = raw ? JSON.parse(raw) : null;
    }

    if (!state.draftId || !state.behaviourGrid) {
      showError("Missing onboarding draft. Please complete Step 7 again.");
      $actions.appendChild(makeSecondaryButton("Back to Step 7", () => goTo(7)));
      return;
    }

    const $title = document.createElement("h2");
    $title.textContent = "Step 7.1 — Behaviour Pattern";
    $screen.appendChild($title);

    const $note = document.createElement("p");
    $note.textContent = "This pattern will be used for future auto-generation only (never rewrites bookings).";
    $screen.appendChild($note);

    const $table = document.createElement("table");
    $table.className = "ob-table";
    $table.innerHTML = `
      <thead>
        <tr>
          <th>Day</th>
          <th>Food 1</th>
          <th>Food 2</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const $tbody = $table.querySelector("tbody");
    const order = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];

    order.forEach((day) => {
      const row = document.createElement("tr");
      const v = state.behaviourGrid[day] || { meal1: "blank", meal2: "blank" };
      row.innerHTML = `
        <td>${day}</td>
        <td>${v.meal1}</td>
        <td>${v.meal2}</td>
      `;
      $tbody.appendChild(row);
    });

    $screen.appendChild($table);

    const backBtn = makeSecondaryButton("Back", () => goTo(7));
    const weeklyBtn = makeSecondaryButton("Weekly (I’ll choose each week)", async () => {
      await saveClientType("weekly");
    });

    const subBtn = document.createElement("button");
    subBtn.className = "btn primary";
    subBtn.type = "button";
    subBtn.textContent = "Subscriber (auto-follow this pattern)";
    subBtn.addEventListener("click", async () => {
      await saveClientType("subscriber");
    });

    $actions.appendChild(backBtn);
    $actions.appendChild(weeklyBtn);
    $actions.appendChild(subBtn);

    async function saveClientType(clientType) {
      try {
        clearError();

        const res = await fetch(`${window.API_BASE}/onboarding/client-type`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft_id: state.draftId, client_type: clientType })
        });

        const data = await res.json();
        if (!res.ok) throw data;

        state.clientType = clientType;
        localStorage.setItem("mesaOnboardingClientType", clientType);

        // Slice 1 ends here logically; for now jump to Step 11.
        goTo(8);
      } catch (err) {
        showError(typeof err?.detail === "string" ? err.detail : "Failed to save client type.");
        console.error(err);
      }
    }
  }

    // ------------------ Step 8 — Explanation layer ------------------

  async function renderStep8() {
    clearUI();
    clearError();
    setProgress(8);

    if (!state.draftId) state.draftId = localStorage.getItem("mesaOnboardingDraftId");
    if (!state.draftId) {
      showError("Missing onboarding draft. Please complete Step 7 again.");
      $actions.appendChild(makeSecondaryButton("Back to Step 7", () => goTo(7)));
      return;
    }

    try {
      const res = await fetch(`${window.API_BASE}/onboarding/step-8-explanation?draft_id=${encodeURIComponent(state.draftId)}`);
      const data = await res.json();
      if (!res.ok) throw data;

      // Backend is authoritative
      state.clientType = data.client_type;
      localStorage.setItem("mesaOnboardingClientType", data.client_type);

      const $title = document.createElement("h2");
      $title.textContent = data.title || "Step 8";
      $screen.appendChild($title);

      (data.sections || []).forEach((sec) => {
        if (sec.type === "summary" && sec.content) {
          const p = document.createElement("p");
          p.textContent = sec.content;
          $screen.appendChild(p);
          return;
        }

        if (sec.type === "rules" && Array.isArray(sec.items)) {
          const ul = document.createElement("ul");
          sec.items.forEach((it) => {
            const li = document.createElement("li");
            li.textContent = it;
            ul.appendChild(li);
          });
          $screen.appendChild(ul);
          return;
        }

        // informational blocks (subscriber)
        if ((sec.type === "payment_notice" || sec.type === "iban_required") && sec.content) {
          const box = document.createElement("div");
          box.className = "ob-card";
          box.textContent = sec.content;
          $screen.appendChild(box);

          // If subscriber: show IBAN input right under the "iban_required" notice
          if (sec.type === "iban_required" && state.clientType === "subscriber") {
            const ibanField = inputField(
              "ob_s8_iban_label",
              state.account.iban,
              "text",
              (v) => (state.account.iban = v.toUpperCase()),
              true
            );
            // Optional: hint/placeholder
            const input = ibanField.querySelector("input");
            if (input) input.placeholder = "PT50 0000 0000 0000 0000 0000 0";
            $screen.appendChild(ibanField);
          }

          return;
        }

      });

      const backBtn = makeSecondaryButton("Back", () => goTo(71));
      const nextBtn = document.createElement("button");
      nextBtn.className = "btn primary";
      nextBtn.type = "button";
      nextBtn.textContent = "Continue";
      //button update
      nextBtn.addEventListener("click", async () => {
        // Only subscriber must provide IBAN
        if (state.clientType === "subscriber") {
          const iban = (state.account.iban || "").replace(/\s+/g, "").toUpperCase();

          if (!iban) return placeError("ob_s8_err_iban_required");
          // very basic IBAN sanity check (good enough for UI)
          if (!/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(iban)) return placeError("ob_s8_err_iban_invalid");

          try {
            const url = window.API_BASE + "/onboarding/iban";
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ draft_id: state.draftId, iban }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw data;
            // persist locally too (nice-to-have)
            localStorage.setItem("mesaOnboardingIban", iban);
          } catch (e) {
            return placeError("ob_s8_err_iban_invalid");
          }
        }

        if (state.isFounder) {
          goTo(9);
        } else {
          goTo(10);
        }
      });


      $actions.appendChild(backBtn);
      $actions.appendChild(nextBtn);

    } catch (err) {
      showError(typeof err?.detail === "string" ? err.detail : "Failed to load Step 8 explanation.");
      console.error(err);

      $actions.appendChild(makeSecondaryButton("Back", () => goTo(71)));
    }
  }

  function renderStep9() {
    clearUI();
    clearError();
    setProgress(9);

    const h = document.createElement("h2");
    h.textContent = "Founders Plan";

    const p1 = document.createElement("p");
    p1.textContent =
      "You are joining Mesa as a Founding Member. This plan is reserved for early users only.";

    const p2 = document.createElement("p");
    p2.textContent =
      "The Founders Plan is limited to the first 100 clients. Once filled, it will never be available again.";

    const p3 = document.createElement("p");
    p3.textContent =
      "Your benefits and pricing will remain locked as long as you keep your subscription active.";

    $screen.appendChild(h);
    $screen.appendChild(p1);
    $screen.appendChild(p2);
    $screen.appendChild(p3);

    const backBtn = makeSecondaryButton("Back", () => goTo(8));
    const continueBtn = makePrimaryButton("Continue", () => goTo(10));

    $actions.appendChild(backBtn);
    $actions.appendChild(continueBtn);
  }



  async function renderStep10() {
    clearUI();
    clearError();
    setProgress(10);

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s10_title");

    const form = document.createElement("div");
    form.className = "ob-form-grid";

    // Use the GLOBAL inputField helper (do NOT redefine it here)
    form.appendChild(
      inputField("ob_s10_name", state.account.full_name, "text", (v) => (state.account.full_name = v))
    );
    form.appendChild(
      inputField("ob_s10_email", state.account.email, "email", (v) => (state.account.email = v))
    );
    form.appendChild(
      inputField("ob_s10_phone", state.account.phone, "tel", (v) => (state.account.phone = v))
    );
    form.appendChild(
      inputField("ob_s10_pass", state.account.password, "password", (v) => (state.account.password = v))
    );
    form.appendChild(
      inputField("ob_s10_pass2", state.account.password2, "password", (v) => (state.account.password2 = v))
    );

    $screen.appendChild(h);
    $screen.appendChild(form);

    const backBtn = makeSecondaryButton("Back", () => goTo(71));

    const createBtn = makePrimaryButton("ob_s10_create", async () => {
      try {
        clearError();

        const a = state.account;

        // Validation
        if (!a.full_name || !a.email || !a.phone || !a.password || !a.password2) {
          return placeError("ob_s10_err_required");
        }
        if (!isValidEmail(a.email)) return placeError("ob_s10_err_email");
        if (!isValidPhone(a.phone)) return placeError("ob_s10_err_phone");
        if (String(a.password).length < 8) return placeError("ob_s10_err_pass_len");
        if (a.password !== a.password2) return placeError("ob_s10_err_pass_match");

        // Local copy (safe)
        localStorage.setItem(
          "mesaOnboardingAccount",
          JSON.stringify({
            full_name: a.full_name.trim(),
            email: a.email.trim(),
            phone: a.phone.trim(),
          })
        );

        // Backend URLs
        const REGISTER_URL = window.MESA_REGISTER_URL || (window.API_BASE + "/auth/register");
        const TOKEN_URL = window.MESA_TOKEN_URL || (window.API_BASE + "/auth/token");

        // Register payload (IMPORTANT: backend expects "name", not "full_name")
        const payload = {
          name: a.full_name.trim(),
          email: a.email.trim(),
          phone: a.phone.trim(),
          password: a.password,
          draft_id: state.draftId, // keep this consistent with your backend
        };

        // 1) REGISTER
        const res = await fetch(REGISTER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw (data || { detail: t("ob_s10_err_backend") });

        // 2) AUTO-LOGIN (token)
        const tokenRes = await fetch(TOKEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: payload.email,
            password: payload.password,
          }),
        });

        const tokenData = await tokenRes.json().catch(() => ({}));
        if (!tokenRes.ok) throw (tokenData || { detail: t("ob_s10_err_backend") });

        if (!tokenData.access_token) {
          throw { detail: "Token missing from /auth/token response" };
        }

        localStorage.setItem("mesaToken", tokenData.access_token);
        if (tokenData.token_type) localStorage.setItem("mesaTokenType", tokenData.token_type);

        goTo(11);
      } catch (err) {
        showError(typeof err?.detail === "string" ? err.detail : t("ob_s10_err_backend"));
        console.error(err);
      }
    });

    $actions.appendChild(backBtn);
    $actions.appendChild(createBtn);
  }



  // ------------------ Step 11 ------------------

  function renderStep11() {
    clearUI();
    setProgress(11);
    clearError();

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s11_title");

    const linksWrap = document.createElement("div");
    linksWrap.className = "ob-legal-links";

    const tc = document.createElement("a");
    tc.className = "ob-legal-link";
    tc.href = "terms.html";
    tc.target = "_blank";
    tc.rel = "noopener";
    tc.textContent = t("ob_s11_tc");

    const pp = document.createElement("a");
    pp.className = "ob-legal-link";
    pp.href = "privacy.html";
    pp.target = "_blank";
    pp.rel = "noopener";
    pp.textContent = t("ob_s11_pp");

    linksWrap.appendChild(tc);
    linksWrap.appendChild(pp);

    const checkRow = document.createElement("label");
    checkRow.className = "ob-legal-check";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!state.acceptedTerms;
    cb.addEventListener("change", () => {
      state.acceptedTerms = cb.checked;
      clearError();
    });

    const txt = document.createElement("span");
    txt.textContent = t("ob_s11_accept");

    checkRow.appendChild(cb);
    checkRow.appendChild(txt);

    $screen.appendChild(h);
    $screen.appendChild(linksWrap);
    $screen.appendChild(checkRow);

    const btn = makePrimaryButton("ob_continue", () => {
      if (!state.acceptedTerms) return placeError("ob_s11_err");
      goTo(12);
    });

    $actions.appendChild(btn);
  }

  // ------------------ Step 12 ------------------

  function renderStep12() {
    clearUI();
    setProgress(12);
    clearError();

    const wrap = document.createElement("div");
    wrap.className = "ob-success";

    const anim = document.createElement("div");
    anim.className = "ob-success-anim";
    anim.innerHTML = `<div class="ob-check"></div>`;

    const h = document.createElement("h1");
    h.className = "ob-title";
    h.textContent = t("ob_s12_title");

    const p1 = document.createElement("p");
    p1.className = "ob-line";
    p1.textContent = t("ob_s12_sub1");

    const p2 = document.createElement("p");
    p2.className = "ob-line";
    p2.textContent = t("ob_s12_sub2");

    const p3 = document.createElement("p");
    p3.className = "ob-line";
    p3.textContent = t("ob_s12_sub3");

    wrap.appendChild(anim);
    wrap.appendChild(h);
    wrap.appendChild(p1);
    wrap.appendChild(p2);
    wrap.appendChild(p3);

    $screen.appendChild(wrap);

    function redirectToDashboard() {
      localStorage.setItem("mesaOnboardingDone", "1");
      localStorage.setItem("mesaGoBooking", "1");

      const url = window.location.href;

      // If we are on onboarding.html, replace it safely
      if (/onboarding\.html/i.test(url)) {
        window.location.assign(url.replace(/onboarding\.html(\?.*)?$/i, "index.html"));
        return;
      }

      // Otherwise, fallback to relative
      window.location.assign("index.html");
    }



    setTimeout(redirectToDashboard, 1200);

    const btn = makePrimaryButton("ob_s12_btn", redirectToDashboard);
    $actions.appendChild(btn);
  }

  // ------------------ Utilities ------------------

  function buildSlots() {
    return [...rangeSlots("11:00", "15:00", 15), ...rangeSlots("18:00", "22:00", 15)];
  }

  function rangeSlots(startHHMM, endHHMM, stepMin) {
    const out = [];
    const [sh, sm] = startHHMM.split(":").map(Number);
    const [eh, em] = endHHMM.split(":").map(Number);

    let total = sh * 60 + sm;
    const end = eh * 60 + em;

    while (total <= end) {
      const hh = String(Math.floor(total / 60)).padStart(2, "0");
      const mm = String(total % 60).padStart(2, "0");
      out.push(`${hh}:${mm}`);
      total += stepMin;
    }
    return out;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function goTo(step) {
    state.step = step;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function rerender() {
    render();
  }

  function render() {
    switch (state.step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 71: return renderStep71();
      case 8: return renderStep8();
      case 9: return renderStep9();
      case 10: return renderStep10();
      case 11: return renderStep11();
      case 12: return renderStep12();
      default: return renderStep1();
    }
  }

  render();
})();
