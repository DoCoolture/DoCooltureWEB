'use client'

import { en } from '../../public/locales/en'
import { es } from '../../public/locales/es'
import { fr } from '../../public/locales/fr'
import { it } from '../../public/locales/it'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'es' | 'en' | 'fr' | 'it'

const translations = { es, en, fr, it }
const VALID_LOCALES: Locale[] = ['es', 'en', 'fr', 'it']

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof en
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'es',
  setLocale: () => {},
  t: es,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>('es')

  // Al montar, leer la cookie
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dc_locale='))
    if (cookie) {
      const value = cookie.split('=')[1] as Locale
      if (VALID_LOCALES.includes(value)) {
        setLocaleState(value)
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    document.cookie = `dc_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    setLocaleState(newLocale)
    // Re-renders server components with the new cookie
    router.refresh()
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
