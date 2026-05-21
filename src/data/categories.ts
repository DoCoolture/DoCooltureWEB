import experienceCategoryCoverImage from '@/images/hero-right-experience.png'
import { getExperienceListings } from '@/data/listings'

const CITY_CATALOG = [
  {
    id: 'experience://dr-1',
    name: 'Punta Cana',
    handle: 'punta-cana',
    description: 'Más allá de los resorts, descubre la cultura y naturaleza de Punta Cana.',
    thumbnail: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-2',
    name: 'Santo Domingo',
    handle: 'santo-domingo',
    description: 'Explora la primera ciudad del Nuevo Mundo y su rica historia colonial.',
    thumbnail: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-3',
    name: 'Santiago',
    handle: 'santiago',
    description: 'La capital del Cibao, tierra del merengue y la cultura dominicana auténtica.',
    thumbnail: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-4',
    name: 'Puerto Plata',
    handle: 'puerto-plata',
    description: 'Playas del Atlántico, teleférico y cultura ámbar.',
    thumbnail: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-5',
    name: 'Samaná',
    handle: 'samana',
    description: 'Naturaleza salvaje, ballenas jorobadas y cascadas escondidas.',
    thumbnail: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-6',
    name: 'Las Terrenas',
    handle: 'las-terrenas',
    description: 'Playas paradisíacas, cocina internacional y vida bohemia en la península de Samaná.',
    thumbnail: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-7',
    name: 'La Romana',
    handle: 'la-romana',
    description: 'Arte, artesanía y la famosa Altos de Chavón.',
    thumbnail: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-8',
    name: 'Jarabacoa',
    handle: 'jarabacoa',
    description: 'Aventura en la montaña, rafting y el frescor del Cibao.',
    thumbnail: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-9',
    name: 'Constanza',
    handle: 'constanza',
    description: 'El Valle Encantado, naturaleza única y gastronomía de altura.',
    thumbnail: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-10',
    name: 'Barahona',
    handle: 'barahona',
    description: 'Ecoturismo puro, playas de piedras negras y el Lago Enriquillo.',
    thumbnail: 'https://images.pexels.com/photos/3224186/pexels-photo-3224186.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-11',
    name: 'Bávaro',
    handle: 'bavaro',
    description: 'El corazón del turismo del este, arrecifes de coral y actividades acuáticas.',
    thumbnail: 'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-12',
    name: 'Cabarete',
    handle: 'cabarete',
    description: 'Capital mundial del kitesurf, surf y la vida de playa relajada.',
    thumbnail: 'https://images.pexels.com/photos/1654489/pexels-photo-1654489.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-13',
    name: 'Sosúa',
    handle: 'sosua',
    description: 'Bahía cristalina, buceo espectacular y vibrante vida nocturna.',
    thumbnail: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-14',
    name: 'Boca Chica',
    handle: 'boca-chica',
    description: 'La playa más cercana a Santo Domingo, aguas tranquilas y ambiente festivo.',
    thumbnail: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-15',
    name: 'Juan Dolio',
    handle: 'juan-dolio',
    description: 'Playa tranquila al este de la capital, ideal para escapadas de fin de semana.',
    thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-16',
    name: 'La Vega',
    handle: 'la-vega',
    description: 'Cuna del carnaval dominicano, tradición, fe y folclor en el corazón del Cibao.',
    thumbnail: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-17',
    name: 'Higüey',
    handle: 'higuey',
    description: 'Ciudad de la fe, hogar de la Basílica de Nuestra Señora de la Altagracia.',
    thumbnail: 'https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-18',
    name: 'Nagua',
    handle: 'nagua',
    description: 'Playas vírgenes del Atlántico norte y vida costera auténtica.',
    thumbnail: 'https://images.pexels.com/photos/1223648/pexels-photo-1223648.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-19',
    name: 'Río San Juan',
    handle: 'rio-san-juan',
    description: 'Laguna Gri-Gri, manglares, delfines y el encanto del litoral norte.',
    thumbnail: 'https://images.pexels.com/photos/1876285/pexels-photo-1876285.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-20',
    name: 'Miches',
    handle: 'miches',
    description: 'Destino emergente de lujo sostenible con playas prístinas y naturaleza intacta.',
    thumbnail: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-21',
    name: 'Pedernales',
    handle: 'pedernales',
    description: 'El sur más extremo: Parque Nacional Jaragua, Bahía de las Águilas y aventura pura.',
    thumbnail: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-22',
    name: 'Monte Cristi',
    handle: 'monte-cristi',
    description: 'Parque Nacional, arrecifes de coral y el desierto que llega al mar.',
    thumbnail: 'https://images.pexels.com/photos/3490353/pexels-photo-3490353.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-23',
    name: 'Neyba',
    handle: 'neyba',
    description: 'Uvas, vinos artesanales y el Lago Enriquillo junto a la frontera.',
    thumbnail: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-24',
    name: 'San Pedro de Macorís',
    handle: 'san-pedro-de-macoris',
    description: 'La cuna del béisbol dominicano y de grandes ligas del mundo.',
    thumbnail: 'https://images.pexels.com/photos/1308713/pexels-photo-1308713.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-25',
    name: 'San Francisco de Macorís',
    handle: 'san-francisco-de-macoris',
    description: 'Capital del cacao dominicano y puerta de entrada al Cibao profundo.',
    thumbnail: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-26',
    name: 'Moca',
    handle: 'moca',
    description: 'Tejidos artesanales, historia y los mejores chenchenes del Cibao.',
    thumbnail: 'https://images.pexels.com/photos/3889827/pexels-photo-3889827.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'experience://dr-27',
    name: 'Bonao',
    handle: 'bonao',
    description: 'Naturaleza, minería y el corazón verde del Valle del Cibao.',
    thumbnail: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
]

const coverImage = {
  src: experienceCategoryCoverImage.src,
  width: experienceCategoryCoverImage.width,
  height: experienceCategoryCoverImage.height,
}

export async function getExperienceCategories() {
  const listings = await getExperienceListings()

  return CITY_CATALOG
    .map((city) => {
      const nameNormalized = city.name.toLowerCase()
      const count = listings.filter((l) =>
        l.address.toLowerCase().includes(nameNormalized)
      ).length
      return {
        ...city,
        region: 'República Dominicana',
        href: `/experience-categories/${city.handle}`,
        count,
        coverImage,
      }
    })
    .filter((city) => city.count > 0)
}

export async function getAllExperienceDestinations() {
  const listings = await getExperienceListings()

  return CITY_CATALOG.map((city) => {
    const nameNormalized = city.name.toLowerCase()
    const count = listings.filter((l) =>
      l.address.toLowerCase().includes(nameNormalized)
    ).length
    return {
      ...city,
      region: 'República Dominicana',
      href: `/experience-categories/${city.handle}`,
      count,
      coverImage,
    }
  })
}

export async function getExperienceCategoryByHandle(handle?: string) {
  handle = handle?.toLowerCase()
  if (!handle || handle === 'all') {
    const categories = await getExperienceCategories()
    const totalCount = categories.reduce((sum, c) => sum + c.count, 0)
    return {
      id: 'experience://all',
      name: 'Todas las experiencias',
      handle: 'all',
      region: 'República Dominicana',
      href: '/experience-categories/all',
      description: 'Descubre experiencias auténticas en toda la República Dominicana.',
      count: totalCount,
      thumbnail: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage,
    }
  }
  const categories = await getExperienceCategories()
  return categories.find((category) => category.handle === handle)
}

export type TExperienceCategory = Awaited<ReturnType<typeof getExperienceCategories>>[number]
export type TCategory = TExperienceCategory
