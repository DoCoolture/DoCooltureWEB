import { createClient } from '@supabase/supabase-js'
import avatars1 from '@/images/avatars/Image-1.png'

// Server-side anon client (never browser client in data layer)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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
  city: string | null
  averageRating: number
  totalReviews: number
  totalListings: number
  bio: string | null
  isSuperhost: boolean
  isVerified: boolean
  yearsExperience: number
}

const SPECIALTY_BG_IMAGES: Record<string, string> = {
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
  const { data: hosts, error } = await supabaseAnon
    .from('hosts')
    .select('id, display_name, bio, avatar_url, specialties, city, average_rating, total_reviews, total_listings, is_superhost, is_verified, years_experience, status')
    .eq('status', 'active')
    .order('average_rating', { ascending: false })

  if (error) console.error('[getTalents] error:', JSON.stringify(error))

  if (!hosts || hosts.length === 0) {
    return []
  }

  return hosts.map((host) => {
    const specialties = (host.specialties as string[] | null) ?? []
    const primarySpecialty = specialties[0] ?? ''
    const bgImage = SPECIALTY_BG_IMAGES[primarySpecialty] ?? DEFAULT_BG

    return {
      id: host.id as string,
      displayName: host.display_name as string,
      handle: toHandle(host.display_name as string),
      avatarUrl: (host.avatar_url as string | null) ?? avatars1.src,
      bgImage,
      specialties,
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
