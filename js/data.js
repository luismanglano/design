/* ==========================================================================
   DATA — única fuente de contenido del sitio.
   Todo lo que ves aquí es PROVISIONAL: sustitúyelo por tu contenido real.
   · Para añadir un proyecto: copia un objeto de PROJECTS y cambia su `id`.
   · Las imágenes necesitan `w` y `h` (píxeles reales) para evitar saltos de maquetación.
   · Imágenes responsive opcionales: añade `srcset: "img/a-800.webp 800w, img/a-1600.webp 1600w"`.
   ========================================================================== */

window.SITE = {
  name: "Nombre Apellido",
  title: "Archivo visual abierto",
  email: "correo@ejemplo.com"
};

window.CATEGORIES = [
  { id: "identidad",    label: "Identidad visual" },
  { id: "editorial",    label: "Diseño editorial" },
  { id: "cultural",     label: "Proyectos culturales" },
  { id: "musica",       label: "Música" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "direccion",    label: "Dirección de arte" }
];

(function () {
  "use strict";

  var TXT = {
    summary: "Texto provisional. Describe aquí el encargo, el contexto y el objetivo del proyecto en dos o tres frases.",
    context: "Texto provisional de contexto: quién lo encargó, qué necesidad había, qué restricciones existían y cuál fue tu papel dentro del equipo.",
    process: [
      { title: "Contexto",       text: "Texto provisional. Resume el punto de partida: el briefing, las referencias y las preguntas iniciales." },
      { title: "Investigación",  text: "Texto provisional. Explica qué exploraste: archivo, referencias visuales, pruebas tipográficas, entrevistas." },
      { title: "Sistema",        text: "Texto provisional. Describe las decisiones de diseño: retícula, tipografía, color, materiales y reglas de uso." },
      { title: "Entrega",        text: "Texto provisional. Cuenta cómo se produjo y se implantó: formatos, impresión, soportes y resultados." }
    ]
  };

  function credits(role) {
    return [
      { role: "Dirección de arte", name: "[Nombre]" },
      { role: role,                 name: "[Nombre]" },
      { role: "Fotografía",        name: "[Nombre o estudio]" },
      { role: "Cliente",           name: "[Cliente provisional]" }
    ];
  }

  function img(src, w, h, alt) { return { src: src, w: w, h: h, alt: alt }; }

  function gallery(n, nombre) {
    var p = "img/p0" + n + "-";
    return [
      { layout: "full",  image: img(p + "1.svg", 1600, 900,  "Imagen provisional 1 del " + nombre), caption: "Fig. 1 — Pie de foto provisional" },
      { layout: "left",  image: img(p + "2.svg", 1000, 1250, "Imagen provisional 2 del " + nombre), caption: "Fig. 2 — Pie de foto provisional" },
      { layout: "right", image: img(p + "3.svg", 1000, 1000, "Imagen provisional 3 del " + nombre), caption: "Fig. 3 — Pie de foto provisional" }
    ];
  }

  window.PROJECTS = [
    {
      id: "01", title: "Identidad visual", provisional: true, year: "2026", featured: true,
      categories: ["identidad", "direccion"],
      client: "[Cliente provisional]", role: "[Tu rol]",
      disciplines: ["Identidad visual", "Sistema tipográfico", "Dirección de arte"],
      summary: TXT.summary, context: TXT.context,
      cover: img("img/p01-cover.svg", 800, 1000, "Imagen provisional de portada del proyecto 01"),
      gallery: gallery(1, "proyecto 01"), process: TXT.process, credits: credits("Diseño gráfico")
    },
    {
      id: "02", title: "Diseño editorial", provisional: true, year: "2026", featured: true,
      categories: ["editorial"],
      client: "[Cliente provisional]", role: "[Tu rol]",
      disciplines: ["Maquetación", "Diseño de cubierta", "Tipografía"],
      summary: TXT.summary, context: TXT.context,
      cover: img("img/p02-cover.svg", 900, 1200, "Imagen provisional de portada del proyecto 02"),
      gallery: gallery(2, "proyecto 02"), process: TXT.process, credits: credits("Maquetación")
    },
    {
      id: "03", title: "Proyecto cultural", provisional: true, year: "2025", featured: true,
      categories: ["cultural", "identidad"],
      client: "[Institución provisional]", role: "[Tu rol]",
      disciplines: ["Identidad visual", "Cartelería", "Programa de mano"],
      summary: TXT.summary, context: TXT.context,
      cover: img("img/p03-cover.svg", 1000, 1000, "Imagen provisional de portada del proyecto 03"),
      gallery: gallery(3, "proyecto 03"), process: TXT.process, credits: credits("Diseño gráfico")
    },
    {
      id: "04", title: "Música", provisional: true, year: "2025", featured: false,
      categories: ["musica", "editorial"],
      client: "[Artista o sello provisional]", role: "[Tu rol]",
      disciplines: ["Diseño de portada", "Packaging", "Material gráfico"],
      summary: TXT.summary, context: TXT.context,
      cover: img("img/p04-cover.svg", 1000, 1000, "Imagen provisional de portada del proyecto 04"),
      gallery: gallery(4, "proyecto 04"), process: TXT.process, credits: credits("Diseño gráfico")
    },
    {
      id: "05", title: "Arquitectura", provisional: true, year: "2024", featured: false,
      categories: ["arquitectura", "identidad"],
      client: "[Estudio provisional]", role: "[Tu rol]",
      disciplines: ["Señalética", "Identidad visual", "Dossier"],
      summary: TXT.summary, context: TXT.context,
      cover: img("img/p05-cover.svg", 1200, 800, "Imagen provisional de portada del proyecto 05"),
      gallery: gallery(5, "proyecto 05"), process: TXT.process, credits: credits("Diseño gráfico")
    },
    {
      id: "06", title: "Dirección de arte", provisional: true, year: "2024", featured: false,
      categories: ["direccion", "cultural"],
      client: "[Cliente provisional]", role: "[Tu rol]",
      disciplines: ["Dirección de arte", "Campaña", "Producción de imagen"],
      summary: TXT.summary, context: TXT.context,
      cover: img("img/p06-cover.svg", 800, 1000, "Imagen provisional de portada del proyecto 06"),
      gallery: gallery(6, "proyecto 06"), process: TXT.process, credits: credits("Dirección de arte")
    }
  ];

  window.EXPLORATIONS = [
    { id: "E01", size: "a", title: "Cocina como sistema",
      text: "Texto provisional. Una exploración personal sobre cómo se ordena visualmente una cocina.",
      image: img("img/e01.svg", 1000, 1250, "Imagen provisional de la exploración E01") },
    { id: "E02", size: "b", title: "Inventario de mercado",
      text: "Texto provisional. Catalogar formas, colores y etiquetas encontradas en un mercado.",
      image: img("img/e02.svg", 1200, 800, "Imagen provisional de la exploración E02") },
    { id: "E03", size: "c", title: "Receta como diagrama",
      text: "Texto provisional. Traducir una receta a un diagrama tipográfico.",
      image: img("img/e03.svg", 1000, 1000, "Imagen provisional de la exploración E03") },
    { id: "E04", size: "d", title: "Mesa y tipografía",
      text: "Texto provisional. Cartas, menús y mantelerías como campo de pruebas.",
      image: img("img/e04.svg", 900, 1200, "Imagen provisional de la exploración E04") }
  ];
})();
