/* ==========================================================================
   RIVA Tech — animations.js
   Animaciones de entrada al hacer scroll y contadores.
   Solo JavaScript Vanilla + IntersectionObserver.
   ========================================================================== */

(function () {
  "use strict";

  var $$ = function (sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==================================================================
     1. REVEAL AL HACER SCROLL
     Uso en HTML:
       <div data-reveal>             — sube y aparece
       <div data-reveal="left">      — entra desde la izquierda
       <div data-reveal="right">     — entra desde la derecha
       <div data-reveal="scale">     — escala suave
       <div data-reveal="fade">      — solo opacidad
       <div data-reveal-delay="150"> — retraso en ms
       <div data-reveal-group>       — anima sus hijos en cascada
     ================================================================== */
  function initReveal() {
    var targets = $$("[data-reveal], [data-reveal-group]");
    if (!targets.length) return;

    // Sin soporte o con movimiento reducido: mostrar todo de inmediato
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    targets.forEach(function (el) {
      var delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
    });

    // Duración de la transición más larga declarada en animations.css (0.7s)
    // más el retraso escalonado máximo (490ms), con un pequeño margen.
    var ANIM_MS = 1300;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;

          // will-change solo mientras la animación corre: pedirle al
          // navegador una capa de composición permanente para decenas de
          // elementos gasta memoria de GPU sin ganar nada.
          el.classList.add("is-animating");
          el.classList.add("is-in");

          window.setTimeout(function () {
            el.classList.remove("is-animating");
          }, ANIM_MS);

          observer.unobserve(el); // una sola vez
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==================================================================
     2. CONTADORES
     Uso: <span data-count="120" data-suffix="+">0</span>
     ================================================================== */
  function initCounters() {
    var counters = $$("[data-count]");
    if (!counters.length) return;

    function paint(el, value) {
      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";
      el.textContent = prefix + value + suffix;
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        paint(el, parseInt(el.getAttribute("data-count"), 10));
      });
      return;
    }

    function run(el) {
      var end = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = parseInt(el.getAttribute("data-duration"), 10) || 1400;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - p, 3);
        paint(el, Math.round(end * eased));
        if (p < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) {
      paint(el, 0);
      observer.observe(el);
    });
  }

  /* ==================================================================
     3. PARALLAX MUY SUTIL EN LA ILUSTRACIÓN DEL HERO
     Se desactiva en móvil y con prefers-reduced-motion.
     ================================================================== */
  function initHeroParallax() {
    var art = document.querySelector("[data-parallax]");
    if (!art || reduceMotion || window.innerWidth < 1000) return;

    var ticking = false;

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < 900) {
            art.style.transform = "translate3d(0," + y * -0.035 + "px,0)";
          }
          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );
  }

  /* ==================================================================
     ARRANQUE
     ================================================================== */
  function init() {
    initReveal();
    initCounters();
    initHeroParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
