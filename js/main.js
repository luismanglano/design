/* ==========================================================================
   MAIN — utilidades compartidas y efectos globales.
   Cada efecto se inicializa por separado con safe(): si uno falla, el resto sigue.
   Todos los efectos de movimiento respetan prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var motionOk = function () { return !reduceMotion.matches; };
  var pointerFx = function () { return motionOk() && finePointer.matches; };

  /* ---------- Utilidades compartidas (window.UI) ---------- */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function catLabel(id) {
    var found = (window.CATEGORIES || []).filter(function (c) { return c.id === id; })[0];
    return found ? found.label : id;
  }
  /* <img> con width/height (sin saltos de layout), carga diferida y srcset opcional */
  function imgTag(image, opts) {
    opts = opts || {};
    var attrs = 'src="' + esc(image.src) + '" width="' + image.w + '" height="' + image.h +
      '" alt="' + esc(image.alt || "") + '" decoding="async"';
    if (image.srcset) attrs += ' srcset="' + esc(image.srcset) + '" sizes="' + esc(opts.sizes || "100vw") + '"';
    attrs += opts.eager ? ' fetchpriority="high"' : ' loading="lazy"';
    if (opts.cls) attrs += ' class="' + esc(opts.cls) + '"';
    return "<img " + attrs + ">";
  }

  /* ---------- Revelado al hacer scroll ---------- */
  var revealer = null;
  if ("IntersectionObserver" in window) {
    revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  }
  function observeReveals(root) {
    (root || doc).querySelectorAll(".reveal:not(.is-in), .reveal-mask:not(.is-in)").forEach(function (el) {
      if (revealer) revealer.observe(el); else el.classList.add("is-in");
    });
  }

  /* ---------- Cursor con inercia ---------- */
  function initCursor() {
    var el = doc.createElement("div");
    el.className = "cursor";
    el.setAttribute("aria-hidden", "true");
    var label = doc.createElement("span");
    label.className = "cursor__label";
    el.appendChild(label);
    doc.body.appendChild(el);

    var x = 0, y = 0, cx = 0, cy = 0, raf = 0, visible = false;
    function loop() {
      cx += (x - cx) * 0.24;
      cy += (y - cy) * 0.24;
      el.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      raf = (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) ? requestAnimationFrame(loop) : 0;
    }
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || !pointerFx()) return;
      x = e.clientX; y = e.clientY;
      if (!visible) { visible = true; cx = x; cy = y; el.classList.add("is-on"); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    doc.documentElement.addEventListener("mouseleave", function () {
      visible = false;
      el.classList.remove("is-on");
    });
    doc.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse" || !e.target.closest) return;
      var big = e.target.closest("[data-cursor]");
      var link = e.target.closest("a, button");
      el.classList.toggle("is-big", !!big);
      el.classList.toggle("is-link", !big && !!link);
      label.textContent = big ? big.getAttribute("data-cursor") : "";
    });
  }

  /* ---------- Texto «descifrado» en enlaces del menú ---------- */
  function initScramble() {
    var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+_";
    doc.querySelectorAll("[data-scramble]").forEach(function (el) {
      var original = el.textContent.trim();
      var raf = 0;
      el.setAttribute("aria-label", original); // evita que un lector lea los caracteres intermedios
      function run() {
        if (!motionOk()) return;
        cancelAnimationFrame(raf);
        var start = performance.now(), duration = 380;
        (function tick(now) {
          var p = Math.min(1, (now - start) / duration);
          var fixed = Math.floor(original.length * p);
          el.textContent = original.split("").map(function (c, i) {
            return (c === " " || i < fixed) ? c : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
          }).join("");
          if (p < 1) raf = requestAnimationFrame(tick); else el.textContent = original;
        })(start);
      }
      el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") run(); });
      el.addEventListener("focus", run);
    });
  }

  /* ---------- Ola tipográfica en el nombre de la portada ---------- */
  function initWave() {
    var root = doc.querySelector("[data-wave]");
    if (!root) return;

    // Divide en letras: el texto accesible se conserva en un .sr-only y las letras son aria-hidden
    root.querySelectorAll("[data-split]").forEach(function (line) {
      var text = line.textContent.trim();
      line.textContent = "";
      var sr = doc.createElement("span");
      sr.className = "sr-only";
      sr.textContent = text;
      var vis = doc.createElement("span");
      vis.setAttribute("aria-hidden", "true");
      text.split("").forEach(function (ch) {
        if (ch === " ") { vis.appendChild(doc.createTextNode(" ")); return; }
        var s = doc.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        vis.appendChild(s);
      });
      line.appendChild(sr);
      line.appendChild(vis);
    });

    var letters = Array.prototype.map.call(root.querySelectorAll(".ch"), function (el) {
      return { el: el, cx: 0, cy: 0, x: 0, y: 0 };
    });
    var mx = null, my = null, raf = 0, RADIUS = 280;

    function measure() {
      letters.forEach(function (l) {
        var prev = l.el.style.transform;
        l.el.style.transform = "none";
        var r = l.el.getBoundingClientRect();
        l.cx = r.left + r.width / 2 + window.scrollX;
        l.cy = r.top + r.height / 2 + window.scrollY;
        l.el.style.transform = prev;
      });
    }
    function tick() {
      raf = 0;
      var busy = false;
      letters.forEach(function (l) {
        var ty = 0, tx = 0;
        if (mx !== null) {
          var dx = l.cx - window.scrollX - mx, dy = l.cy - window.scrollY - my;
          var d = Math.sqrt(dx * dx + dy * dy);
          var f = Math.max(0, 1 - d / RADIUS);
          ty = -(f * f) * 0.16;
          tx = (dx / (d || 1)) * f * f * 0.04;
        }
        l.x += (tx - l.x) * 0.16;
        l.y += (ty - l.y) * 0.16;
        if (Math.abs(tx - l.x) > 0.0005 || Math.abs(ty - l.y) > 0.0005) busy = true;
        l.el.style.transform = "translate3d(" + l.x + "em," + l.y + "em,0)";
      });
      if (busy) raf = requestAnimationFrame(tick);
    }
    root.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || !pointerFx()) return;
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    root.addEventListener("pointerleave", function () {
      mx = null;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    });
    measure();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);
    window.addEventListener("load", measure);
  }

  /* ---------- Enlace de menú activo según la sección visible ---------- */
  function initNavSpy() {
    var links = Array.prototype.slice.call(doc.querySelectorAll('.nav a[href^="#"]'));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = [];
    links.forEach(function (a) {
      var section = doc.querySelector(a.getAttribute("href"));
      if (section) map.push({ section: section, link: a });
    });
    var inBand = [];
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = inBand.indexOf(entry.target);
        if (entry.isIntersecting && i === -1) inBand.push(entry.target);
        if (!entry.isIntersecting && i !== -1) inBand.splice(i, 1);
      });
      links.forEach(function (l) { l.removeAttribute("aria-current"); });
      map.forEach(function (m) {
        if (inBand.indexOf(m.section) !== -1) m.link.setAttribute("aria-current", "location");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach(function (m) { spy.observe(m.section); });
  }

  function initYear() {
    doc.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function safe(fn) {
    try { fn(); } catch (err) { if (window.console) console.error(err); }
  }

  window.UI = {
    esc: esc, pad: pad, catLabel: catLabel, imgTag: imgTag,
    observeReveals: observeReveals, motionOk: motionOk, pointerFx: pointerFx
  };

  safe(function () { observeReveals(doc); });
  safe(initCursor);
  safe(initScramble);
  safe(initWave);
  safe(initNavSpy);
  safe(initYear);
})();
