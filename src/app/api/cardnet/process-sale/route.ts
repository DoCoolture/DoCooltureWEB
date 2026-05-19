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

    // Step 1: Get idempotency key
    const keyRes = await fetch(`${CARDNET_REST_BASE}/idenpotency-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!keyRes.ok) {
      return NextResponse.json({ error: 'Failed to get idempotency key' }, { status: 500 })
    }

    // Response format: "ikey:c0930d79506f4cc49730232b0f6e0b5c"
    const keyText = await keyRes.text()
    const idempotencyKey = keyText.replace('ikey:', '').trim()

    if (!idempotencyKey) {
      return NextResponse.json({ error: 'Invalid idempotency key response' }, { status: 500 })
    }

    // Step 2: Process sale
    const headersList = await headers()
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    const saleRes = await fetch(`${CARDNET_REST_BASE}/transactions/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'idempotency-key': idempotencyKey,
        'merchant-id': merchantId,
        'terminal-id': terminalId,
        ...(token ? { token } : {}),
        'card-number': cardNumber,
        'expiration-date': expirationDate, // MM/YY
        cvv,
        amount: Number(amount),
        tip: 0,
        tax: 0,
        currency,
        'invoice-number': invoiceNumber ?? `DC-${Date.now()}`.slice(-15),
        'client-ip': clientIp,
        'reference-number': invoiceNumber ?? `DC-${Date.now()}`.slice(-15),
        environment: 'Ecommerce',
      }),
    })

    const saleData = await saleRes.json()

    if (!saleRes.ok || saleData['response-code'] !== '00') {
      return NextResponse.json(
        {
          approved: false,
          error: saleData['response-code-desc'] ?? saleData.message ?? 'Payment declined',
          responseCode: saleData['response-code'],
        },
        { status: 402 }
      )
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
