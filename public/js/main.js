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
     5. FORMULARIO DE CONTACTO
     ================================================================== */
  function initForm() {
    var form = $("#contactForm");
    if (!form) return;

    var statusBox = $("#formStatus");
    var submitBtn = $("#formSubmit");

    var RULES = {
      nombre: {
        test: function (v) {
          return v.trim().length >= 2;
        },
        msg: "Escribe tu nombre."
      },
      empresa: { test: function () { return true; }, msg: "" },
      email: {
        test: function (v) {
          return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
        },
        msg: "Escribe un correo válido."
      },
      telefono: {
        test: function (v) {
          var s = v.trim();
          return s === "" || /^[+\d][\d\s()-]{6,}$/.test(s);
        },
        msg: "Revisa el formato del teléfono."
      },
      mensaje: {
        test: function (v) {
          return v.trim().length >= 10;
        },
        msg: "Cuéntanos un poco más (mínimo 10 caracteres)."
      }
    };

    function setError(input, hasError) {
      var field = input.closest(".field");
      if (!field) return;
      field.classList.toggle("has-error", hasError);
      input.setAttribute("aria-invalid", hasError ? "true" : "false");
    }

    function validateField(input) {
      var rule = RULES[input.name];
      if (!rule) return true;
      var ok = rule.test(input.value);
      setError(input, !ok);
      return ok;
    }

    function showStatus(type, message) {
      if (!statusBox) return;
      statusBox.className = "form__status is-visible " + type;
      statusBox.textContent = message;
      statusBox.setAttribute("role", "status");
    }

    // Valida al salir del campo; limpia el error mientras se corrige
    $$("input, textarea", form).forEach(function (input) {
      if (!RULES[input.name]) return;
      input.addEventListener("blur", function () {
        validateField(input);
      });
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && field.classList.contains("has-error")) validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: si está lleno, es un bot. Fingimos éxito y salimos.
      var hp = form.querySelector("input[name='website']");
      if (hp && hp.value) {
        showStatus("is-ok", "Gracias, hemos recibido tu mensaje.");
        return;
      }

      var firstInvalid = null;
      $$("input, textarea", form).forEach(function (input) {
        if (!RULES[input.name]) return;
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      var consent = form.querySelector("input[name='consent']");
      if (consent && !consent.checked) {
        showStatus("is-error", "Necesitamos tu autorización para contactarte.");
        consent.focus();
        return;
      }

      if (firstInvalid) {
        showStatus("is-error", "Revisa los campos marcados e inténtalo de nuevo.");
        firstInvalid.focus();
        return;
      }

      // reCAPTCHA: solo se exige si el widget está realmente cargado
      if (window.grecaptcha && typeof window.grecaptcha.getResponse === "function") {
        var token = "";
        try {
          token = window.grecaptcha.getResponse();
        } catch (err) {
          token = "";
        }
        if (!token) {
          showStatus("is-error", "Confirma que no eres un robot.");
          return;
        }
      }

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (key !== "website") data[key] = value;
      });

      // ---- Sin backend configurado: modo demostración ----
      if (!CONFIG.FORM_ENDPOINT) {
        if (submitBtn) submitBtn.classList.add("is-loading");
        window.setTimeout(function () {
          if (submitBtn) submitBtn.classList.remove("is-loading");
          showStatus(
            "is-ok",
            "¡Gracias, " +
              (data.nombre || "").split(" ")[0] +
              "! Recibimos tu mensaje y te contactaremos en menos de 24 horas hábiles."
          );
          form.reset();
          if (window.grecaptcha && window.grecaptcha.reset) window.grecaptcha.reset();
        }, 800);
        return;
      }

      // ---- Con backend: envío real ----
      if (submitBtn) submitBtn.classList.add("is-loading");

      fetch(CONFIG.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          showStatus(
            "is-ok",
            "¡Gracias! Recibimos tu mensaje y te contactaremos pronto."
          );
          form.reset();
          if (window.grecaptcha && window.grecaptcha.reset) window.grecaptcha.reset();
        })
        .catch(function () {
          showStatus(
            "is-error",
            "No pudimos enviar el mensaje. Escríbenos directamente a contacto@rivatech.mx"
          );
        })
        .then(function () {
          if (submitBtn) submitBtn.classList.remove("is-loading");
        });
    });
  }

  /* ==================================================================
     6. SCROLL SUAVE PARA ANCLAS (fallback y ajuste de foco)
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
    initForm();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
