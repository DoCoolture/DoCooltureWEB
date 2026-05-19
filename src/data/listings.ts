import avatars1 from '@/images/avatars/Image-1.png'
import { supabase } from '@/lib/supabase'

//  STAY LISTING  //
export interface TStayListing {
  id: string
  date: string
  listingCategory: string
  title: string
  handle: string
  description: string
  featuredImage: string
  galleryImgs: string[]
  like: boolean
  address: string
  reviewStart: number
  reviewCount: number
  price: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  beds?: number
  saleOff: string | null
  isAds: string | null
  map: { lat: number; lng: number }
  host: {
    displayName: string
    avatarUrl: string
    handle: string
    description: string
    listingsCount: number
    reviewsCount: number
    rating: number
    responseRate: number
    responseTime: string
    isSuperhost: boolean
    isVerified: boolean
    joinedDate: string
  }
}

export async function getStayListings(): Promise<TStayListing[]> {
  return []
}
export const getStayListingByHandle = async (_handle: string): Promise<TStayListing | null> => null

//  CAR LISTING  //
export interface TCarListing {
  id: string
  title: string
  handle: string
  listingCategory: string
  description: string
  featuredImage: string
  galleryImgs: string[]
  address: string
  reviewStart: number
  reviewCount: number
  price: string
  gearshift: string
  seats: number
  airbags: number
  like: boolean
  saleOff: string | null
  isAds: string | null
  map: { lat: number; lng: number }
  bags?: number
  pickUpAddress?: string
  dropOffAddress?: string
  pickUpTime?: string
  dropOffTime?: string
  host: {
    displayName: string
    avatarUrl: string
    handle: string
    description: string
    listingsCount: number
    reviewsCount: number
    rating: number
    responseRate: number
    responseTime: string
    isSuperhost: boolean
    isVerified: boolean
    joinedDate: string
  }
}

export async function getCarListings(): Promise<TCarListing[]> {
  return []
}
export const getCarListingByHandle = async (_handle: string): Promise<TCarListing | null> => null

// ============================================================
// ✅ DOCOOLTURE — EXPERIENCE LISTINGS
// Solo "Taste of Dominican Culture" está en el código.
// El resto las agregan los anfitriones desde el dashboard.
// ============================================================

const TASTE_OF_DOMINICAN = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'Taste of Dominican Culture',
  handle: 'taste-of-dominican-culture',
  host: {
    displayName: 'DoCoolture Gastronomy',
    avatarUrl: avatars1.src,
    handle: 'docoolture-gastronomy',
  },
  listingCategory: 'Gastronomía',
  date: 'weekendsAvailable',
  availableDays: ['Sábado', 'Domingo'] as string[],
  description:
    'Descubre la esencia de la República Dominicana a través de su gastronomía. Un recorrido sensorial que combina historia, tradición y sabor — desde ingredientes taínos hasta influencias africanas y europeas. Cada plato cuenta una historia. Guiado por expertos locales en la Zona Colonial de Santo Domingo.',
  durationTime: '3–4 horas',
  languages: ['Español', 'English'],
  featuredImage: '/images/experiences/taste-dominican/sancocho.jpeg',
  galleryImgs: [
    '/images/experiences/taste-dominican/sancocho.jpeg',
    '/images/experiences/taste-dominican/desayuno.jpeg',
    '/images/experiences/taste-dominican/locrio.jpeg',
    '/images/experiences/taste-dominican/cacao.jpeg',
    '/images/experiences/taste-dominican/chocolate.jpeg',
    '/images/experiences/taste-dominican/cafe.jpeg',
  ],
  like: true,
  address: 'Zona Colonial, Santo Domingo',
  reviewStart: 5.0,
  reviewCount: 0,
  price: '$120',
  maxGuests: 8,
  saleOff: null as string | null,
  isAds: null as string | null,
  map: { lat: 18.4733, lng: -69.8833 },
}

export const HARDCODED_EXPERIENCES: Record<string, typeof TASTE_OF_DOMINICAN> = {
  [TASTE_OF_DOMINICAN.id]: TASTE_OF_DOMINICAN,
}

