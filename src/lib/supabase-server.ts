import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Resolves the profiles.id for the authenticated user.
 * Retries with exponential backoff to handle the OAuth trigger race condition
 * where the profile row hasn't been created yet immediately after signup.
 * Strategy: immediate attempt first, then 200 / 400 / 800 ms delays (4 total).
 */
export async function getProfileId(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const query = () =>
    supabase.from('profiles').select('id').eq('user_id', userId).single()

  // First attempt is immediate; subsequent waits happen only before a retry.
  const retryDelays = [200, 400, 800]

  const { data: first } = await query()
  if (first?.id) return first.id

  for (const delay of retryDelays) {
    await new Promise(r => setTimeout(r, delay))
    const { data } = await query()
    if (data?.id) return data.id
  }

  console.warn('[getProfileId] profile not found after retries for user:', userId)
  return null
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookies will be set by the middleware
          }
        },
      },
    }
  )
}
