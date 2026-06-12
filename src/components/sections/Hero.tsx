/* ──────────────────────────────────────────────────────────────────────────
   Hero.tsx — Hero editorial asimétrico con GSAP (Tarea 3)
   Spec: visual-direction #870 · design-system #873 · tareas #862

   LAYOUT (design_variance 7 — broken grid 55/45):
   · Columna izq (55%): eyebrow + titular Playfair + subtítulo + CTAs inline
   · Columna der (45%): imagen hero.webp desbordando el grid + badge flotante

   MOTION (motion_intensity 9 — GSAP Tier 3):
   · Entrance: reveal líneas por línea (clip-path + translateY, overflow hidden)
     stagger 80ms, power4.out. NO SplitText (no disponible en GSAP free 3.15).
   · Parallax formas orgánicas SVG: ScrollTrigger scrub, solo ≥768px
   · Guard prefers-reduced-motion: estado final sin animación

   CRÍTICO — ANTI-PATTERNS BLOQUEANTES (design-system #873):
   · CTAs pointer-events:auto SIEMPRE — clickeables antes y durante el timeline
   · EmergencyCTA sticky (Tarea 2) YA EXISTE — este CTA inline es ADICIONAL
   · Imagen con width/height explícito para evitar CLS, eager+high priority
   · Mobile 375px: sin overflow horizontal, badge + CTAs visibles en viewport
   · Texto oscuro #2C1A0E sobre badge verde/ámbar (no blanco)
   · Sombras con var(--shadow-*) warmth-based, NO shadow-sm genérico
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site, getTelUrl, getWhatsAppUrgencyUrl } from '../../data/site'

gsap.registerPlugin(ScrollTrigger)

/* ─── Íconos inline SVG (sin dependencias externas) ────────────────────── */

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16l.46.92z" />
    </svg>
  )
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

