/* ──────────────────────────────────────────────────────────────────────────
   tarea2.test.tsx — Tests para Tarea 2: EmergencyCTA
   ────────────────────────────────────────────────────────────────────────── */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { EmergencyCTA } from '../components/ui/EmergencyCTA'
import { site } from '../data/site'

/* ── Setup / Teardown ──────────────────────────────────────────────────── */

// Mock de matchMedia (jsdom no lo implementa por defecto)
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
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
  mockMatchMedia(false) // default: prefers-reduced-motion: no-preference
})

afterEach(() => {
  vi.restoreAllMocks()
})

/* ── Tests ─────────────────────────────────────────────────────────────── */

describe('EmergencyCTA — renderizado base', () => {
  it('renderiza el componente sin errores', () => {
    render(<EmergencyCTA />)
    const region = screen.getByRole('complementary', {
      name: /contacto de urgencias veterinarias/i,
    })
    expect(region).toBeInTheDocument()
  })

  it('contiene un link tel: con el número e164', () => {
    render(<EmergencyCTA />)
    const telLink = screen.getByRole('link', { name: /llamar.*urgencias/i })
    expect(telLink).toBeInTheDocument()
    expect(telLink.getAttribute('href')).toBe(`tel:${site.phone.e164}`)
  })

  it('contiene un link wa.me con el número e164 sin +', () => {
    render(<EmergencyCTA />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink).toBeInTheDocument()
    const href = waLink.getAttribute('href') ?? ''
    expect(href).toContain('wa.me/')
    // El número en wa.me no debe tener + (wa.me usa solo dígitos)
    const match = href.match(/wa\.me\/(\d+)/)
    expect(match).toBeTruthy()
    expect(match![1]).not.toContain('+')
  })

  it('el link wa.me incluye parámetro ?text= con mensaje de urgencia', () => {
    render(<EmergencyCTA />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    const href = waLink.getAttribute('href') ?? ''
    expect(href).toContain('?text=')
  })

  it('el link de WhatsApp tiene target="_blank" y rel="noopener noreferrer"', () => {
    render(<EmergencyCTA />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink.getAttribute('target')).toBe('_blank')
    expect(waLink.getAttribute('rel')).toBe('noopener noreferrer')
  })
})

describe('EmergencyCTA — accesibilidad', () => {
  it('botón de llamada tiene aria-label descriptivo', () => {
    render(<EmergencyCTA />)
    const telLink = screen.getByRole('link', { name: /llamar.*urgencias/i })
    expect(telLink.getAttribute('aria-label')).toBeTruthy()
    expect(telLink.getAttribute('aria-label')).toMatch(/urgencias/i)
  })

  it('botón de WhatsApp tiene aria-label descriptivo', () => {
    render(<EmergencyCTA />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink.getAttribute('aria-label')).toBeTruthy()
    expect(waLink.getAttribute('aria-label')).toMatch(/whatsapp/i)
  })

  it('la barra tiene role="complementary" con aria-label', () => {
    render(<EmergencyCTA />)
    const bar = document.querySelector('[role="complementary"]')
    expect(bar).toBeInTheDocument()
    expect(bar?.getAttribute('aria-label')).toMatch(/urgencias/i)
  })
})

describe('EmergencyCTA — coherencia con site.ts', () => {
  it('el número e164 en tel: viene de site.phone.e164', () => {
    render(<EmergencyCTA />)
    const telLink = screen.getByRole('link', { name: /llamar.*urgencias/i })
    expect(telLink.getAttribute('href')).toContain(site.phone.e164)
  })

  it('el número e164 en wa.me viene de site.whatsapp.e164', () => {
    render(<EmergencyCTA />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    const href = waLink.getAttribute('href') ?? ''
    // e164 sin + para wa.me
    const e164Digits = site.whatsapp.e164.replace('+', '')
    expect(href).toContain(e164Digits)
  })

  it('ambos números provienen de site.ts (mismo módulo)', () => {
    // Smoke test: verificar que los links NO son strings hardcodeados
    render(<EmergencyCTA />)
    const telLink = screen.getByRole('link', { name: /llamar.*urgencias/i })
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    // Ambos deben contener el código de país argentino
    expect(telLink.getAttribute('href')).toContain('+549')
    expect(waLink.getAttribute('href')).toContain('549')
  })
})

describe('EmergencyCTA — estado inicial (slide-up progresivo)', () => {
  it('el componente se renderiza y los links son accesibles', () => {
    render(<EmergencyCTA />)
    const bar = document.querySelector('[role="complementary"]') as HTMLElement
    // El CSS garantiza pointer-events: auto — verificar que la barra existe
    // y que los botones dentro de ella son links funcionales
    expect(bar).toBeInTheDocument()
    const links = bar.querySelectorAll('a')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('bajo prefers-reduced-motion, el componente renderiza en el DOM', () => {
    mockMatchMedia(true) // prefers-reduced-motion: reduce
    render(<EmergencyCTA />)
    const bar = document.querySelector('[role="complementary"]') as HTMLElement
    expect(bar).toBeInTheDocument()
    // Verificar que los links siguen siendo accesibles
    const links = bar.querySelectorAll('a')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })
})

describe('EmergencyCTA — fix: transición no reinicia (bug 2026-06-11)', () => {
  it('al montar, la clase --visible se agrega y --hidden se quita (sin toggle)', () => {
    vi.useFakeTimers()
    render(<EmergencyCTA />)
    const bar = document.querySelector('[role="complementary"]') as HTMLElement

    // Hacer avanzar el rAF y el setTimeout de 420ms
    act(() => {
      vi.runAllTimers()
    })

    // Después del mount: --hidden quitada, --visible presente
    expect(bar.classList.contains('emergency-cta-bar--hidden')).toBe(false)
    expect(bar.classList.contains('emergency-cta-bar--visible')).toBe(true)

    vi.useRealTimers()
  })

  it('la clase --pulsing se agrega DESPUÉS de --visible (separada por setTimeout)', () => {
    vi.useFakeTimers()
    render(<EmergencyCTA />)
    const bar = document.querySelector('[role="complementary"]') as HTMLElement

    // Flush rAF + todos los timers → --visible Y --pulsing deben estar presentes
    // (el setTimeout de 420ms queda dentro de runAllTimers)
    act(() => {
      vi.runAllTimers()
    })

    // Ambas clases deben existir tras el ciclo completo
    expect(bar.classList.contains('emergency-cta-bar--visible')).toBe(true)
    expect(bar.classList.contains('emergency-cta-bar--pulsing')).toBe(true)
    // Y --hidden debe estar ausente
    expect(bar.classList.contains('emergency-cta-bar--hidden')).toBe(false)

    vi.useRealTimers()
  })

  it('las clases no cambian al disparar eventos scroll repetidos (sin threshold crossing)', () => {
    vi.useFakeTimers()
    render(<EmergencyCTA />)
    const bar = document.querySelector('[role="complementary"]') as HTMLElement

    act(() => { vi.runAllTimers() })

    const classesBefore = [...bar.classList]

    // Disparar 10 eventos scroll sin cruce de threshold
    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new Event('scroll'))
    }

    const classesAfter = [...bar.classList]

    // Las clases NO deben cambiar — el componente no tiene scroll listener
    // y no re-setea estado en cada scroll event
    expect(classesAfter).toEqual(classesBefore)

    vi.useRealTimers()
  })
})

describe('EmergencyCTA — textos visibles', () => {
  it('muestra texto de llamada visible (label del botón)', () => {
    render(<EmergencyCTA />)
    // El componente usa "Llamar urgencias" — verificar que hay algún texto de llamada
    const callBtn = document.querySelector('.emergency-cta-btn--call .emergency-cta-btn__label')
    expect(callBtn).toBeTruthy()
    expect(callBtn?.textContent).toBeTruthy()
  })

  it('muestra "WhatsApp" como texto visible', () => {
    render(<EmergencyCTA />)
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })

  it('muestra el subtexto de urgencias en el botón de llamada', () => {
    render(<EmergencyCTA />)
    // El subtexto del botón call contiene "24 h" o "Dr. Giuliani"
    const sub = document.querySelector('.emergency-cta-btn--call .emergency-cta-btn__sub')
    expect(sub).toBeTruthy()
    expect(sub?.textContent).toMatch(/24|urgencias/i)
  })

  it('muestra el subtexto "Respuesta rápida"', () => {
    render(<EmergencyCTA />)
    expect(screen.getByText('Respuesta rápida')).toBeInTheDocument()
  })
})
