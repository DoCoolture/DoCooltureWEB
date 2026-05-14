'use client'

import EditExperienceModal from '@/components/EditExperienceModal'
import { supabase } from '@/lib/supabase'
import type { Experience, Host, Booking } from '@/lib/supabase'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type Tab = 'experiences' | 'hosts' | 'bookings' | 'verifications'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('experiences')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [hosts, setHosts] = useState<Host[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [verifications, setVerifications] = useState<any[]>([])

  const [stats, setStats] = useState({
    totalExperiences: 0,
    totalHosts: 0,
    totalBookings: 0,
    pendingVerifications: 0,
    hiddenExperiences: 0,
    totalRevenue: 0,
  })

  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [seedMessage, setSeedMessage] = useState('')
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null)
  const [hidingExpId, setHidingExpId] = useState<string | null>(null)
  const [hideReason, setHideReason] = useState('')
  const [rejectingVerificationId, setRejectingVerificationId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    checkAdmin()
  }, [])

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

    setIsAdmin(true)
    setIsLoading(false)
    loadStats()
  }

  const loadStats = async () => {
    const [
      { count: expCount },
      { count: hostCount },
      { count: bookingCount },
      { count: verCount },
      { count: hiddenCount },
      { data: revenueData },
    ] = await Promise.all([
      supabase.from('experiences').select('*', { count: 'exact', head: true }),
      supabase.from('hosts').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('identity_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase.from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', true),
      supabase.from('bookings')
        .select('total_usd')
        .eq('payment_status', 'paid'),
    ])

    const revenue = revenueData?.reduce(
      (sum, b) => sum + (b.total_usd || 0), 0
    ) || 0

    setStats({
      totalExperiences: expCount || 0,
      totalHosts: hostCount || 0,
      totalBookings: bookingCount || 0,
      pendingVerifications: verCount || 0,
      hiddenExperiences: hiddenCount || 0,
      totalRevenue: revenue,
    })
  }

  const loadData = async () => {
    setIsLoading(true)

    if (activeTab === 'experiences') {
      const { data } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })
      setExperiences(data || [])
    }

    if (activeTab === 'hosts') {
      const { data } = await supabase
        .from('hosts')
        .select('*')
        .order('created_at', { ascending: false })
      setHosts(data || [])
    }

    if (activeTab === 'bookings') {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setBookings(data || [])
    }

    if (activeTab === 'verifications') {
      const { data } = await supabase
        .from('identity_verifications')
        .select('*, hosts(display_name, user_id)')
        .order('created_at', { ascending: false })
      setVerifications(data || [])
    }

    setIsLoading(false)
  }

  const handleHideExperience = async (exp: Experience, reason: string) => {
    await supabase
      .from('experiences')
      .update({
        is_hidden: !exp.is_hidden,
        hidden_reason: exp.is_hidden ? null : reason,
        hidden_at: exp.is_hidden ? null : new Date().toISOString(),
      })
      .eq('id', exp.id)

    // Notificar al anfitrión
    if (!exp.is_hidden) {
      const { data: host } = await supabase
        .from('hosts')
        .select('user_id')
        .eq('id', exp.host_id)
        .single()

      if (host) {
        await supabase.from('notifications').insert({
          user_id: host.user_id,
          type: 'experience_hidden',
          title: 'Tu experiencia fue pausada',
          message: `Tu experiencia "${exp.title}" fue pausada por DoCoolture. Razón: ${reason}`,
          action_url: '/host/dashboard',
        })
      }
    }

    loadData()
    loadStats()
  }

  const handleUpdateVerification = async (
    id: string,
    hostId: string,
    status: 'approved' | 'rejected',
    reason?: string
  ) => {
    await supabase
      .from('identity_verifications')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq('id', id)

    await supabase
      .from('hosts')
      .update({
        verification_status: status,
        is_verified: status === 'approved',
        verified_at: status === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', hostId)

    // Notificar al anfitrión
    const { data: host } = await supabase
      .from('hosts')
      .select('user_id')
      .eq('id', hostId)
      .single()

    if (host) {
      await supabase.from('notifications').insert({
        user_id: host.user_id,
        type: status === 'approved'
          ? 'verification_approved'
          : 'verification_rejected',
        title: status === 'approved'
          ? '✅ Identidad verificada'
          : '❌ Verificación rechazada',
        message: status === 'approved'
          ? '¡Tu identidad ha sido verificada! Los explorers verán tu insignia de verificación.'
          : `Tu verificación fue rechazada. Razón: ${reason}`,
        action_url: '/host/profile',
      })
    }

    loadData()
    loadStats()
  }

  const handleDeleteExperience = async (exp: Experience) => {
    const { error } = await supabase.from('experiences').delete().eq('id', exp.id)
    if (!error) {
      setDeletingExpId(null)
      loadData()
      loadStats()
    } else {
      console.error('Delete error:', error)
    }
  }

  const handleSeedExperience = async () => {
    setSeedStatus('loading')
    setSeedMessage('')
    try {
      const res = await fetch('/api/admin/seed-experience', { method: 'POST' })
      const json = await res.json()
      if (res.ok) {
        setSeedStatus('ok')
        setSeedMessage(json.message)
        loadStats()
      } else {
        setSeedStatus('error')
        setSeedMessage(json.error)
      }
    } catch {
      setSeedStatus('error')
      setSeedMessage('Error de red al ejecutar el seeding.')
    }
  }

  const handleSuspendHost = async (host: Host) => {
    const newStatus = host.status === 'active' ? 'suspended' : 'active'
    await supabase
      .from('hosts')
      .update({ status: newStatus })
      .eq('id', host.id)
    loadData()
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
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-neutral-100 text-neutral-800',
  }

  const bookingStatusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    no_show: 'No se presentó',
  }

  return (
    <main className="container max-w-6xl mx-auto py-10 px-4 mb-24">

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

        {/* Seed button */}
        <div className="flex flex-col items-start gap-y-1">
          <button
            onClick={handleSeedExperience}
            disabled={seedStatus === 'loading'}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {seedStatus === 'loading' ? 'Guardando...' : '📥 Guardar experiencia base en Supabase'}
          </button>
          {seedMessage && (
            <p className={`text-xs ${seedStatus === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
              {seedMessage}
            </p>
          )}
        </div>
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
                      onClick={() => { setEditingExp(exp); setHidingExpId(null) }}
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
                        onClick={() => { setHidingExpId(exp.id); setHideReason('') }}
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

                  {/* Inline hide reason */}
                  {hidingExpId === exp.id && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={hideReason}
                        onChange={(e) => setHideReason(e.target.value)}
                        placeholder="Razón para ocultar..."
                        autoFocus
                        className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        onClick={() => { if (hideReason.trim()) { handleHideExperience(exp, hideReason); setHidingExpId(null); setHideReason('') } }}
                        disabled={!hideReason.trim()}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-40"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => { setHidingExpId(null); setHideReason('') }}
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
              {hosts.map((host) => (
                <div
                  key={host.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-x-2">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {host.display_name}
                      </p>
                      {host.is_verified && (
                        <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                          ✅ Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {host.city} · {host.total_listings} experiencias ·
                      ⭐ {host.average_rating.toFixed(1)}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Verificación: {host.verification_status}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2 shrink-0">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      host.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {host.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
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
              ))}
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
                          {ver.hosts?.display_name || 'Anfitrión'}
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
                          onClick={() => window.open(ver.document_front_url, '_blank')}
                          className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          📄 Frente
                        </button>
                      )}
                      {ver.document_back_url && (
                        <button
                          onClick={() => window.open(ver.document_back_url, '_blank')}
                          className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          📄 Dorso
                        </button>
                      )}
                      {ver.selfie_url && (
                        <button
                          onClick={() => window.open(ver.selfie_url, '_blank')}
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
                          onClick={() => { setRejectingVerificationId(ver.id); setRejectReason('') }}
                          className="rounded-xl border border-red-200 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                      {rejectingVerificationId === ver.id && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Razón del rechazo..."
                            autoFocus
                            className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <button
                            onClick={() => { if (rejectReason.trim()) { handleUpdateVerification(ver.id, ver.host_id, 'rejected', rejectReason); setRejectingVerificationId(null); setRejectReason('') } }}
                            disabled={!rejectReason.trim()}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => { setRejectingVerificationId(null); setRejectReason('') }}
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
          }}
          onClose={() => setEditingExp(null)}
          onSaved={() => { loadData(); loadStats() }}
        />
      )}
    </main>
  )
}
