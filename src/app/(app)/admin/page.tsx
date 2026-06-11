'use client'

import EditExperienceModal from '@/components/EditExperienceModal'
import { supabase } from '@/lib/supabase'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  adminHideExperience,
  adminDeleteExperience,
  adminSuspendHost,
  adminVerifyHost,
  adminUpdateVerification,
  adminFetchStats,
  adminFetchExperiences,
  adminFetchHosts,
  adminFetchBookings,
  adminFetchVerifications,
  type AdminExperience,
  type AdminHost,
  type AdminBooking,
  type AdminVerification,
} from '@/app/actions/admin'

type Tab = 'experiences' | 'hosts' | 'bookings' | 'verifications'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('experiences')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const [experiences, setExperiences] = useState<AdminExperience[]>([])
  const [hosts, setHosts] = useState<AdminHost[]>([])
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [verifications, setVerifications] = useState<AdminVerification[]>([])

  const [stats, setStats] = useState({
    totalExperiences: 0,
    totalHosts: 0,
    totalBookings: 0,
    pendingVerifications: 0,
    hiddenExperiences: 0,
    totalRevenue: 0,
  })

  const [editingExp, setEditingExp] = useState<AdminExperience | null>(null)
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null)
  // Model inline forms as { id, reason } so each row carries its own reason text
  const [hidingExp, setHidingExp] = useState<{ id: string; reason: string } | null>(null)
  const [rejectingVerification, setRejectingVerification] = useState<{ id: string; reason: string } | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  useEffect(() => {
    checkAdmin()
  }, [])

  const loadRequestRef = useRef(0)

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin, activeTab])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/experience')
      return
    }

    // Set isAdmin before isLoading=false to avoid the frame where (!isAdmin && !isLoading) renders null
    setIsAdmin(true)
    setIsLoading(false)
    loadStats().catch(console.error)
  }

  const loadStats = async () => {
    const result = await adminFetchStats()
    if (result.data) setStats(result.data)
  }

  const loadData = async () => {
    const requestId = ++loadRequestRef.current
    setIsLoading(true)

    if (activeTab === 'experiences') {
      const { data } = await adminFetchExperiences()
      if (requestId !== loadRequestRef.current) return
      setExperiences(data || [])
    }

    if (activeTab === 'hosts') {
      const { data } = await adminFetchHosts()
      if (requestId !== loadRequestRef.current) return
      setHosts(data || [])
    }

    if (activeTab === 'bookings') {
      const { data } = await adminFetchBookings()
      if (requestId !== loadRequestRef.current) return
      setBookings(data || [])
    }

    if (activeTab === 'verifications') {
      const { data } = await adminFetchVerifications()
      if (requestId !== loadRequestRef.current) return
      setVerifications(data || [])
    }

    if (requestId !== loadRequestRef.current) return
    setIsLoading(false)
  }

  const handleHideExperience = async (exp: AdminExperience, reason: string) => {
    setMutationError(null)
    const result = await adminHideExperience(exp.id, exp.title, exp.host_id, exp.is_hidden, reason)
    if (result.error) { setMutationError(`Error al ${exp.is_hidden ? 'mostrar' : 'pausar'} la experiencia: ${result.error}`); return }
    loadData()
    loadStats()
  }

  const handleUpdateVerification = async (
    id: string,
    hostId: string,
    status: 'approved' | 'rejected',
    reason?: string
  ) => {
    setMutationError(null)
    const result = await adminUpdateVerification(id, hostId, status, reason)
    if (result.error) { setMutationError(`Error al procesar verificación: ${result.error}`); return }
    loadData()
    loadStats()
  }

  const handleDeleteExperience = async (exp: AdminExperience) => {
    setMutationError(null)
    const result = await adminDeleteExperience(exp.id)
    if (result.error) { setMutationError(result.error); return }
    setDeletingExpId(null)
    loadData()
    loadStats()
  }

  const handleSuspendHost = async (host: AdminHost) => {
    setMutationError(null)
    const result = await adminSuspendHost(host.id, host.status ?? 'active')
    if (result.error) { setMutationError(result.error); return }
    loadData()
    loadStats()
  }

  const handleVerifyHost = async (host: AdminHost) => {
    setMutationError(null)
    const result = await adminVerifyHost(host.id)
    if (result.error) { setMutationError(result.error); return }
    loadData()
    loadStats()
  }

  if (!isAdmin && !isLoading) return null

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'experiences', label: '🗺️ Experiencias', count: stats.totalExperiences },
    { key: 'hosts', label: '🏠 Anfitriones', count: stats.totalHosts },
    { key: 'bookings', label: '📅 Reservas', count: stats.totalBookings },
    {
      key: 'verifications',
      label: '🔍 Verificaciones',
      count: stats.pendingVerifications,
    },
  ]

  const bookingStatusColors: Record<string, string> = {
    pending_payment: 'bg-orange-100 text-orange-800',
    payment_failed:  'bg-red-100 text-red-800',
    pending:         'bg-yellow-100 text-yellow-800',
    confirmed:       'bg-green-100 text-green-800',
    completed:       'bg-blue-100 text-blue-800',
    cancelled:       'bg-red-100 text-red-800',
    no_show:         'bg-neutral-100 text-neutral-800',
  }

  const bookingStatusLabels: Record<string, string> = {
    pending_payment: 'Pago pendiente',
    payment_failed:  'Pago fallido',
    pending:         'Pendiente',
    confirmed:       'Confirmada',
    completed:       'Completada',
    cancelled:       'Cancelada',
    no_show:         'No se presentó',
  }

  return (
    <main className="container max-w-6xl mx-auto py-10 px-4 mb-24">

      {mutationError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          ⚠️ {mutationError}
          <button onClick={() => setMutationError(null)} className="ml-3 text-red-600 hover:underline dark:text-red-400">Cerrar</button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-y-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Panel Admin — DoCoolture
          </h1>
          <p className="text-neutral-500 mt-1">
            Gestiona experiencias, anfitriones y reservas.
          </p>
        </div>

        <ButtonPrimary onClick={() => router.push('/host/experiences/new')}>
          + Nueva experiencia
        </ButtonPrimary>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Experiencias', value: stats.totalExperiences, icon: '🗺️' },
          { label: 'Anfitriones', value: stats.totalHosts, icon: '🏠' },
          { label: 'Reservas', value: stats.totalBookings, icon: '📅' },
          { label: 'Verificaciones pendientes', value: stats.pendingVerifications, icon: '⏳', alert: stats.pendingVerifications > 0 },
          { label: 'Experiencias ocultas', value: stats.hiddenExperiences, icon: '🚫', alert: stats.hiddenExperiences > 0 },
          { label: 'Ingresos totales', value: `$${stats.totalRevenue.toFixed(0)}`, icon: '💵' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-4 ${
              stat.alert
                ? 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800'
                : 'bg-neutral-50 dark:bg-neutral-800'
            }`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {stat.value}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-x-2 mb-6 border-b border-neutral-200 dark:border-neutral-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* EXPERIENCIAS */}
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 ${
                    exp.is_hidden
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {exp.featured_image_url && (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image src={exp.featured_image_url} alt={exp.title} fill className="object-cover" sizes="64px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{exp.title}</p>
                      <p className="text-sm text-neutral-500">{exp.city} · ${exp.price_usd} USD · {exp.total_bookings} reservas</p>
                      {exp.is_hidden && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">🚫 {exp.hidden_reason}</p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      exp.is_hidden ? 'bg-red-100 text-red-700' : exp.is_published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {exp.is_hidden ? 'Oculta' : exp.is_published ? 'Publicada' : 'Borrador'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setEditingExp(exp); setHidingExp(null) }}
                      className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
                    >
                      ✏️ Editar
                    </button>
                    {exp.is_hidden ? (
                      <button
                        onClick={() => handleHideExperience(exp, '')}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium border border-green-200 text-green-700 hover:bg-green-50"
                      >
                        👁️ Mostrar
                      </button>
                    ) : (
                      <button
                        onClick={() => setHidingExp({ id: exp.id, reason: '' })}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium border border-amber-200 text-amber-700 hover:bg-amber-50"
                      >
                        🚫 Ocultar
                      </button>
                    )}
                    {deletingExpId === exp.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600">¿Confirmar eliminación?</span>
                        <button
                          onClick={() => handleDeleteExperience(exp)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setDeletingExpId(null)}
                          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingExpId(exp.id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>

                  {/* Inline hide reason — each row carries its own reason in hidingExp.reason */}
                  {hidingExp?.id === exp.id && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={hidingExp.reason}
                        onChange={(e) => setHidingExp({ id: exp.id, reason: e.target.value })}
                        placeholder="Razón para ocultar..."
                        autoFocus
                        className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        onClick={() => { if (hidingExp.reason.trim()) { handleHideExperience(exp, hidingExp.reason); setHidingExp(null) } }}
                        disabled={!hidingExp.reason.trim()}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-40"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setHidingExp(null)}
                        className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {experiences.length === 0 && (
                <p className="text-center text-neutral-500 py-10">No hay experiencias registradas.</p>
              )}
            </div>
          )}

          {/* ANFITRIONES */}
          {activeTab === 'hosts' && (
            <div className="space-y-4">
              {hosts.map((host) => {
                const verDocs = host.identity_verifications ?? []
                const latestDoc = verDocs[verDocs.length - 1] ?? null
                return (
                  <div
                    key={host.id}
                    className="flex flex-col gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4"
                  >
                    {/* Host info + status */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-x-2 flex-wrap">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {host.display_name}
                          </p>
                          {host.is_verified && (
                            <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                              ✅ Verificado
                            </span>
                          )}
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            host.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {host.status === 'active' ? 'Activo' : 'Suspendido'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-0.5">
                          {host.city} · {host.total_listings} experiencias · ⭐ {host.average_rating.toFixed(1)}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Estado verificación: <span className="font-medium">{host.verification_status}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-x-2 shrink-0 flex-wrap">
                        {!host.is_verified && (
                          <button
                            onClick={() => handleVerifyHost(host)}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
                          >
                            ✅ Verificar
                          </button>
                        )}
                        <button
                          onClick={() => handleSuspendHost(host)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                            host.status === 'active'
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {host.status === 'active' ? 'Suspender' : 'Reactivar'}
                        </button>
                      </div>
                    </div>

                    {/* Identity documents (if submitted) */}
                    {latestDoc && (
                      <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-sm">
                        <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          📄 Documentos enviados —{' '}
                          {latestDoc.document_type === 'cedula' ? 'Cédula' : latestDoc.document_type === 'passport' ? 'Pasaporte' : 'Licencia'}
                          {latestDoc.document_number ? ` #${latestDoc.document_number}` : ''}
                          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                            latestDoc.status === 'approved' ? 'bg-green-100 text-green-700' :
                            latestDoc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {latestDoc.status === 'approved' ? '✅ Aprobado' : latestDoc.status === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente'}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {latestDoc.document_front_url && (
                            <button
                              onClick={() => window.open(latestDoc.document_front_url ?? undefined, '_blank')}
                              className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                              📄 Frente
                            </button>
                          )}
                          {latestDoc.document_back_url && (
                            <button
                              onClick={() => window.open(latestDoc.document_back_url ?? undefined, '_blank')}
                              className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                              📄 Dorso
                            </button>
                          )}
                          {latestDoc.selfie_url && (
                            <button
                              onClick={() => window.open(latestDoc.selfie_url ?? undefined, '_blank')}
                              className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                              🤳 Selfie
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {!latestDoc && !host.is_verified && (
                      <p className="text-xs text-neutral-400 italic">
                        Sin documentos enviados — puedes verificar manualmente si lo conoces.
                      </p>
                    )}
                  </div>
                )
              })}
              {hosts.length === 0 && (
                <p className="text-center text-neutral-500 py-10">
                  No hay anfitriones registrados.
                </p>
              )}
            </div>
          )}

          {/* RESERVAS */}
          {activeTab === 'bookings' && (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">Código</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300 hidden sm:table-cell">Experiencia</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300 hidden md:table-cell">Total</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                        {booking.booking_code}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {booking.customer_name || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-neutral-500">{booking.customer_email}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 hidden sm:table-cell">
                        <p className="truncate max-w-[150px]">{booking.tour_name}</p>
                        <p className="text-xs text-neutral-400">
                          {new Date(booking.booking_date).toLocaleDateString('es-DO')}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        ${booking.total_usd?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          bookingStatusColors[booking.status] || ''
                        }`}>
                          {bookingStatusLabels[booking.status] || booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <p className="text-center text-neutral-500 py-10">
                  No hay reservas registradas.
                </p>
              )}
            </div>
          )}

{/* VERIFICACIONES */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              {verifications.map((ver) => (
                <div
                  key={ver.id}
                  className={`rounded-2xl border p-5 ${
                    ver.status === 'pending'
                      ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950'
                      : ver.status === 'approved'
                      ? 'border-green-200 dark:border-green-800'
                      : 'border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-x-2 mb-1">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {ver.hosts?.[0]?.display_name || 'Anfitrión'}
                        </p>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          ver.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : ver.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {ver.status === 'pending'
                            ? '⏳ Pendiente'
                            : ver.status === 'approved'
                            ? '✅ Aprobado'
                            : '❌ Rechazado'}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {ver.document_type === 'cedula'
                          ? 'Cédula'
                          : ver.document_type === 'passport'
                          ? 'Pasaporte'
                          : 'Licencia'}{' '}
                        — #{ver.document_number}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Enviado:{' '}
                        {new Date(ver.created_at).toLocaleDateString('es-DO')}
                      </p>
                    </div>

                    {/* Documentos */}
                    <div className="flex gap-x-2">
                      {ver.document_front_url && (
                        <button
                          onClick={() => window.open(ver.document_front_url ?? undefined, '_blank')}
                          className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          📄 Frente
                        </button>
                      )}
                      {ver.document_back_url && (
                        <button
                          onClick={() => window.open(ver.document_back_url ?? undefined, '_blank')}
                          className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          📄 Dorso
                        </button>
                      )}
                      {ver.selfie_url && (
                        <button
                          onClick={() => window.open(ver.selfie_url ?? undefined, '_blank')}
                          className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          🤳 Selfie
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Acciones solo si está pendiente */}
                  {ver.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800 space-y-3">
                      <div className="flex gap-x-3">
                        <button
                          onClick={() => handleUpdateVerification(ver.id, ver.host_id, 'approved')}
                          className="rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          onClick={() => setRejectingVerification({ id: ver.id, reason: '' })}
                          className="rounded-xl border border-red-200 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                      {rejectingVerification?.id === ver.id && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={rejectingVerification.reason}
                            onChange={(e) => setRejectingVerification({ id: ver.id, reason: e.target.value })}
                            placeholder="Razón del rechazo..."
                            autoFocus
                            className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <button
                            onClick={() => { if (rejectingVerification.reason.trim()) { handleUpdateVerification(ver.id, ver.host_id, 'rejected', rejectingVerification.reason); setRejectingVerification(null) } }}
                            disabled={!rejectingVerification.reason.trim()}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setRejectingVerification(null)}
                            className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {verifications.length === 0 && (
                <p className="text-center text-neutral-500 py-10">
                  No hay verificaciones pendientes. 🎉
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Edit experience modal */}
      {editingExp && (
        <EditExperienceModal
          experience={{
            id: editingExp.id,
            title: editingExp.title,
            description: editingExp.description,
            category: editingExp.category,
            price_usd: editingExp.price_usd ?? 0,
            duration_time: editingExp.duration_time,
            max_guests: editingExp.max_guests,
            address: editingExp.address,
            city: editingExp.city,
            is_published: editingExp.is_published,
            featured_image_url: editingExp.featured_image_url,
            gallery_urls: editingExp.gallery_urls,
          }}
          onClose={() => setEditingExp(null)}
          onSaved={() => { loadData(); loadStats() }}
        />
      )}
    </main>
  )
}
