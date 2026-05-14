import avatars1 from '@/images/avatars/Image-1.png'
import avatars2 from '@/images/avatars/Image-2.png'
import avatars3 from '@/images/avatars/Image-3.png'
import avatars4 from '@/images/avatars/Image-4.png'
import avatars5 from '@/images/avatars/Image-5.png'
import avatars6 from '@/images/avatars/Image-6.png'
import avatars7 from '@/images/avatars/Image-7.png'
import avatars8 from '@/images/avatars/Image-8.png'
import { supabase } from '@/lib/supabase'
import car1 from '@/images/cars/1.png'
import car2 from '@/images/cars/2.png'
import car3 from '@/images/cars/3.png'
import car4 from '@/images/cars/4.png'
import car5 from '@/images/cars/5.png'
import car6 from '@/images/cars/6.png'
import car7 from '@/images/cars/7.png'
import car8 from '@/images/cars/8.png'
import airlineLogo1 from '@/images/flights/logo1.png'
import airlineLogo2 from '@/images/flights/logo2.png'
import airlineLogo3 from '@/images/flights/logo3.png'
import airlineLogo4 from '@/images/flights/logo4.png'

//  STAY LISTING  //
export async function getStayListings() {
  return [
    {
      id: 'stay-listing://1',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: 'Best Western Cedars Hotel',
      handle: 'best-western-cedars-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '1 Anzinger Court',
      reviewStart: 4.8,
      reviewCount: 28,
      price: '$260',
      maxGuests: 6,
      bedrooms: 10,
      bathrooms: 3,
      beds: 5,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.0405, lng: -89.395 },
    },
    {
      id: 'stay-listing://2',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: 'Bell by Greene King Inns ',
      handle: 'bell-by-greene-king-inns',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '32923 Judy Hill',
      reviewStart: 4.4,
      reviewCount: 198,
      price: '$250',
      maxGuests: 10,
      beds: 5,
      bedrooms: 6,
      bathrooms: 7,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.065, lng: -89.31 },
    },
    {
      id: 'stay-listing://3',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: "Half Moon, Sherborne by Marston's Inns ",
      handle: 'half-moon-sherborne-by-marstons-inns',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: true,
      address: '6731 Killdeer Park',
      reviewStart: 3.6,
      reviewCount: 16,
      price: '$278',
      maxGuests: 9,
      beds: 5,
      bedrooms: 9,
      bathrooms: 8,
      saleOff: null,
      isAds: null,
      map: { lat: 43.09, lng: -89.48 },
    },
    {
      id: 'stay-listing://4',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: 'White Horse Hotel by Greene King Inns ',
      handle: 'white-horse-hotel-by-greene-king-inns',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '35 Sherman Park',
      reviewStart: 4.8,
      reviewCount: 34,
      price: '$240',
      beds: 5,
      maxGuests: 6,
      bedrooms: 7,
      bathrooms: 5,
      saleOff: null,
      isAds: null,
      map: { lat: 43.06, lng: -89.43 },
    },
    {
      id: 'stay-listing://5',
      date: 'May 20, 2021',
      listingCategory: 'Holiday home',
      title: 'Ship and Castle Hotel ',
      handle: 'ship-and-castle-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '3 Crest Line Park',
      reviewStart: 3.4,
      reviewCount: 340,
      price: '$147',
      beds: 5,
      maxGuests: 8,
      bedrooms: 3,
      bathrooms: 2,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0405, lng: -89.355 },
    },
    {
      id: 'stay-listing://6',
      date: 'May 20, 2021',
      listingCategory: 'Home stay',
      title: 'The Windmill Family & Commercial Hotel ',
      handle: 'the-windmill-family-commercial-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: true,
      address: '55974 Waxwing Junction',
      reviewStart: 3.8,
      reviewCount: 508,
      price: '$190',
      maxGuests: 8,
      beds: 5,
      bedrooms: 7,
      bathrooms: 7,
      saleOff: null,
      isAds: null,
      map: { lat: 43.07, lng: -89.37 },
    },
    {
      id: 'stay-listing://7',
      date: 'May 20, 2021',
      listingCategory: 'Hotel room',
      title: "Unicorn, Gunthorpe by Marston's Inns ",
      handle: 'unicorn-gunthorpe-by-marstons-inns',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '79361 Chinook Place',
      reviewStart: 3.0,
      reviewCount: 481,
      price: '$282',
      maxGuests: 9,
      beds: 5,
      bedrooms: 2,
      bathrooms: 5,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.082, lng: -89.425 },
    },
    {
      id: 'stay-listing://8',
      date: 'May 20, 2021',
      listingCategory: 'Hotel room',
      title: 'Holiday Inn Express Ramsgate Minster, an IHG Hotel ',
      handle: 'holiday-inn-express-ramsgate-minster-an-ihg-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      ],
      like: true,
      address: '6 Chive Avenue',
      reviewStart: 3.9,
      reviewCount: 188,
      price: '$179',
      maxGuests: 6,
      beds: 5,
      bedrooms: 7,
      bathrooms: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0405, lng: -89.445 },
    },
  ]
}
export const getStayListingByHandle = async (handle: string) => {
  const listings = await getStayListings()
  let listing = listings.find((listing) => listing.handle === handle)
  if (!listing?.id) {
    listing = listings[0]
  }
  return {
    ...(listing || {}),
    galleryImgs: [
      ...listing.galleryImgs,
      'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    ],
    host: {
      displayName: 'Jane Smith',
      avatarUrl: avatars1.src,
      handle: 'jane-smith',
      description:
        'Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides accommodation, an outdoor swimming pool, a bar, a shared lounge, a garden and barbecue facilities.',
      listingsCount: 5,
      reviewsCount: 120,
      rating: 4.8,
      responseRate: 95,
      responseTime: 'within an hour',
      isSuperhost: true,
      isVerified: true,
      joinedDate: 'March 2024',
    },
  }
}
export type TStayListing = Awaited<ReturnType<typeof getStayListings>>[number]

//  CAR LISTING  //
export async function getCarListings() {
  return [
    {
      id: 'car-listing://1',
      title: 'Peugeot 108',
      handle: 'peugeot-108',
      listingCategory: 'Peugeot group',
      description: 'A compact and efficient hatchback, perfect for city driving.',
      featuredImage: car1.src,
      galleryImgs: [],
      address: '8953 Golf Course Terrace',
      reviewStart: 5.0,
      reviewCount: 126,
      price: '$124',
      gearshift: 'Auto gearbox',
      seats: 4,
      airbags: 6,
      like: true,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0405, lng: -89.395 },
    },
    {
      id: 'car-listing://2',
      title: 'KONA Electric',
      handle: 'kona-electric',
      listingCategory: 'Hyundai group',
      description: 'A compact SUV with a stylish design and advanced features.',
      featuredImage: car2.src,
      galleryImgs: [],
      like: true,
      address: '2606 Straubel Crossing',
      reviewStart: 4.6,
      reviewCount: 217,
      price: '$382',
      gearshift: 'Auto gearbox',
      airbags: 6,
      seats: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0405, lng: -89.355 },
    },
    {
      id: 'car-listing://3',
      title: 'Nissan Micra',
      handle: 'nissan-micra',
      listingCategory: 'Nissan group',
      description: 'A compact and efficient hatchback, perfect for city driving.',
      featuredImage: car3.src,
      galleryImgs: [],
      like: false,
      address: '14 Petterle Trail',
      reviewStart: 3.8,
      reviewCount: 534,
      airbags: 6,
      price: '$105',
      gearshift: 'Auto gearbox',
      seats: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0405, lng: -89.435 },
    },
    {
      id: 'car-listing://4',
      title: 'Hyundai i30',
      handle: 'hyundai-i30',
      description: 'A compact car with a spacious interior and advanced safety features.',
      listingCategory: 'Hyundai group',
      featuredImage: car4.src,
      galleryImgs: [],
      airbags: 6,
      like: true,
      address: '34591 Dawn Park',
      reviewStart: 3.1,
      reviewCount: 527,
      price: '$266',
      gearshift: 'Auto gearbox',
      seats: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0705, lng: -89.395 },
    },
    {
      id: 'car-listing://5',
      title: 'Nissan NV 300',
      handle: 'nissan-nv-300',
      listingCategory: 'Nissan group',
      description: 'A reliable and spacious van, perfect for transporting goods or people.',
      featuredImage: car5.src,
      galleryImgs: [],
      airbags: 6,
      like: false,
      address: '5970 Manley Terrace',
      reviewStart: 3.6,
      reviewCount: 169,
      price: '$268',
      gearshift: 'Auto gearbox',
      seats: 4,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.0705, lng: -89.355 },
    },
    {
      id: 'car-listing://6',
      title: 'Nissan Qashqai',
      handle: 'nissan-qashqai',
      description: 'A versatile SUV with a spacious interior and advanced safety features.',
      listingCategory: 'Nissan group',
      featuredImage: car6.src,
      galleryImgs: [],
      airbags: 6,
      like: false,
      address: '3 Buhler Point',
      reviewStart: 3.5,
      reviewCount: 33,
      price: '$321',
      gearshift: 'Auto gearbox',
      seats: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0605, lng: -89.425 },
    },
    {
      id: 'car-listing://7',
      title: 'Hyundai Kona',
      handle: 'hyundai-kona',
      description: 'A compact SUV with a stylish design and advanced features.',
      listingCategory: 'Hyundai group',
      featuredImage: car7.src,
      galleryImgs: [],
      airbags: 6,
      like: true,
      address: '35 Kedzie Parkway',
      reviewStart: 4.2,
      reviewCount: 468,
      price: '$127',
      gearshift: 'Auto gearbox',
      seats: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0505, lng: -89.305 },
    },
    {
      id: 'car-listing://8',
      title: 'Mitsubishi Mirage',
      handle: 'mitsubishi-mirage',
      description: 'A compact and efficient hatchback, perfect for city driving.',
      listingCategory: 'Mitsubishi group',
      featuredImage: car8.src,
      galleryImgs: [],
      airbags: 6,
      like: true,
      address: '466 Glendale Place',
      reviewStart: 4.5,
      reviewCount: 524,
      price: '$46',
      gearshift: 'Auto gearbox',
      seats: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0255, lng: -89.375 },
    },
  ]
}
export const getCarListingByHandle = async (handle: string) => {
  const listings = await getCarListings()
  let listing = listings.find((listing) => listing.handle === handle)
  if (!listing?.id) {
    listing = listings[0]
  }
  return {
    ...(listing || {}),
    bags: 3,
    pickUpAddress: '2 Warner Alley, Neverland',
    pickUpTime: 'Monday, August 12 · 10:00',
    dropOffAddress: '123 Main Street, Neverland',
    dropOffTime: 'Monday, August 16 · 10:00',
    galleryImgs: [
      'https://images.pexels.com/photos/381292/pexels-photo-381292.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/2827753/pexels-photo-2827753.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/257851/pexels-photo-257851.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/457418/pexels-photo-457418.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/712618/pexels-photo-712618.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/752615/pexels-photo-752615.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1210622/pexels-photo-1210622.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/303316/pexels-photo-303316.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/136872/pexels-photo-136872.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    host: {
      displayName: 'John Doe',
      avatarUrl: avatars1.src,
      handle: 'john-doe',
      description: 'Experienced car owner with a passion for sharing my vehicles with others.',
      listingsCount: 3,
      reviewsCount: 150,
      rating: 4.9,
      responseRate: 98,
      responseTime: 'within an hour',
      isSuperhost: true,
      isVerified: true,
      joinedDate: 'January 2023',
    },
  }
}
export type TCarListing = Awaited<ReturnType<typeof getCarListings>>[number]

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
    galleryImgs: (exp.gallery_urls as string[] | null) ?? [],
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
    galleryImgs: (exp.gallery_urls as string[] | null) ?? [],
    like: false,
    address: exp.address,
    reviewStart: exp.average_rating ?? 0,
    reviewCount: exp.total_reviews ?? 0,
    price: `$${exp.price_usd}`,
    maxGuests: exp.max_guests,
    saleOff: null as string | null,
    isAds: null as string | null,
    map: { lat: exp.latitude ?? 0, lng: exp.longitude ?? 0 },
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
}
export type TExperienceListing = Awaited<ReturnType<typeof getExperienceListings>>[number]

