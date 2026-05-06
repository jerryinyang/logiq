'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormInput } from '@/components/auth/form-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { PasswordStrength } from '@/components/auth/password-strength'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const password = watch('password', '')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setServerError('')

    const payload: Record<string, unknown> = {
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    }

    if (data.dateOfBirth) {
      payload.dateOfBirth = data.dateOfBirth
    }

    if (data.parentalConsent) {
      payload.parentalConsent = true
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          setServerError(result.errors[0]?.message || 'Validation failed')
        } else {
          setServerError(result.message || 'Something went wrong')
        }
        return
      }

      toast.success('Welcome to LOGIQ! Your account has been created.')
      router.push('/dashboard')
    } catch {
      setServerError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Join LOGIQ and start your learning journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <StaggerContainer className="space-y-5" staggerDelay={0.08}>
          <FormAlert type="error" message={serverError} />

          <StaggerItem>
            <FormInput
              label="Display name"
              id="displayName"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
          </StaggerItem>

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
            <FormInput
              label="Password"
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              maxLength={128}
              error={errors.password?.message}
              onFocus={() => setShowPasswordStrength(true)}
              {...register('password')}
            />
            <PasswordStrength password={password} show={showPasswordStrength} />
          </StaggerItem>

          <StaggerItem>
            <FormInput
              label="Confirm password"
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              maxLength={128}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </StaggerItem>

          <StaggerItem>
            <SubmitButton
              isLoading={isLoading}
              loadingText="Creating account..."
              disabled={!isValid}
            >
              Create account
            </SubmitButton>
          </StaggerItem>

          <StaggerItem>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/"
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                Sign in
              </Link>
            </p>
          </StaggerItem>
        </StaggerContainer>
      </form>
    </AuthLayout>
  )
}