'use client'

import { useRouter } from 'next/navigation'
import { LogiqLogo } from '@/components/logiq-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Home, Shield, Users, BarChart3, Settings } from 'lucide-react'
import { roleDisplayName } from '@/lib/auth/rbac'

interface AdminDashboardShellProps {
  userDisplayName: string
  userRole: string
}

export function AdminDashboardShell({ userDisplayName, userRole }: AdminDashboardShellProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const adminNavItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Users', icon: Users, href: '#', disabled: true },
    { label: 'Analytics', icon: BarChart3, href: '#', disabled: true },
    { label: 'Settings', icon: Settings, href: '#', disabled: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <LogiqLogo size="sm" animate={false} />
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push('/dashboard')}
                >
                  <Home className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium text-accent">Admin</span>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{userDisplayName}</p>
                <p className="text-xs text-muted-foreground">{roleDisplayName(userRole as 'user' | 'creator' | 'admin')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
            System administration and management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {adminNavItems.filter(item => !item.disabled).concat(adminNavItems.filter(item => item.disabled)).map((item, _index) => (
            <Card key={item.label} className={`bg-card/50 backdrop-blur-sm ${item.disabled ? 'opacity-60' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-secondary">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.disabled ? 'Coming soon' : 'Navigate'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrator Access
            </CardTitle>
            <CardDescription>
              You have {roleDisplayName(userRole as 'user' | 'creator' | 'admin')} level access to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="font-medium capitalize">{userRole}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground">Access Level</p>
                <p className="font-medium">Full System Access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}