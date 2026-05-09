"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormInput } from "@/components/auth/form-input"
import { SubmitButton } from "@/components/auth/submit-button"
import { FormAlert } from "@/components/auth/form-alert"
import { PasswordStrength } from "@/components/auth/password-strength"
import { StaggerContainer, StaggerItem } from "@/components/auth/animated-container"
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  })

  if (!token || token.length < 1) {
    return (
      <AuthLayout
        title="Invalid reset link"
        description="The password reset link is missing or invalid"
      >
        <StaggerContainer className="space-y-5" staggerDelay={0.08}>
          <StaggerItem>
            <FormAlert type="error" message="Invalid or expired reset link" />
          </StaggerItem>
          <StaggerItem>
            <p className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Request a new reset link
              </Link>
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Back to Login
              </Link>
            </p>
          </StaggerItem>
        </StaggerContainer>
      </AuthLayout>
    )
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setServerError("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password, confirmPassword: data.confirmPassword }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          const fieldErrors = result.errors
            .map((e: { field: string; message: string }) => e.message)
            .join(", ")
          setServerError(fieldErrors)
        } else {
          setServerError(result.message || "Invalid or expired reset link")
        }
        setIsLoading(false)
        return
      }

      router.push("/login?reset=success")
    } catch {
      setServerError("Network error. Please check your connection.")
    }

    setIsLoading(false)
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your new password below"
    >
      <StaggerContainer className="space-y-5" staggerDelay={0.08}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <FormAlert type="error" message={serverError} />

            <FormInput
              label="New password"
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              error={errors.password?.message}
              register={register("password", {
                onChange: (e) => setPasswordValue(e.target.value),
              })}
              disabled={isLoading}
            />

            <PasswordStrength password={passwordValue} />
            {passwordValue.length >= 8 &&
              /[A-Z]/.test(passwordValue) &&
              /[a-z]/.test(passwordValue) &&
              /[0-9]/.test(passwordValue) &&
              /[^A-Za-z0-9]/.test(passwordValue) && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Password meets all requirements
                </p>
              )}

            <FormInput
              label="Confirm new password"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
              register={register("confirmPassword")}
              disabled={isLoading}
            />

            <SubmitButton
              isLoading={isLoading}
              loadingText="Resetting password..."
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              Reset password
            </SubmitButton>
          </div>
        </form>

        <StaggerItem>
          <p className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Request a new reset link
            </Link>
          </p>
        </StaggerItem>

        <StaggerItem>
          <p className="text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Back to Login
            </Link>
          </p>
        </StaggerItem>
      </StaggerContainer>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title="Loading..."
          description="Please wait"
        >
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
