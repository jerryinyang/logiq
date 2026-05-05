'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import { useState, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
  hint?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, success, hint, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="space-y-2">
        <Label 
          htmlFor={props.id || props.name}
          className="text-foreground"
        >
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            className={cn(
              'h-11 bg-background border-border transition-all duration-200',
              'focus:border-accent focus:ring-accent/20',
              error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              success && 'border-success focus:border-success focus:ring-success/20',
              isPassword && 'pr-12',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id || props.name}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
                style={{ right: isPassword ? '3rem' : '0.75rem' }}
              >
                <AlertCircle className="h-5 w-5" />
              </motion.div>
            )}
            {success && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
                style={{ right: isPassword ? '3rem' : '0.75rem' }}
              >
                <Check className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              id={`${props.id || props.name}-error`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-destructive flex items-center gap-1.5"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted-foreground"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
