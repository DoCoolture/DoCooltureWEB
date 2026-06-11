'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Maximum rows per admin list fetch. Increase or add cursor pagination when data grows.
const ADMIN_PAGE_SIZE = 100

// ── Row types derived from the admin select shapes ────────────────────────────

export type AdminExperience = {
  id: string
  host_id: string
  title: string
  description: string
  category: string
  price_usd: number
  duration_time: string
  max_guests: number
  address: string
  city: string
  is_published: boolean
  is_hidden: boolean
  hidden_reason: string | null
  hidden_at: string | null
  featured_image_url: string | null
  gallery_urls: string[] | null
  average_rating: number
  total_reviews: number
  total_bookings: number
}

export type AdminIdentityVerification = {
  id: string
  status: string
  document_type: string
  document_number: string
  document_front_url: string | null
  document_back_url: string | null
  selfie_url: string | null
  created_at: string
}

export type AdminHost = {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  city: string | null
  status: string
  is_verified: boolean
  verification_status: string
  verified_at: string | null
  created_at: string
  total_listings: number
  average_rating: number
  identity_verifications: AdminIdentityVerification[]
}

export type AdminBooking = {
  id: string
  experience_id: string | null
  host_id: string | null
  tour_name: string
  booking_date: string
  guests: number
  status: string
  payment_status: string
  payment_method: string
  total_usd: number | null
  created_at: string
  customer_name: string | null
  customer_email: string
  booking_code: string
}

export type AdminVerification = {
  id: string
  host_id: string
  status: string
  document_type: string
  document_number: string
  document_front_url: string | null
  document_back_url: string | null
  selfie_url: string | null
  rejection_reason: string | null
  created_at: string
  // Supabase returns arrays for joins even on 1:many configured as FK
  hosts: { id: string; display_name: string; user_id: string }[] | null
}

async function verifyAdmin(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')
}

