/* ──────────────────────────────────────────────────────────────────────────
   useLenis.ts — Hook React para inicializar y acceder a Lenis

   - Inicializa Lenis una sola vez al montar (con guard reduced-motion)
   - Escucha cambios en prefers-reduced-motion en tiempo real
   - Expone la instancia para componentes que necesiten scrollTo programático
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react'
import type Lenis from 'lenis'
import {
  initLenis,
  destroyLenis,
  prefersReducedMotion,
} from '../lib/lenis'

interface UseLenisReturn {
  /** Instancia de Lenis (null si reduced-motion está activo) */
  lenis: Lenis | null
  /** Si Lenis está activo (false bajo prefers-reduced-motion) */
  isActive: boolean
}

/**
 * Inicializa Lenis smooth scroll con integración GSAP ScrollTrigger.
 * Debe llamarse UNA SOLA VEZ en el componente raíz (App.tsx).
 *
 * Guard prefers-reduced-motion:
 * - Si está activo al montar → Lenis no se instancia
 * - Si cambia en tiempo real → Lenis se destruye o se inicia en consecuencia
 */
export function useLenis(): UseLenisReturn {
  // Lazy initializer: evalúa una sola vez en el montaje inicial.
  // Evita llamar setState() síncrono dentro de useEffect (react-hooks/set-state-in-effect).
  const [lenis, setLenis] = useState<Lenis | null>(() => initLenis())
  const mqlRef = useRef<MediaQueryList | null>(null)

  // Derivar isActive del estado de lenis (no necesita estado separado)
  const isActive = lenis !== null

  useEffect(() => {
    // Escuchar cambios en prefers-reduced-motion en tiempo real
    // (el usuario puede cambiar la preferencia mientras usa el sitio)
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqlRef.current = mql

    const handleMotionChange = () => {
      if (prefersReducedMotion()) {
        // El usuario activó reduced-motion → destruir Lenis
        destroyLenis()
        setLenis(null)
      } else {
        // El usuario desactivó reduced-motion → inicializar Lenis
        setLenis(initLenis())
      }
    }

    mql.addEventListener('change', handleMotionChange)

    return () => {
      mql.removeEventListener('change', handleMotionChange)
      destroyLenis()
    }
  }, [])

  return { lenis, isActive }
}
