import { getCarCategoryByHandle } from '@/data/categories'
import { getCarListingFilterOptions, getCarListings } from '@/data/listings'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SectionGridHasMap from './SectionGridHasMap'

export async function generateMetadata({ params }: { params: { handle?: string[] } }): Promise<Metadata> {
  const { handle } = params
  const category = await getCarCategoryByHandle(handle?.[0])

  if (!category) {
    return {
      title: 'Collection not found',
      description: 'The collection you are looking for does not exist.',
    }
  }

  const { name, description } = category as { name: string; description: string }
  return { title: name, description }
}

const Page = async ({ params }: { params: { handle?: string[] } }) => {
  const { handle } = params
  const category = await getCarCategoryByHandle(handle?.[0])

  if (!category || !('id' in (category as object))) {
    return redirect('/car-categories/all')
  }

  const listings = await getCarListings()
  const filterOptions = await getCarListingFilterOptions()

  return (
    <div className="container xl:max-w-none xl:pe-0 2xl:ps-10">
      <SectionGridHasMap listings={listings} category={category} filterOptions={filterOptions} />
    </div>
  )
}

export default Page
