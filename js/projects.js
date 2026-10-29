/* ==========================================================================
   PROJECTS — retícula de la página Proyectos.
   Sin filtros a propósito: con pocos proyectos y categorías que se solapan
   no mejoran la navegación. Si el archivo crece (>12), añade filtros aquí.
   ========================================================================== */
(function () {
  "use strict";
  var UI = window.UI, PROJECTS = window.PROJECTS;
  var grid = document.getElementById("works");
  if (!UI || !PROJECTS || !grid) return;
  grid.innerHTML = PROJECTS.map(function (p) { return UI.workCard(p, "(min-width: 64rem) 45vw, (min-width: 40rem) 50vw, 100vw"); }).join("");
})();
