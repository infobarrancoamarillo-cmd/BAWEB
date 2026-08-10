# BRIEF — BARRANCO AMARILLO WEB V6

**Fecha:** 8 agosto 2026
**Para:** Claude Code
**De:** Carlos Soto (dirección) + análisis de referencias

---

# 0. REGLAS DE EJECUCIÓN — LEER ANTES DE TOCAR NADA

## 0.1 Sobre qué se trabaja

- **Repo:** `github.com/infobarrancoamarillo-cmd/BAWEB` (ya existe, ya está conectado a Vercel)
- **Base:** la rama `claude/baweb-v5-execution-2dc80e`, que contiene la v5 actualmente desplegada en `baweb-v5.vercel.app`
- **Rama de trabajo:** crear `claude/baweb-v6` **partiendo de** la rama v5
- **Stack:** HTML estático. Sin framework, sin build step, sin dependencias npm.
- **Build:** el `build.sh` existente copia a `dist/`. Vercel está en framework "Other", output `dist`.

## 0.2 Prohibido

- ❌ NO crear proyecto nuevo en Vercel
- ❌ NO crear repo nuevo
- ❌ NO migrar a Next.js, Astro, Vite ni nada con `package.json`
- ❌ NO instalar dependencias
- ❌ NO tocar `main` ni la rama v5
- ❌ NO hacer push ni deploy sin que Carlos lo pida explícitamente
- ❌ NO inventar precios, nombres, datos de contacto ni copy que no esté en este brief
- ❌ NO scroll secuestrado en ninguna parte de la web (ver §11.1)

## 0.3 Obligatorio

- ✅ Reutilizar el sistema de diseño que ya está en el `index.html` de la v5 (§1)
- ✅ Reutilizar los assets de `assets/` que ya existen
- ✅ Extraer el CSS común a un solo `assets/css/base.css` compartido por todas las páginas (hoy está embebido en un `index.html` de 2.682 líneas — eso no escala a 8 páginas)
- ✅ Actualizar `build.sh` para que copie las nuevas carpetas a `dist/`
- ✅ Cada página funciona sin JS para leer contenido y navegar. El JS solo añade animación y el reproductor.

## 0.4 Limpieza pendiente

- Reescribir `design-system/barranco-amarillo/MASTER.md`: hoy dice rosa `#EC4899`, Playfair Display y "E-commerce Luxury". Nada de eso es real. Sustituir por los tokens de §1.

---

# 1. SISTEMA DE DISEÑO (ya existe — reutilizar tal cual)

```css
:root{
  --amarillo:       #F1C741;  /* Pantone 123C — único acento */
  --negro:          #1E1B1A;  /* Pantone Neutral Black C */
  --negro-profundo: #121010;
  --naranja:        #E56425;  /* Pantone 165C — micro-acento, uso mínimo */

  --superficie-base:    var(--negro-profundo);
  --superficie-elevada: var(--negro);
  --acento-proyector:   var(--amarillo);
  --tinta-alta:         #F7F5F2;
  --tinta-media:        rgba(247,245,242,0.6);
  --linea-hairline:     rgba(247,245,242,0.08);

  --tipo:      'Archivo', system-ui, sans-serif;
  --tipo-mono: 'JetBrains Mono', ui-monospace, monospace;

  --nav-h: 56px;              /* reducido desde 76px — el nav de v6 es más fino */
  --ease-cine: cubic-bezier(0.16,1,0.3,1);
}
```

**Principio tipográfico (mantener):** una sola familia de texto. La jerarquía se construye con el **eje de anchura variable de Archivo** (`font-stretch`), no cambiando de familia. Los titulares se ensanchan como un rótulo de crédito.

**Fondo:** negro en toda la web. **Una sola inversión a amarillo sólido en todo el sitio**, reservada para el bloque de cifras de `/studio`. Si se usa en más sitios pierde significado.

**Assets existentes:** `assets/logo-imagotipo.png`, `assets/logo-logotipo.png`, `assets/logo-simbolo.png`

---

# 2. ARQUITECTURA DE URLs

Carpetas con `index.html` dentro, para URLs limpias sin extensión.

