import ExperiencesCard from '@/components/ExperiencesCard'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import { ExperiencesSearchForm } from '@/components/HeroSearchForm/ExperiencesSearchForm'
import ListingFilterTabs from '@/components/ListingFilterTabs'
import SectionSliderCards from '@/components/SectionSliderCards'
import { getExperienceCategoryByHandle } from '@/data/categories'
import { getExperienceListingFilterOptions, getExperienceListings } from '@/data/listings'
import { getServerT } from '@/lib/locale-server'
import { Button } from '@/shared/Button'
import { Divider } from '@/shared/divider'
import { Heading } from '@/shared/Heading'
import PaginationComponent from '@/shared/Pagination'
import convertNumbThousand from '@/utils/convertNumbThousand'
import { HotAirBalloonIcon, MapPinpoint02Icon, MapsLocation01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

const ITEMS_PER_PAGE = 8

const TYPE_TO_CATEGORY: Record<string, string[]> = {
  food_drink: ['Gastronomía'],
  outdoor: ['Aventura y Naturaleza'],
  arts_culture: ['Arte y Artesanía'],
  history: ['Tour Cultural'],
  music_dance: ['Música y Baile'],
  wellness: ['Bienestar'],
}

export async function generateMetadata({ params }: { params: Promise<{ handle?: string[] }> }): Promise<Metadata> {
  const { handle } = await params
  const category = await getExperienceCategoryByHandle(handle?.[0])
  if (!category) {
    return {
      title: 'Collection not found',
      description: 'The collection you are looking for does not exist.',
    }
  }
  const { name, description } = category
  return { title: name, description }
}

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ handle?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { handle } = await params
  const sp = await searchParams

  const t = await getServerT()
  const category = await getExperienceCategoryByHandle(handle?.[0])
  const allListings = await getExperienceListings()
  const filterOptions = await getExperienceListingFilterOptions(t.experienceFilters)

  if (!category?.id) {
    return redirect('/experience-categories/all')
  }

  // Parse active filters from URL (values like 'food_drink', 'outdoor', etc.)
  const activeTypes = (sp.experienceType as string | undefined)?.split(',').filter(Boolean) ?? []
  const page = Math.max(1, Number(sp.page) || 1)

  // Filter listings
  let filteredListings = allListings
  if (activeTypes.length > 0) {
    filteredListings = allListings.filter((listing) =>
      activeTypes.some((type) => (TYPE_TO_CATEGORY[type] ?? []).includes(listing.listingCategory))
    )
  }

  const totalListings = filteredListings.length
  const totalPages = Math.max(1, Math.ceil(totalListings / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Augment filterOptions so checkboxes reflect current URL state
  const augmentedFilterOptions: any[] = filterOptions.map((fo) => {
    if (!fo || fo.tabUIType !== 'checkbox' || fo.name !== 'experienceType') return fo
    return {
      ...fo,
      options: (fo as any).options?.map((opt: any) => ({
        ...opt,
        defaultChecked: activeTypes.includes(opt.value ?? opt.name),
      })) ?? [],
    }
  })

  const translatedName = category.handle === 'all' ? t.experienceFilters.allExperiences : category.name
  const translatedRegion = t.experienceFilters.inDominicanRepublic

  return (
    <div className="pb-28">
      {/* Hero section */}
      <div className="container">
        <HeroSectionWithSearchForm1
          heading={translatedName}
          image={category.coverImage}
          imageAlt={translatedName}
          searchForm={<ExperiencesSearchForm formStyle="default" />}
          description={
            <div className="flex items-center sm:text-lg">
              <HugeiconsIcon icon={MapPinpoint02Icon} size={20} color="currentColor" strokeWidth={1.5} />
              <span className="ms-2.5">{translatedRegion} </span>
              <span className="mx-5"></span>
              <HugeiconsIcon icon={HotAirBalloonIcon} size={20} color="currentColor" strokeWidth={1.5} />
              <span className="ms-2.5">{convertNumbThousand(allListings.length)} {allListings.length !== 1 ? t.experienceFilters.experiences : t.experienceFilters.experience}</span>
            </div>
          }
        />
      </div>

      <div className="relative container mt-14 lg:mt-24">
        {/* start heading */}
        <div className="flex flex-wrap items-end justify-between gap-x-2.5 gap-y-5">
          <h2 id="heading" className="scroll-mt-20 text-lg font-semibold sm:text-xl">
            {activeTypes.length > 0
              ? `${totalListings} ${totalListings !== 1 ? t.experienceFilters.experiencesFound : t.experienceFilters.experienceFound}`
              : `${convertNumbThousand(totalListings)} ${totalListings !== 1 ? t.experienceFilters.experiences : t.experienceFilters.experience}${category.handle !== 'all' ? ` ${t.experienceFilters.inLocation} ${category.name}` : ''}`
            }
          </h2>
          <Button color="white" className="ms-auto" href={'/experience-categories-map/' + category.handle}>
            <span className="me-1">{t.experienceFilters.showMap}</span>
            <HugeiconsIcon icon={MapsLocation01Icon} size={20} color="currentColor" strokeWidth={1.5} />
          </Button>
        </div>
        <Divider className="my-8 md:mb-12" />
        {/* end heading */}
        <ListingFilterTabs filterOptions={augmentedFilterOptions} />

        {paginatedListings.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedListings.map((listing) => (
              <ExperiencesCard key={listing.id} data={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-16 py-20 text-center text-neutral-500">
            {t.experienceFilters.noExperiences}
          </div>
        )}

        <div className="mt-16 flex items-center justify-center">
          <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
        </div>

        <Divider className="my-14 lg:my-24" />
        <Heading className="mb-12">{t.homePage.featuredExperiences}</Heading>
        <SectionSliderCards listings={allListings.slice(0, 8)} cardType="experience" />
      </div>
    </div>
  )
}

export default Page
