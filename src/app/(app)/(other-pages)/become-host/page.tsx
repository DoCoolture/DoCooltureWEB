'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useLanguage } from '@/context/LanguageContext'
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
  const { t } = useLanguage()
  const bh = t.becomeHost

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Paso 1
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  // Paso 2
  const [specialties, setSpecialties] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [yearsExperience, setYearsExperience] = useState(0)

  // Paso 3
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  // Paso 4
  const [documentType, setDocumentType] = useState('cedula')
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentFront, setDocumentFront] = useState<File | null>(null)
  const [documentBack, setDocumentBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error(bh.notAuthenticated)

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error(bh.profileNotFound)

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

      await supabase
        .from('profiles')
        .update({ role: 'host', phone })
        .eq('user_id', user.id)

      if (documentFront || documentBack || selfie) {
        const uploadFile = async (file: File, type: string) => {
          const ext = file.name.split('.').pop()
          const path = `${user.id}/${type}.${ext}`
          const { error } = await supabase.storage.from('identity-documents').upload(path, file, { upsert: true })
          if (error) return null
          const { data } = await supabase.storage.from('identity-documents').createSignedUrl(path, 3600 * 24 * 365)
          return data?.signedUrl || null
        }

        const frontUrl = documentFront ? await uploadFile(documentFront, 'front') : null
        const backUrl = documentBack ? await uploadFile(documentBack, 'back') : null
        const selfieUrl = selfie ? await uploadFile(selfie, 'selfie') : null

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

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'new_host_registration',
        title: '¡Bienvenido como anfitrión!',
        message: 'Tu perfil de anfitrión ha sido creado. Estamos revisando tu verificación de identidad.',
        action_url: '/host/dashboard',
      })

      router.push('/host/dashboard')
    } catch (err: any) {
      setError(err.message || bh.errorCreating)
    } finally {
      setIsLoading(false)
    }
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {bh.stepOf} {step} {bh.of} {TOTAL_STEPS}
        </span>
        <span className="text-sm text-neutral-500">
          {Math.round((step / TOTAL_STEPS) * 100)}{bh.completed}
        </span>
      </div>
      <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className="h-2 rounded-full bg-primary-600 transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )

  const inputClass = 'w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
  const labelClass = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5'

  const renderStep1 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{bh.step1Title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{bh.step1Subtitle}</p>
      </div>

      <div>
        <label className={labelClass}>{bh.displayName} *</label>
        <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={bh.displayNamePlaceholder} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{bh.bio} *</label>
        <textarea required value={bio} onChange={(e) => setBio(e.target.value)} placeholder={bh.bioPlaceholder} rows={4} className={`${inputClass} resize-none`} />
      </div>

      <div>
        <label className={labelClass}>{bh.city} *</label>
        <select required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
          <option value="">{bh.cityPlaceholder}</option>
          {DR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{bh.phone}</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 809 000 0000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{bh.whatsapp}</label>
          <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+1 809 000 0000" className={inputClass} />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{bh.step2Title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{bh.step2Subtitle}</p>
      </div>

      <div>
        <label className={`${labelClass} mb-3`}>{bh.specialties} *</label>
        <div className="flex flex-wrap gap-2">
          {HOST_SPECIALTIES.map((s) => (
            <button key={s} type="button" onClick={() => toggleItem(s, specialties, setSpecialties)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${specialties.includes(s) ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-3`}>{bh.spokenLanguages} *</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_LANGUAGES.map((l) => (
            <button key={l} type="button" onClick={() => toggleItem(l, languages, setLanguages)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${languages.includes(l) ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>{bh.yearsExperience}</label>
        <input type="number" min={0} max={50} value={yearsExperience} onChange={(e) => setYearsExperience(Number(e.target.value))} className={inputClass} />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{bh.step3Title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{bh.step3Subtitle}</p>
      </div>

      {[
        { label: 'Instagram', prefix: 'instagram.com/', value: instagramUrl, setter: setInstagramUrl },
        { label: 'Facebook', prefix: 'facebook.com/', value: facebookUrl, setter: setFacebookUrl },
      ].map(({ label, prefix, value, setter }) => (
        <div key={label}>
          <label className={labelClass}>{label}</label>
          <div className="flex items-center overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 dark:border-neutral-600 dark:bg-neutral-700">{prefix}</span>
            <input type="text" value={value} onChange={(e) => setter(e.target.value)} placeholder="tuusuario" className="flex-1 bg-white px-4 py-3 text-sm focus:outline-none dark:bg-neutral-900" />
          </div>
        </div>
      ))}

      <div>
        <label className={labelClass}>{bh.website}</label>
        <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://tuweb.com" className={inputClass} />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{bh.step4Title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{bh.step4Subtitle}</p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
        🔒 {bh.securityNote}
      </div>

      <div>
        <label className={labelClass}>{bh.documentType} *</label>
        <select required value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={inputClass}>
          {DOCUMENT_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>{bh.documentNumber} *</label>
        <input type="text" required value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} placeholder="000-0000000-0" className={inputClass} />
      </div>

      {[
        { label: bh.documentFront, setter: setDocumentFront, value: documentFront },
        { label: bh.documentBack, setter: setDocumentBack, value: documentBack },
        { label: bh.selfie, setter: setSelfie, value: selfie },
      ].map(({ label, setter, value }) => (
        <div key={label}>
          <label className={labelClass}>{label}</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setter(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-sm text-neutral-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100 dark:border-neutral-600 dark:bg-neutral-800"
            />
            {value && <p className="mt-1 text-xs text-green-600">✓ {value.name}</p>}
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
    <main className="container mx-auto mb-24 max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{bh.title}</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{bh.subtitle}</p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-lg dark:bg-neutral-800">
        {renderProgressBar()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-700">
          {step > 1 ? (
            <button onClick={() => setStep((s) => (s - 1) as any)} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              {bh.back}
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <ButtonPrimary onClick={() => setStep((s) => (s + 1) as any)} disabled={!canProceed()} className="disabled:opacity-50">
              {bh.continue}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={handleSubmit} disabled={isLoading || !canProceed()} className="disabled:opacity-50">
              {isLoading ? bh.creating : bh.createProfile}
            </ButtonPrimary>
          )}
        </div>
      </div>
    </main>
  )
}
