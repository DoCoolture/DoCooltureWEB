import ExperiencesCard from '@/components/ExperiencesCard'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map'
import { TExperienceListing } from '@/data/listings'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/shared/Button'
import ButtonClose from '@/shared/ButtonClose'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  currentHoverID: string
  listings: TExperienceListing[]
  closeButtonHref: string
  isAllView?: boolean
}

const DEFAULT_CENTER = { lat: 18.4861, lng: -69.9312 }
// Radius in degrees to spread overlapping pins (~50 m per 0.0005°)
const OVERLAP_OFFSET = 0.0005

type PlacedListing = TExperienceListing & { placedLat: number; placedLng: number }

/**
 * When multiple listings share the exact same coordinates (e.g. city-center fallback),
 * their markers stack and only the last one is visible. This function arranges duplicate
 * coords in a small circle so every pin remains clickable.
 */
function spreadOverlapping(listings: TExperienceListing[]): PlacedListing[] {
  const groups: Record<string, TExperienceListing[]> = {}
  for (const l of listings) {
    if (!l.map) continue
    const key = `${l.map.lat.toFixed(5)},${l.map.lng.toFixed(5)}`
    groups[key] = groups[key] ?? []
    groups[key].push(l)
  }

  return listings.map((l) => {
    if (!l.map) return { ...l, placedLat: DEFAULT_CENTER.lat, placedLng: DEFAULT_CENTER.lng }
    const key = `${l.map.lat.toFixed(5)},${l.map.lng.toFixed(5)}`
    const group = groups[key]
    if (group.length === 1) return { ...l, placedLat: l.map.lat, placedLng: l.map.lng }
    const idx = group.indexOf(l)
    const angle = (2 * Math.PI * idx) / group.length
    return {
      ...l,
      placedLat: l.map.lat + Math.sin(angle) * OVERLAP_OFFSET,
      placedLng: l.map.lng + Math.cos(angle) * OVERLAP_OFFSET,
    }
  })
}

const MapFixedSection = ({ closeButtonHref, currentHoverID: selectedID, listings, isAllView }: Props) => {
  const { t } = useLanguage()
  const [currentHoverID, setCurrentHoverID] = useState<string>('')

  useEffect(() => {
    setCurrentHoverID(selectedID)
  }, [selectedID])

  const validListings = useMemo(() => listings.filter((l) => l.map != null), [listings])
  const placedListings = useMemo(() => spreadOverlapping(validListings), [validListings])

  // Centroid of all valid listing coords — better default than always using the first item
  const mapCenter = useMemo(() => {
    if (validListings.length === 0) return DEFAULT_CENTER
    const lat = validListings.reduce((s, l) => s + l.map!.lat, 0) / validListings.length
    const lng = validListings.reduce((s, l) => s + l.map!.lng, 0) / validListings.length
    return { lat, lng }
  }, [validListings])

  const zoom = isAllView ? 8 : 11

  return (
    <div className="fixed inset-0 top-0 z-40 flex-1/2 xl:static xl:z-0">
      <div className="fixed start-0 top-0 size-full overflow-hidden xl:sticky xl:top-0 xl:h-screen">
        <Map center={mapCenter} zoom={zoom}>
          <MapControls position="bottom-right" showZoom showFullscreen />
          {placedListings.map((listing) => (
            <MapMarker key={listing.id} longitude={listing.placedLng} latitude={listing.placedLat}>
              <MarkerContent>
                <p
                  className={`flex min-w-max items-center justify-center rounded-lg px-3.5 py-1.5 text-sm font-medium shadow-lg transition-all ${
                    currentHoverID === listing.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-white text-neutral-900 hover:scale-110 dark:bg-neutral-600 dark:text-white'
                  }`}
                >
                  ${listing.priceUsd}
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
