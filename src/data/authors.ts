import avatars1 from '@/images/avatars/Image-1.png'
import { supabase } from '@/lib/supabase'

function toHandle(displayName: string) {
  return displayName.toLowerCase().replace(/\s+/g, '-')
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

  // Fallback mientras no haya hosts en Supabase
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
  // Try from the active-hosts list first
  const authors = await getAuthors()
  const fromList = authors.find((a) => a.handle === handle)
  if (fromList) return { ...fromList, reviewsCount: fromList.reviews }

  // Fallback: search any host regardless of status (e.g. pending verification)
  const { data: hosts } = await supabase
    .from('hosts')
    .select('id, display_name, bio, avatar_url, total_reviews, average_rating, total_listings, city, country')

  const host = (hosts ?? []).find((h) => toHandle(h.display_name as string) === handle)
  if (!host) return null

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

export type TAuthor = Awaited<ReturnType<typeof getAuthors>>[number]
