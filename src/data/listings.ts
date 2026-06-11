import { cache } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { extractAvatarUrl, type ProfileJoin } from '@/lib/supabase-joins'

type HostJoin = {
  display_name: string | null
  user_id: string
  profiles: ProfileJoin
} | null

const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  'punta cana':               { lat: 18.5820, lng: -68.4054 },
  'bávaro':                   { lat: 18.7171, lng: -68.4552 },
  'bavaro':                   { lat: 18.7171, lng: -68.4552 },
  'santo domingo':            { lat: 18.4861, lng: -69.9312 },
  'santiago':                 { lat: 19.4517, lng: -70.6970 },
  'puerto plata':             { lat: 19.7885, lng: -70.6889 },
  'samaná':                   { lat: 19.2057, lng: -69.3369 },
  'samana':                   { lat: 19.2057, lng: -69.3369 },
  'las terrenas':             { lat: 19.3114, lng: -69.5436 },
  'la romana':                { lat: 18.4267, lng: -68.9728 },
  'jarabacoa':                { lat: 19.1183, lng: -70.6398 },
  'constanza':                { lat: 18.9059, lng: -70.7468 },
  'barahona':                 { lat: 18.2092, lng: -71.1011 },
  'cabarete':                 { lat: 19.7584, lng: -70.4094 },
  'sosúa':                    { lat: 19.7617, lng: -70.5178 },
  'sosua':                    { lat: 19.7617, lng: -70.5178 },
  'boca chica':               { lat: 18.4569, lng: -69.6105 },
  'juan dolio':               { lat: 18.4548, lng: -69.4315 },
  'la vega':                  { lat: 19.2244, lng: -70.5290 },
  'higüey':                   { lat: 18.6149, lng: -68.7070 },
  'higuey':                   { lat: 18.6149, lng: -68.7070 },
  'nagua':                    { lat: 19.3760, lng: -69.8441 },
  'río san juan':             { lat: 19.6360, lng: -70.0793 },
  'rio san juan':             { lat: 19.6360, lng: -70.0793 },
  'miches':                   { lat: 18.9786, lng: -69.0430 },
  'pedernales':               { lat: 18.0379, lng: -71.7441 },
  'monte cristi':             { lat: 19.8574, lng: -71.6506 },
  'neyba':                    { lat: 18.4822, lng: -71.4171 },
  'san pedro de macorís':     { lat: 18.4565, lng: -69.3059 },
  'san pedro de macoris':     { lat: 18.4565, lng: -69.3059 },
  'san francisco de macorís': { lat: 19.2990, lng: -70.2527 },
  'san francisco de macoris': { lat: 19.2990, lng: -70.2527 },
  'moca':                     { lat: 19.3930, lng: -70.5234 },
  'bonao':                    { lat: 18.9389, lng: -70.4082 },
}

function cityCoordsFallback(address: string): { lat: number; lng: number } | null {
  const lower = address.toLowerCase()
  for (const [city, coords] of Object.entries(CITY_CENTERS)) {
    if (lower.includes(city)) return coords
  }
  return null
}

