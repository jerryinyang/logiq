'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormInput } from '@/components/auth/form-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { ArrowLeft, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')
  
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: emailParam || '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in data) {
              setError(err.field as keyof ForgotPasswordFormData, { message: err.message })
            }
          })
        } else {
          setServerError(result.message || 'Something went wrong')
        }
        return
      }

      setSubmittedEmail(data.email)
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
        title="Check your email"
        description="We&apos;ve sent you a password reset link"
      >
        <StaggerContainer className="space-y-6" staggerDelay={0.1}>
          <StaggerItem className="flex justify-center">
            <motion.div 
              className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <Mail className="w-8 h-8 text-success" />
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <p className="text-center text-muted-foreground">
              If an account exists for{' '}
              <span className="font-medium text-foreground">{submittedEmail}</span>,
              you will receive a password reset link shortly.
            </p>
          </StaggerItem>

          <StaggerItem>
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                try again
              </button>
            </p>
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
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      description="No worries, we&apos;ll send you reset instructions"
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
            <SubmitButton isLoading={isLoading} loadingText="Sending...">
              Send reset link
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Forgot your password?" description="No worries, we'll send you reset instructions">
        <div className="animate-pulse space-y-4">
          <div className="h-11 bg-muted rounded-md" />
          <div className="h-11 bg-muted rounded-md" />
        </div>
      </AuthLayout>
    }>
      <ForgotPasswordForm />
    </Suspense>
  )
}
