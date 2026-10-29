/* ==========================================================================
   PROJECT — ficha individual: proyecto.html?id=01 (contenido en js/data.js)
   Orden: cabecera con datos → imagen principal → contexto → imágenes →
   proceso → créditos → anterior / siguiente.
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
    document.title = "Proyecto no encontrado — " + (SITE.name || "");
    root.innerHTML =
      '<div class="wrap page-head"><p class="mono muted">Error 404</p>' +
      '<h1 class="title" style="margin-top:.5rem">Proyecto no encontrado</h1>' +
      '<p style="margin-top:1.25rem"><a class="link" href="proyectos.html">← Volver a Proyectos</a></p></div>';
    return;
  }

  var p = PROJECTS[idx];
  var prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  var next = PROJECTS[(idx + 1) % PROJECTS.length];

  document.title = p.title + " — " + (SITE.name || "");
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", p.summary);

  var gal = p.gallery || [];
  var hero = gal.length ? gal[0] : null;
  var rest = gal.slice(1);

  function figure(g, eager) {
    return '<figure class="fig is-' + esc(g.layout) + '">' +
      imgTag(g.image, { eager: eager, sizes: g.layout === "wide" ? "100vw" : "(min-width: 40rem) 50vw, 100vw" }) +
      (g.caption ? '<figcaption class="mono muted">' + esc(g.caption) + "</figcaption>" : "") + "</figure>";
  }

  var process = (p.process || []).map(function (s, i) {
    return '<li><span class="mono muted">' + String(i + 1).padStart(2, "0") + "</span><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></li>";
  }).join("");

  var credits = (p.credits || []).map(function (c) {
    return "<div><dt class=\"mono\">" + esc(c.role) + "</dt><dd>" + esc(c.name) + "</dd></div>";
  }).join("");

  root.innerHTML =
    '<header class="pj-head wrap page-head">' +
      '<a class="pj-back link mono" href="proyectos.html">← Proyectos</a>' +
      '<h1 class="title">' + esc(p.title) + "</h1>" +
      '<dl class="pj-meta">' +
        '<div><dt class="mono">Año</dt><dd>' + esc(p.year) + "</dd></div>" +
        '<div><dt class="mono">Disciplina</dt><dd>' + p.disciplines.map(esc).join(", ") + "</dd></div>" +
        '<div><dt class="mono">Cliente</dt><dd>' + esc(p.client) + "</dd></div>" +
        '<div><dt class="mono">Rol</dt><dd>' + esc(p.role) + "</dd></div>" +
      "</dl>" +
    "</header>" +

    (hero ? '<section class="wrap" aria-label="Imagen principal">' + figure(hero, true) + "</section>" : "") +

    '<section class="wrap pj-lead grid" aria-label="Contexto">' +
      '<p class="lead">' + esc(p.summary) + "</p>" +
      '<div class="prose"><p>' + esc(p.context) + "</p>" +
        '<p class="mono muted">' + esc(p.categories.map(catLabel).join(" / ")) + "</p></div>" +
    "</section>" +

    (rest.length ? '<section class="wrap pj-gallery grid" aria-label="Imágenes del proyecto">' + rest.map(function (g) { return figure(g, false); }).join("") + "</section>" : "") +

    (process ? '<section class="wrap" aria-labelledby="proceso"><h2 id="proceso" class="mono muted" style="font-weight:400;margin-bottom:.75rem">Proceso</h2>' +
      '<ol class="pj-process">' + process + "</ol></section>" : "") +

    (credits ? '<section class="wrap" aria-labelledby="creditos"><h2 id="creditos" class="mono muted" style="font-weight:400;margin-bottom:.75rem">Créditos</h2>' +
      '<dl class="rows">' + credits + "</dl></section>" : "") +

    '<nav class="wrap" aria-label="Otros proyectos"><div class="pj-pager">' +
      '<a class="pj-pager__prev" href="proyecto.html?id=' + encodeURIComponent(prev.id) + '"><span class="mono muted">← Anterior</span><span>' + esc(prev.title) + "</span></a>" +
      '<a class="pj-pager__next" href="proyecto.html?id=' + encodeURIComponent(next.id) + '"><span class="mono muted">Siguiente →</span><span>' + esc(next.title) + "</span></a>" +
    "</div></nav>";
})();
