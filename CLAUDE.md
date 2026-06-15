# CLAUDE.md — Lumen Labs Landing Page
# Agencia de automatización con IA · Jun 2026

---

## Stack

- **Arquitectura:** Single-file HTML (`index.html`) — sin build tools, sin frameworks
- **3D / Partículas:** CSS animations + Canvas `requestAnimationFrame` (sin Three.js)
- **Animaciones:** GSAP + ScrollTrigger vía CDN — todos con `toggleActions: 'play reverse play reverse'`
- **Estilos:** CSS custom properties en `<style>` del mismo archivo
- **JS lógica:** Scripts normales `<script>` (nunca `type="module"`)
- **Formulario / CTA:** Botón Typeform `target="_blank"` — placeholder `TYPEFORM_URL_AQUI`
- **Redirección post-form:** `action="/gracias"` → página `gracias.html` con Calendly embed
- **Deploy:** Netlify · repo GitHub: https://github.com/matto-00/Landing-Page-Lumen-Labs.git
- **Fuentes:** Neue Montreal vía Fontshare CDN (400, 500, 700) + Inter vía Google Fonts (fallback)

---

## Design System

### Colores
```
/* Base */
--color-bg:          #050505   /* Carbon Black — fondo principal */
--color-surface:     #0A0A0A   /* Deep Black — cards y secciones */
--color-elevation:   #121212   /* Soft Graphite — bordes y elevaciones */

/* Accent */
--color-orange:      #D76912   /* Lumen Orange — color principal de marca */
--color-amber:       #E88420   /* Bright Amber — hover y destacados */
--color-gold:        #B55A0F   /* Deep Gold — gradientes premium */
--color-ember:       #4B230B   /* Ember — fondos y sombras oscuras */

/* Texto */
--color-text:        #FFFFFF   /* Primary */
--color-secondary:   #B0B0B0   /* Secondary */
--color-muted:       #777777   /* Tertiary */

/* Gradiente principal */
--gradient-brand: linear-gradient(135deg, #B55A0F 0%, #D76912 45%, #E88420 100%);
```

### Cards
```
--card-bg:      rgba(12,12,12,0.85)
--card-border:  1px solid rgba(255,138,0,0.15)
--card-radius:  20px
--card-shadow:  0 20px 60px rgba(255,138,0,0.12)
```

### Glass (sutil — estilo Linear/Apple, no exagerado)
```
--glass-bg:     rgba(20,20,20,0.65)
--glass-blur:   blur(20px)
```

### Botones
```
/* Primario */
--btn-bg:       linear-gradient(135deg, #FF8A00, #FFA726)
--btn-radius:   14px
--btn-hover:    brightness(115%)

/* Secundario */
--btn-sec-bg:     transparent
--btn-sec-border: 1px solid rgba(255,138,0,0.25)
```

### Glow / Iluminación (NUNCA superar 20% de opacidad)
```
--glow-color:   #FF8A00
--glow-10:      rgba(255,138,0,0.10)
--glow-15:      rgba(255,138,0,0.15)
--glow-20:      rgba(255,138,0,0.20)
```

### Tipografía
```
/* Fuente principal: Neue Montreal vía Fontshare CDN */
/* CDN: https://api.fontshare.com/v2/css?f[]=neue-montreal@400,500,700&display=swap */
--font-display: 'Neue Montreal', 'Inter', sans-serif
--font-body:    'Neue Montreal', 'Inter', sans-serif

/* Escala */
--text-hero:    72px / weight 500 / line-height 1.05 / letter-spacing -3px
--text-h2:      48px / weight 500
--text-h3:      28px / weight 500
--text-body:    18px / weight 400
--text-label:   12px / weight 600 / letter-spacing 2px / uppercase
```

### Layout
```
--container-max: 1440px
--content-max:   1280px
--grid:          12 columnas
/* Sistema 8pt: 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 */
```

**Firma visual:** antorcha flotante + glow naranja. Cards oscuras estilo Linear.
Fórmula: 70% negro profundo · 20% naranja luminoso · 10% blanco.
Mucho espacio negativo. Geometría abstracta. Sin fotos ni personas.

---

## Estructura de la página (orden fijo — no reordenar)

```
01  #hero           Promesa + subpromesa + eyebrow
02  #vsl            Video embed (placeholder YouTube/Vimeo)
03  #cta-1          Formulario principal (Netlify Forms)
04  #problema       Qué problema resolvemos
05  #para-quien     Para quién es esto
06  #cta-2          Botón → scroll a #cta-1
07  #casos          Casos reales de éxito (2-3 casos)
08  #equipo         Quiénes somos
09  #cta-3          Botón → scroll a #cta-1
10  #faq            Preguntas frecuentes (accordion)
11  #cta-4          Botón + mini formulario → scroll a #cta-1
12  #footer         Links + redes + legal
```

