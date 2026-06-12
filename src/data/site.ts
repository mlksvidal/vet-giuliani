/* ──────────────────────────────────────────────────────────────────────────
   site.ts — Datos centralizados del negocio
   Veterinaria Luciano Giuliani · San Rafael, Mendoza

   INSTRUCCIONES PARA EL CLIENTE:
   Reemplazar todos los valores marcados con // PLACEHOLDER: por los datos
   reales. Este es el ÚNICO archivo donde se cambian datos de contacto,
   horarios y servicios. Todos los componentes leen desde acá.
   ────────────────────────────────────────────────────────────────────────── */

import type { SiteData } from '../types'

export const site: SiteData = {
  vetName: 'Luciano Giuliani',
  businessName: 'Veterinaria Giuliani',
  specialty: 'Médico Veterinario · Urgencias 24 h',
  city: 'San Rafael, Mendoza',

  phone: {
    // PLACEHOLDER: reemplazar con el número real del cliente
    // Formato E.164: +549 + código de área + número (sin 0 ni 15)
    // San Rafael código de área: 2604
    e164: '+5492604XXXXXX',
    display: '+54 9 2604 XX-XXXX',
  },

  whatsapp: {
    // PLACEHOLDER: reemplazar con el número de WhatsApp real
    // Generalmente es el mismo que phone pero puede ser distinto
    e164: '+5492604XXXXXX',
    display: '+54 9 2604 XX-XXXX',
  },

  // PLACEHOLDER: ajustar el mensaje si el cliente prefiere otro texto
  whatsappUrgencyMessage:
    'Hola, necesito atención urgente para mi mascota. ¿Podés atenderme ahora?',

  // PLACEHOLDER: ajustar el mensaje general si el cliente prefiere otro texto
  whatsappGeneralMessage:
    'Hola, quisiera hacer una consulta sobre los servicios veterinarios.',

  // PLACEHOLDER: reemplazar con la dirección exacta del consultorio
  address: 'San Rafael, Mendoza — dirección a confirmar',

  // PLACEHOLDER: reemplazar con la dirección exacta para el embed de Maps
  // Formato: "Nombre Calle Número, San Rafael, Mendoza"
  mapsQuery: 'Veterinaria Giuliani, San Rafael, Mendoza, Argentina',

  hours: [
    {
      days: 'Lunes a Viernes',
      // PLACEHOLDER: confirmar horarios exactos con el cliente
      open: '9:00',
      close: '13:00',
      note: 'Confirmar horario exacto',
    },
    {
      days: 'Lunes a Viernes',
      // PLACEHOLDER: confirmar si hay turno tarde
      open: '17:00',
      close: '21:00',
      note: 'Confirmar horario exacto',
    },
    {
      days: 'Sábados',
      // PLACEHOLDER: confirmar horario del sábado
      open: '9:00',
      close: '13:00',
      note: 'Confirmar horario exacto',
    },
    {
      days: 'Urgencias',
      open: '00:00',
      close: '23:59',
      note: '24 horas — comunicarse al WhatsApp o teléfono',
      isEmergency: true,
    },
  ],

  services: [
    {
      id: 'urgencias',
      name: 'Urgencias 24 h',
      description:
        'Atención inmediata para emergencias veterinarias a cualquier hora del día.',
      isEmergency: true,
      icon: 'emergency',
    },
    {
      id: 'consulta-general',
      name: 'Consulta General',
      description:
        // PLACEHOLDER: ajustar descripción con el detalle real
        'Revisación clínica completa, diagnóstico y seguimiento de tu mascota.',
      icon: 'stethoscope',
    },
    {
      id: 'vacunacion',
      name: 'Vacunación y Desparasitación',
      description:
        // PLACEHOLDER: confirmar plan de vacunas que se ofrece
        'Plan de vacunas completo y tratamientos antiparasitarios para perros y gatos.',
      icon: 'syringe',
    },
    {
      id: 'cirugia',
      name: 'Cirugía',
      description:
        // PLACEHOLDER: confirmar tipos de cirugías que realiza
        'Cirugías programadas y de urgencia: esterilización, traumatológicas y de tejidos blandos.',
      icon: 'scalpel',
    },
    {
      id: 'traumatismos',
      name: 'Traumatología',
      description:
        'Atención de fracturas, luxaciones y traumatismos en animales de compañía.',
      icon: 'bone',
    },
    {
      id: 'intoxicaciones',
      name: 'Intoxicaciones',
      description:
        'Diagnóstico y tratamiento urgente de intoxicaciones y envenenamientos.',
      isEmergency: true,
      icon: 'alert',
    },
    {
      id: 'internacion',
      name: 'Internación',
      description:
        // PLACEHOLDER: confirmar si ofrece internación y capacidad
        'Internación con monitoreo continuo para pacientes que requieren atención prolongada.',
      icon: 'bed',
    },
    {
      id: 'diagnostico',
      name: 'Diagnóstico por Imagen',
      description:
        // PLACEHOLDER: confirmar si tiene ecógrafo / rayos X propios
        'Radiografía y ecografía para diagnóstico preciso sin necesidad de derivación.',
      icon: 'scan',
    },
  ],

  socials: [
    {
      platform: 'instagram',
      // PLACEHOLDER: reemplazar con el perfil de Instagram real
      url: 'https://instagram.com/vetgiu.sanrafael',
      handle: '@vetgiu.sanrafael',
    },
    {
      platform: 'facebook',
      // PLACEHOLDER: reemplazar con la página de Facebook real (o eliminar si no tiene)
      url: 'https://facebook.com/veterinariagiu',
      handle: 'Veterinaria Giuliani',
    },
  ],

  copy: {
    // PLACEHOLDER: el cliente puede ajustar el tagline principal
    tagline: 'Tu mascota merece el mejor cuidado, cuando más lo necesita.',

    urgencyHeading: 'Urgencias veterinarias 24 h',
    urgencySub:
      'Estamos para ayudarte ahora. Llamá o escribí directamente.',

    // PLACEHOLDER: ajustar línea de confianza con credenciales reales del veterinario
    trustLine: 'Luciano Giuliani — Médico Veterinario matriculado · San Rafael, Mendoza',

    // PLACEHOLDER: ajustar bio corta con datos reales
    about:
      'Me llamo Luciano Giuliani y soy veterinario en San Rafael desde hace años. ' +
      'Atiendo con dedicación a perros, gatos y animales de compañía. ' +
      'Sé lo angustiante que es una emergencia con tu mascota, por eso estoy disponible las 24 horas.',

    callToAction: 'Llamar a urgencias',
    whatsappCTA: 'Escribir por WhatsApp',
  },

  // PLACEHOLDER: actualizar si el año de fundación es anterior a 2024
  foundedYear: 2024,

  // PLACEHOLDER: agregar email si el cliente tiene uno
  // email: 'info@vetgiu.com.ar',
}

/** Helper: genera la URL de WhatsApp con mensaje pre-cargado */
export function getWhatsAppUrl(message: string = site.whatsappGeneralMessage): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${site.whatsapp.e164.replace('+', '')}?text=${encoded}`
}

/** Helper: genera la URL de WhatsApp para urgencias */
export function getWhatsAppUrgencyUrl(): string {
  return getWhatsAppUrl(site.whatsappUrgencyMessage)
}

/** Helper: genera el href tel: con el número E.164 */
export function getTelUrl(): string {
  return `tel:${site.phone.e164}`
}

export default site
