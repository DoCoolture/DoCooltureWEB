'use client'

import StartRating from '@/components/StartRating'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import Form from 'next/form'
import { useEffect, useState } from 'react'
import DatesRangeInputPopover from '../../components/DatesRangeInputPopover'
import GuestsInputPopover from '../../components/GuestsInputPopover'

interface Props {
  price: string
  maxGuests: number
  date?: string | null
  reviewStart: number
  reviewCount: number
  availableDays: string[]
  durationTime: string
  selectedDate?: Date | null
  onDateSelect?: (date: Date | null) => void
  action: (formData: FormData) => Promise<void>
}

export function ExperienceBookingSidebar({
  price,
  maxGuests,
  date,
  reviewStart,
  reviewCount,
  availableDays,
  durationTime,
  selectedDate,
  onDateSelect,
  action,
}: Props) {
  const { t } = useLanguage()
  const { convertPrice } = useCurrency()
  const [explorerCount, setExplorerCount] = useState(1)
  const [hasDate, setHasDate] = useState(!!selectedDate)

  useEffect(() => {
    setHasDate(!!selectedDate)
  }, [selectedDate])
  const precioNum = Number(price.replace(/[^0-9.]/g, ''))

  return (
    <div className="listingSection__wrap sm:shadow-xl">
      {/* PRECIO */}
      <div className="flex justify-between">
        <span className="text-3xl font-semibold">
          {convertPrice(precioNum)}
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
        <DatesRangeInputPopover
          className="z-11 flex-1"
          availableDays={availableDays}
          durationTime={durationTime}
          externalDate={selectedDate}
          onDateChange={(d) => {
            setHasDate(!!d)
            onDateSelect?.(d)
          }}
        />
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
        <GuestsInputPopover className="flex-1" maxGuests={maxGuests} onChangeTotalGuests={setExplorerCount} />
      </Form>

      {/* DESGLOSE DINÁMICO */}
      <DescriptionList>
        <DescriptionTerm>
          {convertPrice(precioNum)} × {explorerCount} {explorerCount > 1 ? t.booking.explorers : t.booking.explorer}
        </DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          {convertPrice(precioNum * explorerCount)}
        </DescriptionDetails>
        <DescriptionTerm>{t.booking.processingFee} (18%)</DescriptionTerm>
        <DescriptionDetails className="sm:text-right">
          {convertPrice(precioNum * explorerCount * 0.18)}
        </DescriptionDetails>
        <DescriptionTerm className="font-semibold text-neutral-900 dark:text-neutral-100">
          {t.booking.total}
        </DescriptionTerm>
        <DescriptionDetails className="font-semibold sm:text-right">
          {convertPrice(precioNum * explorerCount * 1.18)}
        </DescriptionDetails>
      </DescriptionList>

      {/* INFO IMPORTANTE */}
      <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
        <p>⏰ {t.booking.cancellationNote}</p>
        <p className="mt-1">👥 {t.booking.maxGuests} {maxGuests}</p>
        {date && <p className="mt-1">📅 {date}</p>}
      </div>

      {/* BOTÓN RESERVAR */}
      {!hasDate && (
        <p className="text-center text-sm text-amber-600 dark:text-amber-400">
          📅 {t.booking.selectDateToContinue}
        </p>
      )}
      <ButtonPrimary
        form="booking-form"
        type="submit"
        disabled={!hasDate}
        className={!hasDate ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {t.booking.bookNow}
      </ButtonPrimary>
    </div>
  )
}
