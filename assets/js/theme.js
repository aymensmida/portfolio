(function () {
  "use strict";

  var STORAGE_KEY = "portfolio.theme";
  var LANG_KEY = "portfolio.lang";
  var root = document.documentElement;

  // Restore the saved language direction before first paint. The translation
  // files are applied later by translations.js; this only avoids an LTR flash.
  try {
    var savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang === "fr" || savedLang === "en") {
      root.lang = savedLang;
      root.dir = "ltr";
    }
  } catch (error) {
    /* storage may be unavailable */
  }

  function read() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function label() {
    var dark = current() === "dark";
    if (window.PortfolioI18n && typeof window.PortfolioI18n.t === "function") {
      var translated = window.PortfolioI18n.t(dark ? "common.themeToLight" : "common.themeToDark");
      if (translated) return translated;
    }
    return dark ? "Switch to light theme" : "Switch to dark theme";
  }

  function sync() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    var text = label();
    button.setAttribute("aria-label", text);
    button.setAttribute("title", text);
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* storage may be unavailable */
    }
    sync();
  }

  function toggle() {
    apply(current() === "dark" ? "light" : "dark");
  }

  var saved = read();

  root.setAttribute("data-theme", saved || "dark");

  window.PortfolioTheme = {
    toggle: toggle,
    current: current,
    sync: sync
  };

  document.addEventListener("DOMContentLoaded", sync);
})();