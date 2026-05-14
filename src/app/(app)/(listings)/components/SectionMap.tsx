'use client'

import { Map, MapControls, MapMarker, MarkerContent } from '@/components/ui/map'
import { useLanguage } from '@/context/LanguageContext'
import { Divider } from '@/shared/divider'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { SectionHeading, SectionSubheading } from './SectionHeading'

interface Props {
  className?: string
  lat?: number
  lng?: number
  address?: string
}

const SectionMap = ({ className, lat, lng, address }: Props) => {
  const { t } = useLanguage()
  if (!lat || !lng) return null

  return (
    <div className={`listingSection__wrap ${className ?? ''}`}>
      <div>
        <SectionHeading>{t.experienceListing.location}</SectionHeading>
        {address && <SectionSubheading>{address}</SectionSubheading>}
      </div>
      <Divider className="w-14!" />

      <div className="h-64 overflow-hidden rounded-xl ring-1 ring-black/10 sm:h-80 lg:h-96 dark:ring-white/10">
        <Map center={[lng, lat]} zoom={13} className="h-full w-full">
          <MapControls showZoom position="bottom-right" />
          <MapMarker longitude={lng} latitude={lat}>
            <MarkerContent>
              <div className="flex size-9 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg ring-2 ring-white">
                <MapPinIcon className="size-4" />
              </div>
            </MarkerContent>
          </MapMarker>
        </Map>
      </div>
    </div>
  )
}

export default SectionMap
