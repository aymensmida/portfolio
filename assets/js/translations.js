(function () {
  "use strict";

  var SUPPORTED = ["en", "fr"];
  var STORAGE_KEY = "portfolio.lang";

  var script = document.currentScript;
  var scriptSrc = script && script.src ? script.src : window.location.href;
  var dataUrl = new URL("../../data/", scriptSrc);

  var dict = {};
  var lang = "en";
  var pending = false;

  function readStored() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(value) !== -1 ? value : null;
    } catch (error) {
      return null;
    }
  }

  function resolve(path) {
    return path.split(".").reduce(function (acc, key) {
      return acc == null ? acc : acc[key];
    }, dict);
  }

  function t(path) {
    var value = resolve(path);
    return typeof value === "string" ? value : "";
  }

  function applyText(selector, attribute) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i += 1) {
      var value = resolve(nodes[i].getAttribute(attribute));
      if (typeof value === "string") {
        if (attribute === "data-i18n-placeholder") {
          nodes[i].setAttribute("placeholder", value);
        } else if (attribute === "data-i18n-title") {
          nodes[i].setAttribute("title", value);
        } else if (attribute === "data-i18n-alt") {
          nodes[i].setAttribute("alt", value);
        } else {
          nodes[i].setAttribute("aria-label", value);
        }
      }
    }
  }

  function updateSwitcher() {
    var buttons = document.querySelectorAll("[data-lang]");
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-lang") === lang));
    }
  }

  function applyMeta() {
    var title = t("meta.title");
    if (title) document.title = title;

    var description = t("meta.description");
    var tag = document.querySelector('meta[name="description"]');

    if (description && tag) tag.setAttribute("content", description);
  }

  function apply() {
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i += 1) {
      var value = resolve(nodes[i].getAttribute("data-i18n"));
      if (typeof value === "string") nodes[i].textContent = value;
    }

    applyText("[data-i18n-aria-label]", "data-i18n-aria-label");
    applyText("[data-i18n-placeholder]", "data-i18n-placeholder");
    applyText("[data-i18n-title]", "data-i18n-title");
    applyText("[data-i18n-alt]", "data-i18n-alt");

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    applyMeta();
    updateSwitcher();

    if (window.PortfolioTheme) window.PortfolioTheme.sync();
  }

  function load(code) {
    return fetch(new URL(code + ".json", dataUrl), { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (json) {
        dict = json && typeof json === "object" ? json : {};
        lang = code;
        return true;
      })
      .catch(function () {
        return false;
      });
  }

  function setLang(next) {
    if (SUPPORTED.indexOf(next) === -1 || next === lang || pending) return;

    pending = true;
    return load(next).then(function (ok) {
      pending = false;
      if (!ok) return;

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (error) {
        /* storage may be unavailable */
      }

      apply();
    });
  }

  function bind() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest ? event.target.closest("[data-lang]") : null;
      if (!target) return;

      var next = target.getAttribute("data-lang");
      if (!next || next === lang) return;

      setLang(next);
    });
  }

  function init() {
    var stored = readStored() || "en";

    return load(stored).then(function (ok) {
      if (!ok) {
        dict = {};
        lang = "en";
        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
        updateSwitcher();
        try {
          localStorage.setItem(STORAGE_KEY, "en");
        } catch (error) {
          /* storage may be unavailable */
        }
      } else {
        apply();
      }

      if (window.PortfolioTheme) window.PortfolioTheme.sync();
      bind();
    });
  }

  window.PortfolioI18n = {
    init: init,
    setLang: setLang,
    getLang: function () {
      return lang;
    },
    t: t,
    refresh: apply
  };
})();