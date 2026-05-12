import { ExperienceReview } from '@/data/reviews'
import Avatar from '@/shared/Avatar'
import { StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  className?: string
  review: ExperienceReview
}

const ListingReview: FC<Props> = ({ className = '', review }) => {
  const { reviewer_name, reviewer_avatar_url, comment, created_at, rating } = review
  const date = new Date(created_at).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className={`flex gap-x-4 ${className}`}>
      <div className="pt-0.5">
        <Avatar className="size-10" src={reviewer_avatar_url ?? undefined} />
      </div>
      <div className="flex grow flex-col gap-2.5">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((number) => (
            <StarIcon
              key={number}
              aria-hidden="true"
              className={clsx(rating > number ? 'text-yellow-400' : 'text-gray-200', 'size-4 shrink-0')}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <div className="font-medium">{reviewer_name}</div>
          <span className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{date}</span>
        </div>
        {comment && (
          <p className="mt-2 block max-w-xl text-sm/relaxed text-neutral-700 sm:text-base/relaxed dark:text-neutral-300">
            {comment}
          </p>
        )}
      </div>
    </div>
  )
}

export default ListingReview
