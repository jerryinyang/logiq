import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCanvasStore } from '@/stores/canvas-store'

describe('canvas-store - reset and draft features', () => {
  beforeEach(() => {
    const { historyManager } = useCanvasStore.getState()
    historyManager.clear()
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      selectedBlockIds: [],
      canUndo: false,
      canRedo: false,
      historyStack: [],
      redoStack: [],
      draftStatus: 'none',
      resetCount: 0,
      testStatus: 'idle',
      testResults: null,
      executionSteps: null,
    })
  })

  describe('resetCanvas', () => {
    it('clears all canvas state and increments resetCount', () => {
      useCanvasStore.getState().pushHistory(
        [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
        []
      )
      useCanvasStore.getState().setNodes([
        { id: '1', type: 'logicBlock', position: { x: 0, y: 0 }, data: { block: { id: '1', type: 'condition' } } },
      ])

      useCanvasStore.getState().resetCanvas()

      const state = useCanvasStore.getState()
      expect(state.nodes).toEqual([])
      expect(state.edges).toEqual([])
      expect(state.selectedBlockIds).toEqual([])
      expect(state.canUndo).toBe(false)
      expect(state.canRedo).toBe(false)
      expect(state.draftStatus).toBe('none')
      expect(state.resetCount).toBe(1)
    })

    it('increments resetCount on each reset', () => {
      useCanvasStore.getState().resetCanvas()
      expect(useCanvasStore.getState().resetCount).toBe(1)

      useCanvasStore.getState().resetCanvas()
      expect(useCanvasStore.getState().resetCount).toBe(2)
    })

    it('clears test state on reset', () => {
      useCanvasStore.getState().setTestStatus('error')
      useCanvasStore.getState().resetCanvas()

      expect(useCanvasStore.getState().testStatus).toBe('idle')
      expect(useCanvasStore.getState().testResults).toBeNull()
    })
  })

  describe('undo/redo keyboard shortcuts', () => {
    it('undo restores previous state via history manager', () => {
      useCanvasStore.getState().pushHistory(
        [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
        []
      )
      useCanvasStore.getState().pushHistory(
        [{ id: '2', position: { x: 100, y: 100 }, data: {} }],
        []
      )

      expect(useCanvasStore.getState().canUndo).toBe(true)

      useCanvasStore.getState().undo()

      const nodes = useCanvasStore.getState().nodes
      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('1')
    })

    it('redo restores undone state', () => {
      useCanvasStore.getState().pushHistory(
        [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
        []
      )
      useCanvasStore.getState().pushHistory(
        [{ id: '2', position: { x: 100, y: 100 }, data: {} }],
        []
      )

      useCanvasStore.getState().undo()
      expect(useCanvasStore.getState().canRedo).toBe(true)

      useCanvasStore.getState().redo()

      const nodes = useCanvasStore.getState().nodes
      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('2')
    })
  })

  describe('setDraftStatus', () => {
    it('updates draft status', () => {
      useCanvasStore.getState().setDraftStatus('restoring')
      expect(useCanvasStore.getState().draftStatus).toBe('restoring')

      useCanvasStore.getState().setDraftStatus('restored')
      expect(useCanvasStore.getState().draftStatus).toBe('restored')

      useCanvasStore.getState().setDraftStatus('saved')
      expect(useCanvasStore.getState().draftStatus).toBe('saved')
    })
  })
})