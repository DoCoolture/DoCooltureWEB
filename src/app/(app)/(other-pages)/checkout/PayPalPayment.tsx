'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

interface PayPalPaymentProps {
  clientId: string
  paypalRedirectText: string
  paypalSecurityText: string
  paypalError: string | null
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
  onError: (err: unknown) => void
}

export default function PayPalPayment({
  clientId,
  paypalRedirectText,
  paypalSecurityText,
  paypalError,
  createOrder,
  onApprove,
  onError,
}: PayPalPaymentProps) {
  return (
    <>
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-sm text-blue-700 dark:text-blue-300">{paypalRedirectText}</p>
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
          onError={onError}
        />
      </PayPalScriptProvider>
      <p className="mt-4 text-center text-xs text-neutral-400">{paypalSecurityText}</p>
    </>
  )
}
