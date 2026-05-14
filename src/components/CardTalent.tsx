import { TTalent } from '@/data/hosts'
import Avatar from '@/shared/Avatar'
import { CheckBadgeIcon, StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  talent: TTalent
  specialtyLabel?: string
  superhostLabel?: string
}

const CardTalent: FC<Props> = ({ talent, specialtyLabel, superhostLabel }) => {
  const { displayName, handle, avatarUrl, bgImage, city, averageRating, totalReviews, isSuperhost, isVerified } = talent

  return (
    <Link
      href={`/authors/${handle}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-neutral-900"
    >
      <div className="relative aspect-[4/3]">
        <Image
          fill
          alt={displayName}
          src={bgImage}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {(isSuperhost || isVerified) && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-700 backdrop-blur-sm dark:bg-neutral-800/90 dark:text-neutral-200">
              <CheckBadgeIcon className="size-3.5 text-primary-600" />
              {isSuperhost ? (superhostLabel ?? 'Superhost') : 'Verified'}
            </span>
          </div>
        )}
      </div>

      <div className="relative flex -translate-y-6 flex-col items-center px-4 pb-4 pt-[1px] text-center">
        <svg
          className="h-10 w-full text-white dark:text-neutral-900"
          viewBox="0 0 135 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M101.911 19.8581C99.4421 17.4194 97.15 14.8065 94.6816 12.1935C94.3289 11.671 93.8 11.3226 93.271 10.8C92.9184 10.4516 92.7421 10.2774 92.3895 9.92903C85.8658 3.83226 76.8737 0 67.1763 0C57.4789 0 48.4868 3.83226 41.7868 9.92903C41.4342 10.2774 41.2579 10.4516 40.9053 10.8C40.3763 11.3226 40.0237 11.671 39.4947 12.1935C37.0263 14.8065 34.7342 17.4194 32.2658 19.8581C23.45 28.7419 11.6368 30.4839 0 30.8323V54H16.5737H32.2658H101.734H110.374H134.176V30.6581C122.539 30.3097 110.726 28.7419 101.911 19.8581Z"
            fill="currentColor"
          />
        </svg>
        <span className="absolute top-1">
          <Avatar className="size-12" src={avatarUrl} />
        </span>

        <div className="mt-5 space-y-0.5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            <span className="line-clamp-1">{displayName}</span>
          </h3>
          {specialtyLabel && (
            <p className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">{specialtyLabel}</p>
          )}
          {city && <p className="text-xs text-neutral-400 dark:text-neutral-500">{city}</p>}
        </div>

        {totalReviews > 0 && (
          <div className="mt-3 flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 dark:bg-neutral-800">
            <StarIcon className="size-3 text-amber-500" />
            <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-neutral-400">({totalReviews})</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default CardTalent
