import { getServerT } from '@/lib/locale-server'
import Heading from '@/shared/Heading'
import Image from 'next/image'

const members = [
  { id: '1', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg' },
  { id: '2', avatar: 'https://images.pexels.com/photos/732425/pexels-photo-732425.jpeg' },
  { id: '3', avatar: 'https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg' },
  { id: '4', avatar: 'https://images.pexels.com/photos/2804282/pexels-photo-2804282.jpeg' },
]

const teamNames = ['Juan José', 'María González', 'Carlos Díaz', 'Ana Martínez']
const teamRoles = {
  es: ['Co-fundador y CEO', 'Co-fundadora y Directora de Experiencias', 'Director de Tecnología', 'Directora de Comunidad'],
  en: ['Co-founder & CEO', 'Co-founder & Head of Experiences', 'Chief Technology Officer', 'Head of Community'],
  fr: ['Co-fondateur & PDG', 'Co-fondatrice & Directrice des Expériences', 'Directeur Technique', 'Directrice de la Communauté'],
}

const SectionFounder = async () => {
  const t = await getServerT()
  const { heading, subheading } = t.about.team

  // Detect locale from the translations object to pick the right roles
  const isEn = heading === 'Our team'
  const isFr = heading === 'Notre équipe'
  const locale = isFr ? 'fr' : isEn ? 'en' : 'es'
  const roles = teamRoles[locale]

  return (
    <div className="relative">
      <Heading subheading={subheading}>
        ⛱ {heading}
      </Heading>
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {members.map((item, index) => (
          <div key={item.id} className="max-w-sm">
            <div className="aspect-w-1 relative h-0 overflow-hidden rounded-xl aspect-h-1">
              <Image
                fill
                className="object-cover"
                src={item.avatar}
                alt=""
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 30vw"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 md:text-xl dark:text-neutral-200">
              {teamNames[index]}
            </h3>
            <span className="block text-sm text-neutral-500 sm:text-base dark:text-neutral-400">{roles[index]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionFounder
