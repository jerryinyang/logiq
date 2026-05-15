import { describe, it, expect } from 'vitest'
import {
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
  { stepIndex: 2, blockId: 'block-3', blockType: 'condition', input: true, output: true, status: 'success', duration: 1 },
  { stepIndex: 3, blockId: 'block-4', blockType: 'return', input: true, output: true, status: 'error', duration: 1, errorMessage: 'Expected true, got false' },
]

const mockStepsNoFailure: ExecutionStep[] = [
  { stepIndex: 0, blockId: 'block-1', blockType: 'variable', input: null, output: 5, status: 'success', duration: 1 },
  { stepIndex: 1, blockId: 'block-2', blockType: 'return', input: 5, output: 5, status: 'success', duration: 1 },
]

describe('step-tracker', () => {
  describe('getExecutionPath', () => {
    it('returns empty state for null/empty steps', () => {
      const result = getExecutionPath([])
      expect(result.currentIndex).toBe(-1)
      expect(result.totalSteps).toBe(0)
      expect(result.step).toBeNull()
      expect(result.hasNext).toBe(false)
      expect(result.hasPrevious).toBe(false)
      expect(result.failureIndex).toBeNull()
      expect(result.failureStep).toBeNull()
    })

    it('returns correct initial state for steps with failure', () => {
      const result = getExecutionPath(mockSteps)
      expect(result.currentIndex).toBe(0)
      expect(result.totalSteps).toBe(4)
      expect(result.step).toEqual(mockSteps[0])
      expect(result.hasNext).toBe(true)
      expect(result.hasPrevious).toBe(false)
      expect(result.failureIndex).toBe(3)
      expect(result.failureStep).toEqual(mockSteps[3])
    })

    it('returns null failure info when no failures', () => {
      const result = getExecutionPath(mockStepsNoFailure)
      expect(result.failureIndex).toBeNull()
      expect(result.failureStep).toBeNull()
    })

    it('returns single step state correctly', () => {
      const singleStep: ExecutionStep[] = [
        { stepIndex: 0, blockId: 'b1', blockType: 'return', input: 1, output: 1, status: 'success', duration: 0 },
      ]
      const result = getExecutionPath(singleStep)
      expect(result.currentIndex).toBe(0)
      expect(result.totalSteps).toBe(1)
      expect(result.hasNext).toBe(false)
      expect(result.hasPrevious).toBe(false)
    })
  })

  describe('getStepAtIndex', () => {
    it('returns step at valid index', () => {
      expect(getStepAtIndex(mockSteps, 0)).toEqual(mockSteps[0])
      expect(getStepAtIndex(mockSteps, 3)).toEqual(mockSteps[3])
    })

    it('returns null for out of bounds index', () => {
      expect(getStepAtIndex(mockSteps, -1)).toBeNull()
      expect(getStepAtIndex(mockSteps, 4)).toBeNull()
    })

    it('returns null for empty steps', () => {
      expect(getStepAtIndex([], 0)).toBeNull()
    })
  })

  describe('canStepForward', () => {
    it('returns true when not at end', () => {
      expect(canStepForward(0, 4)).toBe(true)
      expect(canStepForward(2, 4)).toBe(true)
    })

    it('returns false when at end', () => {
      expect(canStepForward(3, 4)).toBe(false)
    })

    it('returns false for empty steps', () => {
      expect(canStepForward(0, 0)).toBe(false)
    })
  })

  describe('canStepBackward', () => {
    it('returns true when not at start', () => {
      expect(canStepBackward(1)).toBe(true)
      expect(canStepBackward(3)).toBe(true)
    })

    it('returns false when at start', () => {
      expect(canStepBackward(0)).toBe(false)
    })
  })

  describe('isAtFailurePoint', () => {
    it('returns true when at failure index', () => {
      expect(isAtFailurePoint(3, 3)).toBe(true)
    })

    it('returns false when not at failure index', () => {
      expect(isAtFailurePoint(0, 3)).toBe(false)
      expect(isAtFailurePoint(2, 3)).toBe(false)
    })

    it('returns false when failure index is null', () => {
      expect(isAtFailurePoint(0, null)).toBe(false)
      expect(isAtFailurePoint(3, null)).toBe(false)
    })
  })

  describe('isAtEnd', () => {
    it('returns true when at last index', () => {
      expect(isAtEnd(3, 4)).toBe(true)
      expect(isAtEnd(0, 1)).toBe(true)
    })

    it('returns false when not at last index', () => {
      expect(isAtEnd(0, 4)).toBe(false)
      expect(isAtEnd(2, 4)).toBe(false)
    })
  })

  describe('isAtStart', () => {
    it('returns true when at index 0', () => {
      expect(isAtStart(0)).toBe(true)
    })

    it('returns false when not at index 0', () => {
      expect(isAtStart(1)).toBe(false)
      expect(isAtStart(3)).toBe(false)
    })
  })
})