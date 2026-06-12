# CSS Foundation — vet-giuliani
Fecha: 2026-06-11
Fase: 2 Paso 1 (ux-architect)

## Design Intelligence
- Categoría detectada: Veterinary Clinic
- Estilo motor sugerido: Claymorphism Mobile → DESCARTADO (orientado apps juego)
- Estilo APLICADO: soft-luxury-warm (editorial cálido, mood_preset del intent)
- Justificación override: el motor devuelve estilos mobile-first orientados a apps. El proyecto es landing web con soft-luxury-warm + GSAP Tier 3. El motor SI confirmó paleta cálida (teal+naranja) pero teal va contra anti-pattern HIGH del intent. Se derivó terracota/ámbar/crema/verde salvia.
- Anti-patterns HIGH motor: "Generic design + Hidden services" — reforzado por intent.
- Decision rule del motor: `must_have: emergency-contact` — ✅ CTA urgencias siempre visible.

## Anti-patterns ejecutables (HIGH — OBLIGATORIO para ui-designer y frontend-developer)

1. NO teal SaaS genérico (#0D9488 ni variantes). La paleta es terracota/ámbar/crema.
2. NO Inter como fuente de titulares. Usar par Playfair Display (display) + DM Sans (body).
3. NO azul clínico frío de veterinaria stock (ningún blue-* en elementos principales).
4. NO esconder el CTA de urgencias. Debe ser: visible sin scroll en mobile 375px + sticky bottom en mobile + aria-labeled.
5. NO animaciones que retrasen el acceso al CTA de urgencias. El CTA es clickeable ANTES de que termine cualquier timeline GSAP.
6. NO prefers-reduced-motion ausente. Es OBLIGATORIO con >5 animaciones GSAP. Guard global en index.css.
7. NO tap targets menores a 44x44px en CTA de urgencias ni en links de navegación mobile.
8. NO max-width ≤1280px con mx-auto rígido (SaaS feel). Container strategy: container-bold (--envelope-max: 1600px).
9. NO picsum.photos / unsplash random para imágenes placeholder. Usar gradientes cálidos con alt descriptivo.
10. NO shadow-sm uniforme en todas las cards. Usar escala de sombras cálidas por elevación.

## Envelope Strategy
Mood: soft-luxury-warm → container-bold
- --envelope-max: 1600px
- --envelope-px: max(24px, 5vw)
- Section bg: SIEMPRE full-bleed (edge-to-edge)
- Content envelope (navbar, footer-grid, hero content, cards): max 1600px centrado
- Texto largo (párrafos bio, descripción servicios): max-w-prose (~65ch)

## Paleta — tokens semánticos

### Light mode (base — claro cálido)
```
--bg-primary:     #FDF8F3   /* crema cálida — casi blanco hueso */
--bg-secondary:   #F7EDE0   /* arena suave */
--bg-tertiary:    #EEE0CC   /* arena oscura, cards secundarias */
--bg-accent-warm: #FFF3E8   /* fondo secciones destacadas */

--text-primary:   #2C1A0E   /* marrón casi negro, warm */
--text-secondary: #6B4226   /* marrón medio, subtítulos */
--text-tertiary:  #A07050   /* marrón claro, captions */
--text-emphasis:  #1A0A04   /* negro cálido para hero */
--text-on-cta:    #FFFFFF   /* blanco puro sobre terracota */

--color-primary:      #C44B2B   /* terracota urgencia — color principal CTA */
--color-primary-dark: #A33820   /* terracota oscuro — hover del CTA */
--color-primary-rgb:  196, 75, 43

--color-secondary:    #E8943A   /* ámbar — acento secundario, badges */
--color-secondary-dark: #C87A28
--color-secondary-rgb: 232, 148, 58

--color-accent:       #6B8F71   /* verde salvia — confianza, bienestar */
--color-accent-dark:  #4A6B50
--color-accent-rgb:   107, 143, 113

--color-whatsapp:     #25D366   /* verde WhatsApp oficial */
--color-whatsapp-dark: #1DA851

--border-color:       #D4B896   /* arena medium, bordes sutiles */
--border-emphasis:    #C44B2B   /* terracota para bordes de énfasis */

--color-destructive:  #B91C1C   /* rojo error/alerta */
--color-ring:         #C44B2B   /* focus ring: terracota */
```

### Dark mode
```
[data-theme="dark"] / @media (prefers-color-scheme: dark):
--bg-primary:     #1A0E08   /* marrón casi negro */
--bg-secondary:   #261508   /* marrón oscuro */
--bg-tertiary:    #321C0C   /* marrón medio oscuro */
--bg-accent-warm: #2A1A0A

--text-primary:   #F5ECD8   /* crema clara */
--text-secondary: #C4A882   /* crema media */
--text-tertiary:  #8A7060   /* marrón claro */
--text-emphasis:  #FDF8F3

--color-primary:      #E05C36   /* terracota más brillante en dark */
--color-primary-dark: #C44B2B

--border-color:       #4A3020
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4)
--shadow-md:  0 4px 16px rgba(0, 0, 0, 0.5)
--shadow-lg:  0 12px 40px rgba(0, 0, 0, 0.6)
```

## Tipografía

### Par seleccionado (override sobre Inter del motor — anti-pattern #2)
- Display/heading: Playfair Display (serif editorial, cálido, contraste alto — transmite confianza + premium)
- Body/UI: DM Sans (humanist sans, legible en mobile, cálido sin ser genérico)
- Mono (optional badges/datos): DM Mono

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap
```

### Escala (soft-luxury-warm: contrast alto en hero, legible en mobile)
```
--text-xs:   0.75rem                              /* 12px */
--text-sm:   0.875rem                             /* 14px */
--text-base: clamp(0.9375rem, 0.875rem + 0.2vw, 1rem)   /* 15–16px */
--text-lg:   clamp(1.0625rem, 0.95rem + 0.4vw, 1.25rem) /* 17–20px */
--text-xl:   clamp(1.25rem, 1rem + 0.8vw, 1.5rem)       /* 20–24px */
--text-2xl:  clamp(1.5rem, 1.125rem + 1.2vw, 2rem)      /* 24–32px */
--text-3xl:  clamp(1.875rem, 1.25rem + 2vw, 2.75rem)    /* 30–44px */
--text-4xl:  clamp(2.25rem, 1.5rem + 2.5vw, 3.5rem)     /* 36–56px */
--text-hero: clamp(2.75rem, 1.5rem + 4.5vw, 5.5rem)     /* 44–88px — dramático editorial */

--font-display: 'Playfair Display', Georgia, serif
--font-body:    'DM Sans', system-ui, sans-serif
--font-mono:    'DM Mono', ui-monospace, monospace

--leading-tight:  1.1
--leading-snug:   1.25
--leading-normal: 1.5
--leading-relaxed: 1.65

--tracking-tight:    -0.02em   /* headings Playfair */
--tracking-normal:    0em
--tracking-wide:      0.04em   /* labels, badges */
--tracking-widest:    0.1em    /* eyebrows en mayúscula */
```

## Espaciado (base 4px → escala 4x, soft-luxury: generoso)
```
--space-1:  0.25rem    /* 4px */
--space-2:  0.5rem     /* 8px */
--space-3:  0.75rem    /* 12px */
--space-4:  1rem       /* 16px */
--space-5:  1.25rem    /* 20px */
--space-6:  1.5rem     /* 24px */
--space-8:  2rem       /* 32px */
--space-10: 2.5rem     /* 40px */
--space-12: 3rem       /* 48px */
--space-16: 4rem       /* 64px */
--space-20: 5rem       /* 80px */
--space-24: 6rem       /* 96px */
--space-section: clamp(4rem, 3rem + 4vw, 8rem)   /* entre secciones — generoso */
--space-cta-tap: 2.75rem   /* 44px min tap target height */
```

## Motion (soft-luxury-warm: deliberate, premium — motion_intensity 9)
```
--ease-primary:      cubic-bezier(0.16, 1, 0.3, 1)     /* luxury out — slow in, snap out */
--ease-out:          cubic-bezier(0.0, 0.0, 0.2, 1)    /* materiales de entrada */
--ease-in-out:       cubic-bezier(0.4, 0, 0.2, 1)      /* transiciones bidireccionales */
--ease-bounce-soft:  cubic-bezier(0.34, 1.2, 0.64, 1)  /* muy suave — solo para badges */

--duration-instant:  100ms   /* microinteracciones tap */
--duration-fast:     250ms   /* hover, focus */
--duration-normal:   400ms   /* transiciones de estado */
--duration-slow:     700ms   /* reveals on-scroll */
--duration-reveal:   900ms   /* entradas hero */
--duration-stagger:  80ms    /* delay entre cards en grid */

/* GSAP equivalentes */
--gsap-ease-primary: "power4.out"        /* equivalente a --ease-primary */
--gsap-ease-reveal:  "power3.out"        /* scroll reveals */
--gsap-ease-hero:    "expo.out"          /* hero entrance */
--gsap-stagger:      0.08s               /* stagger entre elementos */
```

## Border Radius (soft-luxury-warm: rounded, no sharp, no bubble)
```
--radius-sm:   4px
--radius-base: 8px
--radius-md:   12px
--radius-lg:   16px
--radius-xl:   24px
--radius-2xl:  32px
--radius-full: 9999px   /* pills — badges, botones CTA principales */
```

## Shadows (soft-luxury-warm: cálidas, difusas, no azuladas)
```
--shadow-sm:     0 1px 3px rgba(44, 26, 14, 0.08), 0 1px 2px rgba(44, 26, 14, 0.06)
--shadow-md:     0 4px 12px rgba(44, 26, 14, 0.10), 0 2px 4px rgba(44, 26, 14, 0.06)
--shadow-lg:     0 12px 32px rgba(44, 26, 14, 0.12), 0 4px 8px rgba(44, 26, 14, 0.06)
--shadow-xl:     0 24px 48px rgba(44, 26, 14, 0.15), 0 8px 16px rgba(44, 26, 14, 0.08)
--shadow-accent: 0 8px 24px rgba(196, 75, 43, 0.35), 0 2px 8px rgba(196, 75, 43, 0.20)
/* shadow-accent: para hover de CTA terracota — glow cálido urgencia */

--shadow-whatsapp: 0 8px 24px rgba(37, 211, 102, 0.30)
/* para hover del botón WhatsApp */
```

## Z-index (centralizado — nunca números directos en componentes)
```
--z-base:      0
--z-raised:    10
--z-dropdown:  1000
--z-sticky:    1010
--z-overlay:   1020
--z-modal:     1030
--z-emergency: 1040   /* CTA urgencias — SIEMPRE encima de todo */
--z-toast:     1050
```

## Breakpoints
```
--bp-mobile:  375px    /* mobile base (audiencia emergencia) */
--bp-sm:      640px
--bp-md:      768px    /* tablet */
--bp-lg:      1024px   /* desktop */
--bp-xl:      1280px
--bp-2xl:     1600px   /* envelope max */

/* Tailwind config (css-in-js / @layer base) */
screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1600px' }
```

## Container / Envelope
```
--envelope-max: 1600px
--envelope-px:  max(24px, 5vw)
--container-prose: 65ch     /* párrafos bio, descripciones */
--container-sm: 640px
--container-md: 768px
```

## Scroll padding (anchor + sticky nav)
```
html { scroll-padding-top: var(--scroll-pad-top); }
--scroll-pad-top: 5rem   /* altura estimada de nav sticky (~64px) + 16px aire */
/* Ajustar a la altura real del nav una vez implementado en Tarea 6 */
```

## Accesibilidad — tokens de sistema
```
/* prefers-reduced-motion — guard global OBLIGATORIO */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Lenis: desinstanciar en src/lib/lenis.ts (ver Tarea 1) */
}

