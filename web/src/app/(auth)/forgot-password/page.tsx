"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormInput } from "@/components/auth/form-input"
import { SubmitButton } from "@/components/auth/submit-button"
import { FormAlert } from "@/components/auth/form-alert"
import { StaggerContainer, StaggerItem } from "@/components/auth/animated-container"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
    } catch {
      setIsSuccess(true)
    }

    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        description="If an account exists with this email, you'll receive a reset link"
      >
        <StaggerContainer className="space-y-5" staggerDelay={0.08}>
          <StaggerItem>
            <div
              className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300"
              role="status"
            >
              If an account exists with this email, you&apos;ll receive a password
              reset link. The link expires in 1 hour.
            </div>
          </StaggerItem>
          <StaggerItem>
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                try again
              </button>
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Back to Login
              </Link>
            </p>
          </StaggerItem>
        </StaggerContainer>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your email address and we'll send you a reset link"
    >
      <StaggerContainer className="space-y-5" staggerDelay={0.08}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <FormInput
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              register={register}
              disabled={isLoading}
            />
            <SubmitButton isLoading={isLoading} loadingText="Sending link...">
              Send reset link
            </SubmitButton>
          </div>
        </form>
        <StaggerItem>
          <p className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Back to Login
            </Link>
          </p>
        </StaggerItem>
      </StaggerContainer>
    </AuthLayout>
  )
}
