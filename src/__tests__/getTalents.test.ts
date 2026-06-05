import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, cache: (fn: unknown) => fn }
})

const mockHostsQuery = vi.fn()
const mockExpsQuery = vi.fn()

vi.mock('@/lib/supabase-server', () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: vi.fn((table: string) => {
      if (table === 'hosts') return mockHostsQuery()
      if (table === 'experiences') return mockExpsQuery()
    }),
  })),
}))

const HOST_FIXTURE = {
  id: 'host-1',
  display_name: 'Maria Lopez',
  bio: 'Experta en gastronomía dominicana',
  specialties: ['Gastronomía'],
  city: 'Santiago',
  average_rating: 4.8,
  total_reviews: 20,
  total_listings: 5,
  is_superhost: true,
  is_verified: true,
  years_experience: 7,
  profiles: [{ avatar_url: 'https://cdn.example.com/maria.jpg' }],
}

const EXP_FIXTURE = { host_id: 'host-1', category: 'Gastronomía' }

function makeHostsBuilder(resolvedValue: object) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(resolvedValue),
  }
}

function makeExpsBuilder(resolvedValue: object) {
  const inner = { eq: vi.fn().mockResolvedValue(resolvedValue) }
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnValue(inner),
  }
}

describe('getTalents', () => {
  beforeEach(() => {
    vi.resetModules()
    mockHostsQuery.mockReturnValue(makeHostsBuilder({ data: [HOST_FIXTURE], error: null }))
    mockExpsQuery.mockReturnValue(makeExpsBuilder({ data: [EXP_FIXTURE], error: null }))
  })

  it('devuelve talentos mapeados desde hosts activos', async () => {
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'host-1',
      displayName: 'Maria Lopez',
      handle: 'maria-lopez',
      averageRating: 4.8,
      totalReviews: 20,
      isSuperhost: true,
      isVerified: true,
    })
  })

  it('genera el handle desde display_name', async () => {
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result[0].handle).toBe('maria-lopez')
  })

  it('genera el handle sin tildes para nombres con acentos', async () => {
    mockHostsQuery.mockReturnValue(
      makeHostsBuilder({ data: [{ ...HOST_FIXTURE, display_name: 'María López' }], error: null })
    )
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result[0].handle).toBe('maria-lopez')
  })

  it('mapea las categorías de experiencias al host', async () => {
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result[0].experienceCategories).toContain('Gastronomía')
  })

  it('devuelve array vacío si no hay hosts activos', async () => {
    mockHostsQuery.mockReturnValue(makeHostsBuilder({ data: [], error: null }))
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result).toEqual([])
  })

  it('devuelve array vacío si hostsResult.data es null', async () => {
    mockHostsQuery.mockReturnValue(makeHostsBuilder({ data: null, error: null }))
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result).toEqual([])
  })

  it('extrae el avatarUrl del array profiles', async () => {
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result[0].avatarUrl).toBe('https://cdn.example.com/maria.jpg')
  })

  it('consulta hosts con status active ordenado por average_rating', async () => {
    const hostsBuilder = makeHostsBuilder({ data: [HOST_FIXTURE], error: null })
    mockHostsQuery.mockReturnValue(hostsBuilder)
    const { getTalents } = await import('@/data/hosts')
    await getTalents()
    expect(hostsBuilder.eq).toHaveBeenCalledWith('status', 'active')
    expect(hostsBuilder.order).toHaveBeenCalledWith('average_rating', { ascending: false })
  })

  it('el SELECT de hosts no incluye asterisco (*)', async () => {
    const hostsBuilder = makeHostsBuilder({ data: [HOST_FIXTURE], error: null })
    mockHostsQuery.mockReturnValue(hostsBuilder)
    const { getTalents } = await import('@/data/hosts')
    await getTalents()
    const selectArg = (hostsBuilder.select.mock.calls as unknown as [string[]][]).at(0)?.[0] ?? ''
    expect(selectArg).not.toBe('*')
    expect(selectArg).toContain('id')
    expect(selectArg).toContain('display_name')
    expect(selectArg).toContain('average_rating')
  })

  it('registra error si la query de experiencias falla', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockExpsQuery.mockReturnValue(makeExpsBuilder({ data: null, error: { message: 'DB error' } }))
    const { getTalents } = await import('@/data/hosts')
    await getTalents()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[getTalents] experiences error:'),
      expect.any(String)
    )
    consoleSpy.mockRestore()
  })

  it('sigue devolviendo hosts aunque la query de experiencias falle', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockExpsQuery.mockReturnValue(makeExpsBuilder({ data: null, error: { message: 'DB error' } }))
    const { getTalents } = await import('@/data/hosts')
    const result = await getTalents()
    expect(result).toHaveLength(1)
    expect(result[0].experienceCategories).toEqual([])
  })
})
