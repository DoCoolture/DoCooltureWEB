'use client'

import { Map, MapMarker, MarkerContent, useMap } from '@/components/ui/map'
import type MapLibreGL from 'maplibre-gl'
import { useCallback, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface Props {
  lat: number | null
  lng: number | null
  onChange: (coords: { lat: number; lng: number } | null) => void
}

const DR_CENTER = { lat: 18.7357, lng: -70.1627 }

function ClickHandler({ onClick }: { onClick: (e: MapLibreGL.MapMouseEvent) => void }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded) return
    map.getCanvas().style.cursor = 'crosshair'
    map.on('click', onClick)
    return () => {
      map.off('click', onClick)
      map.getCanvas().style.cursor = ''
    }
  }, [map, isLoaded, onClick])

  return null
}

// Flies the map to new coords imperatively — needed because the Map component
// only reads `center`/`zoom` at initialization; prop changes are ignored after mount.
function CenterController({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded) return
    map.flyTo({ center: [lng, lat], zoom, duration: 600 })
  }, [map, isLoaded, lat, lng, zoom])

  return null
}

export default function LocationPickerMap({ lat, lng, onChange }: Props) {
  const { t } = useLanguage()
  const hasMarker = lat !== null && lng !== null && (lat !== 0 || lng !== 0)

  const handleClick = useCallback(
    (e: MapLibreGL.MapMouseEvent) => {
      onChange({
        lat: Math.round(e.lngLat.lat * 1e6) / 1e6,
        lng: Math.round(e.lngLat.lng * 1e6) / 1e6,
      })
    },
    [onChange]
  )

  return (
    <div className="space-y-2">
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
        <Map
          center={DR_CENTER}
          zoom={7}
          className="h-full w-full"
        >
          <CenterController
            lat={hasMarker ? lat! : DR_CENTER.lat}
            lng={hasMarker ? lng! : DR_CENTER.lng}
            zoom={hasMarker ? 14 : 7}
          />
          <ClickHandler onClick={handleClick} />
          {hasMarker && (
            <MapMarker longitude={lng!} latitude={lat!}>
              <MarkerContent>
                <div className="flex flex-col items-center">
                  <div className="size-4 rounded-full border-2 border-white bg-primary-600 shadow-lg" />
                  <div className="h-3 w-0.5 bg-primary-600" />
                </div>
              </MarkerContent>
            </MapMarker>
          )}
        </Map>
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-white/90 px-2.5 py-1 text-xs text-neutral-600 shadow dark:bg-neutral-900/90 dark:text-neutral-400">
          {t.locationPicker.clickToPin}
        </div>
      </div>
      {hasMarker ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          📍 {lat?.toFixed(5)}, {lng?.toFixed(5)}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-3 text-red-500 hover:text-red-600"
          >
            {t.locationPicker.removeMarker}
          </button>
        </p>
      ) : (
        <p className="text-xs text-neutral-400">{t.locationPicker.noLocation}</p>
      )}
    </div>
  )
}
