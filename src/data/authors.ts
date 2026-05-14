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
  const authors = await getAuthors()
  const author = authors.find((a) => a.handle === handle) ?? authors[0]

  return {
    ...author,
    reviewsCount: author.reviews,
  }
}

export type TAuthor = Awaited<ReturnType<typeof getAuthors>>[number]
