'use client'

import { useLanguage } from '@/context/LanguageContext'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import type { JSX } from 'react'

const socialLinks: {
  name: string
  href: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/docoolture',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/docoolture',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function Footer2() {
  const { t } = useLanguage()
  const f = t.footer
  const currentYear = new Date().getFullYear()

  const cols = [
    {
      label: f.headings.explore,
      links: [
        { name: f.explore.viewMap,        href: '/experience-categories-map' },
        { name: f.explore.allExperiences, href: '/experience-categories/all' },
        { name: 'Punta Cana',             href: '/experience-categories/punta-cana' },
        { name: 'Santo Domingo',          href: '/experience-categories/santo-domingo' },
        { name: 'Samaná',                 href: '/experience-categories/samana' },
      ],
    },
    {
      label: f.headings.hosts,
      links: [
        { name: f.hosts.becomeHost, href: '/become-host' },
        { name: f.company.about,    href: '/about' },
      ],
    },
    {
      label: f.headings.legal,
      links: [
        { name: f.legal.terms,   href: '/terms' },
        { name: f.legal.privacy, href: '/privacy' },
        { name: f.legal.cookies, href: '/cookies' },
      ],
    },
  ]

  return (
    <footer className="border-t border-neutral-100 dark:border-neutral-800">
      <div className="container py-8 lg:py-10">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo className="w-16" />
            <p className="max-w-[220px] text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {f.brand}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3 sm:gap-x-16">
            {cols.map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  {col.label}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-1 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            &copy; {currentYear} DoCoolture &mdash; {f.rights}
          </p>
          <p className="text-xs text-neutral-300 dark:text-neutral-600">
            {f.madeWith}
          </p>
        </div>

      </div>
    </footer>
  )
}
