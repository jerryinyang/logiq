'use client'

import { motion } from 'framer-motion'

interface CanvasEmptyStateProps {
  className?: string
}

export function CanvasEmptyState({ className }: CanvasEmptyStateProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center ${className ?? ''}`}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        <p className="text-lg font-medium text-indigo/60">
          Drag blocks here to build your logic
        </p>
        <motion.svg
          width="48"
          height="24"
          viewBox="0 0 48 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M4 12h36M32 6l6 6-6 6"
            stroke="rgba(99, 102, 241, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </div>
  )
}
