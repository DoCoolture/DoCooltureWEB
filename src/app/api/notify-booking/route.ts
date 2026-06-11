import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendBookingNotificationEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET

if (!INTERNAL_SECRET) {
  console.warn('[notify-booking] INTERNAL_API_SECRET is not set — host notifications will be silently skipped in payment routes.')
}

export async function POST(request: NextRequest) {
  // Only allow calls from internal server routes via shared secret
  const authHeader = request.headers.get('x-internal-secret')
  if (!INTERNAL_SECRET || authHeader !== INTERNAL_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const {
      hostId,
      tourName,
      bookingDate,
      guests,
      customerName,
      customerEmail,
      totalAmount,
      currency = 'DOP',
    } = await request.json()

    if (!hostId) return NextResponse.json({ ok: false }, { status: 400 })

    // Look up host to get their user_id and display_name
    const { data: host } = await supabaseAdmin
      .from('hosts')
      .select('user_id, display_name')
      .eq('id', hostId)
      .single()

    if (!host?.user_id) return NextResponse.json({ ok: false }, { status: 404 })

    // Get host email and language preference from profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email, preferred_language')
      .eq('user_id', host.user_id)
      .single()

    const hostLocaleMap: Record<string, string> = { es: 'es-DO', en: 'en-US', fr: 'fr-FR', it: 'it-IT' }
    const notifLocale = hostLocaleMap[profile?.preferred_language ?? 'es'] ?? 'es-DO'

    const formattedDate = new Date(bookingDate).toLocaleDateString(notifLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    // Send email first — most critical path (non-blocking, never fails the request)
    if (profile?.email) {
      sendBookingNotificationEmail({
        hostEmail: profile.email,
        hostName: host.display_name,
        tourName,
        bookingDate,
        guests,
        customerName,
        customerEmail,
        totalAmount,
        currency,
        locale: profile?.preferred_language ?? 'es',
      }).catch((err) => console.error('[notify-booking] email error:', err))
    }

    // In-platform notification — locale-aware, fire-and-forget
    const lang = profile?.preferred_language ?? 'es'
    const notifStrings: Record<string, { title: string; person: string; people: string }> = {
      es: { title: 'Nueva reserva', person: 'persona', people: 'personas' },
      en: { title: 'New booking',   person: 'person',  people: 'people'   },
      fr: { title: 'Nouvelle réservation', person: 'personne', people: 'personnes' },
      it: { title: 'Nuova prenotazione',   person: 'persona',  people: 'persone'   },
    }
    const ns = notifStrings[lang] ?? notifStrings.es
    const guestWord = guests === 1 ? ns.person : ns.people

    supabaseAdmin.from('notifications').insert({
      user_id: host.user_id,
      type: 'new_booking',
      title: `${ns.title}: ${tourName}`,
      message: `${customerName} · ${formattedDate} · ${guests} ${guestWord}`,
      action_url: '/host/dashboard',
      is_read: false,
    }).then(({ error }) => {
      if (error) console.error('[notify-booking] insert error:', error)
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-booking] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
