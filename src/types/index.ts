// ================================================================
// DOCOOLTURE — TIPOS GLOBALES
// ================================================================

// ----------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------
export type UserRole = 'explorer' | 'host' | 'admin'
export type VerificationStatus = 'pending' | 'in_review' | 'approved' | 'rejected'
export type HostStatus = 'active' | 'suspended' | 'pending_review'

// ----------------------------------------------------------------
// REGISTRO Y LOGIN
// ----------------------------------------------------------------
export type SignUpData = {
  email: string
  password: string
  full_name: string
  role: UserRole
}

export type LoginData = {
  email: string
  password: string
}

// ----------------------------------------------------------------
// PERFIL DE ANFITRIÓN — Formulario de registro
// ----------------------------------------------------------------
export type BecomeHostFormData = {
  // Paso 1 — Información personal
  display_name: string
  bio: string
  city: string
  phone: string
  whatsapp: string

  // Paso 2 — Información profesional
  specialties: string[]
  languages: string[]
  years_experience: number

  // Paso 3 — Redes sociales
  instagram_url: string
  facebook_url: string
  website_url: string

  // Paso 4 — Verificación de identidad
  document_type: 'cedula' | 'passport' | 'drivers_license'
  document_number: string
}

// ----------------------------------------------------------------
// EXPERIENCIA — Formulario de creación
// ----------------------------------------------------------------
export type CreateExperienceFormData = {
  // Paso 1 — Información básica
  title: string
  short_description: string
  description: string
  category: string
  tags: string[]

  // Paso 2 — Detalles
  duration_time: string
  languages: string[]
  max_guests: number
  min_guests: number
  meeting_point: string
  address: string
  city: string

  // Paso 3 — Precio
  price_usd: number
  price_includes: string[]
  price_excludes: string[]

  // Paso 4 — Imágenes
  featured_image_url: string
  gallery_urls: string[]

  // Paso 5 — Disponibilidad
  available_days: string[]
  available_times: string[]

  // Mapa
  latitude: number | null
  longitude: number | null
}

// ----------------------------------------------------------------
// CATEGORÍAS DE EXPERIENCIAS
// ----------------------------------------------------------------
export const EXPERIENCE_CATEGORIES = [
  'Gastronomía',
  'Tour Cultural',
  'Arte y Artesanía',
  'Música y Baile',
  'Aventura y Naturaleza',
  'Tours Históricos',
  'Bienestar',
  'Fotografía',
  'Clases y Talleres',
  'Vida Nocturna',
] as const

export type ExperienceCategory = typeof EXPERIENCE_CATEGORIES[number]

// ----------------------------------------------------------------
// DÍAS DE LA SEMANA
// ----------------------------------------------------------------
export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const

export type DayOfWeek = typeof DAYS_OF_WEEK[number]

// ----------------------------------------------------------------
// ESPECIALIDADES DEL ANFITRIÓN
// ----------------------------------------------------------------
export const HOST_SPECIALTIES = [
  'Gastronomía',
  'Historia y Cultura',
  'Arte y Artesanía',
  'Música y Baile',
  'Naturaleza y Aventura',
  'Fotografía',
  'Idiomas',
  'Bienestar',
  'Deportes',
  'Vida Nocturna',
] as const

export type HostSpecialty = typeof HOST_SPECIALTIES[number]

// ----------------------------------------------------------------
// IDIOMAS
// ----------------------------------------------------------------
export const AVAILABLE_LANGUAGES = [
  'Español',
  'English',
  'Français',
  'Português',
  'Italiano',
  'Deutsch',
] as const

export type AvailableLanguage = typeof AVAILABLE_LANGUAGES[number]

// ----------------------------------------------------------------
// TIPOS DE DOCUMENTO
// ----------------------------------------------------------------
export const DOCUMENT_TYPES = [
  { value: 'cedula', label: 'Cédula de Identidad' },
  { value: 'passport', label: 'Pasaporte' },
  { value: 'drivers_license', label: 'Licencia de Conducir' },
] as const

// ----------------------------------------------------------------
// CIUDADES DE REPÚBLICA DOMINICANA
// ----------------------------------------------------------------
export const DR_CITIES = [
  'Santo Domingo',
  'Santiago',
  'Punta Cana',
  'Puerto Plata',
  'La Romana',
  'Samaná',
  'Jarabacoa',
  'Constanza',
  'Barahona',
  'San Pedro de Macorís',
  'San Francisco de Macorís',
  'Higüey',
  'Bonao',
  'Moca',
  'Azua',
] as const

export type DRCity = typeof DR_CITIES[number]

// ----------------------------------------------------------------
// ESTADOS DE RESERVA
// ----------------------------------------------------------------
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
  partially_refunded: 'Reembolso parcial',
}

// ----------------------------------------------------------------
// TIPOS DE NOTIFICACIÓN
// ----------------------------------------------------------------
export const NOTIFICATION_TYPES = {
  // Explorer
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REMINDER: 'booking_reminder',
  REVIEW_REQUEST: 'review_request',
  // Host
  NEW_BOOKING: 'new_booking',
  REVIEW_RECEIVED: 'review_received',
  EXPERIENCE_HIDDEN: 'experience_hidden',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  // Admin
  NEW_HOST_REGISTRATION: 'new_host_registration',
  NEW_VERIFICATION_REQUEST: 'new_verification_request',
} as const

// ----------------------------------------------------------------
// RESPUESTA GENÉRICA DE API
// ----------------------------------------------------------------
export type ApiResponse<T> = {
  data: T | null
  error: string | null
  success: boolean
}
