/* ==========================================================================
   HOME — genera la selección, el archivo con filtros y las exploraciones
   a partir de js/data.js, y gestiona la vista previa flotante.
   ========================================================================== */
(function () {
  "use strict";

  var UI = window.UI, PROJECTS = window.PROJECTS, CATEGORIES = window.CATEGORIES, EXPLORATIONS = window.EXPLORATIONS;
  if (!UI || !PROJECTS) return;
  var esc = UI.esc, pad = UI.pad, catLabel = UI.catLabel, imgTag = UI.imgTag;

  var byId = function (id) { return document.getElementById(id); };
  var provisional = function (p) { return p.provisional ? " · provisional" : ""; };

  /* ---------- Selección de proyectos ---------- */
  function renderSelection() {
    var grid = byId("selection-grid");
    if (!grid) return;
    var featured = PROJECTS.filter(function (p) { return p.featured; }).slice(0, 3);
    grid.innerHTML = featured.map(function (p, i) {
      return '<article class="card reveal" style="--d:' + (i * 0.08) + 's">' +
        '<a class="card__link" href="proyecto.html?id=' + p.id + '" data-cursor="Ver">' +
          '<figure class="card__fig"><span class="card__num" aria-hidden="true">' + p.id + "</span>" +
            imgTag(p.cover, { sizes: "(min-width: 48rem) 50vw, 90vw" }) + "</figure>" +
          '<div class="card__meta"><h3 class="card__title">' + esc(p.title) + "</h3>" +
            '<span class="mono muted">' + esc(catLabel(p.categories[0])) + " · " + esc(p.year) + provisional(p) + "</span></div>" +
        "</a></article>";
    }).join("") +
      '<aside class="card card--more reveal" style="--d:.24s">' +
        '<a class="more" href="#archivo" data-cursor="Ir">' +
          '<span class="mono">Archivo completo</span>' +
          '<span class="more__n" aria-hidden="true">' + pad(PROJECTS.length) + "</span>" +
          '<span class="mono">Ver los ' + PROJECTS.length + " proyectos →</span>" +
        "</a></aside>";
    UI.observeReveals(grid);
  }

  /* ---------- Archivo + filtros ---------- */
  function renderArchive() {
    var list = byId("archive-list"), filters = byId("filters");
    if (!list || !filters) return;

    list.innerHTML = PROJECTS.map(function (p) {
      return '<li class="row" data-cat="' + esc(p.categories.join(" ")) + '" data-img="' + esc(p.cover.src) + '" ' +
          'data-iw="' + p.cover.w + '" data-ih="' + p.cover.h + '">' +
        '<a class="row__link" href="proyecto.html?id=' + p.id + '" data-cursor="Ver">' +
          '<span class="row__num mono">' + p.id + "</span>" +
          '<span class="row__title">' + esc(p.title) + "</span>" +
          '<span class="row__cat mono">' + esc(p.categories.map(catLabel).join(" / ")) + provisional(p) + "</span>" +
          '<span class="row__year mono">' + esc(p.year) + "</span>" +
          '<img class="row__thumb" src="' + esc(p.cover.src) + '" width="' + p.cover.w + '" height="' + p.cover.h +
            '" alt="" loading="lazy" decoding="async">' +
        "</a></li>";
    }).join("");

    var counts = {};
    PROJECTS.forEach(function (p) { p.categories.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; }); });
    var chips = [{ id: "todos", label: "Todos", n: PROJECTS.length }].concat(
      CATEGORIES.filter(function (c) { return counts[c.id]; }).map(function (c) { return { id: c.id, label: c.label, n: counts[c.id] }; })
    );
    filters.innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-filter="' + c.id + '" aria-pressed="false">' +
        esc(c.label) + ' <span class="chip__n">(' + pad(c.n) + ")</span></button>";
    }).join("");

    var rows = Array.prototype.slice.call(list.children);
    var buttons = Array.prototype.slice.call(filters.querySelectorAll(".chip"));
    var status = byId("filter-status"), counter = byId("archive-count");

    function apply(key, fromUser) {
      if (!chips.some(function (c) { return c.id === key; })) key = "todos";
      var shown = 0;
      rows.forEach(function (row) {
        var match = key === "todos" || row.getAttribute("data-cat").split(" ").indexOf(key) !== -1;
        row.hidden = !match;
        row.classList.remove("is-enter");
        if (match) {
          row.style.setProperty("--d", (shown * 0.05) + "s");
          if (fromUser && UI.motionOk()) {
            void row.offsetWidth; // reinicia la animación
            row.classList.add("is-enter");
          }
          shown++;
        }
      });
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === key)); });
      if (counter) counter.textContent = "(" + pad(shown) + ")";
      if (status && fromUser) {
        var label = chips.filter(function (c) { return c.id === key; })[0].label;
        status.textContent = shown + (shown === 1 ? " proyecto" : " proyectos") + " en «" + label + "»";
      }
      try {
        var url = key === "todos" ? location.pathname + location.hash : "?cat=" + key + location.hash;
        history.replaceState(null, "", url);
      } catch (e) { /* p. ej. file:// en algunos navegadores */ }
    }

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (btn) apply(btn.getAttribute("data-filter"), true);
    });

    var initial = "todos";
    try { initial = new URLSearchParams(location.search).get("cat") || "todos"; } catch (e) { /* noop */ }
    apply(initial, false);

    initPeek(list);
  }

  /* ---------- Vista previa flotante al pasar sobre una fila ---------- */
  function initPeek(list) {
    var peek = document.createElement("div");
    peek.className = "peek";
    peek.setAttribute("aria-hidden", "true");
    var image = new Image();
    image.alt = "";
    peek.appendChild(image);
    document.body.appendChild(peek);

    var x = 0, y = 0, cx = 0, cy = 0, raf = 0, active = false;
    function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      var w = peek.offsetWidth, h = peek.offsetHeight;
      var tx = Math.min(cx + 32, window.innerWidth - w - 16);
      var ty = Math.max(8, Math.min(cy - h / 2, window.innerHeight - h - 8));
      peek.style.transform = "translate3d(" + tx + "px," + ty + "px,0) rotate(-2deg)";
      raf = (active && (Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3)) ? requestAnimationFrame(loop) : 0;
    }
    list.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || !UI.pointerFx()) return;
      x = e.clientX; y = e.clientY;
      if (!active) return;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    list.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse" || !UI.pointerFx()) return;
      var row = e.target.closest(".row");
      if (!row) return;
      var src = row.getAttribute("data-img");
      if (image.getAttribute("src") !== src) image.src = src;
      image.width = +row.getAttribute("data-iw");
      image.height = +row.getAttribute("data-ih");
      if (!active) { cx = x = e.clientX; cy = y = e.clientY; }
      active = true;
      peek.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.addEventListener("pointerleave", function () {
      active = false;
      peek.classList.remove("is-on");
    });
  }

  /* ---------- Exploraciones personales ---------- */
  function renderExplorations() {
    var grid = byId("explore-grid");
    if (!grid || !EXPLORATIONS) return;
    grid.innerHTML = EXPLORATIONS.map(function (e, i) {
      return '<figure class="tile tile--' + e.size + ' reveal" style="--d:' + (i * 0.06) + 's">' +
        imgTag(e.image, { sizes: "(min-width: 48rem) 45vw, 90vw" }) +
        '<figcaption><span class="mono">' + esc(e.id) + " — " + esc(e.title) + ' · <span class="muted">provisional</span></span>' +
        "<p>" + esc(e.text) + "</p></figcaption></figure>";
    }).join("");
    UI.observeReveals(grid);
  }

  renderSelection();
  renderArchive();
  renderExplorations();
})();
