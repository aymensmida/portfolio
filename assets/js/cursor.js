(function () {
  "use strict";

  var cursor = null;
  var mouseX = 0;
  var mouseY = 0;
  var currentX = 0;
  var currentY = 0;
  var isVisible = false;
  var isHover = false;
  var isClicking = false;
  var animationId = null;
  var prefersReducedMotion = false;
  var isTouchDevice = false;

  function initCursor() {
    prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (prefersReducedMotion || isTouchDevice) {
      document.documentElement.classList.add("cursor-disabled");
      return;
    }

    cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    var interactiveElements = document.querySelectorAll(
      "a, button, .btn, .nav-link, .filter-btn, .lang-btn, .icon-btn, " +
      ".project-card, .skill-card, .timeline-card, .contact-link, " +
      ".social-link, [data-theme-toggle], [data-nav-toggle], " +
      "input, textarea, select, [download]"
    );

    interactiveElements.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        isHover = true;
        if (cursor) cursor.classList.add("is-hover");
        document.documentElement.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", function () {
        isHover = false;
        if (cursor) cursor.classList.remove("is-hover");
        document.documentElement.classList.remove("cursor-hover");
      });
    });

    animate();
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      if (cursor) cursor.classList.add("is-visible");
    }
  }

  function onMouseEnter() {
    isVisible = true;
    if (cursor) cursor.classList.add("is-visible");
  }

  function onMouseLeave() {
    isVisible = false;
    if (cursor) cursor.classList.remove("is-visible");
    document.documentElement.classList.remove("cursor-hover");
  }

  function onMouseDown() {
    isClicking = true;
    if (cursor) cursor.classList.add("is-clicking");
  }

  function onMouseUp() {
    isClicking = false;
    if (cursor) cursor.classList.remove("is-clicking");
  }

  function animate() {
    if (prefersReducedMotion) return;

    var dx = mouseX - currentX;
    var dy = mouseY - currentY;

    currentX += dx * 0.2;
    currentY += dy * 0.2;

    if (cursor) {
      cursor.style.transform = "translate(" + (currentX - 10) + "px, " + (currentY - 10) + "px)";
    }

    animationId = requestAnimationFrame(animate);
  }

  function destroyCursor() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (cursor && cursor.parentNode) {
      cursor.parentNode.removeChild(cursor);
    }
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseenter", onMouseEnter);
    document.removeEventListener("mouseleave", onMouseLeave);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mouseup", onMouseUp);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCursor);
  } else {
    initCursor();
  }

  window.addEventListener("beforeunload", destroyCursor);
})();