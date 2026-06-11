'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function reportHost(input: {
  hostId: string
  hostName: string
  reason: string
  details: string
}): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const reason = input.reason.trim().slice(0, 200)
  const details = input.details.trim().slice(0, 1000)

  const { data: admins } = await supabaseAdmin
    .from('profiles')
    .select('user_id')
    .eq('role', 'admin')

  if (!admins || admins.length === 0) return { error: 'No se pudo enviar el reporte.' }

  const notifications = admins.map((admin) => ({
    user_id: admin.user_id,
    type: 'host_report',
    title: `Reporte de anfitrión: ${input.hostName.slice(0, 100)}`,
    message: `Razón: ${reason}${details ? ` — ${details}` : ''}. Reportado por: ${user?.email ?? 'usuario anónimo'}`,
    action_url: '/admin',
    data: { host_id: input.hostId, reporter_id: user?.id ?? null },
  }))

  const { error } = await supabaseAdmin.from('notifications').insert(notifications)
  return error ? { error: 'No se pudo enviar el reporte.' } : {}
}
