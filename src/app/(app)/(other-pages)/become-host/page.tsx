'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  HOST_SPECIALTIES,
  AVAILABLE_LANGUAGES,
  DOCUMENT_TYPES,
  DR_CITIES,
} from '@/types'

const TOTAL_STEPS = 4

export default function BecomeHostPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Paso 1 — Información personal
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  // Paso 2 — Información profesional
  const [specialties, setSpecialties] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [yearsExperience, setYearsExperience] = useState(0)

  // Paso 3 — Redes sociales
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  // Paso 4 — Verificación de identidad
  const [documentType, setDocumentType] = useState('cedula')
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentFront, setDocumentFront] = useState<File | null>(null)
  const [documentBack, setDocumentBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)

  const toggleItem = (
    item: string,
    list: string[],
    setList: (l: string[]) => void
  ) => {
    setList(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    )
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Obtener el profile_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error('Perfil no encontrado')

      // Crear el perfil de anfitrión
      const { data: host, error: hostError } = await supabase
        .from('hosts')
        .insert({
          profile_id: profile.id,
          user_id: user.id,
          display_name: displayName,
          bio,
          city,
          whatsapp,
          specialties,
          languages,
          years_experience: yearsExperience,
          instagram_url: instagramUrl || null,
          facebook_url: facebookUrl || null,
          website_url: websiteUrl || null,
        })
        .select()
        .single()

      if (hostError) throw hostError

      // Actualizar el rol del usuario a 'host'
      await supabase
        .from('profiles')
        .update({ role: 'host', phone })
        .eq('user_id', user.id)

      // Subir documentos de identidad si existen
      if (documentFront || documentBack || selfie) {
        const uploadFile = async (file: File, type: string) => {
          const ext = file.name.split('.').pop()
          const path = `${user.id}/${type}.${ext}`
          const { error } = await supabase.storage
            .from('identity-documents')
            .upload(path, file, { upsert: true })
          if (error) return null
          const { data } = await supabase.storage
            .from('identity-documents')
            .createSignedUrl(path, 3600 * 24 * 365)
          return data?.signedUrl || null
        }

        const frontUrl = documentFront
          ? await uploadFile(documentFront, 'front')
          : null
        const backUrl = documentBack
          ? await uploadFile(documentBack, 'back')
          : null
        const selfieUrl = selfie
          ? await uploadFile(selfie, 'selfie')
          : null

        // Crear registro de verificación
        await supabase.from('identity_verifications').insert({
          host_id: host.id,
          document_type: documentType,
          document_number: documentNumber,
          document_front_url: frontUrl,
          document_back_url: backUrl,
          selfie_url: selfieUrl,
          status: 'pending',
        })
      }

      // Enviar notificación al admin
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'new_host_registration',
        title: '¡Bienvenido como anfitrión!',
        message: 'Tu perfil de anfitrión ha sido creado. Estamos revisando tu verificación de identidad.',
        action_url: '/host/dashboard',
      })

      router.push('/host/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al crear tu perfil de anfitrión.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Paso {step} de {TOTAL_STEPS}
        </span>
        <span className="text-sm text-neutral-500">
          {Math.round((step / TOTAL_STEPS) * 100)}% completado
        </span>
      </div>
      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
        <div
          className="h-2 bg-primary-600 rounded-full transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Información personal
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Cuéntanos sobre ti para que los exploradores puedan conocerte.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Nombre que verán los explorers *
        </label>
        <input
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Chef María, Guía Pedro, etc."
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Bio / Descripción *
        </label>
        <textarea
          required
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Cuéntanos tu historia, tu pasión y qué te hace especial como anfitrión..."
          rows={4}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Ciudad donde operas *
        </label>
        <select
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Selecciona una ciudad</option>
          {DR_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Teléfono
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 809 000 0000"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            WhatsApp
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+1 809 000 0000"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Información profesional
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Cuéntanos en qué eres experto.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Especialidades *
        </label>
        <div className="flex flex-wrap gap-2">
          {HOST_SPECIALTIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleItem(s, specialties, setSpecialties)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                specialties.includes(s)
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Idiomas que hablas *
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => toggleItem(l, languages, setLanguages)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                languages.includes(l)
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Años de experiencia
        </label>
        <input
          type="number"
          min={0}
          max={50}
          value={yearsExperience}
          onChange={(e) => setYearsExperience(Number(e.target.value))}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Redes sociales
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Opcional. Ayuda a los explorers a conocerte mejor.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Instagram
        </label>
        <div className="flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <span className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-sm text-neutral-500 border-r border-neutral-200 dark:border-neutral-600">
            instagram.com/
          </span>
          <input
            type="text"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="tuusuario"
            className="flex-1 px-4 py-3 text-sm bg-white dark:bg-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Facebook
        </label>
        <div className="flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <span className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-sm text-neutral-500 border-r border-neutral-200 dark:border-neutral-600">
            facebook.com/
          </span>
          <input
            type="text"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="tuusuario"
            className="flex-1 px-4 py-3 text-sm bg-white dark:bg-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Sitio web
        </label>
        <input
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://tuweb.com"
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Verificación de identidad
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Requerida para generar confianza con los explorers. Tus datos están protegidos.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-4 text-sm text-blue-800 dark:text-blue-200">
        🔒 Tus documentos se almacenan de forma segura y solo son revisados por el equipo DoCoolture.
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Tipo de documento *
        </label>
        <select
          required
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {DOCUMENT_TYPES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Número de documento *
        </label>
        <input
          type="text"
          required
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          placeholder="000-0000000-0"
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {[
        { label: 'Foto frente del documento', setter: setDocumentFront, value: documentFront },
        { label: 'Foto dorso del documento', setter: setDocumentBack, value: documentBack },
        { label: 'Selfie sosteniendo el documento', setter: setSelfie, value: selfie },
      ].map(({ label, setter, value }) => (
        <div key={label}>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setter(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 px-4 py-6 text-sm text-neutral-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
            />
            {value && (
              <p className="mt-1 text-xs text-green-600">
                ✓ {value.name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const canProceed = () => {
    if (step === 1) return displayName && bio && city
    if (step === 2) return specialties.length > 0 && languages.length > 0
    if (step === 3) return true
    if (step === 4) return documentNumber && documentType
    return false
  }

  return (
    <main className="container max-w-2xl mx-auto py-12 px-4 mb-24">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Convertirme en anfitrión
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Comparte tus experiencias con el mundo y genera ingresos haciendo lo que amas.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-8">

        {renderProgressBar()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              ← Volver
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <ButtonPrimary
              onClick={() => setStep((s) => (s + 1) as any)}
              disabled={!canProceed()}
              className="disabled:opacity-50"
            >
              Continuar →
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              onClick={handleSubmit}
              disabled={isLoading || !canProceed()}
              className="disabled:opacity-50"
            >
              {isLoading ? 'Creando perfil...' : '¡Crear mi perfil de anfitrión!'}
            </ButtonPrimary>
          )}
        </div>
      </div>
    </main>
  )
}
