'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogiqLogo } from '@/components/logiq-logo'
import { FormInput } from '@/components/auth/form-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { signInSchema, type SignInFormData } from '@/lib/validations/auth'
import { saveSession, initActivityTracking, type StoredUser } from '@/lib/session'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
  })

  // Initialize activity tracking for session management
  useEffect(() => {
    const cleanup = initActivityTracking()
    return cleanup
  }, [])

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.needsVerification) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
          return
        }

        if (result.errors) {
          result.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in data) {
              setError(err.field as keyof SignInFormData, { message: err.message })
            } else {
              setServerError(err.message)
            }
          })
        } else {
          setServerError(result.message || 'Unable to sign in. Please try again.')
        }
        return
      }

      // Save user session to localStorage with 48-hour inactivity timeout
      if (result.data?.user) {
        const userData: StoredUser = {
          id: result.data.user.id,
          email: result.data.user.email,
          firstName: result.data.user.firstName,
          lastName: result.data.user.lastName,
          fullName: result.data.user.firstName && result.data.user.lastName 
            ? `${result.data.user.firstName} ${result.data.user.lastName}`
            : result.data.user.firstName || result.data.user.email,
        }
        saveSession(userData)
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Gradient accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg"
        >
          <LogiqLogo size="lg" />
          <h1 className="mt-8 text-4xl font-semibold text-foreground tracking-tight text-balance">
            Smart Authentication for Modern Apps
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Secure, seamless, and intelligent authentication that your users will love.
          </p>
          
          <div className="mt-12 space-y-4">
            {[
              'Enterprise-grade security',
              'Lightning-fast authentication',
              'Privacy-first approach',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <LogiqLogo />
          </div>

          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back
            </motion.h2>
            <motion.p 
              className="mt-2 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sign in to your LOGIQ account
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <StaggerContainer className="space-y-5" staggerDelay={0.08}>
                <FormAlert type="error" message={serverError} />

                <StaggerItem>
                  <FormInput
                    label="Email address"
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </StaggerItem>

                <StaggerItem>
                  <div className="space-y-2">
                    <FormInput
                      label="Password"
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      error={errors.password?.message}
                      {...register('password')}
                    />
                    <div className="text-right">
                      <Link 
                        href={`/auth/forgot-password${getValues('email') ? `?email=${encodeURIComponent(getValues('email'))}` : ''}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <SubmitButton isLoading={isLoading} loadingText="Signing in...">
                    Sign in
                  </SubmitButton>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link 
                      href="/auth/sign-up" 
                      className="font-medium text-foreground hover:text-accent transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </StaggerItem>
              </StaggerContainer>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-xs text-muted-foreground"
          >
            &copy; {new Date().getFullYear()} LOGIQ. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
