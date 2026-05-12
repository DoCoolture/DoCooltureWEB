'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const fp = t.forgotPassword

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setIsLoading(false)

    if (error) {
      setError(fp.errorSending)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-900">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-6xl">📬</div>
          <h1 className="mb-3 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{fp.successTitle}</h1>
          <p className="mb-8 text-neutral-500 dark:text-neutral-400">{fp.successMsg}</p>
          <Link href="/login" className="font-medium text-primary-600 hover:underline">{fp.backToLogin}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{fp.title}</h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">{fp.subtitle}</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg dark:bg-neutral-800">
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {fp.email}
              </label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                ⚠️ {error}
              </div>
            )}

            <ButtonPrimary type="submit" disabled={isLoading} className="w-full disabled:opacity-60">
              {isLoading ? fp.sending : fp.submit}
            </ButtonPrimary>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <Link href="/login" className="font-medium text-primary-600 hover:underline">
              {fp.backToLogin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
