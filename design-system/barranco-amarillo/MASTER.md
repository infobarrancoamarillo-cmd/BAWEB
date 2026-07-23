# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Barranco Amarillo
**Generated:** 2026-07-15 23:43:03
**Category:** Architecture / Interior
**Design Dials:** Variance 8/10 (Bold / Asymmetric) | Motion 6/10 (Standard) | Density 3/10 (Spacious)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#18181B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#27272A` | `--color-secondary` |
| Accent/CTA | `#F8FAFC` | `--color-accent` |
| Background | `#000000` | `--color-background` |
| Foreground | `#FAFAFA` | `--color-foreground` |
| Muted | `#181818` | `--color-muted` |
| Border | `#3F3F46` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |
| Ring | `#18181B` | `--color-ring` |

**Color Notes:** Pure black + white contrast

### Typography

- **Heading Font:** Playfair Display
- **Body Font:** Source Serif 4
- **Mood:** monochrome, editorial, austere, typographic, pocket manifesto, luxury, high contrast, brutalist mobile
- **Google Fonts:** [Playfair Display + Source Serif 4](https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400|Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&display=swap');
```

### Spacing Variables

*Density: 3/10 — Spacious*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `24px` / `1.5rem` | Standard padding |
| `--space-lg` | `32px` / `2rem` | Section padding |
| `--space-xl` | `48px` / `3rem` | Large gaps |
| `--space-2xl` | `64px` / `4rem` | Section margins |
| `--space-3xl` | `96px` / `6rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #F8FAFC;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #18181B;
  border: 2px solid #18181B;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #000000;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #18181B;
  outline: none;
  box-shadow: 0 0 0 3px #18181B20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Kinetic Brutalism (Mobile)

**Keywords:** kinetic, brutalism, motion, marquee, acid yellow, uppercase, oversized, aggressive typography, street, zine, high contrast, scroll-driven, haptic, reanimated

**Best For:** Immersive storytelling apps, brand flagship mobile, music/culture platforms, sports apps, underground zines, limited-edition product drops, performance dashboards

**Key Effects:** Infinite marquee (Reanimated, Linear easing, 5s loop, hard clip), hero parallax (scale 1.0→1.3 + fade), sticky section header push, card flood inversion on press (bg→#DFE104, text→#000000), haptic Medium on every press, scroll-triggered interpolate transforms, 0px radius, 2px borders, 100ms color transitions

### Page Pattern

**Pattern Name:** Portfolio Grid

- **Conversion Strategy:** Visuals first. Filter by category. Fast loading essential.
- **CTA Placement:** Project Card Hover + Footer Contact
- **Section Order:** 1. Hero (Name/Role), 2. Project Grid (Masonry), 3. About/Philosophy, 4. Contact

---

## Motion

**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

**Framework notes:** grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger

- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI
- ⚡ Group DOM writes; avoid interleaving layout reads (getBoundingClientRect) between staggered tweens

---

## Anti-Patterns (Do NOT Use)

- ❌ Poor imagery
- ❌ Cluttered layout

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

---

## OVERRIDE DE MARCA (Barranco Amarillo — decisión final, prevalece sobre lo generado)

La jerarquía de mando del proyecto es: **identidad de marca > skill > brief > defaults**.
Lo siguiente sustituye a las secciones generadas arriba:

### Estilo resuelto
`--variance 8` sesga estructuralmente hacia Brutalism (verificado en 4 ejecuciones con
vocabularios distintos: Neo Brutalism ×2, Kinetic Brutalism ×2). Decisión documentada:
- **Columna vertebral:** *Exaggerated Minimalism* (match de `--domain style`): tipografía
  oversized `clamp()`, espacio negativo extremo, base oscura + UN acento, cero decoración.
- **Se hereda de Kinetic Brutalism:** composición asimétrica, headers de sección sticky,
  inversión de color en estados activos (reinterpretada: fondo→amarillo, texto→negro),
  labels uppercase con tracking amplio.
- **Se descarta de Brutalism:** bordes 4px, sombras duras offset, rotaciones, marquee,
  fondo crema, radius 0 agresivo, estética zine/street.

### Paleta (bloqueada por manual de marca — los hex de arriba NO se usan)
| Rol semántico            | Hex       | Uso |
|--------------------------|-----------|-----|
| `--superficie-profunda`  | `#121010` | fondo de sala (secciones inmersivas) |
| `--superficie-base`      | `#1E1B1A` | fondo general |
| `--superficie-elevada`   | `#282422` | tarjetas/paneles (derivado neutral de base) |
| `--acento-proyector`     | `#F1C741` | haz de luz: play, filtro activo, subrayado, arista |
| `--sobre-acento`         | `#1E1B1A` | texto sobre amarillo |
| `--micro-acento`         | `#E56425` | solo micro-acento (metadatos puntuales) |
| `--tinta-alta`           | `#F5EFE3` | texto principal |
| `--tinta-media`          | `#B4ACA4` | texto secundario (≥4.5:1 sobre base) |
| `--linea-hairline`       | `rgba(245,239,227,.14)` | divisores |
Regla `no-raw-hex`: ningún hex en componentes; todo vía custom properties de rol.

### Tipografía (bloqueada por manual de marca)
Familias: **Roboto Slab** (titulares) + **Roboto** (cuerpo/UI). No se añaden familias.
Del pairing generado solo se toma la mecánica editorial: display a `clamp(3rem,8vw,7.5rem)`
weight 900, line-height 0.95, tracking apretado en display y amplio (0.18em) en labels
uppercase; cuerpo 16px/1.5.

### Motion
GSAP prohibido en el entregable (archivo único sin dependencias). Los presets del dominio
`gsap` se usan solo como coreografía de referencia, traducidos a IntersectionObserver +
transiciones CSS: entradas 150–300ms, solo `transform`/`opacity`, stagger ≤60ms/item,
salida más rápida que entrada, `prefers-reduced-motion` desactiva todo.
