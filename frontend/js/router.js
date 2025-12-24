// frontend/js/router.js

(function () {
  function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
      page.classList.toggle("hidden", page.id !== pageId);
    });
  }

  // expose globally
  window.showPage = showPage;
})();
