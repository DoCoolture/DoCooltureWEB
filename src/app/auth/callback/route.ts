import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase-admin'
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
        .select('role, created_at')
        .eq('user_id', user.id)
        .single()

      // Only upgrade role during initial signup:
      // - Profile must be fresh (< 30 min) to survive slow email delivery
      // - No host record must exist yet, preventing re-use of old signup links
      let currentRole = profile?.role
      if (role && role !== 'explorer' && profile?.role === 'explorer' && profile?.created_at) {
        const profileAgeMs = Date.now() - new Date(profile.created_at).getTime()
        const isNewAccount = profileAgeMs < 30 * 60 * 1000

        const { count: existingHostCount } = await supabaseAdmin
          .from('hosts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (isNewAccount && existingHostCount === 0) {
          await supabaseAdmin.from('profiles').update({ role }).eq('user_id', user.id)
          currentRole = role
        }
      }

      if (next !== '/experience') return NextResponse.redirect(`${origin}${next}`)
      if (currentRole === 'admin') return NextResponse.redirect(`${origin}/admin`)
      if (currentRole === 'host') return NextResponse.redirect(`${origin}/host/dashboard`)
      return NextResponse.redirect(`${origin}/experience`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
