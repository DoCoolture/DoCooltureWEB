'use client'

import { useLanguage } from '@/context/LanguageContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'

export default function AccountBillingPage() {
  const { t } = useLanguage()

  return (
    <div>
      <h1 className="text-3xl font-semibold">{t.accountPage['Payments & payouts']}</h1>
      <Divider className="my-8 w-14!" />

      <div className="max-w-2xl">
        <span className="block text-xl font-semibold">{t.accountPage['Payout methods']}</span>
        <br />
        <span className="block text-neutral-700 dark:text-neutral-300">
          {t.accountPage['Payout info']}
        </span>
        <div className="pt-10">
          <ButtonPrimary>{t.accountPage['Add payout method']}</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}
