import { getListingReviews } from '@/data/data'
import { getExperienceListingByHandle } from '@/data/listings'
import { Divider } from '@/shared/divider'
import { CheckCircleIcon, ClockIcon, LanguageIcon, UsersIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import HeaderGallery from '../../components/HeaderGallery'
import SectionDateRange from '../../components/SectionDateRange'
import SectionHeader from '../../components/SectionHeader'
import { SectionHeading } from '../../components/SectionHeading'
import SectionHost from '../../components/SectionHost'
import SectionListingReviews from '../../components/SectionListingReviews'
import SectionMap from '../../components/SectionMap'
import { ExperienceBookingSidebar } from './ExperienceBookingSidebar'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const listing = await getExperienceListingByHandle(handle)

  if (!listing) {
    return {
      title: 'Experiencia no encontrada',
      description: 'La experiencia que buscas no existe.',
    }
  }

  return {
    title: listing?.title,
    description: listing?.description,
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const listing = await getExperienceListingByHandle(handle)
  if (!listing?.id) {
    return redirect('/experience-categories/all')
  }

  const {
    address,
    date,
    description,
    featuredImage,
    galleryImgs,
    isAds,
    like,
    listingCategory,
    map,
    maxGuests,
    price,
    reviewCount,
    reviewStart,
    saleOff,
    title,
    host,
    durationTime,
    languages,
  } = listing

  const reviews = (await getListingReviews(handle)).slice(0, 3)

  // ✅ Server action — pasa todos los datos de la experiencia al checkout
  const handleSubmitForm = async (formData: FormData) => {
    'use server'

    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const guestAdults = formData.get('guestAdults') as string
    const guestChildren = formData.get('guestChildren') as string
    const guestInfants = formData.get('guestInfants') as string

    const totalExplorers =
      (Number(guestAdults) || 1) + (Number(guestChildren) || 0)

    // Construye la URL del checkout con todos los datos de la experiencia
    const params = new URLSearchParams({
      titulo: title,
      ubicacion: address,
      duracion: durationTime,
      precio: price,
      imagen: featuredImage,
      anfitrion: host.displayName,
      explorers: String(totalExplorers),
      startDate: startDate || '',
      endDate: endDate || '',
    })

    redirect(`/checkout?${params.toString()}`)
  }

  const renderSectionHeader = () => {
    return (
      <SectionHeader
        address={address}
        host={host}
        listingCategory={listingCategory}
        reviewCount={reviewCount}
        reviewStart={reviewStart}
        title={title}
      >
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <ClockIcon className="h-6 w-6" />
          <span>{durationTime}</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <UsersIcon className="h-6 w-6" />
          <span>Hasta {maxGuests} personas</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <LanguageIcon className="h-6 w-6" />
          <span>{languages.length > 0 ? languages.join(', ') : 'Idioma no especificado'}</span>
        </div>
      </SectionHeader>
    )
  }

  const renderSectionInfo = () => {
    return (
      <div className="listingSection__wrap">
        <SectionHeading>Descripción de la experiencia</SectionHeading>
        <Divider className="w-14!" />
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {description}
        </p>
      </div>
    )
  }

  const renderSectionIncludes = () => {
    // ✅ Incluidos reales de DoCoolture
    const includes = [
      { name: 'Guía cultural bilingüe (español / inglés)' },
      { name: 'Todas las degustaciones' },
      { name: 'Bebidas tradicionales' },
      { name: 'Impuestos locales' },
    ]

    const notIncludes = [
      { name: 'Transporte hacia/desde el punto de encuentro' },
      { name: 'Consumos adicionales no especificados' },
    ]

    return (
      <div className="listingSection__wrap">
        <SectionHeading>¿Qué incluye?</SectionHeading>
        <Divider className="w-14!" />
        <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 lg:grid-cols-2 dark:text-neutral-300">
          {includes.map((item) => (
            <div key={item.name} className="flex items-center gap-x-3">
              <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            No incluye:
          </p>
          <div className="grid grid-cols-1 gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            {notIncludes.map((item) => (
              <div key={item.name} className="flex items-center gap-x-3">
                <span className="text-neutral-400">✕</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* GALERÍA */}
      <HeaderGallery gridType="grid4" images={galleryImgs} />

      {/* MAIN */}
      <main className="relative z-1 mt-10 flex flex-col gap-8 lg:flex-row xl:gap-10">
        {/* CONTENIDO */}
        <div className="flex w-full flex-col gap-y-8 lg:w-3/5 xl:w-[64%] xl:gap-y-10">
          {renderSectionHeader()}
          {renderSectionInfo()}
          {renderSectionIncludes()}
          <SectionDateRange />
        </div>

        {/* SIDEBAR */}
        <div className="grow">
          <div className="sticky top-5">
            <ExperienceBookingSidebar
              price={price}
              maxGuests={maxGuests}
              date={date}
              reviewStart={reviewStart}
              reviewCount={reviewCount}
              action={handleSubmitForm}
            />
          </div>
        </div>
      </main>

      <Divider className="my-16" />

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:w-4/9 xl:w-1/3">
            <SectionHost {...host} />
          </div>
          <div className="w-full lg:w-2/3">
            <SectionListingReviews
              reviewCount={reviewCount}
              reviewStart={reviewStart}
              reviews={reviews}
            />
          </div>
        </div>
        <SectionMap />
      </div>
    </div>
  )
}

export default Page
