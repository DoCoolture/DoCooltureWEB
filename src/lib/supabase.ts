import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// ================================================================
// TIPOS DE LA BASE DE DATOS
// ================================================================

export type Profile = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  email: string | null
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  phone: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  about_me: string | null
  city: string | null
  country: string
  role: 'explorer' | 'host' | 'admin'
  preferred_language: 'es' | 'en' | 'fr'
  preferred_currency: 'DOP' | 'USD' | 'EUR' | 'COP' | 'ARS'
  is_active: boolean
  email_verified: boolean
  total_bookings: number
  total_reviews_given: number
}

export type Host = {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  user_id: string
  display_name: string
  bio: string | null
  specialties: string[] | null
  languages: string[] | null
  years_experience: number
  whatsapp: string | null
  instagram_url: string | null
  facebook_url: string | null
  website_url: string | null
  city: string | null
  country: string
  verification_status: 'pending' | 'in_review' | 'approved' | 'rejected'
  is_verified: boolean
  verified_at: string | null
  status: 'active' | 'suspended' | 'pending_review'
  is_superhost: boolean
  response_rate: number
  response_time: string
  total_listings: number
  total_reviews: number
  total_bookings: number
  average_rating: number
  total_earnings_usd: number
}

export type Experience = {
  id: string
  created_at: string
  updated_at: string
  host_id: string
  title: string
  handle: string
  description: string
  short_description: string | null
  category: string
  tags: string[] | null
  duration_time: string
  languages: string[] | null
  max_guests: number
  min_guests: number
  meeting_point: string | null
  address: string
  city: string
  country: string
  price_usd: number
  price_includes: string[] | null
  price_excludes: string[] | null
  featured_image_url: string | null
  gallery_urls: string[] | null
  available_days: string[] | null
  available_times: string[] | null
  latitude: number | null
  longitude: number | null
  is_published: boolean
  is_hidden: boolean
  hidden_reason: string | null
  hidden_at: string | null
  hidden_by: string | null
  total_bookings: number
  total_reviews: number
  average_rating: number
  like_count: number
  view_count: number
}

export type Booking = {
  id: string
  created_at: string
  updated_at: string
  explorer_id: string | null
  experience_id: string | null
  host_id: string | null
  booking_code: string
  customer_name: string | null
  customer_email: string
  customer_phone: string | null
  tour_name: string
  booking_date: string
  booking_time: string | null
  guests: number
  notes: string | null
  price_per_person: number | null
  subtotal_usd: number | null
  processing_fee_usd: number
  total_usd: number | null
  payment_method: 'paypal' | 'cardnet' | 'cash'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  payment_reference: string | null
  paid_at: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  cancellation_reason: string | null
  cancelled_at: string | null
  cancelled_by: 'explorer' | 'host' | 'admin' | null
}

export type ExperienceReview = {
  id: string
  created_at: string
  experience_id: string
  booking_id: string | null
  explorer_id: string | null
  reviewer_name: string
  reviewer_avatar_url: string | null
  rating: number
  comment: string | null
  host_reply: string | null
  host_replied_at: string | null
  is_visible: boolean
  hidden_reason: string | null
}

export type Wishlist = {
  id: string
  created_at: string
  profile_id: string
  experience_id: string
}

export type Notification = {
  id: string
  created_at: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  read_at: string | null
  data: Record<string, any> | null
  action_url: string | null
}

export type IdentityVerification = {
  id: string
  created_at: string
  updated_at: string
  host_id: string
  document_type: 'cedula' | 'passport' | 'drivers_license'
  document_number: string
  document_front_url: string | null
  document_back_url: string | null
  selfie_url: string | null
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  notes: string | null
}

// ================================================================
// HELPERS DE AUTENTICACIÓN
// ================================================================

// Obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// Obtener el perfil del usuario actual
export const getCurrentProfile = async (): Promise<Profile | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return data as Profile
}

// Obtener el perfil de anfitrión del usuario actual
export const getCurrentHost = async (): Promise<Host | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('hosts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return data as Host
}

// Verificar si el usuario actual es anfitrión
export const isHost = async (): Promise<boolean> => {
  const host = await getCurrentHost()
  return host !== null
}

// Verificar si el usuario actual es admin
export const isAdmin = async (): Promise<boolean> => {
  const profile = await getCurrentProfile()
  return profile?.role === 'admin'
}

// ================================================================
// HELPERS DE STORAGE
// ================================================================

// Subir avatar del usuario
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<string | null> => {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (error) {
    console.error('Error uploading avatar:', error)
    return null
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Subir imagen de experiencia
export const uploadExperienceImage = async (
  userId: string,
  file: File,
  fileName?: string
): Promise<string | null> => {
  const fileExt = file.name.split('.').pop()
  const name = fileName || `${Date.now()}.${fileExt}`
  const filePath = `${userId}/${name}`

  const { error } = await supabase.storage
    .from('experience-images')
    .upload(filePath, file, { upsert: true })

  if (error) {
    console.error('Error uploading experience image:', error)
    return null
  }

  const { data } = supabase.storage
    .from('experience-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Subir documento de identidad
export const uploadIdentityDocument = async (
  userId: string,
  file: File,
  type: 'front' | 'back' | 'selfie'
): Promise<string | null> => {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${type}.${fileExt}`

  const { error } = await supabase.storage
    .from('identity-documents')
    .upload(filePath, file, { upsert: true })

  if (error) {
    console.error('Error uploading identity document:', error)
    return null
  }

  const { data, error: urlError } = await supabase.storage
    .from('identity-documents')
    .createSignedUrl(filePath, 3600)

  if (urlError || !data) {
    console.error('Error creating signed URL:', urlError)
    return null
  }

  return data.signedUrl
}
