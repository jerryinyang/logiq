'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/auth-layout'
import { OTPInput } from '@/components/auth/otp-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormAlert } from '@/components/auth/form-alert'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [serverError, setServerError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (value: string) => {
    setOtp(value)
    setOtpError('')
    setServerError('')
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    setServerError('')
    setOtpError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp,
          type: 'signup'
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          const otpErrorMsg = result.errors.find((e: { field: string }) => e.field === 'otp')
          if (otpErrorMsg) {
            setOtpError(otpErrorMsg.message)
          } else {
            setServerError(result.errors[0]?.message || 'Verification failed')
          }
        } else {
          setServerError(result.message || 'Verification failed')
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

  const handleResend = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    setServerError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage('A new verification code has been sent')
        setResendCooldown(60)
        setOtp('')
      } else {
        setServerError(result.message || 'Failed to resend code')
      }
    } catch {
      setServerError('Network error. Please check your connection.')
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <AuthLayout title="Verify your email" description="Something went wrong">
        <StaggerContainer className="space-y-6" staggerDelay={0.1}>
          <StaggerItem>
            <FormAlert 
              type="error" 
              message="No email address provided. Please start the sign-up process again." 
            />
          </StaggerItem>
          <StaggerItem>
            <Link
              href="/auth/sign-up"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign up
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Email verified!"
        description="Your account is now active"
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
              Your email has been verified successfully. You are now logged in and ready to go!
            </p>
          </StaggerItem>

          <StaggerItem>
            <SubmitButton 
              type="button" 
              onClick={() => router.push('/dashboard')}
            >
              <span className="flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </span>
            </SubmitButton>
          </StaggerItem>
        </StaggerContainer>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Verify your email"
      description={`We sent a code to ${email}`}
    >
      <StaggerContainer className="space-y-6" staggerDelay={0.08}>
        <FormAlert type="error" message={serverError} />
        <FormAlert type="success" message={successMessage} />

        <StaggerItem>
          <OTPInput
            value={otp}
            onChange={handleOtpChange}
            error={otpError}
            label="Enter verification code"
            disabled={isLoading}
          />
        </StaggerItem>

        <StaggerItem>
          <SubmitButton 
            type="button"
            onClick={handleVerify}
            isLoading={isLoading} 
            loadingText="Verifying..."
            disabled={otp.length !== 6}
          >
            Verify email
          </SubmitButton>
        </StaggerItem>

        <StaggerItem>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="font-medium text-foreground hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </p>
        </StaggerItem>

        <StaggerItem>
          <Link
            href="/auth/sign-up"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign up
          </Link>
        </StaggerItem>
      </StaggerContainer>
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Verify your email" description="Loading...">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-12 h-14 bg-muted rounded-md" />
            ))}
          </div>
          <div className="h-11 bg-muted rounded-md" />
        </div>
      </AuthLayout>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
