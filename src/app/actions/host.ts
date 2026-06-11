'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Host, Experience, Booking } from '@/lib/supabase'

type HostDashboardData = {
  displayName: string
  host: Pick<Host, 'id' | 'display_name' | 'verification_status' | 'total_listings' | 'total_bookings' | 'total_reviews' | 'average_rating'>
  experiences: Experience[]
  bookings: Pick<Booking, 'id' | 'booking_code' | 'customer_name' | 'customer_email' | 'booking_date' | 'guests' | 'status'>[]
}

export async function fetchHostDashboard(): Promise<
  { data: HostDashboardData } | { redirect: '/login' | '/become-host' } | { adminNoHost: true } | { error: string }
> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { redirect: '/login' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('user_id', user.id)
    .single()

  const { data: hostData } = await supabase
    .from('hosts')
    .select('id, display_name, verification_status, total_listings, total_bookings, total_reviews, average_rating')
    .eq('user_id', user.id)
    .single()

  if (!hostData) {
    if (profile?.role === 'admin') return { adminNoHost: true }
    return { redirect: '/become-host' }
  }

  const { data: experiencesData } = await supabase
    .from('experiences')
    .select('id, host_id, title, short_description, description, category, tags, price_usd, duration_time, max_guests, min_guests, address, city, is_published, is_hidden, featured_image_url, gallery_urls, average_rating, total_reviews, price_includes, price_excludes, available_days, available_times, languages, meeting_point, latitude, longitude')
    .eq('host_id', hostData.id)
    .order('created_at', { ascending: false })

  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('id, booking_code, customer_name, customer_email, booking_date, guests, status')
    .eq('host_id', hostData.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    data: {
      displayName: profile?.display_name ?? '',
      host: hostData as HostDashboardData['host'],
      experiences: (experiencesData ?? []) as Experience[],
      bookings: (bookingsData ?? []) as HostDashboardData['bookings'],
    },
  }
}

/** Allow only http/https URLs — rejects javascript:, data:, etc. */
function sanitizeUrl(raw: string): string | null {
  const url = raw.trim().slice(0, 200)
  if (!url) return null
  try {
    const parsed = new URL(url)
    return ['https:', 'http:'].includes(parsed.protocol) ? url : null
  } catch {
    return null
  }
}

export interface RegisterHostInput {
  displayName: string
  bio: string
  city: string
  phone: string
  whatsapp: string
  specialties: string[]
  languages: string[]
  yearsExperience: number
  instagramUrl: string
  facebookUrl: string
  websiteUrl: string
  documentType: string
  documentNumber: string
  documentFrontUrl: string | null
  documentBackUrl: string | null
  selfieUrl: string | null
}

export async function registerHost(
  input: RegisterHostInput
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single()
  if (!profile) return { error: 'Perfil no encontrado.' }

  // Prevent duplicate host profiles
  const { data: existingHost } = await supabase
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (existingHost) return { error: 'Ya tienes un perfil de anfitrión.' }

  const displayName = input.displayName.trim().slice(0, 100)
  if (displayName.length < 3) return { error: 'El nombre debe tener al menos 3 caracteres.' }

  const bio = input.bio.trim().slice(0, 1000)
  if (bio.length < 30) return { error: 'La biografía debe tener al menos 30 caracteres.' }

  // Insert host record
  const { data: host, error: hostError } = await supabaseAdmin
    .from('hosts')
    .insert({
      profile_id: profile.id,
      user_id: user.id,
      display_name: displayName,
      bio,
      city: input.city.slice(0, 100),
      whatsapp: input.whatsapp.slice(0, 30) || null,
      specialties: input.specialties,
      languages: input.languages,
      years_experience: Math.min(Math.max(0, input.yearsExperience), 50),
      instagram_url: sanitizeUrl(input.instagramUrl),
      facebook_url: sanitizeUrl(input.facebookUrl),
      website_url: sanitizeUrl(input.websiteUrl),
    })
    .select('id')
    .single()

  if (hostError || !host) return { error: hostError?.message ?? 'Error al crear el perfil.' }

  // Preserve admin role — never downgrade an admin
  const newRole = profile.role === 'admin' ? 'admin' : 'host'
  await supabaseAdmin
    .from('profiles')
    .update({ role: newRole, phone: input.phone.slice(0, 30) || null })
    .eq('user_id', user.id)

  // Save identity verification if documents were provided
  if (input.documentFrontUrl || input.documentBackUrl || input.selfieUrl) {
    await supabaseAdmin.from('identity_verifications').insert({
      host_id: host.id,
      document_type: input.documentType,
      document_number: input.documentNumber.slice(0, 50),
      document_front_url: input.documentFrontUrl,
      document_back_url: input.documentBackUrl,
      selfie_url: input.selfieUrl,
      status: 'pending',
    })
  }

  // Welcome notification (non-blocking — failure doesn't rollback)
  await supabaseAdmin.from('notifications').insert({
    user_id: user.id,
    type: 'new_host_registration',
    title: '¡Bienvenido como anfitrión!',
    message: 'Tu perfil de anfitrión ha sido creado. Estamos revisando tu verificación de identidad.',
    action_url: '/host/dashboard',
  })

  return {}
}

