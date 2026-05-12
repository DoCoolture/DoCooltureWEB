'use client'

import { useLanguage } from '@/context/LanguageContext'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { HotAirBalloonFreeIcons, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

export default function DropdownExploradores() {
  const { t } = useLanguage()
  const nav = t.navigation

  const opciones = [
    {
      name: nav.experiences,
      description: nav.experiencesDesc,
      href: '/experience',
      icon: HotAirBalloonFreeIcons,
    },
    {
      name: nav.talent,
      description: nav.talentDesc,
      href: '/talento',
      icon: UserGroupIcon,
    },
  ]

  return (
    <Popover className="group">
      <PopoverButton className="-m-2.5 flex items-center p-2.5 text-sm font-medium text-neutral-700 group-hover:text-neutral-950 focus:outline-hidden dark:text-neutral-300 dark:group-hover:text-neutral-100">
        {nav.explorers}
        <ChevronDownIcon className="ms-1 size-4 group-data-open:rotate-180" aria-hidden="true" />
      </PopoverButton>

      <PopoverPanel
        anchor={{ to: 'bottom start', gap: 16 }}
        transition
        className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out sm:px-0 dark:ring-white/10 data-closed:translate-y-1 data-closed:opacity-0"
      >
        <div>
          <div className="relative grid grid-cols-1 gap-6 bg-white p-7 dark:bg-neutral-800">
            {opciones.map((item, index) => (
              <CloseButton
                as={Link}
                key={index}
                href={item.href}
                className="-m-3 flex items-center rounded-lg p-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600 sm:size-12 dark:bg-neutral-700 dark:text-primary-300">
                  <HugeiconsIcon icon={item.icon} size={26} color="currentColor" strokeWidth={1.5} />
                </div>
                <div className="ms-4 space-y-0.5">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.name}
                  </p>
                  <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-300">
                    {item.description}
                  </p>
                </div>
              </CloseButton>
            ))}
          </div>

          <div className="bg-neutral-50 p-4 dark:bg-neutral-700">
            <Link
              href="/experience"
              className="block space-y-0.5 rounded-md px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600"
            >
              <span className="flex items-center text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {nav.startAdventure}
              </span>
              <span className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                {nav.startAdventureDesc}
              </span>
            </Link>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
