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

const SectionListingReviews = ({ reviews: initialReviews, reviewStart, experienceId }: Props) => {
  const { t } = useLanguage()
  const el = t.experienceListing
  const [isOpen, setIsOpen] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      setIsLoggedIn(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, full_name, avatar_url')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setName(profile.display_name || profile.full_name || '')
        setUserAvatarUrl(profile.avatar_url ?? null)
      }
    }
    loadUser()
  }, [])

  const handleSubmit = async () => {
    if (!comment.trim() || !name.trim()) return
    setSubmitting(true)
    setError(null)

    const newReview = {
      experience_id: experienceId,
      reviewer_name: name.trim(),
      reviewer_avatar_url: userAvatarUrl,
      explorer_id: userId,
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
      setReviews((prev) => [data as ExperienceReview, ...prev])
      setSubmitted(true)
      setComment('')
    }
    setSubmitting(false)
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
                className={clsx(reviewStart > n ? 'text-yellow-400' : 'text-gray-200', 'size-6 shrink-0')}
              />
            ))}
          </div>
        </div>

        <Divider className="w-14!" />

        {/* SUBMIT FORM */}
        {submitted ? (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            {el.thanksReview}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Name: readonly if logged in, editable if anonymous */}
            <Input
              placeholder={el.yourName}
              value={name}
              onChange={(e) => !isLoggedIn && setName(e.target.value)}
              readOnly={isLoggedIn}
              rounded="rounded-full"
              sizeClass="h-12 px-5"
              className={isLoggedIn ? 'opacity-70 cursor-default' : ''}
            />
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
                  disabled={submitting || !comment.trim() || !name.trim()}
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
