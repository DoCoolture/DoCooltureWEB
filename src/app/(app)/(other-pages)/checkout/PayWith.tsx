'use client'

import CardnetDirectForm from '@/components/CardnetDirectForm'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import React from 'react'

const PayPalPayment = dynamic(() => import('./PayPalPayment'), { ssr: false })

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

type PaymentTab = 'paypal' | 'cardnet_rest'

const TABS: { id: PaymentTab; label: string }[] = [
  { id: 'cardnet_rest', label: 'Cardnet' },
  { id: 'paypal', label: 'PayPal' },
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
  const [activeTab, setActiveTab] = React.useState<PaymentTab>('cardnet_rest')
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
      body: JSON.stringify({
        orderID,
        experienceId,
        hostId,
        tourName,
        bookingDate,
        guests,
        notes,
        customerName,
        customerEmail,
      }),
    })
    const data = await res.json()

    if (!res.ok || data.status !== 'COMPLETED') {
      setPaypalError(data.error ?? b.bookingError)
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
            <PayPalPayment
                clientId={clientId}
                paypalRedirectText={b.paypalRedirect}
                paypalSecurityText={b.paypalSecurity}
                paypalError={paypalError}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  console.error('PayPal SDK error:', err)
                  setPaypalError(b.bookingError)
                }}
              />
          )}
        </>
      )}

      {/* Cardnet — REST */}
      {activeTab === 'cardnet_rest' && (
        <CardnetDirectForm
          totalAmount={totalUsd}
          currency="DOP"
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
