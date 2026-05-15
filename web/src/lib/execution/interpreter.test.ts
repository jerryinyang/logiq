import { describe, it, expect } from 'vitest'
import { interpretBlockConfig } from './interpreter'
import type { SerializedBlockConfig } from '@/types/execution-types'

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

describe('interpreter', () => {
  describe('variable blocks', () => {
    it('sets and gets a variable', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'x', value: 42, action: 'set' }),
        makeConfig('v2', 'variable', { variableName: 'x', action: 'get' }),
        makeConfig('r1', 'return', { value: '$x' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].status).toBe('success')
      expect(report.steps[0].output).toBe(42)
      expect(report.steps[2].output).toBe(42)
    })

    it('increments a variable', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'counter', value: 0, action: 'set' }),
        makeConfig('v2', 'variable', { variableName: 'counter', value: 1, label: 'Increment Variable', action: 'increment' }),
        makeConfig('r1', 'return', { value: '$counter' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[2].output).toBe(1)
    })
  })

  describe('comparison blocks', () => {
    it('equal to returns true for matching values', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 5, right: 5, operator: 'equalTo' }),
        makeConfig('r1', 'return', { value: '$c1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(true)
    })

    it('greater than returns true for larger left', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 10, right: 5, operator: 'greaterThan' }),
        makeConfig('r1', 'return', { value: '$c1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(true)
    })

    it('less than returns false when left is larger', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 10, right: 5, operator: 'lessThan' }),
        makeConfig('r1', 'return', { value: '$c1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(false)
    })

    it('contains checks array membership', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: [1, 2, 3], right: 2, operator: 'contains' }),
        makeConfig('r1', 'return', { value: '$c1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(true)
    })

    it('uses label-based comparison when operator not set', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 3, right: 3, label: 'Equal To' }),
        makeConfig('r1', 'return', { value: '$c1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(true)
    })
  })

  describe('condition blocks', () => {
    it('evaluates true branch', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 5, right: 3, operator: 'greaterThan' }),
        makeConfig('cond1', 'condition', { condition: '$c1_result' }),
        makeConfig('r1', 'return', { value: '$cond1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[1].output).toBe(true)
    })

    it('evaluates false when condition is falsy', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 1, right: 5, operator: 'greaterThan' }),
        makeConfig('cond1', 'condition', { condition: '$c1_result' }),
        makeConfig('r1', 'return', { value: '$cond1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[1].output).toBe(false)
    })
  })

  describe('assignment blocks', () => {
    it('assigns value to target', () => {
      const config = [
        makeConfig('a1', 'assignment', { target: 'result', value: 42 }),
        makeConfig('r1', 'return', { value: '$result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[1].output).toBe(42)
    })

    it('stores in collection', () => {
      const config = [
        makeConfig('a1', 'variable', { variableName: 'items', value: [], action: 'set' }),
        makeConfig('a2', 'assignment', { label: 'Store in Collection', collectionName: 'items', value: 1 }),
        makeConfig('a3', 'assignment', { label: 'Store in Collection', collectionName: 'items', value: 2 }),
        makeConfig('r1', 'return', { value: '$items' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[3].output).toEqual([1, 2])
    })

    it('return result assignment acts as early return', () => {
      const config = [
        makeConfig('a1', 'assignment', { label: 'Return Result', value: 99, isReturn: true }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(99)
    })
  })

  describe('return blocks', () => {
    it('returns a value and stops execution', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'x', value: 'hello', action: 'set' }),
        makeConfig('r1', 'return', { value: '$x' }),
        makeConfig('r2', 'return', { value: 'never reached' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps).toHaveLength(2)
      expect(report.steps[1].output).toBe('hello')
    })

    it('returns direct value without variable', () => {
      const config = [
        makeConfig('r1', 'return', { value: 42 }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(42)
    })
  })

  describe('loop blocks', () => {
    it('iterates over array items', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'results', value: [], action: 'set' }),
        makeConfig('l1', 'loop', { items: [1, 2, 3] }, { output: ['a1'] }),
        makeConfig('a1', 'assignment', { label: 'Store in Collection', collectionName: 'results', value: '$l1_currentItem' }),
        makeConfig('r1', 'return', { value: '$results' }),
      ]
      const report = interpretBlockConfig(config, [1, 2, 3])
      expect(report.summary.passed).toBe(1)
    })

    it('handles empty array', () => {
      const config = [
        makeConfig('l1', 'loop', { items: [] }),
        makeConfig('r1', 'return', { value: '$l1_output' }),
      ]
      const report = interpretBlockConfig(config, [])
      expect(report.steps[0].status).toBe('success')
    })

    it('returns error for non-array input', () => {
      const config = [
        makeConfig('l1', 'loop', { items: 'not-array' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].status).toBe('error')
    })
  })

  describe('edge case blocks', () => {
    it('detects empty input', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'emptyInput', input: [] }),
        makeConfig('r1', 'return', { value: '$e1_output' }),
      ]
      const report = interpretBlockConfig(config, [])
      expect(report.steps[0].output).toEqual([])
    })

    it('detects single element', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'singleElement', input: [42] }),
        makeConfig('r1', 'return', { value: '$e1_output' }),
      ]
      const report = interpretBlockConfig(config, [42])
      expect(report.steps[0].output).toEqual([42])
    })

    it('detects duplicates', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'duplicates', input: [1, 2, 2], returnValue: 'has-dupes' }),
        makeConfig('r1', 'return', { value: '$e1_result' }),
      ]
      const report = interpretBlockConfig(config, [1, 2, 2])
      expect(report.steps[0].output).toBe('has-dupes')
    })

    it('detects already sorted', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'alreadySorted', input: [1, 2, 3], returnValue: 'sorted' }),
        makeConfig('r1', 'return', { value: '$e1_result' }),
      ]
      const report = interpretBlockConfig(config, [1, 2, 3])
      expect(report.steps[0].output).toBe('sorted')
    })

    it('passes through when condition not met', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'emptyInput', input: [1, 2, 3] }),
        makeConfig('r1', 'return', { value: '$e1_result' }),
      ]
      const report = interpretBlockConfig(config, [1, 2, 3])
      expect(report.steps[0].output).toBe(false)
    })

    it('early returns when edge case condition is met', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'emptyInput', input: [], returnValue: [] }),
        makeConfig('r1', 'return', { value: 'should not reach' }),
      ]
      const report = interpretBlockConfig(config, [])
      expect(report.steps).toHaveLength(1)
      expect(report.steps[0].output).toEqual([])
    })
  })

  describe('execution report', () => {
    it('records timing for each step', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'x', value: 1, action: 'set' }),
        makeConfig('r1', 'return', { value: '$x' }),
      ]
      const report = interpretBlockConfig(config, null)
      for (const step of report.steps) {
        expect(step.duration).toBeGreaterThanOrEqual(0)
      }
    })

    it('captures input and output for each step', () => {
      const config = [
        makeConfig('c1', 'comparison', { left: 5, right: 5, operator: 'equalTo' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].input).toBeDefined()
      expect(report.steps[0].output).toBe(true)
    })

    it('reports error on unknown block type', () => {
      const config = [
        makeConfig('x1', 'unknownType' as SerializedBlockConfig['type']),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].status).toBe('error')
      expect(report.steps[0].errorMessage).toContain('Unknown block type')
    })

    it('test input is available in scope', () => {
      const config = [
        makeConfig('r1', 'return', { value: '$input' }),
      ]
      const report = interpretBlockConfig(config, [1, 2, 3])
      expect(report.steps[0].output).toEqual([1, 2, 3])
    })
  })

  describe('combined flows', () => {
    it('executes variable → comparison → return flow', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'num', value: 10, action: 'set' }),
        makeConfig('c1', 'comparison', { left: '$num', right: 5, operator: 'greaterThan' }),
        makeConfig('r1', 'return', { value: '$c1_result' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[2].output).toBe(true)
    })

    it('executes assignment → return flow', () => {
      const config = [
        makeConfig('a1', 'assignment', { target: 'answer', value: 42 }),
        makeConfig('r1', 'return', { value: '$answer' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[1].output).toBe(42)
    })
  })

  describe('edge cases and error handling', () => {
    it('handles null test input', () => {
      const config = [
        makeConfig('r1', 'return', { value: 42 }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBe(42)
    })

    it('handles undefined test input', () => {
      const config = [
        makeConfig('r1', 'return', { value: '$input' }),
      ]
      const report = interpretBlockConfig(config, undefined)
      expect(report.steps[0].output).toBe(undefined)
    })

    it('handles empty config', () => {
      const report = interpretBlockConfig([], null)
      expect(report.steps).toHaveLength(0)
      expect(report.summary.total).toBe(1)
    })

    it('variable get returns undefined for unset variable', () => {
      const config = [
        makeConfig('v1', 'variable', { variableName: 'nonexistent', action: 'get', label: 'Get Variable' }),
        makeConfig('r1', 'return', { value: '$v1_output' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].output).toBeUndefined()
    })

    it('variable block without name returns error', () => {
      const config = [
        makeConfig('v1', 'variable', { action: 'set' }),
      ]
      const report = interpretBlockConfig(config, null)
      expect(report.steps[0].status).toBe('error')
    })

    it('max value edge case', () => {
      const config = [
        makeConfig('e1', 'edgeCase', { condition: 'maxValue', input: Number.MAX_SAFE_INTEGER, returnValue: 'at-max' }),
        makeConfig('r1', 'return', { value: '$e1_result' }),
      ]
      const report = interpretBlockConfig(config, Number.MAX_SAFE_INTEGER)
      expect(report.steps[0].output).toBe('at-max')
    })
  })
})
