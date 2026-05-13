import type { UserRole } from '@/lib/db/schema'
import { getSessionUser } from '@/lib/auth'
import { hasRole } from './rbac'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const user = await getSessionUser()
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 }),
    }
  }
  return { user, error: null }
}

export async function requireRole(requiredRole: UserRole) {
  const { user, error } = await requireAuth()
  if (error) return { user: null, error }
  if (!hasRole(user!.role as UserRole, requiredRole)) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Access denied. Insufficient permissions.' },
        { status: 403 },
      ),
    }
  }
  return { user, error: null }
}