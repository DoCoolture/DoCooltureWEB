import { ApplicationLayout } from '@/app/(app)/application-layout'
import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import { getCarCategories } from '@/data/categories'
import { getServerT } from '@/lib/locale-server'
import Heading from '@/shared/Heading'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
  const [categories, t] = await Promise.all([
    getCarCategories().then((c) => c.slice(0, 7)),
    getServerT(),
  ])
  const c = t.categories.car

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
      </div>
    </ApplicationLayout>
  )
}

export default Layout
