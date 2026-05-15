import type { ExecutionStep } from '@/types/execution-types'

export interface StepTrackerState {
  currentIndex: number
  totalSteps: number
  step: ExecutionStep | null
  hasNext: boolean
  hasPrevious: boolean
  failureIndex: number | null
  failureStep: ExecutionStep | null
}

export function getExecutionPath(steps: ExecutionStep[]): StepTrackerState {
  if (!steps || steps.length === 0) {
    return {
      currentIndex: -1,
      totalSteps: 0,
      step: null,
      hasNext: false,
      hasPrevious: false,
      failureIndex: null,
      failureStep: null,
    }
  }

  const failureIndex = steps.findIndex((s) => s.status === 'error')

  return {
    currentIndex: 0,
    totalSteps: steps.length,
    step: steps[0],
    hasNext: steps.length > 1,
    hasPrevious: false,
    failureIndex: failureIndex >= 0 ? failureIndex : null,
    failureStep: failureIndex >= 0 ? steps[failureIndex] : null,
  }
}

export function getStepAtIndex(steps: ExecutionStep[], index: number): ExecutionStep | null {
  if (index < 0 || index >= steps.length) return null
  return steps[index]
}

export function canStepForward(currentIndex: number, totalSteps: number): boolean {
  return currentIndex < totalSteps - 1
}

export function canStepBackward(currentIndex: number): boolean {
  return currentIndex > 0
}

export function isAtFailurePoint(currentIndex: number, failureIndex: number | null): boolean {
  return failureIndex !== null && currentIndex === failureIndex
}

export function isAtEnd(currentIndex: number, totalSteps: number): boolean {
  return currentIndex === totalSteps - 1
}

export function isAtStart(currentIndex: number): boolean {
  return currentIndex === 0
}