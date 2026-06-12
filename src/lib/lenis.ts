/* ──────────────────────────────────────────────────────────────────────────
   lenis.ts — Setup de Lenis smooth scroll + integración GSAP ScrollTrigger

   Respeta prefers-reduced-motion: si el usuario tiene activada la preferencia
   de movimiento reducido, Lenis NO se instancia y el scroll nativo se usa.
   ────────────────────────────────────────────────────────────────────────── */

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar plugins GSAP una sola vez
gsap.registerPlugin(ScrollTrigger)

/** Singleton de la instancia de Lenis */
let lenisInstance: Lenis | null = null

/** Referencia al callback del GSAP ticker — necesaria para poder removerlo */
let gsapTickerCallback: ((time: number) => void) | null = null

/** Verifica si el usuario prefiere movimiento reducido */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Inicializa Lenis con las configuraciones del proyecto.
 * - Si prefers-reduced-motion está activo: no instancia Lenis (scroll nativo).
 * - Integra Lenis con GSAP ticker para que ScrollTrigger funcione
 *   correctamente con smooth scroll.
 *
 * @returns La instancia de Lenis o null si está deshabilitado.
 */
export function initLenis(): Lenis | null {
  // Guard: no instanciar en entornos sin window (SSR safety)
  if (typeof window === 'undefined') return null

  // Guard: flag de QA `?nolenis` — desactiva el smooth-scroll para que el scroll
  // nativo/programático no sea interceptado (necesario para screenshots y automation).
  // Reusa el mismo camino que reduced-motion: ScrollTrigger lee el scroll de window.
  if (new URLSearchParams(window.location.search).has('nolenis')) {
    ScrollTrigger.defaults({ scroller: window })
    return null
  }

  // Guard: respetar prefers-reduced-motion
  if (prefersReducedMotion()) {
    // Asegurar que ScrollTrigger siga funcionando sin Lenis
    ScrollTrigger.defaults({ scroller: window })
    return null
  }

  // Destruir instancia previa si existe (hot-reload en dev)
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }

  const lenis = new Lenis({
    // Duración del smooth scroll (0 = instantáneo, 1.2 = fluido/lujoso)
    duration: 1.2,
    // Easing del scroll — coincide con --ease-primary del design system
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // Suaviza el touchpad en desktop también
    smoothWheel: true,
    // Wheel multiplier — velocidad natural en desktop
    wheelMultiplier: 1,
    // Touch multiplier — táctil en mobile
    touchMultiplier: 2,
  })

  // Integrar Lenis con GSAP ScrollTrigger via lenis.on('scroll')
  lenis.on('scroll', ScrollTrigger.update)

  // Conectar Lenis al gsap.ticker para RAF sincronizado.
  // Guardar referencia para poder removerlo en destroyLenis().
  gsapTickerCallback = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(gsapTickerCallback)

  // Desactivar el lagSmoothing de GSAP para evitar jank con Lenis
  gsap.ticker.lagSmoothing(0)

  lenisInstance = lenis
  return lenis
}

/**
 * Destruye la instancia de Lenis y limpia el ticker de GSAP.
 * Llamar en cleanup de React (useEffect return).
 */
export function destroyLenis(): void {
  if (!lenisInstance) return

  lenisInstance.destroy()
  lenisInstance = null

  // Remover el callback del GSAP ticker usando la referencia guardada
  if (gsapTickerCallback) {
    gsap.ticker.remove(gsapTickerCallback)
    gsapTickerCallback = null
  }
}

/**
 * Retorna la instancia de Lenis activa o null.
 * Útil para componentes que necesitan acceso a la instancia
 * (ej: anclas con scroll programático).
 */
export function getLenis(): Lenis | null {
  return lenisInstance
}

/**
 * Hace scroll suave a un elemento o posición.
 * Si Lenis no está activo (reduced motion), usa scrollIntoView nativo.
 *
 * @param target - Selector CSS, HTMLElement o posición numérica (Y)
 * @param offsetY - Offset adicional en píxeles (para nav fija)
 */
export function scrollTo(target: string | HTMLElement | number, offsetY = 0): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -offsetY, duration: 0.9 })
  } else {
    // Fallback scroll nativo
    if (typeof target === 'string') {
      const el = document.querySelector(target)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - offsetY
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } else if (target instanceof HTMLElement) {
      const y = target.getBoundingClientRect().top + window.scrollY - offsetY
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }
}
