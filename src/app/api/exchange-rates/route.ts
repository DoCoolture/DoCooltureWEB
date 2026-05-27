import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1 hour

export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
    { next: { revalidate: 3600 } }
  )
  const data = await res.json()

  if (data.result !== 'success') {
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
  }

  return NextResponse.json(data.conversion_rates)
}
