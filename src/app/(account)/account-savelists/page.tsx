'use client'

import ExperiencesCard from '@/components/ExperiencesCard'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/shared/Button'
import { Divider } from '@/shared/divider'
import { useEffect, useState } from 'react'

type SavedExperience = {
  id: string
  title: string
  handle: string
  listingCategory: string
  date: string
  description: string
  durationTime: string
  languages: string[]
  featuredImage: string
  galleryImgs: string[]
  like: boolean
  address: string
  reviewStart: number
  reviewCount: number
  price: string
  maxGuests: number
  saleOff: string | null
  isAds: string | null
  map: { lat: number; lng: number }
  host: { displayName: string; avatarUrl: string; handle: string }
}

export default function SavedListingsPage() {
  const { t } = useLanguage()
  const [experiences, setExperiences] = useState<SavedExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    const fetchSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profileData) { setLoading(false); return }

      const { data: wishlists } = await supabase
        .from('wishlists')
        .select('experience_id')
        .eq('profile_id', profileData.id)

      if (!wishlists || wishlists.length === 0) { setLoading(false); return }

      const ids = wishlists.map((w) => w.experience_id)

      const { data: exps } = await supabase
        .from('experiences')
        .select('*')
        .in('id', ids)
        .eq('is_published', true)

      if (exps) {
        setExperiences(
          exps.map((exp) => ({
            id: exp.id,
            title: exp.title,
            handle: exp.handle,
            listingCategory: exp.category,
            date: (exp.available_days as string[] | null)?.join(', ') ?? '',
            description: exp.description,
            durationTime: exp.duration_time,
            languages: (exp.languages as string[] | null) ?? [],
            featuredImage: exp.featured_image_url ?? '',
            galleryImgs: (exp.gallery_urls as string[] | null) ?? [],
            like: true,
            address: exp.address,
            reviewStart: exp.average_rating ?? 0,
            reviewCount: exp.total_reviews ?? 0,
            price: `$${exp.price_usd}`,
            maxGuests: exp.max_guests,
            saleOff: null,
            isAds: null,
            map: { lat: exp.latitude ?? 0, lng: exp.longitude ?? 0 },
            host: { displayName: 'Anfitrión DoCoolture', avatarUrl: '', handle: exp.host_id },
          }))
        )
      }
      setLoading(false)
    }

    fetchSaved()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold">{t.accountPage['Saved listings']}</h1>
      <Divider className="my-8 w-14!" />

      {loading && (
        <p className="text-neutral-500">Cargando...</p>
      )}

      {!loading && experiences.length === 0 && (
        <p className="text-neutral-500">{t.accountPage['Save lists']}</p>
      )}

      {experiences.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {experiences.slice(0, visibleCount).map((exp) => (
              <ExperiencesCard key={exp.id} data={exp} />
            ))}
          </div>
          {visibleCount < experiences.length && (
            <div className="mt-16 flex items-center justify-center">
              <Button onClick={() => setVisibleCount((v) => v + 8)}>
                {t.common['Show me more']}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
