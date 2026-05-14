'use client'

import { supabase } from '@/lib/supabase'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useEffect, useState } from 'react'

interface Props {
  label: string
  className?: string
}

export default function BecomeHostCta({ label, className }: Props) {
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
    <ButtonPrimary href="/become-host" className={className}>
      {label}
    </ButtonPrimary>
  )
}
