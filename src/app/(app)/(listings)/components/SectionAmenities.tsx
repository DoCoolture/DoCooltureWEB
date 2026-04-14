'use client'

import { Dialog, DialogBody, DialogTitle } from '@/components/dialog'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { Divider } from '@/shared/divider'
import {
  Bathtub02Icon,
  BodySoapIcon,
  CableCarIcon,
  CctvCameraIcon,
  HairDryerIcon,
  ShampooIcon,
  Speaker01Icon,
  TvSmartIcon,
  VirtualRealityVr01Icon,
  WaterEnergyIcon,
  WaterPoloIcon,
  Wifi01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import { useState } from 'react'
import { SectionHeading, SectionSubheading } from './SectionHeading'

interface Props {
  amenities?: { name: string; icon: IconSvgElement }[]
}

const Amenities_demos = [
  { name: 'Fast wifi', icon: Wifi01Icon },
  { name: 'Bathtub', icon: Bathtub02Icon },
  { name: 'Hair dryer', icon: HairDryerIcon },
  { name: 'Sound system', icon: Speaker01Icon },
  { name: 'Shampoo', icon: ShampooIcon },
  { name: 'Body soap', icon: BodySoapIcon },
  { name: 'Water Energy ', icon: WaterEnergyIcon },
  { name: 'Water Polo', icon: WaterPoloIcon },
  { name: 'Cable Car', icon: CableCarIcon },
  { name: 'Tv Smart', icon: TvSmartIcon },
  { name: 'Cctv Camera', icon: CctvCameraIcon },
  { name: 'Virtual Reality Vr', icon: VirtualRealityVr01Icon },
]

const SectionAmenities = ({ amenities = Amenities_demos }: Props) => {
  let [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="listingSection__wrap">
        <div>
          <SectionHeading>Amenities</SectionHeading>
          <SectionSubheading>About the property&apos;s amenities and services</SectionSubheading>
        </div>
        <Divider className="w-14!" />

        <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 xl:grid-cols-3 dark:text-neutral-300">
          {amenities
            .filter((_, i) => i < 12)
            .map((item) => (
              <div key={item.name} className="flex items-center gap-x-3">
                <HugeiconsIcon icon={item.icon} className="h-6 w-6" />
                <span>{item.name}</span>
              </div>
            ))}
        </div>

        {/* ----- */}
        <div className="w-14 border-b border-neutral-200"></div>
        <div>
          <ButtonSecondary onClick={() => setIsOpen(true)}>View more 20 amenities</ButtonSecondary>
        </div>
      </div>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>What this place offers</DialogTitle>

        <DialogBody>
          <Divider className="my-7" />
          <div className="grid grid-cols-1 gap-6 text-sm text-gray-700 dark:text-gray-300">
            {[...amenities, ...amenities].map((item, index) => (
              <div key={`${index}-${item.name}`} className="flex items-center gap-x-3">
                <HugeiconsIcon icon={item.icon} size={24} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </DialogBody>
      </Dialog>
    </>
  )
}

export default SectionAmenities
