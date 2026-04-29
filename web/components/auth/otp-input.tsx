'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  disabled?: boolean
}

export function OTPInput({ 
  value, 
  onChange, 
  error, 
  label = 'Verification Code',
  disabled = false 
}: OTPInputProps) {
  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-foreground">{label}</Label>
      )}
      <div className="flex justify-center">
        <InputOTP
          value={value}
          onChange={onChange}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={disabled}
          containerClassName="gap-2"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <InputOTPSlot 
                  index={index}
                  className={`
                    w-12 h-14 text-xl font-semibold border-border
                    focus:border-accent focus:ring-accent/20
                    ${error ? 'border-destructive' : ''}
                    ${disabled ? 'opacity-50' : ''}
                  `}
                />
              </motion.div>
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-destructive flex items-center justify-center gap-1.5"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
