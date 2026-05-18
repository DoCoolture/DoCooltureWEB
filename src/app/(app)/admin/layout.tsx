import Header from '@/components/Header/Header'
import { ApplicationLayout } from '../application-layout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout header={<Header hasBorderBottom={true} />}>{children}</ApplicationLayout>
}
