'use client'

import { useEffect, useState } from 'react'

interface DraftSavedIndicatorProps {
  lastSavedAt: number | null
}

export function DraftSavedIndicator({ lastSavedAt }: DraftSavedIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!lastSavedAt) return

    setVisible(true)
    const timer = window.setTimeout(() => {
      setVisible(false)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [lastSavedAt])

  if (!visible) return null

  return (
    <div
      className="pointer-events-none absolute bottom-4 right-4 z-50 transition-opacity duration-300"
      aria-live="polite"
    >
      <span className="text-[11px] font-inter text-slate-400">
        Draft saved
      </span>
    </div>
  )
}