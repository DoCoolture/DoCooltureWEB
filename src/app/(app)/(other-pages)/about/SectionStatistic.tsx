import { getExperienceListings } from '@/data/listings'
import { getExperienceCategories } from '@/data/categories'
import { getServerT } from '@/lib/locale-server'
import { supabase } from '@/lib/supabase'
import Heading from '@/shared/Heading'
import { FC } from 'react'

interface SectionStatisticProps {
  className?: string
}

const SectionStatistic: FC<SectionStatisticProps> = async ({ className = '' }) => {
  const [t, experiences, categories] = await Promise.all([
    getServerT(),
    getExperienceListings(),
    getExperienceCategories(),
  ])

  // Count hosts with role = 'host' in profiles
  const { count: hostCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'host')

  const experienceCount = experiences.length
  const activeCities = categories.filter((c) => c.count > 0).length
  const hosts = (hostCount ?? 0) + 1 // +1 for DoCoolture's own host account

  const { heading, subheading, experiences: expLabels, hosts: hostLabels, cities: cityLabels } = t.about.stats

  const facts = [
    { id: '1', heading: String(experienceCount), subHeading: expLabels.label },
    { id: '2', heading: String(hosts), subHeading: hostLabels.label },
    { id: '3', heading: String(activeCities), subHeading: cityLabels.label },
  ]

  return (
    <div className={`relative ${className}`}>
      <Heading subheading={subheading}>
        🚀 {heading}
      </Heading>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {facts.map((item) => (
          <div key={item.id} className="rounded-2xl bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="text-2xl leading-none font-semibold text-neutral-900 md:text-3xl dark:text-neutral-200">
              {item.heading}
            </h3>
            <span className="mt-3 block text-sm text-neutral-500 sm:text-base dark:text-neutral-400">
              {item.subHeading}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionStatistic
