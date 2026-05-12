'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { useLanguage } from '@/context/LanguageContext'
import { BellIcon } from '@heroicons/react/24/outline'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import Link from 'next/link'
import { FC } from 'react'

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

interface Props {
  className?: string
}

const NotifyDropdown: FC<Props> = ({ className = '' }) => {
  const { t } = useLanguage()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()

  return (
    <Popover className={className}>
      <>
        <PopoverButton
          className="relative -m-2.5 flex cursor-pointer items-center justify-center rounded-full p-2.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800"
          onClick={markAllAsRead}
        >
          {unreadCount > 0 && (
            <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
          )}
          <BellIcon className="h-6 w-6" />
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{ to: 'bottom end', gap: 16 }}
          className="z-40 w-sm rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid gap-4 bg-white p-7 dark:bg-neutral-800">
            <h3 className="text-xl font-semibold">{t.Header.Notifications.Notifications}</h3>

            {loading && (
              <p className="text-sm text-neutral-400">Cargando...</p>
            )}

            {!loading && notifications.length === 0 && (
              <p className="text-sm text-neutral-400">Sin notificaciones</p>
            )}

            {notifications.map((item) =>
              item.action_url ? (
                <CloseButton
                  as={Link}
                  key={item.id}
                  href={item.action_url}
                  onClick={() => markAsRead(item.id)}
                  className="relative -m-3 flex cursor-pointer rounded-lg p-2 pe-8 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-gray-700"
                >
                  <NotificationContent item={item} />
                </CloseButton>
              ) : (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className="relative -m-3 flex cursor-pointer rounded-lg p-2 pe-8 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-hidden dark:hover:bg-gray-700"
                >
                  <NotificationContent item={item} />
                </div>
              )
            )}
          </div>
        </PopoverPanel>
      </>
    </Popover>
  )
}

function NotificationContent({ item }: { item: { title: string; message: string; created_at: string; is_read: boolean } }) {
  return (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30">
        <BellIcon className="h-5 w-5" />
      </div>
      <div className="ms-3 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{item.title}</p>
        <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">{item.message}</p>
        <p className="text-xs text-gray-400">{relativeTime(item.created_at)}</p>
      </div>
      {!item.is_read && (
        <span className="absolute end-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500" />
      )}
    </>
  )
}

export default NotifyDropdown
