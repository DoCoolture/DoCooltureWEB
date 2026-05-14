'use client'

import EditExperienceModal from '@/components/EditExperienceModal'
import { supabase } from '@/lib/supabase'
import { EyeIcon, EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  experienceId: string
  experienceTitle: string
}

export default function ExperienceAdminActions({ experienceId, experienceTitle }: Props) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isHidden, setIsHidden] = useState<boolean | null>(null)
  const [expData, setExpData] = useState<any>(null)
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('user_id', user.id).single()
      if (profile?.role !== 'admin') return
      setIsAdmin(true)
      const { data: exp } = await supabase
        .from('experiences').select('*').eq('id', experienceId).single()
      if (exp) {
        setIsHidden(exp.is_hidden ?? false)
        setExpData(exp)
      }
    }
    init()
  }, [experienceId])

  const handleShow = async () => {
    setLoading(true)
    await supabase.from('experiences').update({
      is_hidden: false, hidden_reason: null, hidden_at: null,
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

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from('experiences').delete().eq('id', experienceId)
    if (!error) {
      router.push('/experience-categories/all')
    } else {
      console.error('Delete error:', error)
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!isAdmin || isHidden === null) return null

  return (
    <>
      <div className={`rounded-xl border p-4 ${isHidden ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950' : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Admin — Experiencia
          </span>
          <span className={`text-xs font-medium ${isHidden ? 'text-amber-700 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
            {isHidden ? '🙈 Oculta' : '✅ Visible'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Edit */}
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-x-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:bg-transparent dark:text-blue-400"
          >
            <PencilSquareIcon className="size-3.5" />
            Editar
          </button>

          {/* Hide / Show */}
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
            <button
              onClick={() => setShowReasonInput((v) => !v)}
              className="flex items-center gap-x-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-transparent dark:text-red-400"
            >
              <EyeSlashIcon className="size-3.5" />
              Ocultar
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-x-1.5 rounded-lg border border-red-400 bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            <TrashIcon className="size-3.5" />
            Eliminar
          </button>
        </div>

        {/* Hide reason input */}
        {showReasonInput && !isHidden && (
          <div className="mt-3 flex flex-col gap-2">
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
          </div>
        )}

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="mt-3 rounded-lg border border-red-300 bg-red-100 dark:border-red-800 dark:bg-red-950 p-3">
            <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-2">
              ¿Eliminar permanentemente "{experienceTitle}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {showEdit && expData && (
        <EditExperienceModal
          experience={{
            id: expData.id,
            title: expData.title,
            description: expData.description,
            category: expData.category,
            price_usd: expData.price_usd,
            duration_time: expData.duration_time,
            max_guests: expData.max_guests,
            address: expData.address,
            city: expData.city,
            is_published: expData.is_published,
          }}
          onClose={() => setShowEdit(false)}
          onSaved={() => router.refresh()}
        />
      )}
    </>
  )
}
