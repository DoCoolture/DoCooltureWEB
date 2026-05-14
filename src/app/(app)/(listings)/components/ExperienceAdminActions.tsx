'use client'

import { supabase } from '@/lib/supabase'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface Props {
  experienceId: string
  experienceTitle: string
}

export default function ExperienceAdminActions({ experienceId, experienceTitle }: Props) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isHidden, setIsHidden] = useState<boolean | null>(null)
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('user_id', user.id).single()
      if (profile?.role !== 'admin') return
      setIsAdmin(true)
      const { data: exp } = await supabase
        .from('experiences').select('is_hidden').eq('id', experienceId).single()
      if (exp) setIsHidden(exp.is_hidden ?? false)
    }
    init()
  }, [experienceId])

  const handleShow = async () => {
    setLoading(true)
    await supabase.from('experiences').update({
      is_hidden: false,
      hidden_reason: null,
      hidden_at: null,
    }).eq('id', experienceId)
    setIsHidden(false)
    setLoading(false)
  }

  const handleHide = async () => {
    if (!reason.trim()) { setShowReasonInput(true); return }
    setLoading(true)
    await supabase.from('experiences').update({
      is_hidden: true,
      hidden_reason: reason.trim(),
      hidden_at: new Date().toISOString(),
    }).eq('id', experienceId)

    // Notify host
    const { data: exp } = await supabase
      .from('experiences').select('host_id').eq('id', experienceId).single()
    if (exp) {
      const { data: host } = await supabase
        .from('hosts').select('user_id').eq('id', exp.host_id).single()
      if (host) {
        await supabase.from('notifications').insert({
          user_id: host.user_id,
          type: 'experience_hidden',
          title: 'Tu experiencia fue pausada',
          message: `"${experienceTitle}" fue pausada. Razón: ${reason.trim()}`,
          action_url: '/host/dashboard',
        })
      }
    }

    setIsHidden(true)
    setShowReasonInput(false)
    setReason('')
    setLoading(false)
  }

  if (!isAdmin || isHidden === null) return null

  return (
    <div className={`rounded-xl border p-4 ${isHidden ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950' : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Admin — Experiencia
        </span>
        <span className={`text-xs font-medium ${isHidden ? 'text-amber-700 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
          {isHidden ? '🙈 Oculta' : '✅ Visible'}
        </span>
      </div>

      {isHidden ? (
        <button
          onClick={handleShow}
          disabled={loading}
          className="flex items-center gap-x-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          <EyeIcon className="size-3.5" />
          {loading ? 'Procesando...' : 'Hacer visible'}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {showReasonInput ? (
            <>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Razón para ocultar..."
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleHide}
                  disabled={loading || !reason.trim()}
                  className="flex items-center gap-x-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <EyeSlashIcon className="size-3.5" />
                  {loading ? 'Procesando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => { setShowReasonInput(false); setReason('') }}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowReasonInput(true)}
              className="flex items-center gap-x-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-transparent dark:text-red-400"
            >
              <EyeSlashIcon className="size-3.5" />
              Ocultar experiencia
            </button>
          )}
        </div>
      )}
    </div>
  )
}
