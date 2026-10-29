# Portfolio — diseño gráfico y dirección de arte (Valencia)

Web estática en HTML, CSS y JavaScript vanilla. Sin frameworks, sin build, sin servicios de pago.
**Todo el contenido que no es tuyo está marcado como provisional**: textos `[entre corchetes]` e imágenes con la etiqueta «IMAGEN PROVISIONAL».

## Estructura

```
index.html        Inicio: presentación breve, pieza visual destacada y selección
proyectos.html    Retícula con todos los proyectos
proyecto.html     Ficha única (proyecto.html?id=01): contexto, imágenes, proceso y créditos
sobre-mi.html     Biografía, enfoque, disciplinas y experiencia
contacto.html     Frase, correo y enlaces
cocina.html       Experimentos, recetas, fotografía y proyectos culinarios
css/base.css      Variables (colores, fuentes, escala), reset y accesibilidad
css/layout.css    Cabecera, pie y composición de cada página (retícula de 12 columnas)
css/components.css  Proyecto en la retícula, imágenes y etiquetas
css/motion.css    Todo el movimiento (solo si no hay «movimiento reducido»)
js/data.js        ÚNICA fuente de contenido: proyectos, cocina, pieza destacada, correo y enlaces
js/main.js        Utilidades compartidas
js/home.js · projects.js · cocina.js · project.js   Pintan cada página a partir de data.js
img/              Imágenes provisionales (SVG) y favicons
.nojekyll         Evita que GitHub Pages procese el sitio con Jekyll
```

## Probarlo en local

```bash
python3 -m http.server 8000     # dentro de esta carpeta
# abre http://localhost:8000
```

También se puede abrir `index.html` con doble clic, aunque la ficha de proyecto y el fundido entre páginas funcionan mejor con servidor.

## Publicarlo en GitHub Pages

1. Sube el **contenido** de esta carpeta a la raíz del repositorio (`index.html` debe quedar en la raíz).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Todas las rutas son relativas, así que funciona tanto en `usuario.github.io` como en `usuario.github.io/repositorio/`.

## Sustituir el contenido provisional

| Qué | Dónde |
|---|---|
| Nombre | `<a class="brand">` y pie de cada `.html` (busca «Nombre Apellido») y `SITE.name` en `data.js` |
| Correo y enlaces | `SITE` en `js/data.js` (el correo del HTML se actualiza solo) y la lista de `contacto.html`. Los enlaces actuales apuntan a la portada de cada red |
| Proyectos | `PROJECTS` en `js/data.js`: copia un objeto y cambia `id`, textos e imágenes. `featured: true` lo lleva a la portada (se muestran los tres primeros) |
| Categorías | `CATEGORIES` en `js/data.js` |
| Cocina | `KITCHEN` en `js/data.js` |
| Biografía y experiencia | `sobre-mi.html` |
| Colores y tipografías | variables al inicio de `css/base.css` |

La cabecera y el pie están repetidos en cada `.html` (así la navegación funciona sin JavaScript): si cambias el menú, cámbialo en las seis páginas.

## Pieza visual destacada de la portada

Por defecto hace un fundido lento entre imágenes de proyectos (`FEATURED.slides`), con botón de pausa, y se detiene con movimiento reducido.
Para usar **un vídeo corto en bucle sin sonido** (recomendado), prepáralo y rellena `FEATURED.video` en `js/data.js`:

```bash
# MP4 (H.264), 1600×900, sin audio, ~6–10 s, 24 fps
ffmpeg -i entrada.mov -vf "scale=1600:-2" -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart video/portada.mp4
# WebM opcional, más ligero
ffmpeg -i entrada.mov -vf "scale=1600:-2" -an -c:v libvpx-vp9 -crf 36 -b:v 0 video/portada.webm
```

```js
video: { mp4: "video/portada.mp4", webm: "video/portada.webm", poster: "img/portada-poster.webp", w: 1600, h: 900, caption: "Selección de proyectos" }
```

- Crea la carpeta `video/` y apunta como objetivo a menos de 3 MB.
- Con movimiento reducido solo se muestra el póster.
- Un GIF pesa de 5 a 10 veces más que el mismo vídeo: solo merece la pena si lo necesitas por compatibilidad.

## Imágenes reales

- Exporta en **WebP** (o AVIF), calidad ≈ 75–80, a 800, 1280 y 1920 px de ancho, sin metadatos.
- Indica siempre `w` y `h` reales (evita saltos de maquetación) y un `alt` descriptivo.
- Para varios tamaños añade `srcset` al objeto de la imagen: `srcset: "img/p01-800.webp 800w, img/p01-1600.webp 1600w"`.
- Todas las imágenes salvo la primera de cada página se cargan de forma diferida.

## Tipografía

- **Sans:** Helvetica Neue / Helvetica → Inter → Arial → `system-ui`.
- **Serif editorial:** Newsreader, cargada desde Google Fonts sin bloquear la página. Si no carga, se usa Iowan Old Style / Palatino / Georgia.
- **Monoespaciada:** la del sistema.

**Privacidad:** cargar Google Fonts hace que el navegador de cada visitante contacte con servidores de Google. Si prefieres evitarlo (en la UE es una decisión habitual):
1. Descarga Newsreader (variable, `.woff2`) desde Google Fonts o Fontsource y ponla en una carpeta `fonts/`.
2. Añade en `css/base.css` un `@font-face { font-family: "Newsreader"; src: url("../fonts/Newsreader.woff2") format("woff2"); font-display: swap; }`.
3. Borra los tres `<link>` de Google Fonts del `<head>` de cada página.

## Colores

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--bg` | `#E1E1E1` | fondo | — |
| `--ink` | `#292929` | texto | 11,1:1 sobre `--bg` |
| `--muted` | `#595959` | metadatos | 5,4:1 sobre `--bg` |
| `--accent` | `#F04428` | puntos, subrayados y estados | 2,9:1 sobre `--bg` |

El acento **nunca se usa como color de texto** (no alcanza 4,5:1): solo como punto indicador (menú, hover de proyecto), subrayado al pasar el cursor y un detalle en algunas imágenes.

## Favicon

`img/favicon.svg` (punto con centro definido y halo suave, fondo transparente). Para 16 y 32 px se usan `favicon-16.png` y `favicon-32.png`, generados con una versión simplificada (núcleo mayor y halo más corto) porque el desenfoque fino se pierde al reducir. `apple-touch-icon.png` lleva el gris de la web de fondo, porque iOS no admite transparencia.

## Accesibilidad y rendimiento

- Enlace «Saltar al contenido», foco visible, menú idéntico en todas las páginas y `aria-current` en la página activa.
- `prefers-reduced-motion`: se desactivan el fundido entre páginas, la rotación de la pieza destacada y el vídeo en bucle.
- La rotación tiene botón de pausa y se detiene si la pestaña no está visible.
- Sin cursor personalizado, sin librerías y sin fuentes obligatorias: la web es legible aunque Google Fonts no cargue.
- Transiciones entre páginas con View Transitions (fundido de 0,2 s); donde no hay soporte, la navegación es la normal.

## Filtros

La página Proyectos no lleva filtros: con pocos proyectos y categorías que se solapan, no mejoran la navegación. Si el archivo supera la docena, se pueden añadir en `js/projects.js`.
