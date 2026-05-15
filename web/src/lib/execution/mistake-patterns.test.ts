import { describe, it, expect } from 'vitest'
import { detectCommonMistake } from './mistake-patterns'
import type { ExecutionReport, TestResult } from '@/types/execution-types'

describe('detectCommonMistake', () => {
  it('returns null when no patterns match', () => {
    const report: ExecutionReport = {
      steps: [],
      results: [{ testCaseId: 'tc-1', passed: true, input: 1, expected: 1, actual: 1 }],
      summary: { total: 1, passed: 1, failed: 0, duration: 10 },
    }
    expect(detectCommonMistake(report, report.results, null)).toBeNull()
  })

  it('detects off-by-one error', () => {
    const results: TestResult[] = [
      { testCaseId: 'tc-1', passed: false, input: 5, expected: 5, actual: 4, errorStep: 0 },
    ]
    const result = detectCommonMistake(null, results, null)
    expect(result).toContain('off by one')
  })

  it('detects off-by-one in negative direction', () => {
    const results: TestResult[] = [
      { testCaseId: 'tc-1', passed: false, input: 5, expected: 5, actual: 6, errorStep: 0 },
    ]
    const result = detectCommonMistake(null, results, null)
    expect(result).toContain('off by one')
  })

  it('detects missing edge case', () => {
    const results: TestResult[] = [
      { testCaseId: 'tc-1', passed: false, input: [], expected: 0, actual: undefined, isEdgeCase: true },
    ]
    const result = detectCommonMistake(null, results, null)
    expect(result).toContain('edge case')
  })

  it('detects reverse comparison', () => {
    const step = { blockType: 'comparison', errorMessage: 'Comparison failed: expected > got <' }
    const result = detectCommonMistake(null, null, step)
    expect(result).toContain('comparison direction')
  })

  it('detects index out of bounds', () => {
    const step = { blockType: 'loop', errorMessage: 'Array index out of bounds' }
    const result = detectCommonMistake(null, null, step)
    expect(result).toContain('index')
  })

it('detects null reference with null output', () => {
    const step = { blockType: 'variable', errorMessage: 'Value is null', output: null }
    const result = detectCommonMistake(null, null, step)
    expect(result).toContain('null or undefined')
  })

  it('detects null reference with undefined error message', () => {
    const step = { blockType: 'variable', errorMessage: 'Variable x is not defined' }
    const result = detectCommonMistake(null, null, step)
    expect(result).toContain('null or undefined')
  })

  it('detects index out of bounds', () => {
    const step = { blockType: 'loop', errorMessage: 'Array index out of bounds', output: 42 }
    const result = detectCommonMistake(null, null, step)
    expect(result).toContain('index')
  })

  it('detects type mismatch', () => {
    const results: TestResult[] = [
      { testCaseId: 'tc-1', passed: false, input: 5, expected: 10, actual: '10' },
    ]
    const result = detectCommonMistake(null, results, null)
    expect(result).toContain('data types')
  })

  it('returns null for passing results with no edge cases', () => {
    const results: TestResult[] = [
      { testCaseId: 'tc-1', passed: true, input: 5, expected: 5, actual: 5 },
    ]
    expect(detectCommonMistake(null, results, null)).toBeNull()
  })

  it('prioritizes first matching pattern', () => {
    const results: TestResult[] = [
      { testCaseId: 'tc-1', passed: false, input: 5, expected: 5, actual: 4, isEdgeCase: true, errorStep: 0 },
    ]
    const result = detectCommonMistake(null, results, null)
    expect(result).not.toBeNull()
  })
})