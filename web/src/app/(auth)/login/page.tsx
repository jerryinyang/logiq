'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormInput } from '@/components/auth/form-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { Divider } from '@/components/auth/divider'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { signInSchema, type SignInFormData } from '@/lib/validations/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const toastShownRef = useRef(false)

  useEffect(() => {
    const reset = searchParams.get('reset')
    if (reset === 'success' && !toastShownRef.current) {
      toastShownRef.current = true
      toast.success('Password reset successfully. Please log in with your new password.')
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
  })

  const getCsrfToken = useCallback(() => {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)logiq_csrf=([^;]*)'))
    return match?.[1] ?? null
  }, [])

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setServerError('')

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        setServerError('Server error. Please try again later.')
        setIsLoading(false)
        return
      }

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          setServerError(result.errors[0]?.message || 'Validation failed')
        } else {
          setServerError(result.message || 'Invalid email or password')
        }
        setIsLoading(false)
        return
      }

      if (result.csrfToken) {
        document.cookie = `logiq_csrf=${result.csrfToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      }

      toast.success('Welcome back!')
      const redirectTo = searchParams.get('redirect')
      router.push(redirectTo?.startsWith('/') ? redirectTo : '/dashboard')
    } catch {
      setServerError('Network error. Please check your connection.')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your LOGIQ account"
    >
      <StaggerContainer className="space-y-5" staggerDelay={0.08}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <FormAlert type="error" message={serverError} />

            <FormInput
              label="Email address"
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-border bg-background text-foreground focus:ring-accent/20 h-4 w-4"
                  {...register('rememberMe')}
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <SubmitButton
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign in
            </SubmitButton>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        <StaggerItem>
          <Divider />
        </StaggerItem>

        <StaggerItem>
          <OAuthButtons />
        </StaggerItem>
      </StaggerContainer>
    </AuthLayout>
  )
}
