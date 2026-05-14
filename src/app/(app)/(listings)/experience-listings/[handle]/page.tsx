import { getExperienceReviews } from '@/data/reviews'
import { getExperienceListingByHandle } from '@/data/listings'
import { getServerT } from '@/lib/locale-server'
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
  const [listing, t] = await Promise.all([getExperienceListingByHandle(handle), getServerT()])
  const el = t.experienceListing
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

  const reviews = await getExperienceReviews(listing.id)

  // For the hardcoded experience, use translated description and host bio
  const isHardcoded = handle === 'taste-of-dominican-culture'
  const resolvedDescription = isHardcoded ? el.tasteDescription : description
  const resolvedHost = isHardcoded
    ? { ...host, description: el.hostBio, responseTime: el.hostResponseTime, joinedDate: el.hostJoinedDate }
    : host

  // Translate category using the categoryMap (Spanish DB value → locale label)
  const categoryMap = el.categoryMap as Record<string, string>
  const translatedCategory = categoryMap[listingCategory] ?? listingCategory

  // Translate date for hardcoded listing
  const resolvedDate = date === 'weekendsAvailable' ? el.weekendsAvailable : date

  // Translate duration and languages for hardcoded listing
  const resolvedDuration = isHardcoded ? el.durationTime : durationTime
  const languageNames = el.languageNames as Record<string, string>
  const translatedLanguages = languages.map((l) => languageNames[l] ?? l)

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
      rating: String(reviewStart ?? 0),
      reviewCount: String(reviewCount ?? 0),
      experienceId: listing.id,
      hostId: host.handle,
    })

    redirect(`/checkout?${params.toString()}`)
  }

  const renderSectionHeader = () => {
    return (
      <SectionHeader
        address={address}
        host={host}
        listingCategory={translatedCategory}
        reviewCount={reviewCount}
        reviewStart={reviewStart}
        title={title}
      >
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <ClockIcon className="h-6 w-6" />
          <span>{resolvedDuration}</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <UsersIcon className="h-6 w-6" />
          <span>{el.upToGuests.replace('{n}', String(maxGuests))}</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <LanguageIcon className="h-6 w-6" />
          <span>{translatedLanguages.length > 0 ? translatedLanguages.join(', ') : el.languageNotSpecified}</span>
        </div>
      </SectionHeader>
    )
  }

  const renderSectionInfo = () => {
    return (
      <div className="listingSection__wrap">
        <SectionHeading>{el.experienceDescription}</SectionHeading>
        <Divider className="w-14!" />
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {resolvedDescription}
        </p>
      </div>
    )
  }

  const renderSectionIncludes = () => {
    const includes = [el.include1, el.include2, el.include3, el.include4]
    const notIncludes = [el.notInclude1, el.notInclude2]

    return (
      <div className="listingSection__wrap">
        <SectionHeading>{el.whatIncluded}</SectionHeading>
        <Divider className="w-14!" />
        <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 lg:grid-cols-2 dark:text-neutral-300">
          {includes.map((item) => (
            <div key={item} className="flex items-center gap-x-3">
              <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {el.notIncluded}
          </p>
          <div className="grid grid-cols-1 gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            {notIncludes.map((item) => (
              <div key={item} className="flex items-center gap-x-3">
                <span className="text-neutral-400">✕</span>
                <span>{item}</span>
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
              date={resolvedDate}
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
            <SectionHost {...resolvedHost} />
          </div>
          <div className="w-full lg:w-2/3">
            <SectionListingReviews
              reviewCount={reviewCount}
              reviewStart={reviewStart}
              reviews={reviews}
              experienceId={listing.id}
            />
          </div>
        </div>
        <SectionMap lat={map?.lat} lng={map?.lng} address={address} />
      </div>
    </div>
  )
}

export default Page
