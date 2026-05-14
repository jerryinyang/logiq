import type { UserRole } from '@/lib/db/schema'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  creator: 1,
  admin: 2,
}

export function hasRole(userRole: UserRole | undefined | null, requiredRole: UserRole): boolean {
  if (!userRole) return false
  const userLevel = ROLE_HIERARCHY[userRole] ?? -1
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0
  return userLevel >= requiredLevel
}

export function isAdmin(userRole: UserRole | undefined | null): boolean {
  return hasRole(userRole, 'admin')
}

export function isCreator(userRole: UserRole | undefined | null): boolean {
  return hasRole(userRole, 'creator')
}

const ADMIN_ROUTES = ['/admin']
const CREATOR_ROUTES: string[] = []

export function getRequiredRole(pathname: string): UserRole | null {
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    return 'admin'
  }
  if (CREATOR_ROUTES.some(route => pathname.startsWith(route))) {
    return 'creator'
  }
  return null
}

export function isUnauthorizedAccess(userRole: UserRole | undefined | null, pathname: string): boolean {
  const requiredRole = getRequiredRole(pathname)
  if (!requiredRole) return false
  return !hasRole(userRole, requiredRole)
}

export function roleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'creator':
      return 'Creator'
    case 'user':
      return 'User'
    default:
      return 'User'
  }
}