```
/                     index.html              HOME
/work/                work/index.html         ARCHIVO completo
/films/               films/index.html        submarca FILMS
/music/               music/index.html        submarca MUSIC
/ads/                  ads/index.html          submarca ADS
/directors/           directors/index.html    roster
/studio/              studio/index.html        el estudio
/contact/             contact/index.html       contacto
/real-estate/         real-estate/index.html   landing comercial (CASTELLANO)
/aviso-legal          ya existe — mantener
/privacidad           ya existe — mantener
```

**Ficha de pieza individual: NO en fase 1.** Con 10 piezas se abre en lightbox sobre la parrilla. Ver §7.3.

---

# 3. SISTEMA DE SUBMARCAS (mecanismo Iconoclast)

El logotipo de la esquina superior izquierda **cambia según la sección**, añadiendo un sufijo. Es el mecanismo que declara que Barranco Amarillo es un grupo y no un servicio único.

| Ruta | Lockup en pantalla |
|---|---|
| `/`, `/work/`, `/studio/`, `/contact/`, `/directors/` | `BARRANCO AMARILLO` |
| `/films/` | `BARRANCO AMARILLO` **`FILMS`** |
| `/music/` | `BARRANCO AMARILLO` **`MUSIC`** |
| `/ads/` | `BARRANCO AMARILLO` **`ADS`** |
| `/real-estate/` | `BARRANCO AMARILLO` **`REAL ESTATE`** |

**Implementación:** el logotipo base es el mismo elemento en todas las páginas. El sufijo es un `<span>` adicional con `font-weight` más ligero y el mismo tamaño, separado por un espacio. No es un archivo de imagen distinto por sección.

---

# 4. NAVEGACIÓN

Una sola línea, **12px**, `--tipo-mono`, `letter-spacing: 0.12em`, en mayúsculas. Tres zonas:

```
[BARRANCO AMARILLO +sufijo]        [FILMS  MUSIC  ADS  WORK]        [ESPAÑA  CONTACT  LEGAL]
    izquierda: dónde estoy            centro: qué vendes              derecha: cómo actúo
```

- Altura total del nav: 56px
- Fondo: transparente sobre el reproductor; `--negro-profundo` en el resto
- Estado activo: `--tinta-alta` a peso 700. Inactivo: `--tinta-media`
- `ESPAÑA` abre un desplegable con las regiones. Fase 1: solo `ESPAÑA` y `VENEZUELA`, con el rótulo **`OUR NETWORK`** encima (copiado del mecanismo de Iconoclast). En fase 1 ambas apuntan a la misma web — es señal de alcance, no contenido duplicado.
- **NO está `REAL ESTATE` en el nav.** Vive solo en el footer y como URL que Carlos envía en frío. Esto es deliberado.
- **NO hay botón CTA amarillo en el nav.** Ni "RESERVAR LLAMADA". Se elimina de la web de marca. Solo existe dentro de `/real-estate/`.
- **NO hay widget flotante de WhatsApp** en la web de marca. Solo dentro de `/real-estate/`.

**Móvil:** el nav colapsa a logotipo + botón de menú. El menú abre en **overlay a pantalla completa, color sólido `--negro-profundo`**, tipografía grande (clamp 32–48px), lista vertical de los 7 destinos. Entrada: barrido desde arriba, 400ms, `--ease-cine`.

---

# 5. LOADER

**Tipo:** texto que se descifra (modelo Locomotive).

**Comportamiento:**
1. Pantalla `--negro-profundo` completa
2. En el centro, a `clamp(28px, 5vw, 64px)`, las letras se barajan aleatoriamente y se van fijando de izquierda a derecha hasta formar `BARRANCO AMARILLO`
3. Al completarse, mantiene 300ms y hace fundido de salida revelando la home

**Especificaciones:**
- Duración total máxima: **1.800ms**
- Se salta con click, tecla o scroll
- Solo se muestra **una vez por sesión** (`sessionStorage`)
- Alfabeto de barajado: solo A–Z y espacio, sin símbolos raros
- El texto real `BARRANCO AMARILLO` debe estar en el HTML desde el principio (accesible a buscadores y lectores de pantalla). El barajado se aplica sobre él, no lo sustituye.
- Con `prefers-reduced-motion: reduce` → no hay loader, entra directo

---

# 6. HOME (`/`)

Dos zonas. La primera ocupa exactamente el viewport; la segunda es la que se lee al bajar.

## 6.1 Zona 1 — El reproductor (100vh, a sangre, sin márgenes)

