'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserRole } from '@/types'

export default function SignupPage() {
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

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: fullName.split(' ')[0],
          role,
        },
      },
    })

    if (error) {
      setError('Error al crear la cuenta. Intenta de nuevo.')
      setIsLoading(false)
      return
    }

    // Actualizar el rol en el perfil
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', data.user.id)
    }

    setSuccess(true)
    setIsLoading(false)
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            ¡Cuenta creada!
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Te enviamos un correo de confirmación a{' '}
            <strong>{email}</strong>. Revisa tu bandeja de entrada y confirma tu cuenta.
          </p>
          <ButtonPrimary href="/login" className="w-full">
            Ir a iniciar sesión
          </ButtonPrimary>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Crear cuenta
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Únete a DoCoolture y descubre experiencias únicas
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-8">

          {/* PASO 1 — Selección de rol */}
          {step === 1 && (
            <div className="flex flex-col gap-y-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-2">
                ¿Cómo quieres usar DoCoolture?
              </h2>

              {/* Explorer */}
              <button
                onClick={() => setRole('explorer')}
                className={`flex items-start gap-x-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  role === 'explorer'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span className="text-3xl">🧭</span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Explorer
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Quiero descubrir y reservar experiencias culturales en la República Dominicana.
                  </p>
                </div>
                {role === 'explorer' && (
                  <span className="ml-auto text-primary-600 font-bold text-lg">✓</span>
                )}
              </button>

              {/* Host */}
              <button
                onClick={() => setRole('host')}
                className={`flex items-start gap-x-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  role === 'host'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span className="text-3xl">🏠</span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Anfitrión
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Quiero ofrecer mis experiencias culturales y conectar con exploradores.
                  </p>
                </div>
                {role === 'host' && (
                  <span className="ml-auto text-primary-600 font-bold text-lg">✓</span>
                )}
              </button>

              <ButtonPrimary
                className="w-full mt-2"
                onClick={() => setStep(2)}
              >
                Continuar como {role === 'explorer' ? 'Explorer' : 'Anfitrión'}
              </ButtonPrimary>

              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-primary-600 hover:underline font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}

          {/* PASO 2 — Datos de la cuenta */}
          {step === 2 && (
            <>
              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-x-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-6"
              >
                ← Volver
              </button>

              {/* Role badge */}
              <div className="flex items-center gap-x-2 mb-6 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700">
                <span>{role === 'explorer' ? '🧭' : '🏠'}</span>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Registrándote como{' '}
                  <strong>{role === 'explorer' ? 'Explorer' : 'Anfitrión'}</strong>
                </span>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-x-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors mb-6"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-neutral-800 px-4 text-neutral-500">
                    o con tu correo
                  </span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="flex flex-col gap-y-4">

                {/* Nombre completo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-100"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-100"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
                    ⚠️ {error}
                  </div>
                )}

                {/* Terms */}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Al registrarte aceptas los{' '}
                  <Link href="/terminos" className="text-primary-600 hover:underline">
                    Términos de servicio
                  </Link>{' '}
                  y la{' '}
                  <Link href="/privacidad" className="text-primary-600 hover:underline">
                    Política de privacidad
                  </Link>{' '}
                  de DoCoolture.
                </p>

                {/* Submit */}
                <ButtonPrimary
                  type="submit"
                  disabled={isLoading}
                  className="w-full disabled:opacity-60"
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </ButtonPrimary>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
