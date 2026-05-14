'use client'

import { supabase } from '@/lib/supabase'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

const TABS = [
  { label: 'Experiencias', hash: '#experiences' },
  { label: 'Anfitriones', hash: '#hosts' },
  { label: 'Reservas', hash: '#bookings' },
  { label: 'Verificaciones', hash: '#verifications' },
]

export default function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      if (profile?.role === 'admin') setIsAdmin(true)
    })
  }, [])

  if (!isAdmin) return null

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-x-4 bg-red-600 px-4 py-1.5 text-white shadow-sm">
      <div className="flex items-center gap-x-2 shrink-0">
        <ShieldCheckIcon className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">Admin</span>
      </div>
      <div className="flex items-center gap-x-1 overflow-x-auto">
        {TABS.map((tab) => (
          <a
            key={tab.hash}
            href={`/admin${tab.hash}`}
            className="rounded px-2.5 py-1 text-xs font-medium text-red-100 hover:bg-red-700 hover:text-white whitespace-nowrap transition-colors"
          >
            {tab.label}
          </a>
        ))}
      </div>
      <a
        href="/admin"
        className="shrink-0 rounded-md bg-white px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
      >
        Panel completo
      </a>
    </div>
  )
}
