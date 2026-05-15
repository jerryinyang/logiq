import { describe, it, expect } from 'vitest'
import type {
  ExecutionStep,
  TestResult,
  ExecutionReport,
  SerializedBlockConfig,
  TestCase,
  TestStatus,
} from './execution-types'

describe('execution-types', () => {
  it('ExecutionStep has required fields', () => {
    const step: ExecutionStep = {
      stepIndex: 0,
      blockId: 'block-1',
      blockType: 'loop',
      input: [1, 2, 3],
      output: [2, 4, 6],
      status: 'success',
      duration: 1.5,
    }
    expect(step.stepIndex).toBe(0)
    expect(step.status).toBe('success')
    expect(step.errorMessage).toBeUndefined()
  })

  it('ExecutionStep with error', () => {
    const step: ExecutionStep = {
      stepIndex: 1,
      blockId: 'block-2',
      blockType: 'condition',
      input: null,
      output: null,
      status: 'error',
      errorMessage: 'Null input',
      duration: 0.1,
    }
    expect(step.status).toBe('error')
    expect(step.errorMessage).toBe('Null input')
  })

  it('TestResult pass/fail', () => {
    const pass: TestResult = {
      testCaseId: 'tc-1',
      passed: true,
      input: [1, 2, 3],
      expected: [2, 4, 6],
      actual: [2, 4, 6],
    }
    const fail: TestResult = {
      testCaseId: 'tc-2',
      passed: false,
      input: [1, 2],
      expected: [2, 4],
      actual: [2, 3],
      errorStep: 2,
    }
    expect(pass.passed).toBe(true)
    expect(fail.errorStep).toBe(2)
  })

  it('ExecutionReport aggregates results', () => {
    const report: ExecutionReport = {
      steps: [],
      results: [
        { testCaseId: 'tc-1', passed: true, input: 1, expected: 2, actual: 2 },
        { testCaseId: 'tc-2', passed: false, input: 3, expected: 6, actual: 5, errorStep: 1 },
      ],
      summary: { total: 2, passed: 1, failed: 1, duration: 3.2 },
    }
    expect(report.summary.total).toBe(2)
    expect(report.summary.failed).toBe(1)
  })

  it('SerializedBlockConfig matches architecture format', () => {
    const config: SerializedBlockConfig = {
      id: 'b1',
      type: 'loop',
      position: { x: 100, y: 200 },
      connections: { output: ['b2'], input: [] },
      config: { items: [1, 2, 3] },
    }
    expect(config.connections.output).toEqual(['b2'])
    expect(config.config.items).toEqual([1, 2, 3])
  })

  it('TestCase with edge case flag', () => {
    const tc: TestCase = {
      id: 'tc-edge-1',
      input: [],
      expectedOutput: [],
      isEdgeCase: true,
    }
    expect(tc.isEdgeCase).toBe(true)
  })

  it('TestStatus union type covers all states', () => {
    const statuses: TestStatus[] = ['idle', 'running', 'success', 'error']
    expect(statuses).toHaveLength(4)
  })
})
