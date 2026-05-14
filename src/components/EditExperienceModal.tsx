'use client'

import { supabase } from '@/lib/supabase'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (field: keyof ExperienceData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Título
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Precio (USD)
              </label>
              <input
                type="number"
                min={0}
                value={form.price_usd}
                onChange={(e) => set('price_usd', Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Duración
              </label>
              <input
                type="text"
                placeholder="ej. 3–4 horas"
                value={form.duration_time}
                onChange={(e) => set('duration_time', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Max guests */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Máximo de personas
              </label>
              <input
                type="number"
                min={1}
                value={form.max_guests}
                onChange={(e) => set('max_guests', Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Published */}
            <div className="sm:col-span-2 flex items-center gap-x-3">
              <input
                id="is_published"
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
                className="size-4 rounded border-neutral-300"
              />
              <label htmlFor="is_published" className="text-sm text-neutral-700 dark:text-neutral-300">
                Experiencia publicada (visible para explorers)
              </label>
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
