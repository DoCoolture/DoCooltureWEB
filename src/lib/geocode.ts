export type GeocodeResult = { lat: number; lng: number }

/**
 * Geocodes an address string using Nominatim (OpenStreetMap).
 * Free, no API key. Rate limit: 1 req/s — only call on user action (button click).
 * Returns null if nothing was found or the request failed.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const q = encodeURIComponent(address.trim())
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=do`,
      { headers: { 'Accept-Language': 'es', 'User-Agent': 'DoCoolture/1.0 (docoolture.com)' } }
    )
    if (!res.ok) return null
    const data: { lat: string; lon: string }[] = await res.json()
    if (!data.length) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}