// Cached for the duration of a single request tree — prevents duplicate queries
// when listings page and map page render in the same RSC pass.
export const getExperienceListings = cache(async () => {
  const { data } = await supabaseAdmin
    .from('experiences')
    .select('id, title, handle, host_id, category, available_days, description, duration_time, languages, featured_image_url, gallery_urls, address, average_rating, total_reviews, price_usd, max_guests, latitude, longitude, hosts(display_name, user_id, profiles(avatar_url))')
    .eq('is_published', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  return (data ?? []).map((exp) => {
    const host = exp.hosts as unknown as HostJoin
    const avatarUrl = host ? extractAvatarUrl(host.profiles) : ''
    return {
      id: exp.id,
      title: exp.title,
      handle: exp.handle,
      host: {
        displayName: host?.display_name ?? 'Anfitrión DoCoolture',
        avatarUrl,
        handle: exp.host_id,
      },
      listingCategory: exp.category,
      date: (exp.available_days as string[] | null)?.join(', ') ?? null,
      description: exp.description,
      durationTime: exp.duration_time,
      languages: (exp.languages as string[] | null) ?? [],
      featuredImage: exp.featured_image_url ?? '',
      galleryImgs: [
        ...(exp.featured_image_url ? [exp.featured_image_url] : []),
        ...((exp.gallery_urls as string[] | null) ?? []),
      ],
      like: false,
      address: exp.address,
      reviewStart: exp.average_rating ?? 0,
      reviewCount: exp.total_reviews ?? 0,
      priceUsd: exp.price_usd as number,
      maxGuests: exp.max_guests,
      saleOff: null as string | null,
      isAds: null as string | null,
      map: exp.latitude != null && exp.longitude != null
        ? { lat: exp.latitude, lng: exp.longitude }
        : cityCoordsFallback(exp.address ?? '') ?? null,
    }
  })
})

export const getExperienceListingByHandle = cache(async (handle: string) => {
  const { data: exp } = await supabaseAdmin
    .from('experiences')
    .select('id, title, handle, host_id, category, available_days, description, duration_time, languages, featured_image_url, gallery_urls, address, average_rating, total_reviews, price_usd, max_guests, latitude, longitude, is_published, is_hidden')
    .eq('handle', handle)
    .eq('is_published', true)
    .eq('is_hidden', false)
    .single()

  if (!exp) return null

  // Fetch host and their profile avatar in a single query via FK join
  const { data: hostData } = await supabaseAdmin
    .from('hosts')
    .select('id, display_name, bio, total_listings, total_reviews, average_rating, response_rate, response_time, is_superhost, is_verified, created_at, profiles!profile_id(avatar_url)')
    .eq('id', exp.host_id)
    .single()

  const avatarUrl = hostData ? extractAvatarUrl((hostData as { profiles: ProfileJoin }).profiles) : ''

  return {
    id: exp.id,
    title: exp.title,
    handle: exp.handle,
    listingCategory: exp.category,
    date: (exp.available_days as string[] | null)?.join(', ') ?? null,
    description: exp.description,
    durationTime: exp.duration_time,
    languages: (exp.languages as string[] | null) ?? [],
    featuredImage: exp.featured_image_url ?? '',
    galleryImgs: [
      ...(exp.featured_image_url ? [exp.featured_image_url] : []),
      ...((exp.gallery_urls as string[] | null) ?? []),
    ],
    like: false,
    address: exp.address,
    reviewStart: exp.average_rating ?? 0,
    reviewCount: exp.total_reviews ?? 0,
    priceUsd: exp.price_usd as number,
    price: `$${exp.price_usd}`,
    maxGuests: exp.max_guests,
    availableDays: (exp.available_days as string[] | null) ?? [],
    saleOff: null as string | null,
    isAds: null as string | null,
    map: { lat: exp.latitude ?? null, lng: exp.longitude ?? null },
    host: {
      displayName: hostData?.display_name ?? 'Anfitrión DoCoolture',
      avatarUrl,
      handle: exp.host_id,
      description: hostData?.bio ?? '',
      listingsCount: hostData?.total_listings ?? 1,
      reviewsCount: hostData?.total_reviews ?? 0,
      rating: hostData?.average_rating ?? 0,
      responseRate: hostData?.response_rate ?? 0,
      responseTime: hostData?.response_time ?? 'En menos de un día',
      isSuperhost: hostData?.is_superhost ?? false,
      isVerified: hostData?.is_verified ?? false,
      joinedDate: hostData
        ? new Date(hostData.created_at).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })
        : '',
    },
  }
})
export type TExperienceListing = Awaited<ReturnType<typeof getExperienceListings>>[number]

