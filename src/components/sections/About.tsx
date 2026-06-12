/* ──────────────────────────────────────────────────────────────────────────
   About.tsx — Sección "Sobre Luciano" (Tarea 5)
   Spec: design-system #873 · tareas #862 (Tarea 5)

   LAYOUT (design_variance 7 — asimétrico 45/55):
   · Columna izq (45%): foto /assets/about.webp, rotate(-2deg) con badge flotante
   · Columna der (55%): eyebrow + H2 + bio corta + trust tags
   · Mobile: columna imagen primero (full width), luego texto

   MOTION (motion_intensity 9, density 5 — elegante, no saturado):
   · Imagen: clip-path reveal + parallax scrub -20→+20px (solo desktop ≥768px)
   · Texto: fade-up stagger (eyebrow → h2 → bio → tags)
   · Guard prefers-reduced-motion: estado final sin animar

   PLACEHOLDER DATA:
   · Foto: /assets/about.webp — marcada "confirmar con cliente"
   · Bio: site.copy.about — marcada placeholder con nota visible
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site, getTelUrl, getWhatsAppUrgencyUrl } from '../../data/site'

gsap.registerPlugin(ScrollTrigger)

/* ─── Íconos inline SVG ─────────────────────────────────────────────────── */

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PhoneIcon({ size = 16 }: { size?: number }) {
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

/* Trust tags — puntos de confianza rápidos */
const TRUST_POINTS = [
  'Atención personalizada para cada paciente',
  'Urgencias disponibles las 24 horas',
  'Diagnóstico preciso sin derivaciones innecesarias',
  'San Rafael, Mendoza — tu veterinario de confianza',
]

/* ─── Componente principal ─────────────────────────────────────────────── */

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const tagsRef = useRef<HTMLUListElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)

  const telUrl = getTelUrl()
  const waUrl = getWhatsAppUrgencyUrl()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Elementos de texto en orden de reveal */
    const textEls = [
      eyebrowRef.current,
      headingRef.current,
      bioRef.current,
      tagsRef.current,
      ctasRef.current,
    ].filter(Boolean) as HTMLElement[]

    if (prefersReduced) {
      /* Estado final inmediato */
      if (imageWrapRef.current) {
        imageWrapRef.current.style.clipPath = 'inset(0% 0% 0% 0% round 16px)'
        imageWrapRef.current.style.opacity = '1'
        imageWrapRef.current.style.transform = 'rotate(-2deg)'
      }
      textEls.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      /* ── Estado inicial ─────────────────────────────────────────────── */
      if (imageWrapRef.current) {
        gsap.set(imageWrapRef.current, {
          clipPath: 'inset(100% 0% 0% 0% round 16px)',
          opacity: 0,
        })
      }
      gsap.set(textEls, { opacity: 0, y: 28 })

      /* ── Imagen: clip-path reveal desde abajo al entrar en viewport ─── */
      if (imageWrapRef.current) {
        gsap.to(imageWrapRef.current, {
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        })
      }

      /* ── Texto: stagger fade-up ─────────────────────────────────────── */
      gsap.to(textEls, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      /* ── Parallax imagen — solo desktop ≥768px ──────────────────────── */
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        if (imageWrapRef.current) {
          gsap.to(imageWrapRef.current, {
            y: -24,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
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
      id="sobre"
      aria-labelledby="about-heading"
      className="about-section section-pad"
    >
      <div className="container-bold">
        <div className="about-grid">

          {/* ── COLUMNA IMAGEN (izq, 45%) ───────────────────────────────── */}
          <div className="about-image-col">
            <div
              ref={imageWrapRef}
              className="about-image-wrapper"
              style={{ clipPath: 'inset(100% 0% 0% 0% round 16px)', opacity: 0 }}
            >
              {/* Foto placeholder — confirmar con cliente */}
              <img
                src="/assets/about.webp"
                alt="Luciano Giuliani, médico veterinario, en su consultorio de San Rafael"
                className="about-image"
                loading="lazy"
                width={600}
                height={750}
              />
              {/* Overlay cálido sobre imagen */}
              <div className="about-image-overlay" aria-hidden="true" />
            </div>

            {/* Badge flotante — experiencia / confianza */}
            <div className="about-float-badge" aria-label="Veterinario de confianza en San Rafael">
              <div className="about-float-badge__icon" aria-hidden="true">
                <StarIcon size={18} />
              </div>
              <div className="about-float-badge__body">
                <strong className="about-float-badge__title">Tu veterinario</strong>
                <span className="about-float-badge__sub">San Rafael, Mendoza</span>
              </div>
            </div>
          </div>

          {/* ── COLUMNA TEXTO (der, 55%) ────────────────────────────────── */}
          <div className="about-text-col">

            {/* Eyebrow */}
            <p
              ref={eyebrowRef}
              className="eyebrow"
              style={{ opacity: 0 }}
            >
              Sobre el veterinario
            </p>

            {/* H2 */}
            <h2
              ref={headingRef}
              id="about-heading"
              className="about-heading"
              style={{ opacity: 0 }}
            >
              Luciano Giuliani
            </h2>

            {/* Bio corta placeholder */}
            <p
              ref={bioRef}
              className="about-bio"
              style={{ opacity: 0 }}
            >
              {site.copy.about}
            </p>

            {/* Trust points */}
            <ul
              ref={tagsRef}
              className="about-trust-list"
              style={{ opacity: 0 }}
              aria-label="Puntos destacados de la atención"
            >
              {TRUST_POINTS.map((point) => (
                <li key={point} className="about-trust-item">
                  <span className="about-trust-item__icon" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* CTAs de contacto */}
            <div
              ref={ctasRef}
              className="about-ctas"
              style={{ opacity: 0 }}
            >
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-btn about-btn--whatsapp"
                aria-label="Escribir a Luciano Giuliani por WhatsApp"
              >
                Consultar por WhatsApp
              </a>
              <a
                href={telUrl}
                className="about-btn about-btn--secondary"
                aria-label="Llamar a la veterinaria"
              >
                <PhoneIcon size={16} />
                {site.phone.display}
              </a>
            </div>


          </div>
        </div>
      </div>
    </section>
  )
}

export default About
