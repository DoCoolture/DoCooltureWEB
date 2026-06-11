'use client'

import ExperiencesCard from '@/components/ExperiencesCard'
import { TExperienceListing } from '@/data/listings'
import { useLanguage } from '@/context/LanguageContext'

interface Props {
  listings: TExperienceListing[]
}

const ListingTabs = ({ listings }: Props) => {
  const { t } = useLanguage()
  const sh = t.sectionHost

  return (
    <div className="w-full">
      {listings.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {listings.slice(0, 4).map((exp) => (
            <ExperiencesCard key={exp.id} data={exp} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">{sh.noListings}</p>
      )}
    </div>
  )
}

export default ListingTabs
