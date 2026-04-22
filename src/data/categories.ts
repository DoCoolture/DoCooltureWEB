import stayCategoryCoverImage from '@/images/hero-right-2.png'
import carCategoryCoverImage from '@/images/hero-right-car.png'
import experienceCategoryCoverImage from '@/images/hero-right-experience.png'
import filghtCategoryCoverImage from '@/images/hero-right-flight.png'
import realEstateCategoryCoverImage from '@/images/hero-right-real-estate.png'

// ✅ DOCOOLTURE - Ciudades dominicanas como destinos piloto
export async function getExperienceCategories() {
  return [
    {
      id: 'experience://dr-1',
      name: 'Punta Cana',
      handle: 'punta-cana',
      region: 'República Dominicana',
      href: '/experience-categories/punta-cana',
      description: 'Más allá de los resorts, descubre la cultura y naturaleza de Punta Cana.',
      count: 48,
      thumbnail: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-2',
      name: 'Santo Domingo',
      handle: 'santo-domingo',
      region: 'República Dominicana',
      href: '/experience-categories/santo-domingo',
      description: 'Explora la primera ciudad del Nuevo Mundo y su rica historia colonial.',
      count: 65,
      thumbnail: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-3',
      name: 'Santiago',
      handle: 'santiago',
      region: 'República Dominicana',
      href: '/experience-categories/santiago',
      description: 'La capital del Cibao, tierra del merengue y la cultura dominicana auténtica.',
      count: 32,
      thumbnail: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-4',
      name: 'Puerto Plata',
      handle: 'puerto-plata',
      region: 'República Dominicana',
      href: '/experience-categories/puerto-plata',
      description: 'Playas del Atlántico, teleférico y cultura ámbar.',
      count: 27,
      thumbnail: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-5',
      name: 'Samaná',
      handle: 'samana',
      region: 'República Dominicana',
      href: '/experience-categories/samana',
      description: 'Naturaleza salvaje, ballenas jorobadas y cascadas escondidas.',
      count: 21,
      thumbnail: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-6',
      name: 'La Romana',
      handle: 'la-romana',
      region: 'República Dominicana',
      href: '/experience-categories/la-romana',
      description: 'Arte, artesanía y la famosa Altos de Chavón.',
      count: 19,
      thumbnail: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-7',
      name: 'Jarabacoa',
      handle: 'jarabacoa',
      region: 'República Dominicana',
      href: '/experience-categories/jarabacoa',
      description: 'Aventura en la montaña, rafting y el frescor del Cibao.',
      count: 15,
      thumbnail: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
    {
      id: 'experience://dr-8',
      name: 'Constanza',
      handle: 'constanza',
      region: 'República Dominicana',
      href: '/experience-categories/constanza',
      description: 'El Valle Encantado, naturaleza única y gastronomía de altura.',
      count: 12,
      thumbnail: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    },
  ]
}

export async function getExperienceCategoryByHandle(handle?: string) {
  handle = handle?.toLowerCase()
  if (!handle || handle === 'all') {
    return {
      id: 'experience://all',
      name: 'Todas las experiencias',
      handle: 'all',
      region: 'República Dominicana',
      href: '/experience-categories/all',
      description: 'Descubre experiencias auténticas en toda la República Dominicana.',
      count: 239,
      thumbnail: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1600',
      coverImage: {
        src: experienceCategoryCoverImage.src,
        width: experienceCategoryCoverImage.width,
        height: experienceCategoryCoverImage.height,
      },
    }
  }
  const categories = await getExperienceCategories()
  return categories.find((category) => category.handle === handle)
}

// ============================================================
// OCULTO - Categorías originales de Chisfis (no se usan en DoCoolture)
// ============================================================
// export async function getStayCategories() { ... }
// export async function getStayCategoryByHandle() { ... }
// export async function getRealEstateCategories() { ... }
// export async function getRealEstateCategoryByHandle() { ... }
// export async function getCarCategories() { ... }
// export async function getCarCategoryByHandle() { ... }
// export async function getFlightCategories() { ... }
// export async function getFlightCategoryByHandle() { ... }

// MANTENEMOS las funciones vacías para no romper imports existentes
export async function getStayCategories() { return [] }
export async function getStayCategoryByHandle(handle?: string) { return undefined }
export async function getRealEstateCategories() { return [] }
export async function getRealEstateCategoryByHandle(handle?: string) { return undefined }
export async function getCarCategories() { return [] }
export async function getCarCategoryByHandle(handle?: string) { return undefined }
export async function getFlightCategories() { return [] }
export async function getFlightCategoryByHandle(handle?: string) { return undefined }

// types
export type TStayCategory = Awaited<ReturnType<typeof getStayCategories>>[number]
export type TExperienceCategory = Awaited<ReturnType<typeof getExperienceCategories>>[number]
export type TCarCategory = Awaited<ReturnType<typeof getCarCategories>>[number]
export type TRealEstateCategory = Awaited<ReturnType<typeof getRealEstateCategories>>[number]
export type TFlightCategory = Awaited<ReturnType<typeof getFlightCategories>>[number]
export type TCategory = TStayCategory | TExperienceCategory | TCarCategory | TRealEstateCategory | TFlightCategory
