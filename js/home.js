/* ==========================================================================
   HOME — pieza visual destacada (vídeo en bucle o secuencia de imágenes)
   y selección reducida de proyectos.
   ========================================================================== */
(function () {
  "use strict";

  var UI = window.UI, PROJECTS = window.PROJECTS, FEATURED = window.FEATURED;
  if (!UI || !PROJECTS) return;
  var esc = UI.esc, imgTag = UI.imgTag;
  var byId = function (id) { return document.getElementById(id); };

  /* ---------- Pieza visual destacada ---------- */
  function initStage() {
    var frame = byId("stage"), caption = byId("stage-caption"), toggle = byId("stage-toggle");
    if (!frame || !FEATURED) return;

    if (FEATURED.video) { stageVideo(frame, caption, toggle); }
    else if (FEATURED.slides && FEATURED.slides.length) { stageSlides(frame, caption, toggle); }
  }

  /* Vídeo corto en bucle, sin sonido. Con movimiento reducido solo se muestra el póster. */
  function stageVideo(frame, caption, toggle) {
    var v = FEATURED.video;
    frame.innerHTML =
      '<video class="stage__media" muted loop playsinline preload="metadata" poster="' + esc(v.poster) + '" ' +
      'width="' + (v.w || 1600) + '" height="' + (v.h || 900) + '" aria-label="' + esc(v.caption || "Selección de proyectos") + '">' +
      (v.webm ? '<source src="' + esc(v.webm) + '" type="video/webm">' : "") +
      (v.mp4 ? '<source src="' + esc(v.mp4) + '" type="video/mp4">' : "") + "</video>";
    var video = frame.querySelector("video");
    video.muted = true;
    if (caption) caption.textContent = v.caption || "Selección de proyectos";

    function setLabel() { if (toggle) toggle.textContent = video.paused ? "Reproducir" : "Pausar"; }
    function play() { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    if (UI.motionOk()) play();
    video.addEventListener("play", setLabel);
    video.addEventListener("pause", setLabel);
    setLabel();
    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", function () { if (video.paused) play(); else video.pause(); });
    }
    UI.onMotionChange(function () { if (!UI.motionOk()) video.pause(); });
  }

  /* Fundido lento entre imágenes de proyectos (alternativa mientras no haya vídeo) */
  function stageSlides(frame, caption, toggle) {
    var slides = FEATURED.slides;
    frame.innerHTML = slides.map(function (s, i) {
      return '<a class="stage__slide' + (i === 0 ? " is-active" : "") + '" href="proyecto.html?id=' + encodeURIComponent(s.project) + '"' +
        (i === 0 ? "" : ' aria-hidden="true" tabindex="-1"') + ">" +
        imgTag(s, { sizes: "100vw", eager: i === 0, alt: i === 0 ? s.alt : "" }) + "</a>";
    }).join("");
    var els = Array.prototype.slice.call(frame.querySelectorAll(".stage__slide"));
    var current = 0, timer = null, userPaused = false;

    function label(i) {
      var p = PROJECTS.filter(function (x) { return x.id === slides[i].project; })[0];
      return p ? p.id + " — " + p.title : "";
    }
    function show(i) {
      els[current].classList.remove("is-active");
      els[current].setAttribute("aria-hidden", "true");
      els[current].tabIndex = -1;
      current = (i + els.length) % els.length;
      els[current].classList.add("is-active");
      els[current].removeAttribute("aria-hidden");
      els[current].removeAttribute("tabindex");
      if (caption) caption.textContent = label(current);
    }
    function start() { stop(); if (els.length > 1) timer = setInterval(function () { show(current + 1); }, FEATURED.interval || 5000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function sync() {
      var running = UI.motionOk() && !userPaused && !document.hidden;
      if (running) start(); else stop();
      if (toggle) {
        toggle.hidden = !UI.motionOk() || els.length < 2;
        toggle.textContent = userPaused ? "Reproducir" : "Pausar";
      }
    }
    if (caption) caption.textContent = label(0);
    if (toggle) toggle.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    document.addEventListener("visibilitychange", sync);
    UI.onMotionChange(sync);
    sync();
  }

  /* ---------- Selección reducida ---------- */
  function renderSelection() {
    var grid = byId("selection");
    if (!grid) return;
    var chosen = PROJECTS.filter(function (p) { return p.featured; }).slice(0, 3);
    grid.innerHTML = chosen.map(function (p) { return UI.workCard(p, "(min-width: 64rem) 40vw, (min-width: 40rem) 50vw, 100vw"); }).join("");
  }

  initStage();
  renderSelection();
})();
