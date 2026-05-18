import Header from '@/components/Header/Header'
import { ApplicationLayout } from '../application-layout'

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout header={<Header hasBorderBottom={true} />}>{children}</ApplicationLayout>
}
