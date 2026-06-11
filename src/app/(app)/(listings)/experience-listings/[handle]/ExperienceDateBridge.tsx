'use client'

import SectionDateRange from '@/app/(app)/(listings)/components/SectionDateRange'
import { useState } from 'react'
import { ExperienceBookingSidebar } from './ExperienceBookingSidebar'

interface Props {
  leftTopContent: React.ReactNode
  availableDays: string[]
  durationTime: string
  priceUsd: number
  maxGuests: number
  date?: string | null
  reviewStart: number
  reviewCount: number
  action: (formData: FormData) => Promise<void>
}

export function ExperienceDateBridge({
  leftTopContent,
  availableDays,
  durationTime,
  priceUsd,
  maxGuests,
  date,
  reviewStart,
  reviewCount,
  action,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <main className="relative z-1 mt-10 flex flex-col gap-8 lg:flex-row xl:gap-10">
      <div className="flex w-full flex-col gap-y-8 lg:w-3/5 xl:w-[64%] xl:gap-y-10">
        {leftTopContent}
        <SectionDateRange
          availableDays={availableDays}
          durationTime={durationTime}
          externalDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <div className="grow">
        <div className="sticky top-5">
          <ExperienceBookingSidebar
            priceUsd={priceUsd}
            maxGuests={maxGuests}
            date={date}
            reviewStart={reviewStart}
            reviewCount={reviewCount}
            availableDays={availableDays}
            durationTime={durationTime}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            action={action}
          />
        </div>
      </div>
    </main>
  )
}
