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

const SectionDateRange = () => {
  const { t } = useLanguage()
  const el = t.experienceListing
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 3))

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <div className="listingSection__wrap">
      <div>
        <SectionHeading>{el.availability}</SectionHeading>
        <SectionSubheading>{el.pricesMayIncrease}</SectionSubheading>
      </div>
      <Divider className="w-14!" />

      <DatePicker
        selected={startDate}
        onChange={onChangeDate}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        showPopperArrow={false}
        inline
        excludeDateIntervals={excludeDateIntervals}
        renderCustomHeader={(props) => <DatePickerCustomHeaderTwoMonth {...props} />}
        renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
      />

      {/* inputs */}
      <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} />
      <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} />
    </div>
  )
}

export default SectionDateRange
