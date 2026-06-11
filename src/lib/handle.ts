/**
 * Converts a display name into a URL-safe handle.
 * Pure function — kept out of data modules so it can be imported anywhere
 * (client, tests) without pulling in server-only Supabase clients.
 *
 * "José García" → "jose-garcia"
 */
export function toHandle(displayName: string): string {
  return displayName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/(^-|-$)/g, '')
}
