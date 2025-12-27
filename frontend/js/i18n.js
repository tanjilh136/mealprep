// js/i18n.js
(function () {
  const STORAGE_KEY = "mesaLang";
  const DEFAULT_LANG = "pt";

  // NOTE:
  // - This is the SINGLE source of truth for translations.
  // - All pages (index.html, onboarding.html, etc.) include this file.
  const translations = {
    pt: {
      "nav.menu": "Ementa",
      "nav.book": "Reservar",
      "nav.login": "Entrar",
      "nav.register": "Criar conta",
      "nav.logout": "Sair",
      "nav.account": "Perfil",
      "nav.admin": "Administração",
      "nav.kitchen": "Cozinha",

      "hero.title.line1": "Comida portuguesa real.",
      "hero.title.line2": "Disciplina sem esforço.",
      "hero.subtitle.line1": "Cozinhado no dia. Entregue no dia.",
      "hero.subtitle.line2": "Alto em proteína. Baixo em hidratos. Zero cozinha.",
      "hero.foundersCta": "Entrar na tua semana à M•ESA",
      "hero.viewPlansCta": "Ver planos",
      "hero.meta.meals": "3–14 refeições por semana",
      "hero.meta.price": "Preço a partir de 9,45€",
      "hero.meta.delivery": "Entrega em casa, trabalho ou ginásio",

      "launch.strip": "Campanha de lançamento — primeira semana com 50% de desconto nas refeições entregues de 2 a 4 de janeiro.",

      "how.title": "Como funciona",
      "how.step1.title": "Escolhe o plano",
      "how.step1.text": "Define quantas refeições queres por semana (3–14).",
      "how.step2.title": "Cozinhamos no próprio dia",
      "how.step2.text": "Receitas portuguesas, versão fit.",
      "how.step3.title": "Entregamos onde quiseres",
      "how.step3.text": "Casa, trabalho ou para levantar no ginásio.",

      "why.title": "Porquê a M•ESA?",
      "why.item1": "Receitas portuguesas adaptadas ao teu estilo de vida",
      "why.item2": "Alta proteína em todas as refeições",
      "why.item3": "Menos hidratos, menos gordura, mais sabor",
      "why.item4": "Cozinhado e entregue no mesmo dia",
      "why.item5": "Entregas diárias • Menu variado • Sem fidelização",
      "why.item6": "Uma só plataforma para gerir tudo",

      "plans.title": "Planos semanais",
      "plans.tier1.label": "3–5 refeições por semana",
      "plans.tier1.price": "10,50 € por refeição",
      "plans.tier2.label": "6–8 refeições por semana",
      "plans.tier2.price": "9,99 € por refeição",
      "plans.tier3.label": "10–14 refeições por semana",
      "plans.tier3.price": "9,45 € por refeição",
      "plans.note": "Os preços podem mudar com campanhas de lançamento ou promoções.",

      "founders.title": "Founders Plan — Lugares Limitados",
      "founders.subtitle": "Entra no lançamento da M•ESA e garante benefícios para sempre.",
      "founders.benefit1": "1€ de desconto por refeição para sempre",
      "founders.benefit2": "Acesso antecipado a menus",
      "founders.benefit3": "Prioridade nas entregas",
      "founders.benefit4": "Sem fidelização",
      "founders.button": "Aderir ao Founders Plan",

      "who.title": "Quem é a M•ESA?",
      "who.train.title": "Para quem treina",
      "who.work.title": "Para quem trabalha muito",
      "who.discipline.title": "Para quem quer disciplina",

      "menu.weekTitle": "Ementa desta semana",

      "booking.title": "Planeia as refeições da semana",
      "booking.description": "Mínimo de 3 refeições por semana de serviço e máximo de 14. 1 refeição → escolhes A ou B. 2 refeições → recebes ambos os pratos.",
      "booking.dateLabel": "Data de entrega",
      "booking.addressLabel": "Morada de entrega",
      "booking.addressLoading": "A carregar moradas...",
      "booking.mealsLabel": "Número de refeições neste dia",
      "booking.mealsOption1": "1 refeição",
      "booking.mealsOption2": "2 refeições",
      "booking.dishLabel": "Prato (apenas se for 1 refeição)",
      "booking.dishSelect": "Selecionar",
      "booking.dishA": "Prato A",
      "booking.dishB": "Prato B",
      "booking.slotLabel": "Janela horária (15 min)",
      "booking.slotSelectFirst": "Seleciona primeiro uma data",
      "booking.addButton": "Adicionar reserva",
      "booking.listTitle": "As tuas reservas nesta semana de serviço",
      "booking.table.date": "Data",
      "booking.table.time": "Hora",
      "booking.table.meals": "Refeições",
      "booking.table.dish": "Prato",
      "booking.table.address": "Morada",
      "booking.table.empty": "Ainda não tens reservas.",

      "account.title": "A minha conta",
      "account.detailsTitle": "Os meus dados",
      "account.nameLabel": "Nome",
      "account.emailLabel": "Email",
      "account.phoneLabel": "Telefone",
      "account.editInfo": "Para alterares email, telefone ou nome, contacta o suporte. Aqui só podes editar moradas de entrega.",
      "account.addressesTitle": "Moradas de entrega",
      "account.addressesInfo": "Podes registar até três moradas (por exemplo casa, trabalho e ginásio).",
      "account.labelSelect": "Etiqueta",
      "account.label.home": "Casa",
      "account.label.office": "Escritório",
      "account.label.gym": "Ginásio",
      "account.label.school": "Escola",
      "account.label.restaurant": "Restaurante",
      "account.label.other": "Outro",
      "account.customLabel": "Etiqueta personalizada",
      "account.addrLine1": "Rua e número:",
      "account.addrLine2": "Andar ou nº de apartamento:",
      "account.city": "Cidade",
      "account.postal": "Código postal",
      "account.notes": "Notas para motorista / cozinha",
      "account.default": "Usar como morada principal",
      "account.saveAddress": "Guardar morada",
      "account.clear": "Limpar",
      "account.table.label": "Etiqueta",
      "account.table.address": "Morada",
      "account.table.city": "Cidade",
      "account.table.postal": "Código postal",
      "account.table.default": "Principal",
      "account.table.empty": "Ainda não tens moradas.",

      "admin.title": "Painel de administração",
      "admin.regionsTitle": "Zonas de entrega",
      "admin.regionName": "Nome da zona",
      "admin.regionNotes": "Notas",
      "admin.saveRegion": "Guardar zona",
      "admin.table.name": "Nome",
      "admin.table.notes": "Notas",
      "admin.table.empty": "Ainda não há zonas.",
      "admin.menuPlanningTitle": "Planeamento da ementa (por dia)",
      "admin.exportsTitle": "Exportações",
      "admin.exportsDescription": "Descarrega lista de clientes e reservas semanais em CSV.",
      "admin.exportWeekStart": "Início da semana de serviço (segunda-feira)",
      "admin.exportClients": "Descarregar clientes CSV",
      "admin.exportBookings": "Descarregar reservas CSV",

      "kitchen.title": "Mapa diário da cozinha",
      "kitchen.dateLabel": "Data de entrega",
      "kitchen.print": "Imprimir",
      "kitchen.exportCsv": "Exportar CSV",

      "login.title": "Entrar",
      "login.emailLabel": "Email",
      "login.passwordLabel": "Palavra-passe",
      "login.show": "Mostrar",
      "login.forgotPassword": "Esqueceste-te da palavra-passe?",
      "login.submit": "Entrar",

      "register.title": "Criar conta",
      "register.nameLabel": "Nome",
      "register.emailLabel": "Email",
      "register.phoneLabel": "Telefone (opcional)",
      "register.passwordLabel": "Palavra-passe",
      "register.show": "Mostrar",
      "register.submit": "Criar conta",

      "reset.title": "Redefinir palavra-passe",
      "reset.emailLabel": "Email",
      "reset.phoneLabel": "Telefone (igual ao da conta)",
      "reset.newPasswordLabel": "Nova palavra-passe",
      "reset.show": "Mostrar",
      "reset.submit": "Definir nova palavra-passe"
    },

    en: {
      "nav.menu": "Menu",
      "nav.book": "Book",
      "nav.login": "Login",
      "nav.register": "Sign up",
      "nav.logout": "Logout",
      "nav.account": "My Account",
      "nav.admin": "Admin",
      "nav.kitchen": "Kitchen",

      "hero.title.line1": "Real Portuguese food.",
      "hero.title.line2": "Discipline without effort.",
      "hero.subtitle.line1": "Fresh meals cooked daily and delivered the same day.",
      "hero.subtitle.line2": "High protein, lower carbs, zero cooking.",
      "hero.foundersCta": "Enter Founders Plan",
      "hero.viewPlansCta": "View Plans",
      "hero.meta.meals": "3–14 meals per week",
      "hero.meta.price": "Starts at €9.45 per meal",
      "hero.meta.delivery": "Delivery to home, work, or gym",

      "launch.strip": "Launch promo — first week 50% OFF meals delivered Jan 2–4 only.",

      "how.title": "How it works",
      "how.step1.title": "Choose your plan",
      "how.step1.text": "Define how many meals you want per week (3–14).",
      "how.step2.title": "Cooked on the same day",
      "how.step2.text": "Traditional Portuguese recipes, fitness-style.",
      "how.step3.title": "Delivered where you want",
      "how.step3.text": "Home, work, or pickup at the gym.",

      "why.title": "Why M•ESA?",
      "why.item1": "Portuguese recipes adapted to your lifestyle",
      "why.item2": "High protein in every meal",
      "why.item3": "Fewer carbs, less fat, more flavour",
      "why.item4": "Cooked and delivered on the same day",
      "why.item5": "Daily delivery • Varied menu • No commitment",
      "why.item6": "One single platform to manage everything",

      "plans.title": "Weekly Plans",
      "plans.tier1.label": "3–5 meals per week",
      "plans.tier1.price": "10.50 € per meal",
      "plans.tier2.label": "6–8 meals per week",
      "plans.tier2.price": "9.99 € per meal",
      "plans.tier3.label": "10–14 meals per week",
      "plans.tier3.price": "9.45 € per meal",
      "plans.note": "Prices may change with launch campaigns or promotions.",

      "founders.title": "Founders Plan — Limited Spots",
      "founders.subtitle": "Join the M•ESA launch and secure lifetime benefits.",
      "founders.benefit1": "€1 discount per meal forever",
      "founders.benefit2": "Early access to menus",
      "founders.benefit3": "Priority delivery",
      "founders.benefit4": "No commitment",
      "founders.button": "Join the Founders Plan",

      "who.title": "Who is M•ESA for?",
      "who.train.title": "For people who train",
      "who.work.title": "For people who work a lot",
      "who.discipline.title": "For people who want discipline",

      "menu.weekTitle": "This week’s menu",

      "booking.title": "Plan your meals for the week",
      "booking.description": "Minimum 3 meals per service week and maximum 14. 1 meal → choose A or B. 2 meals → you receive both dishes.",
      "booking.dateLabel": "Delivery date",
      "booking.addressLabel": "Delivery address",
      "booking.addressLoading": "Loading addresses...",
      "booking.mealsLabel": "Number of meals for this day",
      "booking.mealsOption1": "1 meal",
      "booking.mealsOption2": "2 meals",
      "booking.dishLabel": "Dish (only if 1 meal)",
      "booking.dishSelect": "Select",
      "booking.dishA": "Dish A",
      "booking.dishB": "Dish B",
      "booking.slotLabel": "Time slot (15 min)",
      "booking.slotSelectFirst": "Select a date first",
      "booking.addButton": "Add booking",
      "booking.listTitle": "Your bookings for this service week",
      "booking.table.date": "Date",
      "booking.table.time": "Time",
      "booking.table.meals": "Meals",
      "booking.table.dish": "Dish",
      "booking.table.address": "Address",
      "booking.table.empty": "No bookings yet.",

      "account.title": "My account",
      "account.detailsTitle": "My details",
      "account.nameLabel": "Name",
      "account.emailLabel": "Email",
      "account.phoneLabel": "Phone",
      "account.editInfo": "To change your email, phone or name, contact support. You can only edit delivery addresses here.",
      "account.addressesTitle": "Delivery addresses",
      "account.addressesInfo": "You can register up to three addresses (for example home, office, and gym).",
      "account.labelSelect": "Label",
      "account.label.home": "Home",
      "account.label.office": "Office",
      "account.label.gym": "Gym",
      "account.label.school": "School",
      "account.label.restaurant": "Restaurant",
      "account.label.other": "Other",
      "account.customLabel": "Custom label",
      "account.addrLine1": "Street and Number:",
      "account.addrLine2": "Floor or Appartment No:",
      "account.city": "City",
      "account.postal": "Postal code",
      "account.notes": "Notes for driver / kitchen",
      "account.default": "Use as default address",
      "account.saveAddress": "Save address",
      "account.clear": "Clear",
      "account.table.label": "Label",
      "account.table.address": "Address",
      "account.table.city": "City",
      "account.table.postal": "Postal",
      "account.table.default": "Default",
      "account.table.empty": "No addresses yet.",

      "admin.title": "Admin dashboard",
      "admin.regionsTitle": "Service regions",
      "admin.regionName": "Region name",
      "admin.regionNotes": "Notes",
      "admin.saveRegion": "Save region",
      "admin.table.name": "Name",
      "admin.table.notes": "Notes",
      "admin.table.empty": "No regions yet.",
      "admin.menuPlanningTitle": "Menu planning (per day)",
      "admin.exportsTitle": "Exports",
      "admin.exportsDescription": "Download client list and weekly bookings as CSV files.",
      "admin.exportWeekStart": "Service week start (Monday)",
      "admin.exportClients": "Download clients CSV",
      "admin.exportBookings": "Download bookings CSV",

      "kitchen.title": "Kitchen daily sheet",
      "kitchen.dateLabel": "Delivery date",
      "kitchen.print": "Print",
      "kitchen.exportCsv": "Export CSV",

      "login.title": "Login",
      "login.emailLabel": "Email",
      "login.passwordLabel": "Password",
      "login.show": "Show",
      "login.forgotPassword": "Forgot password?",
      "login.submit": "Login",

      "register.title": "Create account",
      "register.nameLabel": "Name",
      "register.emailLabel": "Email",
      "register.phoneLabel": "Phone (optional)",
      "register.passwordLabel": "Password",
      "register.show": "Show",
      "register.submit": "Create account",

      "reset.title": "Reset password",
      "reset.emailLabel": "Email",
      "reset.phoneLabel": "Phone (same as account)",
      "reset.newPasswordLabel": "New password",
      "reset.show": "Show",
      "reset.submit": "Set new password"
    }
  };

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function getLang() {
    const saved = safeGet(STORAGE_KEY);
    return (saved === "pt" || saved === "en") ? saved : DEFAULT_LANG;
  }

  function setLang(lang) {
    const v = (lang === "en") ? "en" : "pt";
    safeSet(STORAGE_KEY, v);
    applyLanguage(v);
    return v;
  }


  function t(key) {
    const lang = getLang();
    return (translations[lang] && translations[lang][key]) ||
      (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key]) ||
      key;
  }

  function applyLanguage(lang) {
    const dict = translations[lang] || translations[DEFAULT_LANG];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translated = dict[key];
      if (translated) el.textContent = translated;
    });
  }

  function initLanguageSelect(selectEl) {
    if (!selectEl) return;
    const current = getLang();
    selectEl.value = current;
    selectEl.addEventListener("change", () => {
      setLang(selectEl.value);
    });
  }

  window.MesaI18n = { translations, getLang, setLang, t, applyLanguage, initLanguageSelect };

  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(getLang());
  });
})();
