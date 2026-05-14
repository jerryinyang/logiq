'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormInput } from '@/components/auth/form-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { PasswordStrength } from '@/components/auth/password-strength'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  })

  const password = watch('password', '')

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in data) {
              setError(err.field as keyof ResetPasswordFormData, { message: err.message })
            }
          })
        } else {
          setServerError(result.message || 'Something went wrong')
        }
        return
      }

      setIsSuccess(true)
    } catch {
      setServerError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password reset successful"
        description="Your password has been changed"
      >
        <StaggerContainer className="space-y-6" staggerDelay={0.1}>
          <StaggerItem className="flex justify-center">
            <motion.div 
              className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <CheckCircle className="w-8 h-8 text-success" />
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <p className="text-center text-muted-foreground">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </StaggerItem>

          <StaggerItem>
            <SubmitButton 
              type="button" 
              onClick={() => router.push('/')}
            >
              Sign in
            </SubmitButton>
          </StaggerItem>
        </StaggerContainer>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Set new password"
      description="Create a strong password for your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <StaggerContainer className="space-y-5" staggerDelay={0.08}>
          <FormAlert type="error" message={serverError} />

          <StaggerItem>
            <FormInput
              label="New password"
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              error={errors.password?.message}
              onFocus={() => setShowPasswordStrength(true)}
              {...register('password')}
            />
            <PasswordStrength password={password} show={showPasswordStrength} />
          </StaggerItem>

          <StaggerItem>
            <FormInput
              label="Confirm new password"
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </StaggerItem>

          <StaggerItem>
            <SubmitButton isLoading={isLoading} loadingText="Resetting...">
              Reset password
            </SubmitButton>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </form>
    </AuthLayout>
  )
}
