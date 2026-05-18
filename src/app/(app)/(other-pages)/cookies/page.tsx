import { getServerT } from '@/lib/locale-server'
import { Divider } from '@/shared/divider'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT()
  return {
    title: t.legalPages.cookies.metaTitle,
    description: t.legalPages.cookies.metaDescription,
  }
}

export default async function CookiesPage() {
  const t = await getServerT()
  const c = t.legalPages.cookies

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            {t.legalPages.lastUpdated}
          </p>
          <Divider className="mt-8 w-14!" />
        </div>

        <div className="space-y-12">

          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            {c.intro}
          </p>

          {/* Tipos de cookies */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              {c.typesHeading}
            </h2>
            <div className="space-y-4">
              {c.types.map((cookie) => (
                <div
                  key={cookie.name}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6"
                >
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {cookie.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    {cookie.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-2">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{c.examplesLabel} </span>
                      <span className="text-neutral-500 dark:text-neutral-400">{cookie.examples}</span>
                    </div>
                    <div className={`rounded-xl px-4 py-2 ${!cookie.disableAllowed ? 'bg-red-50 dark:bg-red-950' : 'bg-green-50 dark:bg-green-950'}`}>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{c.canDisableLabel} </span>
                      <span className={!cookie.disableAllowed ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {cookie.canDisable}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secciones de texto */}
          {c.sections.map((section, i) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {section.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {section.content}
              </p>

              {i === 1 && (
                <div className="mt-5 space-y-3">
                  {c.browsers.map((b) => (
                    <div key={b.name} className="flex items-start gap-x-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-sm">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 shrink-0">{b.name}:</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{b.instruction}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
