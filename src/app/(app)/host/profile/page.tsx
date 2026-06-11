'use client'

import { supabase, uploadAvatar } from '@/lib/supabase'
import type { Host } from '@/lib/supabase'
import { updateHostProfile } from '@/app/actions/host'
import { DR_CITIES } from '@/types'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function HostProfilePage() {
  const router = useRouter()
  const [host, setHost] = useState<Host | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const saveGuard = useRef(false)

  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    city: '',
    country: 'Dominican Republic',
    whatsapp: '',
    instagram_url: '',
    facebook_url: '',
    website_url: '',
    avatar_url: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)

    const { data: hostData } = await supabase
      .from('hosts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!hostData) { router.push('/become-host'); return }

    setHost(hostData)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('avatar_url, display_name, city, about_me')
      .eq('user_id', user.id)
      .single()

    setForm({
      display_name: profileData?.display_name || hostData.display_name || '',
      bio: hostData.bio || profileData?.about_me || '',
      city: profileData?.city || hostData.city || '',
      country: hostData.country ?? 'Dominican Republic',
      whatsapp: hostData.whatsapp ?? '',
      instagram_url: hostData.instagram_url ?? '',
      facebook_url: hostData.facebook_url ?? '',
      website_url: hostData.website_url ?? '',
      avatar_url: profileData?.avatar_url ?? '',
    })
    setIsLoading(false)
  }

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploadingAvatar(true)
    const url = await uploadAvatar(userId, file)
    if (url) {
      setForm((prev) => ({ ...prev, avatar_url: url }))
    }
    setUploadingAvatar(false)
    e.target.value = ''
  }

  const isValidUrl = (url: string) => {
    if (!url.trim()) return true
    try { return ['https:', 'http:'].includes(new URL(url).protocol) } catch { return false }
  }

  const handleSave = async () => {
    if (!host || saveGuard.current) return
    if (!form.display_name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    if (!isValidUrl(form.instagram_url)) { setError('La URL de Instagram no es válida.'); return }
    if (!isValidUrl(form.facebook_url)) { setError('La URL de Facebook no es válida.'); return }
    if (!isValidUrl(form.website_url)) { setError('La URL del sitio web no es válida.'); return }
    saveGuard.current = true
    setSaving(true)
    setError('')

    const result = await updateHostProfile({
      displayName: form.display_name,
      bio: form.bio,
      city: form.city,
      country: form.country,
      whatsapp: form.whatsapp,
      instagramUrl: form.instagram_url,
      facebookUrl: form.facebook_url,
      websiteUrl: form.website_url,
      avatarUrl: form.avatar_url,
    })

    setSaving(false)
    saveGuard.current = false
    if (result.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <main className="container max-w-2xl mx-auto py-12 px-4 mb-24">
      <div className="flex items-center gap-x-4 mb-8">
        <button
          onClick={() => router.push('/host/dashboard')}
          className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Editar perfil de anfitrión
        </h1>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        {saved && (
          <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            ✅ Perfil guardado correctamente.
          </p>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-x-5">
          <div className="relative size-20 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
            {form.avatar_url ? (
              <Image src={form.avatar_url} alt="Avatar" fill className="object-cover" sizes="80px" />
            ) : (
              <div className="flex items-center justify-center h-full text-3xl text-neutral-400">
                {form.display_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Foto de perfil</p>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              type="button"
              disabled={uploadingAvatar || !userId}
              onClick={() => avatarInputRef.current?.click()}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Nombre público *
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => set('display_name', e.target.value)}
              className={inputCls}
              placeholder="Tu nombre o nombre del negocio"
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Descripción / Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              rows={4}
              className={`${inputCls} resize-none`}
              placeholder="Cuéntales a los explorers quién eres..."
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Ciudad</label>
            <select value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls}>
              <option value="">Seleccionar ciudad...</option>
              {DR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">País</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              className={inputCls}
              placeholder="República Dominicana"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">WhatsApp</label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              className={inputCls}
              placeholder="+1 809 000 0000"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Instagram</label>
            <input
              type="url"
              value={form.instagram_url}
              onChange={(e) => set('instagram_url', e.target.value)}
              className={inputCls}
              placeholder="https://instagram.com/tu_perfil"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Facebook</label>
            <input
              type="url"
              value={form.facebook_url}
              onChange={(e) => set('facebook_url', e.target.value)}
              className={inputCls}
              placeholder="https://facebook.com/tu_perfil"
            />
          </div>

          {/* Sitio web */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Sitio web</label>
            <input
              type="url"
              value={form.website_url}
              onChange={(e) => set('website_url', e.target.value)}
              className={inputCls}
              placeholder="https://tu-sitio.com"
            />
          </div>
        </div>

        {/* Estado de verificación (solo lectura) */}
        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-3 flex items-center gap-x-3 text-sm">
          {host?.is_verified ? (
            <>
              <span className="text-green-600 text-lg">✅</span>
              <span className="text-neutral-700 dark:text-neutral-300">Identidad verificada</span>
            </>
          ) : (
            <>
              <span className="text-amber-500 text-lg">⏳</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                Verificación pendiente — DoCoolture revisará tu identidad en 24–48 horas.
              </span>
            </>
          )}
        </div>

        <div className="flex justify-end gap-x-3 pt-2">
          <button
            onClick={() => router.push('/host/dashboard')}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </main>
  )
}
