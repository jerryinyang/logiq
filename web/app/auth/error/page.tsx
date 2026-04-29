'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SubmitButton } from '@/components/auth/submit-button'
import { StaggerContainer, StaggerItem } from '@/components/auth/animated-container'
import { XCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An authentication error occurred'

  return (
    <AuthLayout
      title="Authentication Error"
      description="Something went wrong"
    >
      <StaggerContainer className="space-y-6" staggerDelay={0.1}>
        <StaggerItem className="flex justify-center">
          <motion.div 
            className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <XCircle className="w-8 h-8 text-destructive" />
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <p className="text-center text-muted-foreground">
            {message}
          </p>
        </StaggerItem>

        <StaggerItem>
          <SubmitButton 
            type="button" 
            onClick={() => window.location.href = '/'}
          >
            Try again
          </SubmitButton>
        </StaggerItem>

        <StaggerItem>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </StaggerItem>
      </StaggerContainer>
    </AuthLayout>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Authentication Error" description="Something went wrong">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-11 bg-muted rounded-md" />
        </div>
      </AuthLayout>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
