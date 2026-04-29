'use client'

import { motion } from 'framer-motion'

interface LogiqLogoProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  className?: string
}

export function LogiqLogo({ size = 'md', animate = true, className = '' }: LogiqLogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 40, text: 'text-2xl' },
    lg: { icon: 56, text: 'text-4xl' },
  }

  const { icon, text } = sizes[size]

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  const Wrapper = animate ? motion.div : 'div'
  const wrapperProps = animate ? {
    initial: 'hidden',
    animate: 'visible',
    variants: logoVariants,
  } : {}

  return (
    <Wrapper 
      className={`flex items-center gap-3 ${className}`}
      {...wrapperProps}
    >
      <div 
        className="relative flex items-center justify-center rounded-xl bg-foreground"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="text-background"
          style={{ width: icon * 0.6, height: icon * 0.6 }}
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div 
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-accent"
          style={{ width: icon * 0.3, height: icon * 0.3 }}
        />
      </div>
      <span className={`font-semibold tracking-tight text-foreground ${text}`}>
        LOGIQ
      </span>
    </Wrapper>
  )
}
