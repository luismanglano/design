/* ==========================================================================
   DATA — única fuente de contenido de la parte dinámica del sitio
   (selección, proyectos, ficha de proyecto, pieza destacada, cocina).

   Todo lo que ves aquí es PROVISIONAL y está marcado con [corchetes] o con
   el texto «IMAGEN PROVISIONAL». Sustitúyelo por tu contenido real.
   Los datos reales que ya existían (ciudad, disciplinas) se han conservado.

   · Nuevo proyecto: copia un objeto de PROJECTS y cambia su `id`.
   · Imágenes: indica `w` y `h` reales (evita saltos de maquetación) y un `alt`.
   · Imágenes responsive opcionales: `srcset: "img/a-800.webp 800w, img/a-1600.webp 1600w"`.
   ========================================================================== */

window.SITE = {
  name: "Nombre Apellido",           // [provisional]
  city: "Valencia",
  email: "correo@ejemplo.com",       // [provisional]
  // Enlaces profesionales: ahora apuntan a la portada de cada red. Sustitúyelos por tus perfiles.
  links: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Behance",   href: "https://www.behance.net/" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/" }
  ]
};

window.CATEGORIES = [
  { id: "identidad",    label: "Identidad visual" },
  { id: "editorial",    label: "Diseño editorial" },
  { id: "cultural",     label: "Proyectos culturales" },
  { id: "musica",       label: "Música" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "exploracion",  label: "Exploración visual" }
];

/* Pieza visual destacada de la portada.
   OPCIÓN A (preferible): un vídeo corto en bucle, sin sonido, que alterne proyectos.
     Rellena `video` y se usará en lugar de la secuencia de imágenes:
       video: { mp4: "video/portada.mp4", webm: "video/portada.webm", poster: "img/feat-1.svg", w: 1600, h: 900,
                caption: "Selección de proyectos" }
   OPCIÓN B (por defecto): fundido lento entre imágenes de proyectos (`slides`). */
window.FEATURED = {
  video: null,
  interval: 5000,
  slides: [
    { project: "01", src: "img/feat-1.svg", w: 1600, h: 900, alt: "Imagen provisional destacada 1" },
    { project: "03", src: "img/feat-2.svg", w: 1600, h: 900, alt: "Imagen provisional destacada 2" },
    { project: "05", src: "img/feat-3.svg", w: 1600, h: 900, alt: "Imagen provisional destacada 3" }
  ]
};

(function () {
  "use strict";

  function img(src, w, h, alt) { return { src: src, w: w, h: h, alt: alt }; }

  var CONTEXT = "[Texto provisional de contexto: quién lo encargó, qué necesidad había y cuál fue tu papel.]";
  var LEAD = "[Frase provisional que resume el proyecto en una línea.]";
  var PROCESS = [
    { title: "Contexto",      text: "[Texto provisional. Punto de partida: el encargo, las referencias y las preguntas iniciales.]" },
    { title: "Investigación", text: "[Texto provisional. Qué exploraste: archivo, pruebas tipográficas, referencias visuales.]" },
    { title: "Sistema",       text: "[Texto provisional. Decisiones de diseño: retícula, tipografía, color, materiales y entrega.]" }
  ];
  function credits(role) {
    return [
      { role: "Dirección de arte", name: "[Nombre]" },
      { role: role,                name: "[Nombre]" },
      { role: "Fotografía",        name: "[Nombre o estudio]" },
      { role: "Cliente",           name: "[Cliente]" }
    ];
  }
  function gallery(n) {
    var p = "img/p0" + n + "-";
    return [
      { layout: "wide",   caption: "Fig. 1 — [Pie de foto provisional]", image: img(p + "1.svg", 1600, 1000, "Imagen provisional 1 del proyecto 0" + n) },
      { layout: "tall",   caption: "Fig. 2 — [Pie de foto provisional]", image: img(p + "2.svg", 1000, 1250, "Imagen provisional 2 del proyecto 0" + n) },
      { layout: "square", caption: "Fig. 3 — [Pie de foto provisional]", image: img(p + "3.svg", 1200, 1200, "Imagen provisional 3 del proyecto 0" + n) }
    ];
  }
  function project(n, cats, discs, cover, featured) {
    var id = "0" + n;
    return {
      id: id, featured: featured,
      title: "[Título del proyecto " + id + "]", year: "[Año]",
      categories: cats, client: "[Cliente]", role: "[Tu rol]", disciplines: discs,
      summary: LEAD, context: CONTEXT,
      cover: cover, gallery: gallery(n), process: PROCESS, credits: credits("Diseño gráfico")
    };
  }

  window.PROJECTS = [
    project(1, ["identidad"],              ["Identidad visual", "Sistema tipográfico"],    img("img/p01-cover.svg", 1200, 1500, "Imagen provisional de portada del proyecto 01"), true),
    project(2, ["editorial"],              ["Maquetación", "Diseño de cubierta"],          img("img/p02-cover.svg", 1500, 1000, "Imagen provisional de portada del proyecto 02"), false),
    project(3, ["cultural", "identidad"],  ["Identidad visual", "Cartelería"],             img("img/p03-cover.svg", 1200, 1200, "Imagen provisional de portada del proyecto 03"), true),
    project(4, ["musica", "editorial"],    ["Diseño de portada", "Material gráfico"],      img("img/p04-cover.svg", 1000, 1250, "Imagen provisional de portada del proyecto 04"), false),
    project(5, ["arquitectura"],           ["Señalética", "Dossier"],                      img("img/p05-cover.svg", 1500, 1000, "Imagen provisional de portada del proyecto 05"), true),
    project(6, ["exploracion"],            ["Exploración visual", "Dirección de arte"],    img("img/p06-cover.svg", 1200, 1200, "Imagen provisional de portada del proyecto 06"), false)
  ];

  /* Cocina: cada entrada es una práctica distinta (experimento, receta, fotografía, proyecto). */
  window.KITCHEN = [
    { code: "C01", type: "Experimento", title: "[Título provisional]", image: img("img/c01.svg", 1500, 1000, "Textura provisional C01") },
    { code: "C02", type: "Receta",      title: "[Título provisional]", image: img("img/c02.svg", 1000, 1250, "Textura provisional C02") },
    { code: "C03", type: "Fotografía",  title: "[Título provisional]", image: img("img/c03.svg", 1200, 1200, "Textura provisional C03") },
    { code: "C04", type: "Proyecto",    title: "[Título provisional]", image: img("img/c04.svg", 1000, 1250, "Textura provisional C04") },
    { code: "C05", type: "Experimento", title: "[Título provisional]", image: img("img/c05.svg", 1500, 1000, "Textura provisional C05") },
    { code: "C06", type: "Receta",      title: "[Título provisional]", image: img("img/c06.svg", 1200, 1200, "Textura provisional C06") }
  ];
})();
