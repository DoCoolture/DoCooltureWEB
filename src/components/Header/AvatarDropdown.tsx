'use client'

import { getNavigation, TNavigationItem } from '@/data/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import Avatar from '@/shared/Avatar'
import { CloseButton, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  HeartIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AvatarDropdown() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [navItems, setNavItems] = useState<TNavigationItem[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setProfile(profileData)
      }
    }
    const loadNav = async () => {
      const items = await getNavigation()
      setNavItems(items)
    }
    getUser()
    loadNav()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || user?.email || 'U'
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getMenuItems = () => {
    const base = [
      {
        label: t.Header.AvatarDropDown['My Account'],
        href: '/account',
        icon: UserCircleIcon,
      },
      {
        label: t.Header.AvatarDropDown.Wishlist,
        href: '/account-savelists',
        icon: HeartIcon,
      },
    ]

    if (profile?.role === 'host') {
      base.push({
        label: t.Header.AvatarDropDown['Host dashboard'],
        href: '/host/dashboard',
        icon: HomeIcon,
      })
    }

    if (profile?.role === 'admin') {
      base.push({
        label: t.Header.AvatarDropDown['Admin panel'],
        href: '/admin',
        icon: ShieldCheckIcon,
      })
    }

    return base
  }

  const renderNavItem = (item: TNavigationItem, index: number) => {
    if (item.children?.length) {
      return (
        <Disclosure key={index}>
          <DisclosureButton className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">
            {item.name}
            <ChevronDownIcon className="size-4 text-neutral-400 transition-transform data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="pl-3">
            {item.children.map((child, i) => (
              <CloseButton
                key={i}
                as={Link}
                href={child.href || '#'}
                className="block rounded-xl px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                {child.name}
              </CloseButton>
            ))}
          </DisclosurePanel>
        </Disclosure>
      )
    }
    return (
      <CloseButton
        key={index}
        as={Link}
        href={item.href || '#'}
        className="block rounded-xl px-3 py-2.5 text-sm font-medium uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        {item.name}
      </CloseButton>
    )
  }

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center focus:outline-none">
        <Avatar
          src={profile?.avatar_url || user?.user_metadata?.avatar_url || null}
          initials={getInitials()}
          alt={profile?.display_name || t.accountPage.Username}
          className="size-9"
        />
      </PopoverButton>

      <PopoverPanel
        anchor={{ to: 'bottom end', gap: 16 }}
        transition
        className="z-40 w-72 rounded-3xl bg-white shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0 dark:bg-neutral-800 dark:ring-white/10"
      >
        <div className="flex items-center gap-x-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-700">
          <Avatar
            src={profile?.avatar_url || user?.user_metadata?.avatar_url || null}
            initials={getInitials()}
            alt={profile?.display_name || t.accountPage.Username}
            className="size-12"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
              {profile?.display_name || profile?.full_name || t.accountPage.Username}
            </p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {user?.email}
            </p>
            {profile?.role === 'host' && (
              <span className="mt-0.5 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                🏠 {t.Header.AvatarDropDown['Host dashboard']}
              </span>
            )}
            {profile?.role === 'admin' && (
              <span className="mt-0.5 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                🛡️ {t.Header.AvatarDropDown['Admin panel']}
              </span>
            )}
          </div>
        </div>

        {navItems.length > 0 && (
          <div className="border-b border-neutral-200 px-2 py-2 dark:border-neutral-700">
            {navItems.map(renderNavItem)}
          </div>
        )}

        <div className="px-2 py-2">
          {getMenuItems().map((item) => (
            <CloseButton
              key={item.href}
              as={Link}
              href={item.href}
              className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              <item.icon className="size-5 text-neutral-400" />
              {item.label}
            </CloseButton>
          ))}

          {profile?.role === 'explorer' && (
            <CloseButton
              as={Link}
              href="/become-host"
              className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900"
            >
              <HomeIcon className="size-5" />
              {t.Header.AvatarDropDown['Become a host']}
            </CloseButton>
          )}
        </div>

        <div className="border-t border-neutral-200 px-2 py-2 dark:border-neutral-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            <ArrowRightStartOnRectangleIcon className="size-5" />
            {t.Header.AvatarDropDown.Logout}
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
