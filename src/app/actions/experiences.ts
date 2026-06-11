'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { toHandle } from '@/lib/handle'
import {
  EXPERIENCE_CATEGORIES,
  DR_CITIES,
  AVAILABLE_LANGUAGES,
  DAYS_OF_WEEK,
} from '@/types'

export interface CreateExperienceInput {
  title: string
  shortDescription: string
  description: string
  category: string
  tags: string[]
  durationTime: string
  languages: string[]
  maxGuests: number
  minGuests: number
  meetingPoint: string
  address: string
  city: string
  latitude: number | null
  longitude: number | null
  priceUsd: number
  priceIncludes: string[]
  priceExcludes: string[]
  featuredImageUrl: string | null
  galleryUrls: string[]
  availableDays: string[]
  availableTimes: string[]
  publishImmediately: boolean
}

const CATEGORIES = EXPERIENCE_CATEGORIES as readonly string[]
const CITIES = DR_CITIES as readonly string[]
const LANGS = AVAILABLE_LANGUAGES as readonly string[]
const DAYS = DAYS_OF_WEEK as readonly string[]

function generateHandle(raw: string): string {
  return toHandle(raw)
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

/** Server-side validation — never trust the client. Returns an error string or null. */
function validate(input: CreateExperienceInput): string | null {
  const title = input.title?.trim() ?? ''
  if (title.length < 5 || title.length > 100) return 'El título debe tener entre 5 y 100 caracteres.'

  const short = input.shortDescription?.trim() ?? ''
  if (short.length < 10 || short.length > 150) return 'La descripción corta debe tener entre 10 y 150 caracteres.'

  const desc = input.description?.trim() ?? ''
  if (desc.length < 50 || desc.length > 5000) return 'La descripción completa debe tener entre 50 y 5000 caracteres.'

  if (!CATEGORIES.includes(input.category)) return 'Categoría inválida.'

  if (!input.durationTime?.trim()) return 'La duración es requerida.'

  if (!Number.isFinite(input.minGuests) || input.minGuests < 1) return 'Mínimo de explorers inválido.'
  if (!Number.isFinite(input.maxGuests) || input.maxGuests < input.minGuests) return 'Máximo de explorers inválido.'
  if (input.maxGuests > 100) return 'Máximo de explorers demasiado alto.'

  if (!input.address?.trim()) return 'La dirección es requerida.'
  const meeting = input.meetingPoint?.trim() ?? ''
  if (meeting.length < 10) return 'Las instrucciones de encuentro deben tener al menos 10 caracteres.'

  if (!CITIES.includes(input.city)) return 'Ciudad inválida.'

  if (!Array.isArray(input.languages) || input.languages.length === 0) return 'Selecciona al menos un idioma.'
  if (input.languages.some((l) => !LANGS.includes(l))) return 'Idioma inválido.'

  if (!Number.isFinite(input.priceUsd) || input.priceUsd <= 0) return 'El precio debe ser mayor a 0.'
  if (input.priceUsd > 100000) return 'Precio demasiado alto.'

  if (!Array.isArray(input.priceIncludes) || input.priceIncludes.length === 0) return 'Agrega al menos un ítem de lo que incluye.'

  if (!Array.isArray(input.availableDays) || input.availableDays.length === 0) return 'Selecciona al menos un día disponible.'
  if (input.availableDays.some((d) => !DAYS.includes(d))) return 'Día disponible inválido.'

  if (input.latitude !== null && (input.latitude < 17 || input.latitude > 20)) return 'Latitud fuera de República Dominicana.'
  if (input.longitude !== null && (input.longitude < -72 || input.longitude > -68)) return 'Longitud fuera de República Dominicana.'

  if (!input.featuredImageUrl) return 'La imagen principal es requerida.'

  return null
}

export async function createExperience(
  input: CreateExperienceInput
): Promise<{ handle?: string; error?: string }> {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  // Resolve the host profile owned by this user — host_id is never trusted from the client
  const { data: host } = await supabase
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!host) return { error: 'Necesitas un perfil de anfitrión. Ve a /become-host para crearlo.' }

  const validationError = validate(input)
  if (validationError) return { error: validationError }

  const baseHandle = generateHandle(input.title) || 'experiencia'

  // Resolve handle collisions server-side, retrying on unique-violation races
  const { data: existingHandles } = await supabase
    .from('experiences')
    .select('handle')
    .like('handle', `${baseHandle}%`)

  const taken = new Set((existingHandles ?? []).map((e: { handle: string }) => e.handle))

  const nextHandle = (): string => {
    if (!taken.has(baseHandle)) return baseHandle
    let n = 2
    while (taken.has(`${baseHandle}-${n}`)) n++
    return `${baseHandle}-${n}`
  }

  const row = {
    host_id: host.id,
    title: input.title.trim(),
    description: input.description.trim(),
    short_description: input.shortDescription.trim(),
    category: input.category,
    tags: input.tags ?? [],
    duration_time: input.durationTime.trim(),
    languages: input.languages,
    max_guests: input.maxGuests,
    min_guests: input.minGuests,
    meeting_point: input.meetingPoint.trim(),
    address: input.address.trim(),
    city: input.city,
    price_usd: input.priceUsd,
    price_includes: input.priceIncludes,
    price_excludes: input.priceExcludes ?? [],
    featured_image_url: input.featuredImageUrl,
    gallery_urls: input.galleryUrls ?? [],
    available_days: input.availableDays,
    available_times: input.availableTimes ?? [],
    latitude: input.latitude,
    longitude: input.longitude,
    is_published: !!input.publishImmediately,
    is_hidden: false,
  }

  // Retry up to 3 times if a concurrent insert grabs the same handle (code 23505)
  for (let attempt = 0; attempt < 3; attempt++) {
    const handle = nextHandle()
    const { error } = await supabase.from('experiences').insert({ ...row, handle })

    if (!error) return { handle }

    if ((error as { code?: string }).code === '23505') {
      taken.add(handle) // mark it taken and try the next suffix
      continue
    }
    return { error: error.message }
  }

  return { error: 'No se pudo generar un identificador único. Cambia el título e intenta de nuevo.' }
}

