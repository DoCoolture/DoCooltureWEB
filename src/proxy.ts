import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired — keeps the user logged in
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isHostRoute = pathname.startsWith('/host')
  const isAccountRoute = pathname.startsWith('/account')
  const isCheckoutRoute = pathname.startsWith('/checkout') || pathname.startsWith('/pay-done')

  // Not authenticated — redirect to login with return URL
  if (!user && (isAdminRoute || isHostRoute || isAccountRoute || isCheckoutRoute)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated — enforce role-based access
  if (user && (isAdminRoute || isHostRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/experience', request.url))
    }

    if (isHostRoute && profile?.role !== 'host' && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/experience', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/host/:path*',
    '/account/:path*',
    '/checkout',
    '/pay-done',
  ],
}
