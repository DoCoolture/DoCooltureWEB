'use client'

import StartRating from '@/components/StartRating'
import { useCurrency } from '@/context/CurrencyContext'
import { supabase } from '@/lib/supabase'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import PayWith from './PayWith'
import YourTrip from './YourTrip'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

const CheckoutContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { convertPrice } = useCurrency()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  React.useEffect(() => {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const experiencia = {
    titulo: searchParams.get('titulo') || 'Taste of Dominican Culture',
    ubicacion: searchParams.get('ubicacion') || 'Zona Colonial, Santo Domingo',
    duracion: searchParams.get('duracion') || '3–4 horas',
    precio: searchParams.get('precio') || '$120',
    // ✅ FIX imagen — usa fallback si la ruta es local o está vacía
    imagen: (() => {
      const img = searchParams.get('imagen') || ''
      return img.startsWith('http') ? img : FALLBACK_IMAGE
    })(),
    anfitrion: searchParams.get('anfitrion') || 'DoCoolture Gastronomy',
    // ✅ FIX explorers — lee correctamente del URL param
    explorers: Math.max(1, Number(searchParams.get('explorers') || 1)),
  }

  const precioNum = Number(experiencia.precio.replace('$', '').replace(',', ''))
  const subtotal = precioNum * experiencia.explorers
  const cargoProcesamiento = 2.5
  const total = subtotal + cargoProcesamiento

  // ✅ Precios convertidos a la moneda seleccionada
  const subtotalConvertido = convertPrice(subtotal)
  const cargoConvertido = convertPrice(cargoProcesamiento)
  const totalConvertido = convertPrice(total)
  const precioUnitConvertido = convertPrice(precioNum)

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const customerEmail = (formData.get('paypal-email') as string) || ''
    const notes = (formData.get('message') as string) || null
    const startDateRaw = formData.get('startDate') as string

    const bookingDate = startDateRaw
      ? new Date(startDateRaw).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('bookings').insert({
      customer_name: 'Pendiente',
      customer_email: customerEmail,
      customer_phone: '',
      tour_name: experiencia.titulo,
      booking_date: bookingDate,
      guests: experiencia.explorers,
      status: 'pending',
      notes: notes,
      total_amount: total,
      payment_method: 'paypal',
    })

    if (error) {
      console.error('❌ Error Supabase:', error)
      setErrorMsg('Hubo un error al guardar tu reserva. Por favor intenta de nuevo.')
      setIsLoading(false)
      return
    }

    router.push('/pay-done')
  }

  const renderSidebar = () => (
    <div className="flex w-full flex-col gap-y-6 border-neutral-200 px-0 sm:gap-y-8 sm:rounded-4xl sm:p-6 lg:border xl:p-8 dark:border-neutral-700">
      {/* Imagen + info */}
      <div className="flex flex-col gap-y-4 sm:flex-row sm:items-start">
        <div className="w-full shrink-0 sm:w-44">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              alt={experiencia.titulo}
              fill
              sizes="200px"
              src={experiencia.imagen}
              className="object-cover"
              // ✅ FIX: si la imagen falla, muestra el fallback
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = FALLBACK_IMAGE
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 sm:ps-5">
          <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
            DoCoolture Experience
          </span>
          <span className="text-base font-semibold leading-snug">
            {experiencia.titulo}
          </span>
          <div className="flex items-center gap-x-1.5 text-sm text-neutral-500">
            <MapPinIcon className="size-4" />
            {experiencia.ubicacion}
          </div>
          <div className="flex items-center gap-x-1.5 text-sm text-neutral-500">
            <ClockIcon className="size-4" />
            {experiencia.duracion}
          </div>
          <Divider className="w-10!" />
          <StartRating />
        </div>
      </div>

      <Divider className="block lg:hidden" />

      {/* ✅ Desglose con moneda convertida */}
      <DescriptionList>
        <DescriptionTerm>
          {precioUnitConvertido} × {experiencia.explorers} explorer{experiencia.explorers > 1 ? 's' : ''}
        </DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          {subtotalConvertido}
        </DescriptionDetails>
        <DescriptionTerm>Cargo de procesamiento</DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          {cargoConvertido}
        </DescriptionDetails>
        <DescriptionTerm>Impuestos</DescriptionTerm>
        <DescriptionDetails className="sm:text-right">$0.00</DescriptionDetails>
        <DescriptionTerm className="font-semibold text-neutral-900 dark:text-neutral-100">
          Total
        </DescriptionTerm>
        <DescriptionDetails className="font-semibold sm:text-right">
          {totalConvertido}
        </DescriptionDetails>
      </DescriptionList>

      {/* Info anfitrión */}
      <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
        <div className="flex items-center gap-x-2 text-sm text-neutral-600 dark:text-neutral-400">
          <UserGroupIcon className="size-4" />
          <span>
            Anfitrión: <strong>{experiencia.anfitrion}</strong>
          </span>
        </div>
        <p className="mt-1.5 text-xs text-neutral-500">
          Cancelación gratuita hasta 24 horas antes de la experiencia.
        </p>
      </div>
    </div>
  )

  const renderMain = () => (
    <form
      onSubmit={handleSubmitForm}
      className="flex w-full flex-col gap-y-8 border-neutral-200 px-0 sm:rounded-4xl sm:border sm:p-6 xl:p-8 dark:border-neutral-700"
    >
      <h1 className="text-3xl font-semibold lg:text-4xl">Confirmar y pagar</h1>
      <Divider />
      <YourTrip
        initialExplorers={experiencia.explorers}
        initialStartDate={searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null}
      />
      <PayWith />

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          ⚠️ {errorMsg}
        </div>
      )}

      <div>
        <ButtonPrimary
          type="submit"
          disabled={isLoading}
          className="mt-10 w-full text-base/6! sm:w-auto disabled:opacity-60"
        >
          {isLoading ? 'Guardando reserva...' : 'Confirmar reserva'}
        </ButtonPrimary>
        <p className="mt-3 text-sm text-neutral-500">
          Al confirmar aceptas los{' '}
          <a href="/terminos" className="underline">
            términos y condiciones
          </a>{' '}
          de DoCoolture.
        </p>
      </div>
    </form>
  )

  return (
    <main className="container mt-10 mb-24 flex flex-col gap-14 lg:mb-32 lg:flex-row lg:gap-10">
      <div className="w-full lg:w-3/5 xl:w-2/3">{renderMain()}</div>
      <Divider className="block lg:hidden" />
      <div className="grow">{renderSidebar()}</div>
    </main>
  )
}

const CheckoutLoading = () => (
  <main className="container mt-10 mb-24 flex flex-col gap-14 lg:mb-32 lg:flex-row lg:gap-10">
    <div className="w-full lg:w-3/5 xl:w-2/3">
      <div className="animate-pulse space-y-6 rounded-4xl border border-neutral-200 p-6 dark:border-neutral-700">
        <div className="h-8 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
    <div className="grow">
      <div className="animate-pulse space-y-4 rounded-4xl border border-neutral-200 p-6 dark:border-neutral-700">
        <div className="h-32 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  </main>
)

const Page = () => {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}

export default Page
