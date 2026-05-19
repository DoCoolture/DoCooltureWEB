'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { supabase, uploadExperienceImage } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  EXPERIENCE_CATEGORIES,
  AVAILABLE_LANGUAGES,
  DAYS_OF_WEEK,
  DR_CITIES,
  CITY_ADDRESSES,
  DURATION_OPTIONS,
} from '@/types'

const TOTAL_STEPS = 5

const TAG_SUGGESTIONS: Record<string, string[]> = {
  'Gastronomía':        ['cocina criolla', 'mercado local', 'degustación', 'cacao', 'ron', 'café', 'mariscos', 'chef', 'recetas tradicionales', 'street food'],
  'Tour Cultural':      ['zona colonial', 'historia', 'patrimonio', 'arte', 'tradiciones', 'folklore', 'comunidad', 'guía local', 'arquitectura', 'museos'],
  'Arte y Artesanía':   ['artesanía', 'pintura', 'cerámica', 'tejidos', 'taller', 'manualidades', 'souvenirs', 'merengue', 'larimar', 'ámbar'],
  'Música y Baile':     ['merengue', 'bachata', 'salsa', 'música en vivo', 'clases de baile', 'tambores', 'palos', 'carnaval', 'ritmo', 'cultura afro'],
  'Aventura y Naturaleza': ['senderismo', 'cascadas', 'montaña', 'río', 'naturaleza', 'ecoturismo', 'fauna', 'flora', 'camping', 'rapel'],
  'Tours Históricos':   ['colonia', 'fortaleza', 'Ozama', 'primera catedral', 'Cristóbal Colón', 'taíno', 'historia dominicana', 'siglo XVI', 'patrimonial', 'UNESCO'],
  'Bienestar':          ['yoga', 'meditación', 'spa', 'playa', 'relajación', 'retiro', 'respiración', 'bienestar', 'mindfulness', 'naturaleza'],
  'Fotografía':         ['fotografía', 'atardecer', 'paisajes', 'arquitectura', 'retrato', 'street photography', 'lightroom', 'composición', 'edición', 'Instagram'],
  'Clases y Talleres':  ['taller', 'clase', 'aprender', 'español', 'cocina', 'arte', 'música', 'baile', 'manualidades', 'certificado'],
  'Vida Nocturna':      ['noche', 'cocteles', 'bares', 'música en vivo', 'gastronomía nocturna', 'clubes', 'bachata', 'ambiente', 'rooftop', 'zona rosa'],
  default:              ['familiar', 'para parejas', 'grupos', 'sol y playa', 'aventura', 'cultural', 'gastronómico', 'histórico', 'fotográfico', 'único'],
}

const onlyPositiveNum = (v: string) => v.replace(/[^0-9.]/g, '')

type FieldErrors = Record<string, string>

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

