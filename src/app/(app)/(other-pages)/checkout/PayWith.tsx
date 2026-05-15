'use client'

import CardnetDirectForm from '@/components/CardnetDirectForm'
import CardnetRedirectButton from '@/components/CardnetRedirectButton'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import React from 'react'

interface PayWithProps {
  totalUsd: number
  tourName: string
  bookingDate: string
  guests: number
  customerId: string
  customerEmail: string
  customerName: string
  notes: string | null
  experienceId: string | null
  hostId: string | null
}

type PaymentTab = 'paypal' | 'cardnet_redirect' | 'cardnet_rest'

const TABS: { id: PaymentTab; label: string }[] = [
  { id: 'paypal', label: 'PayPal' },
  { id: 'cardnet_redirect', label: 'Cardnet (Redirect)' },
  { id: 'cardnet_rest', label: 'Cardnet (REST)' },
]

const PayWith: React.FC<PayWithProps> = ({
  totalUsd,
  tourName,
  bookingDate,
  guests,
  customerId,
  customerEmail,
  customerName,
  notes,
  experienceId,
  hostId,
}) => {
  const { t } = useLanguage()
  const b = t.booking
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<PaymentTab>('paypal')
  const [paypalError, setPaypalError] = React.useState<string | null>(null)
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ''

  const createOrder = async () => {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalUsd.toFixed(2), description: tourName }),
    })
    const data = await res.json()
    if (!res.ok || !data.id) throw new Error(data.error ?? 'Failed to create order')
    return data.id as string
  }

  const onApprove = async ({ orderID }: { orderID: string }) => {
    if (!customerId) {
      setPaypalError(b.loginRequired)
      return
    }
    setPaypalError(null)
    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID }),
    })
    const data = await res.json()

    if (!res.ok || data.status !== 'COMPLETED') {
      setPaypalError(b.bookingError)
      return
    }

    const { error: dbError } = await supabase.from('bookings').insert({
      experience_id: experienceId,
      host_id: hostId,
      customer_name: customerName,
      customer_email: customerEmail || data.payerEmail,
      explorer_id: customerId,
      customer_phone: '',
      tour_name: tourName,
      booking_date: bookingDate,
      guests,
      notes,
      status: 'confirmed',
      payment_method: 'paypal',
      payment_status: 'paid',
      payment_reference: data.transactionId,
      total_amount: totalUsd,
    })

    if (dbError) {
      console.error('Booking save error:', dbError)
      setPaypalError(b.bookingError)
      return
    }

    router.push('/pay-done')
  }

  return (
    <div className="pt-5">
      <h3 className="text-2xl font-semibold">{b.paymentMethod}</h3>
      <div className="my-5 w-14 border-b border-neutral-200 dark:border-neutral-700" />

      {/* Tab selector */}
      <div className="mb-6 flex gap-x-2 overflow-x-auto rounded-2xl border border-neutral-200 p-1 dark:border-neutral-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PayPal */}
      {activeTab === 'paypal' && (
        <>
          {!clientId ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              ⚠️ PayPal no configurado. Agrega <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>,{' '}
              <code>PAYPAL_CLIENT_ID</code> y <code>PAYPAL_CLIENT_SECRET</code> a tu{' '}
              <code>.env.local</code>.
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                <p className="text-sm text-blue-700 dark:text-blue-300">{b.paypalRedirect}</p>
              </div>
              {paypalError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                  ⚠️ {paypalError}
                </div>
              )}
              <PayPalScriptProvider options={{ clientId, currency: 'USD' }}>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    console.error('PayPal SDK error:', err)
                    setPaypalError(b.bookingError)
                  }}
                />
              </PayPalScriptProvider>
              <p className="mt-4 text-center text-xs text-neutral-400">{b.paypalSecurity}</p>
            </>
          )}
        </>
      )}

      {/* Cardnet — Redirect (Opción 1: Web con Pantalla) */}
      {activeTab === 'cardnet_redirect' && (
        <CardnetRedirectButton
          totalUsd={totalUsd}
          tourName={tourName}
          bookingDate={bookingDate}
          guests={guests}
          customerId={customerId}
          customerEmail={customerEmail}
          customerName={customerName}
          notes={notes}
          experienceId={experienceId}
          hostId={hostId}
        />
      )}

      {/* Cardnet — REST Direct (Opción 3: Web sin Pantalla REST) */}
      {activeTab === 'cardnet_rest' && (
        <CardnetDirectForm
          totalAmount={totalUsd}
          currency="USD"
          tourName={tourName}
          bookingDate={bookingDate}
          guests={guests}
          customerId={customerId}
          customerEmail={customerEmail}
          customerName={customerName}
          notes={notes}
          experienceId={experienceId}
          hostId={hostId}
        />
      )}
    </div>
  )
}

export default PayWith
