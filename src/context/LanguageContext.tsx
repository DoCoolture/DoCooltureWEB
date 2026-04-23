'use client'

import { en } from '../../public/locales/en'
import { es } from '../../public/locales/es'
import { fr } from '../../public/locales/fr'
import { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'es' | 'en' | 'fr'

const translations = { es, en, fr }

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
  const [locale, setLocaleState] = useState<Locale>('es')

  // Al montar, leer la cookie
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dc_locale='))
    if (cookie) {
      const value = cookie.split('=')[1] as Locale
      if (['es', 'en', 'fr'].includes(value)) {
        setLocaleState(value)
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    // Guardar en cookie por 1 año
    document.cookie = `dc_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    setLocaleState(newLocale)
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