export async function getExperienceListings() {
  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_published', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  const fromSupabase = (data ?? []).map((exp) => ({
    id: exp.id,
    title: exp.title,
    handle: exp.handle,
    host: {
      displayName: 'Anfitrión DoCoolture',
      avatarUrl: '',
      handle: exp.host_id,
    },
    listingCategory: exp.category,
    date: (exp.available_days as string[] | null)?.join(', ') ?? 'Consultar disponibilidad',
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
    price: `$${exp.price_usd}`,
    maxGuests: exp.max_guests,
    saleOff: null as string | null,
    isAds: null as string | null,
    map: { lat: exp.latitude ?? 0, lng: exp.longitude ?? 0 },
  }))

  return [TASTE_OF_DOMINICAN, ...fromSupabase]
}

const TASTE_OF_DOMINICAN_DETAIL = {
  ...TASTE_OF_DOMINICAN,
  galleryImgs: [
    ...TASTE_OF_DOMINICAN.galleryImgs,
    'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/4706134/pexels-photo-4706134.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/3825578/pexels-photo-3825578.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ],
  host: {
    displayName: 'Eden Smith',
    avatarUrl: avatars1.src,
    handle: 'eden-smith',
    description:
      'Somos un equipo apasionado por mostrar la República Dominicana auténtica — su cultura, su gente y sus tradiciones.',
    listingsCount: 1,
    reviewsCount: 0,
    rating: 5.0,
    responseRate: 100,
    responseTime: 'en menos de una hora',
    isSuperhost: true,
    isVerified: true,
    joinedDate: 'Enero 2025',
  },
}

export const getExperienceListingByHandle = async (handle: string) => {
  if (handle === 'taste-of-dominican-culture') {
    return TASTE_OF_DOMINICAN_DETAIL
  }

  const { data: exp } = await supabase
    .from('experiences')
    .select('*')
    .eq('handle', handle)
    .eq('is_published', true)
    .eq('is_hidden', false)
    .single()

  if (!exp) return TASTE_OF_DOMINICAN_DETAIL

  const { data: hostData } = await supabase
    .from('hosts')
    .select('*')
    .eq('id', exp.host_id)
    .single()

  let avatarUrl = ''
  if (hostData) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', hostData.profile_id)
      .single()
    avatarUrl = profileData?.avatar_url ?? ''
  }

  return {
    id: exp.id,
    title: exp.title,
    handle: exp.handle,
    listingCategory: exp.category,
    date: (exp.available_days as string[] | null)?.join(', ') ?? 'Consultar disponibilidad',
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
    price: `$${exp.price_usd}`,
    maxGuests: exp.max_guests,
    availableDays: (exp.available_days as string[] | null) ?? [],
    saleOff: null as string | null,
    isAds: null as string | null,
    map: { lat: exp.latitude ?? 0, lng: exp.longitude ?? 0 },
    host: {
      displayName: hostData?.display_name ?? 'Anfitrión DoCoolture',
      avatarUrl,
      handle: hostData?.display_name
        ? hostData.display_name.toLowerCase().replace(/\s+/g, '-')
        : exp.host_id,
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
}
export type TExperienceListing = Awaited<ReturnType<typeof getExperienceListings>>[number]

//  REAL-ESTATE LISTING  //
export interface TRealEstateListing {
  id: string
  date: string
  listingCategory: string
  title: string
  handle: string
  description: string
  featuredImage: string
  galleryImgs: string[]
  like: boolean
  address: string
  reviewStart: number
  reviewCount: number
  price: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  acreage: number
  saleOff: string | null
  isAds: string | null
  map: { lat: number; lng: number }
  host: {
    displayName: string
    avatarUrl: string
    handle: string
    description: string
    listingsCount: number
    reviewsCount: number
    rating: number
    responseRate: number
    responseTime: string
    isSuperhost: boolean
    isVerified: boolean
    joinedDate: string
    email?: string
    phone?: string
  }
}

export async function getRealEstateListings(): Promise<TRealEstateListing[]> {
  return []
}
export const getRealEstateListingByHandle = async (_handle: string): Promise<TRealEstateListing | null> => null

// FLIGHT LISTING //
export interface TFlightListing {
  id: string
  name: string
  departure: string
  departureTime: string
  arrivalTime: string
  arrival: string
  duration: string
  stopNumber: number
  stopAirport: string
  layover: string
  href: string
  price: string
  airlines: { logo: string; name: string }
}

export async function getFlightListings(): Promise<TFlightListing[]> {
  return []
}

// ============================================================
// FILTER OPTIONS
// ============================================================

export async function getStayListingFilterOptions() {
  return [
    {
      label: 'Property type',
      name: 'propertyType',
      tabUIType: 'checkbox',
      options: [
        { name: 'Entire place', value: 'entire_place', description: 'Have a place to yourself', defaultChecked: true },
        { name: 'Private room', value: 'private_room', description: 'Have your own room and share some common spaces', defaultChecked: true },
        { name: 'Hotel room', value: 'hotel_room', description: 'Have a private or shared room in a boutique hotel, hostel, and more' },
        { name: 'Shared room', value: 'shared_room', description: 'Stay in a shared space, like a common room' },
      ],
    },
    { label: 'Price range', name: 'priceRange', tabUIType: 'price-range', min: 0, max: 1000 },
    {
      label: 'Rooms & Beds',
      name: 'roomsAndBeds',
      tabUIType: 'select-number',
      options: [{ name: 'Beds', max: 10 }, { name: 'Bedrooms', max: 10 }, { name: 'Bathrooms', max: 10 }],
    },
    {
      label: 'Amenities',
      name: 'amenities',
      tabUIType: 'checkbox',
      options: [
        { name: 'Kitchen', value: 'kitchen', description: 'Have a place to yourself', defaultChecked: true },
        { name: 'Air conditioning', value: 'air_conditioning', description: 'Have your own room and share some common spaces', defaultChecked: true },
        { name: 'Heating', value: 'heating', description: 'Have a private or shared room in a boutique hotel, hostel, and more' },
        { name: 'Dryer', value: 'dryer', description: 'Stay in a shared space, like a common room' },
        { name: 'Washer', value: 'washer', description: 'Stay in a shared space, like a common room' },
      ],
    },
  ]
}

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

export async function getRealEstateListingFilterOptions() {
  return [
    {
      label: 'Property type',
      name: 'listingCategory',
      tabUIType: 'checkbox',
      options: [
        { name: 'Entire place', value: 'entire_place', description: 'Have a place to yourself', defaultChecked: true },
        { name: 'Private room', value: 'private_room', description: 'Have your own room and share some common spaces', defaultChecked: true },
        { name: 'Hotel room', value: 'hotel_room', description: 'Have a private or shared room in a boutique hotel, hostel, and more' },
        { name: 'Shared room', value: 'shared_room', description: 'Stay in a shared space, like a common room' },
      ],
    },
    { label: 'Price range', name: 'priceRange', tabUIType: 'price-range', min: 0, max: 1000 },
    {
      label: 'Rooms & Beds',
      name: 'roomsAndBeds',
      tabUIType: 'select-number',
      options: [{ name: 'Beds', max: 10 }, { name: 'Bedrooms', max: 10 }, { name: 'Bathrooms', max: 10 }],
    },
  ]
}

export async function getCarListingFilterOptions() {
  return [
    {
      label: 'Car type',
      name: 'Car-type',
      tabUIType: 'checkbox',
      options: [
        { name: 'Sedan', value: 'sedan', description: 'Comfortable and spacious for city driving.', defaultChecked: true },
        { name: 'SUV', value: 'suv', description: 'Perfect for off-road adventures and family trips.', defaultChecked: true },
        { name: 'Truck', value: 'truck', description: 'Ideal for heavy loads and rugged terrain.' },
        { name: 'Convertible', value: 'convertible', description: 'Enjoy the open air with a stylish ride.' },
      ],
    },
    { label: 'Price range', name: 'Price-range', tabUIType: 'price-range', min: 0, max: 1000 },
  ]
}

export async function getFlightFilterOptions() {
  return [
    {
      label: 'Airlines',
      name: 'airlines',
      tabUIType: 'checkbox',
      options: [
        { name: 'Korean Air', value: 'korean_air', description: 'Flag carrier and largest airline of South Korea.', defaultChecked: true },
        { name: 'Singapore Airlines', value: 'singapore_airlines', description: 'Flag carrier of Singapore, known for its service.', defaultChecked: true },
        { name: 'Philippine Airlines', value: 'philippine_airlines', description: 'Flag carrier of the Philippines.' },
      ],
    },
    { label: 'Price range', name: 'priceRange', tabUIType: 'price-range', min: 0, max: 10000 },
  ]
}