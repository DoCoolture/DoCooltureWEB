'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { CARDNET_AUTHORIZE_URL } from '@/lib/cardnet'
import React from 'react'

interface CardnetRedirectButtonProps {
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

const CardnetRedirectButton: React.FC<CardnetRedirectButtonProps> = ({
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
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const handlePay = async () => {
    setLoading(true)
    setError(null)

    sessionStorage.setItem(
      'cardnet_booking_context',
      JSON.stringify({
        tourName,
        bookingDate,
        guests,
        customerId,
        customerEmail,
        customerName,
        notes,
        experienceId,
        hostId,
        totalUsd,
      })
    )

    const orderId = `DC-${Date.now()}`

    try {
      const res = await fetch('/api/cardnet/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalUsd,
          currency: '840',
          orderId,
          description: tourName,
          returnUrl: `${appUrl}/cardnet-return`,
          cancelUrl: `${appUrl}/cardnet-cancel`,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.session) {
        setError(data.error ?? 'Error al iniciar el pago con Cardnet')
        setLoading(false)
        return
      }

      // Dynamically create and submit a form to redirect to Cardnet's hosted page
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = CARDNET_AUTHORIZE_URL
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'SESSION'
      input.value = data.session
      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Serás redirigido a la plataforma segura de Cardnet para completar tu pago con tarjeta de
          crédito o débito dominicana.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <ButtonPrimary onClick={handlePay} disabled={loading} className="w-full">
        {loading ? 'Iniciando pago...' : `Pagar $${totalUsd.toFixed(2)} con Cardnet`}
      </ButtonPrimary>

      <p className="text-center text-xs text-neutral-400">
        Pago seguro procesado por Cardnet · TLS 1.2 · 3D Secure
      </p>
    </div>
  )
}

export default CardnetRedirectButton
