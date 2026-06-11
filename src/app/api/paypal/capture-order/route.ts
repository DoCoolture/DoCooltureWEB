import { getAccessToken, PAYPAL_BASE } from '@/lib/paypal'
import { calculateTotal } from '@/lib/pricing'
import { createSupabaseServerClient, getProfileId } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profileId = await getProfileId(supabase, user.id)
    if (!profileId) return NextResponse.json({ error: 'Tu perfil aún se está configurando. Espera un momento e intenta de nuevo.' }, { status: 400 })

    const {
      orderID,
      experienceId,
      tourName,
      bookingDate,
      guests,
      notes,
      customerName,
      customerEmail,
    } = await request.json()

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })
    }

    if (!experienceId) {
      return NextResponse.json({ error: 'Missing booking details' }, { status: 400 })
    }

    // Fetch the authoritative price, title, host, and max_guests from the database.
    const { data: experience } = await supabase
      .from('experiences')
      .select('price_usd, title, host_id, max_guests')
      .eq('id', experienceId)
      .eq('is_published', true)
      .single()

    if (!experience?.price_usd) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    const hostId = experience.host_id
    const authoritativeTourName = experience.title ?? tourName

    // Clamp guests server-side — same as Cardnet route
    const numGuests = Math.max(1, Math.min(Number(guests) || 1, experience.max_guests ?? 20))
    const expectedTotal = calculateTotal(experience.price_usd, numGuests)

    const accessToken = await getAccessToken()

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const capture = await res.json()
    if (!res.ok) return NextResponse.json({ error: capture.message ?? 'Capture failed' }, { status: 500 })

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    // Verify the captured amount matches the expected price
    const capturedAmount = Number(
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ?? '0'
    )
    if (Math.abs(capturedAmount - expectedTotal) > 0.02) {
      console.error(`[paypal] amount mismatch: captured ${capturedAmount}, expected ${expectedTotal}`)
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 422 })
    }

    const payerEmail = capture.payer?.email_address ?? null
    const transactionId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null

    const subtotalUsd = Number((experience.price_usd * numGuests).toFixed(2))
    const processingFeeUsd = Number((capturedAmount - subtotalUsd).toFixed(2))

    const { error: dbError } = await supabase.from('bookings').insert({
      experience_id: experienceId,
      host_id: hostId,
      customer_name: customerName,
      customer_email: customerEmail || payerEmail,
      explorer_id: profileId,
      customer_phone: '',
      tour_name: authoritativeTourName,
      booking_date: bookingDate,
      guests: numGuests,
      notes,
      status: 'confirmed',
      payment_method: 'paypal',
      payment_status: 'paid',
      payment_currency: 'USD',
      payment_reference: transactionId,
      price_per_person: experience.price_usd,
      subtotal_usd: subtotalUsd,
      processing_fee_usd: processingFeeUsd,
      total_usd: capturedAmount,
    })

    if (dbError) {
      console.error('[paypal] CRITICAL: payment captured but booking save failed', {
        transactionId,
        experienceId,
        customerEmail: customerEmail || payerEmail,
        capturedAmount,
        error: dbError,
      })
      return NextResponse.json({ error: 'Payment captured but booking save failed. Contact support.' }, { status: 500 })
    }

    // Notify host (non-blocking) — log on failure so silent errors don't hide missed notifications
    const internalSecret = process.env.INTERNAL_API_SECRET
    if (internalSecret) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-secret': internalSecret },
        body: JSON.stringify({ hostId, tourName: authoritativeTourName, bookingDate, guests: numGuests, customerName, customerEmail: customerEmail || payerEmail, totalAmount: capturedAmount, currency: 'USD' }),
      }).catch((err) => console.error('[paypal] notify-booking failed:', err))
    }

    return NextResponse.json({ status: capture.status, payerEmail, transactionId })
  } catch (err) {
    console.error('PayPal capture-order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
