(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var FALLBACK_EMAIL = "aymensmida122@gmail.com";

  var CV_FILES = {
    en: "documents/en_cv_aymen_smida_senior_fullstack.pdf",
    fr: "documents/fr_cv_aymen_smida_senior_fullstack.pdf"
  };

  function t(key, fallback) {
    if (window.PortfolioI18n && typeof window.PortfolioI18n.t === "function") {
      var value = window.PortfolioI18n.t(key);
      if (value) return value;
    }
    return fallback;
  }

  function updateCvDownload() {
    var btn = document.getElementById("cv-download-btn");
    if (!btn || !window.PortfolioI18n) return;

    var lang = window.PortfolioI18n.getLang();
    var cvFile = CV_FILES[lang] || CV_FILES.en;

    btn.href = cvFile;
    btn.setAttribute("download", "aymen-smida-cv.pdf");
  }

  function initThemeToggle() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button || !window.PortfolioTheme) return;

    button.addEventListener("click", function () {
      window.PortfolioTheme.toggle();
    });
  }

  function setFieldError(form, name, message) {
    var input = form.elements[name];
    var box = form.querySelector('[data-error-for="' + name + '"]');

    if (box) box.textContent = message;

    if (!input) return;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var email = form.getAttribute("data-email") || FALLBACK_EMAIL;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.name.value.trim();
      var emailValue = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      var errors = {
        name: name.length < 2 ? t("contact.errors.name", "Please enter your name.") : "",
        email: EMAIL_RE.test(emailValue) ? "" : t("contact.errors.email", "Please enter a valid email address."),
        message: message.length < 10 ? t("contact.errors.message", "Please write a message (at least 10 characters).") : ""
      };

      setFieldError(form, "name", errors.name);
      setFieldError(form, "email", errors.email);
      setFieldError(form, "message", errors.message);

      var firstInvalid = null;
      for (var key in errors) {
        if (errors[key]) {
          firstInvalid = key;
          break;
        }
      }

      if (firstInvalid) {
        form.elements[firstInvalid].focus();
        return;
      }

      if (status) {
        status.hidden = false;
        status.textContent = t(
          "contact.success",
          "Your email client should now open. If it doesn't, write to " + email + " directly."
        );
      }

      var subject = encodeURIComponent("Portfolio contact — " + name);
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + emailValue + ")");
      window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
    });

    form.addEventListener("input", function (event) {
      var field = event.target;
      if (!field || !field.name) return;
      if (field.getAttribute("aria-invalid") === "true") setFieldError(form, field.name, "");
    });
  }

  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = String(new Date().getFullYear());

    for (var i = 0; i < nodes.length; i += 1) nodes[i].textContent = year;
  }

  function init() {
    initThemeToggle();
    initContactForm();
    initYear();

    if (window.PortfolioI18n) {
      var initPromise = window.PortfolioI18n.init();
      if (initPromise && typeof initPromise.then === "function") {
        initPromise.then(updateCvDownload);
      } else {
        updateCvDownload();
      }

      var originalSetLang = window.PortfolioI18n.setLang;
      window.PortfolioI18n.setLang = function (lang) {
        var promise = originalSetLang.call(this, lang);
        if (promise && typeof promise.then === "function") {
          promise.then(updateCvDownload);
        } else {
          updateCvDownload();
        }
      };
    } else {
      updateCvDownload();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();