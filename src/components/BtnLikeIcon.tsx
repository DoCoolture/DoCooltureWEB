'use client'

import { useWishlist } from '@/hooks/useWishlist'
import clsx from 'clsx'
import { FC, useState } from 'react'

interface BtnLikeIconProps {
  className?: string
  colorClass?: string
  sizeClass?: string
  isLiked?: boolean
  experienceId?: string
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    color="currentColor"
    fill={filled ? '#FF385C' : 'none'}
    stroke={filled ? '#FF385C' : 'currentColor'}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" />
  </svg>
)

const BtnLikeIconWithWishlist: FC<Omit<BtnLikeIconProps, 'isLiked'> & { experienceId: string }> = ({
  className,
  colorClass = 'text-white bg-black/30 hover:bg-black/50',
  sizeClass = 'size-8',
  experienceId,
}) => {
  const { isLiked, toggle } = useWishlist()
  const liked = isLiked(experienceId)

  return (
    <button
      type="button"
      aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={clsx(
        'flex cursor-pointer items-center justify-center rounded-full pt-px transition-colors',
        className,
        colorClass,
        sizeClass,
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(experienceId)
      }}
    >
      <HeartIcon filled={liked} />
    </button>
  )
}

const BtnLikeIconLocal: FC<Omit<BtnLikeIconProps, 'experienceId'>> = ({
  className,
  colorClass = 'text-white bg-black/30 hover:bg-black/50',
  sizeClass = 'size-8',
  isLiked = false,
}) => {
  const [likedState, setLikedState] = useState(isLiked)

  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center justify-center rounded-full pt-px transition-colors',
        className,
        colorClass,
        sizeClass,
      )}
      onClick={() => setLikedState(!likedState)}
    >
      <HeartIcon filled={likedState} />
    </div>
  )
}

const BtnLikeIcon: FC<BtnLikeIconProps> = ({ experienceId, ...props }) => {
  if (experienceId) {
    return <BtnLikeIconWithWishlist experienceId={experienceId} {...props} />
  }
  return <BtnLikeIconLocal {...props} />
}

export default BtnLikeIcon
