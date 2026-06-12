/* ──────────────────────────────────────────────────────────────────────────
   Tipos globales — Veterinaria Giuliani
   ────────────────────────────────────────────────────────────────────────── */

/** Número de teléfono con dos representaciones */
export interface PhoneNumber {
  /** Número en formato E.164 sin espacios, para usar en href tel: y wa.me */
  e164: string
  /** Número formateado para mostrar al usuario */
  display: string
}

/** Horario de atención de un día o rango de días */
export interface HoursEntry {
  /** Días de la semana en español rioplatense (ej: "Lun–Vie") */
  days: string
  /** Horario de apertura (ej: "9:00") */
  open: string
  /** Horario de cierre (ej: "13:00") */
  close: string
  /** Nota adicional (ej: "*confirmar horario exacto*") */
  note?: string
  /** Si es atención de urgencias (24 h) */
  isEmergency?: boolean
}

/** Servicio veterinario */
export interface Service {
  id: string
  /** Nombre del servicio */
  name: string
  /** Descripción corta (1-2 oraciones) */
  description: string
  /** Si es servicio de urgencias (destacado visualmente) */
  isEmergency?: boolean
  /** Icono sugerido (nombre semántico para mapear al componente) */
  icon?: string
}

/** Redes sociales */
export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'whatsapp'
  /** URL completa */
  url: string
  /** Handle para mostrar (ej: "@vetgiu") */
  handle: string
}

/** Estructura completa de datos del sitio */
export interface SiteData {
  /** Nombre del profesional */
  vetName: string
  /** Nombre del negocio */
  businessName: string
  /** Especialidad / descripción corta */
  specialty: string
  /** Ciudad y provincia */
  city: string
  /** Teléfono principal */
  phone: PhoneNumber
  /** WhatsApp (puede ser el mismo número que phone) */
  whatsapp: PhoneNumber
  /** Mensaje pre-cargado para WhatsApp de urgencias (sin codificar) */
  whatsappUrgencyMessage: string
  /** Mensaje pre-cargado para WhatsApp general (sin codificar) */
  whatsappGeneralMessage: string
  /** Dirección física */
  address: string
  /** Query para Google Maps embed */
  mapsQuery: string
  /** Horarios de atención */
  hours: HoursEntry[]
  /** Lista de servicios */
  services: Service[]
  /** Redes sociales */
  socials: SocialLink[]
  /** Copy de marca — frases reutilizables */
  copy: {
    tagline: string
    urgencyHeading: string
    urgencySub: string
    trustLine: string
    about: string
    callToAction: string
    whatsappCTA: string
  }
  /** Año de fundación (para copyright) */
  foundedYear: number
  /** Email de contacto */
  email?: string
}
