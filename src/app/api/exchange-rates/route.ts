import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.error('[exchange-rates] upstream HTTP error:', res.status)
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    }

    const data = await res.json()

    if (data.result !== 'success') {
      console.error('[exchange-rates] upstream result:', data.result)
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    }

    return NextResponse.json(data.conversion_rates)
  } catch (err) {
    console.error('[exchange-rates] fetch/parse error:', err)
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
  }
}
