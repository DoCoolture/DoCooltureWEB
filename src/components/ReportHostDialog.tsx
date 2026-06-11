'use client'

import { Dialog, DialogBody, DialogTitle } from '@/components/dialog'
import { useLanguage } from '@/context/LanguageContext'
import { reportHost } from '@/app/actions/notifications'
import { Flag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

interface Props {
  hostId: string
  hostName: string
  label?: string
}

export default function ReportHostDialog({ hostId, hostName, label }: Props) {
  const { t } = useLanguage()
  const rh = t.reportHost
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState(rh.reasons[0])
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const result = await reportHost({ hostId, hostName, reason, details })
    if (result.error) setError(result.error)
    else setDone(true)
    setSubmitting(false)
  }

  const handleClose = () => {
    setOpen(false)
    setDone(false)
    setError(null)
    setDetails('')
    setReason(rh.reasons[0])
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-x-2 text-sm text-neutral-700 transition-colors hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400"
      >
        <HugeiconsIcon icon={Flag03Icon} size={16} color="currentColor" strokeWidth={1.5} />
        <span>{label ?? rh.triggerLabel}</span>
      </button>

      <Dialog size="md" open={open} onClose={handleClose}>
        <DialogTitle>{rh.dialogTitle}</DialogTitle>
        <DialogBody>
          {done ? (
            <div className="py-4 text-center">
              <p className="font-medium text-green-600">{rh.successMsg}</p>
              <p className="mt-1 text-sm text-neutral-500">{rh.successDesc}</p>
              <button
                onClick={handleClose}
                className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
              >
                {rh.closeBtn}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {rh.reasonLabel}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {rh.reasons.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {rh.detailsLabel}
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={rh.detailsPlaceholder}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={handleClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-700">
                  {rh.cancelBtn}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? rh.submitting : rh.submitBtn}
                </button>
              </div>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  )
}
