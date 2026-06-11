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
  'Las Terrenas',
  'Jarabacoa',
  'Constanza',
  'Barahona',
  'Bávaro',
  'Cabarete',
  'Sosúa',
  'Boca Chica',
  'Juan Dolio',
  'La Vega',
  'Higüey',
  'Nagua',
  'Río San Juan',
  'Miches',
  'Pedernales',
  'Monte Cristi',
  'Neyba',
  'San Pedro de Macorís',
  'San Francisco de Macorís',
  'Bonao',
  'Moca',
  'Azua',
  'Dajabón',
  'Hato Mayor',
] as const

export type DRCity = typeof DR_CITIES[number]

// ----------------------------------------------------------------
// DIRECCIONES PREDETERMINADAS POR CIUDAD
// ----------------------------------------------------------------
export const DURATION_OPTIONS = [
  '1 hora',
  '1.5 horas',
  '2 horas',
  '3 horas',
  '4 horas',
  'Medio día (4–5 horas)',
  'Día completo (8 horas)',
  '2 días',
  '3 días',
  '4 días',
  '1 semana',
] as const

export const CITY_ADDRESSES: Record<string, string[]> = {
  'Santo Domingo': [
    'Zona Colonial, Santo Domingo',
    'Parque Colón, Zona Colonial',
    'Malecón de Santo Domingo',
    'Mercado Modelo, Santo Domingo',
    'Plaza de la Cultura, Santo Domingo',
    'Jardín Botánico Nacional, Santo Domingo',
    'Acuario Nacional, Santo Domingo',
    'Parque Mirador Sur, Santo Domingo',
  ],
  'Santiago': [
    'Monumento a los Héroes, Santiago',
    'Calle del Sol, Santiago',
    'Mercado Modelo de Santiago',
    'Centro León, Santiago',
    'Parque Duarte, Santiago',
  ],
  'Punta Cana': [
    'Bávaro, Punta Cana',
    'Cap Cana, Punta Cana',
    'Playa Bávaro, Punta Cana',
    'Palma Real Shopping Village, Punta Cana',
    'Aeropuerto Internacional de Punta Cana',
  ],
  'Puerto Plata': [
    'Malecón de Puerto Plata',
    'Fortaleza San Felipe, Puerto Plata',
    'Telefèrico de Puerto Plata',
    'Ocean World Adventure Park, Puerto Plata',
    'Playa Dorada, Puerto Plata',
  ],
  'La Romana': [
    'Casa de Campo, La Romana',
    'Altos de Chavón, La Romana',
    'Parque Central de La Romana',
  ],
  'Samaná': [
    'Malecón de Samaná',
    'Los Haitises, Samaná',
    'Salto El Limón, Samaná',
    'Playa Rincón, Samaná',
  ],
  'Jarabacoa': [
    'Parque Central de Jarabacoa',
    'Salto Baiguate, Jarabacoa',
    'Salto Jimenoa, Jarabacoa',
    'La Confluencia, Jarabacoa',
  ],
  'Constanza': [
    'Parque Central de Constanza',
    'Valle Nuevo, Constanza',
    'Lago Aguas Blancas, Constanza',
  ],
  'Barahona': [
    'Malecón de Barahona',
    'Parque Nacional Jaragua, Barahona',
    'Playa San Rafael, Barahona',
  ],
  'San Pedro de Macorís': [
    'Parque Central de San Pedro de Macorís',
    'Malecón de San Pedro de Macorís',
  ],
  'San Francisco de Macorís': [
    'Parque Duarte, San Francisco de Macorís',
    'Centro de San Francisco de Macorís',
  ],
  'Higüey': [
    'Basílica de la Altagracia, Higüey',
    'Parque Central de Higüey',
  ],
  'Bonao': [
    'Parque Central de Bonao',
    'Centro de Bonao',
  ],
  'Moca': [
    'Parque Central de Moca',
    'Iglesia de Moca',
  ],
  'Azua': [
    'Parque Central de Azua',
    'Malecón de Azua',
  ],
}

