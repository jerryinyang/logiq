import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth/require-role'
import { securityLog } from '@/lib/audit'
import { AdminDashboardShell } from './admin-dashboard-shell'

export default async function AdminDashboardPage() {
  const { user, error } = await requireRole('admin')

  if (error || !user) {
    securityLog({
      type: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      userId: 'unknown',
      ip: undefined,
      userAgent: undefined,
    })
    redirect('/dashboard?error=access_denied')
  }

  return <AdminDashboardShell userDisplayName={user.display_name} userRole={user.role} />
}