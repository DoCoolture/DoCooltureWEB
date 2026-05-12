import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/experience'

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)

    // Obtener usuario y redirigir según rol
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profile?.role === 'admin') return NextResponse.redirect(`${origin}/admin`)
      if (profile?.role === 'host') return NextResponse.redirect(`${origin}/host/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
