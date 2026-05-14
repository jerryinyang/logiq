import { describe, it, expect, beforeEach } from 'vitest'
import { useCanvasStore } from './canvas-store'
import type { CanvasNode, CanvasEdge } from '@/types/canvas-types'

const mockNodes: CanvasNode[] = [
  { id: '1', type: 'condition', label: 'Test', position: { x: 0, y: 0 }, data: {} },
]
const mockEdges: CanvasEdge[] = [
  { id: 'e1', source: '1', target: '2' },
]

describe('canvas-store', () => {
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
    const { pushHistory, undo } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    pushHistory([], [])
    const state = useCanvasStore.getState()
    expect(state.canUndo).toBe(true)
  })

  it('undo reduces history stack', () => {
    const { pushHistory, undo } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    pushHistory([], [])
    undo()
    const state = useCanvasStore.getState()
    expect(state.canRedo).toBe(true)
  })

  it('redo resets canRedo flag', () => {
    const { pushHistory, undo, redo } = useCanvasStore.getState()
    pushHistory(mockNodes, mockEdges)
    pushHistory([], [])
    undo()
    redo()
    const state = useCanvasStore.getState()
    expect(state.canRedo).toBe(false)
  })
})
