import { unstable_cache } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { extractAvatarUrl, type ProfileJoin } from '@/lib/supabase-joins'
import { toHandle } from '@/lib/handle'

// Re-exported for backwards compatibility with existing importers.
export { toHandle }

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

// supabaseAdmin is not typed with the Database generic, so we shape the rows here.
type TalentHostRow = {
  id: string
  display_name: string
  bio: string | null
  specialties: string[] | null
  city: string | null
  average_rating: number | null
  total_reviews: number | null
  total_listings: number | null
  is_superhost: boolean | null
  is_verified: boolean | null
  years_experience: number | null
  profiles: ProfileJoin
}
type TalentExpRow = { host_id: string; category: string | null }

export const getTalents = unstable_cache(async () => {
  const [hostsResult, expsResult] = await Promise.all([
    supabaseAdmin
      .from('hosts')
      .select('id, display_name, bio, specialties, city, average_rating, total_reviews, total_listings, is_superhost, is_verified, years_experience, profiles(avatar_url)')
      .eq('status', 'active')
      .order('average_rating', { ascending: false }),
    supabaseAdmin
      .from('experiences')
      .select('host_id, category')
      .eq('is_published', true)
      .eq('is_hidden', false),
  ])

  if (hostsResult.error) console.error('[getTalents] hosts error:', JSON.stringify(hostsResult.error))
  if (expsResult.error) console.error('[getTalents] experiences error:', JSON.stringify(expsResult.error))
  if (!hostsResult.data || hostsResult.data.length === 0) {
    console.error('[getTalents] no active hosts found')
    return []
  }

  const categoryByHost = new Map<string, Set<string>>()
  for (const exp of (expsResult.data ?? []) as TalentExpRow[]) {
    if (!categoryByHost.has(exp.host_id)) categoryByHost.set(exp.host_id, new Set())
    if (exp.category) categoryByHost.get(exp.host_id)!.add(exp.category)
  }

  return (hostsResult.data as TalentHostRow[]).map((host) => {
    const expCategories = [...(categoryByHost.get(host.id) ?? [])]
    const primaryCategory = expCategories[0] ?? host.specialties?.[0] ?? ''
    return {
      id: host.id,
      displayName: host.display_name,
      handle: toHandle(host.display_name),
      avatarUrl: extractAvatarUrl(host.profiles),
      bgImage: SPECIALTY_BG_IMAGES[primaryCategory] ?? DEFAULT_BG,
      specialties: host.specialties ?? [],
      experienceCategories: expCategories,
      city: host.city ?? null,
      averageRating: host.average_rating ?? 0,
      totalReviews: host.total_reviews ?? 0,
      totalListings: host.total_listings ?? 0,
      bio: host.bio ?? null,
      isSuperhost: host.is_superhost ?? false,
      isVerified: host.is_verified ?? false,
      yearsExperience: host.years_experience ?? 0,
    }
  })
}, ['hosts:getTalents'], { revalidate: 300, tags: ['hosts:getTalents'] })
