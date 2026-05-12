'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserRole } from '@/types'

const GoogleIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const inputClass = 'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300'

export default function SignupPage() {
  const { t } = useLanguage()
  const s = t.signup

  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<UserRole>('explorer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { role },
      },
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) { setError(s.passwordsNoMatch); return }
    if (password.length < 8) { setError(s.passwordTooShort); return }

    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, display_name: fullName.split(' ')[0], role },
      },
    })

    if (error) {
      setError(s.errorCreating)
      setIsLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').update({ role }).eq('user_id', data.user.id)
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-900">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-6xl">🎉</div>
          <h1 className="mb-3 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{s.successTitle}</h1>
          <p className="mb-8 text-neutral-500 dark:text-neutral-400">
            {s.successMsg} <strong>{email}</strong>. {s.successMsg2}
          </p>
          <ButtonPrimary href="/login" className="w-full">{s.goToLogin}</ButtonPrimary>
        </div>
      </div>
    )
  }

  const RoleCard = ({ value, emoji, title, desc }: { value: UserRole; emoji: string; title: string; desc: string }) => (
    <button
      onClick={() => setRole(value)}
      className={`flex items-start gap-x-4 rounded-2xl border-2 p-4 text-left transition-all ${
        role === value
          ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
          : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <div>
        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{desc}</p>
      </div>
      {role === value && <span className="ml-auto text-lg font-bold text-primary-600">✓</span>}
    </button>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{s.title}</h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">{s.subtitle}</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg dark:bg-neutral-800">

          {step === 1 && (
            <div className="flex flex-col gap-y-4">
              <h2 className="mb-2 text-center text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {s.howToUse}
              </h2>
              <RoleCard value="explorer" emoji="🧭" title={s.explorerTitle} desc={s.explorerDesc} />
              <RoleCard value="host" emoji="🏠" title={s.hostTitle} desc={s.hostDesc} />
              <ButtonPrimary className="mt-2 w-full" onClick={() => setStep(2)}>
                {s.continueAs} {role === 'explorer' ? s.explorerTitle : s.hostTitle}
              </ButtonPrimary>
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                {s.alreadyHaveAccount}{' '}
                <Link href="/login" className="font-medium text-primary-600 hover:underline">{s.signIn}</Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="mb-6 flex items-center gap-x-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                {s.back}
              </button>

              <div className="mb-6 flex items-center gap-x-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-700">
                <span>{role === 'explorer' ? '🧭' : '🏠'}</span>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {s.registeringAs} <strong>{role === 'explorer' ? s.explorerTitle : s.hostTitle}</strong>
                </span>
              </div>

              <button
                onClick={handleGoogleSignup}
                className="mb-6 flex w-full items-center justify-center gap-x-3 rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                <GoogleIcon />
                {s.continueWithGoogle}
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-neutral-500 dark:bg-neutral-800">{s.orWithEmail}</span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="flex flex-col gap-y-4">
                <div>
                  <label className={labelClass}>{s.fullName}</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Pérez" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{s.email}</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{s.password}</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={s.passwordMin} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{s.confirmPassword}</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={s.repeatPassword} className={inputClass} />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                    ⚠️ {error}
                  </div>
                )}

                <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                  {s.termsText}{' '}
                  <Link href="/terminos" className="text-primary-600 hover:underline">{s.termsLink}</Link>{' '}
                  {t.login['Already have an account?'] ? '' : ''}{s.privacyLink !== s.termsLink ? `y la ` : ''}<Link href="/privacidad" className="text-primary-600 hover:underline">{s.privacyLink}</Link>{' '}
                  {s.termsOf}
                </p>

                <ButtonPrimary type="submit" disabled={isLoading} className="w-full disabled:opacity-60">
                  {isLoading ? s.creating : s.create}
                </ButtonPrimary>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
