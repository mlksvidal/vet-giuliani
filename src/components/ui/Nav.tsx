/* ──────────────────────────────────────────────────────────────────────────
   Nav.tsx — Navbar superior fija con anchors a secciones
   Spec: design-system #873 · tareas #862 (Tarea 6)

   COMPORTAMIENTO:
   · Estado top (0–80px scroll): fondo transparente, texto oscuro (crema base)
   · Estado scrolled (>80px): rgba(253,248,243,0.92) + blur(16px) + shadow-sm
   · Mobile (≤768px): hamburger OBLIGATORIO (regla universal)
   · Drawer mobile: stagger fade-up ítems · foco trap · aria-expanded correcto
   · Scroll suave: Lenis (ya activo globalmente en App) + CSS scroll-behavior
   · EmergencyCTA sticky vive en z-1040 (bottom), drawer no lo solapa (z-1020)

   CONTRASTE:
   · El hero es CLARO (crema #FDF8F3 con blobs) — texto oscuro siempre funciona
   · Nav transparente sobre hero claro: texto #2C1A0E, contraste ✅
   · Nav scrolled (bg crema 92%): texto #2C1A0E, contraste ✅
   ────────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useCallback } from 'react'
import { getTelUrl } from '../../data/site'

/* ─── Helpers de scroll ────────────────────────────────────────────────── */

function scrollToSection(href: string, closeMobileMenu?: () => void) {
  const id = href.replace('#', '')
  const target = document.getElementById(id)
  if (!target) return

  if (closeMobileMenu) {
    closeMobileMenu()
    /* Esperar que termine la exit animation del drawer (~300ms) antes de scrollear.
       De lo contrario el scroll se pierde durante la animación de cierre. */
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 320)
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ─── Íconos SVG ───────────────────────────────────────────────────────── */

function HamburgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      focusable="false"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="19" y2="6" />
      <line x1="3" y1="11" x2="19" y2="11" />
      <line x1="3" y1="16" x2="19" y2="16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      focusable="false"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  )
}

/* ─── Datos de navegación ──────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Urgencias', href: '#urgencias' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Sobre Luciano', href: '#sobre' },
  { label: 'Ubicación', href: '#ubicacion' },
  { label: 'Contacto', href: '#contacto' },
] as const

/* ─── Componente principal ─────────────────────────────────────────────── */

export function Nav() {
  const telUrl = getTelUrl()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  /* ── Detectar scroll >80px ──────────────────────────────────────────── */
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 80)
    }

    /* Estado inicial (por si la página carga con scroll) */
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Bloquear scroll del body cuando el drawer está abierto ────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  /* ── Cerrar drawer con Escape ────────────────────────────────────────── */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  /* ── Focus trap en el drawer mobile ─────────────────────────────────── */
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const focusableEls = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    )

    if (focusableEls.length === 0) return

    const first = focusableEls[0]
    const last = focusableEls[focusableEls.length - 1]

    /* Mover foco al primer elemento del drawer */
    first.focus()

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [isOpen])

  /* ── Restaurar foco al cerrar el drawer ─────────────────────────────── */
  const prevFocusRef = useRef<HTMLElement | null>(null)

  function openDrawer() {
    prevFocusRef.current = document.activeElement as HTMLElement
    setIsOpen(true)
  }

  function closeDrawer() {
    setIsOpen(false)
    /* Restaurar foco al hamburger al cerrar */
    setTimeout(() => hamburgerRef.current?.focus(), 320)
  }

  const handleNavLinkClick = useCallback(
    (href: string) => {
      scrollToSection(href, isOpen ? closeDrawer : undefined)
    },
    [isOpen],
  )

  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        aria-label="Navegación principal"
        className={`nav-bar ${isScrolled ? 'nav-bar--scrolled' : ''}`}
      >
        <div className="nav-inner container-bold">

          {/* Wordmark tipográfico — Playfair Display, NO logo image */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#hero')
            }}
            className="nav-wordmark"
            aria-label="Veterinaria Giuliani — ir al inicio"
          >
            <span className="nav-wordmark__main">Veterinaria Giuliani</span>
          </a>

          {/* ── Links de escritorio (≥769px) ─────────────────────────── */}
          <ul className="nav-links" role="list" aria-label="Secciones del sitio">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavLinkClick(link.href)
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Hamburger (≤768px) ────────────────────────────────────── */}
          {/* Tap target: min 44x44px — regla universal nav mobile */}
          <button
            ref={hamburgerRef}
            type="button"
            className={`nav-hamburger ${isOpen ? 'nav-hamburger--open' : ''}`}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            aria-controls="nav-mobile-drawer"
            onClick={() => (isOpen ? closeDrawer() : openDrawer())}
          >
            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* ── Backdrop (mobile) ────────────────────────────────────────────── */}
      {/* z-index: 1019 — debajo del drawer (1020) pero encima del contenido */}
      <div
        className={`nav-backdrop ${isOpen ? 'nav-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={closeDrawer}
      />

      {/* ── Drawer mobile ────────────────────────────────────────────────── */}
      {/* z-index: 1020 (--z-overlay) — debajo de z-emergency (1040)         */}
      {/* El EmergencyCTA sticky (bottom, z-1040) permanece visible encima   */}
      <div
        ref={drawerRef}
        id="nav-mobile-drawer"
        role="dialog"
        aria-label="Menú de navegación"
        aria-modal="true"
        aria-hidden={!isOpen}
        className={`nav-drawer ${isOpen ? 'nav-drawer--open' : ''}`}
      >
        <ul
          className="nav-drawer__list"
          role="list"
          aria-label="Secciones del sitio"
        >
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              className="nav-drawer__item"
              style={{ '--item-index': i } as React.CSSProperties}
            >
              <a
                href={link.href}
                className="nav-drawer__link"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavLinkClick(link.href)
                }}
                tabIndex={isOpen ? 0 : -1}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA de urgencias repetido dentro del drawer — accesible mobile */}
        <div className="nav-drawer__cta-block">
          <a
            href={telUrl}
            className="nav-drawer__cta nav-drawer__cta--call"
            tabIndex={isOpen ? 0 : -1}
            aria-label="Llamar a urgencias veterinarias"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16l.46.92z" />
            </svg>
            Llamar ahora
          </a>
        </div>
      </div>
    </>
  )
}

export default Nav
