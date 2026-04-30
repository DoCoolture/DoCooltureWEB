'use client'

import NcInputNumber from '@/components/NcInputNumber'
import { GuestsObject } from '@/type'
import T from '@/utils/getT'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { FC, useState } from 'react'

interface Props {
  className?: string
}

const GuestsInputPopover: FC<Props> = ({ className = 'flex-1' }) => {
  // ✅ FIX: valores por defecto corregidos — empieza con 1 adulto, 0 niños, 0 bebés
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1)
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0)
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(0)

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    if (type === 'guestAdults') setGuestAdultsInputValue(value)
    if (type === 'guestChildren') setGuestChildrenInputValue(value)
    if (type === 'guestInfants') setGuestInfantsInputValue(value)
  }

  // ✅ FIX: total solo cuenta adultos + niños (bebés no cuentan como explorers)
  const totalGuests = guestAdultsInputValue + guestChildrenInputValue

  return (
    <Popover className={`relative flex ${className}`}>
      {({ open }) => (
        <>
          <div
            className={`flex flex-1 items-center rounded-b-3xl focus:outline-hidden ${
              open ? 'shadow-lg' : ''
            }`}
          >
            <PopoverButton className="relative z-10 flex flex-1 cursor-pointer items-center gap-x-3 p-3 text-start focus:outline-hidden">
              <div className="text-neutral-300 dark:text-neutral-400">
                <UserPlusIcon className="h-5 w-5 lg:h-7 lg:w-7" />
              </div>
              <div className="grow">
                <span className="block font-semibold xl:text-lg">
                  {totalGuests > 0 ? `${totalGuests} Explorers` : 'Agregar explorers'}
                </span>
                <span className="mt-1 block text-sm leading-none font-light text-neutral-400">
                  {totalGuests > 0 ? 'Explorers' : 'Agregar explorers'}
                </span>
              </div>
            </PopoverButton>
          </div>

          <PopoverPanel
            transition
            unmount={false}
            className="absolute end-0 top-full z-10 mt-3 w-full rounded-3xl bg-white px-4 py-5 shadow-xl ring-1 ring-black/5 transition duration-150 data-closed:translate-y-1 data-closed:opacity-0 sm:min-w-[340px] sm:px-8 sm:py-6 dark:bg-neutral-800"
          >
            <NcInputNumber
              className="w-full"
              defaultValue={guestAdultsInputValue}
              onChange={(value) => handleChangeData(value, 'guestAdults')}
              inputName="guestAdults"
              max={10}
              min={1}
              label="Adultos"
              description="13 años o más"
            />
            <NcInputNumber
              className="mt-6 w-full"
              defaultValue={guestChildrenInputValue}
              onChange={(value) => handleChangeData(value, 'guestChildren')}
              inputName="guestChildren"
              max={4}
              min={0}
              label="Niños"
              description="2 a 12 años"
            />
            <NcInputNumber
              className="mt-6 w-full"
              defaultValue={guestInfantsInputValue}
              onChange={(value) => handleChangeData(value, 'guestInfants')}
              inputName="guestInfants"
              max={4}
              min={0}
              label="Bebés"
              description="0 a 2 años"
            />

            {/* Hidden inputs para el form */}
            <input type="hidden" name="guestAdults" value={guestAdultsInputValue} />
            <input type="hidden" name="guestChildren" value={guestChildrenInputValue} />
            <input type="hidden" name="guestInfants" value={guestInfantsInputValue} />
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export default GuestsInputPopover