export async function adminFetchStats(): Promise<{
  data?: {
    totalExperiences: number
    totalHosts: number
    totalBookings: number
    pendingVerifications: number
    hiddenExperiences: number
    totalRevenue: number
  }
  error?: string
}> {
  try {
    await verifyAdmin()
    const [
      { count: expCount },
      { count: hostCount },
      { count: bookingCount },
      { count: verCount },
      { count: hiddenCount },
      { data: revenueRows },
    ] = await Promise.all([
      supabaseAdmin.from('experiences').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('hosts').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('identity_verifications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('experiences').select('id', { count: 'exact', head: true }).eq('is_hidden', true),
      supabaseAdmin.from('bookings').select('total_usd').eq('payment_status', 'paid').in('status', ['confirmed', 'completed']),
    ])
    const totalRevenue = (revenueRows ?? []).reduce((sum, row) => sum + (Number(row.total_usd) || 0), 0)
    return {
      data: {
        totalExperiences: expCount ?? 0,
        totalHosts: hostCount ?? 0,
        totalBookings: bookingCount ?? 0,
        pendingVerifications: verCount ?? 0,
        hiddenExperiences: hiddenCount ?? 0,
        totalRevenue,
      },
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminFetchExperiences(): Promise<{ data?: AdminExperience[]; error?: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin
      .from('experiences')
      .select('id, host_id, title, description, category, price_usd, duration_time, max_guests, address, city, is_published, is_hidden, hidden_reason, hidden_at, featured_image_url, gallery_urls, average_rating, total_reviews, total_bookings')
      .order('created_at', { ascending: false })
      .limit(ADMIN_PAGE_SIZE)
    if (error) return { error: error.message }
    return { data: data ?? [] }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminFetchHosts(): Promise<{ data?: AdminHost[]; error?: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin
      .from('hosts')
      .select('id, user_id, display_name, bio, city, status, is_verified, verification_status, verified_at, created_at, total_listings, average_rating, identity_verifications(id, status, document_type, document_number, document_front_url, document_back_url, selfie_url, created_at)')
      .order('created_at', { ascending: false })
      .limit(ADMIN_PAGE_SIZE)
    if (error) return { error: error.message }
    return { data: data ?? [] }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminFetchBookings(): Promise<{ data?: AdminBooking[]; error?: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id, experience_id, host_id, tour_name, booking_date, guests, status, payment_status, payment_method, total_usd, created_at, customer_name, customer_email, booking_code')
      .order('created_at', { ascending: false })
      .limit(ADMIN_PAGE_SIZE)
    if (error) return { error: error.message }
    return { data: data ?? [] }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminFetchVerifications(): Promise<{ data?: AdminVerification[]; error?: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin
      .from('identity_verifications')
      .select('id, host_id, status, document_type, document_number, document_front_url, document_back_url, selfie_url, rejection_reason, created_at, hosts(id, display_name, user_id)')
      .order('created_at', { ascending: false })
      .limit(ADMIN_PAGE_SIZE)
    if (error) return { error: error.message }
    return { data: data ?? [] }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminHideExperience(
  expId: string,
  expTitle: string,
  expHostId: string,
  currentlyHidden: boolean,
  reason: string
): Promise<{ error?: string }> {
  try {
    await verifyAdmin()

    const { error } = await supabaseAdmin
      .from('experiences')
      .update({
        is_hidden: !currentlyHidden,
        hidden_reason: currentlyHidden ? null : reason,
        hidden_at: currentlyHidden ? null : new Date().toISOString(),
      })
      .eq('id', expId)

    if (error) return { error: error.message }

    if (expHostId) {
      const { data: host } = await supabaseAdmin
        .from('hosts')
        .select('user_id')
        .eq('id', expHostId)
        .single()

      if (host) {
        const isHiding = !currentlyHidden
        await supabaseAdmin.from('notifications').insert({
          user_id: host.user_id,
          type: isHiding ? 'experience_hidden' : 'experience_visible',
          title: isHiding ? 'Tu experiencia fue pausada' : 'Tu experiencia está activa de nuevo',
          message: isHiding
            ? `Tu experiencia "${expTitle}" fue pausada por DoCoolture. Razón: ${reason}`
            : `Tu experiencia "${expTitle}" está visible nuevamente para los explorers.`,
          action_url: '/host/dashboard',
        })
      }
    }

    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminDeleteExperience(expId: string): Promise<{ error?: string }> {
  try {
    await verifyAdmin()

    const { count: activeCount } = await supabaseAdmin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('experience_id', expId)
      .in('status', ['pending', 'confirmed'])

    if (activeCount && activeCount > 0) {
      return { error: `No se puede eliminar: hay ${activeCount} reserva(s) activa(s). Cancélalas primero.` }
    }

    const { error } = await supabaseAdmin.from('experiences').delete().eq('id', expId)
    if (error) return { error: error.message }

    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminSuspendHost(
  hostId: string,
  currentStatus: string
): Promise<{ error?: string }> {
  try {
    await verifyAdmin()

    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    const { error } = await supabaseAdmin
      .from('hosts')
      .update({ status: newStatus })
      .eq('id', hostId)

    if (error) return { error: error.message }
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminVerifyHost(hostId: string): Promise<{ error?: string }> {
  try {
    await verifyAdmin()

    const { error } = await supabaseAdmin
      .from('hosts')
      .update({
        is_verified: true,
        verification_status: 'approved',
        verified_at: new Date().toISOString(),
      })
      .eq('id', hostId)

    if (error) return { error: error.message }
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

/** Generate fresh 1-hour signed URLs for identity document paths stored in the DB.
 *  Paths are stored as `userId/front.jpg` — never as signed URLs that can expire.
 */
export async function adminGetDocumentSignedUrls(
  verificationId: string
): Promise<{ data?: { frontUrl: string | null; backUrl: string | null; selfieUrl: string | null }; error?: string }> {
  try {
    await verifyAdmin()

    const { data: ver, error } = await supabaseAdmin
      .from('identity_verifications')
      .select('document_front_url, document_back_url, selfie_url')
      .eq('id', verificationId)
      .single()

    if (error || !ver) return { error: 'Verificación no encontrada.' }

    const sign = async (path: string | null) => {
      if (!path) return null
      const { data } = await supabaseAdmin.storage
        .from('identity-documents')
        .createSignedUrl(path, 3600)
      return data?.signedUrl ?? null
    }

    const [frontUrl, backUrl, selfieUrl] = await Promise.all([
      sign(ver.document_front_url),
      sign(ver.document_back_url),
      sign(ver.selfie_url),
    ])

    return { data: { frontUrl, backUrl, selfieUrl } }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function adminUpdateVerification(
  id: string,
  hostId: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<{ error?: string }> {
  try {
    await verifyAdmin()

    const { error: rpcError } = await supabaseAdmin.rpc('approve_or_reject_verification', {
      p_verification_id: id,
      p_host_id: hostId,
      p_status: status,
      p_reason: reason ?? null,
    })

    if (rpcError) return { error: rpcError.message }

    const { data: host } = await supabaseAdmin
      .from('hosts')
      .select('user_id')
      .eq('id', hostId)
      .single()

    if (host) {
      await supabaseAdmin.from('notifications').insert({
        user_id: host.user_id,
        type: status === 'approved' ? 'verification_approved' : 'verification_rejected',
        title: status === 'approved' ? '✅ Identidad verificada' : '❌ Verificación rechazada',
        message:
          status === 'approved'
            ? '¡Tu identidad ha sido verificada! Los explorers verán tu insignia de verificación.'
            : `Tu verificación fue rechazada. Razón: ${reason}`,
        action_url: '/host/profile',
      })
    }

    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}
