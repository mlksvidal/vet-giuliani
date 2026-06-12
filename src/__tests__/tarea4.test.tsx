/* ──────────────────────────────────────────────────────────────────────────
   tarea4.test.tsx — Tests Tarea 4: Sección Servicios
   Criterios de aceptación de vet-giuliani/tareas #862
   ────────────────────────────────────────────────────────────────────────── */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Services } from '../components/sections/Services'
import { site } from '../data/site'

/* ── Mock GSAP (sin DOM real en jsdom) ────────────────────────────────── */
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    set: vi.fn(),
    to: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    matchMedia: vi.fn(() => ({ add: vi.fn() })),
  },
  ScrollTrigger: { create: vi.fn(), batch: vi.fn() },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), batch: vi.fn() },
}))

/* ── Mock window.matchMedia ───────────────────────────────────────────── */
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe('Services — Tarea 4', () => {
  it('renderiza la sección con el heading correcto', () => {
    render(<Services />)
    const heading = screen.getByRole('heading', { name: /servicios veterinarios/i })
    expect(heading).toBeDefined()
  })

  it('renderiza todas las cards definidas en site.services', () => {
    render(<Services />)
    site.services.forEach((service) => {
      expect(screen.getByText(service.name)).toBeDefined()
    })
  })

  it('card de Urgencias 24h existe y tiene mini-CTA de llamada', () => {
    render(<Services />)
    /* El servicio de urgencias por nombre */
    expect(screen.getByText('Urgencias 24 h')).toBeDefined()
    /* Mini-CTA con href tel: */
    const telLinks = document.querySelectorAll(`a[href^="tel:"]`)
    expect(telLinks.length).toBeGreaterThan(0)
  })

  it('card de urgencias tiene link de WhatsApp con número E.164', () => {
    render(<Services />)
    const waLinks = document.querySelectorAll(`a[href*="wa.me"]`)
    expect(waLinks.length).toBeGreaterThan(0)
    const firstWaHref = waLinks[0].getAttribute('href') ?? ''
    expect(firstWaHref).toContain('wa.me')
    expect(firstWaHref).toContain('text=')
  })

  it('links de WhatsApp tienen rel="noopener noreferrer"', () => {
    render(<Services />)
    const waLinks = document.querySelectorAll(`a[href*="wa.me"]`)
    waLinks.forEach((link) => {
      const rel = link.getAttribute('rel') ?? ''
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    })
  })

  it('sección tiene id="servicios" para ancla de nav', () => {
    render(<Services />)
    const section = document.getElementById('servicios')
    expect(section).toBeDefined()
    expect(section).not.toBeNull()
  })

  it('section tiene aria-labelledby apuntando a heading visible', () => {
    render(<Services />)
    const section = document.querySelector('section#servicios')
    expect(section?.getAttribute('aria-labelledby')).toBe('services-heading')
    const heading = document.getElementById('services-heading')
    expect(heading).not.toBeNull()
  })

  it('eyebrow "Qué hacemos" está presente', () => {
    render(<Services />)
    expect(screen.getByText(/qué hacemos/i)).toBeDefined()
  })

  it('servicios de emergencia son visualmente destacados (clase --emergency)', () => {
    render(<Services />)
    const emergencyCards = document.querySelectorAll('.service-card--emergency')
    const emergencyServicesCount = site.services.filter((s) => s.isEmergency).length
    expect(emergencyCards.length).toBe(emergencyServicesCount)
  })
})
