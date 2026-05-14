'use client'

import { supabase } from '@/lib/supabase'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface Props {
  hostId: string
  hostName: string
}

export default function HostAdminActions({ hostId, hostName }: Props) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [status, setStatus] = useState<'active' | 'suspended' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('user_id', user.id).single()
      if (profile?.role !== 'admin') return
      setIsAdmin(true)
      const { data: host } = await supabase
        .from('hosts').select('status').eq('id', hostId).single()
      if (host) setStatus(host.status as 'active' | 'suspended')
    }
    init()
  }, [hostId])

  const handleToggle = async () => {
    if (!status) return
    setLoading(true)
    const newStatus = status === 'active' ? 'suspended' : 'active'
    await supabase.from('hosts').update({ status: newStatus }).eq('id', hostId)
    const { data: host } = await supabase
      .from('hosts').select('user_id').eq('id', hostId).single()
    if (host) {
      await supabase.from('notifications').insert({
        user_id: host.user_id,
        type: newStatus === 'suspended' ? 'host_suspended' : 'host_reactivated',
        title: newStatus === 'suspended' ? '⚠️ Cuenta suspendida' : '✅ Cuenta reactivada',
        message: newStatus === 'suspended'
          ? 'Tu cuenta de anfitrión ha sido suspendida por DoCoolture.'
          : 'Tu cuenta de anfitrión ha sido reactivada por DoCoolture.',
        action_url: '/host/dashboard',
      })
    }
    setStatus(newStatus)
    setLoading(false)
  }

  if (!isAdmin) return null

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
      <div className="mb-3 flex items-center gap-x-1.5">
        <ShieldCheckIcon className="size-4 text-red-600 dark:text-red-400" />
        <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Panel de administrador
        </span>
      </div>
      <div className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
        Estado:{' '}
        <span className={status === 'active' ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
          {status === 'active' ? 'Activo' : status === 'suspended' ? 'Suspendido' : '—'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href="/admin"
          className="inline-flex items-center rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Ver en panel admin
        </a>
        <button
          onClick={handleToggle}
          disabled={loading || !status}
          className="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:bg-transparent dark:text-red-400"
        >
          {loading ? 'Procesando...' : status === 'active' ? `Suspender a ${hostName}` : `Reactivar a ${hostName}`}
        </button>
      </div>
    </div>
  )
}
