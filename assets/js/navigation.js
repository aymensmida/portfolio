(function () {
  "use strict";

  function t(key, fallback) {
    if (window.PortfolioI18n && typeof window.PortfolioI18n.t === "function") {
      var value = window.PortfolioI18n.t(key);
      if (value) return value;
    }
    return fallback;
  }

  function initMenu() {
    var nav = document.querySelector("[data-nav]");
    var button = document.querySelector("[data-nav-toggle]");
    if (!nav || !button) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? t("nav.close", "Close menu") : t("nav.menu", "Menu"));
      document.body.classList.toggle("nav-open", open);
    }

    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 900) setOpen(false);
      },
      { passive: true }
    );
  }

  function initActiveNav() {
    var links = {};
    var nodes = document.querySelectorAll("[data-nav-link]");
    var sections = document.querySelectorAll("main section[id]");

    for (var i = 0; i < nodes.length; i += 1) {
      var id = nodes[i].getAttribute("data-nav-link");
      if (!id || id === "top") continue;
      if (!links[id]) links[id] = [];
      links[id].push(nodes[i]);
    }

    if (!("IntersectionObserver" in window) || !sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          Object.keys(links).forEach(function (key) {
            links[key].forEach(function (link) {
              var active = key === entry.target.id;
              link.classList.toggle("is-active", active);
              if (active) link.setAttribute("aria-current", "true");
              else link.removeAttribute("aria-current");
            });
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    for (var j = 0; j < sections.length; j += 1) observer.observe(sections[j]);
  }

  function initScrollUI() {
    var header = document.querySelector("[data-header]");
    var toTop = document.querySelector("[data-to-top]");
    var progress = document.querySelector("[data-progress]");
    var frame = null;

    function update() {
      frame = null;
      var y = window.scrollY || window.pageYOffset;

      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 640);

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      }
    }

    function onScroll() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener("click", function () {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      });
    }
  }

  function init() {
    initMenu();
    initActiveNav();
    initScrollUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();