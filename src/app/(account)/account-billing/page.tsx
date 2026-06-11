'use client'

import { useLanguage } from '@/context/LanguageContext'
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
        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
          {t.accountPage.payoutComingSoon}{' '}
          {t.accountPage.payoutContact}{' '}
          <a href={`mailto:${t.accountPage.supportEmail}`} className="text-primary-600 underline dark:text-primary-400">
            {t.accountPage.supportEmail}
          </a>
          .
        </div>
      </div>
    </div>
  )
}
