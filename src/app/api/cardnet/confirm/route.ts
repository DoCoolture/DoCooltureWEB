import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

interface BookingContext {
  tourName: string
  bookingDate: string
  guests: number
  customerId: string
  customerEmail: string
  customerName: string
  notes: string | null
  experienceId: string | null
  hostId: string | null
  totalUsd: number
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      responseCode,
      authorizationCode,
      txToken,
      creditCardNumber,
      booking,
    }: {
      responseCode: string
      authorizationCode: string
      txToken: string
      creditCardNumber: string
      booking: BookingContext
    } = await request.json()

    if (responseCode !== '00') {
      return NextResponse.json(
        { error: 'Payment was not approved', responseCode },
        { status: 402 }
      )
    }

    const { error: dbError } = await supabase.from('bookings').insert({
      experience_id: booking.experienceId,
      host_id: booking.hostId,
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      explorer_id: booking.customerId,
      customer_phone: '',
      tour_name: booking.tourName,
      booking_date: booking.bookingDate,
      guests: booking.guests,
      notes: booking.notes,
      status: 'confirmed',
      payment_method: 'cardnet_redirect',
      payment_status: 'paid',
      payment_reference: txToken ?? authorizationCode,
      total_amount: booking.totalUsd,
    })

    if (dbError) {
      console.error('Booking save error:', dbError)
      return NextResponse.json({ error: 'Booking save failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, authorizationCode, maskedCard: creditCardNumber })
  } catch (err) {
    console.error('Cardnet confirm error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
