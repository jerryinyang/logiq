'use client'

import { motion } from 'framer-motion'
import { LogiqLogo } from '@/components/logiq-logo'
import { AnimatedContainer } from './animated-container'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  showBackToHome?: boolean
}

export function AuthLayout({ 
  children, 
  title, 
  description,
  showBackToHome = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Gradient accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/">
              <LogiqLogo size="sm" animate={false} />
            </Link>
            {showBackToHome && (
              <Link 
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to home
              </Link>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            <AnimatedContainer className="text-center mb-8">
              <motion.h1 
                className="text-3xl font-semibold text-foreground tracking-tight text-balance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h1>
              {description && (
                <motion.p 
                  className="mt-3 text-muted-foreground text-balance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {description}
                </motion.p>
              )}
            </AnimatedContainer>

            <AnimatedContainer delay={0.3}>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                {children}
              </div>
            </AnimatedContainer>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LOGIQ. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
