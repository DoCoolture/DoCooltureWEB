import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendBookingNotificationEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    // Get host email from profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('user_id', host.user_id)
      .single()

    // Insert in-platform notification (fire and forget if it fails)
    const formattedDate = new Date(bookingDate).toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    await supabaseAdmin.from('notifications').insert({
      user_id: host.user_id,
      type: 'new_booking',
      title: `Nueva reserva: ${tourName}`,
      message: `${customerName} reservó para el ${formattedDate} · ${guests} persona${guests !== 1 ? 's' : ''}`,
      action_url: '/host/dashboard',
      is_read: false,
    })

    // Send email (non-blocking — don't fail the request if email errors)
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
      }).catch((err) => console.error('[notify-booking] email error:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-booking] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
