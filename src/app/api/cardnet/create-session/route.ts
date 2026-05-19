import { createSupabaseServerClient } from '@/lib/supabase-server'
import { CARDNET_BASE_URL, formatAmount, generateTxId } from '@/lib/cardnet'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      amount,
      currency = '214',
      orderId,
      description,
      returnUrl,
      cancelUrl,
    } = await request.json()

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const merchantNumber = process.env.CARDNET_MERCHANT_NUMBER!
    const merchantTerminal = process.env.CARDNET_MERCHANT_TERMINAL!
    const acquiringCode = process.env.CARDNET_ACQUIRING_CODE ?? '000'
    const merchantName = process.env.CARDNET_MERCHANT_NAME!

    const body = {
      TransactionType: '0200',
      Amount: formatAmount(Number(amount)),
      CurrencyCode: currency,
      Tax: '000000000000',
      MerchantNumber: merchantNumber,
      MerchantTerminal: merchantTerminal,
      AcquiringInstitutionCode: acquiringCode,
      MerchantName: merchantName,
      TransactionId: generateTxId(),
      OrdenID: orderId ?? `DC-${Date.now()}`,
      ReturnUrl: returnUrl,
      CancelUrl: cancelUrl,
      PageLanguaje: 'ESP',
    }

    const res = await fetch(`${CARDNET_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok || !data.SESSION) {
      console.error('Cardnet session error:', data)
      return NextResponse.json(
        { error: data.ResponseDescription ?? data.message ?? 'Session creation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ session: data.SESSION })
  } catch (err) {
    console.error('Cardnet create-session error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
