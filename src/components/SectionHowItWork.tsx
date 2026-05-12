'use client'

import { useLanguage } from '@/context/LanguageContext'
import HIW1img from '@/images/HIW1.png'
import HIW2img from '@/images/HIW2.png'
import HIW3img from '@/images/HIW3.png'
import VectorImg from '@/images/VectorHIW.svg'
import Heading from '@/shared/Heading'
import Image, { StaticImageData } from 'next/image'
import { FC } from 'react'

export interface SectionHowItWorkProps {
  className?: string
}

const STEP_IMAGES: StaticImageData[] = [HIW1img, HIW2img, HIW3img]

const SectionHowItWork: FC<SectionHowItWorkProps> = ({ className = '' }) => {
  const { t } = useLanguage()
  const { heading, subheading, steps } = t.sections.howItWorks

  return (
    <div className={`nc-SectionHowItWork ${className}`} data-nc-id="SectionHowItWork">
      <Heading isCenter subheading={subheading}>
        {heading}
      </Heading>
      <div className="relative mt-20 grid gap-20 md:grid-cols-3">
        <Image className="absolute inset-x-0 top-10 hidden md:block" src={VectorImg} alt="vector" />
        {steps.map((step, index) => (
          <div key={index} className="relative mx-auto flex max-w-xs flex-col items-center">
            <Image alt="" className="mx-auto mb-8 max-w-[180px]" src={STEP_IMAGES[index]} />
            <div className="mt-auto text-center">
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <span className="mt-5 block text-neutral-500 dark:text-neutral-400">{step.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionHowItWork
