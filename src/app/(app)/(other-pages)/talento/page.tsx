import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import CardTalent from '@/components/CardTalent'
import TalentFilterChips from '@/components/TalentFilterChips'
import { getTalents } from '@/data/hosts'
import { getServerT } from '@/lib/locale-server'
import BecomeHostCta from '@/components/BecomeHostCta'
import Heading from '@/shared/Heading'
import { HOST_SPECIALTIES } from '@/types'
import { Metadata } from 'next'

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
  const [t, talents] = await Promise.all([getServerT(), getTalents()])
  const tp = t.talentPage

  const activeSpecialty = sp.specialty ?? null
  const specialtyMap = tp.specialtyMap as Record<string, string>

  const filtered = activeSpecialty
    ? talents.filter((talent) => talent.specialties.includes(activeSpecialty))
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
                specialtyLabel={talent.specialties.map((s) => specialtyMap[s] ?? s).join(', ')}
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
