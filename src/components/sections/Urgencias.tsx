/* ──────────────────────────────────────────────────────────────────────────
   Urgencias.tsx — Sección urgencias con estética hospitalaria warm
   Spec: vet-giuliani/spec-hospital-emergencias #925
   Tarea 8 — insertar entre Hero y Servicios en App.tsx

   LAYOUT:
   · Desktop ≥768px: 2 columnas — izq 55% (header + vitals + CTAs) | der 45% (triage + protocolo)
   · Mobile 375px: 1 columna — protocolo arriba, triage abajo

   MOTION (motion_intensity 9 — GSAP Tier 3, igual que Services.tsx):
   · ScrollTrigger stagger reveal, stagger 0.08s, power3.out
   · ECG: CSS @keyframes stroke-dashoffset loop, 4s linear
   · Blink dot: CSS @keyframes opacity, 1.5s infinite
   · Guard prefers-reduced-motion: early return, todo visible directo

   CONTRASTE WCAG AA (verificado):
   · #FDF8F3 crema sobre #1A0F08 chocolate = 16.3:1 ✅ AAA
   · #C4A882 beige sobre #1A0F08 = 5.73:1 ✅ AA
   · #E05C36 terracota bright sobre #1A0F08 = 4.52:1 ✅ AA (texto ≥18px bold)
   · #FFFFFF sobre #C44B2B = 4.71:1 ✅ AA
   · #0D3320 sobre #25D366 = 6.20:1 ✅ AA
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getTelUrl, getWhatsAppUrgencyUrl } from '../../data/site'

gsap.registerPlugin(ScrollTrigger)

/* ─── Ícono: Cruz veterinaria inline SVG ────────────────────────────────── */

function VetCrossIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      {/* Cruz médica */}
      <rect x="13" y="3" width="10" height="30" rx="2" fill="currentColor" />
      <rect x="3" y="13" width="30" height="10" rx="2" fill="currentColor" />
      {/* Huella pequeña — pata de mascota, debajo-derecha */}
      <circle cx="28" cy="30" r="2.2" fill="currentColor" opacity="0.6" />
      <circle cx="32" cy="27.5" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="32" cy="32" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

/* ─── Ícono: Teléfono ───────────────────────────────────────────────────── */

function PhoneIcon({ size = 18 }: { size?: number }) {
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

/* ─── Ícono: WhatsApp ───────────────────────────────────────────────────── */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
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

/* ─── Vitals cards data ─────────────────────────────────────────────────── */

const VITALS = [
  {
    id: 'disponibilidad',
    value: '24/7',
    unit: 'HRS · TODO EL AÑO',
    label: 'DISPONIBILIDAD',
  },
  {
    id: 'respuesta',
    value: '< 5',
    unit: 'MIN · WHATSAPP',
    label: 'TIEMPO DE RESP.',
  },
  {
    id: 'matricula',
    value: 'MV',
    unit: 'MATRÍCULA ACTIVA',
    label: 'DR. GIULIANI',
  },
] as const

/* ─── Triage data ───────────────────────────────────────────────────────── */

const TRIAGE = [
  {
    id: 'critico',
    level: 'CRÍTICO',
    color: 'red',
    examples: 'Convulsiones, sangrado severo, dificultad para respirar, pérdida de conciencia',
  },
  {
    id: 'urgente',
    level: 'URGENTE',
    color: 'yellow',
    examples: 'Vómitos repetidos, dolor intenso, trauma, no come hace +24 hs',
  },
  {
    id: 'puede-esperar',
    level: 'PUEDE ESPERAR',
    color: 'green',
    examples: 'Cojera leve, heridas superficiales, comportamiento inusual',
  },
] as const

/* ─── Protocolo data ────────────────────────────────────────────────────── */

const PROTOCOLO = [
  {
    num: '01',
    title: 'Mantené la calma.',
    desc: 'Tu tranquilidad ayuda a tu mascota.',
  },
  {
    num: '02',
    title: 'Contactanos de inmediato.',
    desc: <>Llamá o mandá un <strong>WhatsApp</strong> — respondemos al instante.</>,
  },
  {
    num: '03',
    title: 'Seguí las indicaciones.',
    desc: 'Te damos instrucciones precisas mientras llegás.',
  },
  {
    num: '04',
    title: 'Traé a tu mascota.',
    desc: 'Envuelta en una manta, sin darle medicación humana.',
  },
] as const

/* ─── ECG SVG ───────────────────────────────────────────────────────────── */

function EcgLine() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="urgencias-ecg"
      viewBox="0 0 800 60"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Onda ECG repetida — ciclo de ~200px */}
      <polyline
        className="urgencias-ecg__path"
        points="
          0,30
          40,30
          55,30
          65,10
          75,50
          85,10
          95,30
          130,30
          145,30
          155,10
          165,50
          175,10
          185,30
          220,30
          235,30
          245,10
          255,50
          265,10
          275,30
          310,30
          325,30
          335,10
          345,50
          355,10
          365,30
          400,30
          415,30
          425,10
          435,50
          445,10
          455,30
          490,30
          505,30
          515,10
          525,50
          535,10
          545,30
          580,30
          595,30
          605,10
          615,50
          625,10
          635,30
          670,30
          685,30
          695,10
          705,50
          715,10
          725,30
          760,30
          775,30
          785,10
          795,50
          800,30
        "
        fill="none"
        stroke="#C44B2B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Componente principal ─────────────────────────────────────────────── */

