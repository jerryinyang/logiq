import type { SerializedBlockConfig, TestCase, TestResult } from '@/types/execution-types'
import { interpretBlockConfig } from './interpreter'

export interface CategorizedTestResults {
  standard: TestResult[]
  edgeCase: TestResult[]
}

export function runEdgeCaseTests(
  config: SerializedBlockConfig[],
  testCases: TestCase[]
): CategorizedTestResults {
  const standardCases: TestCase[] = []
  const edgeCaseCases: TestCase[] = []

  for (const tc of testCases) {
    if (tc.isEdgeCase) {
      edgeCaseCases.push(tc)
    } else {
      standardCases.push(tc)
    }
  }

  const standardResults = runTestCategory(config, standardCases)
  const edgeCaseResults = runTestCategory(config, edgeCaseCases)

  return {
    standard: standardResults,
    edgeCase: edgeCaseResults,
  }
}

function runTestCategory(
  config: SerializedBlockConfig[],
  testCases: TestCase[]
): TestResult[] {
  const results: TestResult[] = []

  for (const testCase of testCases) {
    const report = interpretBlockConfig(config, testCase.input)

    const actualOutput = report.steps.length > 0
      ? findFinalOutput(report.steps)
      : undefined

    const passed = deepEqual(actualOutput, testCase.expectedOutput)
    const errorStep = report.steps.findIndex((s) => s.status === 'error')

    results.push({
      testCaseId: testCase.id,
      passed,
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual: actualOutput,
      errorStep: errorStep >= 0 ? errorStep : undefined,
      isEdgeCase: testCase.isEdgeCase,
    })
  }

  return results
}

function findFinalOutput(steps: import('@/types/execution-types').ExecutionStep[]): unknown {
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i]
    if (step.blockType === 'return' && step.status === 'success') {
      return step.output
    }
  }

  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].status === 'success' && steps[i].output !== undefined) {
      return steps[i].output
    }
  }

  return undefined
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((val, i) => deepEqual(val, b[i]))
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>
    const bObj = b as Record<string, unknown>
    const aKeys = Object.keys(aObj)
    const bKeys = Object.keys(bObj)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every((key) => deepEqual(aObj[key], bObj[key]))
  }

  return false
}