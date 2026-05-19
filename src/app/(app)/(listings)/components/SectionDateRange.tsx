'use client'

import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import { excludeDateIntervals } from '@/contains/contants'
import { useLanguage } from '@/context/LanguageContext'
import { Divider } from '@/shared/divider'
import { addDays } from 'date-fns'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { SectionHeading, SectionSubheading } from './SectionHeading'

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
  availableDays?: string[]
  durationTime?: string
}

const SectionDateRange = ({ availableDays = [], durationTime = '' }: Props) => {
  const { t } = useLanguage()
  const el = t.experienceListing

  const durationDays = parseDurationDays(durationTime)
  const isMultiDay = durationDays > 1

  const allowedDayNums = availableDays.length > 0
    ? availableDays.map((d) => DAY_NUMBERS[d]).filter((n) => n !== undefined)
    : null

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const filterDate = (date: Date) => {
    if (!allowedDayNums) return true
    return allowedDayNums.includes(date.getDay())
  }

  const handleChangeSingle = (date: Date | null) => {
    setStartDate(date)
    setEndDate(date)
  }

  const handleChangeRange = (dates: [Date | null, Date | null]) => {
    const [start] = dates
    setStartDate(start)
    setEndDate(start ? addDays(start, durationDays - 1) : null)
  }

  const commonProps = {
    monthsShown: 2,
    showPopperArrow: false,
    inline: true,
    excludeDateIntervals,
    filterDate,
    renderCustomHeader: (p: any) => <DatePickerCustomHeaderTwoMonth {...p} />,
    renderDayContents: (day: number, date?: Date) => <DatePickerCustomDay dayOfMonth={day} date={date} />,
  }

  return (
    <div className="listingSection__wrap">
      <div>
        <SectionHeading>{el.availability}</SectionHeading>
        <SectionSubheading>
          {availableDays.length > 0
            ? `${el.pricesMayIncrease} · Días disponibles: ${availableDays.join(', ')}`
            : el.pricesMayIncrease}
        </SectionSubheading>
      </div>
      <Divider className="w-14!" />

      {isMultiDay ? (
        <DatePicker
          selected={startDate}
          onChange={handleChangeRange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          {...commonProps}
        />
      ) : (
        <DatePicker
          selected={startDate}
          onChange={handleChangeSingle}
          {...commonProps}
        />
      )}

      {startDate && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {isMultiDay
            ? `Del ${startDate.toLocaleDateString('es-DO', { day: 'numeric', month: 'long' })} al ${endDate?.toLocaleDateString('es-DO', { day: 'numeric', month: 'long' })} (${durationDays} días)`
            : `Fecha seleccionada: ${startDate.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        </p>
      )}
    </div>
  )
}

export default SectionDateRange
