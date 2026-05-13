import { type NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'logiq_session'
const ROLE_COOKIE = 'logiq_role'

const authRoutes = new Set(['/', '/login', '/register', '/forgot-password', '/reset-password'])
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/challenge']

type UserRole = 'user' | 'creator' | 'admin'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  creator: 1,
  admin: 2,
}

function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  const userLevel = ROLE_HIERARCHY[userRole] ?? -1
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0
  return userLevel >= requiredLevel
}

function getRequiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith('/admin')) return 'admin'
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value

  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  const requiredRole = getRequiredRole(pathname)

  if (requiredRole) {
    if (!sessionCookie) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const roleCookie = request.cookies.get(ROLE_COOKIE)?.value
    const userRole = roleCookie as UserRole | undefined

    if (!hasRole(userRole, requiredRole)) {
      securityLog(request, 'UNAUTHORIZED_ACCESS_ATTEMPT', userRole)
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtected) {
    if (!sessionCookie) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  if (authRoutes.has(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

function securityLog(request: NextRequest, action: string, userRole: UserRole | undefined) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')?.trim()
    ?? 'unknown'
  const userAgent = request.headers.get('user-agent') ?? 'unknown'
  console.log(`[SECURITY] ${action} role=${userRole ?? 'unknown'} path=${request.nextUrl.pathname} ip=${ip} ua=${userAgent}`)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}