import { describe, it, expect } from 'vitest'
import { runTests } from './test-runner'
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

describe('test-runner', () => {
  it('returns empty results for no test cases', () => {
    const config = [makeConfig('r1', 'return', { value: 42 })]
    const report = runTests(config, [])
    expect(report.results).toHaveLength(0)
    expect(report.summary.total).toBe(0)
    expect(report.summary.passed).toBe(0)
    expect(report.summary.failed).toBe(0)
  })

  it('passes when output matches expected', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [1, 2, 3], expectedOutput: [1, 2, 3] },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(true)
    expect(report.summary.passed).toBe(1)
    expect(report.summary.failed).toBe(0)
  })

  it('fails when output does not match expected', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [1, 2, 3], expectedOutput: [4, 5, 6] },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(false)
    expect(report.summary.failed).toBe(1)
  })

  it('runs multiple test cases and reports aggregate results', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: 'hello', expectedOutput: 'hello' },
      { id: 'tc2', input: 'world', expectedOutput: 'different' },
    ]
    const report = runTests(config, testCases)
    expect(report.summary.total).toBe(2)
    expect(report.summary.passed).toBe(1)
    expect(report.summary.failed).toBe(1)
  })

  it('shows expected vs actual for failed test', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: 5, expectedOutput: 10 },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].expected).toBe(10)
    expect(report.results[0].actual).toBe(5)
  })

  it('handles null input', () => {
    const config = [makeConfig('r1', 'return', { value: 42 })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: null, expectedOutput: 42 },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(true)
  })

  it('uses deep equality for comparison', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: { a: 1, b: [2, 3] }, expectedOutput: { a: 1, b: [2, 3] } },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(true)
  })

  it('aggregates execution steps from all test cases', () => {
    const config = [makeConfig('v1', 'variable', { variableName: 'x', value: '$input', action: 'set' }), makeConfig('r1', 'return', { value: '$x' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: 1, expectedOutput: 1 },
      { id: 'tc2', input: 2, expectedOutput: 2 },
    ]
    const report = runTests(config, testCases)
    expect(report.steps.length).toBe(4)
  })

  it('records error step index when execution fails', () => {
    const config = [makeConfig('v1', 'variable', { action: 'set' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: null, expectedOutput: 42 },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(false)
  })

  it('handles large output comparison', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i)
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: largeArray, expectedOutput: largeArray },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(true)
  })

  it('marks edge case tests', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: [], expectedOutput: [], isEdgeCase: true },
    ]
    const report = runTests(config, testCases)
    expect(report.results[0].passed).toBe(true)
  })

  it('reports duration for test run', () => {
    const config = [makeConfig('r1', 'return', { value: 42 })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: null, expectedOutput: 42 },
    ]
    const report = runTests(config, testCases)
    expect(report.summary.duration).toBeGreaterThanOrEqual(0)
  })

  it('all passing test cases', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: 1, expectedOutput: 1 },
      { id: 'tc2', input: 2, expectedOutput: 2 },
      { id: 'tc3', input: 3, expectedOutput: 3 },
    ]
    const report = runTests(config, testCases)
    expect(report.summary.passed).toBe(3)
    expect(report.summary.failed).toBe(0)
  })

  it('all failing test cases', () => {
    const config = [makeConfig('r1', 'return', { value: '$input' })]
    const testCases: TestCase[] = [
      { id: 'tc1', input: 1, expectedOutput: 99 },
      { id: 'tc2', input: 2, expectedOutput: 98 },
    ]
    const report = runTests(config, testCases)
    expect(report.summary.passed).toBe(0)
    expect(report.summary.failed).toBe(2)
  })
})