Modelo: Iconoclast. **Un solo vídeo visible a la vez**, a pantalla completa, sin ningún margen ni padding.

**Fase 1: 6 piezas** curadas manualmente por Carlos (el orden lo decide él, no es "lo último").

**Vídeo:**
- `muted` `autoplay` `playsinline` `preload="metadata"`
- **`loop="false"`** — al terminar, avanza automáticamente al siguiente
- `object-fit: cover`, `width:100%`, `height:100%`
- Cada pieza tiene `poster` (fotograma en JPG) para que nunca haya negro en la carga

**Paginador:** abajo a la izquierda, números `1 2 3 4 5 6` en `--tipo-mono`, 14px. El activo en `--tinta-alta` peso 700, los demás en `--tinta-media`. **Clicables**: llevan directamente a esa pieza.

**Caption:** abajo a la derecha, formato Somesuch en una sola frase, alineada a la derecha:

> **DIRECTOR** para **CLIENTE**, *TÍTULO*

Ejemplo de render: `Carlos Soto para Estrella Damm, The Same As Always`
Tamaño: `clamp(18px, 2vw, 28px)`, peso 500, ancho normal.

**Cómo avanza el carrete — CRÍTICO:**

Avanza por: (a) el vídeo termina, (b) click en un número del paginador, (c) arrastre o swipe horizontal, (d) flechas ← →.

**El scroll vertical NUNCA controla el carrete.** El scroll vertical siempre desplaza la página. No hay scroll hijacking, no hay scroll horizontal obligatorio, no hay que "pasar" el carrete para poder seguir bajando. Esto es un requisito explícito de Carlos.

## 6.2 Zona 2 — La declaración (al bajar)

Modelo: Stink. Aparece al hacer scroll por debajo del reproductor.

**El texto, exacto:**

> Barranco Amarillo is an entertainment company that has worked around the world for almost a decade. We exist for one wonderful reason: the creator's vision, and what an image can do to people.

**Tamaño:** `clamp(28px, 4vw, 48px)`. La proporción importa más que la cifra: en Stink la frase es casi el triple que el logotipo del nav. Con el nav a 12px, la frase debe estar en ese rango.

**Animación de revelado (esto es lo que Carlos quiere de Stink):**

1. El texto se divide en **palabras**, cada una en un `<span>`
2. Cada línea va en un contenedor con `overflow: hidden`
3. Cada palabra parte de `transform: translateY(110%)` — escondida bajo el borde invisible de su línea
4. Al entrar en viewport (`IntersectionObserver`, threshold 0.3), cada palabra anima a `translateY(0)`
5. Retardo escalonado: **45ms por palabra**
6. Duración por palabra: 600ms, `--ease-cine`

**No es un fundido, es una máscara.** Las palabras suben desde detrás de algo, como un rótulo que entra por debajo del cuadro. Si se implementa como opacity fade, está mal.

**Requisitos no negociables:**
- El texto completo debe existir como texto continuo y legible en el HTML fuente. El troceado en spans lo hace el JS al cargar, no viene escrito así en el HTML. Si no hay JS, se ve la frase entera normal.
- Con `prefers-reduced-motion: reduce`, las palabras aparecen sin animación.

**Justo debajo de la frase:** las tres submarcas como etiquetas pequeñas, `--tipo-mono` 14px, `letter-spacing 0.2em`, separadas:

```
FILMS        MUSIC        ADS
```

Cada una enlaza a su página. Debajo, un enlace `ALL WORK →` a `/work/`.

## 6.3 Footer (común a toda la web)

```
BARRANCO AMARILLO

ESPAÑA                         VENEZUELA
infobarrancoamarillo@gmail.com

[Instagram]  [LinkedIn]  [Vimeo]

SERVICIOS INMOBILIARIOS →      (enlace a /real-estate/)

Aviso legal   ·   Privacidad
```

- Sin dirección física (no hay ninguna publicable todavía)
- Sin newsletter en fase 1
- El enlace a real estate va aquí, discreto, en `--tinta-media`

---

# 7. `/work/` — EL ARCHIVO

## 7.1 Cabecera

Lockup base. Título de sección en `--tipo-mono` 12px: `WORK`.

## 7.2 Filtros

Una fila, `--tipo-mono` 12px, mayúsculas:

```
ALL      FILMS      MUSIC      ADS
```

