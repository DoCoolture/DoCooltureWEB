import BecomeHostCta from '@/components/BecomeHostCta'
import CardAuthorBox2 from '@/components/CardAuthorBox2'
import { TAuthor } from '@/data/authors'
import { Button } from '@/shared/Button'
import { FC } from 'react'

interface Props {
  className?: string
  authors: TAuthor[]
  gridClassName?: string
  showMoreLabel?: string
  becomeHostLabel?: string
  jobNameLabel?: string
}

const SectionGridAuthorBox: FC<Props> = ({
  className = '',
  authors,
  gridClassName = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ',
  showMoreLabel = 'Ver más',
  becomeHostLabel = 'Convertirme en anfitrión',
  jobNameLabel,
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`grid gap-6 md:gap-8 ${gridClassName}`}>
        {authors.map((author) => (
          <CardAuthorBox2 key={author.id} author={author} jobNameLabel={jobNameLabel} />
        ))}
      </div>
      <div className="mt-16 flex flex-col justify-center gap-y-3 sm:flex-row sm:gap-x-5 sm:gap-y-0">
        <Button color="light">{showMoreLabel}</Button>
        <BecomeHostCta label={becomeHostLabel} />
      </div>
    </div>
  )
}

export default SectionGridAuthorBox
