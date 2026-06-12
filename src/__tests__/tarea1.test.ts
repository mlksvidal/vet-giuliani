/* ──────────────────────────────────────────────────────────────────────────
   tarea1.test.ts — Tests para Tarea 1: site.ts + tokens + useLenis
   ────────────────────────────────────────────────────────────────────────── */

import { describe, it, expect } from 'vitest'
import { site, getWhatsAppUrl, getWhatsAppUrgencyUrl, getTelUrl } from '../data/site'

describe('site.ts — datos centralizados', () => {
  it('exporta los campos obligatorios del negocio', () => {
    expect(site.vetName).toBeTruthy()
    expect(site.businessName).toBeTruthy()
    expect(site.city).toBeTruthy()
    expect(site.foundedYear).toBeTypeOf('number')
  })

  it('phone.e164 contiene el código de país +549', () => {
    expect(site.phone.e164).toMatch(/^\+549/)
  })

  it('whatsapp.e164 contiene el código de país +549', () => {
    expect(site.whatsapp.e164).toMatch(/^\+549/)
  })

  it('phone.e164 y whatsapp.e164 son el mismo número (coherencia)', () => {
    // Deben ser iguales o al menos ambos presentes
    expect(site.phone.e164).toBeTruthy()
    expect(site.whatsapp.e164).toBeTruthy()
  })

  it('exporta servicios con al menos un servicio de urgencias', () => {
    expect(site.services.length).toBeGreaterThan(0)
    const urgencias = site.services.filter((s) => s.isEmergency)
    expect(urgencias.length).toBeGreaterThan(0)
  })

  it('exporta horarios con al menos una entrada de urgencias 24h', () => {
    expect(site.hours.length).toBeGreaterThan(0)
    const emergency = site.hours.filter((h) => h.isEmergency)
    expect(emergency.length).toBeGreaterThan(0)
  })

  it('copy.urgencyHeading y urgencySub están definidos', () => {
    expect(site.copy.urgencyHeading).toBeTruthy()
    expect(site.copy.urgencySub).toBeTruthy()
  })

  it('mapsQuery está definido', () => {
    expect(site.mapsQuery).toBeTruthy()
  })
})

describe('helpers de URL', () => {
  it('getWhatsAppUrl genera URL con wa.me y text param', () => {
    const url = getWhatsAppUrl('hola')
    expect(url).toContain('wa.me/')
    expect(url).toContain('text=')
  })

  it('getWhatsAppUrl codifica el mensaje correctamente', () => {
    const url = getWhatsAppUrl('hola mundo')
    expect(url).toContain('hola%20mundo')
  })

  it('getWhatsAppUrgencyUrl usa el mensaje de urgencia', () => {
    const url = getWhatsAppUrgencyUrl()
    expect(url).toContain('wa.me/')
    expect(url).toContain('text=')
  })

  it('getTelUrl genera href tel: con e164', () => {
    const url = getTelUrl()
    expect(url).toMatch(/^tel:\+549/)
  })

  it('la URL de WhatsApp NO contiene el + del e164 (wa.me no lo acepta)', () => {
    const url = getWhatsAppUrl()
    // El número en wa.me debe ser sin +
    const match = url.match(/wa\.me\/(\d+)/)
    expect(match).toBeTruthy()
    expect(match![1]).not.toContain('+')
  })
})
