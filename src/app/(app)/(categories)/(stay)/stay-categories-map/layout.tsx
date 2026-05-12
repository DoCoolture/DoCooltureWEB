import { ApplicationLayout } from '@/app/(app)/application-layout'
import Header3 from '@/components/Header/Header3'
import { ReactNode, Suspense } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <ApplicationLayout
      header={
        <Suspense>
          <Header3 initSearchFormTab="Stays" />
        </Suspense>
      }
    >
      {children}
    </ApplicationLayout>
  )
}

export default Layout
