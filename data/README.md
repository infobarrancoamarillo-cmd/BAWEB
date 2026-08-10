# `data/work.json` — la única fuente de piezas

Toda la obra de la web sale de aquí. Ni la home, ni `/work/`, ni `/films/`,
`/music/`, `/ads/`, ni `/directors/` llevan una sola pieza escrita a mano en
el HTML. Se toca este archivo y cambia la web entera.

## Campos

| Campo | Qué es | Notas |
|---|---|---|
| `id` | Identificador interno | Único. Hoy son `pieza-01`…`pieza-10`; cámbialos a slugs reales cuando sepas los títulos. |
| `cliente` | Cliente o marca | Vacío = se pinta un marcador `CLIENTE` visible. |
| `titulo` | Título de la pieza | Vacío = marcador `TÍTULO`. |
| `director` | Nombre del director | Debe coincidir con el del roster de `/directors/` para que el filtro por director funcione. |
| `anio` | Año, número | `null` = marcador `AÑO`. |
| `submarca` | `"films"` \| `"music"` \| `"ads"` | Decide en qué página de submarca aparece. |
| `video_loop` | MP4 propio de bucle | 10–20 s, 1080p, sin audio, 2–4 MB. En `assets/video/`. Vacío = placeholder. |
| `poster` | Fotograma JPG | Se ve mientras carga el vídeo. Vacío = placeholder. |
| `video_completo` | URL de YouTube | Es lo que abre el lightbox. Vacío = aviso de pendiente. |
| `destacada_home` | `true` / `false` | `true` la mete en el reproductor de portada. |
| `orden_home` | 1–6 | Posición en el reproductor. Lo decide Carlos, no es «lo último». |

## Estado en fase 1

Las diez entradas están **con la estructura completa y los textos vacíos**, a
la espera de los datos reales. Nada de lo que hay aquí es contenido inventado.

Dos cosas son marcadores de reparto, no datos: los `id` (`pieza-01`…) y el
reparto de `submarca` (4 films / 3 music / 3 ads). Están puestos solo para que
las páginas de submarca y los filtros tengan algo que enseñar. Cámbialos.

## Lo que falta para que esto deje de estar vacío

1. Cliente, título, director y año de las diez piezas
2. Los diez MP4 de bucle y sus posters en `assets/video/`
3. Los enlaces de YouTube de las piezas completas
