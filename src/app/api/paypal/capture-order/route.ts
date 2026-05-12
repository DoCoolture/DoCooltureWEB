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
