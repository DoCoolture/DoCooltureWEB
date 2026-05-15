'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()

  return (
    <main className="container mt-16 mb-24 flex flex-col items-center gap-y-6 text-center">
      <XCircleIcon className="size-16 text-amber-500" />
      <h1 className="text-2xl font-semibold">Pago cancelado</h1>
      <p className="max-w-md text-neutral-500">
        Cancelaste el proceso de pago. Tu reserva no fue completada y no se realizó ningún cargo.
      </p>
      <div className="flex gap-x-4">
        <ButtonSecondary onClick={() => router.back()}>Intentar de nuevo</ButtonSecondary>
        <ButtonPrimary href="/experience">Ver experiencias</ButtonPrimary>
      </div>
    </main>
  )
}

export default Page