export async function hostTogglePublish(
  expId: string,
  currentPublished: boolean
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: host } = await supabase
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!host) return { error: 'Sin perfil de anfitrión.' }

  const { error } = await supabase
    .from('experiences')
    .update({ is_published: !currentPublished })
    .eq('id', expId)
    .eq('host_id', host.id)

  return error ? { error: error.message } : {}
}

export async function hostDeleteExperience(expId: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: host } = await supabase
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!host) return { error: 'Sin perfil de anfitrión.' }

  const { count: activeBookings } = await supabaseAdmin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('experience_id', expId)
    .in('status', ['pending', 'confirmed'])

  if (activeBookings && activeBookings > 0) {
    return { error: `No se puede eliminar: hay ${activeBookings} reserva(s) activa(s). Cancélalas primero.` }
  }

  const { error } = await supabaseAdmin
    .from('experiences')
    .delete()
    .eq('id', expId)
    .eq('host_id', host.id)

  return error ? { error: error.message } : {}
}

export interface UpdateHostProfileInput {
  displayName: string
  bio: string
  city: string
  country: string
  whatsapp: string
  instagramUrl: string
  facebookUrl: string
  websiteUrl: string
  avatarUrl: string
}

export async function updateHostProfile(
  input: UpdateHostProfileInput
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const displayName = input.displayName.trim().slice(0, 100)
  if (displayName.length < 2) return { error: 'El nombre debe tener al menos 2 caracteres.' }

  const bio = input.bio.trim().slice(0, 1000)
  const city = input.city.trim().slice(0, 100)
  const country = input.country.trim().slice(0, 100)
  const whatsapp = input.whatsapp.trim().slice(0, 30)
  const instagramUrl = sanitizeUrl(input.instagramUrl)
  const facebookUrl = sanitizeUrl(input.facebookUrl)
  const websiteUrl = sanitizeUrl(input.websiteUrl)
  const avatarUrl = sanitizeUrl(input.avatarUrl) ?? null

  const { data: host } = await supabase
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!host) return { error: 'Perfil de anfitrión no encontrado.' }

  const [{ error: hostErr }, { error: profileErr }] = await Promise.all([
    supabaseAdmin.from('hosts').update({
      display_name: displayName,
      bio: bio || null,
      city: city || null,
      country: country || null,
      whatsapp: whatsapp || null,
      instagram_url: instagramUrl,
      facebook_url: facebookUrl,
      website_url: websiteUrl,
    }).eq('id', host.id),
    supabaseAdmin.from('profiles').update({
      display_name: displayName,
      city: city || null,
      about_me: bio || null,
      avatar_url: avatarUrl || null,
    }).eq('user_id', user.id),
  ])

  const err = hostErr ?? profileErr
  return err ? { error: err.message } : {}
}
