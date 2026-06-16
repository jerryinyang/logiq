import type { ExecutionStep } from '@/types/execution-types'
import type { EdgeCaseType } from '@/types/canvas-types'

export interface StepTrackerState {
  currentIndex: number
  totalSteps: number
  step: ExecutionStep | null
  hasNext: boolean
  hasPrevious: boolean
  failureIndex: number | null
  failureStep: ExecutionStep | null
}

export interface EdgeCaseStepInfo {
  stepType: 'edgeCase'
  edgeCaseType: EdgeCaseType
  hit: boolean
  label: string
}

export function getEdgeCaseStepInfo(step: ExecutionStep): EdgeCaseStepInfo | null {
  if (step.blockType !== 'edgeCase' || !step.edgeCaseType) {
    return null
  }
  return {
    stepType: 'edgeCase',
    edgeCaseType: step.edgeCaseType,
    hit: step.edgeCaseHit ?? false,
    label: `Edge case ${step.edgeCaseType} — ${step.edgeCaseHit ? 'hit' : 'missed'}`,
  }
}

export function describeStepForScreenReader(step: ExecutionStep): string {
  const baseDescription = `Step ${step.stepIndex + 1}: ${step.blockType} block`

  if (step.blockType === 'edgeCase' && step.edgeCaseType) {
    const edgeInfo = getEdgeCaseStepInfo(step)
    if (edgeInfo) {
      return `Step ${step.stepIndex + 1}: ${edgeInfo.label}`
    }
  }

  return baseDescription
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

export function getEdgeCaseSteps(steps: ExecutionStep[]): ExecutionStep[] {
  return steps.filter((s) => s.blockType === 'edgeCase')
}

export function isEdgeCaseHitStep(step: ExecutionStep): boolean {
  return step.blockType === 'edgeCase' && step.edgeCaseHit === true
}

export function isEdgeCaseMissStep(step: ExecutionStep): boolean {
  return step.blockType === 'edgeCase' && step.edgeCaseHit === false
}