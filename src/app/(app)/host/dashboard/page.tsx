'use client'

import EditExperienceModal from '@/components/EditExperienceModal'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import type { Host, Booking, Experience } from '@/lib/supabase'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function HostDashboardPage() {
  const { t } = useLanguage()
  const d = t.hostDashboard
  const router = useRouter()
  const [host, setHost] = useState<Host | null>(null)
  const [displayName, setDisplayName] = useState<string>('')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('user_id', user.id)
      .single()

    setDisplayName(profile?.display_name || '')

    // Obtener perfil de anfitrión
    const { data: hostData } = await supabase
      .from('hosts')
      .select('id, display_name, verification_status, total_listings, total_bookings, total_reviews, average_rating')
      .eq('user_id', user.id)
      .single()

    if (!hostData) {
      if (profile?.role === 'admin') {
        // Admin sin perfil de anfitrión — puede crear uno
        setIsLoading(false)
        return
      }
      router.push('/become-host')
      return
    }

    setHost(hostData as Host)

    // Obtener experiencias
    const { data: experiencesData } = await supabase
      .from('experiences')
      .select('id, host_id, title, description, category, price_usd, duration_time, max_guests, address, city, is_published, is_hidden, featured_image_url, gallery_urls, average_rating, total_reviews')
      .eq('host_id', hostData.id)
      .order('created_at', { ascending: false })

    setExperiences((experiencesData || []) as Experience[])

    // Obtener reservas recientes
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('id, booking_code, customer_name, customer_email, booking_date, guests, status')
      .eq('host_id', hostData.id)
      .order('created_at', { ascending: false })
      .limit(5)

    setBookings((bookingsData || []) as Booking[])
    setIsLoading(false)
  }

  const handleTogglePublish = async (exp: Experience) => {
    await supabase
      .from('experiences')
      .update({ is_published: !exp.is_published })
      .eq('id', exp.id)
    loadDashboard()
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm(d.deleteConfirm)) return
    await supabase.from('experiences').delete().eq('id', id)
    loadDashboard()
  }

  if (!isLoading && !host) {
    return (
      <main className="container max-w-5xl mx-auto py-12 px-4">
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-16 text-center">
          <p className="text-5xl mb-4">🛡️</p>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {d.adminNoHost}
          </h2>
          <p className="text-neutral-500 mb-6">
            {d.adminNoHostDesc}
          </p>
          <ButtonPrimary onClick={() => router.push('/become-host')}>
            {d.createProfile}
          </ButtonPrimary>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-neutral-200 dark:bg-neutral-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const bookingStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    no_show: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
  }

  const bookingStatusLabels: Record<string, string> = {
    pending: d.statusPending,
    confirmed: d.statusConfirmed,
    completed: d.statusCompleted,
    cancelled: d.statusCancelled,
    no_show: d.statusNoShow,
  }

  return (
    <main className="container max-w-5xl mx-auto py-12 px-4 mb-24">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {d.greeting} {displayName || host?.display_name} 👋
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {d.welcome}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          <button
            onClick={() => router.push('/host/profile')}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            {d.editProfile}
          </button>
          <button
            onClick={() => router.push('/host/reviews')}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            {d.viewReviews}
          </button>
          <ButtonPrimary onClick={() => router.push('/host/experiences/new')}>
            {d.newExperience}
          </ButtonPrimary>
        </div>
      </div>

      {/* Verificación pendiente */}
      {host?.verification_status === 'pending' && (
        <div className="mb-8 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-x-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              {d.verificationPending}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
              {d.verificationPendingDesc}
            </p>
          </div>
        </div>
      )}

      {host?.verification_status === 'approved' && (
        <div className="mb-8 rounded-2xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 flex items-center gap-x-3">
          <span className="text-2xl">✅</span>
          <p className="font-semibold text-green-800 dark:text-green-200">
            {d.verificationApproved}
          </p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: d.statExperiences, value: host?.total_listings || 0, icon: '🗺️', color: 'bg-blue-50 dark:bg-blue-950' },
          { label: d.statBookings, value: host?.total_bookings || 0, icon: '📅', color: 'bg-green-50 dark:bg-green-950' },
          { label: d.statReviews, value: host?.total_reviews || 0, icon: '⭐', color: 'bg-yellow-50 dark:bg-yellow-950' },
          {
            label: d.statRating,
            value: host?.average_rating ? `${host.average_rating.toFixed(1)} / 5` : d.noRating,
            icon: '🏆',
            color: 'bg-purple-50 dark:bg-purple-950',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-2xl p-5`}
          >
            <span className="text-3xl">{stat.icon}</span>
            <p className="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stat.value}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Mis experiencias */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {d.myExperiences}
          </h2>
          <ButtonPrimary
            onClick={() => router.push('/host/experiences/new')}
            className="text-sm!"
          >
            {d.addExperience}
          </ButtonPrimary>
        </div>

        {experiences.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-12 text-center">
            <p className="text-4xl mb-4">🗺️</p>
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              {d.noExperiences}
            </p>
            <p className="text-sm text-neutral-500 mt-1 mb-5">
              {d.noExperiencesDesc}
            </p>
            <ButtonPrimary onClick={() => router.push('/host/experiences/new')}>
              {d.createFirst}
            </ButtonPrimary>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4"
              >
                {/* Imagen */}
                {exp.featured_image_url && (
                  <div className="relative w-full sm:w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={exp.featured_image_url}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {exp.title}
                  </p>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {exp.city} · ${exp.price_usd} USD · {exp.duration_time}
                  </p>
                  <div className="flex items-center gap-x-2 mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      exp.is_published && !exp.is_hidden
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : exp.is_hidden
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
                    }`}>
                      {exp.is_hidden
                        ? d.statusHidden
                        : exp.is_published
                        ? d.statusPublished
                        : d.statusDraft}
                    </span>
                    <span className="text-xs text-neutral-400">
                      ⭐ {exp.average_rating.toFixed(1)} ({exp.total_reviews})
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-x-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(exp)}
                    disabled={exp.is_hidden}
                    className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {exp.is_published ? d.unpublish : d.publish}
                  </button>
                  <button
                    onClick={() => setEditingExp(exp)}
                    className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {d.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    {d.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservas recientes */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-5">
          Reservas recientes
        </h2>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-neutral-500">Aún no tienes reservas.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300 hidden sm:table-cell">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300 hidden md:table-cell">
                    Explorers
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                      {booking.booking_code}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {booking.customer_name || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {booking.customer_email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 hidden sm:table-cell">
                      {new Date(booking.booking_date).toLocaleDateString('es-DO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                      {booking.guests}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        bookingStatusColors[booking.status] || ''
                      }`}>
                        {bookingStatusLabels[booking.status] || booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingExp && (
        <EditExperienceModal
          experience={{
            id: editingExp.id,
            title: editingExp.title,
            short_description: editingExp.short_description,
            description: editingExp.description,
            category: editingExp.category,
            tags: editingExp.tags,
            price_usd: editingExp.price_usd ?? 0,
            duration_time: editingExp.duration_time,
            max_guests: editingExp.max_guests,
            min_guests: editingExp.min_guests,
            meeting_point: editingExp.meeting_point,
            address: editingExp.address,
            city: editingExp.city,
            is_published: editingExp.is_published,
            featured_image_url: editingExp.featured_image_url,
            gallery_urls: editingExp.gallery_urls,
            languages: editingExp.languages,
            price_includes: editingExp.price_includes,
            price_excludes: editingExp.price_excludes,
            available_days: editingExp.available_days,
            available_times: editingExp.available_times,
            latitude: editingExp.latitude,
            longitude: editingExp.longitude,
          }}
          onClose={() => setEditingExp(null)}
          onSaved={() => { loadDashboard(); setEditingExp(null) }}
        />
      )}
    </main>
  )
}
