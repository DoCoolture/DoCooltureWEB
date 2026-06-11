const feePercent = Number(process.env.NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE ?? 18)
const SERVICE_FEE_FACTOR = 1 + (Number.isFinite(feePercent) && feePercent > 0 ? feePercent : 18) / 100

// Single source of truth for USD→DOP conversion — used both server-side (Cardnet charge)
// and client-side (pay-done receipt display). NEXT_PUBLIC_ so it's available in both contexts.
// Set NEXT_PUBLIC_USD_TO_DOP_RATE in .env to override (e.g. "60.5").
const USD_TO_DOP_RATE = Number(process.env.NEXT_PUBLIC_USD_TO_DOP_RATE ?? 60)
const VALID_DOP_RATE = Number.isFinite(USD_TO_DOP_RATE) && USD_TO_DOP_RATE > 0 ? USD_TO_DOP_RATE : 60

export function calculateTotal(priceUsd: number, guests: number): number {
  return Number((priceUsd * guests * SERVICE_FEE_FACTOR).toFixed(2))
}

/** Convert a USD amount to DOP using the configured exchange rate. */
export function toDopAmount(usd: number): number {
  return Number((usd * VALID_DOP_RATE).toFixed(2))
}
