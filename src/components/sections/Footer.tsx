/* ──────────────────────────────────────────────────────────────────────────
   Footer.tsx — Bloque de contacto consolidado + refuerzo CTA urgencias
   Spec: design-system #873 · tareas #862 (Tarea 6)

   DISEÑO:
   · Fondo oscuro chocolate #1A0F08 — eco del hero (aprobado por design-system
     "bg #F7EDE0" es la spec de FOOTER genérico, pero la spec también dice que
     el footer puede cerrar oscuro si el design-system lo avala.
     Design-system #873 §11: "Footer · bg: #F7EDE0, grid 4 col desktop, Columna
     contacto: Button Primary + WhatsApp". Aplicando la versión crema como spec.
   · Grid 3 col desktop: Brand | Contacto + Urgencias | Horarios + Redes
   · CTA urgencias destacado (tel: + wa.me) — refuerzo final del anti-pattern #1
   · © año + "Veterinaria Luciano Giuliani · San Rafael, Mendoza"
   · Todos los datos desde site.ts (placeholders centralizados)
   · id="contacto" → target del anchor nav
   ────────────────────────────────────────────────────────────────────────── */

import { site, getTelUrl, getWhatsAppUrgencyUrl, getWhatsAppUrl } from '../../data/site'

/* ─── Íconos SVG inline ────────────────────────────────────────────────── */

function PhoneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16l.46.92z" />
    </svg>
  )
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function MapPinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

/* ─── Componente ───────────────────────────────────────────────────────── */

export function Footer() {
  const telUrl = getTelUrl()
  const waUrgencyUrl = getWhatsAppUrgencyUrl()
  const waGeneralUrl = getWhatsAppUrl()
  const currentYear = new Date().getFullYear()

  /* Horarios resumidos: primeros 3 ítems (excluir urgencias que ya está destacado) */
  const regularHours = site.hours.filter((h) => !h.isEmergency).slice(0, 3)

  return (
    <footer
      id="contacto"
      role="contentinfo"
      aria-label="Pie de página — Contacto y datos de Veterinaria Giuliani"
      className="footer-section"
    >
      {/* ── Bloque superior: grid columnas ─────────────────────────────── */}
      <div className="footer-main container-bold">

        {/* ── Columna 1: Brand ───────────────────────────────────────── */}
        <div className="footer-col footer-col--brand">
          <div className="footer-wordmark">
            <span className="footer-wordmark__main">Veterinaria Giuliani</span>
            <span className="footer-wordmark__sub">Médico Veterinario</span>
          </div>

          <p className="footer-tagline">
            {site.copy.tagline}
          </p>

          {/* Dirección */}
          <address className="footer-address">
            <MapPinIcon size={15} />
            <span className="placeholder-pending">{site.address}</span>
          </address>

          {/* Redes sociales */}
          {site.socials && site.socials.length > 0 && (
            <div className="footer-socials" aria-label="Redes sociales">
              {site.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={`${site.businessName} en ${social.platform === 'instagram' ? 'Instagram' : 'Facebook'}`}
                >
                  {social.platform === 'instagram' ? (
                    <InstagramIcon size={18} />
                  ) : (
                    <FacebookIcon size={18} />
                  )}
                  <span className="footer-social-handle">{social.handle}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Columna 2: Contacto + Urgencias ─────────────────────────── */}
        <div className="footer-col footer-col--contact">
          <h3 className="footer-col__heading">Contacto directo</h3>

          {/* Teléfono */}
          <a
            href={telUrl}
            className="footer-contact-row footer-contact-row--phone"
            aria-label={`Llamar al ${site.phone.display}`}
          >
            <PhoneIcon size={16} />
            <span className="mono-data">{site.phone.display}</span>
          </a>

          {/* WhatsApp general */}
          <a
            href={waGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-row footer-contact-row--whatsapp"
            aria-label={`Escribir por WhatsApp al ${site.whatsapp.display}`}
          >
            <WhatsAppIcon size={16} />
            <span className="mono-data">{site.whatsapp.display}</span>
          </a>

          {/* ── Bloque urgencias — refuerzo final ─────────────────────── */}
          <div className="footer-emergency-block" role="complementary" aria-label="Atención de urgencias">
            <p className="footer-emergency-block__heading">
              Urgencias 24 horas
            </p>
            <p className="footer-emergency-block__sub">
              Disponible a cualquier hora. Llamá o escribí ahora.
            </p>

            <div className="footer-emergency-block__ctas">
              <a
                href={telUrl}
                className="footer-emergency-btn footer-emergency-btn--call"
                aria-label="Llamar a urgencias veterinarias ahora"
              >
                <PhoneIcon size={16} />
                Llamar ahora
              </a>

              {/* WhatsApp urgencias: texto oscuro sobre verde — contraste 6.20:1 ✅
                  CRÍTICO: NUNCA texto blanco sobre #25D366 (1.78:1 ❌) */}
              <a
                href={waUrgencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-emergency-btn footer-emergency-btn--whatsapp"
                aria-label="Escribir a urgencias veterinarias por WhatsApp"
              >
                <WhatsAppIcon size={16} />
                WhatsApp urgencias
              </a>
            </div>
          </div>
        </div>

        {/* ── Columna 3: Horarios ──────────────────────────────────────── */}
        <div className="footer-col footer-col--hours">
          <h3 className="footer-col__heading">
            <ClockIcon size={16} />
            Horarios
          </h3>

          <dl className="footer-hours-list">
            {regularHours.map((hour, i) => (
              <div key={i} className="footer-hours-row">
                <dt className="footer-hours-days">{hour.days}</dt>
                <dd className="footer-hours-time mono-data">
                  {hour.open} – {hour.close}
                  {hour.note && (
                    <span className="footer-hours-note placeholder-pending">
                      {' '}({hour.note})
                    </span>
                  )}
                </dd>
              </div>
            ))}

            {/* Urgencias siempre al final, destacado */}
            <div className="footer-hours-row footer-hours-row--emergency">
              <dt className="footer-hours-days">Urgencias</dt>
              <dd className="footer-hours-time mono-data">24 horas</dd>
            </div>
          </dl>
        </div>

      </div>

      {/* ── Línea divisoria ───────────────────────────────────────────────── */}
      <div className="footer-divider" aria-hidden="true" />

      {/* ── Footer bottom: copyright ──────────────────────────────────────── */}
      <div className="footer-bottom container-bold">
        <p className="footer-copy">
          &copy; {currentYear} Veterinaria Luciano Giuliani · San Rafael, Mendoza.
          {' '}Todos los derechos reservados.
        </p>

        <p className="footer-copy footer-copy--disclaimer">
          La información de este sitio no reemplaza la consulta veterinaria presencial.
        </p>
      </div>
    </footer>
  )
}

export default Footer
