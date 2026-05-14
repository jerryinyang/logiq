import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBlockValidator } from './BlockValidator'
import { useCanvasStore } from '@/stores/canvas-store'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
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

describe('useBlockValidator', () => {
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
    })
  })

  function addTestNodes() {
    const { addBlock } = useCanvasStore.getState()
    addBlock(
      { id: 'loop-1', type: 'loop', label: 'For Each', description: 'Iterate', category: { type: 'loop', label: 'Loop', color: '#0EA5E9' } },
      { x: 0, y: 0 }
    )
    addBlock(
      { id: 'cond-1', type: 'condition', label: 'If Condition', description: 'Test', category: { type: 'condition', label: 'Condition', color: '#F59E0B' } },
      { x: 100, y: 100 }
    )
    addBlock(
      { id: 'assign-1', type: 'assignment', label: 'Assign', description: 'Assign value', category: { type: 'assignment', label: 'Assignment', color: '#8B5CF6' } },
      { x: 200, y: 200 }
    )
  }

  describe('isValidConnection', () => {
    it('returns true for a valid connection', () => {
      addTestNodes()
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: 'loop-1', target: 'cond-1', sourceHandle: null, targetHandle: null }
      let isValid = false
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(true)
    })

    it('returns false for self-connection', () => {
      addTestNodes()
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: 'loop-1', target: 'loop-1', sourceHandle: null, targetHandle: null }
      let isValid = true
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(false)
    })

    it('returns false for incompatible types', () => {
      const { addBlock } = useCanvasStore.getState()
      addBlock(
        { id: 'ret-1', type: 'return', label: 'Return', description: 'Return result', category: { type: 'return', label: 'Return', color: '#F43F5E' } },
        { x: 0, y: 0 }
      )
      addBlock(
        { id: 'cond-1', type: 'condition', label: 'If', description: 'Test', category: { type: 'condition', label: 'Condition', color: '#F59E0B' } },
        { x: 100, y: 100 }
      )
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: 'ret-1', target: 'cond-1', sourceHandle: null, targetHandle: null }
      let isValid = true
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(false)
    })

    it('returns false for wrong direction (source handle is target)', () => {
      addTestNodes()
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: 'loop-1', target: 'cond-1', sourceHandle: 'target' as any, targetHandle: null }
      let isValid = true
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(false)
    })

    it('returns false for duplicate input', () => {
      addTestNodes()
      const { addEdge } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: 'assign-1', target: 'cond-1', sourceHandle: null, targetHandle: null }
      let isValid = true
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(false)
    })

    it('returns false for missing source', () => {
      addTestNodes()
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: '', target: 'cond-1', sourceHandle: null, targetHandle: null }
      let isValid = true
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(false)
    })

    it('returns false for missing target', () => {
      addTestNodes()
      const { result } = renderHook(() => useBlockValidator())
      const connection = { source: 'loop-1', target: '', sourceHandle: null, targetHandle: null }
      let isValid = true
      act(() => {
        isValid = result.current.isValidConnection(connection)
      })
      expect(isValid).toBe(false)
    })
  })
})