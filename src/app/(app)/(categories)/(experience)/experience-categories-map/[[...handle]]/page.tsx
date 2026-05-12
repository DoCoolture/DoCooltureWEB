import { getExperienceCategoryByHandle } from '@/data/categories'
import { getExperienceListingFilterOptions, getExperienceListings } from '@/data/listings'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SectionGridHasMap from './SectionGridHasMap'

const ITEMS_PER_PAGE = 8

const TYPE_TO_CATEGORY: Record<string, string[]> = {
  'Gastronomía': ['Gastronomía'],
  'Naturaleza y aventura': ['Aventura y Naturaleza'],
  'Arte y cultura': ['Arte y Artesanía'],
  'Tours históricos': ['Tour Cultural'],
  'Música y baile': ['Música y Baile'],
  'Bienestar': ['Bienestar'],
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

  const category = await getExperienceCategoryByHandle(handle?.[0])
  const allListings = await getExperienceListings()
  const filterOptions = await getExperienceListingFilterOptions()

  if (!category?.id) {
    return redirect('/experience-categories/all')
  }

  // Parse active filters from URL
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
        defaultChecked: activeTypes.includes(opt.name),
      })) ?? [],
    }
  })

  return (
    <div className="container xl:max-w-none xl:pe-0 2xl:ps-10">
      <SectionGridHasMap
        listings={paginatedListings}
        allListingsCount={totalListings}
        category={category}
        filterOptions={augmentedFilterOptions}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}

export default Page
