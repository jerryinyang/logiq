'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubmitButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  loadingText?: string
  className?: string
  disabled?: boolean
  type?: 'submit' | 'button'
  onClick?: () => void
  variant?: 'default' | 'outline' | 'secondary'
}

export function SubmitButton({
  children,
  isLoading = false,
  loadingText = 'Please wait...',
  className,
  disabled,
  type = 'submit',
  onClick,
  variant = 'default',
}: SubmitButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
    >
      <Button
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        variant={variant}
        className={cn(
          'w-full h-11 text-base font-medium transition-all duration-200',
          variant === 'default' && 'bg-foreground text-background hover:bg-foreground/90',
          className
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </span>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  )
}
