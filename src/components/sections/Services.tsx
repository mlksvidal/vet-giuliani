/* ──────────────────────────────────────────────────────────────────────────
   Services.tsx — Sección servicios con ScrollTrigger reveals (Tarea 4)
   Spec: design-system #873 · tareas #862 · visual-direction #870

   LAYOUT (design_variance 7):
   · Mobile 375px: 1 columna, cards apiladas
   · Tablet 768px: 2 columnas
   · Desktop 1200px+: 3 columnas, card urgencias destacada va primera

   MOTION (motion_intensity 9 — GSAP Tier 3):
   · ScrollTrigger batch reveal: fade-up + stagger 0.08s por card
   · 3D tilt on hover: rotateX/Y max 5deg + translateY(-8px) + shadow-xl
   · Guard prefers-reduced-motion: contenido visible directo sin reveal

   CONTEXTO VISUAL:
   · Hero es oscuro chocolate (dark theme) — Services arranca el cuerpo claro
   · bg: var(--color-bg) crema (#FDF8F3 en light, #1A0E08 en dark)
   · Transición via hero-fade-bottom ya hecha en Hero.tsx

   CRÍTICO:
   · "Urgencias 24h" card: bg terracota, texto blanco, mini-CTA wa.me/tel
   · pointer-events en CTAs: SIEMPRE auto
   · prefers-reduced-motion: sin reveals, cards visibles desde render
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site, getTelUrl, getWhatsAppUrgencyUrl } from '../../data/site'
import type { Service } from '../../types'

gsap.registerPlugin(ScrollTrigger)

/* ─── Íconos inline SVG — sin dependencias externas ────────────────────── */

function IconEmergency({ size = 28 }: { size?: number }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function IconStethoscope({ size = 28 }: { size?: number }) {
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
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15a6 6 0 0 0 6 6" />
      <circle cx="20" cy="21" r="1" />
    </svg>
  )
}

function IconSyringe({ size = 28 }: { size?: number }) {
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
      <path d="m18 2 4 4" />
      <path d="m17 7 3-3" />
      <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
      <path d="m9 11 4 4" />
      <path d="m5 19-3 3" />
      <path d="m14 4 6 6" />
    </svg>
  )
}

function IconScalpel({ size = 28 }: { size?: number }) {
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
      <path d="M20.2 6a3 3 0 1 0-5.7 0 3 3 0 0 0 5.7 0z" />
      <path d="M17.5 3 19 2" />
      <path d="M14.5 6l-10 10c-1 1-1 3 0 4s3 1 4 0l10-10" />
    </svg>
  )
}

function IconBone({ size = 28 }: { size?: number }) {
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
      <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" />
    </svg>
  )
}

function IconAlert({ size = 28 }: { size?: number }) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function IconBed({ size = 28 }: { size?: number }) {
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
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  )
}

function IconScan({ size = 28 }: { size?: number }) {
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
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  )
}

function IconPhone({ size = 18 }: { size?: number }) {
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

function IconWhatsApp({ size = 18 }: { size?: number }) {
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

/* ─── Mapa de íconos por id del servicio ───────────────────────────────── */

function ServiceIcon({ icon, size = 28 }: { icon?: string; size?: number }) {
  switch (icon) {
    case 'emergency': return <IconEmergency size={size} />
    case 'stethoscope': return <IconStethoscope size={size} />
    case 'syringe': return <IconSyringe size={size} />
    case 'scalpel': return <IconScalpel size={size} />
    case 'bone': return <IconBone size={size} />
    case 'alert': return <IconAlert size={size} />
    case 'bed': return <IconBed size={size} />
    case 'scan': return <IconScan size={size} />
    default: return <IconStethoscope size={size} />
  }
}

/* ─── Card de servicio normal ───────────────────────────────────────────── */

function ServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null)

  /* 3D tilt on hover — GSAP quickTo para rendimiento */
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    /* Detectar si el dispositivo tiene hover real (no touch) */
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasHover) return

    const setRotX = gsap.quickTo(el, 'rotateX', { duration: 0.3, ease: 'power2.out' })
    const setRotY = gsap.quickTo(el, 'rotateY', { duration: 0.3, ease: 'power2.out' })
    const setY = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power2.out' })

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      setRotX(-dy * 5)
      setRotY(dx * 5)
    }

    function onEnter() {
      setY(-8)
      el!.style.boxShadow = 'var(--shadow-xl, 0 24px 48px rgba(44,26,14,0.15))'
    }

    function onLeave() {
      setRotX(0)
      setRotY(0)
      setY(0)
      el!.style.boxShadow = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { rotateX: 0, rotateY: 0, y: 0 })
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="service-card"
      style={{ willChange: 'transform' }}
    >
      <div className="service-card__icon-wrap" aria-hidden="true">
        <ServiceIcon icon={service.icon} size={26} />
      </div>
      <h3 className="service-card__title">{service.name}</h3>
      <p className="service-card__desc">{service.description}</p>
    </div>
  )
}

