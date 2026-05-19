export const CARDNET_BASE_URL =
  process.env.CARDNET_BASE_URL ?? 'https://labservicios.cardnet.com.do'

export const CARDNET_REST_BASE = `${CARDNET_BASE_URL}/api/payment`

export const CARDNET_AUTHORIZE_URL =
  process.env.NEXT_PUBLIC_CARDNET_AUTHORIZE_URL ??
  'https://labservicios.cardnet.com.do/authorize'

/** Converts a decimal amount to 12-digit zero-padded string (e.g. 1.50 → "000000000150") */
export function formatAmount(amount: number): string {
  return Math.round(amount * 100)
    .toString()
    .padStart(12, '0')
}

/** Generates a 6-char alphanumeric transaction ID */
export function generateTxId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
