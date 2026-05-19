import avatars1 from '@/images/avatars/Image-1.png'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function toHandle(displayName: string) {
  return displayName.toLowerCase().replace(/\s+/g, '-')
}

function mapHost(host: Record<string, unknown>, handle: string) {
  return {
    id: host.id as string,
    displayName: host.display_name as string,
    handle,
    avatarUrl: (host.avatar_url as string | null) ?? avatars1.src,
    bgImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
    count: (host.total_listings as number) ?? 0,
    description: (host.bio as string | null) ?? '',
    jobName: 'Cultural Guide',
    starRating: (host.average_rating as number) ?? 0,
    reviews: (host.total_reviews as number) ?? 0,
    reviewsCount: (host.total_reviews as number) ?? 0,
    location: [host.city, host.country].filter(Boolean).join(', '),
  }
}

export async function getAuthors() {
  const { data: hosts } = await supabase
    .from('hosts')
    .select('id, display_name, bio, avatar_url, total_reviews, average_rating, total_listings, city, country')
    .eq('status', 'active')

  if (hosts && hosts.length > 0) {
    return hosts.map((host) => ({
      id: host.id as string,
      displayName: host.display_name as string,
      handle: toHandle(host.display_name as string),
      avatarUrl: (host.avatar_url as string | null) ?? avatars1.src,
      bgImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
      count: (host.total_listings as number) ?? 0,
      description: (host.bio as string | null) ?? '',
      jobName: 'Cultural Guide',
      starRating: (host.average_rating as number) ?? 0,
      reviews: (host.total_reviews as number) ?? 0,
      location: [host.city, host.country].filter(Boolean).join(', '),
    }))
  }

  return [
    {
      id: 'fallback',
      displayName: 'Eden Smith',
      handle: 'eden-smith',
      avatarUrl: avatars1.src,
      bgImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
      count: 1,
      description: 'Somos un equipo apasionado por mostrar la República Dominicana auténtica — su cultura, su gente y sus tradiciones.',
      jobName: 'Cultural Guide',
      starRating: 0,
      reviews: 0,
      location: 'Santo Domingo, RD',
    },
  ]
}

export async function getAuthorByHandle(handle: string) {
  const SELECT = 'id, display_name, bio, avatar_url, total_reviews, average_rating, total_listings, city, country'

  // 1. UUID handle → look up directly by id using admin client (bypasses RLS)
  if (UUID_RE.test(handle)) {
    const { data: host } = await supabaseAdmin
      .from('hosts')
      .select(SELECT)
      .eq('id', handle)
      .single()
    if (host) return mapHost(host as Record<string, unknown>, handle)
    return null
  }

  // 2. Display-name handle → search active hosts first
  const authors = await getAuthors()
  const fromList = authors.find((a) => a.handle === handle)
  if (fromList) return { ...fromList, reviewsCount: fromList.reviews }

  // 3. Not active — search all hosts using admin client (bypasses RLS)
  const { data: hosts } = await supabaseAdmin
    .from('hosts')
    .select(SELECT)

  const host = (hosts ?? []).find(
    (h) => h.display_name && toHandle(h.display_name as string) === handle
  )
  if (!host) return null

  return mapHost(host as Record<string, unknown>, handle)
}

export type TAuthor = Awaited<ReturnType<typeof getAuthors>>[number]
