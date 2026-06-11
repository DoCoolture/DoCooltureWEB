import { Metadata } from 'next'
import { ApplicationLayout } from '../application-layout'

export const metadata: Metadata = {
  title: 'Experiencias auténticas en República Dominicana',
  description:
    'Descubre y reserva experiencias únicas en la República Dominicana — gastronomía, aventura, cultura, música y más, con anfitriones locales verificados.',
  keywords: ['experiencias', 'República Dominicana', 'turismo', 'actividades', 'aventura', 'gastronomía', 'cultura dominicana', 'DoCoolture'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}
