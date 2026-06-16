import { describe, it, expect, beforeEach } from 'vitest'
import { useCanvasStore } from './canvas-store'
import type { CanvasNode, CanvasEdge } from '@/types/canvas-types'
import type { TestResult, ExecutionStep } from '@/types/execution-types'

const mockNodes: CanvasNode[] = [
  { id: '1', type: 'condition', label: 'Test', position: { x: 0, y: 0 }, data: {} },
]
const mockEdges: CanvasEdge[] = [
  { id: 'e1', source: '1', target: '2' },
]

const mockTestResults: TestResult[] = [
  { testCaseId: 'tc-1', passed: true, input: [1, 2, 3], expected: [1, 2, 3], actual: [1, 2, 3] },
  { testCaseId: 'tc-2', passed: false, input: [3, 2, 1], expected: [1, 2, 3], actual: [3, 2, 1], errorStep: 1 },
]

const mockExecutionSteps: ExecutionStep[] = [
  { stepIndex: 0, blockId: 'block-1', blockType: 'variable', input: null, output: 5, status: 'success', duration: 1 },
  { stepIndex: 1, blockId: 'block-2', blockType: 'return', input: 5, output: 5, status: 'success', duration: 0 },
]

describe('canvas-store', () => {
  beforeEach(() => {
    const { historyManager } = useCanvasStore.getState()
    historyManager.clear()
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
      draftStatus: 'none',
      resetCount: 0,
    })
  })

  it('has initial state', () => {
    const state = useCanvasStore.getState()
    expect(state.zoom).toBe(1)
    expect(state.selectedBlockIds).toEqual([])
    expect(state.canUndo).toBe(false)
    expect(state.canRedo).toBe(false)
    expect(state.historyStack).toEqual([])
    expect(state.status).toBe('idle')
    expect(state.draftStatus).toBe('none')
    expect(state.resetCount).toBe(0)
  })

  it('sets zoom within bounds', () => {
    const { setZoom } = useCanvasStore.getState()
    setZoom(1.5)
    expect(useCanvasStore.getState().zoom).toBe(1.5)

    setZoom(3)
    expect(useCanvasStore.getState().zoom).toBe(2)

    setZoom(0.1)
    expect(useCanvasStore.getState().zoom).toBe(0.5)
  })

  it('sets viewport', () => {
    const { setViewport } = useCanvasStore.getState()
    const newViewport = { x: 100, y: 200, zoom: 1.5 }
    setViewport(newViewport)
    expect(useCanvasStore.getState().viewport).toEqual(newViewport)
  })

  it('sets selected block ids', () => {
    const { setSelectedBlockIds } = useCanvasStore.getState()
    setSelectedBlockIds(['1', '2'])
    expect(useCanvasStore.getState().selectedBlockIds).toEqual(['1', '2'])
  })

  it('pushes history entry', () => {
    const { pushHistory } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    const state = useCanvasStore.getState()
    expect(state.historyStack.length).toBe(1)
    expect(state.canUndo).toBe(false)
  })

  it('enables undo after multiple history entries', () => {
    const { pushHistory } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    pushHistory([], [])
    const state = useCanvasStore.getState()
    expect(state.canUndo).toBe(true)
  })

  it('undo restores previous state', () => {
    const { pushHistory, undo } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    pushHistory([], [])
    undo()
    const state = useCanvasStore.getState()
    expect(state.canRedo).toBe(true)
  })

  it('redo restores state after undo', () => {
    const { pushHistory, undo, redo } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    pushHistory([], [])
    undo()
    redo()
    const state = useCanvasStore.getState()
    expect(state.canRedo).toBe(false)
  })

  describe('test state management', () => {
    it('starts with idle test status', () => {
      expect(useCanvasStore.getState().testStatus).toBe('idle')
      expect(useCanvasStore.getState().testResults).toBeNull()
      expect(useCanvasStore.getState().executionSteps).toBeNull()
    })

    it('sets test status to running', () => {
      const { setTestStatus } = useCanvasStore.getState()
      setTestStatus('running')
      expect(useCanvasStore.getState().testStatus).toBe('running')
    })

    it('sets test status to success', () => {
      const { setTestStatus } = useCanvasStore.getState()
      setTestStatus('success')
      expect(useCanvasStore.getState().testStatus).toBe('success')
    })

    it('sets test status to error', () => {
      const { setTestStatus } = useCanvasStore.getState()
      setTestStatus('error')
      expect(useCanvasStore.getState().testStatus).toBe('error')
    })

    it('sets test results', () => {
      const { setTestResults } = useCanvasStore.getState()
      setTestResults(mockTestResults)
      expect(useCanvasStore.getState().testResults).toEqual(mockTestResults)
    })

    it('sets execution steps', () => {
      const { setExecutionSteps } = useCanvasStore.getState()
      setExecutionSteps(mockExecutionSteps)
      expect(useCanvasStore.getState().executionSteps).toEqual(mockExecutionSteps)
    })

    it('resets all test state', () => {
      const { setTestStatus, setTestResults, setExecutionSteps } = useCanvasStore.getState()
      setTestStatus('success')
      setTestResults(mockTestResults)
      setExecutionSteps(mockExecutionSteps)

      const { resetTest } = useCanvasStore.getState()
      resetTest()

      const state = useCanvasStore.getState()
      expect(state.testStatus).toBe('idle')
      expect(state.testResults).toBeNull()
      expect(state.executionSteps).toBeNull()
    })

    it('allows clearing test results independently', () => {
      const { setTestResults } = useCanvasStore.getState()
      setTestResults(mockTestResults)
      expect(useCanvasStore.getState().testResults).toEqual(mockTestResults)

      setTestResults(null)
      expect(useCanvasStore.getState().testResults).toBeNull()
    })

    it('allows clearing execution steps independently', () => {
      const { setExecutionSteps } = useCanvasStore.getState()
      setExecutionSteps(mockExecutionSteps)
      expect(useCanvasStore.getState().executionSteps).toEqual(mockExecutionSteps)

      setExecutionSteps(null)
      expect(useCanvasStore.getState().executionSteps).toBeNull()
    })
  })

  describe('step-through state management', () => {
    it('starts with step-through inactive', () => {
      const state = useCanvasStore.getState()
      expect(state.currentStepIndex).toBe(-1)
      expect(state.isPlaying).toBe(false)
      expect(state.stepThroughActive).toBe(false)
    })

    it('nextStep advances current step index', () => {
      useCanvasStore.setState({ executionSteps: mockExecutionSteps, currentStepIndex: 0 })
      const { nextStep } = useCanvasStore.getState()
      nextStep()
      expect(useCanvasStore.getState().currentStepIndex).toBe(1)
    })

    it('nextStep does not advance past last step', () => {
      useCanvasStore.setState({ executionSteps: mockExecutionSteps, currentStepIndex: 1 })
      const { nextStep } = useCanvasStore.getState()
      nextStep()
      expect(useCanvasStore.getState().currentStepIndex).toBe(1)
    })

    it('previousStep decreases current step index', () => {
      useCanvasStore.setState({ executionSteps: mockExecutionSteps, currentStepIndex: 1 })
      const { previousStep } = useCanvasStore.getState()
      previousStep()
      expect(useCanvasStore.getState().currentStepIndex).toBe(0)
    })

    it('previousStep does not decrease below 0', () => {
      useCanvasStore.setState({ executionSteps: mockExecutionSteps, currentStepIndex: 0 })
      const { previousStep } = useCanvasStore.getState()
      previousStep()
      expect(useCanvasStore.getState().currentStepIndex).toBe(0)
    })

    it('togglePlay toggles isPlaying', () => {
      const { togglePlay } = useCanvasStore.getState()
      togglePlay()
      expect(useCanvasStore.getState().isPlaying).toBe(true)
      togglePlay()
      expect(useCanvasStore.getState().isPlaying).toBe(false)
    })

    it('resetSteps resets to initial step and stops playing', () => {
      useCanvasStore.setState({ executionSteps: mockExecutionSteps, currentStepIndex: 1, isPlaying: true })
      const { resetSteps } = useCanvasStore.getState()
      resetSteps()
      expect(useCanvasStore.getState().currentStepIndex).toBe(0)
      expect(useCanvasStore.getState().isPlaying).toBe(false)
    })

    it('resetSteps sets currentStepIndex to -1 when no steps', () => {
      useCanvasStore.setState({ executionSteps: null, currentStepIndex: 2 })
      const { resetSteps } = useCanvasStore.getState()
      resetSteps()
      expect(useCanvasStore.getState().currentStepIndex).toBe(-1)
    })

    it('setStepThroughActive activates and resets step index', () => {
      useCanvasStore.setState({ executionSteps: mockExecutionSteps })
      const { setStepThroughActive } = useCanvasStore.getState()
      setStepThroughActive(true)
      expect(useCanvasStore.getState().stepThroughActive).toBe(true)
      expect(useCanvasStore.getState().currentStepIndex).toBe(0)
      expect(useCanvasStore.getState().isPlaying).toBe(false)
    })

    it('setStepThroughActive deactivates and stops playing', () => {
      useCanvasStore.setState({ isPlaying: true, stepThroughActive: true })
      const { setStepThroughActive } = useCanvasStore.getState()
      setStepThroughActive(false)
      expect(useCanvasStore.getState().stepThroughActive).toBe(false)
      expect(useCanvasStore.getState().isPlaying).toBe(false)
    })

    it('setExecutionSteps resets step index and stops playing', () => {
      useCanvasStore.setState({ currentStepIndex: 3, isPlaying: true })
      const { setExecutionSteps } = useCanvasStore.getState()
      setExecutionSteps(mockExecutionSteps)
      expect(useCanvasStore.getState().currentStepIndex).toBe(0)
      expect(useCanvasStore.getState().isPlaying).toBe(false)
    })

    it('resetTest resets all step-through state', () => {
      useCanvasStore.setState({
        testStatus: 'error',
        testResults: mockTestResults,
        executionSteps: mockExecutionSteps,
        currentStepIndex: 1,
        isPlaying: true,
        stepThroughActive: true,
      })
      const { resetTest } = useCanvasStore.getState()
      resetTest()
      const state = useCanvasStore.getState()
      expect(state.testStatus).toBe('idle')
      expect(state.testResults).toBeNull()
      expect(state.executionSteps).toBeNull()
      expect(state.currentStepIndex).toBe(-1)
      expect(state.isPlaying).toBe(false)
      expect(state.stepThroughActive).toBe(false)
    })
  })

  describe('resetCanvas', () => {
    it('clears all canvas state', () => {
      const { pushHistory, setNodes, setEdges } = useCanvasStore.getState()
      pushHistory(mockNodes, mockEdges)
      pushHistory([], [])
      setNodes(mockNodes)
      setEdges(mockEdges)

      const { resetCanvas } = useCanvasStore.getState()
      resetCanvas()

      const state = useCanvasStore.getState()
      expect(state.nodes).toEqual([])
      expect(state.edges).toEqual([])
      expect(state.selectedBlockIds).toEqual([])
      expect(state.canUndo).toBe(false)
      expect(state.canRedo).toBe(false)
      expect(state.testStatus).toBe('idle')
      expect(state.draftStatus).toBe('none')
    })

    it('increments resetCount', () => {
      const { resetCanvas } = useCanvasStore.getState()
      resetCanvas()
      expect(useCanvasStore.getState().resetCount).toBe(1)
      resetCanvas()
      expect(useCanvasStore.getState().resetCount).toBe(2)
    })
  })

  describe('draftStatus', () => {
    it('initializes to none', () => {
      expect(useCanvasStore.getState().draftStatus).toBe('none')
    })

    it('setDraftStatus updates state', () => {
      const { setDraftStatus } = useCanvasStore.getState()
      setDraftStatus('restoring')
      expect(useCanvasStore.getState().draftStatus).toBe('restoring')

      setDraftStatus('restored')
      expect(useCanvasStore.getState().draftStatus).toBe('restored')

      setDraftStatus('saved')
      expect(useCanvasStore.getState().draftStatus).toBe('saved')
    })
  })
})