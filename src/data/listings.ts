import avatars1 from '@/images/avatars/Image-1.png'
import avatars2 from '@/images/avatars/Image-2.png'
import avatars3 from '@/images/avatars/Image-3.png'
import avatars4 from '@/images/avatars/Image-4.png'
import avatars5 from '@/images/avatars/Image-5.png'
import avatars6 from '@/images/avatars/Image-6.png'
import avatars7 from '@/images/avatars/Image-7.png'
import avatars8 from '@/images/avatars/Image-8.png'
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
    // return null

    // for demo porpose, we will return the first listing if not found
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
    // return null

    // for demo porpose, we will return the first listing if not found
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

//  EXPERIENCE LISTING  //
export async function getExperienceListings() {
  return [
    {
      id: 'experience-listing://1',
      title: 'Tour gastronómico por el mercado de Villa Consuelo',
      handle: 'tour-gastronomico-villa-consuelo',
      host: {
        displayName: 'Chef María Rodríguez',
        avatarUrl: avatars1.src,
        handle: 'chef-maria-rodriguez',
      },
      listingCategory: 'Gastronomía',
      date: 'Disponible todos los sábados',
      description:
        'Sumérgete en los sabores auténticos de Santo Domingo. Visitaremos el mercado de Villa Consuelo, probaremos frituras típicas, jugos de frutas locales y terminaremos cocinando un sancocho tradicional con ingredientes frescos del mercado. Una experiencia que te conecta con la cocina dominicana de verdad.',
      durationTime: '3 horas',
      languages: ['Español', 'English'],
      featuredImage:
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
      galleryImgs: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1600',
      ],
      like: true,
      address: 'Villa Consuelo, Santo Domingo',
      reviewStart: 4.9,
      reviewCount: 38,
      price: '$45',
      maxGuests: 8,
      saleOff: null,
      isAds: null,
      map: { lat: 18.4861, lng: -69.9312 },
    },
    {
      id: 'experience-listing://2',
      title: 'Caminata histórica por la Zona Colonial',
      handle: 'caminata-historica-zona-colonial',
      host: {
        displayName: 'Guía Pedro Alcántara',
        avatarUrl: avatars2.src,
        handle: 'guia-pedro-alcantara',
      },
      listingCategory: 'Tour Cultural',
      date: 'Martes, jueves y sábados',
      description:
        'Recorre las calles empedradas de la primera ciudad del Nuevo Mundo. Conocerás la Catedral Primada de América, el Alcázar de Colón, la Fortaleza Ozama y las historias detrás de cada piedra colonial. Pedro lleva 15 años contando la historia dominicana con pasión y detalle.',
      durationTime: '2.5 horas',
      languages: ['Español', 'English', 'Français'],
      featuredImage:
        'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1600',
      galleryImgs: [
        'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/2901212/pexels-photo-2901212.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/1537008/pexels-photo-1537008.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&w=1600',
      ],
      like: true,
      address: 'Zona Colonial, Santo Domingo',
      reviewStart: 5.0,
      reviewCount: 62,
      price: '$35',
      maxGuests: 12,
      saleOff: null,
      isAds: null,
      map: { lat: 18.4733, lng: -69.8833 },
    },
    {
      id: 'experience-listing://3',
      title: 'Taller de merengue y bachata con músicos locales',
      handle: 'taller-merengue-bachata-santiago',
      host: {
        displayName: 'Maestro Julio Marte',
        avatarUrl: avatars3.src,
        handle: 'maestro-julio-marte',
      },
      listingCategory: 'Música y Baile',
      date: 'Viernes y sábados',
      description:
        'Aprende a bailar merengue y bachata con un músico santiaguero de toda la vida. Julio toca el acordeón desde los 8 años y te enseñará los pasos básicos, la historia detrás del ritmo y por qué estas músicas son el alma dominicana. Incluye bebidas típicas y snacks.',
      durationTime: '2 horas',
      languages: ['Español'],
      featuredImage:
        'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1600',
      galleryImgs: [
        'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/3756767/pexels-photo-3756767.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/4406745/pexels-photo-4406745.jpeg?auto=compress&cs=tinysrgb&w=1600',
      ],
      like: true,
      address: 'Santiago de los Caballeros',
      reviewStart: 4.8,
      reviewCount: 27,
      price: '$40',
      maxGuests: 10,
      saleOff: null,
      isAds: null,
      map: { lat: 19.4517, lng: -70.6970 },
    },
    {
      id: 'experience-listing://4',
      title: 'Excursión al Salto de Jimaní y comunidades locales',
      handle: 'excursion-salto-jimani-comunidades',
      host: {
        displayName: 'Guía Ana Féliz',
        avatarUrl: avatars4.src,
        handle: 'guia-ana-felix',
      },
      listingCategory: 'Aventura y Naturaleza',
      date: 'Domingos',
      description:
        'Una experiencia fuera de los circuitos turísticos. Visitaremos cascadas escondidas y comunidades campesinas de la frontera con Haití. Ana lleva 8 años trabajando con estas comunidades y parte del pago va directamente a proyectos locales de educación.',
      durationTime: '8 horas',
      languages: ['Español', 'English'],
      featuredImage:
        'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1600',
      galleryImgs: [
        'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1600',
      ],
      like: false,
      address: 'Jimaní, República Dominicana',
      reviewStart: 4.7,
      reviewCount: 19,
      price: '$85',
      maxGuests: 6,
      saleOff: null,
      isAds: null,
      map: { lat: 18.4921, lng: -71.8493 },
    },
    {
      id: 'experience-listing://5',
      title: 'Taller de artesanía en larimar y ámbar con artesano local',
      handle: 'taller-artesania-larimar-ambar',
      host: {
        displayName: 'Artesano Ramón Díaz',
        avatarUrl: avatars5.src,
        handle: 'artesano-ramon-diaz',
      },
      listingCategory: 'Arte y Artesanía',
      date: 'Lunes a viernes',
      description:
        'El larimar y el ámbar son exclusivos de la República Dominicana. En este taller, Ramón — artesano con 25 años de oficio — te enseñará a reconocer piedras auténticas, cómo se trabajan y crearás tu propia pieza para llevar. Una experiencia íntima en su taller de Puerto Plata.',
      durationTime: '2.5 horas',
      languages: ['Español', 'English'],
      featuredImage:
        'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1600',
      galleryImgs: [
        'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/4458420/pexels-photo-4458420.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=1600',
      ],
      like: true,
      address: 'Puerto Plata, República Dominicana',
      reviewStart: 4.9,
      reviewCount: 44,
      price: '$55',
      maxGuests: 4,
      saleOff: null,
      isAds: null,
      map: { lat: 19.7934, lng: -70.6880 },
    },
  ]
}
export const getExperienceListingByHandle = async (handle: string) => {
  const listings = await getExperienceListings()
  let listing = listings.find((listing) => listing.handle === handle)
  if (!listing?.id) {
    // return null

    // for demo porpose, we will return the first listing if not found
    listing = listings[0]
  }

  return {
    ...(listing || {}),
    galleryImgs: [
      ...listing.galleryImgs,
      'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/4706134/pexels-photo-4706134.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3825578/pexels-photo-3825578.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3761124/pexels-photo-3761124.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/8926846/pexels-photo-8926846.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/4706139/pexels-photo-4706139.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/7003624/pexels-photo-7003624.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1600',
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
    // return null

    // for demo porpose, we will return the first listing if not found
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
      // This is a placeholder link, replace with actual flight details
      href: '#',
      price: '$4,100',
      airlines: {
        logo: airlineLogo1.src,
        name: 'Korean Air',
      },
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
      // This is a placeholder link, replace with actual flight details
      href: '#',
      airlines: {
        logo: airlineLogo2.src,
        name: 'Singapore Airlines',
      },
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
      // This is a placeholder link, replace with actual flight details
      href: '#',
      airlines: {
        logo: airlineLogo3.src,
        name: 'Philippine Airlines',
      },
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
      // This is a placeholder link, replace with actual flight details
      price: '$4,100',
      href: '#',
      airlines: {
        logo: airlineLogo4.src,
        name: 'Korean Air',
      },
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
      // This is a placeholder link, replace with actual flight details
      href: '#',
      airlines: {
        logo: airlineLogo1.src,
        name: 'Singapore Airlines',
      },
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
      // This is a placeholder link, replace with actual flight details
      href: '#',
      price: '$4,100',
      airlines: {
        logo: airlineLogo3.src,
        name: 'Korean Air',
      },
    },
  ]
}
export type TFlightListing = Awaited<ReturnType<typeof getFlightListings>>[number]