export default function NewExperiencePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [hostChecked, setHostChecked] = useState(false)
  const [hasHostProfile, setHasHostProfile] = useState(false)

  useEffect(() => {
    const checkHost = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: host } = await supabase.from('hosts').select('id').eq('user_id', user.id).single()
      setHasHostProfile(!!host)
      setHostChecked(true)
    }
    checkHost()
  }, [])

  // Paso 1
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Paso 2
  const [durationTime, setDurationTime] = useState('')
  const [durationPreset, setDurationPreset] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [maxGuests, setMaxGuests] = useState(10)
  const [minGuests, setMinGuests] = useState(1)
  const [meetingPoint, setMeetingPoint] = useState('')
  const [address, setAddress] = useState('')
  const [addressPreset, setAddressPreset] = useState('')
  const [city, setCity] = useState('')

  // Paso 3
  const [priceUsd, setPriceUsd] = useState('')
  const [priceIncludes, setPriceIncludes] = useState<string[]>([])
  const [priceExcludes, setPriceExcludes] = useState<string[]>([])
  const [includeInput, setIncludeInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')

  // Paso 4 — imágenes con drag & drop
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [isDraggingFeatured, setIsDraggingFeatured] = useState(false)
  const [isDraggingGallery, setIsDraggingGallery] = useState(false)

  // Paso 5 — hora con selects personalizados
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [timeHour, setTimeHour] = useState('')
  const [timeMinute, setTimeMinute] = useState('00')

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const addTag = () => {
    const v = tagInput.trim()
    if (v && !tags.includes(v)) { setTags([...tags, v]); setTagInput('') }
  }
  const addInclude = () => {
    const v = includeInput.trim()
    if (v && !priceIncludes.includes(v)) { setPriceIncludes([...priceIncludes, v]); setIncludeInput('') }
  }
  const addExclude = () => {
    const v = excludeInput.trim()
    if (v && !priceExcludes.includes(v)) { setPriceExcludes([...priceExcludes, v]); setExcludeInput('') }
  }
  const addTime = () => {
    if (!timeHour) return
    const time = `${timeHour}:${timeMinute}`
    if (!availableTimes.includes(time)) {
      setAvailableTimes([...availableTimes, time])
      setFieldErrors((p) => ({ ...p, availableDays: '' }))
    }
  }

  const handleFeaturedImage = (file: File) => {
    setFeaturedImage(file)
    setFeaturedImagePreview(URL.createObjectURL(file))
    setFieldErrors((p) => ({ ...p, featuredImage: '' }))
  }

  const handleGalleryImages = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 10 - galleryImages.length)
    if (!newFiles.length) return
    setGalleryImages((prev) => [...prev, ...newFiles])
    setGalleryPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))])
  }

  // Drag & drop handlers
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation() }

  const onDropFeatured = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFeatured(false)
    const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'))
    if (file) handleFeaturedImage(file)
  }

  const onDropGallery = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingGallery(false)
    handleGalleryImages(Array.from(e.dataTransfer.files))
  }

  const generateHandle = (t: string) =>
    t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
     .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60)

  // ── Validación ───────────────────────────────────────────────────────────
  const validateStep = (s: number): FieldErrors => {
    const errs: FieldErrors = {}
    if (s === 1) {
      if (!title.trim()) errs.title = 'El título es requerido.'
      else if (title.trim().length < 5) errs.title = 'Mínimo 5 caracteres.'
      else if (title.trim().length > 100) errs.title = 'Máximo 100 caracteres.'
      if (!shortDescription.trim()) errs.shortDescription = 'La descripción corta es requerida.'
      else if (shortDescription.trim().length < 10) errs.shortDescription = 'Mínimo 10 caracteres.'
      if (!description.trim()) errs.description = 'La descripción completa es requerida.'
      else if (description.trim().length < 50) errs.description = 'Mínimo 50 caracteres.'
      if (!category) errs.category = 'Selecciona una categoría.'
    }
    if (s === 2) {
      if (!durationTime.trim()) errs.durationTime = 'La duración es requerida.'
      if (minGuests < 1) errs.minGuests = 'Mínimo 1 explorer.'
      if (maxGuests < minGuests) errs.maxGuests = 'El máximo debe ser mayor o igual al mínimo.'
      if (!address.trim()) errs.address = 'La dirección es requerida.'
      if (!meetingPoint.trim()) errs.meetingPoint = 'Las instrucciones de encuentro son requeridas.'
      else if (meetingPoint.trim().length < 10) errs.meetingPoint = 'Mínimo 10 caracteres.'
      if (!city) errs.city = 'Selecciona una ciudad.'
      if (languages.length === 0) errs.languages = 'Selecciona al menos un idioma.'
    }
    if (s === 3) {
      const price = Number(priceUsd)
      if (!priceUsd) errs.priceUsd = 'El precio es requerido.'
      else if (isNaN(price) || price <= 0) errs.priceUsd = 'El precio debe ser mayor a 0.'
      else if (price > 100000) errs.priceUsd = 'Precio demasiado alto.'
      if (priceIncludes.length === 0) errs.priceIncludes = 'Agrega al menos un ítem de lo que incluye.'
    }
    if (s === 4) {
      if (!featuredImage) errs.featuredImage = 'La imagen principal es requerida.'
    }
    if (s === 5) {
      if (availableDays.length === 0) errs.availableDays = 'Selecciona al menos un día disponible.'
    }
    return errs
  }

  const handleNext = () => {
    const errs = validateStep(step)
    setFieldErrors(errs)
    if (Object.keys(errs).length === 0) setStep((s) => (s + 1) as any)
  }

  const handleSubmit = async () => {
    const errs = validateStep(step)
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data: host } = await supabase.from('hosts').select('id').eq('user_id', user.id).single()
      if (!host) throw new Error('Necesitas un perfil de anfitrión. Ve a /become-host para crearlo.')

      let featuredImageUrl = null
      if (featuredImage) {
        featuredImageUrl = await uploadExperienceImage(
          user.id, featuredImage,
          `featured-${Date.now()}.${featuredImage.name.split('.').pop()}`
        )
      }

      const galleryUrls: string[] = []
      for (const img of galleryImages) {
        const url = await uploadExperienceImage(
          user.id, img,
          `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${img.name.split('.').pop()}`
        )
        if (url) galleryUrls.push(url)
      }

      const handle = generateHandle(title)
      const { error: expError } = await supabase.from('experiences').insert({
        host_id: host.id, title, handle, description,
        short_description: shortDescription, category, tags,
        duration_time: durationTime, languages,
        max_guests: maxGuests, min_guests: minGuests,
        meeting_point: meetingPoint, address, city,
        price_usd: Number(priceUsd),
        price_includes: priceIncludes, price_excludes: priceExcludes,
        featured_image_url: featuredImageUrl, gallery_urls: galleryUrls,
        available_days: availableDays, available_times: availableTimes,
        is_published: true, is_hidden: false,
      })
      if (expError) throw expError

      router.push('/host/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al crear la experiencia.')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return title && description && category
    if (step === 2) return durationTime && languages.length > 0 && address && city && meetingPoint
    if (step === 3) return Number(priceUsd) > 0 && priceIncludes.length > 0
    if (step === 4) return featuredImage !== null
    if (step === 5) return availableDays.length > 0
    return false
  }

  // ── Clases ───────────────────────────────────────────────────────────────
  const base = 'w-full rounded-xl border bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2'
  const ic = (key: string) => fieldErrors[key]
    ? `${base} border-red-400 focus:ring-red-400`
    : `${base} border-neutral-200 dark:border-neutral-700 focus:ring-primary-500`
  const lc = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1'
  const hint = (text: string) => <p className="mb-1.5 text-xs text-neutral-400">{text}</p>
  const errMsg = (key: string) => fieldErrors[key]
    ? <p className="mt-1 text-xs text-red-500">{fieldErrors[key]}</p>
    : null

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Paso {step} de {TOTAL_STEPS}</span>
        <span className="text-sm text-neutral-500">{Math.round((step / TOTAL_STEPS) * 100)}% completado</span>
      </div>
      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
        <div className="h-2 bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Información básica</h2>
        <p className="text-sm text-neutral-500 mt-1">Cuéntanos sobre tu experiencia.</p>
      </div>

      <div>
        <label className={lc}>Título de la experiencia * <span className="text-xs text-neutral-400">({title.length}/100)</span></label>
        {hint('Ej: "Tour gastronómico por la Zona Colonial" — sé específico y atractivo.')}
        <input type="text" value={title}
          onChange={(e) => { setTitle(e.target.value); setFieldErrors((p) => ({ ...p, title: '' })) }}
          placeholder="Ej: Caminata nocturna por Santo Domingo colonial"
          className={ic('title')} maxLength={100}
        />
        {errMsg('title')}
      </div>

      <div>
        <label className={lc}>Descripción corta * <span className="text-xs text-neutral-400">({shortDescription.length}/150)</span></label>
        {hint('Una frase que aparece en la tarjeta de la experiencia. Máx. 150 caracteres.')}
        <input type="text" value={shortDescription}
          onChange={(e) => { setShortDescription(e.target.value); setFieldErrors((p) => ({ ...p, shortDescription: '' })) }}
          placeholder="Ej: Descubre la historia viva de la primera ciudad del Nuevo Mundo."
          maxLength={150} className={ic('shortDescription')}
        />
        {errMsg('shortDescription')}
      </div>

      <div>
        <label className={lc}>Descripción completa * <span className="text-xs text-neutral-400">({description.length} chars — mín. 50)</span></label>
        {hint('Describe qué vivirán los explorers, qué la hace única y qué esperar. Cuanto más detalle, más reservas.')}
        <textarea value={description}
          onChange={(e) => { setDescription(e.target.value); setFieldErrors((p) => ({ ...p, description: '' })) }}
          placeholder={`Ej: Acompáñanos en un recorrido por los sabores más auténticos de la República Dominicana. Visitaremos el mercado Modelo, probaremos cocina criolla en comedores locales y aprenderás la historia detrás de cada plato con un guía experto.`}
          rows={6} className={`${ic('description')} resize-none`}
        />
        {errMsg('description')}
      </div>

      <div>
        <label className={`${lc} mb-2`}>Categoría *</label>
        {hint('Selecciona la categoría que mejor describe tu experiencia.')}
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_CATEGORIES.map((cat) => (
            <button key={cat} type="button"
              onClick={() => { setCategory(cat); setFieldErrors((p) => ({ ...p, category: '' })) }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${category === cat ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}>
              {cat}
            </button>
          ))}
        </div>
        {errMsg('category')}
      </div>

      <div>
        <label className={lc}>Etiquetas <span className="text-xs text-neutral-400">(opcional)</span></label>
        {hint('Palabras clave que ayudan a los explorers a encontrar tu experiencia. Haz clic en una sugerencia o escribe la tuya.')}
        <div className="flex gap-x-2">
          <input type="text" value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Ej: cacao, chocolate, artesanal..."
            className={`flex-1 ${ic('tag')}`}
          />
          <button type="button" onClick={addTag} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700">+ Agregar</button>
        </div>

        {/* Sugerencias según categoría */}
        {(() => {
          const suggestions = (TAG_SUGGESTIONS[category] ?? TAG_SUGGESTIONS.default).filter((s) => !tags.includes(s))
          if (!suggestions.length) return null
          return (
            <div className="mt-2">
              <p className="text-xs text-neutral-400 mb-1.5">Sugerencias — haz clic para agregar:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTags((prev) => [...prev, s])}
                    className="rounded-full border border-neutral-200 dark:border-neutral-600 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )
        })()}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-x-1 rounded-full bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 px-3 py-1 text-sm text-primary-700 dark:text-primary-300">
                {tag}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="text-primary-400 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Detalles de la experiencia</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lc}>Duración *</label>
          {hint('Elige una opción o escribe una duración personalizada.')}
          <select
            value={durationPreset}
            onChange={(e) => {
              const val = e.target.value
              setDurationPreset(val)
              if (val !== 'custom') {
                setDurationTime(val)
                setFieldErrors((p) => ({ ...p, durationTime: '' }))
              } else {
                setDurationTime('')
              }
            }}
            className={`${ic('durationTime')} mb-2`}
          >
            <option value="">Selecciona una duración...</option>
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
            <option value="custom">✏️ Escribir duración personalizada...</option>
          </select>
          {durationPreset === 'custom' && (
            <input type="text" value={durationTime}
              onChange={(e) => { setDurationTime(e.target.value); setFieldErrors((p) => ({ ...p, durationTime: '' })) }}
              placeholder="Ej: 2–3 horas, Medio día..."
              className={ic('durationTime')}
            />
          )}
          {errMsg('durationTime')}
        </div>
        <div>
          <label className={lc}>Ciudad *</label>
          {hint('Ciudad donde se realiza.')}
          <select value={city}
            onChange={(e) => { setCity(e.target.value); setAddressPreset(''); setAddress(''); setFieldErrors((p) => ({ ...p, city: '', address: '' })) }}
            className={ic('city')}
          >
            <option value="">Selecciona</option>
            {DR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errMsg('city')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lc}>Mínimo de explorers</label>
          <input type="number" inputMode="numeric" min={1} max={maxGuests} value={minGuests}
            onChange={(e) => { setMinGuests(Math.max(1, Number(e.target.value.replace(/\D/g, '')))); setFieldErrors((p) => ({ ...p, minGuests: '' })) }}
            className={ic('minGuests')}
          />
          {errMsg('minGuests')}
        </div>
        <div>
          <label className={lc}>Máximo de explorers</label>
          <input type="number" inputMode="numeric" min={minGuests} value={maxGuests}
            onChange={(e) => { setMaxGuests(Math.max(minGuests, Number(e.target.value.replace(/\D/g, '')))); setFieldErrors((p) => ({ ...p, maxGuests: '' })) }}
            className={ic('maxGuests')}
          />
          {errMsg('maxGuests')}
        </div>
      </div>

      <div>
        <label className={lc}>Dirección *</label>
        {hint('Elige un lugar conocido o escribe una dirección personalizada.')}
        {city && (CITY_ADDRESSES[city]?.length ?? 0) > 0 && (
          <select
            value={addressPreset}
            onChange={(e) => {
              const val = e.target.value
              setAddressPreset(val)
              if (val !== 'custom') {
                setAddress(val)
                setFieldErrors((p) => ({ ...p, address: '' }))
              } else {
                setAddress('')
              }
            }}
            className={`${ic('address')} mb-2`}
          >
            <option value="">Selecciona un lugar de referencia...</option>
            {CITY_ADDRESSES[city].map((addr) => (
              <option key={addr} value={addr}>{addr}</option>
            ))}
            <option value="custom">✏️ Escribir dirección personalizada...</option>
          </select>
        )}
        {(!city || addressPreset === 'custom' || !(CITY_ADDRESSES[city]?.length)) && (
          <input type="text" value={address}
            onChange={(e) => { setAddress(e.target.value); setFieldErrors((p) => ({ ...p, address: '' })) }}
            placeholder="Ej: Calle Las Damas #1, Zona Colonial"
            className={ic('address')}
          />
        )}
        {errMsg('address')}
      </div>

      <div>
        <label className={lc}>Instrucciones del punto de encuentro * <span className="text-xs text-neutral-400">({meetingPoint.length} chars)</span></label>
        {hint('Indica exactamente dónde y cómo encontrarte. Ej: "Nos encontramos frente a la puerta principal de la Catedral, busca al guía con chaleco azul."')}
        <textarea value={meetingPoint}
          onChange={(e) => { setMeetingPoint(e.target.value); setFieldErrors((p) => ({ ...p, meetingPoint: '' })) }}
          placeholder="Ej: Nos encontramos frente a la puerta principal de la Catedral Primada. Busca al guía con el chaleco azul con el logo de DoCoolture. Llega 10 minutos antes."
          rows={3}
          className={`${ic('meetingPoint')} resize-none`}
        />
        {errMsg('meetingPoint')}
      </div>

      <div>
        <label className={`${lc} mb-2`}>Idiomas en que ofreces la experiencia *</label>
        {hint('Selecciona todos los idiomas en que puedes guiar la experiencia.')}
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_LANGUAGES.map((l) => (
            <button key={l} type="button"
              onClick={() => { toggleItem(l, languages, setLanguages); setFieldErrors((p) => ({ ...p, languages: '' })) }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${languages.includes(l) ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}>
              {l}
            </button>
          ))}
        </div>
        {errMsg('languages')}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Precio</h2>
        <p className="text-sm text-neutral-500 mt-1">El precio es por persona.</p>
      </div>

      <div>
        <label className={lc}>Precio por persona *</label>
        {hint('Ingresa el valor en dólares (USD). Ej: 120 para $120 por persona.')}
        <div className={`flex items-center overflow-hidden rounded-xl border ${fieldErrors.priceUsd ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'}`}>
          <span className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-sm text-neutral-500 border-r border-neutral-200 dark:border-neutral-600">$</span>
          <input type="text" inputMode="decimal" value={priceUsd}
            onChange={(e) => {
              const parts = onlyPositiveNum(e.target.value).split('.')
              const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : parts.join('.')
              setPriceUsd(clean)
              setFieldErrors((p) => ({ ...p, priceUsd: '' }))
            }}
            placeholder="0.00"
            className="flex-1 px-4 py-3 text-sm bg-white dark:bg-neutral-900 focus:outline-none dark:text-neutral-100"
          />
          <span className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-sm text-neutral-500 border-l border-neutral-200 dark:border-neutral-600">USD</span>
        </div>
        {errMsg('priceUsd')}
      </div>

      <div>
        <label className={lc}>¿Qué incluye el precio? * <span className="text-xs text-neutral-400">({priceIncludes.length} ítems)</span></label>
        {hint('Ej: Guía bilingüe certificado · Degustaciones locales · Seguro de actividad · Agua y refrescos · Transporte interno')}
        <div className="flex gap-x-2">
          <input type="text" value={includeInput}
            onChange={(e) => { setIncludeInput(e.target.value); setFieldErrors((p) => ({ ...p, priceIncludes: '' })) }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
            placeholder="Ej: Guía bilingüe, Degustaciones, Seguro..."
            className={`flex-1 ${ic('priceIncludes')}`}
          />
          <button type="button" onClick={addInclude} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700">+</button>
        </div>
        {errMsg('priceIncludes')}
        {priceIncludes.length > 0 && (
          <ul className="mt-2 space-y-1">
            {priceIncludes.map((item) => (
              <li key={item} className="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-950 px-3 py-1.5 text-sm text-green-700 dark:text-green-400">
                <span>✅ {item}</span>
                <button onClick={() => setPriceIncludes(priceIncludes.filter((i) => i !== item))} className="text-neutral-400 hover:text-red-500 ml-2">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className={lc}>¿Qué NO incluye el precio? <span className="text-xs text-neutral-400">(opcional)</span></label>
        {hint('Ej: Transporte al punto de encuentro · Bebidas alcohólicas · Propinas · Souvenirs')}
        <div className="flex gap-x-2">
          <input type="text" value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
            placeholder="Ej: Transporte, Bebidas extra, Propinas..."
            className={`flex-1 ${base} border-neutral-200 dark:border-neutral-700 focus:ring-primary-500`}
          />
          <button type="button" onClick={addExclude} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700">+</button>
        </div>
        {priceExcludes.length > 0 && (
          <ul className="mt-2 space-y-1">
            {priceExcludes.map((item) => (
              <li key={item} className="flex items-center justify-between rounded-lg bg-red-50 dark:bg-red-950 px-3 py-1.5 text-sm text-red-600 dark:text-red-400">
                <span>❌ {item}</span>
                <button onClick={() => setPriceExcludes(priceExcludes.filter((i) => i !== item))} className="text-neutral-400 hover:text-red-500 ml-2">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Fotos de tu experiencia</h2>
        <p className="text-sm text-neutral-500 mt-1">Las fotos son lo primero que ven los explorers. Usa imágenes reales y de buena calidad.</p>
      </div>

      {/* Imagen principal */}
      <div>
        <label className={lc}>Imagen principal *</label>
        {hint('Formato JPG, PNG o WEBP · Máx. 10 MB · Recomendado: 1200×800 px en horizontal. Arrastra o haz clic.')}
        {featuredImagePreview ? (
          <div className="relative">
            <img src={featuredImagePreview} alt="Preview" className="w-full h-52 object-cover rounded-xl" />
            <button
              onClick={() => { setFeaturedImage(null); setFeaturedImagePreview(null) }}
              className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 text-sm hover:bg-white shadow"
            >×</button>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              isDraggingFeatured ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : fieldErrors.featuredImage ? 'border-red-400' : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-500'
            }`}
            onDragOver={(e) => { onDragOver(e); setIsDraggingFeatured(true) }}
            onDragEnter={() => setIsDraggingFeatured(true)}
            onDragLeave={() => setIsDraggingFeatured(false)}
            onDrop={onDropFeatured}
          >
            <span className="text-3xl mb-2">{isDraggingFeatured ? '📂' : '📷'}</span>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {isDraggingFeatured ? 'Suelta la imagen aquí' : 'Arrastra tu imagen o haz clic para subir'}
            </span>
            <span className="text-xs text-neutral-400 mt-1">JPG, PNG, WEBP — Máx 10MB</span>
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFeaturedImage(e.target.files[0])} />
          </label>
        )}
        {errMsg('featuredImage')}
      </div>

      {/* Galería */}
      <div>
        <label className={lc}>Galería de fotos <span className="text-xs text-neutral-400">(opcional, hasta 10 fotos)</span></label>
        {hint('Muestra diferentes ángulos, momentos y detalles de la experiencia. Arrastra varias fotos a la vez.')}
        <label
          className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors mb-3 ${
            isDraggingGallery ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-500'
          }`}
          onDragOver={(e) => { onDragOver(e); setIsDraggingGallery(true) }}
          onDragEnter={() => setIsDraggingGallery(true)}
          onDragLeave={() => setIsDraggingGallery(false)}
          onDrop={onDropGallery}
        >
          <span className="text-2xl mb-1">{isDraggingGallery ? '📂' : '🖼️'}</span>
          <span className="text-sm text-neutral-500">
            {isDraggingGallery ? 'Suelta las fotos aquí' : 'Arrastra fotos o haz clic para agregar'}
          </span>
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => e.target.files && handleGalleryImages(e.target.files)} />
        </label>
        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {galleryPreviews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => { setGalleryImages(galleryImages.filter((_, idx) => idx !== i)); setGalleryPreviews(galleryPreviews.filter((_, idx) => idx !== i)) }}
                  className="absolute top-1 right-1 rounded-full bg-white/80 px-1.5 py-0.5 text-xs hover:bg-white shadow"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Disponibilidad</h2>
        <p className="text-sm text-neutral-500 mt-1">¿Cuándo ofreces esta experiencia?</p>
      </div>

      <div>
        <label className={`${lc} mb-2`}>Días disponibles *</label>
        {hint('Selecciona los días de la semana en que normalmente ofreces esta experiencia.')}
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button key={day} type="button"
              onClick={() => { toggleItem(day, availableDays, setAvailableDays); setFieldErrors((p) => ({ ...p, availableDays: '' })) }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${availableDays.includes(day) ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'}`}>
              {day}
            </button>
          ))}
        </div>
        {errMsg('availableDays')}
      </div>

      <div>
        <label className={lc}>Horarios disponibles <span className="text-xs text-neutral-400">(opcional)</span></label>
        {hint('Agrega las horas de inicio. Ej: 09:00, 14:00, 17:00.')}
        <div className="flex gap-x-2 items-center">
          <div className="flex flex-1 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
            <select
              value={timeHour}
              onChange={(e) => setTimeHour(e.target.value)}
              className="flex-1 bg-white dark:bg-neutral-900 px-3 py-3 text-sm focus:outline-none border-r border-neutral-200 dark:border-neutral-700"
            >
              <option value="">HH</option>
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="flex items-center px-2 text-neutral-400 bg-white dark:bg-neutral-900 text-sm">:</span>
            <select
              value={timeMinute}
              onChange={(e) => setTimeMinute(e.target.value)}
              className="flex-1 bg-white dark:bg-neutral-900 px-3 py-3 text-sm focus:outline-none"
            >
              {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <button type="button" onClick={addTime}
            disabled={!timeHour}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40">
            + Agregar
          </button>
        </div>
        {availableTimes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTimes.sort().map((time) => (
              <span key={time} className="inline-flex items-center gap-x-1 rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 text-sm">
                🕐 {time}
                <button onClick={() => setAvailableTimes(availableTimes.filter((t) => t !== time))} className="text-neutral-400 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-700 p-5 space-y-2 text-sm">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Resumen de tu experiencia</p>
        <p className="text-neutral-600 dark:text-neutral-400">📌 <strong>{title}</strong></p>
        <p className="text-neutral-600 dark:text-neutral-400">🗺️ {category} · {city}</p>
        <p className="text-neutral-600 dark:text-neutral-400">⏱️ {durationTime} · hasta {maxGuests} explorers</p>
        <p className="text-neutral-600 dark:text-neutral-400">💵 ${priceUsd} USD por persona</p>
        <p className="text-neutral-600 dark:text-neutral-400">📅 {availableDays.join(', ')}</p>
      </div>
    </div>
  )

  if (!hostChecked) {
    return (
      <div className="container max-w-2xl mx-auto py-24 px-4 flex items-center justify-center">
        <div className="animate-pulse h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
      </div>
    )
  }

  if (!hasHostProfile) {
    return (
      <main className="container max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-16 text-center">
          <p className="text-5xl mb-4">🏠</p>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Necesitas un perfil de anfitrión</h2>
          <p className="text-neutral-500 mb-6">Crea tu perfil de anfitrión primero para poder publicar experiencias.</p>
          <ButtonPrimary onClick={() => router.push('/become-host')}>Crear perfil de anfitrión</ButtonPrimary>
        </div>
      </main>
    )
  }

  return (
    <main className="container max-w-2xl mx-auto py-12 px-4 mb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Nueva experiencia</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Crea una experiencia que los explorers nunca olvidarán.</p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-8">
        {renderProgressBar()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          {step > 1 ? (
            <button onClick={() => { setStep((s) => (s - 1) as any); setFieldErrors({}) }}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              ← Volver
            </button>
          ) : (
            <button onClick={() => router.push('/host/dashboard')}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              ← Dashboard
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <ButtonPrimary onClick={handleNext} disabled={!canProceed()} className="disabled:opacity-50">
              Continuar →
            </ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={handleSubmit} disabled={isLoading || !canProceed()} className="disabled:opacity-50">
              {isLoading ? 'Publicando...' : '🚀 Publicar experiencia'}
            </ButtonPrimary>
          )}
        </div>
      </div>
    </main>
  )
}