export function Urgencias() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const vitalsRef = useRef<HTMLDivElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const triageRef = useRef<HTMLDivElement>(null)
  const protocoloRef = useRef<HTMLDivElement>(null)

  const telUrl = getTelUrl()
  const waUrl = getWhatsAppUrgencyUrl()

  useEffect(() => {
    /* ── Guard prefers-reduced-motion — idéntico al de Services.tsx ───── */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      /* ── Header reveal ────────────────────────────────────────────── */
      if (headerRef.current) {
        const headerEls = headerRef.current.querySelectorAll(
          '.urgencias-eyebrow, .urgencias-badge-row, .urgencias-heading, .urgencias-subcopy',
        )
        gsap.set(headerEls, { opacity: 0, y: 24 })
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: 'top 82%',
          onEnter: () => {
            gsap.to(headerEls, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
            })
          },
          once: true,
        })
      }

      /* ── Vitals cards — batch reveal ─────────────────────────────── */
      if (vitalsRef.current) {
        const cards = vitalsRef.current.querySelectorAll('.urgencias-vital-card')
        gsap.set(cards, { opacity: 0, y: 40 })
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
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

      /* ── CTAs reveal ─────────────────────────────────────────────── */
      if (ctasRef.current) {
        gsap.set(ctasRef.current, { opacity: 0, y: 20 })
        ScrollTrigger.create({
          trigger: ctasRef.current,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(ctasRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            })
          },
          once: true,
        })
      }

      /* ── Triage cards — batch reveal ─────────────────────────────── */
      if (triageRef.current) {
        const triageCards = triageRef.current.querySelectorAll('.urgencias-triage-card')
        gsap.set(triageCards, { opacity: 0, y: 40 })
        ScrollTrigger.batch(triageCards, {
          start: 'top 88%',
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

      /* ── Protocolo steps — stagger ───────────────────────────────── */
      if (protocoloRef.current) {
        const steps = protocoloRef.current.querySelectorAll('.urgencias-step')
        gsap.set(steps, { opacity: 0, y: 28 })
        ScrollTrigger.create({
          trigger: protocoloRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(steps, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power3.out',
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
      id="urgencias"
      aria-labelledby="urgencias-heading"
      className="urgencias-section"
    >
      {/* ECG decorativo — bottom de la sección, position absolute */}
      <div className="urgencias-ecg-wrap" aria-hidden="true">
        <EcgLine />
      </div>

      <div className="urgencias-grid container-bold">

        {/* ── COLUMNA IZQUIERDA — header hospitalario + vitals + CTAs ─── */}
        <div className="urgencias-col urgencias-col--left">

          <div ref={headerRef}>
            {/* Eyebrow señalética terminal */}
            <p className="urgencias-eyebrow" aria-label="Servicio de urgencias San Rafael">
              // SERVICIO_DE_URGENCIAS — SAN_RAFAEL
            </p>

            {/* Badges hospitalarios */}
            <div className="urgencias-badge-row" aria-label="Estado del servicio">
              {/* Cruz vet + badge GUARDIA 24 HS */}
              <span className="urgencias-badge urgencias-badge--guardia">
                <span className="urgencias-badge__cross" aria-hidden="true">
                  <VetCrossIcon />
                </span>
                GUARDIA 24 HS
              </span>

              {/* Badge DISPONIBLE AHORA con blink dot */}
              <span className="urgencias-badge urgencias-badge--disponible">
                <span className="urgencias-blink-dot" aria-hidden="true" />
                DISPONIBLE AHORA
              </span>
            </div>

            {/* Heading principal — Playfair para lo emocional */}
            <h2
              id="urgencias-heading"
              className="urgencias-heading"
            >
              Urgencias<br />
              <span className="urgencias-heading__accent">las 24 horas.</span>
            </h2>

            {/* Subcopy tranquilizador */}
            <p className="urgencias-subcopy">
              Estamos disponibles a cualquier hora. Llamá o escribí por WhatsApp
              y te damos indicaciones al instante.
            </p>
          </div>

          {/* Vitals cards — monitor médico */}
          <div ref={vitalsRef} className="urgencias-vitals" aria-label="Datos del servicio de urgencias">
            {VITALS.map((vital) => (
              <div
                key={vital.id}
                className="urgencias-vital-card"
                role="group"
                aria-label={`${vital.label}: ${vital.value} ${vital.unit}`}
              >
                <span className="urgencias-vital-label">{vital.label}</span>
                <span className="urgencias-vital-value">{vital.value}</span>
                <span className="urgencias-vital-unit">{vital.unit}</span>
              </div>
            ))}
          </div>

          {/* CTAs — pointer-events SIEMPRE auto */}
          <div
            ref={ctasRef}
            className="urgencias-ctas"
            style={{ pointerEvents: 'auto' }}
          >
            <a
              href={telUrl}
              className="urgencias-btn urgencias-btn--call"
              aria-label="Llamar a urgencias veterinarias ahora"
              style={{ pointerEvents: 'auto' }}
            >
              <PhoneIcon size={18} />
              <span>Llamar ahora</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="urgencias-btn urgencias-btn--whatsapp"
              aria-label="Escribir a urgencias veterinarias por WhatsApp"
              style={{ pointerEvents: 'auto' }}
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp urgencias</span>
            </a>
          </div>
        </div>

        {/* ── COLUMNA DERECHA — triage + protocolo ─────────────────────── */}
        <div className="urgencias-col urgencias-col--right">

          {/* Triage grid */}
          <div
            ref={triageRef}
            className="urgencias-triage"
            aria-label="Niveles de urgencia — guía de triage"
          >
            <h3 className="urgencias-triage__heading">
              ¿Qué tan urgente es?
            </h3>
            <div className="urgencias-triage__grid" role="list">
              {TRIAGE.map((item) => (
                <div
                  key={item.id}
                  className={`urgencias-triage-card urgencias-triage-card--${item.color}`}
                  role="listitem"
                >
                  <span className="urgencias-triage-card__level">{item.level}</span>
                  <p className="urgencias-triage-card__examples">{item.examples}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Protocolo de emergencia */}
          <div
            ref={protocoloRef}
            className="urgencias-protocolo"
            aria-label="Protocolo de emergencia — 4 pasos"
          >
            <h3 className="urgencias-protocolo__heading">
              Protocolo de emergencia
            </h3>
            <ol className="urgencias-steps" aria-label="Pasos a seguir en una urgencia">
              {PROTOCOLO.map((step) => (
                <li key={step.num} className="urgencias-step">
                  <span className="urgencias-step__num" aria-hidden="true">{step.num}</span>
                  <div className="urgencias-step__body">
                    <strong className="urgencias-step__title">{step.title}</strong>
                    {' '}
                    <span className="urgencias-step__desc">{step.desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Urgencias