export interface UpdateExperienceInput {
  id: string
  title: string
  shortDescription: string | null
  description: string
  category: string
  tags: string[]
  priceUsd: number
  durationTime: string
  maxGuests: number
  minGuests: number
  meetingPoint: string | null
  address: string
  city: string
  isPublished: boolean
  featuredImageUrl: string | null
  galleryUrls: string[]
  languages: string[]
  priceIncludes: string[]
  priceExcludes: string[]
  availableDays: string[]
  availableTimes: string[]
  latitude: number | null
  longitude: number | null
}

export async function updateExperience(
  input: UpdateExperienceInput
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const title = input.title?.trim() ?? ''
  if (title.length < 5) return { error: 'El título debe tener al menos 5 caracteres.' }

  const description = input.description?.trim() ?? ''
  if (description.length < 20) return { error: 'La descripción debe tener al menos 20 caracteres.' }

  if (!Number.isFinite(input.priceUsd) || input.priceUsd <= 0) return { error: 'El precio debe ser mayor a 0.' }
  if (input.priceUsd > 100000) return { error: 'Precio demasiado alto.' }

  if (!Number.isFinite(input.maxGuests) || input.maxGuests < 1) return { error: 'Máximo de explorers inválido.' }

  if (!input.durationTime?.trim()) return { error: 'La duración es requerida.' }
  if (!input.city?.trim()) return { error: 'La ciudad es requerida.' }
  if (!input.address?.trim()) return { error: 'La dirección es requerida.' }

  // Verify ownership — only the host who owns the experience can update it
  const { data: host } = await supabase
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!host) return { error: 'Perfil de anfitrión no encontrado.' }

  const { data: exp } = await supabase
    .from('experiences')
    .select('id')
    .eq('id', input.id)
    .eq('host_id', host.id)
    .single()
  if (!exp) return { error: 'Experiencia no encontrada o no tienes permiso para editarla.' }

  const { error } = await supabase
    .from('experiences')
    .update({
      title,
      short_description: input.shortDescription?.trim() ?? null,
      description,
      category: input.category,
      tags: input.tags ?? [],
      price_usd: input.priceUsd,
      duration_time: input.durationTime.trim(),
      max_guests: input.maxGuests,
      min_guests: input.minGuests ?? 1,
      meeting_point: input.meetingPoint?.trim() ?? null,
      address: input.address.trim(),
      city: input.city.trim(),
      is_published: input.isPublished,
      featured_image_url: input.featuredImageUrl,
      gallery_urls: input.galleryUrls ?? [],
      languages: input.languages ?? [],
      price_includes: input.priceIncludes ?? [],
      price_excludes: input.priceExcludes ?? [],
      available_days: input.availableDays ?? [],
      available_times: input.availableTimes ?? [],
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
    })
    .eq('id', input.id)

  if (error) return { error: error.message }
  return {}
}

export async function deleteReview(reviewId: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  // Resolve the explorer's profile id — only the review owner can delete
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!profile) return { error: 'Perfil no encontrado.' }

  // Verify ownership before deleting
  const { data: review } = await supabase
    .from('experience_reviews')
    .select('id')
    .eq('id', reviewId)
    .eq('explorer_id', profile.id)
    .single()

  if (!review) return { error: 'Reseña no encontrada o no tienes permiso para eliminarla.' }

  const { error } = await supabase
    .from('experience_reviews')
    .delete()
    .eq('id', reviewId)

  return error ? { error: error.message } : {}
}
