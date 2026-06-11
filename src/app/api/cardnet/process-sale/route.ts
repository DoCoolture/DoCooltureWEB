import { createSupabaseServerClient, getProfileId } from '@/lib/supabase-server'
import { CARDNET_REST_BASE } from '@/lib/cardnet'
import { calculateTotal, toDopAmount } from '@/lib/pricing'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profileId = await getProfileId(supabase, user.id)
    if (!profileId) return NextResponse.json({ error: 'Tu perfil aún se está configurando. Espera un momento e intenta de nuevo.' }, { status: 400 })

    const {
      cardNumber,
      expirationDate,
      cvv,
      amount,
      currency = 'DOP',
      invoiceNumber,
      tourName,
      bookingDate,
      guests,
      notes,
      experienceId,
      customerName,
      customerEmail,
    } = await request.json()

    if (!cardNumber || !expirationDate || !cvv || !amount) {
      return NextResponse.json({ error: 'Missing card details' }, { status: 400 })
    }

    if (!experienceId) {
      return NextResponse.json({ error: 'Missing booking details' }, { status: 400 })
    }

    // Validate amount against the authoritative DB price — never trust client-supplied amount.
    // Also fetch host_id, title and max_guests from DB so the client cannot redirect notifications,
    // inject a spoofed tour name, or book more guests than the experience allows.
    const { data: experience } = await supabase
      .from('experiences')
      .select('price_usd, title, host_id, max_guests')
      .eq('id', experienceId)
      .eq('is_published', true)
      .single()

    if (!experience?.price_usd) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Derive hostId and tour name from DB — never from client
    const hostId = experience.host_id
    const authoritativeTourName = experience.title ?? tourName

    // Clamp guests: at least 1, at most max_guests from DB
    const numGuests = Math.max(1, Math.min(Number(guests) || 1, experience.max_guests ?? 20))

    const expectedTotal = calculateTotal(experience.price_usd, numGuests)
    if (Math.abs(Number(amount) - expectedTotal) > 0.02) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 422 })
    }

    // Convert to charge currency: price_usd is always USD; Cardnet default is DOP
    const CURRENCY_CODES: Record<string, string> = { DOP: '214', USD: '840', EUR: '978' }
    const currencyCode = CURRENCY_CODES[currency?.toUpperCase()] ?? '214'
    const chargeAmount = currency?.toUpperCase() === 'DOP' ? toDopAmount(expectedTotal) : expectedTotal

    const merchantId = process.env.CARDNET_MERCHANT_NUMBER!
    const terminalId = process.env.CARDNET_MERCHANT_TERMINAL!
    const token = process.env.CARDNET_TOKEN ?? ''

    // Step 1: Get idempotency key
    let keyText = ''
    try {
      const keyRes = await fetch(`${CARDNET_REST_BASE}/idenpotency-keys`, {
        method: 'POST',
        headers: { Accept: 'text/plain' },
      })
      keyText = await keyRes.text()
      if (!keyRes.ok) {
        return NextResponse.json({ error: `Idempotency key failed: ${keyRes.status} ${keyText}` }, { status: 500 })
      }
    } catch (err) {
      console.error('[Cardnet] Idempotency key fetch error:', err)
      return NextResponse.json({ error: `Cannot reach Cardnet server: ${err}` }, { status: 500 })
    }

    // Response format: "ikey:c0930d79506f4cc49730232b0f6e0b5c"
    const idempotencyKey = keyText.replace('ikey:', '').trim()
    if (!idempotencyKey) {
      return NextResponse.json({ error: `Invalid idempotency key format: "${keyText}"` }, { status: 500 })
    }

    // Step 2: Create booking in 'pending_payment' BEFORE charging.
    // If the DB is down right now, we fail here and the card is never charged.
    const invoiceNum = (invoiceNumber ?? `DC${Date.now()}`).slice(-15)
    const subtotalUsd = Number((experience.price_usd * numGuests).toFixed(2))
    const processingFeeUsd = Number((expectedTotal - subtotalUsd).toFixed(2))

    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        experience_id: experienceId,
        host_id: hostId,
        customer_name: customerName,
        customer_email: customerEmail,
        explorer_id: profileId,
        customer_phone: null,
        tour_name: authoritativeTourName,
        booking_date: bookingDate,
        guests: numGuests,
        notes,
        status: 'pending_payment',
        payment_method: 'cardnet_direct',
        payment_status: 'pending',
        payment_currency: currency?.toUpperCase() ?? 'DOP',
        price_per_person: experience.price_usd,
        subtotal_usd: subtotalUsd,
        processing_fee_usd: processingFeeUsd,
        total_usd: expectedTotal,
      })
      .select('id')
      .single()

    if (insertError || !newBooking) {
      console.error('[Cardnet] Booking pre-insert error:', insertError)
      return NextResponse.json({ error: 'No se pudo iniciar la reserva. Intenta de nuevo.' }, { status: 500 })
    }

    const bookingId = newBooking.id

    // Step 3: Process sale with Cardnet
    const headersList = await headers()
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    const salePayload: Record<string, unknown> = {
      'idempotency-key': idempotencyKey,
      'merchant-id': merchantId,
      'terminal-id': terminalId,
      'card-number': cardNumber,
      'expiration-date': expirationDate,
      cvv,
      amount: chargeAmount,
      currency: Number(currencyCode), // Cardnet espera número: 214=DOP, 840=USD
      'invoice-number': invoiceNum,
      'client-ip': clientIp,
      environment: 'Ecommerce',
    }
    if (token) salePayload.token = token

    type CardnetSaleResponse = {
      'response-code'?: string
      'response-code-desc'?: string
      'approval-code'?: string
      pnRef?: string
      message?: string
    }
    let saleData: CardnetSaleResponse = {}
    try {
      const saleRes = await fetch(`${CARDNET_REST_BASE}/transactions/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(salePayload),
      })
      const saleRawBody = await saleRes.text()
      try { saleData = JSON.parse(saleRawBody) } catch { saleData = { message: saleRawBody } }

      if (!saleRes.ok || saleData['response-code'] !== '00') {
        // Payment declined or network error — mark booking as failed so it can be audited
        await supabase
          .from('bookings')
          .update({ status: 'payment_failed', payment_status: 'failed' })
          .eq('id', bookingId)

        const code = saleData['response-code'] ?? saleRes.status.toString()
        const desc = saleData['response-code-desc'] ?? saleData.message ?? 'Payment declined'
        return NextResponse.json({ approved: false, error: `[${code}] ${desc}`, responseCode: code, rawResponse: saleData }, { status: 402 })
      }
    } catch (err) {
      // Cardnet unreachable — mark booking as failed
      await supabase
        .from('bookings')
        .update({ status: 'payment_failed', payment_status: 'failed' })
        .eq('id', bookingId)

      console.error('[Cardnet] Sale fetch error:', err)
      return NextResponse.json({ error: `Sale request failed: ${err}` }, { status: 500 })
    }

    // Step 4: Payment approved — confirm the booking.
    // Retry once on failure: the card is already charged, so a confirmed booking
    // with its payment_reference is worth a second attempt before giving up.
    const paymentReference = saleData['approval-code'] ?? saleData['pnRef']
    const confirmUpdate = () =>
      supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_reference: paymentReference,
        })
        .eq('id', bookingId)

    let { error: confirmError } = await confirmUpdate()
    if (confirmError) {
      await new Promise((r) => setTimeout(r, 500))
      ;({ error: confirmError } = await confirmUpdate())
    }

    if (confirmError) {
      // Card was charged but confirmation update failed after retry — log for manual review
      console.error('[Cardnet] CRITICAL: payment charged but booking confirm failed', {
        bookingId,
        experienceId,
        customerEmail,
        totalUsd: expectedTotal,
        currency,
        approvalCode: saleData['approval-code'],
        pnRef: saleData['pnRef'],
        error: confirmError,
      })
      // Still return success to the client — the booking exists in pending_payment
      // and can be reconciled from the logs / Cardnet dashboard
    }

    // Step 5: Notify host (non-blocking)
    const internalSecret = process.env.INTERNAL_API_SECRET
    if (internalSecret) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-secret': internalSecret },
        body: JSON.stringify({ hostId, tourName: authoritativeTourName, bookingDate, guests: numGuests, customerName, customerEmail, totalAmount: expectedTotal, currency }),
      }).catch((err) => console.error('[cardnet] notify-booking failed:', err))
    }

    return NextResponse.json({
      approved: true,
      approvalCode: saleData['approval-code'],
      pnRef: saleData['pnRef'],
      responseCodeDesc: saleData['response-code-desc'],
    })
  } catch (err) {
    console.error('Cardnet process-sale error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
