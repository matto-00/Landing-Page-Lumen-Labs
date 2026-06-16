# CLAUDE.md — Lumen Labs Landing Page
# Agencia de automatización con IA · Jun 2026
# Repo: https://github.com/matto-00/Landing-Page-Lumen-Labs.git

---

## Stack

### Frontend (Landing Page)
- **Arquitectura:** Single-file HTML (`index.html`) — sin build tools, sin frameworks
- **3D / Hero:** CSS animations + Canvas `requestAnimationFrame` (sin Three.js)
- **Animaciones:** GSAP + ScrollTrigger vía CDN — todos con `toggleActions: 'play reverse play reverse'`
- **Estilos:** CSS custom properties en `<style>` del mismo archivo
- **JS lógica:** Scripts normales `<script>` (nunca `type="module"`)
- **Punto de conversión:** Botón → `formulario.html` (no Typeform, no Netlify Forms)
- **Deploy:** Netlify
- **Fuentes:** Neue Montreal vía Fontshare CDN (400, 500, 700) + Inter fallback

### Formulario de pre-reunión (`formulario.html`)
- **Arquitectura:** Single-file HTML/CSS/JS — sin frameworks, sin build tools
- **Flujo:** 9 pantallas tipo Typeform (100vh, transición vertical con fade)
- **Punto de conversión:** POST `API_URL` → si `success: true` → redirect directo a Calendly
- **Calendly:** `https://calendly.com/elgranh/reuniones-1-a-1`
- **`gracias.html`:** Confirmación post-agendamiento — 3 cards de recomendaciones con glassmorphism. SIN Calendly embed. SIN botón "volver al inicio"
- **`API_URL`** (constante al inicio del `<script>`): `https://landing-page-lumen-labs-production-09f5.up.railway.app/api/leads` (producción Railway ✅)
- **Animaciones:** CSS puro — transición pantalla Y-axis, stagger de contenido, shake de error

### Backend (`/backend`)
- **Runtime:** Node.js + Express — **siempre CommonJS** (`require`/`module.exports`, nunca `import`/`export`)
- **DB:** PostgreSQL en Railway vía `pg` Pool
- **Variables de entorno:** `DATABASE_URL` + `PORT=3000` en `/backend/.env` — **nunca hardcodear**
- **Scripts:** `npm start` (producción) · `npm run dev` (nodemon)
- **Deploy:** Railway ✅ — `https://landing-page-lumen-labs-production-09f5.up.railway.app`

---

## Design System

### Colores
```css
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
--color-text:        #FFFFFF
--color-secondary:   #B0B0B0
--color-muted:       #777777

/* Gradiente principal */
--gradient-brand: linear-gradient(135deg, #B55A0F 0%, #D76912 45%, #E88420 100%);

/* Glow — NUNCA superar 20% de opacidad */
--glow-10: rgba(215,105,18,0.10)
--glow-15: rgba(215,105,18,0.15)
--glow-20: rgba(215,105,18,0.20)
```

### Cards
```css
--card-bg:      rgba(12,12,12,0.85)
--card-border:  1px solid rgba(215,105,18,0.15)
--card-radius:  20px
--card-shadow:  0 20px 60px rgba(215,105,18,0.12)
```

### Glass (sutil — estilo Linear/Apple)
```css
--glass-bg:   rgba(20,20,20,0.65)
--glass-blur: blur(20px)
/* Siempre con backdrop-filter real — nunca simular con opacidad */
```

### Botones
```css
/* Primario — gradiente radial animado */
background: radial-gradient(ellipse at 50% 50%,
  #E8780A 0%, #C45E08 30%, #6B2A03 45%,
  #1A0800 65%, #000000 100%);
border-radius: 999px;
animation: btnShimmer 6s ease-in-out infinite;

/* Secundario */
background: transparent;
border: 1px solid rgba(215,105,18,0.25);
border-radius: 999px;
```

### Tipografía
```css
--font-display: 'Neue Montreal', 'Inter', sans-serif
--font-body:    'Neue Montreal', 'Inter', sans-serif
/* CDN: https://api.fontshare.com/v2/css?f[]=neue-montreal@400,500,700&display=swap */

--text-hero:  72px / weight 500 / line-height 1.05 / letter-spacing -3px
--text-h2:    48px / weight 500
--text-h3:    28px / weight 500
--text-body:  18px / weight 400
--text-label: 12px / weight 600 / letter-spacing 2px / uppercase
```

### Layout
```css
--container-max: 1440px
--content-max:   1280px
/* Sistema 8pt: 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 */
```

**Firma visual:** antorcha flotante + glow naranja. Cards oscuras estilo Linear.
70% negro · 20% naranja · 10% blanco. Mucho espacio negativo.

---

## Estructura de la página (orden fijo — no reordenar)

