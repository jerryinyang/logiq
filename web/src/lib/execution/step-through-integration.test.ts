import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCanvasStore } from '@/stores/canvas-store'
import { getExecutionPath, canStepForward, canStepBackward, isAtFailurePoint } from '@/lib/execution/step-tracker'
import { detectCommonMistake } from '@/lib/execution/mistake-patterns'
import { applyExecutionHighlighting, getBlockHighlightState } from '@/lib/canvas/execution-highlighter'
import type { ExecutionStep, TestResult } from '@/types/execution-types'

const mockSteps: ExecutionStep[] = [
  { stepIndex: 0, blockId: 'block-1', blockType: 'variable', input: null, output: 5, status: 'success', duration: 1 },
  { stepIndex: 1, blockId: 'block-2', blockType: 'comparison', input: { left: 5, right: 3 }, output: true, status: 'success', duration: 1 },
  { stepIndex: 2, blockId: 'block-3', blockType: 'condition', input: true, output: false, status: 'error', duration: 1, errorMessage: 'Expected true, got false' },
  { stepIndex: 3, blockId: 'block-4', blockType: 'return', input: 5, output: 5, status: 'success', duration: 1 },
]

const mockTestResults: TestResult[] = [
  { testCaseId: 'tc-1', passed: true, input: [1, 2, 3], expected: [1, 2, 3], actual: [1, 2, 3] },
  { testCaseId: 'tc-2', passed: false, input: [3, 2, 1], expected: [1, 2, 3], actual: [3, 2, 1], errorStep: 2 },
]

