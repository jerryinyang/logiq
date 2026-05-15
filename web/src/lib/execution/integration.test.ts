import { describe, it, expect } from 'vitest'
import { serializeCanvasState } from '@/lib/execution/serializer'
import { interpretBlockConfig } from '@/lib/execution/interpreter'
import { runTests } from '@/lib/execution/test-runner'
import type { SerializedBlockConfig, TestCase } from '@/types/execution-types'
import type { Node, Edge } from '@xyflow/react'

function makeNode(id: string, blockType: string, config: Record<string, unknown> = {}): Node {
  return {
    id,
    type: 'logicBlock',
    position: { x: 0, y: 0 },
    data: {
      block: {
        id,
        type: blockType,
        label: blockType,
        description: `A ${blockType} block`,
        category: { type: blockType, label: blockType, color: '#000' },
        connections: { input: [], output: [] },
        config,
      },
    },
  }
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
  }
}

describe('integration: serializer + interpreter pipeline', () => {
  it('serializes and interprets a simple variable-return flow', () => {
    const nodes: Node[] = [
      makeNode('var-1', 'variable', { variableName: 'result', value: 42, action: 'set' }),
      makeNode('ret-1', 'return', { value: '$result' }),
    ]
    const edges: Edge[] = [
      makeEdge('var-1', 'ret-1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)

    const report = interpretBlockConfig(result.data!, 0)
    expect(report.steps.length).toBeGreaterThanOrEqual(1)
    expect(report.steps.some((s: any) => s.blockType === 'variable')).toBe(true)
  })

  it('rejects disconnected blocks', () => {
    const nodes: Node[] = [
      makeNode('var-1', 'variable', { variableName: 'x', value: 1, action: 'set' }),
      makeNode('var-2', 'variable', { variableName: 'y', value: 2, action: 'set' }),
    ]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(false)
    expect(result.error?.code).toBe('EXECUTION_INVALID_FLOW')
  })

  it('rejects flow without return block', () => {
    const nodes: Node[] = [
      makeNode('var-1', 'variable', { variableName: 'x', value: 1, action: 'set' }),
    ]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(false)
    expect(result.error?.code).toBe('EXECUTION_INVALID_FLOW')
  })

  it('runs full pipeline: serialize -> interpret -> test comparison', () => {
    const nodes: Node[] = [
      makeNode('ret-1', 'return', { value: 42 }),
    ]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)

    const testCases: TestCase[] = [
      { id: 'tc-1', input: null, expectedOutput: 42 },
    ]

    const report = runTests(result.data!, testCases)
    expect(report.summary.total).toBe(1)
    expect(report.results[0].actual).toBe(42)
    expect(report.results[0].passed).toBe(true)
  })

  it('detects failing test cases', () => {
    const nodes: Node[] = [
      makeNode('ret-1', 'return', { value: 10 }),
    ]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)

    const testCases: TestCase[] = [
      { id: 'tc-1', input: null, expectedOutput: 20 },
    ]

    const report = runTests(result.data!, testCases)
    expect(report.summary.total).toBe(1)
    expect(report.summary.passed).toBe(0)
    expect(report.summary.failed).toBe(1)
    expect(report.results[0].passed).toBe(false)
  })

  it('handles comparison blocks correctly', () => {
    const nodes: Node[] = [
      makeNode('cmp-1', 'comparison', { left: 5, right: 3, operator: 'Greater Than' }),
      makeNode('ret-1', 'return', { value: '$cmp-1_result' }),
    ]
    const edges: Edge[] = [
      makeEdge('cmp-1', 'ret-1'),
    ]

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)

    const report = interpretBlockConfig(result.data!, null)
    expect(report.steps[0].blockType).toBe('comparison')
    expect(report.steps[0].output).toBe(true)
  })

  it('handles edge case: empty canvas', () => {
    const result = serializeCanvasState([], [])
    expect(result.success).toBe(false)
    expect(result.error?.code).toBe('EXECUTION_INVALID_FLOW')
  })

  it('handles edge case: single return block', () => {
    const nodes: Node[] = [
      makeNode('ret-1', 'return', { value: 42 }),
    ]
    const edges: Edge[] = []

    const result = serializeCanvasState(nodes, edges)
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
  })
})