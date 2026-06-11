import { SocialType } from '@/shared/SocialsShare'
import { Facebook01Icon, Mail01Icon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  className?: string
  itemClass?: string
  socials?: SocialType[]
}

const SocialsList: FC<Props> = ({ className = '', itemClass = 'block', socials = [] }) => {
  if (!socials.length) return null

  return (
    <nav className={`flex gap-x-3.5 text-2xl text-neutral-600 dark:text-neutral-300 ${className}`}>
      {socials.map((item) => (
        <Link key={item.name} className={itemClass} href={item.href} target="_blank" rel="noopener noreferrer">
          <HugeiconsIcon icon={item.icon} size={20} color="currentColor" strokeWidth={1.5} />
        </Link>
      ))}
    </nav>
  )
}

export default SocialsList
