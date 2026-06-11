'use client'

import { updateExperience } from '@/app/actions/experiences'
import { supabase, uploadExperienceImage } from '@/lib/supabase'
import {
  CITY_ADDRESSES, DR_CITIES, DURATION_OPTIONS,
  AVAILABLE_LANGUAGES, DAYS_OF_WEEK, EXPERIENCE_CATEGORIES,
} from '@/types'
import LocationPickerMap from '@/components/LocationPickerMap'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Image from 'next/image'

const CUSTOM = '__custom__'

const INCLUDES_SUGGESTIONS = [
  'Guía bilingüe certificado', 'Degustaciones locales', 'Seguro de actividad',
  'Agua y refrescos', 'Transporte interno', 'Equipo de seguridad',
  'Foto del recuerdo', 'Material didáctico', 'Entrada a sitios turísticos',
  'Desayuno incluido', 'Almuerzo típico', 'Snacks locales',
]

const EXCLUDES_SUGGESTIONS = [
  'Transporte al punto de encuentro', 'Bebidas alcohólicas', 'Propinas',
  'Souvenirs', 'Seguro de viaje personal', 'Comidas adicionales',
  'Gastos personales', 'Alojamiento', 'Vuelos',
]

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

interface ExperienceData {
  id: string
  title: string
  short_description?: string | null
  description: string
  category: string
  tags?: string[] | null
  price_usd: number
  duration_time: string
  max_guests: number
  min_guests?: number
  meeting_point?: string | null
  address: string
  city: string
  is_published: boolean
  featured_image_url?: string | null
  gallery_urls?: string[] | null
  price_includes?: string[] | null
  price_excludes?: string[] | null
  available_days?: string[] | null
  available_times?: string[] | null
  languages?: string[] | null
  latitude?: number | null
  longitude?: number | null
}

interface Props {
  experience: ExperienceData
  onClose: () => void
  onSaved: () => void
}

