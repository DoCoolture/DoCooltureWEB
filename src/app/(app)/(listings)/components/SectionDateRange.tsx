'use client'

import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import { excludeDateIntervals } from '@/constants/constants'
import { useLanguage } from '@/context/LanguageContext'
import { Divider } from '@/shared/divider'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
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
  externalDate?: Date | null
  onDateSelect?: (date: Date | null) => void
}

const SectionDateRange = ({ availableDays = [], durationTime = '', externalDate, onDateSelect }: Props) => {
  const { t } = useLanguage()
  const el = t.experienceListing

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

  const filterDate = (date: Date) => {
    if (!allowedDayNums) return true
    return allowedDayNums.includes(date.getDay())
  }

  // Single click sets start; end is auto-calculated from duration
  const handleChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(date ? addDays(date, durationDays - 1) : null)
    onDateSelect?.(date)
  }

  const fmt = (d: Date | null) =>
    d ? format(d, "d 'de' MMMM", { locale: es }) : ''

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

      {startDate && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {isMultiDay
            ? `Del ${fmt(startDate)} al ${fmt(endDate)} · ${durationDays} días`
            : `Fecha seleccionada: ${format(startDate, "EEEE d 'de' MMMM", { locale: es })}`}
        </p>
      )}
    </div>
  )
}

export default SectionDateRange
