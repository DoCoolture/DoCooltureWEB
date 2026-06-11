import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))

const mockEq = vi.fn()
const mockSelect = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))

vi.mock('@/lib/supabase-admin', () => ({
  supabaseAdmin: { from: mockFrom },
}))

const HOST_FIXTURE = {
  id: 'host-abc-123',
  display_name: 'Carlos Ramirez',
  bio: 'Guía turístico en Santo Domingo',
  total_reviews: 12,
  average_rating: 4.7,
  total_listings: 3,
  city: 'Santo Domingo',
  country: 'Dominican Republic',
  profiles: { avatar_url: 'https://cdn.example.com/avatar.jpg' },
}

describe('getAuthors', () => {
  beforeEach(() => {
    vi.resetModules()
    mockEq.mockResolvedValue({ data: [HOST_FIXTURE], error: null })
  })

  it('devuelve autores mapeados desde hosts activos', async () => {
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'host-abc-123',
      displayName: 'Carlos Ramirez',
      handle: 'carlos-ramirez',
      starRating: 4.7,
      reviews: 12,
      count: 3,
    })
  })

  it('genera el handle desde el display_name', async () => {
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result[0].handle).toBe('carlos-ramirez')
  })

  it('extrae el avatarUrl desde el objeto profiles', async () => {
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result[0].avatarUrl).toBe('https://cdn.example.com/avatar.jpg')
  })

  it('devuelve array vacío cuando no hay hosts', async () => {
    mockEq.mockResolvedValueOnce({ data: [], error: null })
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result).toEqual([])
  })

  it('devuelve array vacío cuando data es null', async () => {
    mockEq.mockResolvedValueOnce({ data: null, error: null })
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result).toEqual([])
  })

  it('construye la location con city y country', async () => {
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result[0].location).toBe('Santo Domingo, Dominican Republic')
  })

  it('omite campos vacíos en la location', async () => {
    mockEq.mockResolvedValueOnce({ data: [{ ...HOST_FIXTURE, country: null }], error: null })
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result[0].location).toBe('Santo Domingo')
  })

  it('consulta la tabla hosts con status active', async () => {
    const { getAuthors } = await import('@/data/authors')
    await getAuthors()
    expect(mockFrom).toHaveBeenCalledWith('hosts')
    expect(mockEq).toHaveBeenCalledWith('status', 'active')
  })

  it('el SELECT no incluye asterisco (*)', async () => {
    await import('@/data/authors')
    const selectArg = (mockSelect.mock.calls as unknown as [string[]][]).at(0)?.[0] ?? ''
    expect(selectArg).not.toBe('*')
    expect(selectArg).toContain('id')
    expect(selectArg).toContain('display_name')
    expect(selectArg).toContain('average_rating')
  })

  it('el handle de un host con tildes no tiene caracteres especiales', async () => {
    mockEq.mockResolvedValueOnce({
      data: [{ ...HOST_FIXTURE, display_name: 'José Núñez' }],
      error: null,
    })
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result[0].handle).toMatch(/^[a-z0-9-]+$/)
    expect(result[0].handle).toBe('jose-nunez')
  })

  it('devuelve array vacío si Supabase devuelve error', async () => {
    mockEq.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } })
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result).toEqual([])
  })

  it('genera el handle sin tildes para nombres con acentos', async () => {
    mockEq.mockResolvedValueOnce({
      data: [{ ...HOST_FIXTURE, display_name: 'María López' }],
      error: null,
    })
    const { getAuthors } = await import('@/data/authors')
    const result = await getAuthors()
    expect(result[0].handle).toBe('maria-lopez')
  })
})
