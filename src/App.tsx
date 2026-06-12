/* ──────────────────────────────────────────────────────────────────────────
   App.tsx — Layout base con Lenis smooth scroll
   Estructura semántica: header / main / footer slots
   Lenis inicializado aquí (una sola vez, siguiendo advanced-init-once)
   ────────────────────────────────────────────────────────────────────────── */

import { useLenis } from './hooks/useLenis'
import { EmergencyCTA } from './components/ui/EmergencyCTA'
import { Nav } from './components/ui/Nav'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { About } from './components/sections/About'
import { LocationHours } from './components/sections/LocationHours'
import { Footer } from './components/sections/Footer'

function App() {
  // Inicializar Lenis con integración GSAP ScrollTrigger.
  // Se desactiva automáticamente si prefers-reduced-motion está activo.
  useLenis()

  return (
    <>
      {/* Skip to content — WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>

      {/* ── Header / Nav ──────────────────────────────────────────────── */}
      <header role="banner">
        <Nav />
      </header>

      {/* ── Contenido principal ───────────────────────────────────────── */}
      <main id="main-content" role="main">
        {/* ── Hero — Tarea 3 ✅ ────────────────────────────────────────── */}
        <Hero />

        {/* ── Servicios — Tarea 4 ✅ ──────────────────────────────────── */}
        <Services />

        {/* ── Sobre Luciano — Tarea 5 ✅ ─────────────────────────── */}
        <About />

        {/* ── Ubicación + Horarios — Tarea 5 ✅ ──────────────────── */}
        <LocationHours />
      </main>

      {/* ── Footer / Contacto — Tarea 6 ✅ ─────────────────────────────── */}
      <Footer />

      {/* ── CTA Urgencias persistente — z-1040, siempre visible ─────── */}
      {/* Renderizado FUERA del main para garantizar que ningún overflow
          o stacking context del contenido lo tape. Portal-like pattern. */}
      <EmergencyCTA />
    </>
  )
}

export default App
