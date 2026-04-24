import { getCurrencies, getLanguages } from '@/data/navigation'
import { Button } from '@/shared/Button'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC } from 'react'
import AvatarDropdown from './AvatarDropdown'
import CurrLangDropdown from './CurrLangDropdown'
import DropdownExploradores from './DropdownExploradores'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import NotifyDropdown from './NotifyDropdown'

interface HeaderProps {
  hasBorderBottom?: boolean
  className?: string
}

const Header: FC<HeaderProps> = async ({ hasBorderBottom = true, className }) => {
  const currencies = await getCurrencies()
  const languages = await getLanguages()

  return (
    <div className={clsx('relative', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 justify-between gap-x-2.5 border-neutral-200 dark:border-neutral-700',
            hasBorderBottom && 'border-b',
            !hasBorderBottom && 'has-[.header-popover-full-panel]:border-b'
          )}
        >
          {/* LEFT — Logo + Exploradores */}
          <div className="flex items-center justify-center gap-x-3 sm:gap-x-8">
            <Logo />
            <div className="hidden h-7 border-l border-neutral-200 md:block dark:border-neutral-700" />
            <div className="hidden md:block">
              <DropdownExploradores />
            </div>
          </div>

          {/* RIGHT — Idioma/Moneda + CTA + Notificaciones + Avatar */}
          <div className="flex flex-1 items-center justify-end gap-x-2.5 sm:gap-x-6">
            <div className="block lg:hidden">
              <HamburgerBtnMenu />
            </div>
            <CurrLangDropdown
              currencies={currencies}
              languages={languages}
              className="hidden md:block"
            />
            <Button className="-mx-1 py-1.75! whitespace-nowrap" color="light" href="/add-listing/1">
              Convertirme en anfitrión
            </Button>
            <NotifyDropdown />
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
