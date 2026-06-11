'use client'

import { TExperienceListing } from '@/data/listings'
import useSnapSlider from '@/hooks/useSnapSlider'
import { ButtonCircle } from '@/shared/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC, useRef } from 'react'
import ExperiencesCard from './ExperiencesCard'

interface Props {
  className?: string
  itemClassName?: string
  listings: TExperienceListing[]
  cardType: 'experience'
}

const SectionSliderCards: FC<Props> = ({
  className,
  itemClassName = 'w-[17rem] lg:w-1/3 xl:w-1/4',
  listings = [],
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const { scrollToNextSlide, scrollToPrevSlide, isAtEnd, isAtStart } = useSnapSlider({ sliderRef })

  const renderCard = (item: TExperienceListing) => (
    <ExperiencesCard data={item} />
  )

  return (
    <div className={clsx('relative', className)}>
      <div
        ref={sliderRef}
        className="hidden-scrollbar relative -mx-2 flex snap-x snap-mandatory overflow-x-auto lg:-mx-3.5"
      >
        {listings.map((item: TExperienceListing) => (
          <div className={`mySnapItem px-2 lg:px-3.5 ${itemClassName}`} key={item.id}>
            {renderCard(item)}
          </div>
        ))}
      </div>

      <div className="absolute -start-3 top-[40%] z-1 -translate-y-1/2 sm:-start-5 xl:-start-5">
        <ButtonCircle color="white" onClick={scrollToPrevSlide} className={'xl:size-11'} disabled={isAtStart}>
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
        </ButtonCircle>
      </div>

      <div className="absolute -end-3 top-[40%] z-1 -translate-y-1/2 sm:-end-5 xl:-end-6">
        <ButtonCircle color="white" onClick={scrollToNextSlide} className={'xl:size-11'} disabled={isAtEnd}>
          <ChevronRightIcon className="size-5 rtl:rotate-180" />
        </ButtonCircle>
      </div>
    </div>
  )
}

export default SectionSliderCards