/* ─── Componente principal ─────────────────────────────────────────────── */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  /* Refs de líneas de titular — cada span es una línea con overflow:hidden */
  /* Declarados individualmente para compatibilidad con el linter (no array en JSX) */
  const lineRef0 = useRef<HTMLSpanElement>(null)
  const lineRef1 = useRef<HTMLSpanElement>(null)
  const lineRef2 = useRef<HTMLSpanElement>(null)

  const subcopyRef = useRef<HTMLParagraphElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLParagraphElement>(null)
  const imageColRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  /* Refs formas orgánicas — parallax en desktop */
  const shape1Ref = useRef<HTMLDivElement>(null)
  const shape2Ref = useRef<HTMLDivElement>(null)
  const shape3Ref = useRef<HTMLDivElement>(null)

  const telUrl = getTelUrl()
  const waUrl = getWhatsAppUrgencyUrl()

  useEffect(() => {
    /* ── Guard prefers-reduced-motion ────────────────────────────────── */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      /* Revelar todo en estado final inmediatamente, sin animar */
      ;[lineRef0.current, lineRef1.current, lineRef2.current].forEach((el) => {
        if (el) {
          el.style.transform = 'translateY(0)'
          el.style.opacity = '1'
        }
      })
      const rest = [
        eyebrowRef.current,
        subcopyRef.current,
        ctasRef.current,
        trustRef.current,
        imageColRef.current,
        badgeRef.current,
      ]
      rest.forEach((el) => {
        if (el) {
          el.style.opacity = '1'
          el.style.transform = 'none'
        }
      })
      return
    }

    /* ── CTAs: pointer-events SIEMPRE activos antes del timeline ────── */
    /* Anti-pattern crítico: no bloquear el acceso al teléfono            */
    if (ctasRef.current) ctasRef.current.style.pointerEvents = 'auto'
    if (badgeRef.current) badgeRef.current.style.pointerEvents = 'auto'

    const ctx = gsap.context(() => {
      /* ── Estado inicial de cada línea del titular ─────────────────── */
      /* Técnica: overflow:hidden en el wrapper + translateY en el span  */
      /* Equivalente a SplitText clip-path reveal, sin plugin de pago    */
      const lines = [lineRef0.current, lineRef1.current, lineRef2.current].filter(
        Boolean,
      ) as HTMLElement[]

      gsap.set(lines, { y: '110%', opacity: 0 })
      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 })
      gsap.set(subcopyRef.current, { opacity: 0, y: 20 })
      gsap.set(ctasRef.current, { opacity: 0, y: 20 })
      gsap.set(trustRef.current, { opacity: 0 })
      gsap.set(imageColRef.current, { opacity: 0, x: 32, scale: 0.98 })
      gsap.set(badgeRef.current, { opacity: 0, y: 12, scale: 0.88 })

      /* ── Entrance timeline ─────────────────────────────────────────── */
      const tl = gsap.timeline({ delay: 0.08 })

      /* Eyebrow — aparece primero */
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
      })

      /* Líneas del titular — stagger 80ms, power4.out */
      tl.to(
        lines,
        {
          y: '0%',
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power4.out',
        },
        '-=0.25',
      )

      /* Subcopy */
      tl.to(
        subcopyRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.5',
      )

      /* CTAs — opacity + translateY únicamente; pointer-events ya activos */
      tl.to(
        ctasRef.current,
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        '-=0.4',
      )

      /* Trust line */
      tl.to(
        trustRef.current,
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3',
      )

      /* Columna imagen — entra en paralelo con texto desde el inicio */
      tl.to(
        imageColRef.current,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
        },
        0.1,
      )

      /* Badge flotante — escala con rebote, tras imagen */
      tl.to(
        badgeRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'back.out(1.7)',
        },
        0.75,
      )

      /* ── Parallax formas orgánicas — solo desktop ≥768px ─────────── */
      /* iOS Safari tiene bugs críticos con scroll+transform en mobile   */
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        if (shape1Ref.current) {
          gsap.to(shape1Ref.current, {
            y: -70,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.8,
            },
          })
        }
        if (shape2Ref.current) {
          gsap.to(shape2Ref.current, {
            y: -45,
            x: 15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 2.5,
            },
          })
        }
        if (shape3Ref.current) {
          gsap.to(shape3Ref.current, {
            y: -28,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Inicio — Veterinaria Giuliani"
      className="hero-section"
    >
      {/* ── Formas orgánicas de fondo — parallax en desktop ────────────── */}
      <div className="hero-shapes" aria-hidden="true">
        <div ref={shape1Ref} className="hero-shape hero-shape--1" />
        <div ref={shape2Ref} className="hero-shape hero-shape--2" />
        <div ref={shape3Ref} className="hero-shape hero-shape--3" />
      </div>

      {/* ── Grid asimétrico 55/45 — envelope max 1600px ────────────────── */}
      <div className="hero-grid container-bold">

        {/* ── COLUMNA IZQUIERDA — contenido editorial ─────────────────── */}
        <div className="hero-text-col">

          {/* Eyebrow */}
          <p ref={eyebrowRef} className="eyebrow hero-eyebrow" style={{ opacity: 0 }}>
            Médico Veterinario · San Rafael, Mendoza
          </p>

          {/* Titular — 3 líneas con overflow:hidden para el reveal clip-path */}
          {/* aria-label completo en h1 — spans son solo visuales            */}
          <h1
            className="hero-heading"
            aria-label="Tu mascota merece el mejor cuidado, cuando más lo necesita — Luciano Giuliani"
          >
            {/* Cada .hero-heading__wrap = overflow:hidden; span anima translateY */}
            <span className="hero-heading__wrap" aria-hidden="true">
              <span ref={lineRef0} className="hero-heading__line" style={{ display: 'block' }}>
                Tu mascota,
              </span>
            </span>
            <span className="hero-heading__wrap" aria-hidden="true">
              <span ref={lineRef1} className="hero-heading__line" style={{ display: 'block' }}>
                siempre
              </span>
            </span>
            <span className="hero-heading__wrap" aria-hidden="true">
              <span
                ref={lineRef2}
                className="hero-heading__line hero-heading__line--accent"
                style={{ display: 'block' }}
              >
                cuidada.
              </span>
            </span>
          </h1>

          {/* Subtítulo / subcopy */}
          <p ref={subcopyRef} className="hero-subcopy" style={{ opacity: 0 }}>
            Luciano Giuliani — médico veterinario en San Rafael.
            {' '}Urgencias a cualquier hora, atención con dedicación siempre.
          </p>

          {/* CTAs inline — pointer-events:auto desde el frame 0         */}
          {/* Están en opacity 0 inicial pero nunca bloquean el clic     */}
          <div
            ref={ctasRef}
            className="hero-ctas"
            style={{ opacity: 0, pointerEvents: 'auto' }}
          >
            <a
              href={telUrl}
              className="hero-btn hero-btn--primary"
              aria-label={`Llamar a urgencias veterinarias — ${site.phone.display}`}
            >
              <PhoneIcon size={20} />
              <span>{site.copy.callToAction}</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn--whatsapp"
              aria-label={`Escribir a urgencias por WhatsApp — ${site.whatsapp.display}`}
            >
              <WhatsAppIcon size={20} />
              <span>{site.copy.whatsappCTA}</span>
            </a>
          </div>

          {/* Trust line */}
          <p ref={trustRef} className="hero-trust" style={{ opacity: 0 }}>
            {site.copy.trustLine}
          </p>
        </div>

        {/* ── COLUMNA DERECHA — imagen hero.webp desbordando el grid ──── */}
        {/* Estado aprobado en checkpoint: <img> hero.webp con broken grid  */}
        {/* (design_variance 7) + badge flotante con contraste OK.           */}
        <div
          ref={imageColRef}
          className="hero-image-col"
          style={{ opacity: 0 }}
        >
          {/* Wrapper imagen — desborda el grid en desktop (broken grid) */}
          <div className="hero-image-wrapper">
            <img
              src="/assets/hero.webp"
              alt="Luciano Giuliani, médico veterinario — atendiendo a una mascota"
              className="hero-image"
              width={800}
              height={1000}
              loading="eager"
              fetchPriority="high"
            />
            {/* Overlay gradiente cálido tenue sobre la imagen */}
            <div className="hero-image-overlay" aria-hidden="true" />
          </div>

          {/* Badge urgencias 24h flotante — siempre accesible */}
          <div
            ref={badgeRef}
            className="hero-badge"
            role="note"
            aria-label="Atención de urgencias disponible las 24 horas"
            style={{ opacity: 0, pointerEvents: 'auto' }}
          >
            {/* Punto de pulso — solo bajo no-preference */}
            <span className="hero-badge__pulse-dot" aria-hidden="true" />
            <div className="hero-badge__body">
              <span className="hero-badge__title">Urgencias 24 h</span>
              <span className="hero-badge__sub">Disponible ahora</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transición de sección hacia abajo */}
      <div className="hero-fade-bottom" aria-hidden="true" />
    </section>
  )
}

export default Hero