Filtrado en cliente, sin recarga. El activo en amarillo.

## 7.3 La parrilla

- **Tamaños desiguales**, modelo CANADA. Con 10 piezas, una retícula regular deja ver que son pocas; una parrilla desigual las hace parecer una selección.
- Cada celda: vídeo en bucle **muteado** que arranca al entrar en viewport (`IntersectionObserver`), con `poster` mientras carga
- Caption debajo de cada celda, `--tipo-mono` 12px, tres líneas:
  ```
  CLIENTE
  TÍTULO
  DIRECTOR · AÑO
  ```
- Al hacer click: **lightbox** a pantalla completa con el vídeo completo (embed de YouTube), con `×` para cerrar y flechas para navegar a la pieza anterior/siguiente. Sin página propia en fase 1.
- Hover: revela el caption con más contraste y sube ligeramente el brillo del vídeo. Nada más.

## 7.4 Fuente de datos: `data/work.json`

**Esto es la pieza más importante del brief.** Todo el contenido de trabajo sale de un solo archivo. Ni la home, ni `/work/`, ni las páginas de submarca tienen piezas escritas a mano en el HTML.

```json
[
  {
    "id": "slug-de-la-pieza",
    "cliente": "",
    "titulo": "",
    "director": "",
    "anio": 2025,
    "submarca": "films",
    "video_loop": "assets/video/slug-loop.mp4",
    "poster": "assets/video/slug-poster.jpg",
    "video_completo": "https://www.youtube.com/watch?v=...",
    "destacada_home": false,
    "orden_home": null
  }
]
```

**Reglas:**
- `submarca`: uno de `"films"` | `"music"` | `"ads"`
- `destacada_home: true` → aparece en el reproductor de portada. `orden_home` (1–6) fija la posición.
- La home lee las 6 con `destacada_home: true` ordenadas por `orden_home`
- `/work/` lee todas
- `/films/`, `/music/`, `/ads/` filtran por `submarca`
- `/directors/` cuenta las piezas por `director`

**Fase 1:** crear el archivo con **10 entradas con la estructura completa y los campos de texto vacíos**, listas para que Carlos las rellene. **No inventar clientes, títulos ni años.** Poner `orden_home` 1–6 en las seis primeras.

## 7.5 Vídeo — reglas técnicas

- **Bucles y reproductor de portada:** MP4 propios, 10–20s, 1080p, sin audio, objetivo 2–4 MB cada uno. En `assets/video/`.
- **Pieza completa:** embed de YouTube dentro del lightbox.
- **No usar YouTube para los bucles ni para el reproductor de portada.** Mete su interfaz, su marca y sus sugerencias, y el autoplay a pantalla completa queda sucio.
- Todo con `loading="lazy"` / `IntersectionObserver`. Nunca más de 2 vídeos reproduciéndose a la vez.
- **Fase 1:** los vídeos aún no existen. Usar los `poster` como placeholder y dejar la estructura de `<video>` lista. La web debe verse bien y no romperse con los archivos ausentes.

---

# 8. `/films/` `/music/` `/ads/`

Misma plantilla para las tres, con lockup y contenido distintos.

1. **Lockup con sufijo** (§3)
2. **Una declaración tipográfica** de la submarca, `clamp(28px, 4vw, 48px)`, con el mismo revelado por palabras de §6.2. Copy: **pendiente de Carlos, dejar marcador visible `[COPY PENDIENTE]`.**
3. **Parrilla filtrada** por esa submarca, mismo componente que `/work/`

Si una submarca tiene menos de 3 piezas, la parrilla se sustituye por 1–2 piezas grandes a ancho completo. Con poco material, pocas piezas grandes se ven mejor que una parrilla con huecos.

---

# 9. `/directors/`

Modelo Iconoclast, versión simplificada.

- **Sin pestaña NEW TALENT en fase 1.** Solo el roster.
- Tres nombres, en columnas, `--tipo-mono` 14px mayúsculas, peso 700:

```
CARLOS SOTO          EMMANUEL RUIZ          CRISTIAN ZAMORA
```

- Cada nombre filtra la parrilla de `/work/` por ese director (enlace a `/work/?director=slug`)
- **No hay ficha individual, ni foto, ni biografía en fase 1.** Carlos aún tiene que reunir las piezas de cada uno.

---

# 10. `/studio/`

