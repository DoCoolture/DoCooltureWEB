import { getAccessToken, PAYPAL_BASE } from '@/lib/paypal'
import { calculateTotal } from '@/lib/pricing'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { currency = 'USD', description, experienceId, guests } = await request.json()

    if (!experienceId) {
      return NextResponse.json({ error: 'Missing experienceId' }, { status: 400 })
    }

    if (!['USD', 'EUR', 'DOP'].includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 })
    }

    // Verify price server-side against DB — never trust client-supplied amounts
    const { data: experience } = await supabase
      .from('experiences')
      .select('price_usd, max_guests')
      .eq('id', experienceId)
      .eq('is_published', true)
      .single()

    if (!experience?.price_usd) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Clamp guests to valid range — prevent overbooking and inflated charges
    const numGuests = Math.max(1, Math.min(Number(guests) || 1, experience.max_guests ?? 20))

    // PayPal processes USD natively; DOP/EUR orders require currency conversion before creating the order.
    // For now DOP is not a valid PayPal currency — enforce USD only.
    const paypalCurrency = currency === 'DOP' ? 'USD' : currency
    const amount = calculateTotal(experience.price_usd, numGuests)

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
              currency_code: paypalCurrency,
              value: amount.toFixed(2),
            },
            description: description ?? 'DoCoolture Experience',
          },
        ],
      }),
    })

    const order = await res.json()
    if (!res.ok) return NextResponse.json({ error: order.message ?? 'Order creation failed' }, { status: 500 })

    return NextResponse.json({ id: order.id, amount })
  } catch (err) {
    console.error('PayPal create-order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
