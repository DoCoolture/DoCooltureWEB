export const dynamic = 'force-dynamic'

import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import CardTalent from '@/components/CardTalent'
import TalentFilterChips from '@/components/TalentFilterChips'
import { TTalent, SPECIALTY_BG_IMAGES, toHandle } from '@/data/hosts'
import { getServerT } from '@/lib/locale-server'
import BecomeHostCta from '@/components/BecomeHostCta'
import Heading from '@/shared/Heading'
import { HOST_SPECIALTIES } from '@/types'
import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
const DEFAULT_BG = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500'

async function getHostsDirect(): Promise<TTalent[]> {
  const [hostsResult, expsResult] = await Promise.all([
    supabaseAdmin
      .from('hosts')
      .select('id, display_name, bio, specialties, city, average_rating, total_reviews, total_listings, is_superhost, is_verified, years_experience, profiles(avatar_url)')
      .eq('status', 'active')
      .order('average_rating', { ascending: false }),
    supabaseAdmin
      .from('experiences')
      .select('host_id, category')
      .eq('is_published', true)
      .eq('is_hidden', false),
  ])

  if (hostsResult.error) {
    console.error('[talento] admin direct error:', JSON.stringify(hostsResult.error))
    return []
  }

  const categoryByHost = new Map<string, Set<string>>()
  for (const exp of expsResult.data ?? []) {
    if (!categoryByHost.has(exp.host_id)) categoryByHost.set(exp.host_id, new Set())
    if (exp.category) categoryByHost.get(exp.host_id)!.add(exp.category)
  }

  return (hostsResult.data ?? []).map((h: any) => {
    const expCategories = [...(categoryByHost.get(h.id) ?? [])]
    const primaryCategory = expCategories[0] ?? (h.specialties as string[] | null)?.[0] ?? ''
    return {
      id: h.id,
      displayName: h.display_name,
      handle: toHandle(h.display_name as string),
      avatarUrl: (() => { const p = h.profiles; const v = Array.isArray(p) ? p[0] : p; return v?.avatar_url ?? null })() ?? '',
      bgImage: SPECIALTY_BG_IMAGES[primaryCategory] ?? DEFAULT_BG,
      specialties: h.specialties ?? [],
      experienceCategories: expCategories,
      city: h.city ?? null,
      averageRating: h.average_rating ?? 0,
      totalReviews: h.total_reviews ?? 0,
      totalListings: h.total_listings ?? 0,
      bio: h.bio ?? null,
      isSuperhost: h.is_superhost ?? false,
      isVerified: h.is_verified ?? false,
      yearsExperience: h.years_experience ?? 0,
    }
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT()
  const tp = t.talentPage
  return {
    title: tp.heading,
    description: tp.subheading,
  }
}

const TalentoPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const sp = await searchParams
  const [t, talents] = await Promise.all([getServerT(), getHostsDirect()])
  const tp = t.talentPage

  const activeSpecialty = sp.specialty ?? null
  const specialtyMap = tp.specialtyMap as Record<string, string>

  const filtered = activeSpecialty
    ? talents.filter((talent) => talent.experienceCategories.includes(activeSpecialty))
    : talents

  return (
    <div className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="container py-16 lg:py-24">

        <Heading subheading={tp.subheading} className="mb-10">
          {tp.heading}
        </Heading>

        <TalentFilterChips
          specialties={[...HOST_SPECIALTIES]}
          activeSpecialty={activeSpecialty}
          allLabel={tp.allSpecialties}
          specialtyMap={specialtyMap}
        />

        <p className="mt-6 mb-8 text-sm text-neutral-500 dark:text-neutral-400">
          {filtered.length} {filtered.length !== 1 ? tp.hosts : tp.host}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((talent) => (
              <CardTalent
                key={talent.id}
                talent={talent}
                specialtyLabel={talent.experienceCategories.map((s) => specialtyMap[s] ?? s).join(', ')}
                superhostLabel={tp.superhost}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-neutral-500 dark:text-neutral-400">
            {tp.noResults}
          </div>
        )}

        <div className="relative mt-24 py-16">
          <BackgroundSection />
          <div className="text-center">
            <Heading isCenter subheading={tp.becomeHostSubheading}>
              {tp.becomeHostHeading}
            </Heading>
            <BecomeHostCta label={tp.becomeHostButton} className="mt-6" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default TalentoPage
