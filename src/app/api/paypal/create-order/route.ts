import { NextRequest, NextResponse } from 'next/server'

const PAYPAL_BASE = process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_CLIENT_SECRET!
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description ?? 'PayPal auth failed')
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', description } = await request.json()

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
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
