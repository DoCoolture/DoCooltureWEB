import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, debounceWithCancel } from '@/lib/debounce'

describe('debounce (useSnapSlider)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('no ejecuta la función inmediatamente', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    expect(fn).not.toHaveBeenCalled()
  })

  it('ejecuta la función después del delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('llama solo una vez si se invoca varias veces dentro del delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('usa los argumentos de la última llamada', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced('primera')
    debounced('segunda')
    debounced('última')
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledWith('última')
  })

  it('puede volver a ejecutar tras el delay previo', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    vi.advanceTimersByTime(300)
    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('debounceWithCancel (LocationInputField)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('expone el método cancel', () => {
    const fn = vi.fn()
    const debounced = debounceWithCancel(fn, 300)
    expect(typeof debounced.cancel).toBe('function')
  })

  it('cancel() impide que se ejecute la función pendiente', () => {
    const fn = vi.fn()
    const debounced = debounceWithCancel(fn, 300)
    debounced()
    debounced.cancel()
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })

  it('cancel() no falla si no hay llamada pendiente', () => {
    const fn = vi.fn()
    const debounced = debounceWithCancel(fn, 300)
    expect(() => debounced.cancel()).not.toThrow()
  })

  it('se puede volver a llamar después de cancel()', () => {
    const fn = vi.fn()
    const debounced = debounceWithCancel(fn, 300)
    debounced()
    debounced.cancel()
    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
