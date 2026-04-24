'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Calendar04Icon, UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import React from 'react'

const Page = () => {
  React.useEffect(() => {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="container mt-10 mb-24 sm:mt-16 lg:mb-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-y-10 px-0 sm:rounded-2xl sm:p-6 xl:p-8">

        {/* Header de confirmación */}
        <div className="flex items-center gap-x-4">
          <CheckCircleIcon className="size-12 text-green-500" />
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-4xl">
              ¡Reserva confirmada! 🎉
            </h1>
            <p className="mt-1 text-neutral-500">
              Recibirás un correo con los detalles de tu experiencia.
            </p>
          </div>
        </div>

        <Divider />

        {/* Experiencia reservada */}
        <div>
          <h3 className="text-xl font-semibold">Tu experiencia</h3>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center">
            <div className="w-full shrink-0 sm:w-44">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-2xl">
                <Image
                  fill
                  alt="Experiencia DoCoolture"
                  className="object-cover"
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                  sizes="200px"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 pt-5 sm:px-5 sm:pb-5">
              <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
                DoCoolture Experience
              </span>
              <span className="text-base font-semibold sm:text-lg">
                Tour gastronómico por el mercado de Villa Consuelo
              </span>
              <span className="text-sm text-neutral-500">
                Villa Consuelo, Santo Domingo · 3 horas
              </span>
              <span className="text-sm text-neutral-500">
                Anfitrión: Chef María Rodríguez
              </span>
            </div>
          </div>
        </div>

        {/* Fecha y explorers */}
        <div className="flex flex-col divide-y divide-neutral-200 rounded-3xl border border-neutral-200 sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-neutral-700 dark:border-neutral-700">
          <div className="flex flex-1 gap-x-4 p-5">
            <HugeiconsIcon icon={Calendar04Icon} size={32} strokeWidth={1.5} className="text-neutral-400" />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-400">Fecha</span>
              <span className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Sábado, 10 de mayo 2025
              </span>
            </div>
          </div>
          <div className="flex flex-1 gap-x-4 p-5">
            <HugeiconsIcon icon={UserIcon} size={32} strokeWidth={1.5} className="text-neutral-400" />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-400">Explorers</span>
              <span className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                2 Explorers
              </span>
            </div>
          </div>
        </div>

        {/* Detalle de la reserva */}
        <div>
          <h3 className="text-xl font-semibold">Detalle de la reserva</h3>
          <DescriptionList className="mt-5">
            <DescriptionTerm>Código de reserva</DescriptionTerm>
            <DescriptionDetails>#DC-2025-0001</DescriptionDetails>
            <DescriptionTerm>Fecha de reserva</DescriptionTerm>
            <DescriptionDetails>23 de abril, 2025</DescriptionDetails>
            <DescriptionTerm>Total pagado</DescriptionTerm>
            <DescriptionDetails>$92.50 USD</DescriptionDetails>
            <DescriptionTerm>Método de pago</DescriptionTerm>
            <DescriptionDetails>PayPal</DescriptionDetails>
          </DescriptionList>
        </div>

        {/* Mensaje de cancelación */}
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          ⏰ Recuerda que puedes cancelar gratuitamente hasta 48 horas antes de tu experiencia.
        </div>

        {/* CTA */}
        <div className="flex gap-x-4">
          <ButtonPrimary href="/experience">
            <HomeIcon className="size-5" />
            Explorar más experiencias
          </ButtonPrimary>
        </div>

      </div>
    </main>
  )
}

export default Page
