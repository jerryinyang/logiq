import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanvasToolbar } from './CanvasToolbar'
import { ReactFlowProvider } from '@xyflow/react'

vi.mock('@/actions/challenge-actions', () => ({
  submitSolution: vi.fn().mockResolvedValue({ success: true, data: { steps: [], results: [], summary: { total: 0, passed: 0, failed: 0, duration: 0 } } }),
  validateAndSerializeFlow: vi.fn().mockResolvedValue({ success: true, data: [] }),
}))

vi.mock('@/lib/execution/serializer', () => ({
  serializeCanvasState: vi.fn().mockReturnValue({ success: true, data: [] }),
}))

vi.mock('@/stores/canvas-store', () => {
  const state = {
    nodes: [],
    edges: [],
    setNodes: vi.fn(),
    setEdges: vi.fn(),
    addBlock: vi.fn(),
    addEdge: vi.fn(),
    removeEdge: vi.fn(),
    validateConnection: vi.fn(() => ({ valid: true })),
    getBlockGraph: vi.fn(() => ({ nodes: [], edges: [] })),
    setLastValidationError: vi.fn(),
    setSelectedBlockIds: vi.fn(),
    removeBlock: vi.fn(),
    duplicateBlock: vi.fn(),
    removeBlocks: vi.fn(),
    pushHistory: vi.fn(),
    lastValidationError: null,
    canUndo: false,
    canRedo: false,
    undo: vi.fn(),
    redo: vi.fn(),
    selectedBlockIds: [],
    testStatus: 'idle' as const,
    testResults: null,
    executionSteps: null,
    setTestStatus: vi.fn(),
    setTestResults: vi.fn(),
    setExecutionSteps: vi.fn(),
    resetTest: vi.fn(),
  }
  return {
    useCanvasStore: (selector?: any) => selector ? selector(state) : state,
  }
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('CanvasToolbar', () => {
  it('renders undo and redo buttons', () => {
    renderWithProvider(<CanvasToolbar />)
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument()
  })

  it('disables undo button when history is empty', () => {
    renderWithProvider(<CanvasToolbar />)
    const undoButton = screen.getByRole('button', { name: /undo/i })
    expect(undoButton).toBeDisabled()
  })

  it('disables redo button when no redo available', () => {
    renderWithProvider(<CanvasToolbar />)
    const redoButton = screen.getByRole('button', { name: /redo/i })
    expect(redoButton).toBeDisabled()
  })

  it('renders Test button', () => {
    renderWithProvider(<CanvasToolbar />)
    expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument()
  })
})