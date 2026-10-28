/* ==========================================================================
   PROJECT — renderiza proyecto.html?id=XX a partir de js/data.js
   ========================================================================== */
(function () {
  "use strict";

  var UI = window.UI, PROJECTS = window.PROJECTS, SITE = window.SITE || {};
  var root = document.getElementById("project");
  if (!UI || !PROJECTS || !root) return;
  var esc = UI.esc, imgTag = UI.imgTag, catLabel = UI.catLabel;

  var id = null;
  try { id = new URLSearchParams(location.search).get("id"); } catch (e) { /* noop */ }
  var idx = -1;
  PROJECTS.forEach(function (p, i) { if (p.id === id) idx = i; });

  if (idx < 0) {
    document.title = "Proyecto no encontrado — " + (SITE.title || "");
    root.innerHTML =
      '<section class="section"><p class="mono muted">Error 404</p>' +
      '<h1 class="h-xxl">Proyecto no encontrado</h1>' +
      '<p class="lead" style="margin-top:1.5rem">No existe ningún proyecto con ese identificador.</p>' +
      '<p style="margin-top:2rem"><a class="pj-back mono" href="index.html#archivo">← Volver al archivo</a></p></section>';
    return;
  }

  var p = PROJECTS[idx];
  var prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  var next = PROJECTS[(idx + 1) % PROJECTS.length];
  var n = PROJECTS.length;

  document.title = p.title + " — " + (SITE.title || "");
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", p.summary);

  var disciplines = p.disciplines.map(esc).join("<br>");
  var cats = p.categories.map(catLabel).map(esc).join(" / ");

  var gallery = (p.gallery || []).map(function (g) {
    return '<figure class="layout-' + esc(g.layout) + ' reveal">' +
      imgTag(g.image, { sizes: g.layout === "full" ? "100vw" : "(min-width: 48rem) 60vw, 92vw" }) +
      (g.caption ? '<figcaption class="mono">' + esc(g.caption) + "</figcaption>" : "") + "</figure>";
  }).join("");

  var process = (p.process || []).map(function (s) {
    return "<li class=\"reveal\"><div><h3 class=\"h-l\">" + esc(s.title) + "</h3></div><p>" + esc(s.text) + "</p></li>";
  }).join("");

  var credits = (p.credits || []).map(function (c) {
    return "<div><dt class=\"mono\">" + esc(c.role) + "</dt><dd>" + esc(c.name) + "</dd></div>";
  }).join("");

  root.innerHTML =
    '<header class="pj-head">' +
      '<a class="pj-back mono" href="index.html#archivo">← Archivo</a>' +
      '<div class="pj-titlebar">' +
        '<span class="pj-num" aria-label="Proyecto ' + esc(p.id) + ' de ' + n + '">' + esc(p.id) + "</span>" +
        '<h1 class="h-xxl reveal-mask">' + esc(p.title) + "</h1>" +
      "</div>" +
      (p.provisional ? '<p class="badge" style="margin-top:1.25rem">Contenido provisional</p>' : "") +
      '<dl class="pj-meta">' +
        '<div><dt class="mono">Año</dt><dd>' + esc(p.year) + "</dd></div>" +
        '<div><dt class="mono">Cliente</dt><dd>' + esc(p.client) + "</dd></div>" +
        '<div><dt class="mono">Rol</dt><dd>' + esc(p.role) + "</dd></div>" +
        '<div><dt class="mono">Disciplinas</dt><dd>' + disciplines + "</dd></div>" +
      "</dl>" +
    "</header>" +

    '<section class="pj-hero" aria-label="Presentación">' +
      '<figure class="pj-hero__fig reveal">' + imgTag(p.cover, { eager: true, sizes: "(min-width: 48rem) 58vw, 100vw" }) + "</figure>" +
      '<div class="pj-hero__text">' +
        '<p class="mono muted">' + cats + "</p>" +
        '<p class="lead">' + esc(p.summary) + "</p>" +
        '<p class="prose">' + esc(p.context) + "</p>" +
      "</div>" +
    "</section>" +

    (gallery ? '<section class="pj-gallery" aria-label="Imágenes del proyecto">' + gallery + "</section>" : "") +

    (process ? '<section class="pj-process section section--ink" aria-labelledby="proceso-title">' +
      '<p class="mono muted">Proceso</p>' +
      '<h2 id="proceso-title" class="h-xl reveal-mask">Descripción<br>del proceso</h2>' +
      "<ol>" + process + "</ol></section>" : "") +

    '<section class="pj-credits section" aria-labelledby="creditos-title">' +
      '<h2 id="creditos-title" class="h-xl reveal-mask">Créditos</h2>' +
      "<dl>" + credits + "</dl></section>" +

    '<nav class="pj-pager section section--acid" aria-label="Otros proyectos">' +
      '<a class="pj-pager__prev" href="proyecto.html?id=' + prev.id + '" data-cursor="Ir">' +
        '<span class="mono">← Anterior · ' + esc(prev.id) + "</span>" +
        '<span class="h-l">' + esc(prev.title) + "</span></a>" +
      '<a class="pj-pager__next" href="proyecto.html?id=' + next.id + '" data-cursor="Ir">' +
        '<span class="mono">Siguiente · ' + esc(next.id) + " →</span>" +
        '<span class="h-l">' + esc(next.title) + "</span></a>" +
    "</nav>";

  UI.observeReveals(root);
})();