/* ─── Card de urgencias — variante destacada ────────────────────────────── */

function EmergencyServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const telUrl = getTelUrl()
  const waUrl = getWhatsAppUrgencyUrl()

  /* Hover lift — sin tilt (demasiado agresivo en card CTA) */
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasHover) return

    const setY = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power2.out' })
    const onEnter = () => setY(-6)
    const onLeave = () => setY(0)

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="service-card service-card--emergency"
      style={{ willChange: 'transform' }}
    >
      {/* Pulso sutil de fondo */}
      <div className="service-card__emergency-glow" aria-hidden="true" />

      <div className="service-card__icon-wrap service-card__icon-wrap--emergency" aria-hidden="true">
        <ServiceIcon icon={service.icon} size={28} />
      </div>

      <h3 className="service-card__title service-card__title--emergency">
        {service.name}
      </h3>
      <p className="service-card__desc service-card__desc--emergency">
        {service.description}
      </p>

      {/* Mini-CTA de urgencias */}
      <div className="service-card__cta-row">
        <a
          href={telUrl}
          className="service-card__cta service-card__cta--phone"
          aria-label={`Llamar a urgencias veterinarias — ${site.phone.display}`}
          style={{ pointerEvents: 'auto' }}
        >
          <IconPhone size={16} />
          <span>Llamar</span>
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="service-card__cta service-card__cta--whatsapp"
          aria-label={`Escribir por WhatsApp a urgencias — ${site.whatsapp.display}`}
          style={{ pointerEvents: 'auto' }}
        >
          <IconWhatsApp size={16} />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  )
}

/* ─── Componente principal ─────────────────────────────────────────────── */

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  /* Separar urgencias (destacada) del resto de servicios */
  const emergencyServices = site.services.filter((s) => s.isEmergency)
  const regularServices = site.services.filter((s) => !s.isEmergency)

  useEffect(() => {
    /* ── Guard prefers-reduced-motion ────────────────────────────────── */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      /* ── Section header reveal — fade-up ─────────────────────────── */
      gsap.set([eyebrowRef.current, headingRef.current], { opacity: 0, y: 24 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to([eyebrowRef.current, headingRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
          })
        },
        once: true,
      })

      /* ── Cards reveal — batch con stagger ───────────────────────── */
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.service-card')

        gsap.set(cards, { opacity: 0, y: 40 })

        ScrollTrigger.batch(cards, {
          start: 'top 85%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
              overwrite: true,
            })
          },
          once: true,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="servicios"
      aria-labelledby="services-heading"
      className="services-section section-pad"
    >
      <div className="container-bold">
        {/* ── Section header ─────────────────────────────────────────── */}
        <header className="services-header">
          <p ref={eyebrowRef} className="eyebrow services-eyebrow">
            Qué hacemos
          </p>
          <h2 ref={headingRef} id="services-heading" className="services-heading">
            Servicios veterinarios
          </h2>
        </header>

        {/* ── Grid de cards — emergencias primero ─────────────────────── */}
        <div ref={gridRef} className="services-grid" role="list">
          {/* Cards de urgencias destacadas — primero en el DOM (presencia visual + acceso) */}
          {emergencyServices.map((service) => (
            <div key={service.id} role="listitem">
              <EmergencyServiceCard service={service} />
            </div>
          ))}

          {/* Cards de servicios regulares */}
          {regularServices.map((service) => (
            <div key={service.id} role="listitem">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* ── Nota de placeholder — lista de servicios pendiente ───── */}
        <p className="services-placeholder-note" aria-hidden="true">
          * Lista de servicios a confirmar con el cliente — actualizar en{' '}
          <code>src/data/site.ts</code>
        </p>
      </div>
    </section>
  )
}

export default Services