- Lockup base
- **Copy: pendiente.** El texto de la v5 (*"Nacimos hace siete años rodando ficción y videoclips…"*) está en castellano y esta web va en inglés. Dejar marcador `[COPY PENDIENTE — reescribir en inglés]`.
- **Bloque de cifras: la única inversión a amarillo sólido de toda la web.** Fondo `--amarillo`, texto `--negro`. Tres datos, pendientes de confirmar por Carlos.
- Sin fotos de equipo (no hay material)

---

# 11. `/contact/`

Interpretación del contacto de Stink, no copia. Página como pieza editorial, no como ficha de datos.

**Estructura:**

1. **Fondo que se aclara al bajar.** Empieza en `--negro-profundo` y progresa a `--tinta-alta` a lo largo del scroll, con el texto invirtiéndose de claro a oscuro. Transición ligada al progreso de scroll, suave, sin saltos.
2. En el trayecto, **una frase por pantalla** en tipografía grande con el revelado por palabras de §6.2. Copy: `[PENDIENTE]`.
3. **Al final, sobre fondo claro, los tres accesos con el mismo peso visual:**

```
WHATSAPP        →  https://wa.me/34692722358
EMAIL           →  infobarrancoamarillo@gmail.com
FORMULARIO      →  abre el formulario en la misma página
```

**Formulario (opcional para el usuario, no obligatorio):** nombre, email, tipo de proyecto (select: Film / Music / Ads / Other), mensaje. Sin campos de teléfono ni presupuesto.

**Envío:** el proyecto ya usa Supabase. **Confirmar con Carlos qué hace Supabase hoy antes de conectar nada.** Si no está claro, dejar el formulario maquetado con un `TODO` en el submit y no inventar endpoint.

**Sin organigrama de roles.** Con tres personas, un organigrama tipo Iconoclast delata tamaño en lugar de proyectarlo.

**Sin dirección física** (no hay ninguna publicable).

## 11.1 Recordatorio

Nada de scroll secuestrado aquí tampoco. El fondo cambia *con* el scroll; el scroll nunca se bloquea ni se desvía.

---

# 12. `/real-estate/` — **EN CASTELLANO**

La única página de la web en castellano, porque vende en Terrassa. Es una landing autónoma: Carlos envía este enlace en frío a agentes inmobiliarios y tiene que funcionar sola, sin que nadie pase por la home.

**Registro:** premium y selectivo. **Referencia negativa explícita: HomeJab.** No imitar su lenguaje — nada de tiras de promesas operativas, "reserva en 60 segundos", insignias de valoración ni "10.000 clientes". Ese es el registro del operador masivo del que Barranco Amarillo se quiere separar.

**Misma identidad visual que el resto de la web.** No es una landing comercial al uso.

## 12.1 Entrada (100vh, a sangre)

Vídeo de marca personal del agente a pantalla completa. Encima, la frase:

> **Eligen el futuro, te eligen a ti.**

`clamp(32px, 5vw, 64px)`, con el revelado por palabras de §6.2.

## 12.2 El producto principal: marca personal del agente

Este es el eje, no el vídeo de la propiedad. **Lo que se vende es que al agente lo elijan a él antes que a su competencia**, no fotos bonitas de un piso.

Bloque con el caso que ya existe: quién es el agente, qué se rodó, resultado. Vídeo completo reproducible.

**Copy: `[PENDIENTE — Carlos aporta el caso]`.** No inventar nombre de agente, testimonio ni resultado.

## 12.3 La propiedad

Servicio secundario. Vídeo de inmueble y aéreas, presentado con imágenes de las casas. Sin desglose de tarifas por servicio.

## 12.4 Tours 3D

**NO INCLUIR EN FASE 1.** No hay ningún tour rodado. La v5 los anuncia como "PRÓXIMAMENTE" con un visor vacío, y eso resta credibilidad en lugar de sumarla. Se elimina por completo hasta que exista un tour real que enseñar.

## 12.5 Precio

Una sola referencia, en texto, sin tabla ni tarjetas de tarifas:

> **Proyectos desde 299 €.**
> El precio no se negocia. El alcance sí.

Nada más. No desglosar los tres servicios con su precio como en la v5.

