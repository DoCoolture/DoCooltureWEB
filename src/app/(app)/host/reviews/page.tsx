'use client'

import { supabase } from '@/lib/supabase'
import type { ExperienceReview } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import Avatar from '@/shared/Avatar'
import { StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ReviewWithExp extends ExperienceReview {
  experience_title: string
}

export default function HostReviewsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const hr = t.hostReviews
  const [reviews, setReviews] = useState<ReviewWithExp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [hostId, setHostId] = useState<string | null>(null)
  const [replyError, setReplyError] = useState<string | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: hostData } = await supabase
      .from('hosts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!hostData) { router.push('/become-host'); return }
    setHostId(hostData.id)

    const { data: experiences } = await supabase
      .from('experiences')
      .select('id, title')
      .eq('host_id', hostData.id)

    if (!experiences || experiences.length === 0) {
      setIsLoading(false)
      return
    }

    const expIds = experiences.map((e) => e.id)
    const expTitleMap = Object.fromEntries(experiences.map((e) => [e.id, e.title]))

    const { data: reviewsData } = await supabase
      .from('experience_reviews')
      .select('*')
      .in('experience_id', expIds)
      .order('created_at', { ascending: false })

    const enriched: ReviewWithExp[] = (reviewsData ?? []).map((r) => ({
      ...r,
      experience_title: expTitleMap[r.experience_id] ?? hr.defaultExp,
    }))

    setReviews(enriched)
    setIsLoading(false)
  }

  const MAX_REPLY_LENGTH = 2000

  const handleReply = async (reviewId: string) => {
    const reply = replyTexts[reviewId]?.trim()
    if (!reply || submitting === reviewId) return

    if (reply.length > MAX_REPLY_LENGTH) {
      setReplyError(`La respuesta no puede superar ${MAX_REPLY_LENGTH} caracteres.`)
      return
    }

    setReplyError(null)
    setSubmitting(reviewId)

    const { error } = await supabase
      .from('experience_reviews')
      .update({ host_reply: reply, host_replied_at: new Date().toISOString() })
      .eq('id', reviewId)

    if (error) {
      console.error('[handleReply] update failed:', error)
      setReplyError('No se pudo guardar la respuesta. Intenta de nuevo.')
      setSubmitting(null)
      return
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, host_reply: reply, host_replied_at: new Date().toISOString() }
          : r
      )
    )
    setReplyTexts((prev) => ({ ...prev, [reviewId]: '' }))
    setSubmitting(null)
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4 mb-24">
      <div className="flex items-center gap-x-4 mb-8">
        <button
          onClick={() => router.push('/host/dashboard')}
          className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          {hr.back}
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {hr.heading}
        </h1>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-16 text-center">
          <p className="text-5xl mb-4">⭐</p>
          <p className="font-semibold text-neutral-700 dark:text-neutral-300">
            {hr.noReviews}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            {hr.noReviewsDesc}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5"
            >
              {/* Experience name */}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                {review.experience_title}
              </p>

              {/* Reviewer */}
              <div className="flex gap-x-3">
                <Avatar className="size-9 shrink-0" src={review.reviewer_avatar_url ?? undefined} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-x-2 flex-wrap">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {review.reviewer_name}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(review.created_at).toLocaleDateString('es-DO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-x-0.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <StarIcon
                        key={n}
                        className={clsx(
                          review.rating > n ? 'text-yellow-400' : 'text-gray-200',
                          'size-3.5 shrink-0'
                        )}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>

              {/* Existing reply */}
              {review.host_reply ? (
                <div className="mt-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-3">
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {hr.yourReply}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {review.host_reply}
                  </p>
                  {review.host_replied_at && (
                    <p className="mt-1 text-xs text-neutral-400">
                      {new Date(review.host_replied_at).toLocaleDateString('es-DO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      setReplyTexts((prev) => ({ ...prev, [review.id]: review.host_reply ?? '' }))
                    }
                    className="mt-2 text-xs text-neutral-400 underline hover:text-neutral-600"
                  >
                    {hr.editReply}
                  </button>
                </div>
              ) : null}

              {/* Reply form */}
              {(!review.host_reply || replyTexts[review.id] !== undefined) && (
                <div className="mt-4 flex flex-col gap-y-1.5">
                {replyError && (
                  <p className="text-xs text-red-500">{replyError}</p>
                )}
                <div className="flex gap-x-2">
                  <textarea
                    rows={2}
                    placeholder={hr.replyPlaceholder}
                    value={replyTexts[review.id] ?? ''}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({ ...prev, [review.id]: e.target.value }))
                    }
                    className="flex-1 resize-none rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => handleReply(review.id)}
                    disabled={submitting === review.id || !replyTexts[review.id]?.trim()}
                    className="shrink-0 self-end rounded-xl bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    {submitting === review.id ? hr.sending : review.host_reply ? hr.update : hr.reply}
                  </button>
                </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
