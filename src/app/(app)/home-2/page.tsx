// OCULTO - Página home-2 original de Chisfis
// Esta página usaba getStayCategories() y getStayListings()
// que fueron desactivados en DoCoolture.
// Se redirige al home de experiencias para evitar errores en el build.
//
// import BackgroundSection from '@/components/BackgroundSection'
// import BgGlassmorphism from '@/components/BgGlassmorphism'
// import CardCategory6 from '@/components/CardCategory6'
// import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
// import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
// import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
// import SectionSubscribe2 from '@/components/SectionSubscribe2'
// import { getAuthors } from '@/data/authors'
// import { getStayCategories } from '@/data/categories'
// import { getStayListings } from '@/data/listings'
// import ButtonPrimary from '@/shared/ButtonPrimary'
// import HeadingWithSub from '@/shared/Heading'
// import { Metadata } from 'next'
// import Image from 'next/image'
//
// export const metadata: Metadata = {
//   title: 'Home 2',
//   description: 'Booking online & rental online Next.js Template',
// }
//
// const SectionHero = () => { ... }
//
// async function Home() {
//   const authors = await getAuthors()
//   const categories = await getStayCategories()
//   const categories_1 = categories.slice(0, 8)
//   const categories_2 = categories.slice(7, 14)
//   const stayListings = await getStayListings()
//   ...
// }

// ✅ DOCOOLTURE - Redirige al home de experiencias
import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/experience')
}