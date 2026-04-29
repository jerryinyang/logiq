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
import { ProfilePictureUpload } from '@/components/auth/profile-picture-upload'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  })

  const password = watch('password', '')

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setServerError('')

    const formData = {
      ...data,
      profilePicture,
    }

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in data) {
              setError(err.field as keyof SignUpFormData, { message: err.message })
            }
          })
        } else {
          setServerError(result.message || 'Something went wrong')
        }
        return
      }

      // Redirect to verification page
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch {
      setServerError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Get started with LOGIQ in just a few steps"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <StaggerContainer className="space-y-5" staggerDelay={0.08}>
          <div className="flex justify-center">
            <ProfilePictureUpload
              value={profilePicture}
              onChange={setProfilePicture}
              isUploading={isUploading}
            />
          </div>

          <FormAlert type="error" message={serverError} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StaggerItem>
              <FormInput
                label="First name"
                id="firstName"
                type="text"
                placeholder="John"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
            </StaggerItem>
            <StaggerItem>
              <FormInput
                label="Last name"
                id="lastName"
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </StaggerItem>
          </div>

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
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </StaggerItem>

          <StaggerItem>
            <SubmitButton isLoading={isLoading} loadingText="Creating account...">
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