> **Nota de estrategia para Carlos, no va en la web:** 299 € está por debajo de los 350 € del roadmap y cerca del suelo de HomeJab ($179), que es el operador masivo del que quieres diferenciarte. Si el producto es la marca personal del agente y no la foto del piso, el suelo debería subir, no bajar. Queda a 299 € porque así lo has decidido, pero conviene revisarlo.

## 12.6 Conversión

Tres accesos, con el tono de la casa. Sin urgencia, sin contadores, sin "última oportunidad".

- **WhatsApp:** `https://wa.me/34692722358` — con mensaje preescrito: `Hola, os escribo desde la web. Me interesa el vídeo de marca personal.`
- **Email:** `infobarrancoamarillo@gmail.com`
- **Formulario:** el mismo componente de §11, opcional

**Aquí sí** se permite el botón flotante de WhatsApp en móvil, discreto, en `--amarillo`. Solo en esta página.

## 12.7 Advertencia honesta

Con un solo caso y sin tours, esta página es de promesa, no de prueba. Ese único caso tiene que estar contado excepcionalmente bien: es todo el peso de la credibilidad.

---

# 13. ANIMACIÓN Y MOVIMIENTO

**Nivel general: 3 sobre 5.** Entre Somesuch (2) e Iconoclast (3). Muy lejos de Locomotive (5).

| Elemento | Especificación |
|---|---|
| Revelado de frases | Máscara por palabras, 45ms de retardo, 600ms, `--ease-cine` (§6.2) |
| Entrada de elementos al scroll | Fundido + 12px de subida, 400ms. Sutil. |
| Hover en pieza | Revela caption, sube brillo. Sin escalado brusco. |
| Hover en nav | Cambio de color. Nada de animación letra a letra en fase 1. |
| Transición entre páginas | **Ninguna en fase 1.** Carga normal. Un fundido entre páginas exige SPA o View Transitions y no compensa el coste ahora. |
| Scroll | **Nativo.** Sin lerp, sin suavizado por JS. Da problemas en móvil y de accesibilidad. |
| Cursor | Cursor del sistema. Se elimina el cursor amarillo/lila de la v4. |
| Loader | Texto que se descifra, máximo 1.800ms (§5) |

**`prefers-reduced-motion: reduce` desactiva todo lo anterior.** No es opcional.

---

# 14. FAVICON ANIMADO

Mecanismo Stink, confirmado por inspección: fotogramas numerados en rutas separadas que un JS intercambia en el `<link rel="icon">`.

**Implementación:**
```
assets/favicon/01/favicon-32x32.png
assets/favicon/02/favicon-32x32.png
...
assets/favicon/NN/favicon-32x32.png
```

Un `setInterval` cambia el `href` del `<link rel="icon">` cíclicamente. Intervalo: 120ms.

**Fase 1:** Carlos ha pedido fotogramas nuevos dibujados para 32×32 px, no una animación del logo existente. Hasta que existan, **usar `assets/logo-simbolo.png` estático** y dejar la estructura de carpetas y el JS preparados y desactivados con un flag.

Pausar la animación cuando la pestaña no está visible (`document.hidden`) para no gastar batería.

---

# 15. IDIOMA

- **Inglés por defecto.** `<html lang="en">` en toda la web de marca.
- **Excepción: `/real-estate/` en castellano**, `<html lang="es">`.
- Conmutador ES/EN visible: **fase 2.** En fase 1 la web de marca solo existe en inglés.
- No duplicar páginas ni crear estructura `/en/` `/es/` todavía. Cuando llegue la fase 2 se decide.

---

# 16. TÉCNICO

- **SEO:** `<title>` y `meta description` propios por página. Open Graph con imagen por página. `sitemap.xml`. Actualizar la `og:url` de la v5, que apunta a `github.io` y está mal.
- **Analítica:** Vercel Analytics. Sin cookies.
- **Banner de cookies:** no hace falta, no hay cookies de terceros. Eliminar si existe.
- **Rendimiento:** objetivo Lighthouse > 90 en móvil. Con vídeo a pantalla completa esto exige `poster` en todos, `preload="metadata"`, y no más de 2 vídeos activos.
- **Accesibilidad:** contraste AA mínimo. Foco visible en amarillo (ya está en el sistema). Todo navegable con teclado, incluido el paginador del reproductor y el lightbox.
- **Dominio:** sigue en `baweb-v5.vercel.app`. No hay dominio propio. No configurar nada.
- **`build.sh`:** actualizar para copiar las nuevas carpetas y `data/` a `dist/`.

