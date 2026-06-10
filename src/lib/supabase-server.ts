import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Resolves the profiles.id for the authenticated user.
 * Retries once after a short delay to handle the OAuth trigger race condition
 * where the profile row hasn't been created yet immediately after signup.
 */
export async function getProfileId(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const query = () =>
    supabase.from('profiles').select('id').eq('user_id', userId).single()

  const { data } = await query()
  if (data?.id) return data.id

  await new Promise(r => setTimeout(r, 800))
  const { data: retried } = await query()
  return retried?.id ?? null
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
