'use client'

import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/shared/Button'

export default function BecomeHostButton() {
  const { t } = useLanguage()
  return (
    <Button className="-mx-1 py-1.75! whitespace-nowrap" color="light" href="/become-host">
      {t.common['Become a host']}
    </Button>
  )
}
