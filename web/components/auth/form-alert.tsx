'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormAlertProps {
  type: 'error' | 'success' | 'info' | 'warning'
  message: string
  show?: boolean
  className?: string
}

const alertStyles = {
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    text: 'text-destructive',
    icon: XCircle,
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    icon: CheckCircle,
  },
  info: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    text: 'text-accent',
    icon: Info,
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600',
    icon: AlertCircle,
  },
}

export function FormAlert({ type, message, show = true, className }: FormAlertProps) {
  const style = alertStyles[type]
  const Icon = style.icon

  return (
    <AnimatePresence mode="wait">
      {show && message && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border',
            style.bg,
            style.border,
            className
          )}
        >
          <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', style.text)} />
          <p className={cn('text-sm', style.text)}>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
