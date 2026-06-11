import { supabaseAdmin } from '@/lib/supabase-admin'
import { toHandle } from '@/lib/handle'
import { extractAvatarUrl, type ProfileJoin } from '@/lib/supabase-joins'
import { unstable_cache } from 'next/cache'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SELECT = 'id, display_name, bio, total_reviews, average_rating, total_listings, city, country, profiles(avatar_url)'

function mapHost(host: Record<string, unknown>, handle: string) {
  return {
    id: host.id as string,
    displayName: host.display_name as string,
    handle,
    avatarUrl: extractAvatarUrl(host.profiles as ProfileJoin),
    bgImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
    count: (host.total_listings as number) ?? 0,
    description: (host.bio as string | null) ?? '',
    jobName: 'Cultural Guide',
    starRating: (host.average_rating as number) ?? 0,
    reviewsCount: (host.total_reviews as number) ?? 0,
    location: [host.city, host.country].filter(Boolean).join(', '),
  }
}

export const getAuthors = unstable_cache(
  async () => {
    const { data: hosts } = await supabaseAdmin
      .from('hosts')
      .select(SELECT)
      .eq('status', 'active')

    if (!hosts || hosts.length === 0) return []

    return hosts.map((host) =>
      mapHost(host as Record<string, unknown>, toHandle(host.display_name as string))
    )
  },
  ['authors:getAuthors'],
  { revalidate: 300, tags: ['authors:getAuthors'] }
)

export async function getAuthorByHandle(handle: string) {
  if (UUID_RE.test(handle)) {
    const { data: host, error } = await supabaseAdmin
      .from('hosts')
      .select(SELECT)
      .eq('id', handle)
      .single()
    if (error) console.error('[authors] UUID lookup error:', error)
    return host ? mapHost(host as Record<string, unknown>, handle) : null
  }

  // Display-name handle → search cached active hosts first
  const authors = await getAuthors()
  const fromList = authors.find((a) => a.handle === handle)
  if (fromList) return fromList

  // Not in active list — search by first word to avoid a full table scan
  const [firstWord] = handle.split('-')
  const { data: hosts } = await supabaseAdmin
    .from('hosts')
    .select(SELECT)
    .ilike('display_name', `%${firstWord}%`)
    .limit(100)

  const host = (hosts ?? []).find(
    (h) => h.display_name && toHandle(h.display_name as string) === handle
  )
  if (!host) return null

  return mapHost(host as Record<string, unknown>, handle)
}

export type TAuthor = Awaited<ReturnType<typeof getAuthors>>[number]
