'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useCanvasStore } from '@/stores/canvas-store'
import type { ExecutionStep, TestStatus } from '@/types/execution-types'
import { AnimatePresence, motion } from 'framer-motion'

interface ExecutionProgressAnimationProps {
  challengeId?: string
}

function useExecutionAnimation() {
  const executionSteps = useCanvasStore((s) => s.executionSteps)
  const testStatus = useCanvasStore((s) => s.testStatus)
  const setEdges = useCanvasStore((s) => s.setEdges)

  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [activeBlockIds, setActiveBlockIds] = useState<Set<string>>(new Set())
  const [completedBlockIds, setCompletedBlockIds] = useState<Map<string, 'success' | 'error'>>(new Map())
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (testStatus !== 'running' || !executionSteps || executionSteps.length === 0) {
      setCurrentStepIndex(-1)
      setActiveBlockIds(new Set())
      setCompletedBlockIds(new Map())
      return
    }

    let stepIndex = 0
    const animateStep = () => {
      if (stepIndex >= executionSteps.length) {
        return
      }

      const step = executionSteps[stepIndex]
      setCurrentStepIndex(stepIndex)
      setActiveBlockIds(new Set([step.blockId]))

      stepIndex++

      if (stepIndex < executionSteps.length) {
        animationRef.current = setTimeout(animateStep, 300)
      }
    }

    animateStep()

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [testStatus, executionSteps, setEdges])

  useEffect(() => {
    if (testStatus !== 'running' || currentStepIndex < 0 || !executionSteps) return

    const step = executionSteps[currentStepIndex]
    if (!step) return

    setActiveBlockIds(new Set([step.blockId]))

    setCompletedBlockIds((prev) => {
      const next = new Map(prev)
      if (step.status === 'success') {
        next.set(step.blockId, 'success')
      } else if (step.status === 'error') {
        next.set(step.blockId, 'error')
      }
      return next
    })
  }, [currentStepIndex, testStatus, executionSteps, setEdges])

  useEffect(() => {
    if (testStatus === 'success' || testStatus === 'error') {
      if (!executionSteps) return

      const finalMap = new Map<string, 'success' | 'error'>()
      for (const step of executionSteps) {
        finalMap.set(step.blockId, step.status === 'error' ? 'error' : 'success')
      }
      setCompletedBlockIds(finalMap)
      setActiveBlockIds(new Set())
    }
  }, [testStatus, executionSteps])

  return { currentStepIndex, activeBlockIds, completedBlockIds }
}

function NodeHighlightOverlay({
  activeBlockIds,
  completedBlockIds,
}: {
  activeBlockIds: Set<string>
  completedBlockIds: Map<string, 'success' | 'error'>
}) {
  if (activeBlockIds.size === 0 && completedBlockIds.size === 0) {
    return null
  }

  return null
}

export function ExecutionProgressAnimation({ challengeId }: ExecutionProgressAnimationProps) {
  const testStatus = useCanvasStore((s) => s.testStatus)
  const executionSteps = useCanvasStore((s) => s.executionSteps)
  const { currentStepIndex, activeBlockIds, completedBlockIds } = useExecutionAnimation()

  const totalSteps = executionSteps?.length ?? 0

  if (testStatus !== 'running' && testStatus !== 'success' && testStatus !== 'error') {
    return <NodeHighlightOverlay activeBlockIds={new Set()} completedBlockIds={new Map()} />
  }

  return (
    <>
      <NodeHighlightOverlay activeBlockIds={activeBlockIds} completedBlockIds={completedBlockIds} />
      {testStatus === 'running' && totalSteps > 0 && (
        <div className="pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-lg border border-[#334155] bg-[#1E293B]/95 px-4 py-2 shadow-lg backdrop-blur-sm"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#6366F1]" />
            <span className="text-sm text-[#94A3B8] font-mono">
              Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps} — Running your logic...
            </span>
          </motion.div>
        </div>
      )}
    </>
  )
}