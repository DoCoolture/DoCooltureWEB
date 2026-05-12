import { getServerT } from '@/lib/locale-server'
import Heading from '@/shared/Heading'
import { FC } from 'react'

interface SectionStatisticProps {
  className?: string
}

const SectionStatistic: FC<SectionStatisticProps> = async ({ className = '' }) => {
  const t = await getServerT()
  const { heading, subheading, experiences, hosts, cities } = t.about.stats

  const facts = [
    { id: '1', heading: experiences.value, subHeading: experiences.label },
    { id: '2', heading: hosts.value, subHeading: hosts.label },
    { id: '3', heading: cities.value, subHeading: cities.label },
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
