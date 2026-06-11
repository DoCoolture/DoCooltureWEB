import { supabaseAdmin } from '@/lib/supabase-admin'
import type { ExperienceReview } from '@/lib/supabase'

export type { ExperienceReview }

export async function getExperienceReviews(experienceId: string): Promise<ExperienceReview[]> {
  const { data } = await supabaseAdmin
    .from('experience_reviews')
    .select('id, experience_id, booking_id, explorer_id, reviewer_name, reviewer_avatar_url, rating, comment, host_reply, host_replied_at, hidden_reason, created_at, is_visible')
    .eq('experience_id', experienceId)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as ExperienceReview[]
}

export type PublicTestimonial = {
  id: string
  content: string
  clientName: string
}

export async function getPublicTestimonials(limit = 6): Promise<PublicTestimonial[]> {
  const { data } = await supabaseAdmin
    .from('experience_reviews')
    .select('id, comment, reviewer_name, rating')
    .eq('is_visible', true)
    .gte('rating', 4)
    .not('comment', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!data || data.length === 0) return []
  return data.map((r) => ({
    id: r.id,
    content: r.comment as string,
    clientName: r.reviewer_name as string,
  }))
}
