import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/experience'
  // Only allow relative paths to prevent open-redirect attacks
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/experience'

  if (code) {
    const cookieStore = await cookies()
    // Only allow known user-selectable roles — never accept admin from URL
    const ALLOWED_SIGNUP_ROLES = ['explorer', 'host'] as const
    type SignupRole = typeof ALLOWED_SIGNUP_ROLES[number]
    const rawRole = searchParams.get('role')
    const role: SignupRole | null =
      rawRole && (ALLOWED_SIGNUP_ROLES as readonly string[]).includes(rawRole)
        ? (rawRole as SignupRole)
        : null

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      // Code already consumed (e.g. double-click) — check if a session already exists
      const { data: { user: existingUser } } = await supabase.auth.getUser()
      if (!existingUser) {
        return NextResponse.redirect(`${origin}/login?error=link_expired`)
      }
      // Session is already active — fall through to role-based routing below
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      // Si viene con un rol seleccionado (signup con Google) y el perfil es nuevo (explorer por defecto), actualizar
      if (role && role !== 'explorer' && profile?.role === 'explorer') {
        await supabase.from('profiles').update({ role }).eq('user_id', user.id)
      }

      if (next !== '/experience') return NextResponse.redirect(`${origin}${next}`)
      const effectiveRole = (role && profile?.role === 'explorer' ? role : profile?.role)
      if (effectiveRole === 'admin') return NextResponse.redirect(`${origin}/admin`)
      if (effectiveRole === 'host') return NextResponse.redirect(`${origin}/host/dashboard`)
      return NextResponse.redirect(`${origin}/experience`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
