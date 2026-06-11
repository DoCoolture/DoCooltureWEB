'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Calendar04Icon, UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface BookingSummary {
  id: string
  booking_code: string
  tour_name: string
  booking_date: string
  guests: number
  total_usd: number | null
  payment_method: string
  payment_currency: string | null
  payment_reference: string | null
  created_at: string
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  paypal: 'PayPal',
  cardnet: 'Cardnet',
  cardnet_direct: 'Cardnet',
  cardnet_redirect: 'Cardnet',
}

const LOCALE_MAP: Record<string, string> = { es: 'es-DO', en: 'en-US', fr: 'fr-FR', it: 'it-IT' }

// Same env var used server-side in pricing.ts — one source of truth for the rate.
const USD_TO_DOP_DISPLAY = Number(process.env.NEXT_PUBLIC_USD_TO_DOP_RATE ?? 60)

const PayDoneContent = () => {
  const searchParams = useSearchParams()
  const { t, locale } = useLanguage()
  const pd = t.payDone
  const dateLocale = LOCALE_MAP[locale] ?? 'es-DO'
  const ref = searchParams.get('ref')
  const [booking, setBooking] = React.useState<BookingSummary | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  React.useEffect(() => {
    if (!ref) { setLoading(false); return }
    // Get the current user's profile ID to prevent IDOR
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!profile) { setLoading(false); return }
      supabase
        .from('bookings')
        .select('id, booking_code, tour_name, booking_date, guests, total_usd, payment_method, payment_currency, payment_reference, created_at')
        .eq('payment_reference', ref)
        .eq('explorer_id', profile.id)
        .single()
        .then(({ data }) => {
          setBooking(data ?? null)
          setLoading(false)
        })
    })
  }, [ref])

  const paymentCurrency = booking?.payment_currency ?? 'USD'

  // total_usd is always the USD base amount. When the customer paid in DOP,
  // convert for display so the receipt matches what was actually charged.
  const totalPaid = booking
    ? paymentCurrency === 'DOP'
      ? Number((Number(booking.total_usd ?? 0) * USD_TO_DOP_DISPLAY).toFixed(2))
      : Number(booking.total_usd ?? 0)
    : null

  const bookingCode = booking?.booking_code ?? null

  const formattedBookingDate = booking
    ? new Date(booking.booking_date).toLocaleDateString(dateLocale, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  const formattedCreatedAt = booking
    ? new Date(booking.created_at).toLocaleDateString(dateLocale, {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <main className="container mt-10 mb-24 sm:mt-16 lg:mb-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-y-10 px-0 sm:rounded-2xl sm:p-6 xl:p-8">

        <div className="flex items-center gap-x-4">
          <CheckCircleIcon className="size-12 text-green-500" />
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-4xl">
              {pd.title}
            </h1>
            <p className="mt-1 text-neutral-500">
              {pd.subtitle}
            </p>
          </div>
        </div>

        <Divider />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : booking ? (
          <>
            <div>
              <h3 className="text-xl font-semibold">{pd.yourExperience}</h3>
              <div className="mt-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
                <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
                  DoCoolture Experience
                </span>
                <p className="mt-1 text-base font-semibold">{booking.tour_name}</p>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-neutral-200 rounded-3xl border border-neutral-200 sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-neutral-700 dark:border-neutral-700">
              <div className="flex flex-1 gap-x-4 p-5">
                <HugeiconsIcon icon={Calendar04Icon} size={32} strokeWidth={1.5} className="text-neutral-400" />
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">{pd.date}</span>
                  <span className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {formattedBookingDate}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 gap-x-4 p-5">
                <HugeiconsIcon icon={UserIcon} size={32} strokeWidth={1.5} className="text-neutral-400" />
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">{pd.explorers}</span>
                  <span className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {booking.guests} {booking.guests === 1 ? pd.explorer : pd.explorers}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">{pd.bookingDetail}</h3>
              <DescriptionList className="mt-5">
                <DescriptionTerm>{pd.bookingCode}</DescriptionTerm>
                <DescriptionDetails>{bookingCode}</DescriptionDetails>
                <DescriptionTerm>{pd.bookingDate}</DescriptionTerm>
                <DescriptionDetails>{formattedCreatedAt}</DescriptionDetails>
                <DescriptionTerm>{pd.totalPaid}</DescriptionTerm>
                <DescriptionDetails>
                  {new Intl.NumberFormat(dateLocale, { style: 'currency', currency: paymentCurrency }).format(totalPaid ?? 0)}
                </DescriptionDetails>
                <DescriptionTerm>{pd.paymentMethod}</DescriptionTerm>
                <DescriptionDetails>
                  {PAYMENT_METHOD_LABELS[booking.payment_method] ?? booking.payment_method}
                </DescriptionDetails>
              </DescriptionList>
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-neutral-50 p-6 text-center dark:bg-neutral-800">
            <p className="text-neutral-500">{pd.fallbackMessage}</p>
          </div>
        )}

        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {pd.cancellationReminder}
        </div>

        <div className="flex gap-x-4">
          <ButtonPrimary href="/experience">
            <HomeIcon className="size-5" />
            {pd.exploreMore}
          </ButtonPrimary>
        </div>

      </div>
    </main>
  )
}

const Page = () => (
  <Suspense
    fallback={
      <main className="container mt-16 mb-24 flex flex-col items-center gap-y-6">
        <div className="size-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </main>
    }
  >
    <PayDoneContent />
  </Suspense>
)

export default Page
