'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { supabase, uploadExperienceImage } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  EXPERIENCE_CATEGORIES,
  AVAILABLE_LANGUAGES,
  DAYS_OF_WEEK,
  DR_CITIES,
} from '@/types'

const TOTAL_STEPS = 5

export default function NewExperiencePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Paso 1 — Información básica
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Paso 2 — Detalles
  const [durationTime, setDurationTime] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [maxGuests, setMaxGuests] = useState(10)
  const [minGuests, setMinGuests] = useState(1)
  const [meetingPoint, setMeetingPoint] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')

  // Paso 3 — Precio
  const [priceUsd, setPriceUsd] = useState('')
  const [priceIncludes, setPriceIncludes] = useState<string[]>([])
  const [priceExcludes, setPriceExcludes] = useState<string[]>([])
  const [includeInput, setIncludeInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')

  // Paso 4 — Imágenes
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  // Paso 5 — Disponibilidad
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [timeInput, setTimeInput] = useState('')

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

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const addInclude = () => {
    if (includeInput.trim() && !priceIncludes.includes(includeInput.trim())) {
      setPriceIncludes([...priceIncludes, includeInput.trim()])
      setIncludeInput('')
    }
  }

  const addExclude = () => {
    if (excludeInput.trim() && !priceExcludes.includes(excludeInput.trim())) {
      setPriceExcludes([...priceExcludes, excludeInput.trim()])
      setExcludeInput('')
    }
  }

  const addTime = () => {
    if (timeInput && !availableTimes.includes(timeInput)) {
      setAvailableTimes([...availableTimes, timeInput])
      setTimeInput('')
    }
  }

  const handleFeaturedImage = (file: File) => {
    setFeaturedImage(file)
    setFeaturedImagePreview(URL.createObjectURL(file))
  }

  const handleGalleryImages = (files: FileList) => {
    const newFiles = Array.from(files)
    setGalleryImages((prev) => [...prev, ...newFiles])
    setGalleryPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ])
  }

  const generateHandle = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data: host } = await supabase
        .from('hosts')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!host) throw new Error('No tienes perfil de anfitrión')

      // Subir imagen principal
      let featuredImageUrl = null
      if (featuredImage) {
        featuredImageUrl = await uploadExperienceImage(
          user.id,
          featuredImage,
          `featured-${Date.now()}.${featuredImage.name.split('.').pop()}`
        )
      }

      // Subir imágenes de galería
      const galleryUrls: string[] = []
      for (const img of galleryImages) {
        const url = await uploadExperienceImage(
          user.id,
          img,
          `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${img.name.split('.').pop()}`
        )
        if (url) galleryUrls.push(url)
      }

      // Crear la experiencia
      const handle = generateHandle(title)
      const { error: expError } = await supabase
        .from('experiences')
        .insert({
          host_id: host.id,
          title,
          handle,
          description,
          short_description: shortDescription,
          category,
          tags,
          duration_time: durationTime,
          languages,
          max_guests: maxGuests,
          min_guests: minGuests,
          meeting_point: meetingPoint,
          address,
          city,
          price_usd: Number(priceUsd),
          price_includes: priceIncludes,
          price_excludes: priceExcludes,
          featured_image_url: featuredImageUrl,
          gallery_urls: galleryUrls,
          available_days: availableDays,
          available_times: availableTimes,
          is_published: true,
          is_hidden: false,
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
    if (step === 2) return durationTime && languages.length > 0 && address && city
    if (step === 3) return Number(priceUsd) > 0
    if (step === 4) return featuredImage !== null
    if (step === 5) return availableDays.length > 0
    return false
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
          Información básica
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Cuéntanos sobre tu experiencia.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Título de la experiencia *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tour gastronómico por el mercado..."
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Descripción corta *
        </label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Una línea que resuma tu experiencia..."
          maxLength={150}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-neutral-400 mt-1 text-right">
          {shortDescription.length}/150
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Descripción completa *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu experiencia en detalle. ¿Qué van a vivir los explorers? ¿Qué hace especial tu experiencia?"
          rows={5}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Categoría *
        </label>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Etiquetas (opcional)
        </label>
        <div className="flex gap-x-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Ej: cacao, chocolate, artesanal..."
            className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            + Agregar
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-x-1 rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1 text-sm"
              >
                {tag}
                <button
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="text-neutral-400 hover:text-red-500"
                >
                  ×
                </button>
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
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Detalles de la experiencia
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Duración *
          </label>
          <input
            type="text"
            value={durationTime}
            onChange={(e) => setDurationTime(e.target.value)}
            placeholder="3 horas, 2.5 horas..."
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Ciudad *
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Selecciona</option>
            {DR_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Mínimo de explorers
          </label>
          <input
            type="number"
            min={1}
            value={minGuests}
            onChange={(e) => setMinGuests(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Máximo de explorers
          </label>
          <input
            type="number"
            min={1}
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Dirección / Punto de encuentro *
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle Las Damas #1, Zona Colonial"
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Punto de encuentro (instrucciones)
        </label>
        <input
          type="text"
          value={meetingPoint}
          onChange={(e) => setMeetingPoint(e.target.value)}
          placeholder="Nos encontramos frente a la Catedral..."
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Idiomas en que ofreces la experiencia *
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
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Precio
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          El precio es por persona en USD.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Precio por persona (USD) *
        </label>
        <div className="flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <span className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-sm text-neutral-500 border-r border-neutral-200 dark:border-neutral-600">
            $
          </span>
          <input
            type="number"
            min={1}
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            placeholder="0.00"
            className="flex-1 px-4 py-3 text-sm bg-white dark:bg-neutral-900 focus:outline-none dark:text-neutral-100"
          />
          <span className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-sm text-neutral-500 border-l border-neutral-200 dark:border-neutral-600">
            USD
          </span>
        </div>
      </div>

      {/* Qué incluye */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          ¿Qué incluye el precio?
        </label>
        <div className="flex gap-x-2">
          <input
            type="text"
            value={includeInput}
            onChange={(e) => setIncludeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
            placeholder="Ej: Guía bilingüe, Degustaciones..."
            className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addInclude}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            +
          </button>
        </div>
        {priceIncludes.length > 0 && (
          <ul className="mt-2 space-y-1">
            {priceIncludes.map((item) => (
              <li key={item} className="flex items-center justify-between text-sm text-green-700 dark:text-green-400">
                <span>✅ {item}</span>
                <button
                  onClick={() => setPriceIncludes(priceIncludes.filter((i) => i !== item))}
                  className="text-neutral-400 hover:text-red-500 ml-2"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Qué no incluye */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          ¿Qué NO incluye el precio?
        </label>
        <div className="flex gap-x-2">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
            placeholder="Ej: Transporte, Bebidas extra..."
            className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addExclude}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            +
          </button>
        </div>
        {priceExcludes.length > 0 && (
          <ul className="mt-2 space-y-1">
            {priceExcludes.map((item) => (
              <li key={item} className="flex items-center justify-between text-sm text-red-600 dark:text-red-400">
                <span>❌ {item}</span>
                <button
                  onClick={() => setPriceExcludes(priceExcludes.filter((i) => i !== item))}
                  className="text-neutral-400 hover:text-red-500 ml-2"
                >
                  ×
                </button>
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
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Fotos de tu experiencia
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Unas buenas fotos hacen la diferencia. Sube imágenes de alta calidad.
        </p>
      </div>

      {/* Imagen principal */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Imagen principal * (la más importante)
        </label>
        {featuredImagePreview ? (
          <div className="relative">
            <img
              src={featuredImagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
            <button
              onClick={() => {
                setFeaturedImage(null)
                setFeaturedImagePreview(null)
              }}
              className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 text-sm hover:bg-white"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 cursor-pointer hover:border-primary-500 transition-colors">
            <span className="text-3xl mb-2">📷</span>
            <span className="text-sm text-neutral-500">
              Haz clic para subir la imagen principal
            </span>
            <span className="text-xs text-neutral-400 mt-1">JPG, PNG, WEBP — Máx 10MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFeaturedImage(e.target.files[0])}
            />
          </label>
        )}
      </div>

      {/* Galería */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Galería de fotos (opcional, hasta 10 fotos)
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 cursor-pointer hover:border-primary-500 transition-colors mb-3">
          <span className="text-2xl mb-1">🖼️</span>
          <span className="text-sm text-neutral-500">Agregar más fotos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleGalleryImages(e.target.files)}
          />
        </label>
        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {galleryPreviews.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setGalleryImages(galleryImages.filter((_, idx) => idx !== i))
                    setGalleryPreviews(galleryPreviews.filter((_, idx) => idx !== i))
                  }}
                  className="absolute top-1 right-1 rounded-full bg-white/80 px-1.5 py-0.5 text-xs hover:bg-white"
                >
                  ×
                </button>
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
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Disponibilidad
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          ¿Cuándo ofreces esta experiencia?
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Días disponibles *
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleItem(day, availableDays, setAvailableDays)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                availableDays.includes(day)
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Horarios disponibles
        </label>
        <div className="flex gap-x-2">
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addTime}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            + Agregar
          </button>
        </div>
        {availableTimes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTimes.sort().map((time) => (
              <span
                key={time}
                className="inline-flex items-center gap-x-1 rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 text-sm"
              >
                🕐 {time}
                <button
                  onClick={() => setAvailableTimes(availableTimes.filter((t) => t !== time))}
                  className="text-neutral-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-700 p-5 space-y-2 text-sm">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          Resumen de tu experiencia
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          📌 <strong>{title}</strong>
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          🗺️ {category} · {city}
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          ⏱️ {durationTime} · hasta {maxGuests} explorers
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          💵 ${priceUsd} USD por persona
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          📅 {availableDays.join(', ')}
        </p>
      </div>
    </div>
  )

  return (
    <main className="container max-w-2xl mx-auto py-12 px-4 mb-24">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Nueva experiencia
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Crea una experiencia que los explorers nunca olvidarán.
        </p>
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
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              ← Volver
            </button>
          ) : (
            <button
              onClick={() => router.push('/host/dashboard')}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              ← Dashboard
            </button>
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
              {isLoading ? 'Publicando...' : '🚀 Publicar experiencia'}
            </ButtonPrimary>
          )}
        </div>
      </div>
    </main>
  )
}
