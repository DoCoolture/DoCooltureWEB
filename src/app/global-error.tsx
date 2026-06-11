'use client'

import { useEffect } from 'react'

// global-error replaces the root layout when an error is thrown above it,
// so it must render its own <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app/global-error]', error)
  }, [error])

  return (
    <html lang="es">
      <body
        style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Algo salió mal
        </h1>
        <p style={{ color: '#737373', maxWidth: '28rem', marginBottom: '2rem' }}>
          Ocurrió un error crítico. Reintenta o vuelve más tarde.
        </p>
        <button
          onClick={() => reset()}
          style={{
            borderRadius: '9999px',
            background: '#e07a3f',
            color: '#fff',
            border: 'none',
            padding: '0.65rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  )
}
