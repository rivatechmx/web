/* ==========================================================================
   RIVA Tech — main.js
   JavaScript Vanilla. Sin dependencias externas.

   Módulos:
   - preloader
   - navbar (scroll, progreso, menú móvil, scrollspy)
   - back to top
   - año del footer
   - formulario de contacto (validación + envío preparado)
   ========================================================================== */

(function () {
  "use strict";

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ------------------------------------------------------------------
     CONFIGURACIÓN
     Cuando exista backend, cambia FORM_ENDPOINT por la URL real
     (por ejemplo "/api/contacto" o un servicio tipo Formspree).
     Con null, el formulario valida y muestra confirmación sin enviar.
     ------------------------------------------------------------------ */
  var CONFIG = {
    FORM_ENDPOINT: null,
    RECAPTCHA_SITE_KEY: "" // pega aquí tu site key de Google reCAPTCHA v2
  };

  /* ==================================================================
     1. PRELOADER
     ================================================================== */
  function initLoader() {
    var loader = $("#loader");
    if (!loader) return;

    var done = false;

    var hide = function () {
      if (done) return;
      done = true;
      loader.classList.add("is-done");
      window.setTimeout(function () {
        loader.setAttribute("hidden", "");
      }, 500);
    };

    // Red de seguridad: el sitio es estático, no hay nada que justifique
    // tapar el contenido más allá de este margen. Un límite alto retrasa
    // el LCP porque el elemento medido pasa a ser el loader, no el <h1>.
    var safety = window.setTimeout(hide, 800);

    // Si el documento ya terminó de cargar (caché, bfcache), no esperamos
    // un evento 'load' que quizá ya ocurrió.
    if (document.readyState === "complete") {
      hide();
      window.clearTimeout(safety);
      return;
    }

    window.addEventListener("load", function () {
      window.clearTimeout(safety);
      window.setTimeout(hide, 120);
    });
  }

  /* ==================================================================
     2. NAVBAR
     ================================================================== */
  function initNav() {
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var mobile = $("#navMobile");
    var progress = $("#navProgress");
    if (!nav) return;

    /* --- Sombra + fondo al hacer scroll, y barra de progreso --- */
    var ticking = false;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle("is-scrolled", y > 12);

      if (progress) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (y / max) * 100 : 0;
        progress.style.width = Math.min(pct, 100) + "%";
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    onScroll();

    /* --- Menú móvil --- */
    function closeMenu() {
      if (!toggle || !mobile) return;
      toggle.setAttribute("aria-expanded", "false");
      mobile.classList.remove("is-open");
      nav.classList.remove("is-menu-open");
      document.body.classList.remove("is-locked");
    }

    function openMenu() {
      if (!toggle || !mobile) return;
      toggle.setAttribute("aria-expanded", "true");
      mobile.classList.add("is-open");
      nav.classList.add("is-menu-open");
      document.body.classList.add("is-locked");
    }

    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        open ? closeMenu() : openMenu();
      });

      $$("a", mobile).forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 900) closeMenu();
      });
    }

    /* --- Scrollspy: resalta la sección visible --- */
    var links = $$(".nav__link[href^='#']");
    var sections = links
      .map(function (link) {
        return document.getElementById(link.getAttribute("href").slice(1));
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ==================================================================
     3. BOTÓN VOLVER ARRIBA
     ================================================================== */
  function initToTop() {
    var btn = $("#toTop");
    if (!btn) return;

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        window.requestAnimationFrame(function () {
          btn.classList.toggle("is-visible", window.scrollY > 620);
          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      // Devuelve el foco al inicio del documento por accesibilidad
      var brand = $(".nav .brand");
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  /* ==================================================================
     4. AÑO DEL FOOTER
     ================================================================== */
  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ==================================================================
     5. SCROLL SUAVE PARA ANCLAS (fallback y ajuste de foco)
     ================================================================== */
  function initAnchors() {
    $$("a[href^='#']:not([href='#'])").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href").slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
          10
        ) || 74;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;

        window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
        history.replaceState(null, "", "#" + id);

        // Accesibilidad: mueve el foco a la sección destino
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ==================================================================
     ARRANQUE
     ================================================================== */
  function init() {
    initLoader();
    initNav();
    initToTop();
    initYear();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
