'use client'

import { Button } from '@/shared/Button'
import ButtonClose from '@/shared/ButtonClose'
import ButtonPrimary from '@/shared/ButtonPrimary'
import T from '@/utils/getT'
import { CloseButton, Dialog, DialogPanel } from '@headlessui/react'
import React, { FC, useEffect, useState } from 'react'
import GuestsInput from './HeroSearchFormMobile/GuestsInput'

interface GuestsValue {
  guestAdults: number
  guestChildren: number
  guestInfants: number
}

interface Props {
  triggerButton?: (p: { openModal: () => void }) => React.ReactNode
  onChangeGuests?: (guests: GuestsValue) => void
  defaultValue?: GuestsValue
}

const ModalSelectGuests: FC<Props> = ({ triggerButton, onChangeGuests, defaultValue }) => {
  const [showModal, setShowModal] = useState(false)
  const [guests, setGuests] = useState<GuestsValue>({
    guestAdults: defaultValue?.guestAdults ?? 1,
    guestChildren: defaultValue?.guestChildren ?? 0,
    guestInfants: defaultValue?.guestInfants ?? 0,
  })

  useEffect(() => {
    if (defaultValue) {
      setGuests({
        guestAdults: defaultValue.guestAdults,
        guestChildren: defaultValue.guestChildren,
        guestInfants: defaultValue.guestInfants,
      })
    }
  }, [defaultValue?.guestAdults, defaultValue?.guestChildren, defaultValue?.guestInfants])

  function closeModal() {
    setShowModal(false)
  }
  function openModal() {
    setShowModal(true)
  }

  const renderButtonOpenModal = () => {
    return triggerButton ? (
      triggerButton({ openModal })
    ) : (
      <button onClick={openModal}>{T['common']['Select Date']}</button>
    )
  }

  return (
    <>
      {renderButtonOpenModal()}

      <Dialog className="relative z-50" onClose={closeModal} open={showModal}>
        <div className="fixed inset-0 bg-neutral-300 dark:bg-neutral-900">
          <DialogPanel
            transition
            className="relative flex size-full flex-col transition data-closed:translate-y-40 data-closed:opacity-0"
          >
            <div className="absolute start-4 top-4">
              <CloseButton color="light" as={ButtonClose}></CloseButton>
            </div>

            <div className="flex flex-1 overflow-hidden bg-white p-1 pt-16 dark:bg-neutral-800">
              <div className="flex flex-1 flex-col overflow-auto">
                <div className="relative flex flex-1 px-2 py-5 sm:p-5">
                  <GuestsInput
                    defaultValue={guests}
                    onChange={(e) => {
                      setGuests({
                        guestAdults: e.guestAdults || 0,
                        guestChildren: e.guestChildren || 0,
                        guestInfants: e.guestInfants || 0,
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
              <Button
                type="button"
                className="shrink-0 font-semibold underline"
                plain
                onClick={() => {
                  setGuests({
                    guestAdults: 0,
                    guestChildren: 0,
                    guestInfants: 0,
                  })
                }}
              >
                {T['common']['Clear']}
              </Button>
              <ButtonPrimary
                onClick={() => {
                  closeModal()
                  if (onChangeGuests) {
                    onChangeGuests(guests)
                  }
                }}
              >
                {T['common']['Save']}
              </ButtonPrimary>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default ModalSelectGuests
