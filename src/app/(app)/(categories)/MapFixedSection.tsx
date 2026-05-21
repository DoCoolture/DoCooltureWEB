import ExperiencesCard from '@/components/ExperiencesCard'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map'
import { TExperienceListing } from '@/data/listings'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/shared/Button'
import ButtonClose from '@/shared/ButtonClose'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

interface Props {
  currentHoverID: string
  listings: TExperienceListing[]
  closeButtonHref: string
}

const DEFAULT_CENTER = { lat: 18.4861, lng: -69.9312 }

const MapFixedSection = ({ closeButtonHref, currentHoverID: selectedID, listings }: Props) => {
  const { t } = useLanguage()
  const [currentHoverID, setCurrentHoverID] = useState<string>('')

  useEffect(() => {
    setCurrentHoverID(selectedID)
  }, [selectedID])

  const validListings = listings.filter((l) => l.map.lat !== 0 && l.map.lng !== 0)
  const firstValid = validListings[0]
  const mapCenter = firstValid?.map ?? DEFAULT_CENTER

  return (
    <div className="fixed inset-0 top-0 z-40 flex-1/2 xl:static xl:z-0">
      <div className="fixed start-0 top-0 size-full overflow-hidden xl:sticky xl:top-0 xl:h-screen">
        <Map center={mapCenter} zoom={11}>
          <MapControls position="bottom-right" showZoom showFullscreen />
          {validListings.map((listing) => (
            <MapMarker key={listing.id} longitude={listing.map.lng} latitude={listing.map.lat}>
              <MarkerContent>
                <p
                  className={`flex min-w-max items-center justify-center rounded-lg px-3.5 py-1.5 text-sm font-medium shadow-lg transition-all ${
                    currentHoverID === listing.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-white text-neutral-900 hover:scale-110 dark:bg-neutral-600 dark:text-white'
                  }`}
                >
                  {listing.price}
                </p>
              </MarkerContent>
              <MarkerPopup className="rounded-2xl! p-0!">
                <div className="w-60 focus:outline-none sm:w-80">
                  <ExperiencesCard
                    size="small"
                    data={listing}
                    ratioClass="aspect-w-12 aspect-h-10"
                    className="rounded-3xl bg-white dark:bg-neutral-900"
                  />
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>

        <div className="absolute top-3 left-3">
          <ButtonClose color="white" href={closeButtonHref} />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 shadow-2xl">
          <Button color="white" href={closeButtonHref}>
            <XMarkIcon className="size-6" />
            <span>{t.common['Hide map']}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MapFixedSection