//  REAL-ESTATE LISTING  //
export async function getRealEstateListings() {
  return [
    {
      id: 'real-estate-listing://1',
      title: 'Best Western Cedars Hotel ',
      handle: 'best-western-cedars-hotel',
      description: 'Located in the heart of the city',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      featuredImage:
        'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1604145195376-e2c8195adf29?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '1 Anzinger Court',
      reviewStart: 4.8,
      reviewCount: 28,
      price: '$26',
      maxGuests: 6,
      bedrooms: 10,
      bathrooms: 3,
      acreage: 100,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.0405, lng: -89.245 },
    },
    {
      id: 'real-estate-listing://2',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: 'Bell by Greene King Inns ',
      description: 'Located in the heart of the city',
      handle: 'bell-by-greene-king-inns',
      featuredImage:
        'https://images.unsplash.com/photo-1498503403619-e39e4ff390fe?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1498503403619-e39e4ff390fe?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '32923 Judy Hill',
      reviewStart: 4.4,
      reviewCount: 198,
      price: '$250',
      maxGuests: 10,
      bedrooms: 6,
      acreage: 100,
      bathrooms: 7,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.0605, lng: -89.245 },
    },
    {
      id: 'real-estate-listing://3',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: "Half Moon, Sherborne by Marston's Inns ",
      description: 'Located in the heart of the city',
      handle: 'half-moon-sherborne-by-marstons-inns',
      featuredImage:
        'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      galleryImgs: [
        'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: true,
      address: '6731 Killdeer Park',
      reviewStart: 3.6,
      reviewCount: 16,
      price: '$278',
      maxGuests: 9,
      acreage: 100,
      bedrooms: 9,
      bathrooms: 8,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0205, lng: -89.245 },
    },
    {
      id: 'real-estate-listing://4',
      date: 'May 20, 2021',
      listingCategory: 'Entire cabin',
      title: 'White Horse Hotel by Greene King Inns ',
      handle: 'white-horse-hotel-by-greene-king-inns',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.unsplash.com/photo-1571509706433-a89eecf63dc8?q=80&w=3858&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1571509706433-a89eecf63dc8?q=80&w=3858&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '35 Sherman Park',
      reviewStart: 4.8,
      reviewCount: 34,
      price: '$40',
      maxGuests: 6,
      acreage: 100,
      bedrooms: 7,
      bathrooms: 5,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0505, lng: -89.285 },
    },
    {
      id: 'real-estate-listing://5',
      date: 'May 20, 2021',
      listingCategory: 'Holiday home',
      title: 'Ship and Castle Hotel ',
      handle: 'ship-and-castle-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.unsplash.com/photo-1535205148555-bcbbc2a78913?q=80&w=3948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1535205148555-bcbbc2a78913?q=80&w=3948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '3 Crest Line Park',
      reviewStart: 3.4,
      reviewCount: 340,
      price: '$147',
      maxGuests: 8,
      acreage: 100,
      bedrooms: 3,
      bathrooms: 2,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0605, lng: -89.205 },
    },
    {
      id: 'real-estate-listing://6',
      date: 'May 20, 2021',
      listingCategory: 'Home stay',
      title: 'The Windmill Family & Commercial Hotel ',
      handle: 'the-windmill-family-and-commercial-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: true,
      address: '55974 Waxwing Junction',
      reviewStart: 3.8,
      reviewCount: 508,
      price: '$90',
      maxGuests: 8,
      bedrooms: 7,
      acreage: 100,
      bathrooms: 7,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0305, lng: -89.295 },
    },
    {
      id: 'real-estate-listing://7',
      date: 'May 20, 2021',
      listingCategory: 'Hotel room',
      title: "Unicorn, Gunthorpe by Marston's Inns ",
      handle: 'unicorn-gunthorpe-by-marstons-inns',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.unsplash.com/photo-1605581813258-076a6654a37f?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1605581813258-076a6654a37f?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: false,
      address: '79361 Chinook Place',
      reviewStart: 3.0,
      reviewCount: 481,
      price: '$282',
      maxGuests: 9,
      bedrooms: 2,
      acreage: 100,
      bathrooms: 5,
      saleOff: '-10% today',
      isAds: null,
      map: { lat: 43.0705, lng: -89.295 },
    },
    {
      id: 'real-estate-listing://8',
      date: 'May 20, 2021',
      listingCategory: 'Hotel room',
      title: 'Holiday Inn Express Ramsgate Minster, an IHG Hotel ',
      handle: 'holiday-inn-express-ramsgate-minster-an-ihg-hotel',
      description: 'Located in the heart of the city',
      featuredImage:
        'https://images.unsplash.com/photo-1616423841125-8307665a0469?q=80&w=3948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      galleryImgs: [
        'https://images.unsplash.com/photo-1616423841125-8307665a0469?q=80&w=3948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      ],
      like: true,
      address: '6 Chive Avenue',
      reviewStart: 3.9,
      reviewCount: 188,
      price: '$79',
      maxGuests: 6,
      acreage: 100,
      bedrooms: 7,
      bathrooms: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 43.0755, lng: -89.265 },
    },
  ]
}
export const getRealEstateListingByHandle = async (handle: string) => {
  const listings = await getRealEstateListings()
  let listing = listings.find((listing) => listing.handle === handle)
  if (!listing?.id) {
    listing = listings[0]
  }
  return {
    ...(listing || {}),
    galleryImgs: [
      ...listing.galleryImgs,
      'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    ],
    host: {
      displayName: 'John Doe',
      avatarUrl: avatars2.src,
      handle: 'john-doe',
      description:
        'Experienced real estate agent with over 10 years in the industry, specializing in residential properties.',
      listingsCount: 15,
      reviewsCount: 250,
      rating: 4.9,
      responseRate: 98,
      responseTime: 'within an hour',
      isSuperhost: true,
      isVerified: true,
      joinedDate: 'January 2020',
      email: 'john-doe@gmail.com',
      phone: '+1234567890',
    },
  }
}
export type TRealEstateListing = Awaited<ReturnType<typeof getRealEstateListings>>[number]

// FLIGHT LISTING //
export async function getFlightListings() {
  return [
    {
      id: 'flight-listing://1',
      name: 'AKL - ICN',
      departure: 'Auckland (AKL)',
      departureTime: '2025-10-01T10:00:00Z',
      arrivalTime: '2025-10-01T21:30:00Z',
      arrival: 'Incheon (ICN)',
      duration: '11h 30m',
      stopNumber: 1,
      stopAirport: 'SGN',
      layover: '2h 30m',
      href: '#',
      price: '$4,100',
      airlines: { logo: airlineLogo1.src, name: 'Korean Air' },
    },
    {
      id: 'flight-listing://2',
      name: 'AKL - ICN',
      departure: 'Auckland (AKL)',
      departureTime: '2025-10-01T10:00:00Z',
      arrivalTime: '2025-10-01T21:30:00Z',
      arrival: 'Incheon (ICN)',
      duration: '15h 30m',
      stopNumber: 1,
      stopAirport: 'Ho Chi Minh City (SGN)',
      layover: '2h 30m',
      price: '$3,380',
      href: '#',
      airlines: { logo: airlineLogo2.src, name: 'Singapore Airlines' },
    },
    {
      id: 'flight-listing://3',
      name: 'SGN - AKl',
      departure: 'Ho Chi Minh City (SGN)',
      arrival: 'Auckland (AKL)',
      departureTime: '2025-10-01T10:00:00Z',
      arrivalTime: '2025-10-02T07:40:00Z',
      duration: '21h 40m',
      stopNumber: 1,
      stopAirport: 'Sydney (SYD)',
      layover: '2h 30m',
      price: '$2,380',
      href: '#',
      airlines: { logo: airlineLogo3.src, name: 'Philippine Airlines' },
    },
    {
      id: 'flight-listing://4',
      name: 'HAN - NRT',
      departure: 'Hanoi (HAN)',
      arrival: 'Tokyo (NRT)',
      departureTime: '2025-10-01T10:00:00Z',
      arrivalTime: '2025-10-01T21:30:00Z',
      duration: '5h 30m',
      stopNumber: 1,
      stopAirport: 'Sydney (SYD)',
      layover: '2h 30m',
      price: '$4,100',
      href: '#',
      airlines: { logo: airlineLogo4.src, name: 'Korean Air' },
    },
    {
      id: 'flight-listing://5',
      name: 'AKL - ICN',
      departure: 'Auckland (AKL)',
      arrival: 'Incheon (ICN)',
      departureTime: '2025-10-01T10:00:00Z',
      arrivalTime: '2025-10-01T21:30:00Z',
      duration: '11h 30m',
      stopNumber: 1,
      stopAirport: 'Singapore (SIN)',
      layover: '2h 30m',
      price: '$2,380',
      href: '#',
      airlines: { logo: airlineLogo1.src, name: 'Singapore Airlines' },
    },
    {
      id: 'flight-listing://6',
      name: 'AKL - ICN',
      departure: 'Auckland (AKL)',
      arrival: 'Incheon (ICN)',
      departureTime: '2025-10-01T10:00:00Z',
      arrivalTime: '2025-10-01T21:30:00Z',
      duration: '19h 30m',
      stopNumber: 1,
      stopAirport: 'Auckland (AKL)',
      layover: '2h 30m',
      href: '#',
      price: '$4,100',
      airlines: { logo: airlineLogo3.src, name: 'Korean Air' },
    },
  ]
}
export type TFlightListing = Awaited<ReturnType<typeof getFlightListings>>[number]

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