export default function EditExperienceModal({ experience, onClose, onSaved }: Props) {
  const { t } = useLanguage()
  const te = t.editExperience
  const [form, setForm] = useState<ExperienceData>({ ...experience })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isDirty = useRef(false)
  const submitGuard = useRef(false)
  const onCloseRef = useRef(onClose)
  const overlayRef = useRef<HTMLDivElement>(null)
  const featuredInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Photo state
  const [featuredUrl, setFeaturedUrl] = useState<string | null>(experience.featured_image_url ?? null)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(experience.gallery_urls ?? [])
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Map state
  const [latitude, setLatitude] = useState<number | null>(experience.latitude ?? null)
  const [longitude, setLongitude] = useState<number | null>(experience.longitude ?? null)

  // Array field state
  const [tags, setTags] = useState<string[]>(experience.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [languages, setLanguages] = useState<string[]>(experience.languages ?? [])
  const [priceIncludes, setPriceIncludes] = useState<string[]>(experience.price_includes ?? [])
  const [priceExcludes, setPriceExcludes] = useState<string[]>(experience.price_excludes ?? [])
  const [includeInput, setIncludeInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')
  const [availableDays, setAvailableDays] = useState<string[]>(experience.available_days ?? [])
  const [availableTimes, setAvailableTimes] = useState<string[]>(experience.available_times ?? [])
  const [timeHour, setTimeHour] = useState('')
  const [timeMinute, setTimeMinute] = useState('00')

  // Duration preset
  const isKnownDuration = (DURATION_OPTIONS as readonly string[]).includes(experience.duration_time)
  const [durationPreset, setDurationPreset] = useState(isKnownDuration ? experience.duration_time : CUSTOM)

  // Address preset
  const cityAddresses = CITY_ADDRESSES[experience.city] ?? []
  const isKnownAddress = cityAddresses.includes(experience.address)
  const [addressPreset, setAddressPreset] = useState(isKnownAddress ? experience.address : CUSTOM)

  // Re-sync all state when the experience prop changes (parent refresh)
  useEffect(() => {
    setForm({ ...experience })
    setFeaturedUrl(experience.featured_image_url ?? null)
    setGalleryUrls(experience.gallery_urls ?? [])
    setLatitude(experience.latitude ?? null)
    setLongitude(experience.longitude ?? null)
    setTags(experience.tags ?? [])
    setLanguages(experience.languages ?? [])
    setPriceIncludes(experience.price_includes ?? [])
    setPriceExcludes(experience.price_excludes ?? [])
    setAvailableDays(experience.available_days ?? [])
    setAvailableTimes(experience.available_times ?? [])
    const known = (DURATION_OPTIONS as readonly string[]).includes(experience.duration_time)
    setDurationPreset(known ? experience.duration_time : CUSTOM)
    const addrs = CITY_ADDRESSES[experience.city] ?? []
    setAddressPreset(addrs.includes(experience.address) ? experience.address : CUSTOM)
    isDirty.current = false
  }, [experience.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep ref in sync so the keyboard listener always sees the latest onClose
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDirty.current && !window.confirm(te.unsavedChanges)) return
        onCloseRef.current()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [te.unsavedChanges])

  const markDirty = () => { isDirty.current = true }

  const handleClose = () => {
    if (isDirty.current && !window.confirm(te.unsavedChanges)) return
    onClose()
  }

  const set = (field: keyof ExperienceData, value: string | number | boolean | string[] | null) => {
    markDirty()
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCityChange = (city: string) => {
    markDirty()
    setForm((prev) => ({ ...prev, city, address: '' }))
    setAddressPreset('')
  }

  const handleDurationPreset = (val: string) => {
    markDirty()
    setDurationPreset(val)
    if (val !== CUSTOM) setForm((prev) => ({ ...prev, duration_time: val }))
    else setForm((prev) => ({ ...prev, duration_time: '' }))
  }

  const handleAddressPreset = (val: string) => {
    markDirty()
    setAddressPreset(val)
    if (val !== CUSTOM) setForm((prev) => ({ ...prev, address: val }))
    else setForm((prev) => ({ ...prev, address: '' }))
  }

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void) => {
    markDirty()
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const addTag = () => {
    const v = tagInput.trim()
    if (v && !tags.includes(v)) { setTags([...tags, v]); setTagInput(''); markDirty() }
  }

  const addInclude = () => {
    const v = includeInput.trim()
    if (v && !priceIncludes.includes(v)) { setPriceIncludes([...priceIncludes, v]); setIncludeInput(''); markDirty() }
  }

  const addExclude = () => {
    const v = excludeInput.trim()
    if (v && !priceExcludes.includes(v)) { setPriceExcludes([...priceExcludes, v]); setExcludeInput(''); markDirty() }
  }

  const addTime = () => {
    if (!timeHour) return
    const time = `${timeHour}:${timeMinute}`
    if (!availableTimes.includes(time)) { setAvailableTimes([...availableTimes, time]); markDirty() }
  }

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploadingFeatured(true)
    const url = await uploadExperienceImage(userId, file, `featured-${Date.now()}.${file.name.split('.').pop()}`)
    if (url) { setFeaturedUrl(url); markDirty() }
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
    const succeeded = results.filter(Boolean) as string[]
    if (succeeded.length) { setGalleryUrls((prev) => [...prev, ...succeeded]); markDirty() }
    setUploadingGallery(false)
    e.target.value = ''
  }

  const removeGalleryImage = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index))
    markDirty()
  }

  const handleSave = async () => {
    if (submitGuard.current) return

    if (!form.title.trim() || form.title.trim().length < 5) {
      setError(te.errorTitleMin)
      return
    }
    if (!form.description.trim() || form.description.trim().length < 20) {
      setError(te.errorDescMin)
      return
    }
    if (Number(form.price_usd) <= 0) {
      setError(te.errorPrice)
      return
    }
    if (Number(form.max_guests) < 1) {
      setError(te.errorMaxGuests)
      return
    }
    if (!form.duration_time.trim()) {
      setError(te.errorDuration)
      return
    }
    if (!form.city.trim()) {
      setError(te.errorCity)
      return
    }
    if (!form.address.trim()) {
      setError(te.errorAddress)
      return
    }

    submitGuard.current = true
    setSaving(true)
    setError('')

    try {
      const result = await updateExperience({
        id: form.id,
        title: form.title,
        shortDescription: form.short_description ?? null,
        description: form.description,
        category: form.category,
        tags,
        priceUsd: Number(form.price_usd),
        durationTime: form.duration_time,
        maxGuests: Number(form.max_guests),
        minGuests: Number(form.min_guests ?? 1),
        meetingPoint: form.meeting_point ?? null,
        address: form.address,
        city: form.city,
        isPublished: form.is_published,
        featuredImageUrl: featuredUrl,
        galleryUrls,
        languages: form.languages ?? [],
        priceIncludes,
        priceExcludes,
        availableDays,
        availableTimes,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      })

      if (result.error) {
        setError(te.errorSave + result.error)
      } else {
        isDirty.current = false
        onSaved()
        onClose()
      }
    } catch {
      setError(te.errorConnection)
    } finally {
      setSaving(false)
      submitGuard.current = false
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
  const currentCityAddresses = CITY_ADDRESSES[form.city] ?? []

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === overlayRef.current) handleClose() }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{te.title}</h2>
          <button onClick={handleClose} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">{error}</p>
          )}

          {/* ── Información básica ── */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{te.sectionBasicInfo}</h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldTitle} *</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldShortDesc}</label>
              <input
                type="text"
                value={form.short_description ?? ''}
                onChange={(e) => set('short_description', e.target.value)}
                placeholder={te.fieldShortDescPlaceholder}
                className={inputCls}
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldDescription} *</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{te.fieldCategory}</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_CATEGORIES.map((cat) => (
                  <button key={cat} type="button"
                    onClick={() => set('category', cat)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${form.category === cat ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldTags}</label>
              <div className="flex gap-x-2">
                <input type="text" value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder={te.fieldTagsPlaceholder}
                  className={`flex-1 ${inputCls}`}
                />
                <button type="button" onClick={addTag} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">{te.addBtn}</button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-x-1 rounded-full bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 px-3 py-1 text-sm text-primary-700 dark:text-primary-300">
                      {tag}
                      <button onClick={() => { setTags(tags.filter((t) => t !== tag)); markDirty() }} className="text-primary-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Detalles ── */}
          <section className="space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-5">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{te.sectionDetails}</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldDuration} *</label>
                <select value={durationPreset} onChange={(e) => handleDurationPreset(e.target.value)} className={inputCls}>
                  <option value="">{te.selectPlaceholder}</option>
                  {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  <option value={CUSTOM}>{te.customOption}</option>
                </select>
                {durationPreset === CUSTOM && (
                  <input type="text" placeholder={te.fieldDurationCustomPlaceholder} value={form.duration_time}
                    onChange={(e) => set('duration_time', e.target.value)} className={`${inputCls} mt-2`} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldCity} *</label>
                <select value={form.city} onChange={(e) => handleCityChange(e.target.value)} className={inputCls}>
                  <option value="">{te.selectCityPlaceholder}</option>
                  {DR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldMinExplorers}</label>
                <input type="number" min={1} value={form.min_guests ?? 1}
                  onChange={(e) => set('min_guests', Number(e.target.value))} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldMaxExplorers} *</label>
                <input type="number" min={1} value={form.max_guests}
                  onChange={(e) => set('max_guests', Number(e.target.value))} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldAddress} *</label>
              {currentCityAddresses.length > 0 ? (
                <>
                  <select value={addressPreset} onChange={(e) => handleAddressPreset(e.target.value)} className={inputCls}>
                    <option value="">{te.selectPlaceholder}</option>
                    {currentCityAddresses.map((a) => <option key={a} value={a}>{a}</option>)}
                    <option value={CUSTOM}>{te.customOption}</option>
                  </select>
                  {addressPreset === CUSTOM && (
                    <input type="text" placeholder={te.fieldAddressPlaceholder} value={form.address}
                      onChange={(e) => set('address', e.target.value)} className={`${inputCls} mt-2`} />
                  )}
                </>
              ) : (
                <input type="text" placeholder={te.fieldAddressPlaceholder} value={form.address}
                  onChange={(e) => set('address', e.target.value)} className={inputCls} />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldMeetingPoint}</label>
              <textarea
                value={form.meeting_point ?? ''}
                onChange={(e) => set('meeting_point', e.target.value)}
                rows={3}
                placeholder={te.fieldMeetingPointPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{te.fieldLanguages}</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((l) => (
                  <button key={l} type="button"
                    onClick={() => toggleItem(l, languages, setLanguages)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${languages.includes(l) ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Precio ── */}
          <section className="space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-5">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{te.sectionPrice}</h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldPrice} *</label>
              <input type="number" min={0} value={form.price_usd}
                onChange={(e) => set('price_usd', Number(e.target.value))} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldIncludes} ({priceIncludes.length})</label>
              <div className="flex gap-x-2">
                <input type="text" value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                  placeholder={te.fieldIncludesPlaceholder}
                  className={`flex-1 ${inputCls}`}
                />
                <button type="button" onClick={addInclude} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">{te.addBtnShort}</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {INCLUDES_SUGGESTIONS.filter((s) => !priceIncludes.includes(s)).map((s) => (
                  <button key={s} type="button"
                    onClick={() => { setPriceIncludes((p) => [...p, s]); markDirty() }}
                    className="rounded-full border border-neutral-200 dark:border-neutral-600 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:border-green-500 hover:text-green-600 transition-colors"
                  >+ {s}</button>
                ))}
              </div>
              {priceIncludes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {priceIncludes.map((item) => (
                    <li key={item} className="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-950 px-3 py-1.5 text-sm text-green-700 dark:text-green-400">
                      <span>✅ {item}</span>
                      <button onClick={() => { setPriceIncludes(priceIncludes.filter((i) => i !== item)); markDirty() }} className="text-neutral-400 hover:text-red-500 ml-2">×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldExcludes} <span className="text-xs text-neutral-400">({te.optional})</span></label>
              <div className="flex gap-x-2">
                <input type="text" value={excludeInput}
                  onChange={(e) => setExcludeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
                  placeholder={te.fieldExcludesPlaceholder}
                  className={`flex-1 ${inputCls}`}
                />
                <button type="button" onClick={addExclude} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">{te.addBtnShort}</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {EXCLUDES_SUGGESTIONS.filter((s) => !priceExcludes.includes(s)).map((s) => (
                  <button key={s} type="button"
                    onClick={() => { setPriceExcludes((p) => [...p, s]); markDirty() }}
                    className="rounded-full border border-neutral-200 dark:border-neutral-600 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:border-red-400 hover:text-red-600 transition-colors"
                  >+ {s}</button>
                ))}
              </div>
              {priceExcludes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {priceExcludes.map((item) => (
                    <li key={item} className="flex items-center justify-between rounded-lg bg-red-50 dark:bg-red-950 px-3 py-1.5 text-sm text-red-600 dark:text-red-400">
                      <span>❌ {item}</span>
                      <button onClick={() => { setPriceExcludes(priceExcludes.filter((i) => i !== item)); markDirty() }} className="text-neutral-400 hover:text-red-500 ml-2">×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* ── Disponibilidad ── */}
          <section className="space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-5">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{te.sectionAvailability}</h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{te.fieldAvailableDays}</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button key={day} type="button"
                    onClick={() => toggleItem(day, availableDays, setAvailableDays)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${availableDays.includes(day) ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{te.fieldSchedule} <span className="text-xs text-neutral-400">({te.optional})</span></label>
              <div className="flex gap-x-2 items-center">
                <div className="flex flex-1 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <select value={timeHour} onChange={(e) => setTimeHour(e.target.value)}
                    className="flex-1 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm focus:outline-none border-r border-neutral-200 dark:border-neutral-700">
                    <option value="">HH</option>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="flex items-center px-2 text-neutral-400 bg-white dark:bg-neutral-800 text-sm">:</span>
                  <select value={timeMinute} onChange={(e) => setTimeMinute(e.target.value)}
                    className="flex-1 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm focus:outline-none">
                    {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <button type="button" onClick={addTime} disabled={!timeHour}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40">
                  {te.addBtn}
                </button>
              </div>
              {availableTimes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTimes.sort().map((time) => (
                    <span key={time} className="inline-flex items-center gap-x-1 rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 text-sm">
                      🕐 {time}
                      <button onClick={() => { setAvailableTimes(availableTimes.filter((t) => t !== time)); markDirty() }} className="text-neutral-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Mapa ── */}
          <section className="space-y-2 border-t border-neutral-200 dark:border-neutral-700 pt-5">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{te.sectionMap}</h3>
            <p className="text-xs text-neutral-400">{te.mapHint}</p>
            <LocationPickerMap
              lat={latitude}
              lng={longitude}
              onChange={(coords) => {
                setLatitude(coords?.lat ?? null)
                setLongitude(coords?.lng ?? null)
                markDirty()
              }}
            />
          </section>

          {/* ── Fotos ── */}
          <section className="space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-5">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{te.sectionPhotos}</h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{te.fieldFeaturedPhoto}</label>
              {featuredUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image src={featuredUrl} alt={te.fieldFeaturedPhoto} fill sizes="(max-width: 640px) 100vw, 600px" className="object-cover" />
                  <button type="button" onClick={() => { setFeaturedUrl(null); markDirty() }}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 text-sm">
                  {te.noFeaturedPhoto}
                </div>
              )}
              <input ref={featuredInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFeaturedUpload} />
              <button type="button" disabled={uploadingFeatured || !userId} onClick={() => featuredInputRef.current?.click()}
                className="mt-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50">
                {uploadingFeatured ? te.uploading : featuredUrl ? te.changeFeatured : te.uploadFeatured}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{te.fieldGallery} ({galleryUrls.length} {te.photos})</label>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {galleryUrls.map((url, i) => (
                    <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image src={url} alt={`${te.fieldGallery} ${i + 1}`} fill sizes="(max-width: 640px) 33vw, 200px" className="object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80">
                        <XMarkIcon className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleGalleryUpload} />
              <button type="button" disabled={uploadingGallery || !userId} onClick={() => galleryInputRef.current?.click()}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50">
                {uploadingGallery ? te.uploading : te.addGallery}
              </button>
            </div>
          </section>

          {/* ── Publicación ── */}
          <section className="border-t border-neutral-200 dark:border-neutral-700 pt-5">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">{te.sectionPublication}</h3>
            <div className="flex items-center gap-x-3">
              <input id="is_published" type="checkbox" checked={form.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
                className="size-4 rounded border-neutral-300" />
              <label htmlFor="is_published" className="text-sm text-neutral-700 dark:text-neutral-300">
                {te.isPublished}
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-x-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 py-4">
          <button onClick={handleClose}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800">
            {te.cancelBtn}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
            {saving ? te.savingBtn : te.saveBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