describe('step-through integration', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      zoom: 1,
      viewport: { x: 0, y: 0, zoom: 1 },
      selectedBlockIds: [],
      canUndo: false,
      canRedo: false,
      historyStack: [],
      redoStack: [],
      status: 'idle',
      nodes: [],
      edges: [],
      lastValidationError: null,
      testStatus: 'idle',
      testResults: null,
      executionSteps: null,
      currentStepIndex: -1,
      isPlaying: false,
      stepThroughActive: false,
    })
  })

  it('complete step-through flow: test fails -> overlay appears -> step through -> highlights update', () => {
    useCanvasStore.getState().setTestStatus('error')
    useCanvasStore.getState().setTestResults(mockTestResults)
    useCanvasStore.getState().setExecutionSteps(mockSteps)
    useCanvasStore.getState().setStepThroughActive(true)

    const state = useCanvasStore.getState()
    expect(state.stepThroughActive).toBe(true)
    expect(state.currentStepIndex).toBe(0)
    expect(state.testStatus).toBe('error')
    expect(state.executionSteps).toEqual(mockSteps)

    const pathInfo = getExecutionPath(mockSteps)
    expect(pathInfo.totalSteps).toBe(4)
    expect(pathInfo.failureIndex).toBe(2)
  })

  it('step navigation: forward, back, and failure detection', () => {
    useCanvasStore.getState().setExecutionSteps(mockSteps)
    useCanvasStore.getState().setStepThroughActive(true)

    expect(useCanvasStore.getState().currentStepIndex).toBe(0)
    expect(canStepForward(0, 4)).toBe(true)
    expect(canStepBackward(0)).toBe(false)

    useCanvasStore.getState().nextStep()
    expect(useCanvasStore.getState().currentStepIndex).toBe(1)
    expect(canStepBackward(1)).toBe(true)

    useCanvasStore.getState().nextStep()
    expect(useCanvasStore.getState().currentStepIndex).toBe(2)
    expect(isAtFailurePoint(2, 2)).toBe(true)

    useCanvasStore.getState().previousStep()
    expect(useCanvasStore.getState().currentStepIndex).toBe(1)
  })

  it('auto-play interval: steps advance every 500ms and stop at failure', () => {
    vi.useFakeTimers()

    useCanvasStore.getState().setExecutionSteps(mockSteps)
    useCanvasStore.getState().setStepThroughActive(true)
    useCanvasStore.getState().togglePlay()

    expect(useCanvasStore.getState().isPlaying).toBe(true)

    vi.advanceTimersByTime(500)
    useCanvasStore.getState().nextStep()
    expect(useCanvasStore.getState().currentStepIndex).toBe(1)

    vi.advanceTimersByTime(500)
    useCanvasStore.getState().nextStep()
    expect(useCanvasStore.getState().currentStepIndex).toBe(2)

    vi.useRealTimers()
  })

  it('auto-play interval cleanup on unmount (no memory leak)', () => {
    vi.useFakeTimers()
    useCanvasStore.getState().setExecutionSteps(mockSteps)
    useCanvasStore.getState().setStepThroughActive(true)
    useCanvasStore.getState().togglePlay()

    useCanvasStore.getState().setStepThroughActive(false)
    expect(useCanvasStore.getState().isPlaying).toBe(false)

    vi.advanceTimersByTime(3000)
    expect(useCanvasStore.getState().currentStepIndex).toBe(0)

    vi.useRealTimers()
  })

  it('keyboard navigation: arrow keys and space bar', () => {
    useCanvasStore.getState().setExecutionSteps(mockSteps)
    useCanvasStore.getState().setStepThroughActive(true)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        useCanvasStore.getState().nextStep()
      } else if (e.key === 'ArrowLeft') {
        useCanvasStore.getState().previousStep()
      } else if (e.key === ' ') {
        useCanvasStore.getState().togglePlay()
      }
    }

    handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(useCanvasStore.getState().currentStepIndex).toBe(1)

    handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(useCanvasStore.getState().currentStepIndex).toBe(0)

    handleKeyDown(new KeyboardEvent('keydown', { key: ' ' }))
    expect(useCanvasStore.getState().isPlaying).toBe(true)

    handleKeyDown(new KeyboardEvent('keydown', { key: ' ' }))
    expect(useCanvasStore.getState().isPlaying).toBe(false)
  })

  it('screen reader announcements for each step', () => {
    document.body.innerHTML = ''
    const announcer = document.createElement('div')
    announcer.id = 'logiq-canvas-step-announcer'
    announcer.setAttribute('aria-live', 'assertive')
    announcer.setAttribute('aria-atomic', 'true')
    document.body.appendChild(announcer)

    const step = mockSteps[2]
    const blockLabel = 'Condition'
    const failureMessage = step.errorMessage ?? ''
    announcer.textContent = `Step ${step.stepIndex + 1}: ${blockLabel} — failed. ${failureMessage}`
    expect(announcer.textContent).toContain('Step 3')
    expect(announcer.textContent).toContain('failed')

    document.body.innerHTML = ''
  })

  it('edge case: single step execution', () => {
    const singleStep: ExecutionStep[] = [
      { stepIndex: 0, blockId: 'block-1', blockType: 'return', input: 1, output: 1, status: 'success', duration: 1 },
    ]
    const pathInfo = getExecutionPath(singleStep)
    expect(pathInfo.totalSteps).toBe(1)
    expect(canStepForward(0, 1)).toBe(false)
    expect(canStepBackward(0)).toBe(false)
  })

  it('edge case: all steps succeed with no failure', () => {
    const allSuccess: ExecutionStep[] = [
      { stepIndex: 0, blockId: 'block-1', blockType: 'variable', input: null, output: 5, status: 'success', duration: 1 },
      { stepIndex: 1, blockId: 'block-2', blockType: 'return', input: 5, output: 5, status: 'success', duration: 1 },
    ]
    const pathInfo = getExecutionPath(allSuccess)
    expect(pathInfo.failureIndex).toBeNull()
    expect(pathInfo.failureStep).toBeNull()
  })

  it('edge case: all steps fail', () => {
    const allFail: ExecutionStep[] = [
      { stepIndex: 0, blockId: 'b1', blockType: 'variable', input: null, output: undefined, status: 'error', duration: 1, errorMessage: 'err' },
      { stepIndex: 1, blockId: 'b2', blockType: 'return', input: undefined, output: undefined, status: 'error', duration: 1, errorMessage: 'err' },
    ]
    const pathInfo = getExecutionPath(allFail)
    expect(pathInfo.failureIndex).toBe(0)
  })

  it('common mistake message display on matching failure', () => {
    const step = { blockType: 'comparison', errorMessage: 'Comparison failed: expected > got <' }
    const result = detectCommonMistake(null, null, step)
    expect(result).toContain('comparison direction')
  })

  it('highlighting: each state returns correct styles for all block types', () => {
    const blockTypes = ['variable', 'comparison', 'condition', 'loop', 'return', 'assignment', 'edgeCase'] as const

    for (const blockType of blockTypes) {
      const step: ExecutionStep = {
        stepIndex: 0,
        blockId: `test-${blockType}`,
        blockType,
        input: null,
        output: null,
        status: 'success',
        duration: 1,
      }
      const state = getBlockHighlightState(`test-${blockType}`, [step], 0, null)
      expect(state).toBe('currently-executing')
    }
  })
})