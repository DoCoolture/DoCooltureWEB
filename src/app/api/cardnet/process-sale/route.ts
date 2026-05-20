import { createSupabaseServerClient } from '@/lib/supabase-server'
import { CARDNET_REST_BASE } from '@/lib/cardnet'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
      hostId,
      customerName,
      customerEmail,
    } = await request.json()

    if (!cardNumber || !expirationDate || !cvv || !amount) {
      return NextResponse.json({ error: 'Missing card details' }, { status: 400 })
    }

    const merchantId = process.env.CARDNET_MERCHANT_NUMBER!
    const terminalId = process.env.CARDNET_MERCHANT_TERMINAL!
    const token = process.env.CARDNET_TOKEN ?? ''

    // Map currency text to Cardnet numeric codes
    const CURRENCY_CODES: Record<string, string> = { DOP: '214', USD: '840', EUR: '978' }
    const currencyCode = CURRENCY_CODES[currency?.toUpperCase()] ?? '214'

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

    // Step 2: Process sale
    const headersList = await headers()
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    const invoiceNum = (invoiceNumber ?? `DC${Date.now()}`).slice(-15)
    const salePayload: Record<string, unknown> = {
      'idempotency-key': idempotencyKey,
      'merchant-id': merchantId,
      'terminal-id': terminalId,
      'card-number': cardNumber,
      'expiration-date': expirationDate,
      cvv,
      amount: Number(Number(amount).toFixed(2)),
      currency: Number(currencyCode), // Cardnet espera número: 214, 840
      'invoice-number': invoiceNum,
      'client-ip': clientIp,
      environment: 'Ecommerce',
    }
    if (token) salePayload.token = token

    let saleData: any = {}
    try {
      const saleRes = await fetch(`${CARDNET_REST_BASE}/transactions/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(salePayload),
      })
      const saleRawBody = await saleRes.text()
      try { saleData = JSON.parse(saleRawBody) } catch { saleData = { message: saleRawBody } }
      if (!saleRes.ok || saleData['response-code'] !== '00') {
        const code = saleData['response-code'] ?? saleRes.status.toString()
        const desc = saleData['response-code-desc'] ?? saleData.message ?? 'Payment declined'
        return NextResponse.json({ approved: false, error: `[${code}] ${desc}`, responseCode: code, rawResponse: saleData }, { status: 402 })
      }
    } catch (err) {
      console.error('[Cardnet] Sale fetch error:', err)
      return NextResponse.json({ error: `Sale request failed: ${err}` }, { status: 500 })
    }

    // Step 3: Save booking
    const { error: dbError } = await supabase.from('bookings').insert({
      experience_id: experienceId,
      host_id: hostId,
      customer_name: customerName,
      customer_email: customerEmail,
      explorer_id: user.id,
      customer_phone: '',
      tour_name: tourName,
      booking_date: bookingDate,
      guests,
      notes,
      status: 'confirmed',
      payment_method: 'cardnet_rest',
      payment_status: 'paid',
      payment_reference: saleData['approval-code'] ?? saleData['pnRef'],
      total_amount: amount,
    })

    if (dbError) {
      console.error('Booking save error:', dbError)
      return NextResponse.json(
        { error: 'Payment processed but booking save failed' },
        { status: 500 }
      )
    }

    // Step 4: Send in-platform + email notification to host (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId, tourName, bookingDate, guests, customerName, customerEmail, totalAmount: amount, currency }),
    }).catch(() => {})

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
