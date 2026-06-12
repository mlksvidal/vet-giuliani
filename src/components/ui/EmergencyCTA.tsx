/* ──────────────────────────────────────────────────────────────────────────
   EmergencyCTA.tsx — Barra/FAB de urgencias persistente
   Siempre visible en el primer viewport. Nunca bloqueado por animaciones.

   Spec (design-system #873 / tarea-2 #862):
   - z-index: var(--z-emergency) = 1040
   - Mobile (<768px): barra fija inferior, full-width, 2 botones lado a lado
   - Desktop (≥768px): floating pill bottom-right
   - Slide-up al mount, ANTES de cualquier GSAP timeline
   - pointer-events: auto SIEMPRE — ningún overlay bloquea el toque/clic
   - WhatsApp: bg #25D366, texto #2C1A0E (contraste 6.20:1 ✅ WCAG AA)
   - Llamar: bg #C44B2B (terracota), texto #FFFFFF (4.87:1 ✅ WCAG AA)
   - Tap targets ≥44x44px (barra mobile = 64px height)
   - Pulso sutil en botón llamar — envuelto en prefers-reduced-motion: no-preference
   - prefers-reduced-motion: sin slide-up, sin pulso, aparece directo
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { getTelUrl, getWhatsAppUrgencyUrl } from '../../data/site'

/* ─── Íconos inline SVG (sin dependencia externa) ─────────────────────── */

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
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

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

/* ─── Componente principal ─────────────────────────────────────────────── */

export function EmergencyCTA() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // Respetar prefers-reduced-motion.
    // Bajo reduce: quitar la clase hidden directamente (sin transición) → CTA visible
    // Normal: slide-up con cubic-bezier antes de cualquier GSAP
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      bar.classList.remove('emergency-cta-bar--hidden')
      return
    }

    // Slide-up enhancement — ocurre en el primer render, antes de GSAP
    // Un requestAnimationFrame garantiza que el navegador pintó el estado inicial
    // (translateY(100%) del --hidden) antes de iniciar la transición CSS.
    //
    // FIX (2026-06-11): el pulso (--pulsing) se aplica en una clase SEPARADA
    // con setTimeout DESPUÉS de que la transición termina (~420ms).
    // Tener 'animation' y 'transition' en la misma regla CSS hace que el browser
    // recalcule la cascade en cada frame del keyframe y reinicie la transición,
    // dejando opacity≈0.21 + translateY(36px) congelados para siempre.
    let pulseTimer: ReturnType<typeof setTimeout> | null = null

    const runSlideUp = () => {
      requestAnimationFrame(() => {
        bar.classList.remove('emergency-cta-bar--hidden')
        bar.classList.add('emergency-cta-bar--visible')

        // Agregar pulso solo DESPUÉS de que la transición CSS termina.
        // La transición más larga es transform: 400ms. Damos 20ms de margen.
        pulseTimer = setTimeout(() => {
          bar.classList.add('emergency-cta-bar--pulsing')
        }, 420)
      })
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runSlideUp, { once: true })
    } else {
      runSlideUp()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', runSlideUp)
      if (pulseTimer !== null) clearTimeout(pulseTimer)
    }
  }, [])

  const telUrl = getTelUrl()
  const waUrl = getWhatsAppUrgencyUrl()

  return (
    /*
     * Renderizado como FUERA del flujo de secciones (ver App.tsx):
     * position: fixed garantiza que ningún overflow o stacking context
     * del contenido principal lo tape — z-emergency: 1040.
     *
     * Estado inicial: emergency-cta-bar--hidden (translateY(100%) via CSS)
     * → JS quita la clase y agrega --visible (translateY(0) + transición)
     * → Si JS falla: el CSS del --hidden mantiene el CTA oculto pero
     *   el noscript fallback (index.html) avisa al usuario.
     *   En SSR/prerendering con JS desactivado, el CTA es accesible via
     *   el footer de contacto (Tarea 6).
     *
     * pointer-events: auto SIEMPRE (no sobreescribir ni con JS)
     */
    <div
      ref={barRef}
      role="complementary"
      aria-label="Contacto de urgencias veterinarias"
      className="emergency-cta-bar emergency-cta-bar--hidden"
    >
      {/* ── Botón Llamar ────────────────────────────────────────────────── */}
      <a
        href={telUrl}
        className="emergency-cta-btn emergency-cta-btn--call"
        aria-label="Llamar a urgencias veterinarias"
      >
        <PhoneIcon />
        <span className="emergency-cta-btn__label">Llamar urgencias</span>
        <span className="emergency-cta-btn__sub">24 h · Dr. Giuliani</span>
      </a>

      {/* ── Divider vertical ────────────────────────────────────────────── */}
      <div className="emergency-cta-divider" aria-hidden="true" />

      {/* ── Botón WhatsApp ──────────────────────────────────────────────── */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="emergency-cta-btn emergency-cta-btn--whatsapp"
        aria-label="Escribir a urgencias por WhatsApp"
      >
        <WhatsAppIcon />
        <span className="emergency-cta-btn__label">WhatsApp</span>
        <span className="emergency-cta-btn__sub">Respuesta rápida</span>
      </a>
    </div>
  )
}

export default EmergencyCTA