```
01  #hero        Promesa + subpromesa + eyebrow + escena 3D
02  #vsl         Oculto con CSS (display: none) — no eliminar el HTML
03  #cta-1       Botón principal → formulario.html
04  #problema    Qué problema resolvemos
05  #para-quien  Para quién es esto
06  #cta-2       Botón → scroll a #cta-1
07  #casos       Casos reales de éxito
08  #equipo      Quiénes somos (fotos reales)
09  #cta-3       Botón → scroll a #cta-1
10  #faq         Preguntas frecuentes (accordion)
11  #cta-4       Botón final → scroll a #cta-1
12  #footer      Links + redes + legal
```

---

## Formulario — 9 preguntas

| # | Campo DB | Tipo | Obligatorio | Comportamiento |
|---|----------|------|-------------|----------------|
| P1 | `whatsapp` | Input tel | Sí | Selector país + número (≥7 dígitos) |
| P2 | `tipo_negocio` | Single select | Sí | Auto-avance 350ms |
| P3 | `rubro` + `rubro_otro` | Single select | Sí | "Otro" → input texto, sin auto-avance |
| P4 | `tamano_equipo` | Single select | Sí | Auto-avance 350ms |
| P5 | `etapa_crecimiento` | Single select | Sí | Auto-avance 350ms |
| P6 | `ingresos_mensuales` | Single select | No | Auto-avance 350ms · badge "Opcional" |
| P7 | `caos_operativo` | Multi (máx 2) | Sí | Sin auto-avance · feedback al intentar 3ra opción |
| P8 | `intento_previo` | Single select | Sí | Auto-avance 350ms |
| P9 | `puede_decidir` | Single select | Sí | Sin auto-avance · botón "Enviar y agendar →" |

**UX:** transición Y-axis · shake + error inline · spinner en submit · conserva respuestas si falla

---

## Backend — Estructura

```
/backend
├── server.js           ← Entry point Express
├── package.json
├── users.js            ← Usuarios hardcodeados con bcrypt hashes
├── .env                ← DATABASE_URL + PORT + JWT_SECRET (NO commitear)
├── .env.example
├── .gitignore
├── db/
│   ├── pool.js         ← Pool pg con SSL Railway (rejectUnauthorized: false)
│   └── schema.sql      ← CREATE TABLE leads_prereunion
├── middleware/
│   └── authMiddleware.js ← Verifica Bearer JWT en rutas protegidas
└── routes/
    ├── auth.js         ← POST /api/auth/login → JWT
    └── leads.js        ← CRUD leads (POST público, GET/PUT/DELETE protegidos)
```

### Endpoints
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | — | Health check → "OK" |
| GET | `/api/health` | — | `SELECT NOW()` → `{ ok, db_time }` |
| POST | `/api/auth/login` | — | `{ username, password }` → `{ success, token, username }` |
| POST | `/api/leads` | — | Inserta lead → `{ success, id }` |
| GET | `/api/leads` | JWT | Lista todos los leads → `{ success, leads[] }` |
| GET | `/api/leads/:id` | JWT | Detalle de un lead |
| PUT | `/api/leads/:id` | JWT | Actualiza `estado` → `{ success }` |
| DELETE | `/api/leads/:id` | JWT | Elimina lead → `{ success }` |

### Tabla `leads_prereunion`
```sql
id, nombre (nullable), negocio (nullable), email (nullable),
whatsapp, tipo_negocio, rubro, rubro_otro (nullable),
tamano_equipo, etapa_crecimiento, ingresos_mensuales (nullable),
caos_operativo (jsonb), intento_previo, puede_decidir,
estado (default 'nuevo'), created_at
```

### Auth
- **Usuarios:** hardcodeados en `users.js` (bcrypt hash, salt 10) — matto, nico, leo
- **JWT:** `process.env.JWT_SECRET`, `expiresIn: '8h'`
- **Guard:** `middleware/authMiddleware.js` → lee `Authorization: Bearer <token>`

---

## Archivos del proyecto

```
Landing-Page-Lumen-Labs/
├── index.html                      ← Landing page principal
├── formulario.html                 ← Formulario pre-reunión (9 preguntas)
├── gracias.html                    ← Confirmación post-agendamiento
├── login.html                      ← Admin login (glass card, JWT auth)
├── admin.html                      ← Admin panel (sidebar, tabla leads, modal)
├── CLAUDE.md                       ← Este archivo
├── GLASS_KIT.md                    ← Referencia glass (solo CSS/tokens)
├── imagen_hero_de_referencia.PNG
├── netlify.toml
├── _redirects
└── assets/
    ├── Lumen_Horizontal_logo.png
    ├── Lumen_Horizontal_logo2.png  ← logo principal (navbar + footer)
    ├── Lumen_isotipo.png           ← favicon
    ├── assets_3D_Hero/
    │   ├── plataforma.png
    │   └── torch.png
    ├── nico.jpeg
    ├── matias.png
    └── leo.jpeg

backend/
├── server.js
├── package.json
├── users.js                        ← Usuarios hardcodeados (bcrypt hashes)
├── .env                            ← NO en git
├── .env.example
├── .gitignore
├── db/
│   ├── pool.js
│   └── schema.sql
├── middleware/
│   └── authMiddleware.js           ← Guard JWT para rutas protegidas
└── routes/
    ├── auth.js                     ← POST /api/auth/login
    └── leads.js                    ← CRUD /api/leads
```

