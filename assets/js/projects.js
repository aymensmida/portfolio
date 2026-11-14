(function () {
  "use strict";

  function init() {
    var buttons = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-project]");
    var empty = document.querySelector("[data-empty-state]");
    if (!buttons.length || !cards.length) return;

    function apply(filter) {
      var visible = 0;

      for (var i = 0; i < buttons.length; i += 1) {
        buttons[i].setAttribute(
          "aria-pressed",
          String(buttons[i].getAttribute("data-filter") === filter)
        );
      }

      for (var j = 0; j < cards.length; j += 1) {
        var tags = (cards[j].getAttribute("data-tags") || "").split(" ");
        var show = filter === "all" || tags.indexOf(filter) !== -1;
        cards[j].hidden = !show;
        if (show) visible += 1;
      }

      if (empty) empty.hidden = visible !== 0;
    }

    for (var k = 0; k < buttons.length; k += 1) {
      buttons[k].addEventListener("click", function () {
        apply(this.getAttribute("data-filter") || "all");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();