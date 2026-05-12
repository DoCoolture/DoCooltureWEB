'use client'

import StartRating from '@/components/StartRating'
import { useLanguage } from '@/context/LanguageContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import Form from 'next/form'
import { useState } from 'react'
import DatesRangeInputPopover from '../../components/DatesRangeInputPopover'
import GuestsInputPopover from '../../components/GuestsInputPopover'

interface Props {
  price: string
  maxGuests: number
  date?: string | null
  reviewStart: number
  reviewCount: number
  action: (formData: FormData) => Promise<void>
}

export function ExperienceBookingSidebar({
  price,
  maxGuests,
  date,
  reviewStart,
  reviewCount,
  action,
}: Props) {
  const { t } = useLanguage()
  const [explorerCount, setExplorerCount] = useState(1)
  const precioNum = Number(price.replace('$', ''))

  return (
    <div className="listingSection__wrap sm:shadow-xl">
      {/* PRECIO */}
      <div className="flex justify-between">
        <span className="text-3xl font-semibold">
          {price}
          <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
            /{t.booking.explorer}
          </span>
        </span>
        <StartRating size="lg" point={reviewStart} reviewCount={reviewCount} />
      </div>

      {/* FORMULARIO */}
      <Form
        action={action}
        className="flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-700"
        id="booking-form"
      >
        <DatesRangeInputPopover className="z-11 flex-1" />
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
        <GuestsInputPopover className="flex-1" onChangeTotalGuests={setExplorerCount} />
      </Form>

      {/* DESGLOSE DINÁMICO */}
      <DescriptionList>
        <DescriptionTerm>
          {price} × {explorerCount} {explorerCount > 1 ? t.booking.explorers : t.booking.explorer}
        </DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          ${(precioNum * explorerCount).toFixed(2)}
        </DescriptionDetails>
        <DescriptionTerm>{t.booking.processingFee}</DescriptionTerm>
        <DescriptionDetails className="sm:text-right">$2.50</DescriptionDetails>
        <DescriptionTerm className="font-semibold text-neutral-900 dark:text-neutral-100">
          {t.booking.total}
        </DescriptionTerm>
        <DescriptionDetails className="font-semibold sm:text-right">
          ${(precioNum * explorerCount + 2.5).toFixed(2)}
        </DescriptionDetails>
      </DescriptionList>

      {/* INFO IMPORTANTE */}
      <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
        <p>⏰ {t.booking.cancellationNote}</p>
        <p className="mt-1">👥 {t.booking.maxGuests} {maxGuests}</p>
        {date && <p className="mt-1">📅 {date}</p>}
      </div>

      {/* BOTÓN RESERVAR */}
      <ButtonPrimary form="booking-form" type="submit">
        {t.booking.bookNow}
      </ButtonPrimary>
    </div>
  )
}