---

## Constraints absolutas

1. **El formulario (#cta-1) es el único punto de conversión.** Los CTAs secundarios (#cta-2, #cta-3, #cta-4) hacen scroll suave hasta #cta-1, no abren nuevas páginas.
2. **Post-submit del formulario → redirigir a `gracias.html`** donde vive el Calendly embed.
3. **GSAP no toca el renderer de Three.js** si existe una escena 3D. ScrollTrigger solo para elementos DOM.
4. **Glass effect siempre con `backdrop-filter`**, nunca simulado con opacidad simple.
5. **Mobile-first.** Breakpoint único: `@media (min-width: 768px)`.
6. **Sin librerías extra** (no Bootstrap, no Tailwind, no Alpine). CSS y JS vanilla.

---

## Skills — cuándo invocarlas

| Situación | Skill | Cuándo NO usarla |
|-----------|-------|-----------------|
| Diseñar una sección nueva desde cero, decidir tipografía, paleta, layout visual | `@frontend-design` | Cambios CSS puntuales, fixes, ajustes de color existentes |
| Decisiones de UX: flujo del formulario, jerarquía de CTAs, microcopy, accesibilidad, conversión | `@ux-ui-pro-max` | Cambios estructurales simples, ajustes de copy menores |

**Regla de uso — ambas skills consumen tokens significativos:**
- Invocar `@frontend-design` solo cuando hay una decisión estética nueva sin precedente en el proyecto.
- Invocar `@ux-ui-pro-max` solo cuando hay una decisión de flujo, conversión o experiencia de usuario que no está resuelta por los constraints de este archivo.
- Para el resto: los constraints y principios de este CLAUDE.md son suficientes. No invocar skills por defecto.

---

## Archivos del proyecto

```
/
├── index.html          ← archivo principal, todo en uno
├── gracias.html        ← página post-form con Calendly embed
├── CLAUDE.md           ← este archivo
└── assets/
    └── (imágenes, video thumbnail si aplica)
```

---

## Estado del proyecto — Lista de tareas

Claude debe tachar cada tarea al completarla actualizando este archivo.

### FASE 1 — Base
- [x] Scaffolding inicial: `index.html` con CSS variables, reset, fuentes
- [x] `gracias.html` con Calendly embed funcional
- [x] Navbar sticky con logo Lumen Labs + CTA botón

### FASE 2 — Secciones hero + conversión
- [x] `#hero` — headline, subheadline, eyebrow, CTA suave hacia VSL
- [x] `#vsl` — embed video (placeholder iframe) con play button custom
- [x] `#cta-1` — botón Typeform (target="_blank"), glass card, trust signals

### FASE 3 — Secciones de contenido
- [x] `#problema` — copy + diseño inmersivo (glassmorphism cards)
- [x] `#para-quien` — checklist visual de perfiles ideales
- [x] `#cta-2` — botón secundario con scroll a #cta-1
- [x] `#casos` — 2-3 casos con resultado concreto (número + descripción)
- [x] `#equipo` — perfiles del equipo (foto + rol + frase)
- [x] `#cta-3` — botón secundario con scroll a #cta-1

### FASE 4 — Cierre + polish
- [x] `#faq` — accordion funcional, 6-7 preguntas
- [x] `#cta-4` — mini formulario o botón final
- [x] `#footer` — links, redes, legal, logo
- [ ] Animaciones GSAP ScrollTrigger en todas las secciones
- [x] ~~Three.js hero~~ → Hero 3D con CSS + Canvas: plataforma PNG, antorcha flotante, circuitos pulsantes, chispas (sin Three.js)
- [ ] Revisión mobile completa (768px breakpoint)
- [ ] Test formulario Netlify en producción
- [ ] Deploy Netlify + dominio

---

## Bugs conocidos / advertencias activas

_(ninguno al inicio del proyecto — actualizar aquí si aparecen)_

---

## Sesión actual — próxima tarea

**Completado:** Hero 3D animado (CSS + Canvas) — plataforma isométrica, antorcha flotante con glow pulsante, 4 overlays de circuitos con mix-blend screen, chispas en canvas con requestAnimationFrame, entrada GSAP
**Próxima:** Revisión mobile completa (768px) + deploy Netlify