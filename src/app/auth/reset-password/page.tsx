'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const inputClass = 'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const rp = t.resetPassword

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirm) { setError(rp.passwordsNoMatch); return }
    if (newPassword.length < 8) { setError(rp.passwordTooShort); return }

    setIsLoading(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    setIsLoading(false)

    if (error) {
      setError(rp.errorUpdating)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{rp.title}</h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">{rp.subtitle}</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg dark:bg-neutral-800">
          {success ? (
            <p className="text-center text-green-600">{rp.successMsg}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
              <div>
                <label className={labelClass}>{rp.newPassword}</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{rp.confirmPassword}</label>
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                  ⚠️ {error}
                </div>
              )}

              <ButtonPrimary type="submit" disabled={isLoading} className="w-full disabled:opacity-60">
                {isLoading ? rp.saving : rp.submit}
              </ButtonPrimary>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
