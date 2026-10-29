/* ==========================================================================
   MAIN — utilidades compartidas (window.UI) y pequeños ajustes globales.
   No hay cursor personalizado ni efectos de texto: solo lo necesario.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function catLabel(id) {
    var found = (window.CATEGORIES || []).filter(function (c) { return c.id === id; })[0];
    return found ? found.label : id;
  }

  /* <img> con width/height (sin saltos de maquetación), carga diferida y srcset opcional.
     opts: { eager, sizes, alt (sobrescribe el alt), cls } */
  function imgTag(image, opts) {
    opts = opts || {};
    var alt = opts.alt !== undefined ? opts.alt : (image.alt || "");
    var attrs = 'src="' + esc(image.src) + '" width="' + image.w + '" height="' + image.h +
      '" alt="' + esc(alt) + '" decoding="async"';
    if (image.srcset) attrs += ' srcset="' + esc(image.srcset) + '" sizes="' + esc(opts.sizes || "100vw") + '"';
    attrs += opts.eager ? ' fetchpriority="high"' : ' loading="lazy"';
    if (opts.cls) attrs += ' class="' + esc(opts.cls) + '"';
    return "<img " + attrs + ">";
  }

  /* Tarjeta de proyecto para las retículas (inicio y proyectos) */
  function workCard(p, sizes) {
    return '<article class="work"><a class="work__link" href="proyecto.html?id=' + encodeURIComponent(p.id) + '">' +
      '<figure class="work__fig">' + imgTag(p.cover, { sizes: sizes, alt: "" }) + "</figure>" +
      '<div class="work__meta"><h3 class="work__title">' + esc(p.title) + "</h3>" +
      '<p class="mono muted">' + esc(p.year) + " · " + esc(p.categories.map(catLabel).join(" / ")) + "</p></div>" +
      "</a></article>";
  }

  /* Rellena el correo y el año a partir de data.js (el HTML ya trae los mismos valores por defecto) */
  function fillGlobals() {
    var site = window.SITE || {};
    if (site.email) {
      doc.querySelectorAll("[data-email]").forEach(function (a) {
        a.textContent = site.email;
        a.setAttribute("href", "mailto:" + site.email);
      });
    }
    doc.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  window.UI = {
    esc: esc, catLabel: catLabel, imgTag: imgTag, workCard: workCard,
    motionOk: function () { return !reduceMotion.matches; },
    onMotionChange: function (fn) {
      if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", fn);
      else if (reduceMotion.addListener) reduceMotion.addListener(fn);
    }
  };

  try { fillGlobals(); } catch (err) { if (window.console) console.error(err); }
})();
