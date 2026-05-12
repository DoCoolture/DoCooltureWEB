'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const PageNavigation = () => {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigation = [
    { title: t.accountPage.Account, href: '/account' },
    { title: t.accountPage['Saved listings'], href: '/account-savelists' },
    { title: t.accountPage.Password, href: '/account-password' },
    { title: t.accountPage['Payments & payouts'], href: '/account-billing' },
  ]

  return (
    <div className="container">
      <div className="hidden-scrollbar flex gap-x-8 overflow-x-auto md:gap-x-14">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block shrink-0 border-b-2 py-5 capitalize md:py-8 ${
                isActive ? 'border-primary-500 font-medium' : 'border-transparent'
              }`}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
