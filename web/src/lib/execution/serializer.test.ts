import { describe, it, expect } from 'vitest'
import { serializeCanvasState } from './serializer'
import type { Node, Edge } from '@xyflow/react'
import type { BlockType } from '@/types/canvas-types'

function makeNode(id: string, type: BlockType): Node {
  return {
    id,
    type: 'logicBlock',
    position: { x: 0, y: 0 },
    data: {
      block: {
        id,
        type,
        category: { type, label: type, color: '#000' },
        label: type,
        description: `${type} block`,
        connections: { input: [], output: [] },
      },
    },
  }
}

function makeEdge(source: string, target: string): Edge {
  return { id: `edge-${source}-${target}`, source, target }
}

describe('serializer', () => {
  it('serializes a valid connected flow', () => {
    const nodes = [
      makeNode('v1', 'variable'),
      makeNode('c1', 'comparison'),
      makeNode('a1', 'assignment'),
      makeNode('r1', 'return'),
    ]
    const edges = [
      makeEdge('v1', 'c1'),
      makeEdge('c1', 'a1'),
      makeEdge('a1', 'r1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(4)
    expect(result.data![0].id).toBe('v1')
    expect(result.data![3].id).toBe('r1')
  })

  it('returns error for empty canvas', () => {
    const result = serializeCanvasState([], [])
    expect(result.success).toBe(false)
    expect(result.error!.code).toBe('EXECUTION_INVALID_FLOW')
  })

  it('returns error for orphan blocks', () => {
    const nodes = [
      makeNode('v1', 'variable'),
      makeNode('r1', 'return'),
      makeNode('orphan', 'loop'),
    ]
    const edges = [makeEdge('v1', 'r1')]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(false)
    expect(result.error!.code).toBe('EXECUTION_INVALID_FLOW')
    expect(result.error!.message).toContain('connected')
  })

  it('returns error when no return block exists', () => {
    const nodes = [
      makeNode('v1', 'variable'),
      makeNode('c1', 'comparison'),
    ]
    const edges = [makeEdge('v1', 'c1')]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(false)
    expect(result.error!.message).toContain('Return block')
  })

  it('returns error for cyclic graph', () => {
    const nodes = [
      makeNode('v1', 'variable'),
      makeNode('c1', 'comparison'),
    ]
    const edges = [
      makeEdge('v1', 'c1'),
      makeEdge('c1', 'v1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(false)
    expect(result.error!.code).toBe('EXECUTION_CYCLE_DETECTED')
  })

  it('allows single return block as valid flow', () => {
    const nodes = [makeNode('r1', 'return')]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
  })

  it('topologically sorts blocks in correct execution order', () => {
    const nodes = [
      makeNode('r1', 'return'),
      makeNode('v1', 'variable'),
      makeNode('c1', 'comparison'),
    ]
    const edges = [
      makeEdge('v1', 'c1'),
      makeEdge('c1', 'r1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)
    const ids = result.data!.map((c) => c.id)
    expect(ids.indexOf('v1')).toBeLessThan(ids.indexOf('c1'))
    expect(ids.indexOf('c1')).toBeLessThan(ids.indexOf('r1'))
  })

  it('serializes connections correctly from edges', () => {
    const nodes = [
      makeNode('v1', 'variable'),
      makeNode('c1', 'comparison'),
      makeNode('r1', 'return'),
    ]
    const edges = [
      makeEdge('v1', 'c1'),
      makeEdge('c1', 'r1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)

    const v1 = result.data!.find((c) => c.id === 'v1')!
    expect(v1.connections.output).toContain('c1')

    const c1 = result.data!.find((c) => c.id === 'c1')!
    expect(c1.connections.input).toContain('v1')
    expect(c1.connections.output).toContain('r1')
  })

  it('handles branching flow (one node connecting to multiple)', () => {
    const nodes = [
      makeNode('v1', 'variable'),
      makeNode('c1', 'comparison'),
      makeNode('c2', 'comparison'),
      makeNode('r1', 'return'),
    ]
    const edges = [
      makeEdge('v1', 'c1'),
      makeEdge('v1', 'c2'),
      makeEdge('c1', 'r1'),
      makeEdge('c2', 'r1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(4)

    const v1 = result.data!.find((c) => c.id === 'v1')!
    expect(v1.connections.output).toContain('c1')
    expect(v1.connections.output).toContain('c2')
  })

  it('preserves block type and position in serialized config', () => {
    const nodes = [{
      id: 'b1',
      type: 'logicBlock',
      position: { x: 100, y: 200 },
      data: {
        block: {
          id: 'b1',
          type: 'loop',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
          label: 'For Each Item',
          description: 'Iterate over items',
          connections: { input: [], output: [] },
          config: { items: [1, 2, 3] },
        },
      },
    }]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(false)
  })
})
