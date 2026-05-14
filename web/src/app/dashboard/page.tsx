import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { DashboardContent } from '@/components/dashboard-content'

export default async function DashboardPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect('/')
  }

  return (
    <DashboardContent
      user={{
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.display_name,
          first_name: user.display_name,
        },
      }}
    />
  )
}
