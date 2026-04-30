import { ThemeProvider } from '@/components/theme-provider'
import { DirectionProvider } from '@/components/ui/direction'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import 'rc-slider/assets/index.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s - DoCoolture',
    default: 'DoCoolture - Experiencias únicas',
  },
  description: 'Descubre y reserva experiencias inolvidables con DoCoolture.',
  keywords: ['DoCoolture', 'Experiencias', 'Tours', 'Aventura', 'República Dominicana'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      dir={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
      suppressHydrationWarning
      className={cn('font-sans', poppins.variable)}
    >
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
