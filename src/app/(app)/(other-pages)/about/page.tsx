import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionClientSay from '@/components/SectionClientSay'
import rightImg from '@/images/about-hero-right.png'
import { getPublicTestimonials } from '@/data/reviews'
import { getServerT } from '@/lib/locale-server'
import { Metadata } from 'next'
import SectionFounder from './SectionFounder'
import SectionHero from './SectionHero'
import SectionStatistic from './SectionStatistic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT()
  return {
    title: t.about.heading.replace('👋 ', ''),
    description: t.about.subheading,
  }
}

const PageAbout = async () => {
  const [t, testimonials] = await Promise.all([getServerT(), getPublicTestimonials()])

  return (
    <div className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="container flex flex-col gap-y-16 py-16 lg:gap-y-28 lg:py-28">
        <SectionHero
          rightImg={rightImg}
          heading={`👋 ${t.about.heading}`}
          subHeading={t.about.subheading}
        />

        <SectionFounder />

        <div className="relative py-20">
          <BackgroundSection />
          <SectionClientSay testimonials={testimonials.length > 0 ? testimonials : undefined} />
        </div>

        <SectionStatistic />
      </div>
    </div>
  )
}

export default PageAbout
