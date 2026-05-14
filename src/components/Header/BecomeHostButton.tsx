'use client'

import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/shared/Button'
import { useEffect, useState } from 'react'

export default function BecomeHostButton() {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      if (profile?.role === 'explorer') setShow(true)
    })
  }, [])

  if (!show) return null

  return (
    <Button className="-mx-1 py-1.75! whitespace-nowrap" color="light" href="/become-host">
      {t.common['Become a host']}
    </Button>
  )
}
