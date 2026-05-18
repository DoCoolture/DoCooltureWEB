import { getServerT } from '@/lib/locale-server'
import { Divider } from '@/shared/divider'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT()
  return {
    title: t.legalPages.privacy.metaTitle,
    description: t.legalPages.privacy.metaDescription,
  }
}

export default async function PrivacyPage() {
  const t = await getServerT()
  const privacy = t.legalPages.privacy

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            {privacy.title}
          </h1>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            {t.legalPages.lastUpdated}
          </p>
          <Divider className="mt-8 w-14!" />
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10">
            {privacy.intro}
          </p>

          <div className="space-y-10">
            {privacy.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  {section.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
