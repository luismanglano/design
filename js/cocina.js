/* ==========================================================================
   COCINA — mosaico de imágenes de la página Cocina (datos en js/data.js, KITCHEN).
   ========================================================================== */
(function () {
  "use strict";
  var UI = window.UI, KITCHEN = window.KITCHEN;
  var grid = document.getElementById("kitchen");
  if (!UI || !KITCHEN || !grid) return;
  var esc = UI.esc;
  grid.innerHTML = KITCHEN.map(function (k) {
    return '<figure class="tile">' + UI.imgTag(k.image, { sizes: "(min-width: 64rem) 55vw, (min-width: 40rem) 50vw, 100vw" }) +
      '<figcaption><span class="mono">' + esc(k.code) + " — " + esc(k.type) + "</span>" +
      '<span class="mono muted">' + esc(k.title) + "</span></figcaption></figure>";
  }).join("");
})();
