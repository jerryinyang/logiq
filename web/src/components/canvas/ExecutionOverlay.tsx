'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { Panel } from '@xyflow/react'
import { Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react'
import { useCanvasStore } from '@/stores/canvas-store'
import { StepDescription } from './StepDescription'
import { getExecutionPath, canStepForward, canStepBackward, isAtFailurePoint } from '@/lib/execution/step-tracker'

const AUTO_PLAY_INTERVAL_MS = 500

export function ExecutionOverlay() {
  const testStatus = useCanvasStore((s) => s.testStatus)
  const executionSteps = useCanvasStore((s) => s.executionSteps)
  const currentStepIndex = useCanvasStore((s) => s.currentStepIndex)
  const isPlaying = useCanvasStore((s) => s.isPlaying)
  const stepThroughActive = useCanvasStore((s) => s.stepThroughActive)
  const nextStep = useCanvasStore((s) => s.nextStep)
  const previousStep = useCanvasStore((s) => s.previousStep)
  const togglePlay = useCanvasStore((s) => s.togglePlay)
  const resetSteps = useCanvasStore((s) => s.resetSteps)
  const testResults = useCanvasStore((s) => s.testResults)

  const [localStepIndex, setLocalStepIndex] = useState(0)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const effectiveStepIndex = stepThroughActive ? currentStepIndex : localStepIndex

  const pathInfo = executionSteps ? getExecutionPath(executionSteps) : null
  const totalSteps = pathInfo?.totalSteps ?? 0
  const failureIndex = pathInfo?.failureIndex ?? null
  const currentStep = executionSteps ? executionSteps[effectiveStepIndex] ?? null : null
  const atFailure = isAtFailurePoint(effectiveStepIndex, failureIndex)
  const canGoForward = canStepForward(effectiveStepIndex, totalSteps)
  const canGoBack = canStepBackward(effectiveStepIndex)

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }, [])

  const startAutoPlay = useCallback(() => {
    stopAutoPlay()
    togglePlay()
  }, [stopAutoPlay, togglePlay])

  useEffect(() => {
    if (!isPlaying || !executionSteps) {
      stopAutoPlay()
      return
    }

    autoPlayRef.current = setInterval(() => {
      const state = useCanvasStore.getState()
      const idx = stepThroughActive ? state.currentStepIndex : localStepIndex
      const fIdx = getExecutionPath(executionSteps).failureIndex

      if (isAtFailurePoint(idx, fIdx) || !canStepForward(idx, executionSteps.length)) {
        if (stepThroughActive) {
          togglePlay()
        } else {
          stopAutoPlay()
        }
        return
      }

      if (stepThroughActive) {
        nextStep()
      } else {
        setLocalStepIndex((prev) => prev + 1)
      }
    }, AUTO_PLAY_INTERVAL_MS)

    return () => {
      stopAutoPlay()
    }
  }, [isPlaying, executionSteps, stepThroughActive, localStepIndex, nextStep, togglePlay, stopAutoPlay])

  useEffect(() => {
    if (!stepThroughActive && executionSteps && executionSteps.length > 0) {
      setLocalStepIndex(0)
    }
  }, [stepThroughActive, executionSteps])

  if (testStatus !== 'error' && !stepThroughActive) {
    return null
  }

  if (testStatus !== 'error' && testStatus !== 'success') {
    return null
  }

  if (!executionSteps || executionSteps.length === 0) {
    return null
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAutoPlay()
      togglePlay()
    } else {
      if (atFailure) {
        resetSteps()
        if (!stepThroughActive) setLocalStepIndex(0)
      }
      startAutoPlay()
    }
  }

  const handleStepForward = () => {
    stopAutoPlay()
    if (isPlaying) togglePlay()
    if (canGoForward) {
      if (stepThroughActive) {
        nextStep()
      } else {
        setLocalStepIndex((prev) => prev + 1)
      }
    }
  }

  const handleStepBack = () => {
    stopAutoPlay()
    if (isPlaying) togglePlay()
    if (canGoBack) {
      if (stepThroughActive) {
        previousStep()
      } else {
        setLocalStepIndex((prev) => prev - 1)
      }
    }
  }

  const handleReset = () => {
    stopAutoPlay()
    if (isPlaying) togglePlay()
    if (stepThroughActive) {
      resetSteps()
    } else {
      setLocalStepIndex(0)
    }
  }

  return (
    <Panel position="bottom-center" className="!left-1/2 !-translate-x-1/2 !translate-y-0 w-auto max-w-md">
      <div
        role="region"
        aria-label="Step-through execution controls"
        aria-live="polite"
        className="flex flex-col gap-2 rounded-xl border border-[#334155] bg-[#1E293B] p-3 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleStepBack}
              disabled={!canGoBack}
              className="rounded-md bg-[#334155] p-2 text-[#94A3B8] hover:bg-[#475569] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Step back"
            >
              <StepBack className="h-4 w-4" />
            </button>
            <button
              onClick={handlePlayPause}
              className={`rounded-md p-2 transition-colors ${
                atFailure && !isPlaying
                  ? 'bg-[#F43F5E] text-white hover:bg-[#E11D48]'
                  : 'bg-[#6366F1] text-white hover:bg-[#4F46E5]'
              }`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={handleStepForward}
              disabled={!canGoForward}
              className="rounded-md bg-[#334155] p-2 text-[#94A3B8] hover:bg-[#475569] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Step forward"
            >
              <StepForward className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="rounded-md bg-[#334155] p-2 text-[#94A3B8] hover:bg-[#475569] hover:text-white transition-colors"
              aria-label="Reset to start"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {atFailure && (
              <span className="text-xs font-medium text-rose-400">Failure point</span>
            )}
            <span className="font-mono text-xs text-[#94A3B8]">
              {effectiveStepIndex + 1}/{totalSteps}
            </span>
          </div>
        </div>

        <StepDescription
          step={currentStep}
          stepIndex={effectiveStepIndex}
          totalSteps={totalSteps}
          isAtFailure={atFailure}
          testResults={testResults}
        />
      </div>

      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {currentStep
          ? atFailure
            ? `Step ${effectiveStepIndex + 1}: ${currentStep.blockType} — failed. ${currentStep.errorMessage ?? ''}`
            : `Step ${effectiveStepIndex + 1}: ${currentStep.blockType} — ${currentStep.status === 'success' ? 'passed' : 'executing'}`
          : ''}
        {isPlaying ? ' Auto-playing execution steps' : ''}
      </div>
    </Panel>
  )
}