// get Filter Options
export async function getStayListingFilterOptions() {
  return [
    {
      label: 'Property type',
      name: 'propertyType',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Entire place',
          value: 'entire_place',
          description: 'Have a place to yourself',
          defaultChecked: true,
        },
        {
          name: 'Private room',
          value: 'private_room',
          description: 'Have your own room and share some common spaces',
          defaultChecked: true,
        },
        {
          name: 'Hotel room',
          value: 'hotel_room',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Shared room',
          value: 'shared_room',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Price range',
      name: 'priceRange',
      tabUIType: 'price-range',
      min: 0,
      max: 1000,
    },
    {
      label: 'Rooms & Beds',
      name: 'roomsAndBeds',
      tabUIType: 'select-number',
      options: [
        { name: 'Beds', max: 10 },
        { name: 'Bedrooms', max: 10 },
        { name: 'Bathrooms', max: 10 },
      ],
    },
    {
      label: 'Amenities',
      name: 'amenities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Kitchen',
          value: 'kitchen',
          description: 'Have a place to yourself',
          defaultChecked: true,
        },
        {
          name: 'Air conditioning',
          value: 'air_conditioning',
          description: 'Have your own room and share some common spaces',
          defaultChecked: true,
        },
        {
          name: 'Heating',
          value: 'heating',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Dryer',
          value: 'dryer',
          description: 'Stay in a shared space, like a common room',
        },
        {
          name: 'Washer',
          value: 'washer',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Facilities',
      name: 'facilities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Free parking on premise',
          value: 'free_parking_on_premise',
          description: 'Have a place to yourself',
        },
        {
          name: 'Hot tub',
          value: 'hot_tub',
          description: 'Have your own room and share some common spaces',
        },
        {
          name: 'Gym',
          value: 'gym',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Pool',
          value: 'pool',
          description: 'Stay in a shared space, like a common room',
        },
        {
          name: 'EV charger',
          value: 'ev_charger',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Property type',
      name: 'listingCategory',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'House',
          value: 'house',
          description: 'Have a place to yourself',
        },
        {
          name: 'Bed and breakfast',
          value: 'bed_and_breakfast',
          description: 'Have your own room and share some common spaces',
        },
        {
          name: 'Apartment',
          defaultChecked: true,
          value: 'apartment',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Boutique hotel',
          value: 'boutique_hotel',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Bungalow',
          value: 'bungalow',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Chalet',
          defaultChecked: true,
          value: 'chalet',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Condominium',
          defaultChecked: true,
          value: 'condominium',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Cottage',
          value: 'cottage',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Guest suite',
          value: 'guest_suite',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Guesthouse',
          value: 'guesthouse',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
      ],
    },
    {
      label: 'House rules',
      name: 'houseRules',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Pets allowed',
          value: 'pets_allowed',
          description: 'Have a place to yourself',
        },
        {
          name: 'Smoking allowed',
          value: 'smoking_allowed',
          description: 'Have your own room and share some common spaces',
        },
      ],
    },
  ]
}
export async function getExperienceListingFilterOptions() {
  return [
    {
      label: 'Exprience type',
      name: 'experienceType',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Food & drink',
          value: 'food_drink',
          description: 'Try local cooking classes, and more.',
          defaultChecked: true,
        },
        {
          name: 'Outdoor',
          value: 'outdoor',
          description: 'Explore nature, and outdoor activities.',
          defaultChecked: true,
        },
        {
          name: 'Arts & culture',
          value: 'arts_culture',
          description: 'Discover local art experiences.',
        },

        {
          name: 'Adventure',
          value: 'adventure',
          description: 'Experience thrilling activities.',
        },
      ],
    },
    {
      label: 'Price range',
      name: 'priceRange',
      tabUIType: 'price-range',
      min: 0,
      max: 1000,
    },
    {
      label: 'Duration',
      name: 'duration',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Less than 1 hour',
          value: 'less_than_1_hour',
          description: 'Experience activities that last less than 1 hour.',
          defaultChecked: true,
        },
        {
          name: '1-2 hours',
          value: '1_2_hours',
          description: 'Experience activities that last 1-2 hours.',
          defaultChecked: true,
        },
        {
          name: '2-4 hours',
          value: '2_4_hours',
          description: 'Experience activities that last 2-4 hours.',
        },
        {
          name: 'More than 4 hours',
          value: 'more_than_4_hours',
          description: 'Experience activities that last more than 4 hours.',
        },
      ],
    },
    {
      label: 'Time of day',
      name: 'timeOfDay',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Morning',
          value: 'morning',
          description: 'Experience activities in the morning.',
          defaultChecked: true,
        },
        {
          name: 'Afternoon',
          value: 'afternoon',
          description: 'Experience activities in the afternoon.',
          defaultChecked: true,
        },
        {
          name: 'Evening',
          value: 'evening',
          description: 'Experience activities in the evening.',
        },
        {
          name: 'Night',
          value: 'night',
          description: 'Experience activities at night.',
        },
      ],
    },
    {
      label: 'Amenities',
      name: 'amenities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Kitchen',
          value: 'kitchen',
          description: 'Have a place to yourself',
          defaultChecked: true,
        },
        {
          name: 'Air conditioning',
          value: 'air_conditioning',
          description: 'Have your own room and share some common spaces',
          defaultChecked: true,
        },
        {
          name: 'Heating',
          value: 'heating',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Dryer',
          value: 'dryer',
          description: 'Stay in a shared space, like a common room',
        },
        {
          name: 'Washer',
          value: 'washer',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Facilities',
      name: 'facilities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Free parking on premise',
          value: 'free_parking_on_premise',
          description: 'Have a place to yourself',
        },
        {
          name: 'Hot tub',
          value: 'hot_tub',
          description: 'Have your own room and share some common spaces',
        },
        {
          name: 'Gym',
          value: 'gym',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Pool',
          value: 'pool',
          description: 'Stay in a shared space, like a common room',
        },
        {
          name: 'EV charger',
          value: 'ev_charger',
          description: 'Stay in a shared space, like a common room',
        },
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
        {
          name: 'Entire place',
          value: 'entire_place',
          description: 'Have a place to yourself',
          defaultChecked: true,
        },
        {
          name: 'Private room',
          value: 'private_room',
          description: 'Have your own room and share some common spaces',
          defaultChecked: true,
        },
        {
          name: 'Hotel room',
          value: 'hotel_room',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Shared room',
          value: 'shared_room',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Price range',
      name: 'priceRange',
      tabUIType: 'price-range',
      min: 0,
      max: 1000,
    },
    {
      label: 'Rooms & Beds',
      name: 'roomsAndBeds',
      tabUIType: 'select-number',
      options: [
        { name: 'Beds', max: 10 },
        { name: 'Bedrooms', max: 10 },
        { name: 'Bathrooms', max: 10 },
      ],
    },
    {
      label: 'Amenities',
      name: 'amenities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Kitchen',
          value: 'kitchen',
          description: 'Have a place to yourself',
          defaultChecked: true,
        },
        {
          name: 'Air conditioning',
          value: 'air_conditioning',
          description: 'Have your own room and share some common spaces',
          defaultChecked: true,
        },
        {
          name: 'Heating',
          value: 'heating',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Dryer',
          value: 'dryer',
          description: 'Stay in a shared space, like a common room',
        },
        {
          name: 'Washer',
          value: 'washer',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Facilities',
      name: 'facilities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Free parking on premise',
          value: 'free_parking_on_premise',
          description: 'Have a place to yourself',
        },
        {
          name: 'Hot tub',
          value: 'hot_tub',
          description: 'Have your own room and share some common spaces',
        },
        {
          name: 'Gym',
          value: 'gym',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Pool',
          value: 'pool',
          description: 'Stay in a shared space, like a common room',
        },
        {
          name: 'EV charger',
          value: 'ev_charger',
          description: 'Stay in a shared space, like a common room',
        },
      ],
    },
    {
      label: 'Property type',
      name: 'propertyType',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'House',
          value: 'house',
          description: 'Have a place to yourself',
        },
        {
          name: 'Bed and breakfast',
          value: 'bed_and_breakfast',
          description: 'Have your own room and share some common spaces',
        },
        {
          name: 'Apartment',
          defaultChecked: true,
          value: 'apartment',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Boutique hotel',
          value: 'boutique_hotel',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Bungalow',
          value: 'bungalow',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Chalet',
          defaultChecked: true,
          value: 'chalet',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Condominium',
          defaultChecked: true,
          value: 'condominium',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Cottage',
          value: 'cottage',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Guest suite',
          value: 'guest_suite',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
        {
          name: 'Guesthouse',
          value: 'guesthouse',
          description: 'Have a private or shared room in a boutique hotel, hostel, and more',
        },
      ],
    },
    {
      label: 'House rules',
      name: 'houseRules',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Pets allowed',
          value: 'pets_allowed',
          description: 'Have a place to yourself',
        },
        {
          name: 'Smoking allowed',
          value: 'smoking_allowed',
          description: 'Have your own room and share some common spaces',
        },
      ],
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
        {
          name: 'Sedan',
          value: 'sedan',
          description: 'Comfortable and spacious for city driving.',
          defaultChecked: true,
        },
        {
          name: 'SUV',
          value: 'suv',
          description: 'Perfect for off-road adventures and family trips.',
          defaultChecked: true,
        },
        {
          name: 'Truck',
          value: 'truck',
          description: 'Ideal for heavy loads and rugged terrain.',
        },
        {
          name: 'Convertible',
          value: 'convertible',
          description: 'Enjoy the open air with a stylish ride.',
        },
      ],
    },
    {
      label: 'Price range',
      name: 'Price-range',
      tabUIType: 'price-range',
      min: 0,
      max: 1000,
    },
    {
      label: 'Fuel type',
      name: 'Fuel-type',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Petrol',
          value: 'petrol',
          description: 'Standard fuel type for most vehicles.',
          defaultChecked: true,
        },
        {
          name: 'Diesel',
          value: 'diesel',
          description: 'More fuel-efficient for long distances.',
          defaultChecked: true,
        },
        {
          name: 'Electric',
          value: 'electric',
          description: 'Eco-friendly and cost-effective.',
        },
        {
          name: 'Hybrid',
          value: 'hybrid',
          description: 'Combines petrol and electric for efficiency.',
        },
      ],
    },
    {
      label: 'Transmission type',
      name: 'Transmission-type',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Automatic',
          value: 'automatic',
          description: 'Easy to drive with no manual shifting.',
          defaultChecked: true,
        },
        {
          name: 'Manual',
          value: 'manual',
          description: 'For those who prefer more control.',
        },
      ],
    },
    {
      label: 'Amenities',
      name: 'Amenities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Air conditioning',
          value: 'air_conditioning',
          description: 'Stay cool during your drive.',
          defaultChecked: true,
        },
        {
          name: 'GPS',
          value: 'gps',
          description: 'Never get lost with built-in navigation.',
          defaultChecked: true,
        },
        {
          name: 'Bluetooth',
          value: 'bluetooth',
          description: 'Connect your devices for hands-free calls and music.',
        },
        {
          name: 'Sunroof',
          value: 'sunroof',
          description: 'Enjoy the sunshine and fresh air.',
        },
      ],
    },
  ]
}
export async function getFlightFilterOptions() {
  return [
    {
      label: 'Airlines',
      name: 'airlines',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Korean Air',
          value: 'korean_air',
          description: 'Flag carrier and largest airline of South Korea.',
          defaultChecked: true,
        },
        {
          name: 'Singapore Airlines',
          value: 'singapore_airlines',
          description: 'Flag carrier of Singapore, known for its service.',
          defaultChecked: true,
        },
        {
          name: 'Philippine Airlines',
          value: 'philippine_airlines',
          description: 'Flag carrier of the Philippines.',
        },
      ],
    },
    {
      label: 'Guests',
      name: 'guests',
      tabUIType: 'select-number',
      options: [
        { name: 'Adults', max: 10 },
        { name: 'Children', max: 10 },
        { name: 'Infants', max: 10 },
      ],
    },
    {
      label: 'Price range',
      name: 'priceRange',
      tabUIType: 'price-range',
      min: 0,
      max: 10000,
    },
    {
      label: 'Number of stops',
      name: 'numberOfStops',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Any number of stops',
          value: 'any_stops',
          description: 'Include flights with any number of stops.',
          defaultChecked: true,
        },
        {
          name: 'Non-stop',
          value: 'non_stop',
          description: 'Direct flights with no layovers.',
        },
        {
          name: '1 stop',
          value: '1_stop',
          description: 'Flights with one layover.',
        },
        {
          name: '2+ stops',
          value: '2_plus_stops',
          description: 'Flights with two or more layovers.',
        },
      ],
    },
    {
      label: 'Flight duration',
      name: 'flightDuration',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Less than 5 hours',
          value: 'less_than_5_hours',
          description: 'Short flights for quick trips.',
          defaultChecked: true,
        },
        {
          name: '5-10 hours',
          value: '5_10_hours',
          description: 'Medium-haul flights for regional travel.',
          defaultChecked: true,
        },
        {
          name: 'More than 10 hours',
          value: 'more_than_10_hours',
          description: 'Long-haul flights for international travel.',
        },
      ],
    },
    {
      label: 'Class type',
      name: 'classType',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'Economy Class',
          value: 'economy_class',
          description: 'Affordable and comfortable seating.',
          defaultChecked: true,
        },
        {
          name: 'Business Class',
          value: 'business_class',
          description: 'Premium seating with extra amenities.',
          defaultChecked: true,
        },
        {
          name: 'First Class',
          value: 'first_class',
          description: 'Luxury seating with top-notch service.',
        },
        {
          name: 'Premium Economy',
          value: 'premium_economy',
          description: 'Enhanced comfort and service in economy.',
        },
      ],
    },
    {
      label: 'Amenities',
      name: 'amenities',
      tabUIType: 'checkbox',
      options: [
        {
          name: 'In-flight entertainment',
          value: 'in_flight_entertainment',
          description: 'Enjoy movies, music, and games during your flight.',
          defaultChecked: true,
        },
        {
          name: 'Wi-Fi',
          value: 'wifi',
          description: 'Stay connected with in-flight Wi-Fi.',
          defaultChecked: true,
        },
        {
          name: 'Meal service',
          value: 'meal_service',
          description: 'Enjoy complimentary meals and snacks.',
        },
        {
          name: 'Extra legroom',
          value: 'extra_legroom',
          description: 'More space for a comfortable journey.',
        },
      ],
    },
  ]
}
