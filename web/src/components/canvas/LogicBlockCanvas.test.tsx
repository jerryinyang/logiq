import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogicBlockCanvas } from './LogicBlockCanvas'

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual<typeof import('@xyflow/react')>('@xyflow/react')
  return {
    ...actual,
    ReactFlow: ({ children }: any) => (
      <div data-testid="react-flow">
        {children}
      </div>
    ),
    ReactFlowProvider: ({ children }: any) => <div data-testid="react-flow-provider">{children}</div>,
    Background: () => <div data-testid="background" />,
    Panel: ({ children }: any) => <div data-testid="panel">{children}</div>,
    Controls: () => <div data-testid="controls" />,
    useReactFlow: () => ({
      screenToFlowPosition: (pos: { x: number; y: number }) => pos,
    }),
    SelectionMode: { Partial: 1 },
  }
})

vi.mock('./CanvasToolbar', () => ({
  CanvasToolbar: () => <div data-testid="canvas-toolbar" />,
}))

vi.mock('./CanvasEmptyState', () => ({
  CanvasEmptyState: () => <div data-testid="canvas-empty-state" />,
}))

vi.mock('./LogicBlockNode', () => ({
  LogicBlockNode: () => <div data-testid="logic-block-node" />,
}))

vi.mock('@/hooks/use-canvas-keyboard', () => ({
  useCanvasKeyboard: () => ({ handleKeyDown: vi.fn() }),
}))

vi.mock('@/hooks/use-canvas-announcer', () => ({
  useCanvasAnnouncer: () => ({
    announceConnection: vi.fn(),
    announceRejection: vi.fn(),
    announceCycleRejection: vi.fn(),
    announceDirectionError: vi.fn(),
    announceFlow: vi.fn(),
    announce: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
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
  }
  return {
    useCanvasStore: (selector?: any) => selector ? selector(state) : state,
  }
})

describe('LogicBlockCanvas', () => {
  it('renders within ReactFlowProvider', () => {
    render(<LogicBlockCanvas />)
    expect(screen.getByTestId('react-flow-provider')).toBeInTheDocument()
  })

  it('renders ReactFlow canvas', () => {
    render(<LogicBlockCanvas />)
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
  })

  it('renders background', () => {
    render(<LogicBlockCanvas />)
    expect(screen.getByTestId('background')).toBeInTheDocument()
  })

  it('renders toolbar', () => {
    render(<LogicBlockCanvas />)
    expect(screen.getByTestId('canvas-toolbar')).toBeInTheDocument()
  })

  it('renders empty state when no nodes', () => {
    render(<LogicBlockCanvas />)
    expect(screen.getByTestId('canvas-empty-state')).toBeInTheDocument()
  })

  it('has correct aria label', () => {
    render(<LogicBlockCanvas />)
    const canvas = screen.getByRole('application')
    expect(canvas).toHaveAttribute('aria-label', 'Logic Block Canvas — interactive workspace')
  })
})