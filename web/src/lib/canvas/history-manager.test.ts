import { describe, it, expect, beforeEach } from 'vitest'
import { HistoryManager } from './history-manager'
import type { Node, Edge } from '@xyflow/react'

const mockNodes1: Node[] = [
  { id: '1', type: 'logicBlock', position: { x: 0, y: 0 }, data: { block: { id: '1', type: 'condition' } } },
]
const mockEdges1: Edge[] = [
  { id: 'e1', source: '1', target: '2', type: 'blockConnection' },
]

const mockNodes2: Node[] = [
  { id: '2', type: 'logicBlock', position: { x: 100, y: 100 }, data: { block: { id: '2', type: 'loop' } } },
]
const mockEdges2: Edge[] = [
  { id: 'e2', source: '2', target: '3', type: 'blockConnection' },
]

const mockNodes3: Node[] = [
  { id: '3', type: 'logicBlock', position: { x: 200, y: 200 }, data: { block: { id: '3', type: 'return' } } },
]

describe('HistoryManager', () => {
  let manager: HistoryManager

  beforeEach(() => {
    manager = new HistoryManager(50)
  })

  it('starts with empty state', () => {
    expect(manager.canUndo).toBe(false)
    expect(manager.canRedo).toBe(false)
    expect(manager.historyLength).toBe(0)
    expect(manager.redoLength).toBe(0)
  })

  it('pushes history entry', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    expect(manager.historyLength).toBe(1)
    expect(manager.canUndo).toBe(false)
    expect(manager.canRedo).toBe(false)
  })

  it('enables undo after multiple pushes', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)
    expect(manager.canUndo).toBe(true)
  })

  it('undo returns previous state', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)

    const result = manager.undo()
    expect(result).not.toBeNull()
    expect(result!.nodes).toEqual(mockNodes1)
    expect(result!.edges).toEqual(mockEdges1)
  })

  it('undo returns null when at the beginning', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    const result = manager.undo()
    expect(result).toBeNull()
  })

  it('undo returns null when history is empty', () => {
    const result = manager.undo()
    expect(result).toBeNull()
  })

  it('redo returns next state after undo', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)
    manager.undo()

    const result = manager.redo()
    expect(result).not.toBeNull()
    expect(result!.nodes).toEqual(mockNodes2)
    expect(result!.edges).toEqual(mockEdges2)
  })

  it('redo returns null when no redo available', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    const result = manager.redo()
    expect(result).toBeNull()
  })

  it('pushing after undo truncates future states', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)
    manager.undo()

    manager.pushHistory(mockNodes3, [])
    expect(manager.canRedo).toBe(false)
    expect(manager.redoLength).toBe(0)
  })

  it('enforces max history entries with FIFO removal', () => {
    const smallManager = new HistoryManager(3)
    for (let i = 0; i < 5; i++) {
      smallManager.pushHistory([{ id: `node-${i}`, position: { x: i, y: i }, data: {} } as Node], [])
    }
    expect(smallManager.historyLength).toBe(3)
    expect(smallManager.canUndo).toBe(true)
  })

  it('clear resets all state', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)
    manager.clear()
    expect(manager.historyLength).toBe(0)
    expect(manager.redoLength).toBe(0)
    expect(manager.canUndo).toBe(false)
    expect(manager.canRedo).toBe(false)
  })

  it('preserves data integrity with deep copies', () => {
    const nodes = [{ id: '1', position: { x: 0, y: 0 }, data: { value: 'original' } } as Node]
    manager.pushHistory(nodes, [])

    nodes[0].data.value = 'modified'

    const result = manager.undo()
    expect(result).toBeNull()

    manager.pushHistory(nodes, [])
    manager.pushHistory([{ id: '2', position: { x: 0, y: 0 }, data: {} } as Node], [])
    const undoResult = manager.undo()
    expect(undoResult!.nodes[0].data.value).toBe('modified')
  })

  it('handles multiple undo/redo cycles correctly', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)
    manager.pushHistory(mockNodes3, [])

    const undo1 = manager.undo()
    expect(undo1!.nodes).toEqual(mockNodes2)

    const undo2 = manager.undo()
    expect(undo2!.nodes).toEqual(mockNodes1)

    const redo1 = manager.redo()
    expect(redo1!.nodes).toEqual(mockNodes2)

    const redo2 = manager.redo()
    expect(redo2!.nodes).toEqual(mockNodes3)
  })

  it('tracks canUndo correctly after operations', () => {
    expect(manager.canUndo).toBe(false)

    manager.pushHistory(mockNodes1, mockEdges1)
    expect(manager.canUndo).toBe(false)

    manager.pushHistory(mockNodes2, mockEdges2)
    expect(manager.canUndo).toBe(true)

    manager.undo()
    expect(manager.canUndo).toBe(false)

    manager.redo()
    expect(manager.canUndo).toBe(true)
  })

  it('tracks canRedo correctly after operations', () => {
    manager.pushHistory(mockNodes1, mockEdges1)
    manager.pushHistory(mockNodes2, mockEdges2)
    expect(manager.canRedo).toBe(false)

    manager.undo()
    expect(manager.canRedo).toBe(true)

    manager.redo()
    expect(manager.canRedo).toBe(false)
  })

  it('default max entries is 50', () => {
    const defaultManager = new HistoryManager()
    for (let i = 0; i < 60; i++) {
      defaultManager.pushHistory([{ id: `n-${i}`, position: { x: i, y: i }, data: {} } as Node], [])
    }
    expect(defaultManager.historyLength).toBe(50)
    expect(defaultManager.canUndo).toBe(true)
  })
})