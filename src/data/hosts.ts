import { createSupabaseServerClient } from '@/lib/supabase-server'

function getProfileAvatar(profiles: unknown): string | null {
  if (!profiles) return null
  const p = Array.isArray(profiles) ? profiles[0] : profiles
  return (p as any)?.avatar_url ?? null
}

function toHandle(displayName: string) {
  return displayName.toLowerCase().replace(/\s+/g, '-')
}

export type TTalent = {
  id: string
  displayName: string
  handle: string
  avatarUrl: string
  bgImage: string
  specialties: string[]
  experienceCategories: string[]
  city: string | null
  averageRating: number
  totalReviews: number
  totalListings: number
  bio: string | null
  isSuperhost: boolean
  isVerified: boolean
  yearsExperience: number
}

export const SPECIALTY_BG_IMAGES: Record<string, string> = {
  'Gastronomía': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Historia y Cultura': 'https://images.pexels.com/photos/1674666/pexels-photo-1674666.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Arte y Artesanía': 'https://images.pexels.com/photos/1532771/pexels-photo-1532771.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Música y Baile': 'https://images.pexels.com/photos/1864641/pexels-photo-1864641.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Naturaleza y Aventura': 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Fotografía': 'https://images.pexels.com/photos/1203805/pexels-photo-1203805.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Idiomas': 'https://images.pexels.com/photos/4560143/pexels-photo-4560143.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Bienestar': 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Deportes': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Vida Nocturna': 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500',
}

const DEFAULT_BG = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500'

export async function getTalents(): Promise<TTalent[]> {
  const supabase = await createSupabaseServerClient()

  const [hostsResult, expsResult] = await Promise.all([
    supabase
      .from('hosts')
      .select('id, display_name, bio, specialties, city, average_rating, total_reviews, total_listings, is_superhost, is_verified, years_experience, profiles(avatar_url)')
      .eq('status', 'active')
      .order('average_rating', { ascending: false }),
    supabase
      .from('experiences')
      .select('host_id, category')
      .eq('is_published', true)
      .eq('is_hidden', false),
  ])

  if (hostsResult.error) console.error('[getTalents] error:', JSON.stringify(hostsResult.error))
  if (!hostsResult.data || hostsResult.data.length === 0) {
    console.error('[getTalents] no active hosts found')
    return []
  }

  const categoryByHost = new Map<string, Set<string>>()
  for (const exp of expsResult.data ?? []) {
    if (!categoryByHost.has(exp.host_id)) categoryByHost.set(exp.host_id, new Set())
    if (exp.category) categoryByHost.get(exp.host_id)!.add(exp.category)
  }

  return hostsResult.data.map((host) => {
    const expCategories = [...(categoryByHost.get(host.id as string) ?? [])]
    const primaryCategory = expCategories[0] ?? (host.specialties as string[] | null)?.[0] ?? ''
    return {
      id: host.id as string,
      displayName: host.display_name as string,
      handle: toHandle(host.display_name as string),
      avatarUrl: getProfileAvatar((host as any).profiles) ?? '',
      bgImage: SPECIALTY_BG_IMAGES[primaryCategory] ?? DEFAULT_BG,
      specialties: (host.specialties as string[] | null) ?? [],
      experienceCategories: expCategories,
      city: (host.city as string | null) ?? null,
      averageRating: (host.average_rating as number) ?? 0,
      totalReviews: (host.total_reviews as number) ?? 0,
      totalListings: (host.total_listings as number) ?? 0,
      bio: (host.bio as string | null) ?? null,
      isSuperhost: (host.is_superhost as boolean) ?? false,
      isVerified: (host.is_verified as boolean) ?? false,
      yearsExperience: (host.years_experience as number) ?? 0,
    }
  })
}
