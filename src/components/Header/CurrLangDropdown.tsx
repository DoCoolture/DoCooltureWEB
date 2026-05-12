'use client'

import { useCurrency, type Currency } from '@/context/CurrencyContext'
import { useLanguage, type Locale } from '@/context/LanguageContext'
import { getCurrencies, getLanguages } from '@/data/navigation'
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { BanknotesIcon, GlobeAltIcon, SlashIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { FC } from 'react'

const Currencies = ({
  currencies,
}: {
  currencies: Awaited<ReturnType<typeof getCurrencies>>
}) => {
  const { currency: activeCurrency, setCurrency, isLoading } = useCurrency()

  const currencyMap: Record<string, Currency> = {
    DOP: 'DOP',
    USD: 'USD',
    EUR: 'EUR',
    COP: 'COP',
    ARS: 'ARS',
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {isLoading && (
        <div className="col-span-2 rounded-lg bg-blue-50 px-3 py-2 text-center text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          Actualizando tasas de cambio...
        </div>
      )}
      {currencies.map((item, index) => {
        const itemCurrency = currencyMap[item.id] as Currency
        const isActive = activeCurrency === itemCurrency
        return (
          <button
            key={index}
            onClick={() => itemCurrency && setCurrency(itemCurrency)}
            className={clsx(
              '-m-2.5 flex items-center rounded-lg p-2.5 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden dark:hover:bg-neutral-700 w-full text-left',
              isActive
                ? 'bg-neutral-100 dark:bg-neutral-700'
                : 'opacity-80'
            )}
          >
            <div dangerouslySetInnerHTML={{ __html: item.icon }} />
            <p className="ms-2 text-sm font-medium">{item.name}</p>
            {isActive && (
              <span className="ml-auto text-xs font-semibold text-primary-600">✓</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

const Languages = ({
  languages,
  currentLocale,
  onSelectLanguage,
}: {
  languages: Awaited<ReturnType<typeof getLanguages>>
  currentLocale: Locale
  onSelectLanguage: (locale: Locale) => void
}) => {
  const localeMap: Record<string, Locale> = {
    Spanish: 'es',
    English: 'en',
    French: 'fr',
    Italian: 'it',
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {languages.map((item, index) => {
        const itemLocale = localeMap[item.id] || 'es'
        const isActive = currentLocale === itemLocale
        return (
          <button
            key={index}
            onClick={() => onSelectLanguage(itemLocale)}
            className={clsx(
              '-m-2.5 flex items-center rounded-lg p-2.5 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden dark:hover:bg-neutral-700 w-full text-left',
              isActive
                ? 'bg-neutral-100 dark:bg-neutral-700'
                : 'opacity-80'
            )}
          >
            <div className="flex flex-col">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
            {isActive && (
              <span className="ml-auto text-xs font-semibold text-primary-600">✓</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface Props {
  panelAnchor?: PopoverPanelProps['anchor']
  panelClassName?: PopoverPanelProps['className']
  className?: string
  currencies: Awaited<ReturnType<typeof getCurrencies>>
  languages: Awaited<ReturnType<typeof getLanguages>>
}

const CurrLangDropdown: FC<Props> = ({
  panelAnchor = { to: 'bottom end', gap: 16 },
  className,
  languages,
  currencies,
  panelClassName = 'w-sm',
}) => {
  const { locale, setLocale } = useLanguage()

  return (
    <Popover className={clsx('group', className)}>
      <PopoverButton className="-m-2.5 flex items-center p-2.5 text-sm font-medium text-neutral-600 group-hover:text-neutral-950 focus:outline-hidden focus-visible:outline-hidden dark:text-neutral-200 dark:group-hover:text-neutral-100">
        <GlobeAltIcon className="size-5" />
        <SlashIcon className="size-5 opacity-60" />
        <BanknotesIcon className="size-5" />
        <ChevronDownIcon className="ms-1 size-4 group-data-open:rotate-180" aria-hidden="true" />
      </PopoverButton>

      <PopoverPanel
        anchor={panelAnchor}
        transition
        className={clsx(
          'z-40 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0 dark:bg-neutral-800',
          panelClassName
        )}
      >
        <TabGroup>
          <TabList className="flex space-x-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-700">
            {['Idioma', 'Moneda'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-full py-2 text-sm leading-5 font-medium text-neutral-700 focus:ring-0 focus:outline-hidden',
                    selected
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white/70 dark:text-neutral-300 dark:hover:bg-neutral-900/40'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-5">
            <TabPanel className="rounded-xl p-3 focus:ring-0 focus:outline-hidden">
              <Languages
                languages={languages}
                currentLocale={locale}
                onSelectLanguage={setLocale}
              />
            </TabPanel>
            <TabPanel className="rounded-xl p-3 focus:ring-0 focus:outline-hidden">
              <Currencies currencies={currencies} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </PopoverPanel>
    </Popover>
  )
}

export default CurrLangDropdown
