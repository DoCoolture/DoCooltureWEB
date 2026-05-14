import { supabase } from '@/lib/supabase'

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

const DOCOOLTURE_TALENT: TTalent = {
  id: 'docoolture',
  displayName: 'DoCoolture',
  handle: 'docoolture',
  avatarUrl: '',
  bgImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
  specialties: ['Gastronomía', 'Historia y Cultura'],
  city: 'Santo Domingo',
  averageRating: 5.0,
  totalReviews: 12,
  totalListings: 1,
  bio: 'Somos un equipo apasionado por mostrar la República Dominicana auténtica.',
  isSuperhost: true,
  isVerified: true,
  yearsExperience: 3,
}

export async function getTalents(): Promise<TTalent[]> {
  const { data: hosts } = await supabase
    .from('hosts')
    .select('*')
    .eq('status', 'active')
    .order('average_rating', { ascending: false })

  if (!hosts || hosts.length === 0) {
    return [DOCOOLTURE_TALENT]
  }

  const results: TTalent[] = [DOCOOLTURE_TALENT]

  for (const host of hosts) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, city')
      .eq('id', host.profile_id)
      .single()

    const specialties = (host.specialties as string[] | null) ?? []
    const primarySpecialty = specialties[0] ?? ''
    const bgImage = SPECIALTY_BG_IMAGES[primarySpecialty] ?? DEFAULT_BG

    results.push({
      id: host.id,
      displayName: host.display_name,
      handle: host.id,
      avatarUrl: profile?.avatar_url ?? '',
      bgImage,
      specialties,
      city: host.city ?? profile?.city ?? null,
      averageRating: host.average_rating ?? 0,
      totalReviews: host.total_reviews ?? 0,
      totalListings: host.total_listings ?? 0,
      bio: host.bio ?? null,
      isSuperhost: host.is_superhost ?? false,
      isVerified: host.is_verified ?? false,
      yearsExperience: host.years_experience ?? 0,
    })
  }

  return results
}
