'use client'

import ExperiencesCard from '@/components/ExperiencesCard'
import StayCard from '@/components/StayCard'
import { getExperienceListings, TExperienceListing, TStayListing } from '@/data/listings'
import { useLanguage } from '@/context/LanguageContext'
import { Tab, TabGroup, TabList } from '@headlessui/react'
import { useEffect, useState } from 'react'

type TabKey = 'Experiences' | 'Stays'

interface Props {
  onChangeTab?: (item: string) => void
}

const ListingTabs = ({ onChangeTab }: Props) => {
  const { t } = useLanguage()
  const sh = t.sectionHost

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'Experiences', label: t.Header.DropdownTravelers.Experiences },
    { key: 'Stays', label: t.Header.DropdownTravelers.Stays },
  ]

  const [experienceListings, setExperienceListings] = useState<TExperienceListing[]>([])
  const [stayListings] = useState<TStayListing[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>('Experiences')

  useEffect(() => {
    if (activeTab === 'Experiences' && !experienceListings.length) {
      getExperienceListings().then(setExperienceListings)
    }
    // Stays are only shown when hosts add them via Supabase — none yet
  }, [activeTab, experienceListings.length])

  const handleTabChange = (index: number) => {
    const key = tabs[index].key
    setActiveTab(key)
    onChangeTab?.(key)
  }

  const currentListings = activeTab === 'Experiences' ? experienceListings : stayListings

  return (
    <div className="w-full">
      <TabGroup
        onChange={handleTabChange}
        className="relative hidden-scrollbar flex w-full overflow-x-auto text-sm md:text-base"
      >
        <TabList className="flex sm:gap-x-1.5">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className="block rounded-full px-4 py-2.5 leading-none font-medium whitespace-nowrap focus-within:outline-hidden data-hover:bg-black/5 data-[selected]:bg-neutral-900 data-[selected]:text-white sm:px-6 sm:py-3 dark:data-[selected]:bg-neutral-100 dark:data-[selected]:text-neutral-900"
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </TabGroup>

      {currentListings.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {activeTab === 'Experiences' &&
            experienceListings.slice(0, 4).map((exp) => <ExperiencesCard key={exp.id} data={exp} />)}
          {activeTab === 'Stays' &&
            stayListings.slice(0, 4).map((stay) => <StayCard key={stay.id} data={stay} />)}
        </div>
      ) : (
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">{sh.noListings}</p>
      )}
    </div>
  )
}

export default ListingTabs
