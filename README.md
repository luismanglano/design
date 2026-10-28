# Archivo visual abierto — portfolio

Web estática en HTML, CSS y JavaScript vanilla. Sin dependencias, sin build, sin servicios de pago.
**Todo el contenido es provisional** (textos, proyectos, imágenes, nombre, correo y enlaces).

## Estructura

```
index.html            Portada, selección, archivo con filtros, exploraciones, sobre mí y contacto
proyecto.html         Plantilla única de proyecto (se usa como proyecto.html?id=01)
css/base.css          Tokens (colores, fuentes, escala), reset, accesibilidad
css/layout.css        Cabecera, secciones, retícula y composición de cada bloque
css/components.css    Tarjetas, filtros, filas, teselas, cursor, vista previa
css/motion.css        Todas las animaciones (solo si no hay «movimiento reducido»)
js/data.js            ÚNICA fuente de contenido: proyectos, categorías, exploraciones
js/main.js            Utilidades y efectos globales (cursor, ola tipográfica, reveals…)
js/home.js            Genera selección, archivo, filtros y exploraciones
js/project.js         Genera la página de cada proyecto
img/                  Imágenes provisionales (SVG) y favicon
.nojekyll             Evita que GitHub Pages procese el sitio con Jekyll
```

## Ejecutarlo en local

Opción rápida: abre `index.html` con doble clic (los scripts son clásicos, no módulos).

Opción recomendable (se comporta como en GitHub Pages):

```bash
cd portfolio
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicarlo en GitHub Pages

1. Crea una cuenta en github.com.
2. Crea un repositorio **público** llamado `tunombredeusuario.github.io`
   (si usas otro nombre, la web quedará en `tunombredeusuario.github.io/nombre-del-repo/`; las rutas relativas funcionan igual).
3. Sube **el contenido de la carpeta** `portfolio` (no la carpeta en sí): `index.html` debe quedar en la raíz del repositorio.
   Vale con «Add file → Upload files» arrastrando todo.
4. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
5. En 1–2 minutos estará en `https://tunombredeusuario.github.io`.

## Personalizar

- **Nombre, ciudad, correo, redes:** `index.html` y `js/data.js` (busca los textos entre `[corchetes]`).
- **Proyectos:** copia un objeto de `PROJECTS` en `js/data.js`, cambia `id`, textos e imágenes. El archivo, los filtros, la selección y la página del proyecto se actualizan solos.
  `featured: true` lo lleva a la selección de la portada (se muestran los tres primeros).
- **Categorías:** `CATEGORIES` en `js/data.js`.
- **Colores y tipografías:** variables al inicio de `css/base.css`. Si tu nombre es largo, ajusta `--fs-mega`.
- **Fuente propia:** añade un `@font-face` (con el `.woff2` en `fonts/`) y cambia `--font-display`, `--font-serif` o `--font-mono`.

## Imágenes reales

- Exporta en **WebP** (o AVIF) a 800, 1280 y 1920 px de ancho, calidad ≈ 75–80, y sin metadatos.
- Indica siempre `w` y `h` reales (evita saltos de maquetación) y un `alt` descriptivo.
- Para servir varios tamaños, añade `srcset` al objeto de la imagen en `data.js`:
  `srcset: "img/p01-800.webp 800w, img/p01-1280.webp 1280w, img/p01-1920.webp 1920w"`.
- Todas las imágenes salvo la primera de cada página usan `loading="lazy"`.

## Accesibilidad y rendimiento

- Enlace de «Saltar al contenido», foco visible, navegación completa por teclado, filtros con `aria-pressed` y aviso `aria-live`.
- Contraste: el ácido solo se usa como fondo con tinta encima, o sobre tinta.
- `prefers-reduced-motion`: se desactivan cursor, ola, cinta, reveals, vista previa y transiciones.
- Efectos de cursor solo con ratón; en táctil no hay ninguno.
- Sin librerías ni fuentes externas; solo `transform`/`opacity` en animaciones.
- Las transiciones entre páginas usan View Transitions: donde no están soportadas, la navegación es normal.
