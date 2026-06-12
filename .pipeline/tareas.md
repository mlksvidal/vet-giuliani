# Tareas — vet-giuliani
Fecha: 2026-06-11
Total: 8 tareas | Tiempo estimado: ~6 h (8 x ~45 min)
Stack detectado: Vite + React + TypeScript + Tailwind CSS 4 | Motion: GSAP + ScrollTrigger + Lenis (Tier 3)
Estructura: single-repo en /Users/lucas/Documents/vet-giuliani
Deploy target: Vercel

## Mood / dials (de vet-giuliani/intent #861)
- mood_preset: soft-luxury-warm (cálido + confiable, editorial-warm, NO teal SaaS, NO azul clínico frío)
- design_variance: 7 | motion_intensity: 9 (Tier 3 GSAP) | visual_density: 5
- Mobile-first CRÍTICO: audiencia incluye gente en emergencia con el celular en la mano
- anti_patterns_HIGH: CTA urgencias prominente <1 scroll + sticky · motion nunca bloquea acceso al teléfono · prefers-reduced-motion obligatorio

## Gaps identificados
1. Datos del cliente PENDIENTES → usar placeholders claramente marcados, centralizados en un solo archivo de config (src/data/site.ts) para que reemplazar sea trivial cuando lleguen:
   - Teléfono/WhatsApp: `+54 9 260 XXX-XXXX` (también número E.164 sin formato para los links wa.me / tel:)
   - Dirección exacta: `[DIRECCIÓN PENDIENTE] — San Rafael, Mendoza`
   - Horarios exactos: placeholders marcados (ej. "Lun–Vie 9–13 / 17–21 · Sáb 9–13 · Urgencias 24 h *[confirmar]*")
   - Fotos reales: NO usar placeholder services (picsum/unsplash). Usar placeholders generados por el pipeline creativo (brand-agent → image-agent) o bloques de color/gradiente con alt descriptivo hasta que lleguen.
2. Coordenadas exactas del mapa pendientes → embed de Google Maps con query textual de San Rafael + marca de "ubicación aproximada / confirmar".
3. Sin gaps bloqueantes para arrancar desarrollo: el scope funcional (contacto directo + servicios + ubicación + horarios, frontend puro) está cerrado.

---