/* Focus ring — accesible y cálido (reemplaza outline azul nativo) */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Safari focus fix */
:where(button):focus:not(:focus-visible) { outline: 0; }

/* color-scheme — dark mode scrollbars */
:root { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }
```

## CTA urgencias — especificaciones de accesibilidad (PRIORIDAD 1)
```
/* Tap targets mínimos — WCAG 2.5.5 AAA target */
.cta-emergency-btn {
  min-height: 44px;   /* 2.75rem */
  min-width: 44px;
  padding: var(--space-3) var(--space-6);
}

/* Contraste mínimo requerido — WCAG AA (4.5:1 para texto normal) */
/* Terracota #C44B2B sobre blanco #FFFFFF: 4.87:1 ✅ AA */
/* Texto blanco #FFFFFF sobre terracota #C44B2B: 4.87:1 ✅ AA */
/* Verde WhatsApp #25D366 sobre blanco: 1.78:1 ❌ — usar texto OSCURO sobre verde */
/* Negro #2C1A0E sobre verde #25D366: 6.20:1 ✅ AA */

/* aria-labels obligatorios */
/* "Llamar a urgencias veterinarias — Dr. Luciano Giuliani" */
/* "Escribir por WhatsApp a urgencias veterinarias" */
```

## Jerarquía de archivos CSS sugerida (Tailwind 4 / Vite)
```
src/
├── index.css            → @import de Tailwind + :root tokens + body defaults + reduce-motion guard
├── styles/
│   ├── tokens.css       → variables CSS (este documento como :root block)
│   ├── typography.css   → @layer base { h1-h6, p, a defaults }
│   ├── layout.css       → containers, section, envelope utilities
│   ├── components.css   → @layer components { botones, badges, cards base }
│   └── animations.css   → @layer utilities { keyframes, GSAP helper classes }
```

## Integración con Tailwind CSS 4
Con Tailwind 4, los CSS vars se pueden exponer directamente como tokens:
```css
@theme {
  --color-primary: #C44B2B;
  --color-primary-dark: #A33820;
  --color-secondary: #E8943A;
  --color-accent: #6B8F71;
  --color-bg: #FDF8F3;
  --color-bg-secondary: #F7EDE0;
  --color-text: #2C1A0E;
  --color-text-secondary: #6B4226;
  --color-text-tertiary: #A07050;
  --color-border: #D4B896;
  --color-whatsapp: #25D366;
  --color-whatsapp-dark: #1DA851;
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --breakpoint-2xl: 1600px;   /* override Tailwind default 1536px */
}
```

## Theme toggle
Estrategia: data-attribute `[data-theme="dark"]` + localStorage.
Script de inicialización (en <head> ANTES de Tailwind para evitar FOUC):
```html
<script>
  (function() {
    var t = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```
Componente: src/components/ui/ThemeToggle.tsx (botón accesible, aria-label dinámico).

---
Generado por: ux-architect
Pipeline: vibecoding Fase 2 Paso 1
Revisión: 1.0
