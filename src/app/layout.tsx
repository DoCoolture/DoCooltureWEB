import { ThemeProvider } from '@/components/theme-provider'
import { DirectionProvider } from '@/components/ui/direction'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { getServerLocale } from '@/lib/locale-server'
import { cn } from '@/lib/utils'
import '@/styles/tailwind.css'
import { Metadata } from 'next'
import 'rc-slider/assets/index.css'

export const metadata: Metadata = {
  title: {
    template: '%s - DoCoolture',
    default: 'DoCoolture - Experiencias únicas',
  },
  description: 'Descubre y reserva experiencias inolvidables con DoCoolture.',
  keywords: ['DoCoolture', 'Experiencias', 'Tours', 'Aventura', 'República Dominicana'],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale()

  return (
    <html
      lang={locale}
      dir={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
      suppressHydrationWarning
      className={cn('font-sans')}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <DirectionProvider
            dir={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
            direction={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
          >
            <LanguageProvider>
              <CurrencyProvider>
                <div>
                  {children}
                </div>
              </CurrencyProvider>
            </LanguageProvider>
          </DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
