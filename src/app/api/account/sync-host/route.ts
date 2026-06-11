import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const display_name = typeof body.display_name === 'string' ? body.display_name.trim().slice(0, 100) : ''
  const city = typeof body.city === 'string' ? body.city.trim().slice(0, 100) : null
  const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0, 1000) : null

  if (!display_name || display_name.length < 2) {
    return NextResponse.json({ error: 'Nombre requerido (mínimo 2 caracteres)' }, { status: 400 })
  }

  // Verify the host record exists and belongs to this user before updating
  const { data: existingHost } = await supabaseAdmin
    .from('hosts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!existingHost) {
    return NextResponse.json({ error: 'Perfil de anfitrión no encontrado' }, { status: 404 })
  }

  const { error } = await supabaseAdmin
    .from('hosts')
    .update({
      display_name,
      city: city || null,
      bio: bio || null,
    })
    .eq('id', existingHost.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
