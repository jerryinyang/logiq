import { describe, it, expect } from 'vitest'
import { runEdgeCaseTests } from './edge-case-runner'
import type { SerializedBlockConfig, TestCase } from '@/types/execution-types'

function makeConfig(
  id: string,
  type: SerializedBlockConfig['type'],
  config: Record<string, unknown> = {},
  connections: { input?: string[]; output?: string[] } = {}
): SerializedBlockConfig {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
    connections: { output: connections.output ?? [], input: connections.input ?? [] },
    config,
  }
}

describe('edge-case-runner', () => {
  it('splits test cases into standard and edge case categories', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [3, 1, 2], expectedOutput: [3, 1, 2] },
      { id: 'tc-edge1', input: [], expectedOutput: [], isEdgeCase: true },
      { id: 'tc2', input: [5, 4, 3], expectedOutput: [5, 4, 3] },
      { id: 'tc-edge2', input: [42], expectedOutput: 42, isEdgeCase: true },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard).toHaveLength(2)
    expect(result.edgeCase).toHaveLength(2)
  })

  it('places standard tests in standard category', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [1, 2], expectedOutput: [1, 2] },
      { id: 'tc2', input: [3, 4], expectedOutput: [3, 4] },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard).toHaveLength(2)
    expect(result.edgeCase).toHaveLength(0)
  })

  it('places edge case tests in edge case category', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc-edge1', input: [], expectedOutput: [], isEdgeCase: true },
      { id: 'tc-edge2', input: [42], expectedOutput: 42, isEdgeCase: true },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard).toHaveLength(0)
    expect(result.edgeCase).toHaveLength(2)
  })

  it('correctly identifies passing and failing standard tests', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [1, 2], expectedOutput: [1, 2] },
      { id: 'tc2', input: [5, 4, 3], expectedOutput: [3, 4, 5] },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard[0].passed).toBe(true)
    expect(result.standard[1].passed).toBe(false)
  })

  it('correctly identifies passing and failing edge case tests', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc-edge1', input: [], expectedOutput: [], isEdgeCase: true },
      { id: 'tc-edge2', input: [1], expectedOutput: 999, isEdgeCase: true },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.edgeCase[0].passed).toBe(true)
    expect(result.edgeCase[1].passed).toBe(false)
  })

  it('preserves isEdgeCase flag in results', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [1], expectedOutput: [1] },
      { id: 'tc-edge1', input: [], expectedOutput: [], isEdgeCase: true },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard[0].isEdgeCase).toBeUndefined()
    expect(result.edgeCase[0].isEdgeCase).toBe(true)
  })

  it('handles empty test cases', () => {
    const config = [makeConfig('r1', 'return', { value: 42 })]
    const result = runEdgeCaseTests(config, [])
    expect(result.standard).toHaveLength(0)
    expect(result.edgeCase).toHaveLength(0)
  })

  it('handles all standard tests (no edge cases)', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: 1, expectedOutput: 1 },
      { id: 'tc2', input: 2, expectedOutput: 2 },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard).toHaveLength(2)
    expect(result.edgeCase).toHaveLength(0)
    expect(result.standard.every((r) => r.passed)).toBe(true)
  })

  it('handles all edge case tests (no standard)', () => {
    const config = [makeConfig('e1', 'edgeCase', { condition: 'emptyInput', input: [] })]
    const testCases: TestCase[] = [
      { id: 'tc-edge1', input: [], expectedOutput: [], isEdgeCase: true },
    ]

    const result = runEdgeCaseTests(config, testCases)
    expect(result.standard).toHaveLength(0)
    expect(result.edgeCase).toHaveLength(1)
  })
})