import { getAccessToken, PAYPAL_BASE } from '@/lib/paypal'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount, currency = 'USD', description } = await request.json()

    const numAmount = Number(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0 || numAmount > 10000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (!['USD', 'EUR', 'DOP'].includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 })
    }

    const accessToken = await getAccessToken()

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: Number(amount).toFixed(2),
            },
            description: description ?? 'DoCoolture Experience',
          },
        ],
      }),
    })

    const order = await res.json()
    if (!res.ok) return NextResponse.json({ error: order.message ?? 'Order creation failed' }, { status: 500 })

    return NextResponse.json({ id: order.id })
  } catch (err) {
    console.error('PayPal create-order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
