'use client'

import { motion } from 'framer-motion'

interface DividerProps {
  text?: string
}

export function Divider({ text = 'or' }: DividerProps) {
  return (
    <motion.div 
      className="relative my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-card text-muted-foreground">{text}</span>
      </div>
    </motion.div>
  )
}
