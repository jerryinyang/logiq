import { describe, it, expect } from 'vitest'
import {
  getEdgeCaseStepInfo,
  describeStepForScreenReader,
  getEdgeCaseSteps,
  isEdgeCaseHitStep,
  isEdgeCaseMissStep,
  getExecutionPath,
  getStepAtIndex,
  canStepForward,
  canStepBackward,
  isAtFailurePoint,
  isAtEnd,
  isAtStart,
} from './step-tracker'
import type { ExecutionStep } from '@/types/execution-types'

const mockSteps: ExecutionStep[] = [
  { stepIndex: 0, blockId: 'block-1', blockType: 'variable', input: null, output: 5, status: 'success', duration: 1 },
  { stepIndex: 1, blockId: 'block-2', blockType: 'comparison', input: { left: 5, right: 3 }, output: true, status: 'success', duration: 1 },
  { stepIndex: 2, blockId: 'block-3', blockType: 'edgeCase', input: [], output: true, status: 'success', duration: 1, edgeCaseDetected: true, edgeCaseType: 'emptyInput', edgeCaseHit: true },
  { stepIndex: 3, blockId: 'block-4', blockType: 'return', input: 5, output: true, status: 'error', duration: 1, errorMessage: 'Expected true, got false' },
]

describe('step-tracker edge case functions', () => {
  describe('getEdgeCaseStepInfo', () => {
    it('returns edge case info for edge case steps', () => {
      const step = mockSteps[2]
      const info = getEdgeCaseStepInfo(step)
      expect(info).toEqual({
        stepType: 'edgeCase',
        edgeCaseType: 'emptyInput',
        hit: true,
        label: 'Edge case emptyInput — hit',
      })
    })

    it('returns null for non-edge case steps', () => {
      const step = mockSteps[0]
      const info = getEdgeCaseStepInfo(step)
      expect(info).toBeNull()
    })

    it('returns null when edgeCaseType is missing', () => {
      const step: ExecutionStep = { stepIndex: 0, blockId: 'b1', blockType: 'comparison', input: null, output: true, status: 'success', duration: 1 }
      const info = getEdgeCaseStepInfo(step)
      expect(info).toBeNull()
    })

    it('handles hit=false', () => {
      const step: ExecutionStep = { stepIndex: 0, blockId: 'b1', blockType: 'edgeCase', input: [1, 2, 3], output: false, status: 'success', duration: 1, edgeCaseDetected: true, edgeCaseType: 'emptyInput', edgeCaseHit: false }
      const info = getEdgeCaseStepInfo(step)
      expect(info?.hit).toBe(false)
      expect(info?.label).toBe('Edge case emptyInput — missed')
    })
  })

  describe('describeStepForScreenReader', () => {
    it('describes edge case hit steps', () => {
      const step = mockSteps[2]
      expect(describeStepForScreenReader(step)).toBe('Step 3: Edge case emptyInput — hit')
    })

    it('describes edge case miss steps', () => {
      const step: ExecutionStep = { stepIndex: 0, blockId: 'b1', blockType: 'edgeCase', input: [1], output: false, status: 'success', duration: 1, edgeCaseDetected: true, edgeCaseType: 'duplicates', edgeCaseHit: false }
      expect(describeStepForScreenReader(step)).toBe('Step 1: Edge case duplicates — missed')
    })

    it('describes non-edge case steps', () => {
      const step = mockSteps[0]
      expect(describeStepForScreenReader(step)).toBe('Step 1: variable block')
    })
  })

  describe('getEdgeCaseSteps', () => {
    it('filters for edge case steps only', () => {
      const steps = getEdgeCaseSteps(mockSteps)
      expect(steps).toHaveLength(1)
      expect(steps[0].blockId).toBe('block-3')
    })

    it('returns empty when no edge case steps', () => {
      const steps = getEdgeCaseSteps(mockSteps.filter((s) => s.blockType !== 'edgeCase'))
      expect(steps).toHaveLength(0)
    })
  })

  describe('isEdgeCaseHitStep', () => {
    it('returns true for edge case hit step', () => {
      expect(isEdgeCaseHitStep(mockSteps[2])).toBe(true)
    })

    it('returns false for non-edge case step', () => {
      expect(isEdgeCaseHitStep(mockSteps[0])).toBe(false)
    })

    it('returns false for edge case miss step', () => {
      const step: ExecutionStep = { stepIndex: 0, blockId: 'b1', blockType: 'edgeCase', input: [1], output: false, status: 'success', duration: 1, edgeCaseDetected: true, edgeCaseType: 'emptyInput', edgeCaseHit: false }
      expect(isEdgeCaseHitStep(step)).toBe(false)
    })
  })

  describe('isEdgeCaseMissStep', () => {
    it('returns true for edge case miss step', () => {
      const step: ExecutionStep = { stepIndex: 0, blockId: 'b1', blockType: 'edgeCase', input: [1], output: false, status: 'success', duration: 1, edgeCaseDetected: true, edgeCaseType: 'emptyInput', edgeCaseHit: false }
      expect(isEdgeCaseMissStep(step)).toBe(true)
    })

    it('returns false for edge case hit step', () => {
      expect(isEdgeCaseMissStep(mockSteps[2])).toBe(false)
    })

    it('returns false for non-edge case step', () => {
      expect(isEdgeCaseMissStep(mockSteps[0])).toBe(false)
    })
  })

  describe('existing step-tracker functions still work', () => {
    it('getExecutionPath handles edge case steps', () => {
      const result = getExecutionPath(mockSteps)
      expect(result.totalSteps).toBe(4)
      expect(result.failureIndex).toBe(3)
    })

    it('getStepAtIndex returns edge case step', () => {
      const step = getStepAtIndex(mockSteps, 2)
      expect(step?.blockType).toBe('edgeCase')
      expect(step?.edgeCaseType).toBe('emptyInput')
      expect(step?.edgeCaseHit).toBe(true)
    })

    it('canStepForward works', () => {
      expect(canStepForward(0, 4)).toBe(true)
      expect(canStepForward(3, 4)).toBe(false)
    })

    it('canStepBackward works', () => {
      expect(canStepBackward(1)).toBe(true)
      expect(canStepBackward(0)).toBe(false)
    })

    it('isAtFailurePoint works', () => {
      expect(isAtFailurePoint(3, 3)).toBe(true)
      expect(isAtFailurePoint(0, 3)).toBe(false)
    })

    it('isAtEnd works', () => {
      expect(isAtEnd(3, 4)).toBe(true)
      expect(isAtEnd(0, 4)).toBe(false)
    })

    it('isAtStart works', () => {
      expect(isAtStart(0)).toBe(true)
      expect(isAtStart(1)).toBe(false)
    })
  })
})