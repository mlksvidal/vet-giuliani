/* Mock de Lenis para entorno jsdom (tests) */
import { vi } from 'vitest'

class LenisMock {
  on = vi.fn()
  off = vi.fn()
  raf = vi.fn()
  destroy = vi.fn()
  scrollTo = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

export default LenisMock
