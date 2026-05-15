'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { useRouter } from 'next/navigation'
import React from 'react'

interface CardnetDirectFormProps {
  totalAmount: number
  currency?: string
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

const CardnetDirectForm: React.FC<CardnetDirectFormProps> = ({
  totalAmount,
  currency = 'DOP',
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
  const router = useRouter()
  const [cardNumber, setCardNumber] = React.useState('')
  const [expirationDate, setExpirationDate] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const rawCard = cardNumber.replace(/\s/g, '')
    const invoiceNumber = `DC${Date.now()}`.slice(-15)

    try {
      const res = await fetch('/api/cardnet/process-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: rawCard,
          expirationDate, // MM/YY
          cvv,
          amount: totalAmount,
          currency,
          invoiceNumber,
          tourName,
          bookingDate,
          guests,
          notes,
          experienceId,
          hostId,
          customerName,
          customerEmail,
          customerId,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.approved) {
        setError(data.error ?? 'El pago fue rechazado. Verifica los datos de tu tarjeta.')
        setLoading(false)
        return
      }

      router.push('/pay-done')
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Entorno de pruebas Cardnet (QA). No uses tarjetas reales.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Número de tarjeta
          </label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            required
            maxLength={19}
          />
        </div>

        <div className="flex gap-x-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Expiración
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={expirationDate}
              onChange={(e) => setExpirationDate(formatExpiry(e.target.value))}
              required
              maxLength={5}
            />
          </div>
          <div className="w-28">
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              CVV
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <ButtonPrimary type="submit" disabled={loading} className="w-full">
        {loading ? 'Procesando pago...' : `Pagar ${currency} ${totalAmount.toFixed(2)} con tarjeta`}
      </ButtonPrimary>

      <p className="text-center text-xs text-neutral-400">
        Pago directo procesado por Cardnet REST · TLS 1.2
      </p>
    </form>
  )
}

export default CardnetDirectForm
