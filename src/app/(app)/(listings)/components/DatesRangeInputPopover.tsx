'use client'

import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import { excludeDateIntervals } from '@/contains/contants'
import { useLanguage } from '@/context/LanguageContext'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FC, useState } from 'react'
import DatePicker from 'react-datepicker'

const DAY_NUMBERS: Record<string, number> = {
  Domingo: 0, domingo: 0,
  Lunes: 1, lunes: 1,
  Martes: 2, martes: 2,
  Miércoles: 3, Miercoles: 3, miércoles: 3, miercoles: 3,
  Jueves: 4, jueves: 4,
  Viernes: 5, viernes: 5,
  Sábado: 6, Sabado: 6, sábado: 6, sabado: 6,
}

function parseDurationDays(durationTime: string): number {
  const rangeDay = durationTime.match(/(\d+)\s*[-–]\s*\d+\s*d[íi]a/i)
  if (rangeDay) return parseInt(rangeDay[1])
  const singleDay = durationTime.match(/(\d+)\s*d[íi]a/i)
  if (singleDay) return parseInt(singleDay[1])
  const week = durationTime.match(/(\d+)\s*semana/i)
  if (week) return parseInt(week[1]) * 7
  return 1
}

interface Props {
  className?: string
  buttonClassName?: string
  inputDescription?: string
  availableDays?: string[]
  durationTime?: string
  onDateChange?: (date: Date | null) => void
}

const DatesRangeInputPopover: FC<Props> = ({
  className = 'flex-1',
  buttonClassName,
  inputDescription,
  availableDays = [],
  durationTime = '',
  onDateChange,
}) => {
  const { t } = useLanguage()
  const resolvedDescription = inputDescription ?? `${t.HeroSearchForm['CheckIn']} - ${t.HeroSearchForm['CheckOut']}`

  const durationDays = parseDurationDays(durationTime)
  const isMultiDay = durationDays > 1

  const allowedDayNums = availableDays.length > 0
    ? availableDays.map((d) => DAY_NUMBERS[d]).filter((n) => n !== undefined)
    : null

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(date ? addDays(date, durationDays - 1) : null)
    onDateChange?.(date)
  }

  const filterDate = (date: Date) => {
    if (!allowedDayNums) return true
    return allowedDayNums.includes(date.getDay())
  }

  const fmt = (d: Date | null) =>
    d?.toLocaleDateString('es-DO', { month: 'short', day: '2-digit' }) ?? ''

  const renderInput = () => (
    <>
      <div className="text-neutral-300 dark:text-neutral-400">
        <CalendarIcon className="h-5 w-5 lg:h-7 lg:w-7" />
      </div>
      <div className="grow text-start">
        <span className="block font-semibold xl:text-lg">
          {startDate
            ? isMultiDay && endDate
              ? `${fmt(startDate)} – ${fmt(endDate)}`
              : fmt(startDate)
            : isMultiDay
            ? `${t.HeroSearchForm['CheckIn']} – ${t.HeroSearchForm['CheckOut']}`
            : t.HeroSearchForm['CheckIn']}
        </span>
        <span className="mt-1 block text-sm leading-none font-light text-neutral-400">
          {resolvedDescription}
        </span>
      </div>
    </>
  )

  return (
    <>
      <Popover className={`group relative z-10 flex ${className}`}>
        {({ open }) => (
          <>
            <PopoverButton
              className={clsx(
                'relative flex flex-1 cursor-pointer items-center gap-x-3 p-3 group-data-open:shadow-lg focus:outline-hidden',
                buttonClassName
              )}
            >
              {renderInput()}
              {startDate && open && (
                <span className="absolute end-1 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 transform items-center justify-center rounded-full bg-neutral-100 text-sm lg:end-3 lg:h-6 lg:w-6 dark:bg-neutral-800">
                  <XMarkIcon className="size-4" />
                </span>
              )}
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute start-auto -end-2 top-full z-10 mt-3 w-[calc(100%+1rem)] transition duration-150 lg:w-3xl xl:-end-10 data-closed:translate-y-1 data-closed:opacity-0"
            >
              <div className="overflow-hidden rounded-3xl bg-white py-5 shadow-lg ring-1 ring-black/5 sm:p-8 dark:bg-neutral-800">
                <DatePicker
                  selected={startDate}
                  onChange={handleChange}
                  startDate={startDate}
                  endDate={isMultiDay ? endDate : undefined}
                  monthsShown={2}
                  showPopperArrow={false}
                  inline
                  excludeDateIntervals={excludeDateIntervals}
                  filterDate={filterDate}
                  renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
                  renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
                />
                {startDate && isMultiDay && (
                  <p className="mt-3 text-center text-xs text-neutral-400">
                    {`${format(startDate, "d MMM", { locale: es })} – ${format(endDate!, "d MMM", { locale: es })} · ${durationDays} días`}
                  </p>
                )}
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>

      <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} />
      <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} />
    </>
  )
}

export default DatesRangeInputPopover
