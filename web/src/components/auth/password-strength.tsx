'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useMemo } from 'react'

interface PasswordStrengthProps {
  password: string
  show?: boolean
}

interface Requirement {
  label: string
  test: (password: string) => boolean
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return 0
    const passed = requirements.filter(req => req.test(password)).length
    return Math.round((passed / requirements.length) * 100)
  }, [password])

  const strengthLabel = useMemo(() => {
    if (strength === 0) return { text: '', color: 'bg-muted' }
    if (strength < 40) return { text: 'Weak', color: 'bg-destructive' }
    if (strength < 80) return { text: 'Medium', color: 'bg-amber-500' }
    return { text: 'Strong', color: 'bg-success' }
  }, [strength])

  if (!show || !password) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-3 overflow-hidden"
      >
        {/* Strength bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Password strength</span>
            <span className={`font-medium ${
              strength < 40 ? 'text-destructive' : 
              strength < 80 ? 'text-amber-500' : 
              'text-success'
            }`}>
              {strengthLabel.text}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`h-full rounded-full ${strengthLabel.color}`}
            />
          </div>
        </div>

        {/* Requirements list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {requirements.map((req, index) => {
            const passed = req.test(password)
            return (
              <motion.div
                key={req.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: passed ? [1, 1.2, 1] : 1,
                    backgroundColor: passed ? 'rgb(var(--success))' : 'transparent',
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    flex items-center justify-center w-4 h-4 rounded-full
                    ${passed ? 'text-success-foreground' : 'border border-muted-foreground/50'}
                  `}
                >
                  {passed ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3 text-muted-foreground/50" />
                  )}
                </motion.div>
                <span className={passed ? 'text-foreground' : 'text-muted-foreground'}>
                  {req.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
