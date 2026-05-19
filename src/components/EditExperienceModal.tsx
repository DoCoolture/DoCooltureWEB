'use client'

import { supabase, uploadExperienceImage } from '@/lib/supabase'
import { CITY_ADDRESSES, DR_CITIES, DURATION_OPTIONS } from '@/types'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'

const CUSTOM = '__custom__'

const CATEGORIES = [
  'Gastronomía', 'Aventura', 'Cultura', 'Naturaleza', 'Arte', 'Música',
  'Deportes', 'Bienestar', 'Historia', 'Fotografía', 'Idiomas', 'Otro',
]

interface ExperienceData {
  id: string
  title: string
  description: string
  category: string
  price_usd: number
  duration_time: string
  max_guests: number
  address: string
  city: string
  is_published: boolean
  featured_image_url?: string | null
  gallery_urls?: string[] | null
}

interface Props {
  experience: ExperienceData
  onClose: () => void
  onSaved: () => void
}

export default function EditExperienceModal({ experience, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ExperienceData>({ ...experience })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)
  const featuredInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Photo state
  const [featuredUrl, setFeaturedUrl] = useState<string | null>(experience.featured_image_url ?? null)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(experience.gallery_urls ?? [])
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Duration preset state
  const isKnownDuration = (DURATION_OPTIONS as readonly string[]).includes(experience.duration_time)
  const [durationPreset, setDurationPreset] = useState(isKnownDuration ? experience.duration_time : CUSTOM)

  // Address preset state — init to CUSTOM if not a known preset for the city
  const cityAddresses = CITY_ADDRESSES[experience.city] ?? []
  const isKnownAddress = cityAddresses.includes(experience.address)
  const [addressPreset, setAddressPreset] = useState(isKnownAddress ? experience.address : CUSTOM)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (field: keyof ExperienceData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCityChange = (city: string) => {
    set('city', city)
    set('address', '')
    setAddressPreset('')
  }

  const handleDurationPreset = (val: string) => {
    setDurationPreset(val)
    if (val !== CUSTOM) set('duration_time', val)
    else set('duration_time', '')
  }

  const handleAddressPreset = (val: string) => {
    setAddressPreset(val)
    if (val !== CUSTOM) set('address', val)
    else set('address', '')
  }

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploadingFeatured(true)
    const url = await uploadExperienceImage(userId, file, `featured-${Date.now()}.${file.name.split('.').pop()}`)
    if (url) setFeaturedUrl(url)
    setUploadingFeatured(false)
    e.target.value = ''
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !userId) return
    setUploadingGallery(true)
    const uploads = Array.from(files).map((file) =>
      uploadExperienceImage(userId, file, `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`)
    )
    const results = await Promise.all(uploads)
    setGalleryUrls((prev) => [...prev, ...(results.filter(Boolean) as string[])])
    setUploadingGallery(false)
    e.target.value = ''
  }

  const removeGalleryImage = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('El título y la descripción son obligatorios.')
      return
    }
    setSaving(true)
    setError('')

    const { error: err } = await supabase
      .from('experiences')
      .update({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        price_usd: Number(form.price_usd),
        duration_time: form.duration_time.trim(),
        max_guests: Number(form.max_guests),
        address: form.address.trim(),
        city: form.city.trim(),
        is_published: form.is_published,
        featured_image_url: featuredUrl,
        gallery_urls: galleryUrls,
      })
      .eq('id', form.id)

    setSaving(false)
    if (err) {
      setError('Error al guardar: ' + err.message)
    } else {
      onSaved()
      onClose()
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  const currentCityAddresses = CITY_ADDRESSES[form.city] ?? []

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Editar experiencia
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <XMarkIcon className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Título</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Categoría</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Precio (USD)</label>
              <input
                type="number" min={0} value={form.price_usd}
                onChange={(e) => set('price_usd', Number(e.target.value))}
                className={inputCls}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Duración</label>
              <select value={durationPreset} onChange={(e) => handleDurationPreset(e.target.value)} className={inputCls}>
                <option value="">Seleccionar duración...</option>
                {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                <option value={CUSTOM}>✏️ Escribir duración personalizada...</option>
              </select>
              {durationPreset === CUSTOM && (
                <input
                  type="text"
                  placeholder="ej. 3–4 horas"
                  value={form.duration_time}
                  onChange={(e) => set('duration_time', e.target.value)}
                  className={`${inputCls} mt-2`}
                />
              )}
            </div>

            {/* Max guests */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Máximo de personas</label>
              <input
                type="number" min={1} value={form.max_guests}
                onChange={(e) => set('max_guests', Number(e.target.value))}
                className={inputCls}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Ciudad</label>
              <select value={form.city} onChange={(e) => handleCityChange(e.target.value)} className={inputCls}>
                <option value="">Seleccionar ciudad...</option>
                {DR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Dirección</label>
              {currentCityAddresses.length > 0 ? (
                <>
                  <select value={addressPreset} onChange={(e) => handleAddressPreset(e.target.value)} className={inputCls}>
                    <option value="">Seleccionar dirección...</option>
                    {currentCityAddresses.map((a) => <option key={a} value={a}>{a}</option>)}
                    <option value={CUSTOM}>✏️ Escribir dirección personalizada...</option>
                  </select>
                  {addressPreset === CUSTOM && (
                    <input
                      type="text"
                      placeholder="Escribe la dirección"
                      value={form.address}
                      onChange={(e) => set('address', e.target.value)}
                      className={`${inputCls} mt-2`}
                    />
                  )}
                </>
              ) : (
                <input
                  type="text"
                  placeholder="Escribe la dirección"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  className={inputCls}
                />
              )}
            </div>

            {/* Published */}
            <div className="sm:col-span-2 flex items-center gap-x-3">
              <input
                id="is_published" type="checkbox" checked={form.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
                className="size-4 rounded border-neutral-300"
              />
              <label htmlFor="is_published" className="text-sm text-neutral-700 dark:text-neutral-300">
                Experiencia publicada (visible para explorers)
              </label>
            </div>
          </div>

          {/* ── FOTOS ── */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Fotos</h3>

            {/* Foto principal */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Foto principal
              </label>
              {featuredUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featuredUrl} alt="Foto principal" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFeaturedUrl(null)}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 text-sm">
                  Sin foto principal
                </div>
              )}
              <input
                ref={featuredInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFeaturedUpload}
              />
              <button
                type="button"
                disabled={uploadingFeatured || !userId}
                onClick={() => featuredInputRef.current?.click()}
                className="mt-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                {uploadingFeatured ? 'Subiendo...' : featuredUrl ? 'Cambiar foto principal' : 'Subir foto principal'}
              </button>
            </div>

            {/* Galería */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Galería ({galleryUrls.length} fotos)
              </label>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {galleryUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                      >
                        <XMarkIcon className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
              <button
                type="button"
                disabled={uploadingGallery || !userId}
                onClick={() => galleryInputRef.current?.click()}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                {uploadingGallery ? 'Subiendo...' : '+ Agregar fotos a la galería'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-x-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
