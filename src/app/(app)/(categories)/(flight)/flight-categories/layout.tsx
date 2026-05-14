import { ApplicationLayout } from '@/app/(app)/application-layout'
import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import { getAuthors } from '@/data/authors'
import { getStayCategories } from '@/data/categories'
import { getServerT } from '@/lib/locale-server'
import Heading from '@/shared/Heading'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
  const [categories, authors, t] = await Promise.all([
    getStayCategories().then((c) => c.slice(7, 15)),
    getAuthors(),
    getServerT(),
  ])
  const c = t.categories.flight

  return (
    <ApplicationLayout>
      <BgGlassmorphism />

      {children}

      <div className="container">
        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <Heading subheading={c.sectionSubheading}>{c.sectionHeading}</Heading>
          <SectionSliderNewCategories
            itemClassName="w-[17rem] lg:w-1/3 xl:w-1/4"
            categories={categories}
            categoryCardType="card5"
          />
        </div>
        <div className="relative mb-24 py-16 lg:mb-28 lg:py-20">
          <BackgroundSection />
          <Heading subheading={c.authorsSubheading} isCenter>
            {c.authorsHeading}
          </Heading>
          <SectionGridAuthorBox
            authors={authors}
            showMoreLabel={t.common['Show me more']}
            becomeHostLabel={t.common['Become a host']}
            jobNameLabel={t.sectionHost.jobName}
          />
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Layout