---

## Constraints absolutas

1. **`formulario.html` es el único punto de conversión.** Todos los CTAs del landing abren `formulario.html`. CTAs secundarios hacen scroll a `#cta-1`.
2. **Post-submit → redirect a Calendly** (`https://calendly.com/elgranh/reuniones-1-a-1`).
3. **Backend siempre CommonJS.** Nunca `import`/`export`. Nunca hardcodear credenciales.
4. **Glass effect siempre con `backdrop-filter` real.** Nunca simular con opacidad.
5. **GSAP ScrollTrigger** solo para elementos DOM. Nunca tocar el Canvas 3D del hero.
6. **Sin librerías extra** (no Bootstrap, no Tailwind, no Alpine). CSS y JS vanilla.
7. **Mobile breakpoint:** `@media (max-width: 768px)` en landing. `@media (max-width: 767px)` en formulario.
8. **Navbar:** logo fuera de la pill · pill centrada con links · botón CTA derecha (solo desktop).

---

## Cómo correr en local

```bash
# Frontend
cd Landing-Page-Lumen-Labs
npx serve . -l 5500

# Backend
cd backend
npm run dev

# Verificar DB
curl http://localhost:3000/api/health
```

---

## Skills — cuándo invocarlas

| Situación | Skill | Cuándo NO |
|-----------|-------|-----------|
| Sección nueva desde cero, tipografía, layout | `@frontend-design` | Fixes CSS puntuales |
| Flujo UX, conversión, microcopy, accesibilidad | `@ux-ui-pro-max` | Cambios estructurales simples |
| Glass effect nuevo o mejorado | `@GLASS_KIT.md` | Si el token ya existe en el design system |

---

## Estado del proyecto — Lista de tareas

### FASE 1 — Base ✅
- [x] Scaffolding `index.html` (CSS variables, reset, fuentes)
- [x] `gracias.html` (confirmación post-agendamiento, sin Calendly embed)
- [x] Navbar pill flotante (glass, indicator deslizante, logo, CTA)

### FASE 2 — Hero + conversión ✅
- [x] `#hero` (headline, escena 3D, antorcha flotante, botones)
- [x] `#vsl` (oculto con CSS · HTML intacto)
- [x] `#cta-1` (botón → formulario.html)

### FASE 3 — Contenido ✅
- [x] `#problema` (glassmorphism cards, 3 pain points)
- [x] `#para-quien` (columnas SÍ/NO)
- [x] `#cta-2` (botón → #cta-1)
- [x] `#casos` (layout asimétrico sticky, 3 casos con números)
- [x] `#equipo` (fotos reales: nico, matias, leo + nombres y roles)
- [x] `#cta-3` (botón → #cta-1)

### FASE 4 — Cierre ✅
- [x] `#faq` (accordion, 7 preguntas)
- [x] `#cta-4` (botón final)
- [x] `#footer` (links, redes, legal)
- [x] Hero 3D CSS+Canvas (plataforma, antorcha flotante, glow)
- [x] Animaciones GSAP ScrollTrigger — revisión global ✅
- [x] Revisión mobile completa (768px) ✅

### FASE 5 — Formulario + Backend ✅
- [x] `formulario.html` (9 preguntas, Typeform-style, transiciones Y-axis)
- [x] Selector código de país (14 países LATAM + EE.UU. + España)
- [x] Validación + auto-avance + multi-select P7 + shake error
- [x] Submit spinner → POST `/api/leads` → redirect Calendly
- [x] Backend Node.js + Express + PostgreSQL Railway
- [x] `GET /api/health` · `POST /api/leads` · queries parametrizados
- [x] Tabla `leads_prereunion` creada en Railway
- [x] **Linkear todos los CTAs del landing a `formulario.html`**
- [x] Deploy backend en Railway ✅
- [x] Actualizar `API_URL` en `formulario.html` al endpoint Railway ✅
- [x] Formulario → Railway conectado: leads llegan a la DB ✅
- [x] Panel admin: login.html + admin.html + endpoints protegidos ✅
- [x] Restringir CORS al dominio Netlify en producción ✅
- [x] Deploy Netlify + dominio ✅
- [x] Pestaña Estadísticas: GET /api/stats + 7 gráficos Chart.js ✅

---

## Bugs conocidos / advertencias activas

- ⚠️ Connection string de Railway estuvo expuesta en el chat — considerar rotar la contraseña
- ⚠️ Connection string de Railway estuvo expuesta en el chat — considerar rotar la contraseña

---

## Sesión actual — próxima tarea

**Completado:** Auth JWT ✅ · Panel admin ✅ · CORS restringido a Netlify ✅ · Pestaña Estadísticas (Chart.js, 7 gráficos, GET /api/stats) ✅
**Pendiente:** —
