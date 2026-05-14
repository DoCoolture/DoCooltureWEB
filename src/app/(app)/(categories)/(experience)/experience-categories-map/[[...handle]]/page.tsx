import { getExperienceCategoryByHandle } from '@/data/categories'
import { getExperienceListingFilterOptions, getExperienceListings } from '@/data/listings'
import { getServerT } from '@/lib/locale-server'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SectionGridHasMap from './SectionGridHasMap'

const ITEMS_PER_PAGE = 8

const TYPE_TO_CATEGORY: Record<string, string[]> = {
  food_drink: ['Gastronomía'],
  outdoor: ['Aventura y Naturaleza'],
  arts_culture: ['Arte y Artesanía'],
  history: ['Tour Cultural'],
  music_dance: ['Música y Baile'],
  wellness: ['Bienestar'],
}

// Duration filter ranges in hours: [min, max)
const DURATION_RANGES: Record<string, [number, number]> = {
  less_than_1_hour: [0, 1],
  '1_2_hours':      [1, 2],
  '2_4_hours':      [2, 4],
  more_than_4_hours:[4, Infinity],
}

function parseDurationHours(durationTime: string): number {
  const rangeMatch = durationTime.match(/(\d+(?:[.,]\d+)?)\s*[–\-]\s*(\d+(?:[.,]\d+)?)\s*hora/i)
  if (rangeMatch) return (parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2
  const singleHour = durationTime.match(/(\d+(?:[.,]\d+)?)\s*hora/i)
  if (singleHour) return parseFloat(singleHour[1])
  const minutes = durationTime.match(/(\d+)\s*minuto/i)
  if (minutes) return parseFloat(minutes[1]) / 60
  return 0
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
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

  // Parse active filters from URL
  const activeTypes     = (sp.experienceType as string | undefined)?.split(',').filter(Boolean) ?? []
  const activeDurations = (sp.duration as string | undefined)?.split(',').filter(Boolean) ?? []
  const priceMin        = Number(sp.price_min) || 0
  const priceMax        = Number(sp.price_max) || Infinity
  const page            = Math.max(1, Number(sp.page) || 1)

  // Filter listings
  let filteredListings = allListings

  if (activeTypes.length > 0) {
    filteredListings = filteredListings.filter((listing) =>
      activeTypes.some((type) => (TYPE_TO_CATEGORY[type] ?? []).includes(listing.listingCategory))
    )
  }

  if (activeDurations.length > 0) {
    filteredListings = filteredListings.filter((listing) => {
      const hours = parseDurationHours(listing.durationTime)
      return activeDurations.some((d) => {
        const [min, max] = DURATION_RANGES[d] ?? [0, Infinity]
        return hours >= min && hours < max
      })
    })
  }

  if (priceMin > 0 || priceMax < Infinity) {
    filteredListings = filteredListings.filter((listing) => {
      const price = parsePrice(listing.price)
      return price >= priceMin && price <= priceMax
    })
  }

  const totalListings = filteredListings.length
  const totalPages = Math.max(1, Math.ceil(totalListings / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Augment filterOptions so all checkboxes reflect current URL state
  const activeCheckboxMap: Record<string, string[]> = {
    experienceType: activeTypes,
    duration: activeDurations,
  }

  const augmentedFilterOptions: any[] = filterOptions.map((fo) => {
    if (!fo || fo.tabUIType !== 'checkbox') return fo
    const active = activeCheckboxMap[fo.name] ?? []
    return {
      ...fo,
      options: (fo as any).options?.map((opt: any) => ({
        ...opt,
        defaultChecked: active.includes(opt.value ?? opt.name),
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
