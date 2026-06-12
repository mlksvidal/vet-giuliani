/* ──────────────────────────────────────────────────────────────────────────
   tarea3.test.tsx — Tests para Tarea 3: Hero
   Criterios verificados:
   - Renderiza sin errores
   - Heading h1 con aria-label completo (screen readers)
   - Badge urgencias 24h presente
   - CTA tel: y wa.me funcionales con pointer-events:auto
   - prefers-reduced-motion: renderiza sin lanzar errores
   - Coherencia con site.ts
   ────────────────────────────────────────────────────────────────────────── */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '../components/sections/Hero'
import { site } from '../data/site'

/* ── Mock GSAP completo (jsdom no soporta animaciones ni matchMedia) ───── */
vi.mock('gsap', async () => {
  /* Stub mínimo — devuelve el mismo objeto en chainable */
  const noop = () => {}
  const chainable = {
    to: () => chainable,
    from: () => chainable,
    fromTo: () => chainable,
    set: () => chainable,
    kill: noop,
    revert: noop,
  }

  return {
    gsap: {
      registerPlugin: noop,
      context: (fn: () => void) => {
        fn()
        return { revert: noop }
      },
      set: noop,
      timeline: () => ({
        to: function () { return this },
        from: function () { return this },
        fromTo: function () { return this },
      }),
      to: noop,
      matchMedia: () => ({
        add: (_query: string, fn: () => void) => { fn() },
      }),
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
}))

/* ── Mock matchMedia ────────────────────────────────────────────────────── */
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((_query: string) => ({
      matches,
      media: _query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

beforeEach(() => {
  mockMatchMedia(false) // prefers-reduced-motion: no-preference
})

afterEach(() => {
  vi.restoreAllMocks()
})

/* ── Tests ─────────────────────────────────────────────────────────────── */

describe('Hero — renderizado base', () => {
  it('renderiza el componente sin errores', () => {
    render(<Hero />)
    const section = screen.getByRole('region', { name: /inicio/i })
    expect(section).toBeInTheDocument()
  })

  it('contiene heading h1 con aria-label descriptivo', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    const label = heading.getAttribute('aria-label')
    expect(label).toBeTruthy()
    expect(label).toMatch(/mascota|cuidado|luciano/i)
  })

  it('badge urgencias 24h está presente y visible en el DOM', () => {
    render(<Hero />)
    // El badge tiene role="note" y aria-label sobre urgencias 24h
    const badge = screen.getByRole('note', { name: /urgencias/i })
    expect(badge).toBeInTheDocument()
  })

  it('contiene el eyebrow de localización del veterinario', () => {
    render(<Hero />)
    // Múltiples elementos pueden mencionar San Rafael — verificar que al menos uno existe
    const sanRafaelEls = screen.getAllByText(/San Rafael/i)
    expect(sanRafaelEls.length).toBeGreaterThan(0)
  })
})

describe('Hero — CTAs de urgencia (anti-pattern crítico)', () => {
  it('contiene un link tel: con el número e164 del site', () => {
    render(<Hero />)
    // Buscar por href en lugar de aria-label para evitar dependencia de texto exacto
    const telLinks = document.querySelectorAll(`a[href="tel:${site.phone.e164}"]`)
    expect(telLinks.length).toBeGreaterThan(0)
  })

  it('contiene un link wa.me con el número e164 del site', () => {
    render(<Hero />)
    const e164Digits = site.whatsapp.e164.replace('+', '')
    const waLinks = document.querySelectorAll(`a[href*="wa.me/${e164Digits}"]`)
    expect(waLinks.length).toBeGreaterThan(0)
  })

  it('el link wa.me incluye parámetro ?text= de urgencia', () => {
    render(<Hero />)
    const waLink = document.querySelector('a[href*="wa.me/"]') as HTMLAnchorElement | null
    expect(waLink).toBeTruthy()
    expect(waLink?.getAttribute('href')).toContain('?text=')
  })

  it('el link de WhatsApp tiene target="_blank" y rel="noopener noreferrer"', () => {
    render(<Hero />)
    const waLink = document.querySelector('a[href*="wa.me/"]') as HTMLAnchorElement | null
    expect(waLink).toBeTruthy()
    expect(waLink?.getAttribute('target')).toBe('_blank')
    expect(waLink?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('el contenedor de CTAs tiene pointer-events: auto (nunca bloqueados)', () => {
    render(<Hero />)
    const heroSection = screen.getByRole('region', { name: /inicio/i })
    const ctaDiv = heroSection.querySelector('.hero-ctas') as HTMLElement | null
    expect(ctaDiv).toBeTruthy()
    expect(ctaDiv?.style.pointerEvents).toBe('auto')
  })

  it('los CTAs tienen href funcionales desde el primer render (no requieren JS)', () => {
    render(<Hero />)
    const telLink = document.querySelector(`a[href^="tel:"]`) as HTMLAnchorElement | null
    const waLink = document.querySelector(`a[href*="wa.me/"]`) as HTMLAnchorElement | null
    expect(telLink?.getAttribute('href')).toBeTruthy()
    expect(waLink?.getAttribute('href')).toBeTruthy()
  })
})

describe('Hero — coherencia con site.ts', () => {
  it('muestra el subtexto con el nombre del veterinario', () => {
    render(<Hero />)
    // Puede aparecer en múltiples elementos (subcopy y trust line)
    const lucianoEls = screen.getAllByText(/luciano giuliani/i)
    expect(lucianoEls.length).toBeGreaterThan(0)
  })

  it('el botón de llamada usa site.copy.callToAction', () => {
    render(<Hero />)
    expect(screen.getByText(site.copy.callToAction)).toBeInTheDocument()
  })

  it('el botón de WhatsApp usa site.copy.whatsappCTA', () => {
    render(<Hero />)
    expect(screen.getByText(site.copy.whatsappCTA)).toBeInTheDocument()
  })

  it('muestra la trust line de site.copy.trustLine', () => {
    render(<Hero />)
    expect(screen.getByText(site.copy.trustLine)).toBeInTheDocument()
  })

  it('los números no son strings hardcodeados (vienen de site.ts)', () => {
    render(<Hero />)
    const telLink = document.querySelector(`a[href="tel:${site.phone.e164}"]`)
    expect(telLink).toBeTruthy()
    // Verificar que el número contiene el código de país argentino
    expect(site.phone.e164).toContain('+549')
  })
})

describe('Hero — accesibilidad', () => {
  it('los links de urgencias tienen aria-labels descriptivos', () => {
    render(<Hero />)
    const telLink = document.querySelector(`a[href^="tel:"]`) as HTMLAnchorElement | null
    const waLink = document.querySelector(`a[href*="wa.me/"]`) as HTMLAnchorElement | null
    expect(telLink?.getAttribute('aria-label')).toBeTruthy()
    expect(waLink?.getAttribute('aria-label')).toBeTruthy()
  })

  it('la sección tiene aria-label de región', () => {
    render(<Hero />)
    const section = screen.getByRole('region', { name: /inicio/i })
    expect(section.getAttribute('aria-label')).toBeTruthy()
  })

  it('contiene <img> con src hero.webp — estado aprobado por el usuario', () => {
    render(<Hero />)
    const img = document.querySelector('img[src*="hero.webp"]') as HTMLImageElement | null
    expect(img).toBeTruthy()
    // width y height explícitos para prevenir CLS
    expect(img?.getAttribute('width')).toBeTruthy()
    expect(img?.getAttribute('height')).toBeTruthy()
    // Carga eager para LCP
    expect(img?.getAttribute('loading')).toBe('eager')
    // Alt descriptivo (no vacío)
    expect(img?.getAttribute('alt')?.length).toBeGreaterThan(0)
  })

  it('contiene las formas orgánicas de fondo (parallax targets)', () => {
    render(<Hero />)
    const section = screen.getByRole('region', { name: /inicio/i })
    // El fondo oscuro usa .hero-shapes con .hero-shape--1/2/3
    expect(section.querySelector('.hero-shapes')).toBeTruthy()
    expect(section.querySelector('.hero-shape--1')).toBeTruthy()
    expect(section.querySelector('.hero-shape--2')).toBeTruthy()
    expect(section.querySelector('.hero-shape--3')).toBeTruthy()
  })
})

describe('Hero — prefers-reduced-motion', () => {
  it('bajo reduced-motion el Hero renderiza sin errores', () => {
    mockMatchMedia(true) // prefers-reduced-motion: reduce
    expect(() => render(<Hero />)).not.toThrow()
  })

  it('bajo reduced-motion los CTAs siguen siendo accesibles', () => {
    mockMatchMedia(true)
    render(<Hero />)
    const telLink = document.querySelector(`a[href^="tel:"]`)
    const waLink = document.querySelector(`a[href*="wa.me/"]`)
    expect(telLink).toBeTruthy()
    expect(waLink).toBeTruthy()
  })
})

describe('Hero — no usa recursos externos prohibidos', () => {
  it('no tiene links a picsum.photos ni unsplash (placeholders ok)', () => {
    render(<Hero />)
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      expect(img.getAttribute('src')).not.toContain('picsum')
      expect(img.getAttribute('src')).not.toContain('unsplash')
    })
  })

  it('no tiene colores teal hardcodeados en inline styles', () => {
    render(<Hero />)
    const section = screen.getByRole('region', { name: /inicio/i })
    // Verificar que el style inline no tiene teal ni cyan
    const html = section.innerHTML
    expect(html).not.toContain('#0D9488')
    expect(html).not.toContain('#14B8A6')
    expect(html).not.toContain('teal')
  })
})
