'use client'

import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import type React from 'react'
import { Button } from './Button'

export function Pagination({
  'aria-label': ariaLabel = 'Page navigation',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label={ariaLabel} {...props} className={clsx(className, 'flex gap-x-2')} />
}

export function PaginationPrevious({
  href = null,
  className,
  children = 'Previous',
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  return (
    <span className={clsx(className, 'grow basis-0')}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        className="rounded-lg"
        plain
        aria-label="Previous page"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} color="currentColor" strokeWidth={1.5} />

        {children}
      </Button>
    </span>
  )
}

export function PaginationNext({
  href = null,
  className,
  children = 'Next',
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  return (
    <span className={clsx(className, 'flex grow basis-0 justify-end')}>
      <Button {...(href === null ? { disabled: true } : { href })} className="rounded-lg" plain aria-label="Next page">
        {children}
        <HugeiconsIcon icon={ArrowRight02Icon} size={16} color="currentColor" strokeWidth={1.5} />
      </Button>
    </span>
  )
}

export function PaginationList({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'hidden items-baseline gap-x-2 sm:flex')} />
}

export function PaginationPage({
  href,
  className,
  current = false,
  children,
}: React.PropsWithChildren<{ href: string; className?: string; current?: boolean }>) {
  return (
    <Button
      href={href}
      plain
      aria-label={`Page ${children}`}
      aria-current={current ? 'page' : undefined}
      className={clsx(
        className,
        'min-w-[2.25rem] rounded-lg before:absolute before:-inset-px before:rounded-lg',
        current && 'before:bg-neutral-950/5 dark:before:bg-white/10'
      )}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  )
}

export function PaginationGap({
  className,
  children = <>&hellip;</>,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={clsx(
        className,
        'w-[2.25rem] text-center text-sm/6 font-semibold text-neutral-950 select-none dark:text-white'
      )}
    >
      {children}
    </span>
  )
}

export default function PaginationComponent({
  currentPage = 1,
  totalPages = 1,
  className,
}: {
  currentPage?: number
  totalPages?: number
  className?: string
}) {
  const { t } = useLanguage()
  if (totalPages <= 1) return null

  const getPageHref = (page: number) => `?page=${page}`

  const pages: (number | 'gap')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('gap')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('gap')
    pages.push(totalPages)
  }

  return (
    <Pagination aria-label={t.pagination.pageNavigation} className={className}>
      <PaginationPrevious href={currentPage > 1 ? getPageHref(currentPage - 1) : null}>
        {t.pagination.previous}
      </PaginationPrevious>
      <PaginationList>
        {pages.map((page, i) =>
          page === 'gap' ? (
            <PaginationGap key={`gap-${i}`} />
          ) : (
            <PaginationPage key={page} href={getPageHref(page)} current={page === currentPage}>
              {page}
            </PaginationPage>
          )
        )}
      </PaginationList>
      <PaginationNext href={currentPage < totalPages ? getPageHref(currentPage + 1) : null}>
        {t.pagination.next}
      </PaginationNext>
    </Pagination>
  )
}
