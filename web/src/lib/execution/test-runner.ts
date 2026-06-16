import equal from 'fast-deep-equal'
import type { SerializedBlockConfig, TestCase, TestResult, ExecutionReport, ExecutionStep } from '@/types/execution-types'
import { interpretBlockConfig } from './interpreter'

export function runTests(
  config: SerializedBlockConfig[],
  testCases: TestCase[]
): ExecutionReport {
  const allSteps: ExecutionStep[] = []
  const results: TestResult[] = []
  let stepOffset = 0
  const startTime = performance.now()

  if (testCases.length === 0) {
    return {
      steps: [],
      results: [],
      summary: { total: 0, passed: 0, failed: 0, duration: performance.now() - startTime },
    }
  }

  for (const testCase of testCases) {
    const report = interpretBlockConfig(config, testCase.input)

    const adjustedSteps = report.steps.map((step) => ({
      ...step,
      stepIndex: step.stepIndex + stepOffset,
    }))

    allSteps.push(...adjustedSteps)
    stepOffset += report.steps.length

    const actualOutput = report.steps.length > 0
      ? findFinalOutput(report.steps)
      : undefined

    const passed = equal(actualOutput, testCase.expectedOutput)

    const errorStep = report.steps.findIndex((s) => s.status === 'error')

    results.push({
      testCaseId: testCase.id,
      passed,
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual: actualOutput,
      errorStep: errorStep >= 0 ? errorStep + stepOffset - report.steps.length : undefined,
      isEdgeCase: testCase.isEdgeCase,
    })
  }

  const totalDuration = performance.now() - startTime
  const passedCount = results.filter((r) => r.passed).length
  const failedCount = results.length - passedCount

  return {
    steps: allSteps,
    results,
    summary: {
      total: results.length,
      passed: passedCount,
      failed: failedCount,
      duration: totalDuration,
    },
  }
}

function findFinalOutput(steps: ExecutionStep[]): unknown {
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
