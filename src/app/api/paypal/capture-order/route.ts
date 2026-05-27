import { getAccessToken, PAYPAL_BASE } from '@/lib/paypal'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { orderID } = await request.json()

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })
    }

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

    const status = capture.status // 'COMPLETED'
    const payerEmail = capture.payer?.email_address ?? null
    const transactionId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null

    return NextResponse.json({ status, payerEmail, transactionId, capture })
  } catch (err) {
    console.error('PayPal capture-order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
