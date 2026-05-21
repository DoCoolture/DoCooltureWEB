import experienceCategoryCoverImage from '@/images/hero-right-experience.png'
import { getExperienceListings } from '@/data/listings'

const CITY_CATALOG = [
  {
    id: 'experience://dr-1',
    name: 'Punta Cana',
    handle: 'punta-cana',
    description: 'Más allá de los resorts, descubre la cultura y naturaleza de Punta Cana.',
    thumbnail: '/images/cities/punta-cana.jpg',
  },
  {
    id: 'experience://dr-2',
    name: 'Santo Domingo',
    handle: 'santo-domingo',
    description: 'Explora la primera ciudad del Nuevo Mundo y su rica historia colonial.',
    thumbnail: '/images/cities/santo-domingo.jpg',
  },
  {
    id: 'experience://dr-3',
    name: 'Santiago',
    handle: 'santiago',
    description: 'La capital del Cibao, tierra del merengue y la cultura dominicana auténtica.',
    thumbnail: '/images/cities/santiago.jpg',
  },
  {
    id: 'experience://dr-4',
    name: 'Puerto Plata',
    handle: 'puerto-plata',
    description: 'Playas del Atlántico, teleférico y cultura ámbar.',
    thumbnail: '/images/cities/puerto-plata.jpg',
  },
  {
    id: 'experience://dr-5',
    name: 'Samaná',
    handle: 'samana',
    description: 'Naturaleza salvaje, ballenas jorobadas y cascadas escondidas.',
    thumbnail: '/images/cities/samana.jpg',
  },
  {
    id: 'experience://dr-6',
    name: 'Las Terrenas',
    handle: 'las-terrenas',
    description: 'Playas paradisíacas, cocina internacional y vida bohemia en la península de Samaná.',
    thumbnail: '/images/cities/las-terrenas.jpg',
  },
  {
    id: 'experience://dr-7',
    name: 'La Romana',
    handle: 'la-romana',
    description: 'Arte, artesanía y la famosa Altos de Chavón.',
    thumbnail: '/images/cities/la-romana.jpg',
  },
  {
    id: 'experience://dr-8',
    name: 'Jarabacoa',
    handle: 'jarabacoa',
    description: 'Aventura en la montaña, rafting y el frescor del Cibao.',
    thumbnail: '/images/cities/jarabacoa.jpg',
  },
  {
    id: 'experience://dr-9',
    name: 'Constanza',
    handle: 'constanza',
    description: 'El Valle Encantado, naturaleza única y gastronomía de altura.',
    thumbnail: '/images/cities/constanza.jpg',
  },
  {
    id: 'experience://dr-10',
    name: 'Barahona',
    handle: 'barahona',
    description: 'Ecoturismo puro, playas de piedras negras y el Lago Enriquillo.',
    thumbnail: '/images/cities/barahona.jpg',
  },
  {
    id: 'experience://dr-11',
    name: 'Bávaro',
    handle: 'bavaro',
    description: 'El corazón del turismo del este, arrecifes de coral y actividades acuáticas.',
    thumbnail: '/images/cities/bavaro.jpg',
  },
  {
    id: 'experience://dr-12',
    name: 'Cabarete',
    handle: 'cabarete',
    description: 'Capital mundial del kitesurf, surf y la vida de playa relajada.',
    thumbnail: '/images/cities/cabarete.jpg',
  },
  {
    id: 'experience://dr-13',
    name: 'Sosúa',
    handle: 'sosua',
    description: 'Bahía cristalina, buceo espectacular y vibrante vida nocturna.',
    thumbnail: '/images/cities/sosua.jpg',
  },
  {
    id: 'experience://dr-14',
    name: 'Boca Chica',
    handle: 'boca-chica',
    description: 'La playa más cercana a Santo Domingo, aguas tranquilas y ambiente festivo.',
    thumbnail: '/images/cities/boca-chica.jpg',
  },
  {
    id: 'experience://dr-15',
    name: 'Juan Dolio',
    handle: 'juan-dolio',
    description: 'Playa tranquila al este de la capital, ideal para escapadas de fin de semana.',
    thumbnail: '/images/cities/juan-dolio.jpg',
  },
  {
    id: 'experience://dr-16',
    name: 'La Vega',
    handle: 'la-vega',
    description: 'Cuna del carnaval dominicano, tradición, fe y folclor en el corazón del Cibao.',
    thumbnail: '/images/cities/la-vega.jpg',
  },
  {
    id: 'experience://dr-17',
    name: 'Higüey',
    handle: 'higuey',
    description: 'Ciudad de la fe, hogar de la Basílica de Nuestra Señora de la Altagracia.',
    thumbnail: '/images/cities/higuey.jpg',
  },
  {
    id: 'experience://dr-18',
    name: 'Nagua',
    handle: 'nagua',
    description: 'Playas vírgenes del Atlántico norte y vida costera auténtica.',
    thumbnail: '/images/cities/nagua.jpg',
  },
  {
    id: 'experience://dr-19',
    name: 'Río San Juan',
    handle: 'rio-san-juan',
    description: 'Laguna Gri-Gri, manglares, delfines y el encanto del litoral norte.',
    thumbnail: '/images/cities/rio-san-juan.jpg',
  },
  {
    id: 'experience://dr-20',
    name: 'Miches',
    handle: 'miches',
    description: 'Destino emergente de lujo sostenible con playas prístinas y naturaleza intacta.',
    thumbnail: '/images/cities/miches.jpg',
  },
  {
    id: 'experience://dr-21',
    name: 'Pedernales',
    handle: 'pedernales',
    description: 'El sur más extremo: Parque Nacional Jaragua, Bahía de las Águilas y aventura pura.',
    thumbnail: '/images/cities/pedernales.jpg',
  },
  {
    id: 'experience://dr-22',
    name: 'Monte Cristi',
    handle: 'monte-cristi',
    description: 'Parque Nacional, arrecifes de coral y el desierto que llega al mar.',
    thumbnail: '/images/cities/monte-cristi.jpg',
  },
  {
    id: 'experience://dr-23',
    name: 'Neyba',
    handle: 'neyba',
    description: 'Uvas, vinos artesanales y el Lago Enriquillo junto a la frontera.',
    thumbnail: '/images/cities/neyba.jpg',
  },
  {
    id: 'experience://dr-24',
    name: 'San Pedro de Macorís',
    handle: 'san-pedro-de-macoris',
    description: 'La cuna del béisbol dominicano y de grandes ligas del mundo.',
    thumbnail: '/images/cities/san-pedro-de-macoris.jpg',
  },
  {
    id: 'experience://dr-25',
    name: 'San Francisco de Macorís',
    handle: 'san-francisco-de-macoris',
    description: 'Capital del cacao dominicano y puerta de entrada al Cibao profundo.',
    thumbnail: '/images/cities/san-francisco-de-macoris.jpg',
  },
  {
    id: 'experience://dr-26',
    name: 'Moca',
    handle: 'moca',
    description: 'Tejidos artesanales, historia y los mejores chenchenes del Cibao.',
    thumbnail: '/images/cities/moca.jpg',
  },
  {
    id: 'experience://dr-27',
    name: 'Bonao',
    handle: 'bonao',
    description: 'Naturaleza, minería y el corazón verde del Valle del Cibao.',
    thumbnail: '/images/cities/bonao.jpg',
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
