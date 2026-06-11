'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error to the console (and any attached monitoring) for diagnosis
    console.error('[app/error]', error)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="mb-4 text-5xl">⚠️</p>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Algo salió mal
      </h1>
      <p className="mb-8 max-w-md text-neutral-500 dark:text-neutral-400">
        Ocurrió un error inesperado. Puedes reintentar; si el problema persiste, escríbenos a{' '}
        <a href="mailto:soporte@docoolture.com" className="text-primary-600 underline dark:text-primary-400">
          soporte@docoolture.com
        </a>
        .
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonPrimary onClick={() => reset()}>Reintentar</ButtonPrimary>
        <a
          href="/"
          className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
