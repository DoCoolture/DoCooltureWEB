'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'

interface Props {
  specialties: string[]
  activeSpecialty: string | null
  allLabel: string
  specialtyMap: Record<string, string>
}

const TalentFilterChips: FC<Props> = ({ specialties, activeSpecialty, allLabel, specialtyMap }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (specialty: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (specialty) {
      params.set('specialty', specialty)
    } else {
      params.delete('specialty')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
      active
        ? 'border-primary-600 bg-primary-600 text-white'
        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
    }`

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => handleFilter(null)} className={chipClass(!activeSpecialty)}>
        {allLabel}
      </button>
      {specialties.map((specialty) => (
        <button
          key={specialty}
          onClick={() => handleFilter(specialty)}
          className={chipClass(activeSpecialty === specialty)}
        >
          {specialtyMap[specialty] ?? specialty}
        </button>
      ))}
    </div>
  )
}

export default TalentFilterChips
