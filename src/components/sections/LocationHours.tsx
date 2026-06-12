/* ──────────────────────────────────────────────────────────────────────────
   LocationHours.tsx — Sección Ubicación + Horarios (Tarea 5)
   Spec: design-system #873 · tareas #862 (Tarea 5)

   LAYOUT:
   · Encabezado centrado + grid 2 columnas en desktop (dirección/horarios | mapa)
   · Mobile: columna única, mapa al fondo
   · iframe Google Maps con site.mapsQuery, loading=lazy, "ubicación aproximada"

   MOTION (motion_intensity 9, density 5 — elegante):
   · Fade-up stagger: header → cards de info → mapa
   · Guard prefers-reduced-motion: estado final sin animar

   PLACEHOLDER DATA:
   · Dirección: site.address — marcada visiblemente
   · Horarios: site.hours — marcados con nota de confirmación
   · mapsQuery: site.mapsQuery — marcado "ubicación aproximada"
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site, getTelUrl, getWhatsAppUrl } from '../../data/site'
import type { HoursEntry } from '../../types'

gsap.registerPlugin(ScrollTrigger)

/* ─── Íconos inline SVG ─────────────────────────────────────────────────── */

function MapPinIcon({ size = 20 }: { size?: number }) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon({ size = 20 }: { size?: number }) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function NavigationIcon({ size = 16 }: { size?: number }) {
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
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  )
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
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

/* ─── Helper: formato legible de hora ───────────────────────────────────── */
function formatHour(entry: HoursEntry): string {
  if (entry.isEmergency) return '24 horas'
  return `${entry.open} – ${entry.close}`
}

/* ─── Componente principal ─────────────────────────────────────────────── */

export function LocationHours() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const infoColRef = useRef<HTMLDivElement>(null)
  const mapColRef = useRef<HTMLDivElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)

  /* URL de cómo llegar: Google Maps dirección en query */
  const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`
  const waGeneralUrl = getWhatsAppUrl(site.whatsappGeneralMessage)
  const telUrl = getTelUrl()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const els = [
      headerRef.current,
      infoColRef.current,
      mapColRef.current,
      ctasRef.current,
    ].filter(Boolean) as HTMLElement[]

    if (prefersReduced) {
      els.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(els, { opacity: 0, y: 32 })

      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ubicacion"
      aria-labelledby="location-heading"
      className="location-section section-pad"
    >
      <div className="container-bold">

        {/* ── Encabezado ──────────────────────────────────────────────── */}
        <div ref={headerRef} className="location-header" style={{ opacity: 0 }}>
          <p className="eyebrow location-eyebrow">Dónde encontrarnos</p>
          <h2 id="location-heading" className="location-heading">
            Ubicación y horarios
          </h2>
          <p className="location-subhead">
            Estamos en San Rafael, Mendoza. Ante cualquier duda, escribinos o llamá directo.
          </p>
        </div>

        {/* ── Grid info + mapa ─────────────────────────────────────────── */}
        <div className="location-grid">

          {/* ── Columna info: dirección + horarios ──────────────────────── */}
          <div ref={infoColRef} className="location-info-col" style={{ opacity: 0 }}>

            {/* Card dirección */}
            <div className="location-card">
              <div className="location-card__icon-wrap" aria-hidden="true">
                <MapPinIcon size={22} />
              </div>
              <div className="location-card__body">
                <h3 className="location-card__title">Dirección</h3>
                <p className="location-card__text">
                  {site.address}
                </p>
              </div>
            </div>

            {/* Card horarios */}
            <div className="location-card">
              <div className="location-card__icon-wrap" aria-hidden="true">
                <ClockIcon size={22} />
              </div>
              <div className="location-card__body">
                <h3 className="location-card__title">Horarios de atención</h3>
                <table className="location-hours-table" aria-label="Horarios de atención veterinaria">
                  <tbody>
                    {site.hours.map((entry, idx) => (
                      <tr
                        key={idx}
                        className={`location-hours-row${entry.isEmergency ? ' location-hours-row--emergency' : ''}`}
                      >
                        <td className="location-hours-days">{entry.days}</td>
                        <td className="location-hours-time mono-data">
                          {formatHour(entry)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTAs cómo llegar + WhatsApp */}
            <div ref={ctasRef} className="location-ctas" style={{ opacity: 0 }}>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="location-btn location-btn--directions"
                aria-label="Ver cómo llegar en Google Maps"
              >
                <NavigationIcon size={16} />
                Cómo llegar
              </a>
              <a
                href={waGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="location-btn location-btn--whatsapp"
                aria-label="Consultar por WhatsApp"
              >
                <WhatsAppIcon size={16} />
                Consultar por WhatsApp
              </a>
              <a
                href={telUrl}
                className="location-btn location-btn--phone"
                aria-label="Llamar a la veterinaria"
              >
                {site.phone.display}
              </a>
            </div>

          </div>

          {/* ── Columna mapa ──────────────────────────────────────────────── */}
          <div ref={mapColRef} className="location-map-col" style={{ opacity: 0 }}>
            <div className="location-map-wrapper">
              {/* Nota de ubicación aproximada visible antes del iframe */}
              <p className="location-map-note" role="note">
                Ubicación en San Rafael, Mendoza.
              </p>
              <iframe
                title={`Mapa de ubicación de ${site.businessName} en ${site.city}`}
                className="location-map-iframe"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed&z=14`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                aria-label={`Mapa de ${site.businessName} en ${site.city} — ubicación aproximada`}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default LocationHours
