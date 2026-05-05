'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogiqLogo } from '@/components/logiq-logo'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  LogOut, 
  User, 
  Settings, 
  Shield,
  Activity,
  KeyRound,
  Mail,
  Menu,
  X,
  Home,
  Bell
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { 
  clearSession, 
  initActivityTracking, 
  getStoredUser,
  type StoredUser 
} from '@/lib/session'

interface DashboardContentProps {
  user: SupabaseUser
}

export function DashboardContent({ user }: DashboardContentProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null)

  // Get stored user data and initialize activity tracking
  useEffect(() => {
    const userData = getStoredUser()
    setStoredUser(userData)
    
    // Initialize activity tracking for 48-hour inactivity timeout
    const cleanup = initActivityTracking()
    return cleanup
  }, [])

  // Use stored user data if available, otherwise fall back to Supabase user
  const firstName = storedUser?.firstName || user.user_metadata?.first_name || 'User'
  const lastName = storedUser?.lastName || user.user_metadata?.last_name || ''
  const fullName = storedUser?.fullName || user.user_metadata?.full_name || `${firstName} ${lastName}`.trim()
  const email = storedUser?.email || user.email || ''
  const initials = `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ''}`.toUpperCase() || 'U'

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Clear local session
      clearSession()
      
      // Sign out from Supabase
      await fetch('/api/auth/sign-out', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const stats = [
    { label: 'Active Sessions', value: '1', icon: Activity, color: 'text-accent' },
    { label: 'Security Level', value: 'High', icon: Shield, color: 'text-emerald-400' },
    { label: 'Session Timeout', value: '48h', icon: KeyRound, color: 'text-amber-400' },
  ]

  const navItems = [
    { label: 'Dashboard', icon: Home, active: true },
    { label: 'Notifications', icon: Bell, active: false },
    { label: 'Settings', icon: Settings, active: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <LogiqLogo size="sm" animate={false} />
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
                      {initials}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-medium">
                      {initials}
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Here&apos;s an overview of your account
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-secondary">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Account info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <div className="p-2 rounded-lg bg-card w-fit">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium truncate">{fullName}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <div className="p-2 rounded-lg bg-card w-fit">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium truncate">{email}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <div className="p-2 rounded-lg bg-card w-fit">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Account ID</p>
                    <p className="font-medium font-mono text-xs sm:text-sm break-all">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
