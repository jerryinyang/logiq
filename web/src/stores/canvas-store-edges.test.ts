import { describe, it, expect, beforeEach } from 'vitest'
import { useCanvasStore } from './canvas-store'

describe('canvas-store edge management', () => {
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

  describe('addEdge', () => {
    it('adds an edge to the canvas', () => {
      addTestNodes()
      const { addEdge } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      expect(useCanvasStore.getState().edges).toHaveLength(1)
      expect(useCanvasStore.getState().edges[0].id).toBe('e1')
    })

    it('clears lastValidationError on add', () => {
      useCanvasStore.setState({ lastValidationError: 'some error' })
      addTestNodes()
      const { addEdge } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      expect(useCanvasStore.getState().lastValidationError).toBeNull()
    })

    it('pushes history before adding edge', () => {
      addTestNodes()
      const { addEdge } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      expect(useCanvasStore.getState().canUndo).toBe(true)
    })
  })

  describe('removeEdge', () => {
    it('removes an edge from the canvas', () => {
      addTestNodes()
      const { addEdge, removeEdge } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      expect(useCanvasStore.getState().edges).toHaveLength(1)
      removeEdge('e1')
      expect(useCanvasStore.getState().edges).toHaveLength(0)
    })

    it('does nothing for non-existent edge', () => {
      const { removeEdge } = useCanvasStore.getState()
      removeEdge('non-existent')
      expect(useCanvasStore.getState().edges).toHaveLength(0)
    })
  })

  describe('validateConnection', () => {
    it('validates a valid connection (loop → condition)', () => {
      addTestNodes()
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('loop-1', 'cond-1')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('rejects self-connection', () => {
      addTestNodes()
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('loop-1', 'loop-1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('self-connection')
    })

    it('rejects incompatible types (return → condition)', () => {
      const { addBlock } = useCanvasStore.getState()
      addBlock(
        { id: 'ret-1', type: 'return', label: 'Return', description: 'Return result', category: { type: 'return', label: 'Return', color: '#F43F5E' } },
        { x: 0, y: 0 }
      )
      addBlock(
        { id: 'cond-1', type: 'condition', label: 'If', description: 'If condition', category: { type: 'condition', label: 'Condition', color: '#F59E0B' } },
        { x: 100, y: 100 }
      )
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('ret-1', 'cond-1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('incompatible-types')
    })

    it('rejects wrong direction (source handle is target/input)', () => {
      addTestNodes()
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('loop-1', 'cond-1', 'target', 'target')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('wrong-direction')
    })

    it('rejects wrong direction (target handle is source/output)', () => {
      addTestNodes()
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('loop-1', 'cond-1', 'source', 'source')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('wrong-direction')
    })

    it('rejects duplicate input (target already has incoming connection)', () => {
      addTestNodes()
      const { addEdge, validateConnection } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      const result = validateConnection('assign-1', 'cond-1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('duplicate-input')
    })

    it('rejects cycle detection', () => {
      const { addBlock, addEdge, validateConnection } = useCanvasStore.getState()
      addBlock(
        { id: 'cond-1', type: 'condition', label: 'If', description: 'Test', category: { type: 'condition', label: 'Condition', color: '#F59E0B' } },
        { x: 0, y: 0 }
      )
      addBlock(
        { id: 'assign-1', type: 'assignment', label: 'Assign', description: 'Assign value', category: { type: 'assignment', label: 'Assignment', color: '#8B5CF6' } },
        { x: 100, y: 100 }
      )
      addBlock(
        { id: 'comp-1', type: 'comparison', label: 'Compare', description: 'Compare values', category: { type: 'comparison', label: 'Comparison', color: '#6366F1' } },
        { x: 200, y: 200 }
      )
      addEdge({ id: 'e1', source: 'cond-1', target: 'assign-1', type: 'blockConnection' })
      addEdge({ id: 'e2', source: 'assign-1', target: 'comp-1', type: 'blockConnection' })
      const result = validateConnection('comp-1', 'cond-1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('cycle-detected')
    })

    it('rejects missing source node', () => {
      addTestNodes()
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('non-existent', 'cond-1')
      expect(result.valid).toBe(false)
    })

    it('rejects missing target node', () => {
      addTestNodes()
      const { validateConnection } = useCanvasStore.getState()
      const result = validateConnection('loop-1', 'non-existent')
      expect(result.valid).toBe(false)
    })
  })

  describe('getBlockGraph', () => {
    it('returns current nodes and edges', () => {
      addTestNodes()
      const { addEdge, getBlockGraph } = useCanvasStore.getState()
      addEdge({ id: 'e1', source: 'loop-1', target: 'cond-1', type: 'blockConnection' })
      const graph = getBlockGraph()
      expect(graph.nodes).toHaveLength(3)
      expect(graph.edges).toHaveLength(1)
    })
  })

  describe('setLastValidationError', () => {
    it('sets validation error', () => {
      const { setLastValidationError } = useCanvasStore.getState()
      setLastValidationError('Cannot connect')
      expect(useCanvasStore.getState().lastValidationError).toBe('Cannot connect')
    })

    it('clears validation error', () => {
      useCanvasStore.setState({ lastValidationError: 'Cannot connect' })
      const { setLastValidationError } = useCanvasStore.getState()
      setLastValidationError(null)
      expect(useCanvasStore.getState().lastValidationError).toBeNull()
    })
  })
})