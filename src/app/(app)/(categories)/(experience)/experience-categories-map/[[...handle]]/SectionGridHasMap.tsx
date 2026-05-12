'use client'

import ExperiencesCard from '@/components/ExperiencesCard'
import ListingFilterTabs from '@/components/ListingFilterTabs'
import { useLanguage } from '@/context/LanguageContext'
import { TExperienceCategory } from '@/data/categories'
import { getExperienceListingFilterOptions, TExperienceListing } from '@/data/listings'
import { Divider } from '@/shared/divider'
import PaginationComponent from '@/shared/Pagination'
import convertNumbThousand from '@/utils/convertNumbThousand'
import clsx from 'clsx'
import { FC, useState } from 'react'
import MapFixedSection from '../../../MapFixedSection'

interface Props {
  className?: string
  listings: TExperienceListing[]
  allListingsCount: number
  category: TExperienceCategory
  filterOptions: Awaited<ReturnType<typeof getExperienceListingFilterOptions>>
  currentPage: number
  totalPages: number
}

const SectionGridHasMap: FC<Props> = ({
  className,
  listings,
  allListingsCount,
  category,
  filterOptions,
  currentPage,
  totalPages,
}) => {
  const [currentHoverID, setCurrentHoverID] = useState<string>('')
  const { t } = useLanguage()
  const ef = t.experienceFilters

  return (
    <div className={clsx('relative flex min-h-screen gap-6', className)}>
      <div className="flex w-full flex-1/2 flex-col gap-y-7 pt-8 pb-20">
        <h1 className="text-lg/none font-semibold">
          {convertNumbThousand(allListingsCount)} {allListingsCount !== 1 ? ef.experiences : ef.experience}{' '}
          {ef.inLocation} {category.handle !== 'all' ? category.name : ef.inDominicanRepublic}
        </h1>

        <ListingFilterTabs filterOptions={filterOptions} />
        <Divider />

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 2xl:gap-x-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              onMouseEnter={() => setCurrentHoverID(listing.id)}
              onMouseLeave={() => setCurrentHoverID('')}
            >
              <ExperiencesCard data={listing} />
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="py-20 text-center text-neutral-500">
            {ef.noExperiences}
          </div>
        )}

        <div className="mt-16 flex items-center">
          <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>

      <MapFixedSection
        closeButtonHref={`/experience-categories/${category.handle}#heading`}
        currentHoverID={currentHoverID}
        listings={listings}
        listingType="Experiences"
      />
    </div>
  )
}

export default SectionGridHasMap