// Coordenadas precisas para cada dirección predeterminada.
// Se usan directamente al seleccionar un preset — sin depender de geocoding externo.
export const PRESET_ADDRESS_COORDS: Record<string, { lat: number; lng: number }> = {
  // Santo Domingo
  'Zona Colonial, Santo Domingo':             { lat: 18.4741, lng: -69.8845 },
  'Parque Colón, Zona Colonial':              { lat: 18.4735, lng: -69.8830 },
  'Malecón de Santo Domingo':                 { lat: 18.4651, lng: -69.9009 },
  'Mercado Modelo, Santo Domingo':            { lat: 18.4772, lng: -69.8944 },
  'Plaza de la Cultura, Santo Domingo':       { lat: 18.4662, lng: -69.9319 },
  'Jardín Botánico Nacional, Santo Domingo':  { lat: 18.4927, lng: -69.9597 },
  'Acuario Nacional, Santo Domingo':          { lat: 18.4526, lng: -69.9447 },
  'Parque Mirador Sur, Santo Domingo':        { lat: 18.4577, lng: -69.9664 },
  // Santiago
  'Monumento a los Héroes, Santiago':         { lat: 19.4517, lng: -70.7072 },
  'Calle del Sol, Santiago':                  { lat: 19.4517, lng: -70.6985 },
  'Mercado Modelo de Santiago':               { lat: 19.4479, lng: -70.6930 },
  'Centro León, Santiago':                    { lat: 19.4682, lng: -70.6967 },
  'Parque Duarte, Santiago':                  { lat: 19.4498, lng: -70.7003 },
  // Punta Cana
  'Bávaro, Punta Cana':                       { lat: 18.6879, lng: -68.4428 },
  'Cap Cana, Punta Cana':                     { lat: 18.5066, lng: -68.3767 },
  'Playa Bávaro, Punta Cana':                 { lat: 18.7116, lng: -68.4403 },
  'Palma Real Shopping Village, Punta Cana':  { lat: 18.6826, lng: -68.4313 },
  'Aeropuerto Internacional de Punta Cana':   { lat: 18.5674, lng: -68.3639 },
  // Puerto Plata
  'Malecón de Puerto Plata':                  { lat: 19.7970, lng: -70.6915 },
  'Fortaleza San Felipe, Puerto Plata':       { lat: 19.7998, lng: -70.6938 },
  'Telefèrico de Puerto Plata':               { lat: 19.7861, lng: -70.6862 },
  'Ocean World Adventure Park, Puerto Plata': { lat: 19.7760, lng: -70.5945 },
  'Playa Dorada, Puerto Plata':               { lat: 19.7903, lng: -70.6297 },
  // La Romana
  'Casa de Campo, La Romana':                 { lat: 18.4059, lng: -68.9212 },
  'Altos de Chavón, La Romana':               { lat: 18.4065, lng: -68.9016 },
  'Parque Central de La Romana':              { lat: 18.4267, lng: -68.9734 },
  // Samaná
  'Malecón de Samaná':                        { lat: 19.2057, lng: -69.3369 },
  'Los Haitises, Samaná':                     { lat: 19.0934, lng: -69.5397 },
  'Salto El Limón, Samaná':                   { lat: 19.2819, lng: -69.4456 },
  'Playa Rincón, Samaná':                     { lat: 19.3097, lng: -69.5194 },
  // Jarabacoa
  'Parque Central de Jarabacoa':              { lat: 19.1184, lng: -70.6389 },
  'Salto Baiguate, Jarabacoa':                { lat: 19.0843, lng: -70.6268 },
  'Salto Jimenoa, Jarabacoa':                 { lat: 19.1007, lng: -70.6568 },
  'La Confluencia, Jarabacoa':                { lat: 19.1173, lng: -70.6268 },
  // Constanza
  'Parque Central de Constanza':              { lat: 18.9059, lng: -70.7439 },
  'Valle Nuevo, Constanza':                   { lat: 18.7500, lng: -70.6500 },
  'Lago Aguas Blancas, Constanza':            { lat: 18.8600, lng: -70.7100 },
  // Barahona
  'Malecón de Barahona':                      { lat: 18.2092, lng: -71.1011 },
  'Parque Nacional Jaragua, Barahona':        { lat: 17.9000, lng: -71.5000 },
  'Playa San Rafael, Barahona':               { lat: 18.0928, lng: -71.0699 },
  // San Pedro de Macorís
  'Parque Central de San Pedro de Macorís':   { lat: 18.4565, lng: -69.3059 },
  'Malecón de San Pedro de Macorís':          { lat: 18.4497, lng: -69.3086 },
  // San Francisco de Macorís
  'Parque Duarte, San Francisco de Macorís':  { lat: 19.2990, lng: -70.2527 },
  'Centro de San Francisco de Macorís':       { lat: 19.3000, lng: -70.2527 },
  // Higüey
  'Basílica de la Altagracia, Higüey':        { lat: 18.6153, lng: -68.7079 },
  'Parque Central de Higüey':                 { lat: 18.6149, lng: -68.7070 },
  // Bonao
  'Parque Central de Bonao':                  { lat: 18.9389, lng: -70.4082 },
  'Centro de Bonao':                          { lat: 18.9389, lng: -70.4082 },
  // Moca
  'Parque Central de Moca':                   { lat: 19.3930, lng: -70.5234 },
  'Iglesia de Moca':                          { lat: 19.3932, lng: -70.5230 },
  // Azua
  'Parque Central de Azua':                   { lat: 18.4513, lng: -70.7290 },
  'Malecón de Azua':                          { lat: 18.4334, lng: -70.7339 },
}

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
