/* M•ESA Onboarding
   - Developer language: English
   - UI text: translations (PT default, EN optional)
   - Psychological steps: not persisted outside this flow
   - Real steps: kept in memory for now; backend submit later
   - IMPORTANT: No inline styles. Uses existing .btn.primary + scoped onboarding CSS.
*/

(() => {
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

      ob_err_fill_address: "Preenche a etiqueta, morada, cidade e código postal.",
      ob_err_pick_gym: "Seleciona um ginásio ou escolhe a opção de adicionar manualmente.",
        // --- Step 11
        ob_s11_title: "Legalmente, para te proteger:",
        ob_s11_tc: "TERMOS E CONDIÇÕES",
        ob_s11_pp: "POLÍTICA DE PRIVACIDADE",
        ob_s11_accept: "Aceito os Termos e Condições e a Política de Privacidade.",
        ob_s11_err: "Tens de aceitar para criar conta.",

        // --- Step 12
        ob_s12_title: "Bem-vindo à M•ESA.",
        ob_s12_sub1: "A tua semana está pronta para começar.",
        ob_s12_sub2: "Vais receber a primeira entrega na data que escolheste.",
        ob_s12_sub3: "Podes gerir tudo no teu painel.",
        ob_s12_btn: "Ir para o painel",

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

      ob_s3_q: "How many times per week do you think about what you’re going to eat?",
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
    acceptedTerms: false,     // Step 11
    clientType: null,         // "weekly" | "subscriber" | "founders" (use later)
    isFounder: false, // true for first 100, later backend decides


  };

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

  function makePrimaryButton(labelKey, onClick, disabled = false) {
    const btn = document.createElement("button");
    btn.className = "btn primary";
    btn.type = "button";
    btn.textContent = t(labelKey);
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

            // Reset gym-specific state when switching away
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

    // Home/Work/Other => address form
    if (state.deliveryType && state.deliveryType !== "gym") {
      const title = document.createElement("p");
      title.className = "ob-sub";
      title.textContent = t("ob_s5_address_title");
      detailWrap.appendChild(title);
      detailWrap.appendChild(makeAddressForm());
    }

    // Gym => dropdown + "not listed" checkbox => address form
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
        if (state.gymId) state.gymManual = false; // if picked a gym, disable manual mode
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

        // Pre-fill label suggestion if empty
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

      localStorage.setItem("mesaGoBooking", "1");
      localStorage.setItem("mesaOnboarding", "1"); // NEW
      window.location.href = "index.html";
    });

    $screen.appendChild(h);
    $screen.appendChild(hint);
    $screen.appendChild(grid);
    $actions.appendChild(btnContinue);
  }
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
  tc.href = "terms.html"; // change if needed
  tc.target = "_blank";
  tc.rel = "noopener";
  tc.textContent = t("ob_s11_tc");

  const pp = document.createElement("a");
  pp.className = "ob-legal-link";
  pp.href = "privacy.html"; // change if needed
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


function renderStep12() {
  clearUI();
  setProgress(12);
  clearError();

  const wrap = document.createElement("div");
  wrap.className = "ob-success";

  const anim = document.createElement("div");
  anim.className = "ob-success-anim";
  anim.innerHTML = `<div class="ob-check"></div>`; // CSS anim does the magic

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
    // prevent double redirects / weird back-button loops
    if (localStorage.getItem("mesaOnboardingDone") === "1") return;

    localStorage.setItem("mesaOnboardingDone", "1");
    localStorage.setItem("mesaGoBooking", "1"); // your index router already handles this
    window.location.href = "index.html";
  }

  // Auto redirect after the success animation has time to play
  // (tweak 1200ms if your animation is longer/shorter)
  setTimeout(redirectToDashboard, 1200);

  // Fallback button (if user has slow device / blocked timers / wants control)
  const btn = makePrimaryButton("ob_s12_btn", redirectToDashboard);
  $actions.appendChild(btn);
}


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
      case 11: return renderStep11();
      case 12: return renderStep12();

      default: return renderStep1();
    }
  }

  render();
})();
