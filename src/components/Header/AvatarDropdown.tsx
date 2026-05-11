'use client'

import { supabase } from '@/lib/supabase'
import Avatar from '@/shared/Avatar'
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowRightStartOnRectangleIcon,
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
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

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
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Obtener iniciales para el avatar
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
        label: 'Mi cuenta',
        href: '/account',
        icon: UserCircleIcon,
      },
      {
        label: 'Mis guardados',
        href: '/account-savelists',
        icon: HeartIcon,
      },
    ]

    if (profile?.role === 'host') {
      base.push({
        label: 'Panel de anfitrión',
        href: '/host/dashboard',
        icon: HomeIcon,
      })
    }

    if (profile?.role === 'admin') {
      base.push({
        label: 'Panel Admin',
        href: '/admin',
        icon: ShieldCheckIcon,
      })
    }

    return base
  }

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center focus:outline-none">
        <Avatar
          src={profile?.avatar_url || user?.user_metadata?.avatar_url || null}
          initials={getInitials()}
          alt={profile?.display_name || 'Usuario'}
          className="size-9"
        />
      </PopoverButton>

      <PopoverPanel
        anchor={{ to: 'bottom end', gap: 16 }}
        transition
        className="z-40 w-72 rounded-3xl bg-white shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0 dark:bg-neutral-800 dark:ring-white/10"
      >
        {/* Header del dropdown */}
        <div className="flex items-center gap-x-3 border-b border-neutral-200 dark:border-neutral-700 px-5 py-4">
          <Avatar
            src={profile?.avatar_url || user?.user_metadata?.avatar_url || null}
            initials={getInitials()}
            alt={profile?.display_name || 'Usuario'}
            className="size-12"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
              {profile?.display_name || profile?.full_name || 'Usuario'}
            </p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {user?.email}
            </p>
            {profile?.role === 'host' && (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300 mt-0.5">
                🏠 Anfitrión
              </span>
            )}
            {profile?.role === 'admin' && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300 mt-0.5">
                🛡️ Admin
              </span>
            )}
          </div>
        </div>

        {/* Menu items */}
        <div className="px-2 py-2">
          {getMenuItems().map((item) => (
            <CloseButton
              key={item.href}
              as={Link}
              href={item.href}
              className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <item.icon className="size-5 text-neutral-400" />
              {item.label}
            </CloseButton>
          ))}

          {/* Si es explorer, mostrar opción para ser anfitrión */}
          {profile?.role === 'explorer' && (
            <CloseButton
              as={Link}
              href="/become-host"
              className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
            >
              <HomeIcon className="size-5" />
              Convertirme en anfitrión
            </CloseButton>
          )}
        </div>

        {/* Logout */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 px-2 py-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <ArrowRightStartOnRectangleIcon className="size-5" />
            Cerrar sesión
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
