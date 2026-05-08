import { type NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'logiq_session'

const authRoutes = new Set(['/', '/login', '/register', '/auth/forgot-password', '/auth/reset-password'])
const protectedRoutes = ['/dashboard', '/challenge', '/profile', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE)

  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtected) {
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  if (authRoutes.has(pathname) && sessionCookie?.value) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