---

# 17. FASES

## FASE 1 — hoy
1. Extraer el CSS común a `assets/css/base.css`
2. Nav de tres zonas con lockup variable + footer común, en todas las páginas
3. Loader de texto que se descifra
4. Home: reproductor a sangre con paginador + frase con revelado por palabras + etiquetas de submarca
5. `data/work.json` con 10 entradas vacías y estructura completa
6. `/work/` con parrilla desigual, filtros y lightbox
7. `/real-estate/` completa, en castellano
8. `/films/` `/music/` `/ads/` `/directors/` `/studio/` `/contact/` con estructura montada y `[COPY PENDIENTE]` visible donde falte texto
9. Reescribir `MASTER.md`
10. Actualizar `build.sh`

## FASE 2 — después
- Copy definitivo de todas las páginas
- Los 10 vídeos MP4 y sus posters
- Fichas individuales de pieza (`/work/[slug]/`)
- Conmutador ES/EN real
- Fotogramas del favicon animado
- Pestaña NEW TALENT en `/directors/`
- Tours 3D en `/real-estate/`, cuando exista uno
- Fichas de director con foto y biografía

---

# 18. CRITERIOS DE ACEPTACIÓN

- [ ] Se puede navegar entre las 9 páginas y el lockup cambia correctamente en cada una
- [ ] El scroll vertical nunca se bloquea, se desvía ni se secuestra en ninguna página
- [ ] El reproductor de la home avanza al terminar el vídeo, al clicar un número y al arrastrar — pero **no** con el scroll vertical
- [ ] La frase de la home se revela por palabras con máscara, no con fundido
- [ ] Sin JS: todas las páginas se leen y se navegan, y todas las frases aparecen completas
- [ ] `prefers-reduced-motion: reduce` desactiva loader, revelados y entradas
- [ ] `data/work.json` es la única fuente de piezas. No hay ninguna pieza escrita a mano en un HTML.
- [ ] Cero precios en la web de marca. Solo "desde 299 €" en `/real-estate/`.
- [ ] Cero menciones a Tours 3D en toda la web
- [ ] `REAL ESTATE` no aparece en el nav, solo en el footer
- [ ] Sin CTA amarillo ni WhatsApp flotante fuera de `/real-estate/`
- [ ] Ningún dato inventado: ni clientes, ni títulos, ni años, ni testimonios, ni cifras
- [ ] Ni `main` ni la rama v5 modificadas. Sin push ni deploy sin petición explícita.

---

# 19. REFERENCIAS — QUÉ SE TOMA DE CADA UNA

| Referencia | Qué se toma |
|---|---|
| **Iconoclast** | Submarca por sufijo en el lockup · reproductor a sangre con paginador numerado · nav de tres zonas a 12px · `OUR NETWORK` como conmutador de región |
| **Stink Studios** | Frase de posicionamiento **al bajar**, no arriba · revelado por palabras con máscara · favicon animado por fotogramas · contacto como pieza editorial con fondo que se aclara |
| **CANADA** | Parrilla de tamaños desiguales · vídeos en bucle muteados en la parrilla · footer con territorios |
| **Somesuch** | Formato del caption como una sola frase: `DIRECTOR para CLIENTE, TÍTULO` |
| **Anonymous Content** | Cine y publicidad mezclados en el mismo río, sin separarlos por pestañas |
| **Locomotive** | Solo el loader de texto que se descifra. Nada más — su nivel de movimiento no se copia. |
| **HomeJab** | **Referencia negativa.** No imitar su registro comercial en `/real-estate/`. |

---

# 20. PENDIENTE DE CARLOS

1. Datos de las 10 piezas: cliente, título, director, año
2. Los 10 MP4 de bucle + posters
3. Enlaces de YouTube de las piezas completas
4. Copy de `/studio/` en inglés + tres cifras del bloque amarillo
5. Copy de las declaraciones de `/films/` `/music/` `/ads/`
6. Copy de `/contact/`
7. El caso de marca personal de `/real-estate/`: agente, qué se rodó, resultado
8. Fotogramas del favicon animado
9. Piezas de Emmanuel Ruiz y Cristian Zamora
10. Qué hace Supabase hoy exactamente
11. Dominio propio y email profesional
