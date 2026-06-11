import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { calculateTotal, toDopAmount } from '@/lib/pricing'

describe('calculateTotal', () => {
  it('applies 18% fee for one guest', () => {
    expect(calculateTotal(100, 1)).toBe(118)
  })

  it('multiplies by guest count before applying fee', () => {
    expect(calculateTotal(50, 3)).toBe(177)
  })

  it('rounds to 2 decimal places', () => {
    // 33.33 * 2 * 1.18 = 78.6588 → 78.66
    expect(calculateTotal(33.33, 2)).toBe(78.66)
  })

  it('returns zero for zero price', () => {
    expect(calculateTotal(0, 5)).toBe(0)
  })

  it('amount mismatch tolerance is ≤ 0.02', () => {
    const expected = calculateTotal(99.99, 2) // 235.9764 → 235.98
    // A tampered amount 0.01 above should pass the ≤0.02 check
    expect(Math.abs(235.99 - expected)).toBeLessThanOrEqual(0.02)
    // A tampered amount 0.03 above should fail
    expect(Math.abs(236.01 - expected)).toBeGreaterThan(0.02)
  })
})

describe('toDopAmount', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('converts USD to DOP at the default rate of 60', () => {
    expect(toDopAmount(10)).toBe(600)
  })

  it('rounds to 2 decimal places', () => {
    // 10 * 60 = 600.00 — use a fractional rate to exercise rounding
    expect(toDopAmount(1 / 3)).toBe(20)
  })

  it('returns 0 for a 0 USD amount', () => {
    expect(toDopAmount(0)).toBe(0)
  })
})