## Tarea 0: Project Infrastructure (OBLIGATORIA)
Tipo: config
Descripción: Inicializar el proyecto base Vite + React + TypeScript + Tailwind CSS 4 en single-repo. Instalar y configurar GSAP + ScrollTrigger + Lenis. Setear tooling.
- `npm create vite@latest` (react-ts) en /Users/lucas/Documents/vet-giuliani
- Tailwind CSS 4 (plugin @tailwindcss/vite + import en index.css)
- Instalar: gsap, lenis (@studio-freight/lenis o lenis)
- ESLint + Prettier (.eslintrc / eslint.config.js, .prettierrc, .editorconfig)
- Husky + lint-staged (pre-commit: lint + type-check `tsc --noEmit`)
- .env.example (vacío salvo placeholders de config si aplica), .gitignore completo (node_modules, dist, .env, .DS_Store)
- vitest.config.ts + script "test" en package.json
- vercel.json: security headers (X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy bajo "/(.*)" ) + Cache-Control max-age=604800 para /assets/**
- README.md: descripción, stack, setup local (clone, npm install, npm run dev), scripts (dev/build/test/lint), estructura de carpetas
- Estructura: src/components/{ui,sections}/, src/data/, src/hooks/, src/lib/, src/types/, src/__tests__/, public/
Archivos esperados: package.json, vite.config.ts, tailwind config, src/index.css, eslint.config.js, .prettierrc, .editorconfig, vercel.json, vitest.config.ts, README.md, .gitignore, .env.example
Criterio de aceptación: `npm run dev` levanta sin errores · `npm run build` genera dist/ sin errores · `npm run lint` pasa sin errores · `tsc --noEmit` pasa · `npm test` existe · README tiene setup completo · gsap+lenis importables sin error
Dependencias: ninguna

## Tarea 1: Design tokens + datos del sitio + layout base
Tipo: frontend
Descripción: Establecer el sistema de diseño cálido (soft-luxury-warm) como tokens CSS/Tailwind y centralizar TODOS los datos placeholder en un único archivo tipado. Montar el layout base con Lenis smooth scroll.
- src/data/site.ts: objeto tipado con phone (display `+54 9 260 XXX-XXXX` + e164 sin formato para links), whatsappMessage default, address (placeholder marcado), hours[], services[], mapsQuery, socials. TODO placeholder con comentario `// PLACEHOLDER: reemplazar con dato real del cliente`.
- Design tokens en index.css / tailwind theme: paleta cálida (terracota/ámbar/crema/verde salvia tierra — NO azul clínico, NO teal), escala tipográfica con par editorial (display serif/humanist + sans de lectura), radios, sombras suaves cálidas, easings. Variables CSS custom (--color-*, --font-*).
- src/lib/lenis.ts: hook/setup de Lenis con guard de prefers-reduced-motion (si reduce-motion → no instanciar smooth scroll, scroll nativo).
- App.tsx: estructura de secciones (placeholders vacíos por ahora) + provider de Lenis + scroll-padding-top global para anchors.
Archivos esperados: src/data/site.ts, src/types/index.ts, src/index.css (tokens), tailwind theme, src/lib/lenis.ts, src/hooks/useLenis.ts, src/App.tsx
Criterio de aceptación: tokens cálidos aplicados (NO teal/Inter por defecto, NO azul clínico) verificable en DOM · site.ts exporta todos los datos con placeholders marcados · Lenis activo en desktop pero deshabilitado bajo prefers-reduced-motion (verificable emulando reduce-motion) · scroll-padding-top presente para anchors
Dependencias: 0

## Tarea 2: CTA de Urgencias persistente (sticky/fijo) — PRIORIDAD MÁXIMA
Tipo: frontend
Descripción: Componente de contacto de emergencia SIEMPRE accesible. Es el diferencial del proyecto y el anti-pattern HIGH #1. Debe ser alcanzable en <1 scroll y permanecer disponible.
- src/components/ui/EmergencyCTA.tsx: botón/barra fija (sticky bottom en mobile, posición prominente en desktop) con dos acciones: "Llamar urgencia" (link `tel:` con e164) y "WhatsApp" (link `https://wa.me/<e164>?text=<mensaje urgencia URL-encoded>`).
- Visible desde el primer viewport sin scroll. En mobile: barra fija inferior con ambos botones a tamaño táctil (min 44x44px, idealmente full-width tap targets).
- Estilo cálido pero de alto contraste/urgencia (acento terracota/ámbar saturado), pulso sutil opcional que respeta prefers-reduced-motion.
- aria-labels explícitos ("Llamar a urgencias veterinarias", "Escribir a urgencias por WhatsApp"). target/rel correctos en el link de WhatsApp.
Archivos esperados: src/components/ui/EmergencyCTA.tsx, integración en App.tsx
Criterio de aceptación (verificable por Playwright/evidence-collector):
- El CTA de urgencias es visible en el viewport inicial mobile (375px) SIN hacer scroll
- Existe un `<a href="tel:...">` y un `<a href="https://wa.me/...">` con el número e164 (placeholder)
- El link wa.me incluye `?text=` con mensaje pre-cargado
- Permanece visible/accesible tras hacer scroll hasta el final de la página (sticky)
- Tap targets ≥44x44px en mobile · aria-labels presentes
- Bajo prefers-reduced-motion el pulso de animación se detiene (no movimiento)
Dependencias: 1

## Tarea 3: Hero con CTA de urgencias prominente + animación de entrada
Tipo: frontend
Descripción: Sección hero above-the-fold: nombre/propuesta de Luciano Giuliani, mensaje de confianza + urgencias 24h, y CTA de emergencia repetido inline (además del sticky). Animación de entrada GSAP premium (Tier 3) que NO retrasa el acceso al CTA.
- Titular editorial cálido, subtítulo (veterinario en San Rafael · atiende urgencias), badge "Urgencias" destacado.
- CTA inline a WhatsApp/llamada (mismos links que Tarea 2).
- Media del hero: imagen/gradiente cálido (placeholder marcado, NO picsum). Composición asimétrica (design_variance 7).
- GSAP entrance timeline (fade/clip/stagger de titular y CTA) con will-change y transforms. El CTA debe ser clickeable inmediatamente (no esperar al final de la timeline / sin overlay bloqueante).
- Guard prefers-reduced-motion: si reduce → estado final visible sin animación.
Archivos esperados: src/components/sections/Hero.tsx
Criterio de aceptación:
- Hero ocupa ~el primer viewport; titular + badge urgencias + CTA visibles
- CTA de urgencias inline funcional (tel: y wa.me con e164 placeholder), clickeable sin esperar animación
- Animación GSAP de entrada presente (verificable: elementos transicionan opacity/transform)
- Bajo prefers-reduced-motion el hero renderiza en estado final sin animar
- No usa picsum/unsplash random; media es placeholder marcado o asset del pipeline
Dependencias: 2

## Tarea 4: Sección Servicios con scroll reveals
Tipo: frontend
Descripción: Grid/listado de servicios veterinarios (consulta general, vacunación, cirugía, diagnóstico, urgencias 24h, etc. — desde site.ts, marcados como placeholder "confirmar lista exacta"). Cards cálidas con animación on-scroll (ScrollTrigger stagger).
- src/components/sections/Services.tsx: render desde site.services. Cards con icono/título/descripción corta.
- ScrollTrigger reveal con stagger al entrar en viewport. Servicio "Urgencias 24h" destacado visualmente y con su propio mini-CTA.
- Layout responsive: 1 col mobile, 2-3 col desktop.
- Guard prefers-reduced-motion: sin reveals, contenido visible directo.
Archivos esperados: src/components/sections/Services.tsx, datos en src/data/site.ts
Criterio de aceptación:
- Renderiza todas las cards de site.services
- Cada card aparece con animación on-scroll en desktop (ScrollTrigger)
- "Urgencias 24h" visualmente destacado + enlace a WhatsApp/llamada
- Responsive: 1 columna a 375px, multi-columna en desktop (verificable con resize)
- Bajo prefers-reduced-motion todas las cards visibles sin animación de entrada
Dependencias: 2

## Tarea 5: Sección "Sobre Luciano" + Ubicación/Horarios
Tipo: frontend
Descripción: Dos bloques de confianza. (a) Sobre Luciano: foto placeholder marcada + bio corta (cercanía/cuidado, placeholder). (b) Ubicación + Horarios: dirección (placeholder), tabla/listado de horarios (placeholder), embed de Google Maps por query textual de San Rafael, y CTA de cómo llegar / WhatsApp.
- src/components/sections/About.tsx y src/components/sections/LocationHours.tsx.
- Horarios desde site.hours, dirección desde site.address (placeholders marcados visiblemente, ej. itálica o badge "*pendiente confirmar*").
- Mapa: iframe de Google Maps con loading="lazy" usando site.mapsQuery (ubicación aproximada marcada).
- Reveals on-scroll sutiles (motion_intensity 9 pero density 5 → elegante, no saturado). Guard reduce-motion.
Archivos esperados: src/components/sections/About.tsx, src/components/sections/LocationHours.tsx
Criterio de aceptación:
- About muestra bio + foto placeholder marcada (no picsum)
- LocationHours muestra dirección placeholder, lista de horarios desde site.hours, y un iframe de Google Maps que carga
- Placeholders visiblemente marcados como pendientes de confirmar
- Reveals on-scroll respetan prefers-reduced-motion
- Responsive a 375px sin overflow horizontal
Dependencias: 2

## Tarea 6: Footer/Contacto + navegación
Tipo: frontend
Descripción: Footer con datos de contacto consolidados (teléfono, WhatsApp, dirección, horarios resumidos, redes si aplica — todo placeholder) y nav superior con anchors a secciones. Refuerzo final del CTA de urgencias.
- src/components/sections/Footer.tsx + src/components/ui/Nav.tsx.
- Nav: logo/nombre + links ancla (Servicios, Sobre, Ubicación, Contacto). En mobile: hamburger menu (obligatorio por regla universal navbar mobile). Anchors con scroll suave (Lenis) y scroll-padding-top.
- Footer: bloque de contacto con tel:/wa.me, dirección, horarios resumidos, © año + "Veterinaria Luciano Giuliani · San Rafael, Mendoza".
Archivos esperados: src/components/sections/Footer.tsx, src/components/ui/Nav.tsx, integración en App.tsx
Criterio de aceptación:
- Nav presente con links ancla que hacen scroll a las secciones correctas (con scroll-padding-top, sin quedar tapados por nav fija)
- En mobile (375px) la nav colapsa a hamburger funcional (abre/cierra)
- Footer repite contacto de urgencias (tel: + wa.me) con e164 placeholder
- Todos los datos de contacto provienen de site.ts (placeholders)
Dependencias: 3, 4, 5

## Tarea 7: Pulido responsive + accesibilidad + prefers-reduced-motion global + QA integración
Tipo: frontend
Descripción: Pase final de integración. Verificar mobile-first exhaustivo (audiencia en emergencia), accesibilidad y que la capa global de motion respeta reduce-motion en TODAS las secciones. Estados secundarios y performance.
- Auditar a 375px / 768px / 1280px: sin overflow horizontal, tap targets ≥44px, jerarquía legible, CTA urgencias siempre accesible.
- prefers-reduced-motion: media query global que mata/neutraliza GSAP+Lenis+pulsos en todas las secciones (verificar cada sección).
- Accesibilidad: contraste AA en texto/CTA, alt descriptivo en imágenes (incluyendo placeholders), foco visible en links/botones, landmarks semánticos (header/main/footer/section + aria-labels).
- Estados: loading/lazy en mapa e imágenes; fallback visible si una imagen placeholder no carga.
- Performance: imágenes optimizadas/lazy, sin layout shift en hero, GSAP solo donde aporta.
- Smoke test: que todos los links tel:/wa.me apunten al mismo e164 de site.ts.
Archivos esperados: src/index.css (media query reduce-motion global), ajustes transversales en componentes, posible src/__tests__/links.test.tsx
Criterio de aceptación (verificable por Playwright/evidence-collector):
- A 375px no hay scroll horizontal en ninguna sección
- CTA de urgencias accesible en todos los viewports y a cualquier scroll position
- Con prefers-reduced-motion activado, NINGUNA sección anima (Hero, Services, About, Location reveals, pulso CTA, Lenis off)
- Todos los <a> tel: y wa.me usan el mismo número e164 de site.ts
- Imágenes con alt no vacío · foco visible en CTA · contraste AA en CTA de urgencias
- `npm run build` sin errores · `npm run lint` sin errores
Dependencias: 6

---

## Nota para dev-agents
- Todos los datos del cliente son PLACEHOLDER centralizados en src/data/site.ts. Reemplazar ahí cuando lleguen los reales (un solo punto de cambio).
- Para fotos: NO usar picsum.photos / unsplash random. Usar assets del pipeline creativo (brand-agent → image-agent) o bloques de gradiente cálido con alt descriptivo.
- El CTA de urgencias (Tarea 2) es el corazón del proyecto: prioridad sobre cualquier animación. Ninguna animación puede bloquear/demorar su acceso.
- prefers-reduced-motion es OBLIGATORIO (>5 animaciones GSAP). Verificar sección por sección en Tarea 7.
