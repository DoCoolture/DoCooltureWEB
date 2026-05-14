'use client'

import StartRating from '@/components/StartRating'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Description, Field, Label } from '@/shared/fieldset'
import Textarea from '@/shared/Textarea'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import PayWith from './PayWith'
import YourTrip from './YourTrip'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

const CheckoutContent = () => {
  const searchParams = useSearchParams()
  const { convertPrice } = useCurrency()
  const { t } = useLanguage()

  const [currentExplorers, setCurrentExplorers] = useState(() =>
    Math.max(1, Number(searchParams.get('explorers') || 1))
  )
  const [bookingDate, setBookingDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; fullName: string } | null>(null)
  const [userLoading, setUserLoading] = useState(true)

  React.useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single()
        setCurrentUser({
          id: user.id,
          email: user.email ?? '',
          fullName: (profile as { full_name: string | null } | null)?.full_name ?? user.email ?? '',
        })
      }
      setUserLoading(false)
    })
  }, [])

  React.useEffect(() => {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const experiencia = {
    titulo: searchParams.get('titulo') || 'Taste of Dominican Culture',
    ubicacion: searchParams.get('ubicacion') || 'Zona Colonial, Santo Domingo',
    duracion: searchParams.get('duracion') || '3–4 horas',
    precio: searchParams.get('precio') || '$120',
    imagen: (() => {
      const img = searchParams.get('imagen') || ''
      return img.startsWith('http') ? img : FALLBACK_IMAGE
    })(),
    anfitrion: searchParams.get('anfitrion') || 'DoCoolture Gastronomy',
    explorers: Math.max(1, Number(searchParams.get('explorers') || 1)),
    rating: Number(searchParams.get('rating') || 0),
    reviewCount: Number(searchParams.get('reviewCount') || 0),
  }

  const precioNum = Number(experiencia.precio.replace('$', '').replace(',', ''))
  const subtotal = precioNum * currentExplorers
  const cargoProcesamiento = 2.5
  const total = subtotal + cargoProcesamiento

  const subtotalConvertido = convertPrice(subtotal)
  const cargoConvertido = convertPrice(cargoProcesamiento)
  const totalConvertido = convertPrice(total)
  const precioUnitConvertido = convertPrice(precioNum)

  const renderSidebar = () => (
    <div className="flex w-full flex-col gap-y-6 border-neutral-200 px-0 sm:gap-y-8 sm:rounded-4xl sm:p-6 lg:border xl:p-8 dark:border-neutral-700">
      <div className="flex flex-col gap-y-4 sm:flex-row sm:items-start">
        <div className="w-full shrink-0 sm:w-44">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              alt={experiencia.titulo}
              fill
              sizes="200px"
              src={experiencia.imagen}
              className="object-cover"
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
          <StartRating point={experiencia.rating} reviewCount={experiencia.reviewCount} />
        </div>
      </div>

      <Divider className="block lg:hidden" />

      <DescriptionList>
        <DescriptionTerm>
          {precioUnitConvertido} × {currentExplorers} {currentExplorers > 1 ? t.booking.explorers : t.booking.explorer}
        </DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          {subtotalConvertido}
        </DescriptionDetails>
        <DescriptionTerm>{t.booking.processingFee}</DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          {cargoConvertido}
        </DescriptionDetails>
        <DescriptionTerm>{t.booking.taxes}</DescriptionTerm>
        <DescriptionDetails className="sm:text-right">$0.00</DescriptionDetails>
        <DescriptionTerm className="font-semibold text-neutral-900 dark:text-neutral-100">
          {t.booking.total}
        </DescriptionTerm>
        <DescriptionDetails className="font-semibold sm:text-right">
          {totalConvertido}
        </DescriptionDetails>
      </DescriptionList>

      <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
        <div className="flex items-center gap-x-2 text-sm text-neutral-600 dark:text-neutral-400">
          <UserGroupIcon className="size-4" />
          <span>
            {t.booking.host}: <strong>{experiencia.anfitrion}</strong>
          </span>
        </div>
        <p className="mt-1.5 text-xs text-neutral-500">
          {t.booking.cancellationNote}
        </p>
      </div>
    </div>
  )

  const renderMain = () => (
    <div className="flex w-full flex-col gap-y-8 border-neutral-200 px-0 sm:rounded-4xl sm:border sm:p-6 xl:p-8 dark:border-neutral-700">
      <h1 className="text-3xl font-semibold lg:text-4xl">{t.booking.confirmAndPay}</h1>
      <Divider />
      <YourTrip
        initialExplorers={experiencia.explorers}
        initialStartDate={searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null}
        onGuestsChange={setCurrentExplorers}
        onDateChange={(d) =>
          setBookingDate(d ? d.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
        }
      />

      <Field>
        <Label>{t.booking.messageLabel}</Label>
        <Description>{t.booking.messageDescription}</Description>
        <Textarea
          rows={4}
          placeholder={t.booking.messagePlaceholder}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2"
        />
      </Field>

      {userLoading ? (
        <div className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
      ) : !currentUser ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {t.booking.loginRequired}
        </p>
      ) : (
        <PayWith
          totalUsd={total}
          tourName={experiencia.titulo}
          bookingDate={bookingDate}
          guests={currentExplorers}
          customerId={currentUser.id}
          customerEmail={currentUser.email}
          customerName={currentUser.fullName}
          notes={notes || null}
        />
      )}
    </div>
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
