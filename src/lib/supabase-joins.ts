/**
 * Helpers for Supabase embedded-join results.
 *
 * Supabase returns a joined relation either as a single object (1:1) or as an
 * array (1:N), depending on how the FK is configured. These helpers normalize
 * that shape so callers don't have to repeat the `Array.isArray(...)` dance.
 */

// Supabase returns a join as an object (1:1 FK) or array (1:N FK) depending on schema direction.
export type ProfileJoin = { avatar_url: string | null } | { avatar_url: string | null }[] | null

/** Extracts the avatar URL from a `profiles(avatar_url)` join, or '' if absent. */
export function extractAvatarUrl(profiles: ProfileJoin): string {
  if (!profiles) return ''
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  return profile?.avatar_url ?? ''
}
