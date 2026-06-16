import { describe, it, expect, beforeEach } from 'vitest'
import { useCanvasStore } from './canvas-store'

describe('canvas-store block management', () => {
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
    })
  })

  describe('addBlock', () => {
    it('adds a block to the canvas', () => {
      const { addBlock } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-1',
          type: 'loop',
          label: 'For Each Item',
          description: 'Iterate over each item',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        },
        { x: 100, y: 200 }
      )
      const state = useCanvasStore.getState()
      expect(state.nodes).toHaveLength(1)
      expect(state.nodes[0].id).toBe('block-1')
      expect(state.nodes[0].type).toBe('logicBlock')
      expect(state.nodes[0].position).toEqual({ x: 96, y: 208 })
    })

    it('snaps position to 16px grid', () => {
      const { addBlock } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-2',
          type: 'condition',
          label: 'If Condition',
          description: 'Test condition',
          category: { type: 'condition', label: 'Condition', color: '#F59E0B' },
        },
        { x: 37, y: 53 }
      )
      const state = useCanvasStore.getState()
      expect(state.nodes[0].position.x).toBe(32)
      expect(state.nodes[0].position.y).toBe(48)
    })

    it('pushes history before adding block', () => {
      const { addBlock } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-1',
          type: 'loop',
          label: 'For Each Item',
          description: 'Iterate',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        },
        { x: 0, y: 0 }
      )
      const state = useCanvasStore.getState()
      expect(state.canUndo).toBe(true)
    })
  })

  describe('removeBlock', () => {
    it('removes a block from the canvas', () => {
      const { addBlock, removeBlock } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-1',
          type: 'loop',
          label: 'For Each Item',
          description: 'Iterate',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        },
        { x: 0, y: 0 }
      )
      expect(useCanvasStore.getState().nodes).toHaveLength(1)
      removeBlock('block-1')
      expect(useCanvasStore.getState().nodes).toHaveLength(0)
    })

    it('removes connected edges when removing a block', () => {
      const { setNodes, setEdges, removeBlock } = useCanvasStore.getState()
      setNodes([{ id: 'block-1', type: 'logicBlock', position: { x: 0, y: 0 }, data: {} } as any])
      setEdges([{ id: 'e1', source: 'block-1', target: 'block-2' } as any])
      removeBlock('block-1')
      const state = useCanvasStore.getState()
      expect(state.edges).toHaveLength(0)
    })

    it('removes block from selectedBlockIds', () => {
      const { addBlock, setSelectedBlockIds, removeBlock } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-1',
          type: 'loop',
          label: 'For Each Item',
          description: 'Iterate',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        },
        { x: 0, y: 0 }
      )
      setSelectedBlockIds(['block-1'])
      removeBlock('block-1')
      expect(useCanvasStore.getState().selectedBlockIds).toEqual([])
    })
  })

  describe('duplicateBlock', () => {
    it('duplicates a block with offset position', () => {
      const { addBlock, duplicateBlock } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-1',
          type: 'loop',
          label: 'For Each Item',
          description: 'Iterate',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        },
        { x: 128, y: 64 }
      )
      duplicateBlock('block-1')
      const state = useCanvasStore.getState()
      expect(state.nodes).toHaveLength(2)
      const original = state.nodes.find((n) => n.id === 'block-1')
      const duplicate = state.nodes.find((n) => n.id !== 'block-1')
      expect(duplicate).toBeDefined()
      expect(duplicate!.position.x).toBeGreaterThan(original!.position.x)
    })

    it('does nothing if block id not found', () => {
      const { duplicateBlock } = useCanvasStore.getState()
      duplicateBlock('non-existent')
      expect(useCanvasStore.getState().nodes).toHaveLength(0)
    })
  })

  describe('getBlocksByCategory', () => {
    it('returns blocks filtered by category', () => {
      const { addBlock, getBlocksByCategory } = useCanvasStore.getState()
      addBlock(
        {
          id: 'block-1',
          type: 'loop',
          label: 'For Each Item',
          description: 'Iterate',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        },
        { x: 0, y: 0 }
      )
      addBlock(
        {
          id: 'block-2',
          type: 'condition',
          label: 'If Condition',
          description: 'Test',
          category: { type: 'condition', label: 'Condition', color: '#F59E0B' },
        },
        { x: 100, y: 100 }
      )
      const loopBlocks = getBlocksByCategory('loop')
      expect(loopBlocks).toHaveLength(1)
      expect(loopBlocks[0].id).toBe('block-1')
    })
  })

  describe('setNodes and setEdges', () => {
    it('sets nodes directly', () => {
      const { setNodes } = useCanvasStore.getState()
      setNodes([{ id: 'n1', type: 'logicBlock', position: { x: 0, y: 0 }, data: {} } as any])
      expect(useCanvasStore.getState().nodes).toHaveLength(1)
    })

    it('sets edges directly', () => {
      const { setEdges } = useCanvasStore.getState()
      setEdges([{ id: 'e1', source: 'n1', target: 'n2' } as any])
      expect(useCanvasStore.getState().edges).toHaveLength(1)
    })
  })
})