import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import ExperiencesCard from '@/components/ExperiencesCard'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import HeroSearchForm from '@/components/HeroSearchForm/HeroSearchForm'
import SectionClientSay from '@/components/SectionClientSay'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionHowItWork from '@/components/SectionHowItWork'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import { getExperienceCategories } from '@/data/categories'
import { getExperienceListings } from '@/data/listings'
import { getPublicTestimonials } from '@/data/reviews'
import { getServerT } from '@/lib/locale-server'
import heroImage from '@/images/hero-right-experience.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import HeadingWithSub from '@/shared/Heading'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT()
  return {
    title: t.homePage.sectionHero.title.slice(0, 60),
    description: t.homePage.sectionHero.description,
  }
}

async function Home() {
  const [categories, experienceListings, testimonials, t] = await Promise.all([
    getExperienceCategories(),
    getExperienceListings(),
    getPublicTestimonials(),
    getServerT(),
  ])
  const hp = t.homePage

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">

        {/* HERO */}
        <HeroSectionWithSearchForm1
          heading={hp.sectionHero.title}
          image={heroImage}
          imageAlt="Experiencias auténticas en la República Dominicana"
          searchForm={<HeroSearchForm initTab="Experiences" />}
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
                {hp.sectionHero.description}
              </p>
              <ButtonPrimary href="/experience-categories/all" className="sm:text-base/normal">
                {hp.sectionHero.button}
              </ButtonPrimary>
            </>
          }
        />

        {/* Explora por categorías */}
        <div>
          <HeadingWithSub subheading={hp.exploreByCategorySubheading}>
            {hp.exploreByCategory}
          </HeadingWithSub>
          <SectionSliderNewCategories
            itemClassName="w-[17rem] lg:w-1/3 xl:w-1/4"
            categories={categories}
            categoryCardType="card5"
          />
        </div>

        {/* Experiencias destacadas */}
        <div className="relative py-20">
          <BackgroundSection />
          <HeadingWithSub isCenter subheading={hp.featuredSubheading}>
            {hp.featuredExperiences}
          </HeadingWithSub>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {experienceListings.map((listing) => (
              <ExperiencesCard key={listing.id} data={listing} />
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <ButtonPrimary href="/experience-categories/all">
              <span>{hp.viewAll}</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={20} color="currentColor" strokeWidth={1.5} className="rtl:rotate-180" />
            </ButtonPrimary>
          </div>
        </div>

        {/* Cómo funciona */}
        <SectionHowItWork />

        {/* Explora por destino */}
        <div>
          <HeadingWithSub isCenter subheading={hp.exploreByDestinationSubheading}>
            {hp.exploreByDestination}
          </HeadingWithSub>
          <SectionGridCategoryBox categories={categories.slice(0, 3)} />
        </div>

        <Divider />

        {/* Testimonios */}
        <div className="relative py-10">
          <SectionClientSay testimonials={testimonials.length > 0 ? testimonials : undefined} />
        </div>

      </div>
    </main>
  )
}

export default Home
