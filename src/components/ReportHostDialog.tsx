'use client'

import { Dialog, DialogBody, DialogTitle } from '@/components/dialog'
import { supabase } from '@/lib/supabase'
import { Flag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

const REASONS = [
  'Información falsa o engañosa',
  'Comportamiento inapropiado',
  'Estafa o fraude',
  'Perfil duplicado',
  'Otro',
]

interface Props {
  hostId: string
  hostName: string
  label?: string
}

export default function ReportHostDialog({ hostId, hostName, label }: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState(REASONS[0])
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: admins } = await supabase
      .from('profiles').select('user_id').eq('role', 'admin')
    if (!admins || admins.length === 0) {
      setError('No se pudo enviar el reporte. Intenta de nuevo.')
      setSubmitting(false)
      return
    }
    const notifications = admins.map((admin) => ({
      user_id: admin.user_id,
      type: 'host_report',
      title: `🚨 Reporte de anfitrión: ${hostName}`,
      message: `Razón: ${reason}${details ? ` — ${details}` : ''}. Reportado por: ${user?.email ?? 'usuario anónimo'}`,
      action_url: '/admin',
      data: { host_id: hostId, reporter_id: user?.id ?? null },
    }))
    const { error: insertError } = await supabase.from('notifications').insert(notifications)
    if (insertError) setError('No se pudo enviar el reporte. Intenta de nuevo.')
    else setDone(true)
    setSubmitting(false)
  }

  const handleClose = () => {
    setOpen(false)
    setDone(false)
    setError(null)
    setDetails('')
    setReason(REASONS[0])
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-x-2 text-sm text-neutral-700 transition-colors hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400"
      >
        <HugeiconsIcon icon={Flag03Icon} size={16} color="currentColor" strokeWidth={1.5} />
        <span>{label ?? 'Reportar este anfitrión'}</span>
      </button>

      <Dialog size="md" open={open} onClose={handleClose}>
        <DialogTitle>Reportar anfitrión</DialogTitle>
        <DialogBody>
          {done ? (
            <div className="py-4 text-center">
              <p className="font-medium text-green-600">✅ Reporte enviado correctamente.</p>
              <p className="mt-1 text-sm text-neutral-500">El equipo de DoCoolture revisará este caso.</p>
              <button
                onClick={handleClose}
                className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Razón del reporte
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Detalles adicionales (opcional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe lo que ocurrió..."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={handleClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-700">
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar reporte'}
                </button>
              </div>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  )
}
