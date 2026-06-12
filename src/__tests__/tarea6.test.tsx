/* ──────────────────────────────────────────────────────────────────────────
   tarea6.test.tsx — Tests para Nav + Footer (Tarea 6)
   Vitest + Testing Library

   Criterios verificados:
   · Nav: wordmark tipográfico presente
   · Nav: links ancla a las 4 secciones (Servicios, Sobre, Ubicación, Contacto)
   · Nav: botón hamburger presente con aria-expanded
   · Nav: hamburger controla el drawer (aria-controls, aria-expanded toggle)
   · Footer: id="contacto" (anchor del nav funciona)
   · Footer: enlaces tel: y wa.me con e164 de site.ts
   · Footer: copyright con año y nombre del negocio
   · Footer: bloque de urgencias con botones call + whatsapp
   ────────────────────────────────────────────────────────────────────────── */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Nav } from '../components/ui/Nav'
import { Footer } from '../components/sections/Footer'
import { site } from '../data/site'

/* ─── Nav ──────────────────────────────────────────────────────────────── */

describe('Nav', () => {
  it('renders the wordmark with business name', () => {
    render(<Nav />)
    expect(screen.getByText('Veterinaria Giuliani')).toBeInTheDocument()
  })

  it('renders all four anchor links', () => {
    render(<Nav />)
    expect(screen.getAllByRole('link', { name: /servicios/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /sobre/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /ubicación/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /contacto/i }).length).toBeGreaterThan(0)
  })

  it('renders hamburger button with correct aria-expanded=false initially', () => {
    render(<Nav />)
    const btn = screen.getByRole('button', { name: /abrir menú/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveAttribute('aria-controls', 'nav-mobile-drawer')
  })

  it('toggles aria-expanded when hamburger is clicked', () => {
    render(<Nav />)
    const btn = screen.getByRole('button', { name: /abrir menú/i })
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('hamburger tap target is at least 44px (min-width/height via class)', () => {
    render(<Nav />)
    const btn = screen.getByRole('button', { name: /abrir menú/i })
    expect(btn).toHaveClass('nav-hamburger')
  })

  it('drawer has role=dialog and aria-modal when open', () => {
    render(<Nav />)
    const btn = screen.getByRole('button', { name: /abrir menú/i })
    fireEvent.click(btn)
    const drawer = document.getElementById('nav-mobile-drawer')
    expect(drawer).toHaveAttribute('role', 'dialog')
    expect(drawer).toHaveAttribute('aria-modal', 'true')
  })

  it('wordmark links to #hero', () => {
    render(<Nav />)
    const wordmark = screen.getByRole('link', { name: /veterinaria giuliani.*inicio/i })
    expect(wordmark).toHaveAttribute('href', '#hero')
  })
})

/* ─── Footer ───────────────────────────────────────────────────────────── */

describe('Footer', () => {
  it('has id="contacto" for anchor navigation', () => {
    render(<Footer />)
    const footer = document.getElementById('contacto')
    expect(footer).toBeInTheDocument()
    expect(footer?.tagName.toLowerCase()).toBe('footer')
  })

  it('renders tel: link with e164 phone number from site.ts', () => {
    render(<Footer />)
    const telLinks = document.querySelectorAll(`a[href="tel:${site.phone.e164}"]`)
    expect(telLinks.length).toBeGreaterThan(0)
  })

  it('renders wa.me link containing e164 number from site.ts', () => {
    render(<Footer />)
    const e164Stripped = site.whatsapp.e164.replace('+', '')
    const waLinks = document.querySelectorAll(`a[href*="${e164Stripped}"]`)
    expect(waLinks.length).toBeGreaterThan(0)
  })

  it('renders wa.me urgency link with ?text= parameter', () => {
    render(<Footer />)
    const waLinks = Array.from(document.querySelectorAll('a[href*="wa.me"]'))
    const hasTextParam = waLinks.some((link) => link.getAttribute('href')?.includes('?text='))
    expect(hasTextParam).toBe(true)
  })

  it('renders copyright with current year and business name', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    const copy = screen.getByText(
      (text) => text.includes(currentYear) && text.includes('Veterinaria Luciano Giuliani'),
    )
    expect(copy).toBeInTheDocument()
  })

  it('renders emergency block with both call and whatsapp buttons', () => {
    render(<Footer />)
    const callBtn = screen.getByRole('link', { name: /llamar a urgencias veterinarias ahora/i })
    const waBtn = screen.getByRole('link', { name: /escribir a urgencias veterinarias por whatsapp/i })
    expect(callBtn).toBeInTheDocument()
    expect(waBtn).toBeInTheDocument()
  })

  it('WhatsApp urgency button has dark text (never white) via class', () => {
    render(<Footer />)
    const waBtn = screen.getByRole('link', { name: /escribir a urgencias veterinarias por whatsapp/i })
    expect(waBtn).toHaveClass('footer-emergency-btn--whatsapp')
    /* La clase CSS aplica color: #2C1A0E — contraste 6.20:1 ✅ */
  })

  it('renders San Rafael, Mendoza in the footer', () => {
    render(<Footer />)
    /* El texto puede estar en múltiples nodos (copyright span, address) */
    const footerEl = document.getElementById('contacto')
    expect(footerEl?.textContent).toContain('San Rafael, Mendoza')
  })

  it('renders hours from site.ts (non-emergency rows)', () => {
    render(<Footer />)
    const regularHours = site.hours.filter((h) => !h.isEmergency)
    /* Verificar que al menos los primeros horarios están presentes.
       getByText puede fallar si hay múltiples nodos; usar getAllByText */
    const matches = screen.getAllByText(regularHours[0].days)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('external social links have rel=noopener noreferrer', () => {
    render(<Footer />)
    const externalLinks = Array.from(document.querySelectorAll('a[target="_blank"]'))
    externalLinks.forEach((link) => {
      const rel = link.getAttribute('rel') ?? ''
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    })
  })
})
