'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

const CardnetReturnContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const responseCode = searchParams.get('ResponseCode') ?? ''
  const authorizationCode = searchParams.get('AuthorizationCode') ?? ''
  const txToken = searchParams.get('TxToken') ?? ''
  const creditCardNumber = searchParams.get('CreditCardNumber') ?? ''

  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = React.useState('')

  React.useEffect(() => {
    const bookingRaw = sessionStorage.getItem('cardnet_booking_context')
    if (!bookingRaw) {
      setErrorMsg('No se encontró el contexto de la reserva. Por favor intenta de nuevo.')
      setStatus('error')
      return
    }

    let booking: unknown
    try {
      booking = JSON.parse(bookingRaw)
    } catch {
      setErrorMsg('Error al leer la reserva. Por favor intenta de nuevo.')
      setStatus('error')
      return
    }

    fetch('/api/cardnet/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseCode, authorizationCode, txToken, creditCardNumber, booking }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.removeItem('cardnet_booking_context')
          setStatus('success')
          setTimeout(() => router.push('/pay-done'), 1500)
        } else {
          setErrorMsg(data.error ?? 'No se pudo confirmar el pago.')
          setStatus('error')
        }
      })
      .catch(() => {
        setErrorMsg('Error de conexión al confirmar el pago.')
        setStatus('error')
      })
  }, [responseCode, authorizationCode, txToken, creditCardNumber, router])

  if (status === 'loading') {
    return (
      <main className="container mt-16 mb-24 flex flex-col items-center gap-y-6 text-center">
        <div className="size-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Confirmando tu pago...</p>
      </main>
    )
  }

  if (status === 'success') {
    return (
      <main className="container mt-16 mb-24 flex flex-col items-center gap-y-6 text-center">
        <CheckCircleIcon className="size-16 text-green-500" />
        <h1 className="text-2xl font-semibold">¡Pago confirmado!</h1>
        <p className="text-neutral-500">Redirigiendo a tu confirmación de reserva...</p>
      </main>
    )
  }

  return (
    <main className="container mt-16 mb-24 flex flex-col items-center gap-y-6 text-center">
      <ExclamationTriangleIcon className="size-16 text-red-500" />
      <h1 className="text-2xl font-semibold">Error al confirmar el pago</h1>
      <p className="max-w-md text-neutral-500">{errorMsg}</p>
      <ButtonPrimary href="/experience">Volver a experiencias</ButtonPrimary>
    </main>
  )
}

const Page = () => (
  <Suspense
    fallback={
      <main className="container mt-16 mb-24 flex flex-col items-center gap-y-6 text-center">
        <div className="size-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Cargando...</p>
      </main>
    }
  >
    <CardnetReturnContent />
  </Suspense>
)

export default Page
