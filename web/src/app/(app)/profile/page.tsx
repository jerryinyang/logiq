'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { LogiqLogo } from '@/components/logiq-logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Mail,
  Shield,
  KeyRound,
  Activity,
  Menu,
  X,
  Home,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { FormInput } from '@/components/auth/form-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { PasswordStrength } from '@/components/auth/password-strength'
import {
  updateDisplayNameSchema,
  changePasswordSchema,
  type UpdateDisplayNameFormData,
  type ChangePasswordFormData,
} from '@/lib/validations/profile'
import { roleDisplayName } from '@/lib/auth/rbac'

interface ProfileUser {
  id: string
  email: string
  displayName: string
  role: string
}

function ProfileContent() {
  const router = useRouter()
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [displayNameValue, setDisplayNameValue] = useState('')
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [nameError, setNameError] = useState('')

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  })

  const newPassword = watchPassword('newPassword', '')

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setDisplayNameValue(data.user.displayName)
        } else {
          router.push('/')
        }
      } catch {
        router.push('/')
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchUser()
  }, [router])

  const handleUpdateDisplayName = useCallback(async () => {
    if (!displayNameValue.trim() || displayNameValue === user?.displayName) return

    setIsUpdatingName(true)
    setNameError('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayNameValue.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setNameError(data.message || data.errors?.[0]?.message || 'Failed to update display name')
        return
      }

      setUser((prev) => prev ? { ...prev, displayName: data.user.displayName } : prev)
      setDisplayNameValue(data.user.displayName)
      toast.success('Display name updated successfully')
    } catch {
      setNameError('Network error. Please check your connection.')
    } finally {
      setIsUpdatingName(false)
    }
  }, [displayNameValue, user?.displayName])

  const handleChangePassword = useCallback(async (data: ChangePasswordFormData) => {
    setIsChangingPassword(true)
    setPasswordError('')

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setPasswordError(result.message || 'Failed to change password')
        return
      }

      toast.success('Password changed successfully')
      resetPassword()
      setShowPasswordStrength(false)
    } catch {
      setPasswordError('Network error. Please check your connection.')
    } finally {
      setIsChangingPassword(false)
    }
  }, [resetPassword])

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      router.push('/')
      router.refresh()
      toast.success('You have been signed out')
    } catch {
      toast.error('Failed to sign out')
      setIsLoggingOut(false)
    }
  }, [router])

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Profile', icon: User, href: '/profile', active: true },
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
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                    onClick={() => item.href !== '/profile' && router.push(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
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
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
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
                  onClick={() => {
                    if (item.href !== '/profile') router.push(item.href)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Account Settings
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Manage your profile and security settings
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your display name and view your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <div className="p-2 rounded-lg bg-card w-fit">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <div className="p-2 rounded-lg bg-card w-fit">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{roleDisplayName(user.role as 'user' | 'creator' | 'admin')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-sm font-medium text-foreground">
                    Display Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="displayName"
                      type="text"
                      value={displayNameValue}
                      onChange={(e) => {
                        setDisplayNameValue(e.target.value)
                        setNameError('')
                      }}
                      className="flex-1 h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your display name"
                      aria-label="Display name"
                      aria-invalid={!!nameError}
                      aria-describedby={nameError ? 'displayName-error' : undefined}
                      minLength={3}
                      maxLength={50}
                    />
                    <Button
                      onClick={handleUpdateDisplayName}
                      disabled={isUpdatingName || displayNameValue.trim() === user.displayName || !displayNameValue.trim()}
                      className="gap-2"
                    >
                      {isUpdatingName ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                  </div>
                  {nameError && (
                    <p id="displayName-error" className="text-sm text-destructive flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {nameError}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword(handleChangePassword)} noValidate>
                  <div className="space-y-4">
                    <FormAlert type="error" message={passwordError} />

                    <FormInput
                      label="Current password"
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      error={passwordErrors.currentPassword?.message}
                      {...registerPassword('currentPassword')}
                    />

                    <FormInput
                      label="New password"
                      id="newPassword"
                      type="password"
                      placeholder="Enter a new password"
                      autoComplete="new-password"
                      maxLength={128}
                      error={passwordErrors.newPassword?.message}
                      onFocus={() => setShowPasswordStrength(true)}
                      {...registerPassword('newPassword')}
                    />
                    <PasswordStrength password={newPassword} show={showPasswordStrength} />

                    <FormInput
                      label="Confirm new password"
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      maxLength={128}
                      error={passwordErrors.confirmPassword?.message}
                      {...registerPassword('confirmPassword')}
                    />

                    <SubmitButton
                      isLoading={isChangingPassword}
                      loadingText="Changing password..."
                      disabled={!isPasswordValid}
                    >
                      Change password
                    </SubmitButton>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return <ProfileContent />
}