# Barranco Amarillo — sistema de diseño

**Proyecto:** Barranco Amarillo · web de marca (V6)
**Categoría:** productora audiovisual / entertainment company
**Actualizado:** 23 de septiembre de 2026

Este archivo describe el sistema que **está implementado** en
`assets/css/base.css`. Si algo aquí no coincide con ese archivo, manda el
CSS y hay que corregir este documento.

> La versión anterior de este archivo describía una paleta rosa `#EC4899`,
> Playfair Display y una categoría «E-commerce Luxury». Nada de eso llegó a
> existir en la web. Queda sustituido por lo de abajo.

---

## 1. Color

Un solo acento. El amarillo es la marca; todo lo demás es neutro.

| Rol | Token | Hex |
|---|---|---|
| Acento | `--amarillo` / `--acento-proyector` | `#F1C741` (Pantone 123C) |
| Superficie elevada | `--negro` / `--superficie-elevada` | `#1E1B1A` (Pantone Neutral Black C) |
| Superficie base | `--negro-profundo` / `--superficie-base` | `#121010` |
| Micro-acento | `--naranja` | `#E56425` (Pantone 165C) |
| Tinta alta | `--tinta-alta` | `#F7F5F2` |
| Tinta media | `--tinta-media` | `rgba(247,245,242,0.6)` |
| Hairline | `--linea-hairline` | `rgba(247,245,242,0.08)` |

**Reglas de uso**

- Fondo negro en toda la web.
- **Una sola inversión a amarillo sólido en todo el sitio**: el bloque de
  cifras de `/studio/`. Si se repite, deja de significar nada.
- El naranja es un micro-acento. Hoy solo se usa en los mensajes de error de
  formulario.
- Nunca hex sueltos en los componentes: siempre el token semántico.

## 2. Tipografía

**Una sola familia de texto: Archivo.** La jerarquía la construye el eje de
anchura variable (`font-stretch`), no el cambio de familia: los titulares se
ensanchan como un rótulo de crédito y el cuerpo vuelve a anchura normal.

| Token | Familia |
|---|---|
| `--tipo` | `'Archivo', system-ui, -apple-system, sans-serif` |
| `--tipo-mono` | `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace` |

Google Fonts:
`Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900` + `JetBrains Mono:wght@400;500;700`

**Escala**

| Uso | Clase | Tamaño |
|---|---|---|
| Titular de hero | `.titular-hero` | `clamp(32px, 5vw, 64px)`, peso 600, `font-stretch:110%` |
| Declaración de posicionamiento | `.declaracion` | `clamp(28px, 4vw, 48px)`, peso 400 |
| Caption del reproductor | `.reproductor-caption` | `clamp(18px, 2vw, 28px)`, peso 500 |
| Cuerpo | `body` | 17px / 1.6, peso 350 |
| Nav, etiquetas, captions de parrilla | mono | 12px, `letter-spacing:0.12em`, mayúsculas |

El mono es para epígrafes, etiquetas y datos técnicos. Todo el discurso va en
Archivo.

## 3. Movimiento

**Nivel 3 sobre 5.** Entre Somesuch (2) e Iconoclast (3).

| Elemento | Especificación |
|---|---|
| Revelado de frases | Máscara por palabras, 45 ms de retardo por palabra, 600 ms, `--ease-cine` |
| Entrada al scroll | Fundido + 12 px de subida, 400 ms |
| Hover en pieza | Sube el brillo del vídeo y el contraste del caption. Sin escalado. |
| Hover en nav | Cambio de color y nada más |
| Transición entre páginas | Ninguna. Carga normal. |
| Scroll | **Nativo.** Sin lerp, sin suavizado por JS, sin secuestro en ninguna página. |
| Cursor | Cursor del sistema |
| Loader | Anillos concéntricos en WebGL y el símbolo dibujándose trazo a trazo, 2.750 ms, una vez por sesión |

`--ease-cine: cubic-bezier(0.16, 1, 0.3, 1)`

**`prefers-reduced-motion: reduce` desactiva todo lo anterior.** No es
opcional: la media query está al final de `base.css` y quita loader,
revelados y entradas.

## 4. Otros tokens

| Token | Valor | Qué es |
|---|---|---|
| `--nav-h` | `56px` | Altura del nav |
| `--contenedor` | `1440px` | Ancho máximo de `.contenedor` |

## 5. Arquitectura

- HTML estático. Sin framework, sin build step, sin `package.json`.
- `build.sh` copia a `dist/`; Vercel está en framework «Other», output `dist`.
- Una sola hoja de estilo compartida: `assets/css/base.css`.
- JS en cuatro archivos: `loader.js` (el loader entero, cargado desde el
  `<head>` porque tiene que existir antes del primer pintado), `base.js`
  (nav, revelados, favicon), `piezas.js` (reproductor, parrilla, lightbox)
  y `form.js` (formularios).
- El símbolo vectorizado vive en `assets/ba-simbolo.svg`; su `d` está
  embebido en `loader.js` y en ningún otro sitio.
- **`data/work.json` es la única fuente de piezas.** Ninguna página lleva
  obra escrita a mano en el HTML. Ver `data/README.md`.
- Cada página se lee y se navega sin JS. El JS solo añade movimiento y el
  reproductor.

## 6. Submarcas

El logotipo de la esquina superior izquierda cambia según la sección: el
sufijo es un `<span class="lockup-sufijo">` con peso más ligero y el mismo
tamaño. No es un archivo de imagen distinto por sección.

| Ruta | Lockup |
|---|---|
| `/`, `/work/`, `/studio/`, `/contact/`, `/directors/` | Barranco Amarillo |
| `/films/` | Barranco Amarillo **Films** |
| `/music/` | Barranco Amarillo **Music** |
| `/ads/` | Barranco Amarillo **Ads** |
| `/real-estate/` | Barranco Amarillo **Real Estate** |

## 7. Idioma

Web de marca en inglés (`<html lang="en">`). Única excepción:
`/real-estate/`, en castellano, porque vende en Terrassa.

## 8. Accesibilidad

- Contraste AA como mínimo. En `/contact/`, donde el fondo se aclara con el
  scroll, el texto conmuta de golpe en el punto medio en lugar de cruzar en
  degradado: si cruzaran a la vez, en la mitad serían el mismo gris.
- Foco visible en amarillo, 2 px, `outline-offset: 3px`.
- Todo navegable con teclado, incluidos el paginador del reproductor y el
  lightbox (que además atrapa el foco mientras está abierto).
