import { en } from '../../public/locales/en'
import { es } from '../../public/locales/es'
import { fr } from '../../public/locales/fr'
import { it } from '../../public/locales/it'
import { cookies } from 'next/headers'

type Locale = 'es' | 'en' | 'fr' | 'it'

const translations = { es, en, fr, it }
const VALID_LOCALES: Locale[] = ['es', 'en', 'fr', 'it']

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get('dc_locale')?.value as Locale
  return VALID_LOCALES.includes(value) ? value : 'es'
}

export async function getServerT() {
  const locale = await getServerLocale()
  return translations[locale]
}
