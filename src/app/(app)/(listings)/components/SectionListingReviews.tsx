'use client'

import { Dialog, DialogBody, DialogTitle } from '@/components/dialog'
import ListingReview from '@/components/ListingReview'
import { useLanguage } from '@/context/LanguageContext'
import { ExperienceReview } from '@/data/reviews'
import { supabase } from '@/lib/supabase'
import ButtonCircle from '@/shared/ButtonCircle'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { Divider } from '@/shared/divider'
import Input from '@/shared/Input'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { SectionHeading } from './SectionHeading'

interface Props {
  reviewCount: number
  reviewStart: number
  reviews: ExperienceReview[]
  experienceId: string
}

const SectionListingReviews = ({ reviews: initialReviews, reviewStart: initialReviewStart, experienceId }: Props) => {
  const { t } = useLanguage()
  const el = t.experienceListing
  const [isOpen, setIsOpen] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [currentReviewStart, setCurrentReviewStart] = useState(initialReviewStart)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsLoggedIn(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, avatar_url')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setProfileId(profile.id)
        setName(profile.display_name || profile.full_name || '')
        setUserAvatarUrl(profile.avatar_url ?? null)

        const { data: existing } = await supabase
          .from('experience_reviews')
          .select('id, rating, comment')
          .eq('experience_id', experienceId)
          .eq('explorer_id', profile.id)
          .maybeSingle()

        if (existing) {
          setHasReviewed(true)
          setExistingReviewId(existing.id)
          setRating(existing.rating)
          setComment(existing.comment ?? '')
        }
      }
    }
    loadUser()
  }, [experienceId])

  const handleSubmit = async () => {
    if (!profileId) return
    setSubmitting(true)
    setError(null)

    if (isEditing && existingReviewId) {
      const { data, error: supabaseError } = await supabase
        .from('experience_reviews')
        .update({ comment: comment.trim(), rating })
        .eq('id', existingReviewId)
        .select()
        .single()

      if (supabaseError) {
        setError(el.reviewError)
      } else if (data) {
        setReviews((prev) => {
          const updated = prev.map((r) => r.id === existingReviewId ? (data as ExperienceReview) : r)
          const avg = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length
          setCurrentReviewStart(Math.round(avg * 10) / 10)
          return updated
        })
        setIsEditing(false)
        setSubmitted(true)
      }
    } else {
      const newReview = {
        experience_id: experienceId,
        reviewer_name: name.trim(),
        reviewer_avatar_url: userAvatarUrl,
        explorer_id: profileId,
        comment: comment.trim(),
        rating,
        is_visible: true,
      }

      const { data, error: supabaseError } = await supabase
        .from('experience_reviews')
        .insert(newReview)
        .select()
        .single()

      if (supabaseError) {
        setError(el.reviewError)
      } else if (data) {
        setReviews((prev) => {
          const updated = [data as ExperienceReview, ...prev]
          const avg = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length
          setCurrentReviewStart(Math.round(avg * 10) / 10)
          return updated
        })
        setExistingReviewId((data as ExperienceReview).id)
        setHasReviewed(true)
        setSubmitted(true)
      }
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!existingReviewId || !confirm('¿Seguro que quieres eliminar tu reseña?')) return
    await supabase.from('experience_reviews').delete().eq('id', existingReviewId)
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== existingReviewId)
      const avg = updated.length > 0 ? updated.reduce((sum, r) => sum + r.rating, 0) / updated.length : 0
      setCurrentReviewStart(Math.round(avg * 10) / 10)
      return updated
    })
    setHasReviewed(false)
    setExistingReviewId(null)
    setSubmitted(false)
    setComment('')
    setRating(5)
  }

  const displayRating = hovered || rating

  return (
    <>
      <div className="flex flex-col gap-y-6 pt-8 sm:gap-y-8">
        {/* HEADING */}
        <div>
          <SectionHeading>{el.reviewsHeading} ({el.reviewsCount.replace('{n}', String(reviews.length))})</SectionHeading>
          <div className="mt-4 flex items-center gap-x-1">
            {[0, 1, 2, 3, 4].map((n) => (
              <StarIcon
                key={n}
                aria-hidden="true"
                className={clsx(currentReviewStart > n ? 'text-yellow-400' : 'text-gray-200', 'size-6 shrink-0')}
              />
            ))}
          </div>
        </div>

        <Divider className="w-14!" />

        {/* SUBMIT FORM */}
        {!isLoggedIn ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {el.loginToReview}
          </p>
        ) : submitted && !isEditing ? (
          <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 dark:bg-green-950">
            <p className="text-sm text-green-700 dark:text-green-300">{el.thanksReview}</p>
            <button
              onClick={() => { setSubmitted(false); setIsEditing(true) }}
              className="ml-4 shrink-0 text-xs font-medium text-green-700 underline dark:text-green-300"
            >
              {el.editReview}
            </button>
          </div>
        ) : hasReviewed && !isEditing ? (
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {el.alreadyReviewed}
            </p>
            <div className="ml-4 flex shrink-0 gap-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-neutral-600 underline dark:text-neutral-400"
              >
                {el.editBtn}
              </button>
              <button
                onClick={handleDelete}
                className="text-xs font-medium text-red-500 underline"
              >
                {el.deleteBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {name && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isEditing ? el.editingReview : el.reviewingAs}{' '}
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">{name}</span>
                </p>
              )}
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-600"
                >
                  {el.cancelEdit}
                </button>
              )}
            </div>
            {/* Star picker */}
            <div className="flex items-center gap-x-1 px-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={clsx(
                      'size-6 transition-colors',
                      displayRating >= star ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-neutral-500">{rating} / 5</span>
            </div>
            <div className="relative">
              <Input
                sizeClass="h-16 px-6 py-3"
                fontClass="text-base/6"
                rounded="rounded-full"
                placeholder={el.shareExperience}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="absolute end-2 top-1/2 -translate-y-1/2">
                <ButtonCircle
                  className="size-12!"
                  onClick={handleSubmit}
                  disabled={submitting || !profileId}
                >
                  <ArrowRightIcon className="h-5 w-5 rtl:rotate-180" />
                </ButtonCircle>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        )}

        {/* REVIEWS LIST */}
        {reviews.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {reviews.slice(0, 3).map((item) => (
              <ListingReview key={item.id} className="py-7" review={item} />
            ))}
            {reviews.length > 3 && (
              <div className="flex w-full justify-center pt-8">
                <ButtonSecondary onClick={() => setIsOpen(true)}>
                  {el.seeMoreReviews.replace('{n}', String(reviews.length - 3))}
                </ButtonSecondary>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {el.noReviews}
          </p>
        )}
      </div>

      <Dialog size="2xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>{el.reviewsCount.replace('{n}', String(reviews.length))}</DialogTitle>
        <DialogBody>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {reviews.map((item) => (
              <ListingReview key={item.id} className="py-7" review={item} />
            ))}
          </div>
        </DialogBody>
      </Dialog>
    </>
  )
}

export default SectionListingReviews
