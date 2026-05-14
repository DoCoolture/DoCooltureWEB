import { TAuthor } from '@/data/authors'
import Avatar from '@/shared/Avatar'
import { Badge } from '@/shared/Badge'
import { StarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { FC } from 'react'

interface CardAuthorBoxProps {
  className?: string
  author: TAuthor
  index?: number
}

const CardAuthorBox: FC<CardAuthorBoxProps> = ({ className = '', author, index }) => {
  const { displayName, handle = '/', avatarUrl, starRating, location, reviews } = author
  return (
    <Link
      href={`/talento/${handle}`}
      className={`card-author-box group/card relative flex flex-col items-center justify-center nc-box-has-hover px-3 py-5 text-center sm:px-6 sm:py-7 ${className}`}
    >
      {index && (
        <Badge className="absolute top-3 left-3" color={index === 1 ? 'red' : index === 2 ? 'blue' : 'green'}>
          #{index}
        </Badge>
      )}
      <Avatar className="size-20 transition-[filter] group-hover/card:brightness-90" src={avatarUrl} />
      <div className="mt-3">
        <h2 className={`text-base font-medium`}>
          <span className="line-clamp-1">{displayName}</span>
        </h2>
        <span className={`mt-1 block text-sm text-neutral-500 dark:text-neutral-400`}> {location}</span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-1 rounded-full bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
        <StarIcon className="mb-px size-4 text-amber-500" />
        <span className="pt-px text-xs font-medium">{starRating || 4.9}</span>
        <span className="pt-px text-xs font-medium">({reviews || 100})</span>
      </div>
    </Link>
  )
}

export default CardAuthorBox
