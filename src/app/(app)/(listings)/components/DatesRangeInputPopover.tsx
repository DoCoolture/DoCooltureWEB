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
import { FC, useEffect, useState } from 'react'
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
  externalDate?: Date | null
  onDateChange?: (date: Date | null) => void
}

const DatesRangeInputPopover: FC<Props> = ({
  className = 'flex-1',
  buttonClassName,
  inputDescription,
  availableDays = [],
  durationTime = '',
  externalDate,
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

  useEffect(() => {
    if (externalDate === undefined) return
    setStartDate(externalDate)
    setEndDate(externalDate ? addDays(externalDate, durationDays - 1) : null)
  }, [externalDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(date ? addDays(date, durationDays - 1) : null)
    onDateChange?.(date)
  }

  const filterDate = (date: Date) => {
    if (!allowedDayNums) return true
    return allowedDayNums.includes(date.getDay())
  }

  const renderInput = () => {
    const icon = (
      <div className="shrink-0 text-neutral-400 dark:text-neutral-500">
        <CalendarIcon className="h-5 w-5" />
      </div>
    )

    if (startDate && isMultiDay && endDate) {
      return (
        <>
          {icon}
          <div className="grid grow grid-cols-[1fr_auto_1fr] items-center gap-x-2 min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                {t.HeroSearchForm['CheckIn']}
              </p>
              <p className="truncate font-semibold capitalize">
                {format(startDate, "EEE d MMM", { locale: es })}
              </p>
            </div>
            <span className="text-neutral-300 dark:text-neutral-600">→</span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                {t.HeroSearchForm['CheckOut']}
              </p>
              <p className="truncate font-semibold capitalize">
                {format(endDate, "EEE d MMM", { locale: es })}
              </p>
            </div>
          </div>
        </>
      )
    }

    if (startDate) {
      return (
        <>
          {icon}
          <div className="grow min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {t.HeroSearchForm['CheckIn']}
            </p>
            <p className="truncate font-semibold capitalize">
              {format(startDate, "EEEE, d 'de' MMMM", { locale: es })}
            </p>
          </div>
        </>
      )
    }

    return (
      <>
        {icon}
        <div className="grow">
          <span className="block font-semibold">
            {isMultiDay
              ? `${t.HeroSearchForm['CheckIn']} – ${t.HeroSearchForm['CheckOut']}`
              : t.HeroSearchForm['CheckIn']}
          </span>
          <span className="mt-0.5 block text-xs font-light text-neutral-400">
            {resolvedDescription}
          </span>
        </div>
      </>
    )
  }

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