export async function getExperienceListingFilterOptions(ef?: {
  experienceType: string; priceRange: string; duration: string; timeOfDay: string
  gastronomy: string; gastronomy_desc: string; outdoor: string; outdoor_desc: string
  artsCulture: string; artsCulture_desc: string; historicalTours: string; historicalTours_desc: string
  musicDance: string; musicDance_desc: string; wellness: string; wellness_desc: string
  lessThan1Hour: string; lessThan1Hour_desc: string; hours1to2: string; hours1to2_desc: string
  hours2to4: string; hours2to4_desc: string; moreThan4Hours: string; moreThan4Hours_desc: string
  morning: string; morning_desc: string; afternoon: string; afternoon_desc: string
  evening: string; evening_desc: string
  [key: string]: string
}) {
  const f = ef ?? {
    experienceType: 'Tipo de experiencia', priceRange: 'Rango de precio',
    duration: 'Duración', timeOfDay: 'Momento del día',
    gastronomy: 'Gastronomía', gastronomy_desc: 'Clases de cocina, mercados, degustaciones y más.',
    outdoor: 'Naturaleza y aventura', outdoor_desc: 'Cascadas, senderismo y actividades al aire libre.',
    artsCulture: 'Arte y cultura', artsCulture_desc: 'Historia, artesanía, música y tradiciones dominicanas.',
    historicalTours: 'Tours históricos', historicalTours_desc: 'Recorre los lugares que forjaron la identidad dominicana.',
    musicDance: 'Música y baile', musicDance_desc: 'Merengue, bachata y ritmos del Caribe.',
    wellness: 'Bienestar', wellness_desc: 'Retiros, yoga y experiencias de relajación.',
    lessThan1Hour: 'Menos de 1 hora', lessThan1Hour_desc: 'Experiencias cortas e intensas.',
    hours1to2: '1 a 2 horas', hours1to2_desc: 'Perfectas para una mañana o tarde.',
    hours2to4: '2 a 4 horas', hours2to4_desc: 'Experiencias completas con tiempo para disfrutar.',
    moreThan4Hours: 'Más de 4 horas', moreThan4Hours_desc: 'Días completos de aventura y exploración.',
    morning: 'Mañana', morning_desc: 'Comienza el día con energía.',
    afternoon: 'Tarde', afternoon_desc: 'Ideal para después del almuerzo.',
    evening: 'Noche', evening_desc: 'Experiencias nocturnas y vida cultural.',
  }
  return [
    {
      label: f.experienceType,
      name: 'experienceType',
      tabUIType: 'checkbox',
      options: [
        { name: f.gastronomy, value: 'food_drink', description: f.gastronomy_desc, defaultChecked: false },
        { name: f.outdoor, value: 'outdoor', description: f.outdoor_desc, defaultChecked: false },
        { name: f.artsCulture, value: 'arts_culture', description: f.artsCulture_desc, defaultChecked: false },
        { name: f.historicalTours, value: 'history', description: f.historicalTours_desc, defaultChecked: false },
        { name: f.musicDance, value: 'music_dance', description: f.musicDance_desc, defaultChecked: false },
        { name: f.wellness, value: 'wellness', description: f.wellness_desc, defaultChecked: false },
      ],
    },
    {
      label: f.priceRange,
      name: 'priceRange',
      tabUIType: 'price-range',
      min: 0,
      max: 1000,
    },
    {
      label: f.duration,
      name: 'duration',
      tabUIType: 'checkbox',
      options: [
        { name: f.lessThan1Hour, value: 'less_than_1_hour', description: f.lessThan1Hour_desc, defaultChecked: false },
        { name: f.hours1to2, value: '1_2_hours', description: f.hours1to2_desc, defaultChecked: false },
        { name: f.hours2to4, value: '2_4_hours', description: f.hours2to4_desc, defaultChecked: false },
        { name: f.moreThan4Hours, value: 'more_than_4_hours', description: f.moreThan4Hours_desc, defaultChecked: false },
      ],
    },
    {
      label: f.timeOfDay,
      name: 'timeOfDay',
      tabUIType: 'checkbox',
      options: [
        { name: f.morning, value: 'morning', description: f.morning_desc, defaultChecked: false },
        { name: f.afternoon, value: 'afternoon', description: f.afternoon_desc, defaultChecked: false },
        { name: f.evening, value: 'evening', description: f.evening_desc, defaultChecked: false },
      ],
    },
  ]
}
