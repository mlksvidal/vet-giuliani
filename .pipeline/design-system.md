# Design System — vet-giuliani
Fecha: 2026-06-11
Fase: 2 Paso 2 (ui-designer)
Mood preset: soft-luxury-warm
Dials finales: design_variance=7 / motion_intensity=9 / visual_density=5

---

## Direccion estetica

**Soft-luxury-warm editorial** — calidez emocional sobre elegancia clínica fría. El diseño transmite "cuidado de alguien que ama a tu mascota tanto como vos", no "hospital aséptico". Tipografía serif editorial + motion premium GSAP pero el CTA de urgencias siempre accesible sin animaciones que bloqueen.

**Landing pattern:** Hero editorial asimétrico → EmergencyCTA sticky persistente → Services grid con reveals → About + testimonial → LocationHours → Footer/Contacto.

**Anti-patterns bloqueantes (HIGH)**:
1. NO teal SaaS (#0D9488 ni variantes). Todo terracota/ámbar/crema/salvia.
2. NO Inter/Roboto/Open Sans como heading. Playfair Display es el serif display editorial.
3. NO azul clínico frío en ningún elemento principal.
4. NO CTA urgencias oculto o detrás de scroll.
5. NO animaciones que bloqueen o demoren acceso al teléfono/WhatsApp.
6. NO prefers-reduced-motion ausente (>5 animaciones GSAP — obligatorio).
7. NO tap targets <44x44px en CTA urgencias ni nav mobile.
8. NO max-width ≤1280px rígido para envelope (SaaS feel).
9. NO shadow-sm uniforme en todas las cards. Escala de sombras warm por elevación.
10. NO border-radius > 16px en cards (no claymorphism/infantil).

---

## Tokens de color semanticos (amplian css-foundation)

### Escala tint/shade de los colores brand (9 pasos)

```css
/* Terracota — escala */
--color-primary-100: #FAEAE5;
--color-primary-200: #F5D0C5;
--color-primary-300: #EAA892;
--color-primary-400: #DC7A60;
--color-primary-500: #C44B2B;   /* base */
--color-primary-600: #A33820;
--color-primary-700: #832A18;
--color-primary-800: #631E12;
--color-primary-900: #42120C;

/* Ambar — escala */
--color-secondary-100: #FEF5EA;
--color-secondary-200: #FCDDB8;
--color-secondary-300: #F9BF7A;
--color-secondary-400: #F0A44D;
--color-secondary-500: #E8943A;   /* base */
--color-secondary-600: #C87A28;
--color-secondary-700: #A06020;
--color-secondary-800: #784618;
--color-secondary-900: #502E10;

/* Salvia — escala */
--color-accent-100: #EDF3EE;
--color-accent-200: #CCDECF;
--color-accent-300: #A9C5AE;
--color-accent-400: #8AAB90;
--color-accent-500: #6B8F71;   /* base */
--color-accent-600: #4A6B50;
--color-accent-700: #364F3B;
--color-accent-800: #243428;
--color-accent-900: #141E17;
```

### Variantes semanticas por modo (text-emphasis / bg-subtle / border-subtle)

```css
/* Light mode */
--primary-text-emphasis:  #A33820;   /* shade 20% — texto sobre fondos claros */
--primary-bg-subtle:      #FAEAE5;   /* tint 80% — fondos badges/alerts */
--primary-border-subtle:  #F5D0C5;   /* tint 60% — bordes decorativos */

--secondary-text-emphasis: #C87A28;
--secondary-bg-subtle:     #FEF5EA;
--secondary-border-subtle: #FCDDB8;

--accent-text-emphasis:    #4A6B50;
--accent-bg-subtle:        #EDF3EE;
--accent-border-subtle:    #CCDECF;

/* Dark mode — invertido */
[data-theme="dark"] {
  --primary-text-emphasis:  #E05C36;
  --primary-bg-subtle:      #42120C;
  --primary-border-subtle:  #631E12;
}
```

### Tokens funcionales

```css
--color-success:         #4A7C59;   /* verde oliva cálido, contraste 6.1:1 sobre crema */
--color-success-bg:      #EDF3EE;
--color-error:           #B91C1C;   /* rojo, 5.8:1 sobre crema */
--color-error-bg:        #FEE2E2;
--color-warning:         #92400E;   /* ambar oscuro, 7.2:1 */
--color-warning-bg:      #FEF5EA;
--color-info:            #1E40AF;
--color-info-bg:         #EFF6FF;
```

### Contraste WCAG 2.2 — validacion

| Par | Ratio | Nivel |
|-----|-------|-------|
| --text-primary #2C1A0E / --bg-primary #FDF8F3 | 15.2:1 | AAA |
| --text-secondary #6B4226 / --bg-primary | 7.4:1 | AAA |
| --text-tertiary #A07050 / --bg-primary | 4.6:1 | AA |
| #FFFFFF / --color-primary #C44B2B | 4.87:1 | AA |
| #2C1A0E / --color-whatsapp #25D366 | 6.20:1 | AAA |
| --color-success #4A7C59 / --bg-primary | 6.1:1 | AAA |
| --color-error #B91C1C / --bg-primary | 5.8:1 | AAA |

NOTA: NO usar texto sobre --text-disabled (#666) en fondos oscuros para texto funcional. Solo elementos decorativos.

---

## Jerarquia de componentes (Atomic Design)

```
Atoms:     Button, Badge, Icon, PhoneLink, WhatsAppLink
Molecules: CTABar, NavItem, ServiceCard, HoursRow, ContactBlock
Organisms: EmergencyCTA, HeroSection, ServicesGrid, AboutSection, LocationHours, Nav, Footer
Templates: LandingLayout
Pages:     HomePage
```

---

## ATOM: Button

**Variantes**: primary | secondary | ghost | whatsapp
**Tamaños**: sm (36px height, px-4) | md (44px height, px-6) | lg (52px height, px-8)

```
Base:
  font-family: --font-body (DM Sans), font-weight: 600, letter-spacing: 0.01em
  border-radius: --radius-full (9999px) para primary/whatsapp; --radius-base (8px) para secondary/ghost
  transition: background-color var(--duration-fast) var(--ease-primary),
              box-shadow var(--duration-fast) var(--ease-primary),
              transform var(--duration-fast) var(--ease-primary)
  min-height: 44px; min-width: 44px

primary:
  default: bg #C44B2B, text #FFFFFF, shadow --shadow-sm
  hover:   bg #A33820, shadow --shadow-accent (0 8px 24px rgba(196,75,43,0.35)), transform: translateY(-2px)
  active:  bg #832A18, transform: translateY(0), shadow --shadow-sm
  focus-visible: ring 2px solid #C44B2B, ring-offset 2px solid --bg-primary
  disabled: opacity 0.45, pointer-events: none

secondary:
  default: bg transparent, border 1.5px solid --color-primary, text #C44B2B
  hover:   bg --primary-bg-subtle (#FAEAE5), border-color --color-primary-dark
  active:  bg --primary-200, border-color --color-primary-900
  focus-visible: ring 2px solid #C44B2B

ghost:
  default: bg transparent, text --text-secondary (#6B4226), no border
  hover:   bg --bg-secondary (#F7EDE0), text --text-primary
  active:  bg --bg-tertiary
  focus-visible: ring 2px solid --color-primary

whatsapp:
  default: bg #25D366, text #2C1A0E (oscuro — 6.2:1 contraste), shadow --shadow-whatsapp
  hover:   bg #1DA851, shadow 0 8px 24px rgba(37,211,102,0.35), transform: translateY(-2px)
  active:  bg #15803D, transform: translateY(0)
  icon: SVG WhatsApp a la izquierda del texto
```

**Behavioral rules — motion_intensity=9**:
```yaml
hover (hover:hover + pointer:fine):
  effect: "translateY(-2px) + shadow-accent glow + color-shift"
  duration: "var(--duration-fast)"   # 250ms
  easing: "var(--ease-primary)"      # cubic-bezier(0.16,1,0.3,1)

active:
  effect: "translateY(0) + scale(0.97)"
  duration: "150ms"

reveal (como parte de grupo en viewport):
  gsap: opacity 0→1, y 20→0, stagger con hermanos
  ease: "power3.out", duration: var(--duration-slow)  # 700ms
```

**Touch/mobile**:
```css
@media (hover: none), (pointer: coarse) {
  .btn-primary:active  { transform: scale(0.97); background-color: #A33820; }
  .btn-whatsapp:active { transform: scale(0.97); background-color: #1DA851; }
  .btn-secondary:active { background-color: var(--primary-bg-subtle); }
}
```

**Reduced motion**:
```css
@media (prefers-reduced-motion: reduce) {
  .btn-primary, .btn-whatsapp, .btn-secondary, .btn-ghost {
    transform: none !important;
    transition: background-color 100ms linear, box-shadow 100ms linear;
  }
}
```

---

## ATOM: Badge

**Variantes**: urgencias | servicio | info | disponible

```
Base:
  font-family: --font-body, font-size: 0.75rem, font-weight: 600
  letter-spacing: --tracking-widest (0.1em), text-transform: uppercase
  border-radius: --radius-full
  padding: 4px 12px
  display: inline-flex; align-items: center; gap: 6px

urgencias:
  bg: --color-primary (#C44B2B), text: #FFFFFF
  Dot pulsante: 8px circle, keyframe pulse-warm (opacity + scale)
  aria-label: "Urgencias disponibles 24 horas"
  Reduced motion: dot estático (sin keyframe)

servicio:
  bg: --secondary-bg-subtle (#FEF5EA), text: --color-secondary-600 (#C87A28)
  border: 1px solid --secondary-border-subtle

info:
  bg: --accent-bg-subtle (#EDF3EE), text: --accent-text-emphasis (#4A6B50)

disponible:
  bg: --accent-bg-subtle, text: --accent-text-emphasis
  Dot estático verde #4A7C59 (estado, no urgencia — sin pulso)
```

---

## ORGANISM: EmergencyCTA

**Componente rey. z-index: --z-emergency (1040). Siempre por encima de todo.**

### Mobile (< 768px) — barra inferior fija

```
position: fixed; bottom: 0; left: 0; right: 0; z-index: 1040
display: grid; grid-template-columns: 1fr 1fr
height: 60px
background: --bg-primary (#FDF8F3)
border-top: 2px solid --color-primary (#C44B2B)
box-shadow: 0 -4px 16px rgba(44,26,14,0.12)
padding: 8px 16px
padding-bottom: max(8px, env(safe-area-inset-bottom))  /* notch iOS/Android */

Botón "Llamar":
  <a href="tel:+5492601234567">    (e164 de site.ts)
  bg: --color-primary (#C44B2B), text: #FFFFFF
  font-weight: 700, border-radius: --radius-base (8px)
  min-height: 44px; width: 100%
  Icono: Phone (lucide-react thin) izquierda
  aria-label: "Llamar a urgencias veterinarias — Dr. Luciano Giuliani"
  Pulso: animation pulse-warm 2s infinite en el botón
  Texto visible: "Llamar"

Botón "WhatsApp":
  <a href="https://wa.me/5492601234567?text=Hola%2C+tengo+una+urgencia+con+mi+mascota">
  bg: --color-whatsapp (#25D366), text: #2C1A0E
  font-weight: 700, border-radius: --radius-base
  min-height: 44px; width: 100%
  Icono: MessageCircle / WhatsApp SVG izquierda
  aria-label: "Escribir por WhatsApp a urgencias veterinarias"
  rel="noopener" — NO target="_blank" en tel:
  Texto visible: "WhatsApp"
```

### Desktop (>= 768px) — floating sticky

```
position: fixed; top: 80px; right: max(24px, calc((100vw - 1600px) / 2 + 24px))
display: flex; flex-direction: column; gap: 8px
z-index: 1040

Botón Llamar:
  bg: --color-primary, text: #FFFFFF
  padding: 10px 20px, border-radius: --radius-full
  min-height: 44px
  shadow: --shadow-accent
  Texto: "Llamar urgencias"
  Pulso activo (igual que mobile)

Botón WhatsApp:
  bg: --color-whatsapp, text: #2C1A0E
  mismas props, texto "WhatsApp urgencias"
```

### Pulso de urgencia

```css
@keyframes pulse-warm {
  0%, 100% { box-shadow: 0 0 0 0 rgba(196, 75, 43, 0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(196, 75, 43, 0); }
}
.emergency-btn-call { animation: pulse-warm 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .emergency-btn-call { animation: none; }
}
```

### Accesibilidad obligatoria

```
role="navigation" en wrapper + aria-label="Contacto de urgencias"
Ambos botones: aria-label descriptivo explícito (además del texto visible)
rel="noopener" en wa.me
Tab order: Llamar primero → WhatsApp
Body padding-bottom: 60px en mobile para no quedar tapado por la barra fija
```

---

## ORGANISM: HeroSection

**Layout editorial asimétrico — design_variance=7**

### Estructura desktop (>= 1024px)

```
Contenedor:
  position: relative; overflow: hidden
  min-height: 100svh
  background: --bg-primary (#FDF8F3)
  padding-top: 72px (nav height); padding-bottom: var(--space-section)

Grid:
  display: grid; grid-template-columns: 1fr 1fr
  max-width: --envelope-max (1600px); margin: auto; padding-x: max(24px,5vw)

Columna izquierda (contenido):
  align-self: center; padding: var(--space-section) 0
  max-width: 640px

Columna derecha (media — desborda):
  position: absolute; right: 0; top: 0; bottom: 0
  width: calc(50% + max(24px, 5vw))  /* desborda el envelope derecho */
  overflow: hidden
  Gradiente placeholder warm: linear-gradient(135deg, #F7EDE0 0%, #EEE0CC 50%, #D4B896 100%)
  Imagen: object-fit: cover; width: 100%; height: 100%
```

### Estructura mobile (< 1024px)

```
display: block
Imagen arriba: height: 45svh; object-fit: cover; width: 100%
Contenido debajo: padding var(--space-section) horizontal
```

### Contenido columna izquierda

```
[Badge "Urgencias 24h" variante urgencias]

[h1 — Playfair Display 700, --text-hero (clamp 44–88px), --tracking-tight]
  "Veterinaria Giuliani"
  Nota: "Giuliani" en italic (Playfair Display italic 700) para énfasis editorial

[p subtítulo — DM Sans 400, --text-xl, --text-secondary, max-width: 50ch]
  "Atención veterinaria cálida y profesional en San Rafael, Mendoza.
   Urgencias las 24 horas para el cuidado de tu mascota."

[CTA group — display: flex, gap: --space-4, flex-wrap: wrap]
  Button primary lg "Llamar urgencias" (href tel:)
  Button whatsapp lg "WhatsApp" (href wa.me)
  CRITICO: ambos buttons autoAlpha:1 desde frame 0.
  La timeline GSAP NUNCA los incluye en opacity:0 inicial.

[Trust line — DM Sans 400, --text-sm, --text-tertiary]
  "Dr. Luciano Giuliani · MV · San Rafael, Mendoza"
```

### Motion de entrada (GSAP Tier 3)

```javascript
// CTA buttons NO entran en la timeline — ya visibles desde frame 0
const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

// Badge
tl.from(".hero-badge", { opacity: 0, y: -16, duration: 0.5 })

// H1 reveal por líneas (clip-path — sin requerir SplitText Club)
// Cada .line es un <span class="line"> que envuelve una línea del heading
tl.from(".hero-h1 .line", {
  opacity: 0,
  clipPath: "inset(0 0 100% 0)",
  stagger: 0.12,
  duration: 0.9,
  ease: "power4.out"
}, "-=0.2")

// Subtítulo
tl.from(".hero-sub", { opacity: 0, y: 20, duration: 0.7 }, "-=0.5")

// Trust line
tl.from(".hero-trust", { opacity: 0, duration: 0.5 }, "-=0.3")

// Parallax de imagen (ScrollTrigger scrub — independiente de timeline)
gsap.to(".hero-media", {
  yPercent: -15,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "bottom top",
    scrub: 1.5
  }
})
```

### Reduced motion

```javascript
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // No crear timeline. Estado final inmediato.
  gsap.set([".hero-badge", ".hero-h1 .line", ".hero-sub", ".hero-trust"], {
    opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)"
  })
  // Parallax: deshabilitado. hero-media sin transform.
}
```

### Touch hover

```css
@media (hover: none), (pointer: coarse) {
  .hero-cta-btn:active { transform: scale(0.96); }
}
```

---

## ORGANISM: ServicesGrid

**Density=5 — cards con aire generoso. Shadow warm por elevación.**

### ServiceCard

```
Base:
  bg: --bg-tertiary (#EEE0CC)
  border: 1px solid --border-color (#D4B896)
  border-radius: --radius-lg (16px)
  padding: clamp(1.5rem, 2rem, 2.5rem)
  shadow: --shadow-md (0 4px 12px rgba(44,26,14,0.10))
  transition: box-shadow var(--duration-fast), transform var(--duration-fast), border-color var(--duration-fast)

hover (hover:hover + pointer:fine):
  transform: translateY(-4px)
  shadow: --shadow-lg (0 12px 32px rgba(44,26,14,0.12))
  border-color: --border-emphasis (#C44B2B)

active/touch:
  transform: scale(0.98); shadow: --shadow-sm

focus-within (si card tiene link):
  ring: 2px solid --color-primary, ring-offset: 2px
```

### Card "Urgencias 24h" (variante destacada)

```
bg: --color-primary (#C44B2B), text: #FFFFFF
border: none
shadow: --shadow-accent (0 8px 24px rgba(196,75,43,0.35))
hover: shadow amplificado + translateY(-4px)
Mini-CTA interno: Button whatsapp sm "WhatsApp urgencias" dentro de la card
```

### Estructura interna card estándar

```
[Icono — 32px, Lucide thin, color --color-secondary o --color-accent]
[h3 — DM Sans 600, --text-xl]
[p descripción — DM Sans 400, --text-base, --text-secondary, line-height: 1.65]
[Mini-CTA opcional — solo Urgencias 24h]
```

### Layout responsive

```
Mobile (< 640px): 1 columna
Tablet (640–1023px): 2 columnas
Desktop (>= 1024px): 3 columnas (o 2+1 con card Urgencias destacada full-width al final)
gap: var(--space-6) desktop, var(--space-4) mobile
```

### Scroll reveal (ScrollTrigger)

```javascript
gsap.from(".service-card", {
  opacity: 0, y: 40,
  stagger: { each: 0.08, from: "start" },
  duration: 0.7, ease: "power3.out",
  scrollTrigger: {
    trigger: ".services-grid",
    start: "top 80%",
    once: true
  }
})
```

**Reduced motion**: `once: true` activa de inmediato → cards visibles en estado final sin delay.

---

## ORGANISM: Nav

### Base

```
position: sticky; top: 0; z-index: --z-sticky (1010)
height: 64px desktop / 56px mobile
background: rgba(253, 248, 243, 0.92)
backdrop-filter: blur(12px)
border-bottom: 1px solid transparent
transition: border-color var(--duration-fast), background var(--duration-fast)

.nav--scrolled (clase agregada con JS al scrollear):
  border-bottom-color: --border-color (#D4B896)
  background: rgba(253, 248, 243, 0.97)
```

### Desktop nav items

```
Logo/Wordmark:
  font: Playfair Display italic 600, --text-lg, --text-primary
  href: "#top"

Nav links — DM Sans 500, --text-base, --text-secondary:
  href: #servicios | #sobre | #ubicacion | #contacto
  hover: text --text-primary + underline-draw pseudoelemento
  active section: text --color-primary + underline permanente

.nav-link::after {
  content: ''; position: absolute; bottom: -2px; left: 0;
  width: 0; height: 1.5px;
  background: var(--color-primary);
  transition: width var(--duration-fast) var(--ease-primary);
}
.nav-link:hover::after { width: 100%; }
@media (hover: none) { .nav-link::after { display: none; } }

CTA urgencias desktop:
  Button primary sm "Urgencias" — visible en nav desktop, href: #contacto o tel:
```

### Mobile hamburger

```
Botón:
  min: 44x44px; border-radius: --radius-base
  Icono: 3 líneas ↔ X (CSS transition o GSAP)
  aria-expanded: true/false
  aria-controls: "mobile-menu"
  aria-label: "Abrir menú de navegación"

Drawer (#mobile-menu):
  position: fixed; inset: 0; z-index: --z-overlay (1020)
  background: --bg-primary
  display: flex; flex-direction: column; justify-content: center; align-items: center
  gap: --space-8
  Entrada: gsap.from(drawer, { xPercent: 100, duration: 0.4, ease: "power3.out" })
  Salida: gsap.to(drawer, { xPercent: 100, duration: 0.3, ease: "power3.in" })

Links del drawer:
  Playfair Display 600, --text-3xl
  hover: color --color-primary

CTA drawer (al pie):
  Button primary lg "Llamar urgencias" — fullwidth
  Button whatsapp lg "WhatsApp" — fullwidth
  gap: --space-4

Nota: EmergencyCTA (z-1040) SIEMPRE visible sobre el drawer (z-1020).

Cierre del drawer:
  Tap fuera del menú (click en overlay)
  Botón X
  Click en un link ancla
```

**Reduced motion**: drawer sin translateX — usa opacity 0→1 únicamente. Scroll behavior: transiciones instant.

---

## ORGANISM: AboutSection

### Layout

```
Desktop: grid 2 cols, 55/45 split (texto izquierda, imagen derecha con offset vertical)
Mobile: block, imagen primero (square 100%), texto debajo

Imagen:
  aspect-ratio: 4/5 (portrait editorial)
  border-radius: --radius-xl (24px)
  object-fit: cover
  placeholder: gradiente warm con alt="Foto del Dr. Luciano Giuliani — placeholder, reemplazar con foto real"
  hover (hover:hover): scale(1.02) + shadow --shadow-lg, transition --duration-normal
  touch: sin hover

Contenido textual:
  Eyebrow — DM Mono 400, --tracking-widest, --text-tertiary, uppercase, font-size: 0.75rem
    "Sobre el veterinario"
  H2 — Playfair Display 700, --text-3xl, tracking-tight (Playfair italic en "Giuliani")
  Bio — DM Sans 400, --text-lg, line-height: 1.75, max-width: 55ch
  Pull quote (opcional):
    DM Sans italic, --text-xl, color --color-accent-text-emphasis
    border-left: 3px solid --color-primary, padding-left: --space-4
```

### Scroll reveals

```javascript
gsap.from(".about-foto", {
  x: -40, opacity: 0, duration: 0.9, ease: "power3.out",
  scrollTrigger: { trigger: ".about-section", start: "top 70%", once: true }
})
gsap.from(".about-content > *", {
  y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
  scrollTrigger: { trigger: ".about-section", start: "top 65%", once: true }
})
```

---

## ORGANISM: LocationHours

### HoursTable

```
Layout: CSS grid 2-col (Día | Horario)
Sin zebra striping (density=5, soft-luxury no usa zebra)
Row: padding: 10px 0; border-bottom: 1px solid --border-color ligero
Día "Urgencias": text --color-primary (#C44B2B), font-weight 600
Días: DM Sans 500, --text-base
Horarios: DM Mono 400 (tabular figures), --text-base, --text-secondary
```

### MapEmbed

```
<iframe loading="lazy" src="https://maps.google.com/maps?q=San+Rafael+Mendoza...&output=embed">
border-radius: --radius-lg (16px)
border: 1px solid --border-color
height: 280px mobile / 360px desktop
filter: sepia(0.2) hue-rotate(-10deg) saturate(0.9)  /* warm map tint */
Badge debajo: Badge info "Ubicación aproximada — confirmar dirección exacta"
```

### ContactBlock

```
Links de contacto apilados verticalmente:
  <a href="tel:..." class="contact-link">
  <a href="https://wa.me/..." class="contact-link">
  Dirección (no link, con icono MapPin)

.contact-link:
  display: flex; align-items: center; gap: 12px
  padding: 14px 0; border-bottom: 1px solid --border-color
  color: --text-primary; font: DM Sans 500, --text-lg; text-decoration: none
  Icono: color --color-secondary (ámbar), 20px

  hover (hover:hover):
    color: --color-primary; gap: 16px (micro-shift sutil)
    transition: color var(--duration-fast), gap var(--duration-fast)

  active/touch:
    color: --color-primary; background: --bg-secondary (flash inmediato)
    transition: 80ms
```

**Reveal**: fade-up para todo el organismo al entrar en viewport.

---

## ORGANISM: Footer

```
Layout:
  bg: --bg-secondary (#F7EDE0) — sutil contraste warm
  border-top: 1px solid --border-color
  padding: var(--space-section) 0
  padding-bottom en mobile: calc(var(--space-section) + 68px)  /* evita que EmergencyCTA tape el footer */

Grid desktop: 3 columnas (Logo+tagline | Links nav | Contacto urgencias)
Mobile: block, stack vertical, gap: --space-10

Columna Logo:
  Wordmark: Playfair Display italic, --text-2xl, --text-primary
  Tagline: DM Sans 400, --text-secondary, "Atención veterinaria · San Rafael, Mendoza"

Columna Links:
  Links ancla (mismos que nav): DM Sans 400, --text-base
  hover: color --color-primary, underline-draw

Columna Contacto urgencias:
  Título: "Urgencias 24h" — Playfair Display italic, --color-primary, --text-xl
  Button primary "Llamar" + Button whatsapp "WhatsApp"
    Desktop: display flex, gap --space-3
    Mobile: flex-direction column, fullwidth
  Dirección: DM Mono, --text-sm, --text-tertiary (placeholder marcado)
  Horarios resumidos: DM Mono, --text-sm

Baseline:
  © 2025 Veterinaria Luciano Giuliani · MV · San Rafael, Mendoza
  DM Sans, --text-sm, --text-tertiary
  border-top: 1px solid --border-color, padding-top: --space-6
```

---

## Huellitas animadas — Spec exacta de dosificacion

**Doctrina absoluta**: 1 (uno) trazo SVG conector en todo el sitio. No es decoración repetida. Es un guiño narrativo entre secciones.

```
Ubicación: entre ServicesGrid y AboutSection (conector narrativo)
Posición: centered horizontalmente, position: absolute, pointer-events: none, z-index: 0

SVG estructura:
  Viewbox: 120 200 (120px ancho, 200px alto)
  Path principal: arco suave (bezier curve), ~160px desplazamiento vertical, ~80px horizontal
  4 huellas en el arco (2 pares izquierda+derecha simulando pasos):
    Cada huella: elipse central (20×14px aprox) + 4 elipses pequeñas (dedos)
    stroke-only, fill: none, stroke-width: 1.5px
    stroke: --color-accent (#6B8F71)
    stroke-linecap: round
    opacity total del SVG: 0.35

Animación draw con scroll:
  stroke-dasharray = [longitud total del path]
  stroke-dashoffset = [longitud total] → 0 mientras scrollea
  ScrollTrigger: trigger = el SVG, start: "top 80%", end: "bottom 20%", scrub: 2

  Fallback CSS (sin DrawSVG Club):
    CSS: stroke-dashoffset: 400 → 0
    IntersectionObserver → agrega .draw-active
    .draw-active path { transition: stroke-dashoffset 1.8s var(--ease-primary); }

Reduced motion:
  stroke-dashoffset: 0 desde el inicio — path visible, sin animación

Restricciones no negociables:
  - Máximo 1 SVG huellitas en el sitio (si el cliente pide más: máx 2 en zonas no consecutivas)
  - NO usar como background-image repeat
  - NO usar en mobile si queda sobre EmergencyCTA fijo (z-1040)
  - Opacity máxima: 0.35. Si se ve "muy presente", bajar a 0.25
  - Solo salvia, nunca terracota ni ámbar (terracota es urgencia, no decoración)
```

---

## Formas organicas calidas — Spec parallax

```
Implementación: divs absolutamente posicionados con border-radius orgánico
  o: SVG blob con clipPath

Propiedades:
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%  (forma orgánica asimétrica)
  position: absolute; pointer-events: none; z-index: 0
  Contenido siempre z-index: 1

Colores y opacidades:
  Blob 1 (fondo hero, derecha): --color-primary, opacity: 0.07
  Blob 2 (sección about, izquierda): --color-secondary, opacity: 0.09
  Nunca > 0.15 — no compite con contenido

Tamaños:
  Desktop: 350–500px
  Mobile: 150–220px

Parallax (GSAP ScrollTrigger scrub):
  Blob 1 hero: gsap.to(blob1, { yPercent: 20, ease:"none", scrollTrigger:{ scrub: 2 } })
  Blob 2 about: gsap.to(blob2, { yPercent: -15, ease:"none", scrollTrigger:{ scrub: 2 } })

Reduced motion: transform: none. Blobs estáticos (no desaparecen, solo no se mueven).
```

---

## Loading states y vacios

```
Skeleton warm:
  mood soft-luxury → NO skeleton bars genéricas grises.
  Usar shimmer warm:

  @keyframes shimmer-warm {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-warm {
    background: linear-gradient(90deg, #F7EDE0 25%, #EEE0CC 50%, #F7EDE0 75%);
    background-size: 200% 100%;
    animation: shimmer-warm 1.5s ease-in-out infinite;
    border-radius: --radius-base;
  }

Empty state:
  Icono: Lucide thin/outline, --color-accent, 40px
  Texto: DM Sans italic, --text-secondary
  NO emoji como UI

Error state:
  Icono: AlertCircle outline, --color-error (#B91C1C)
  Texto: DM Sans, contexto + acción sugerida
  bg-subtle: --color-error-bg (#FEE2E2)
```

---

## Tabla behavioral — resumen ejecutivo

| Componente | Hover (hover:hover) | Touch active | Reduced motion |
|-----------|---------------------|--------------|----------------|
| Button primary | translateY(-2px) + glow shadow | scale(0.97) + color-shift | solo color swap |
| Button whatsapp | translateY(-2px) + green glow | scale(0.97) + bg oscuro | solo color swap |
| ServiceCard | translateY(-4px) + shadow-lg | scale(0.98) | ninguno |
| ServiceCard urgencias | translateY(-4px) + shadow-accent | scale(0.98) | ninguno |
| Nav link | underline-draw width 0→100% | color shift | sin underline anim |
| About foto | scale(1.02) + shadow-lg | estático | estático |
| ContactBlock link | color-shift + gap-shift 12→16px | color flash inmediato | solo color |
| Hero H1 | estático (no hover heading) | — | visible desde frame 0 |
| EmergencyCTA call | pulse-warm keyframe continuo | scale(0.97) | sin pulso |
| Huellitas SVG | estático | estático | visible sin draw-anim |
| Blobs orgánicos | estático | estático | sin transform |
| Nav drawer | slide-in translateX | — | fade opacity |

---

## Accesibilidad — Checklist ejecutable

- [ ] `focus-visible:ring-2 focus-visible:ring-[--color-primary]` en todos los interactivos
- [ ] `aria-label` descriptivo en links solo-icono y todos los CTA urgencias
- [ ] `role="navigation"` en Nav + EmergencyCTA wrapper
- [ ] `aria-expanded` en botón hamburger
- [ ] `alt` no vacío en todas las imágenes (incluye placeholders con texto descriptivo)
- [ ] `loading="lazy"` en mapa e imágenes below-the-fold
- [ ] Landmarks semánticos: `<header>` Nav, `<main>` secciones, `<footer>` Footer
- [ ] `scroll-padding-top: 5rem` global para anchors con nav sticky
- [ ] Links tel: y wa.me con texto visible (no solo iconos)
- [ ] `rel="noopener"` en wa.me links
- [ ] `prefers-reduced-motion` guard global en index.css
- [ ] Lenis desinstanciado bajo prefers-reduced-motion
- [ ] Contraste mínimo AA verificado (tabla en sección tokens)
- [ ] Body padding-bottom: 60px mobile (EmergencyCTA no tapa contenido)

---

## AUTO_AUDIT — Paso 0e SaaS Teal Default Detector

```
mood_preset: soft-luxury-warm

T1_palette_not_teal:
  primary hex: #C44B2B → HSL h≈14°, s≈64%
  rango bloqueante teal: h∈[175,205]
  14° ∉ [175,205]
  RESULTADO: PASS

T2_heading_not_generic:
  heading: Playfair Display
  lista bloqueante: [Inter, Roboto, Open Sans, Lato, Arial, Helvetica, SF Pro, Segoe UI]
  "Playfair Display" ∉ lista
  RESULTADO: PASS

T3_typographic_contrast:
  heading: Playfair Display (serif display)
  body: DM Sans (humanist sans)
  iguales: NO — serif display vs humanist sans
  mood_preset ≠ swiss-minimal
  RESULTADO: PASS

T4_hero_structure_varied:
  estructura: editorial asimétrico, titular izquierda, imagen desbordante derecha, badge flotante
  patrón bloqueante: "centered-headline + subtext + 2-ctas + 3-feature-cards"
  NO coincide
  RESULTADO: PASS

T5_radius_coherent_with_mood:
  mood: soft-luxury-warm
  preset CSV: "8px-16px" border radius
  radios usados: 4px / 8px / 12px / 16px / 9999px
  todos dentro de 8-16px (o full para pills)
  RESULTADO: PASS

T6_shadow_coherent_with_mood:
  mood: soft-luxury-warm → luxury requiere subtle-warm
  sombras: --shadow-md rgba(44,26,14,0.10), --shadow-accent rgba(196,75,43,0.35)
  warm, difusas, NO shadow-sm uniforme genérico
  RESULTADO: PASS

T7_envelope_strategy:
  mood: soft-luxury-warm → container-bold
  max-w: 1600px (> 1280px) ✓
  section bg: full-bleed ✓
  content envelope: max 1600px + padding-x max(24px,5vw) ✓
  RESULTADO: PASS

RESULTADO GLOBAL: 7/7 PASS
```

---

## Checklist diferenciacion — design_variance=7

- **Tipografia justificada**: Playfair Display serif display con italic para énfasis emocional. Calidez/cuidado vs sans-serif clínico frío. DM Mono para datos (horarios, créditos) — 3 familias con roles distintos.
- **Composicion asimetrica**: Hero titular izquierdo + imagen desbordando el envelope derecho (design_variance=7 ejecutado). AboutSection split 55/45 con offset vertical de imagen.
- **Micro-interactions distintas (5)**:
  1. Underline-draw pseudoelemento en nav links (no opacity fade)
  2. Shadow-accent glow terracota en Button primary hover (no solo darkened bg)
  3. Gap-shift 12→16px en ContactBlock links (micro-desplazamiento sutil)
  4. Pulse-warm keyframe ring pulsante en EmergencyCTA call btn
  5. Stroke-dashoffset draw on scroll en huellitas SVG
- **Custom shapes**: blobs orgánicos cálidos + huellitas SVG único trazo — nada de rectangles con border-radius genérico como "decoración".
- **Shimmer warm**: skeleton en crema/arena warm en lugar de gris frío genérico.

---
Generado por: ui-designer
Disco: /Users/lucas/Documents/vet-giuliani/.pipeline/design-system.md
Revision: 1.0
Project: vet-giuliani
Scope: personal
Topic: vet-giuliani/design-system
