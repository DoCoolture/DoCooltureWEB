import 'server-only'

if (process.env.NODE_ENV === 'production' && !process.env.PAYPAL_BASE_URL) {
  throw new Error('PAYPAL_BASE_URL must be set in production — default points to sandbox')
}

export const PAYPAL_BASE = process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com'

// Module-level token cache: PayPal tokens are valid for ~9 hours.
// Re-using the same token avoids an extra 300–500 ms round-trip on every transaction.
let _cachedToken: { value: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
  if (_cachedToken && Date.now() < _cachedToken.expiresAt - 60_000) {
    return _cachedToken.value
  }

  const clientId = process.env.PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_CLIENT_SECRET!
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description ?? 'PayPal auth failed')

  _cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 32400) * 1000,
  }
  return _cachedToken.value
}
