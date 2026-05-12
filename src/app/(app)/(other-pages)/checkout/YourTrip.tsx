'use client'

import ModalSelectDate from '@/components/ModalSelectDate'
import ModalSelectGuests from '@/components/ModalSelectGuests'
import { useLanguage } from '@/context/LanguageContext'
import { GuestsObject } from '@/type'
import converSelectedDateToString from '@/utils/converSelectedDateToString'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface YourTripProps {
  initialExplorers?: number
  initialStartDate?: Date | null
  onGuestsChange?: (total: number) => void
}

const YourTrip = ({ initialExplorers = 1, initialStartDate = null, onGuestsChange }: YourTripProps) => {
  const { t } = useLanguage()
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate ?? new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState<GuestsObject>({
    guestAdults: initialExplorers,
    guestChildren: 0,
    guestInfants: 0,
  })

  const totalGuests = (guests.guestAdults || 0) + (guests.guestChildren || 0)
  useEffect(() => {
    onGuestsChange?.(totalGuests)
  }, [totalGuests]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h3 className="text-2xl font-semibold">{t.yourTrip.heading}</h3>
      <div className="z-10 mt-6 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 sm:flex-row sm:divide-x sm:divide-y-0 sm:rtl:divide-x-reverse dark:divide-neutral-700 dark:border-neutral-700">
        <ModalSelectDate
          onChange={(dates) => {
            const [start, end] = dates
            setStartDate(start)
            setEndDate(end)
          }}
          triggerButton={({ openModal }) => (
            <button
              onClick={openModal}
              className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
              type="button"
            >
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">{t.yourTrip.experienceDate}</span>
                <span className="mt-1.5 text-lg font-semibold">
                  {startDate ? converSelectedDateToString([startDate, endDate]) : t.yourTrip.selectDate}
                </span>
              </div>
              <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}
        />

        <ModalSelectGuests
          onChangeGuests={setGuests}
          triggerButton={({ openModal }) => (
            <button
              type="button"
              onClick={openModal}
              className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
            >
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">{t.yourTrip.guests}</span>
                <span className="mt-1.5 text-lg font-semibold">
                  <span className="line-clamp-1">
                    {`${totalGuests} ${t.yourTrip.guests}`}
                    {guests.guestInfants ? `, ${guests.guestInfants} ${t.yourTrip.infants}` : ''}
                  </span>
                </span>
              </div>
              <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}
        />
      </div>

      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {t.yourTrip.helpText}
      </p>

      <input type="hidden" name="guestAdults" value={guests.guestAdults} />
      <input type="hidden" name="guestChildren" value={guests.guestChildren} />
      <input type="hidden" name="guestInfants" value={guests.guestInfants} />
      <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} />
      <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} />
    </div>
  )
}

export default YourTrip
