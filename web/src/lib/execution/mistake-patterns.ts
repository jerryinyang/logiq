import type { ExecutionReport, TestResult } from '@/types/execution-types'

export interface MistakePattern {
  patternId: string
  condition: (report: ExecutionReport | null, results: TestResult[] | null, step: { blockType: string; errorMessage?: string; input?: unknown; output?: unknown } | null) => boolean
  message: string
  percentage: string
}

const MISTAKE_PATTERNS: MistakePattern[] = [
  {
    patternId: 'off-by-one',
    condition: (_report, results, _step) => {
      if (!results) return false
      return results.some((r) => {
        if (r.passed || r.expected === undefined || r.actual === undefined) return false
        if (typeof r.expected === 'number' && typeof r.actual === 'number') {
          return Math.abs(r.expected - r.actual) === 1
        }
        return false
      })
    },
    message: 'check your loop bounds — you might be off by one',
    percentage: '80%',
  },
  {
    patternId: 'missing-edge-case',
    condition: (_report, results, _step) => {
      if (!results) return false
      const edgeCaseFailures = results.filter((r) => !r.passed && r.isEdgeCase)
      return edgeCaseFailures.length > 0
    },
    message: 'check your edge case handling — this fails on empty or boundary inputs',
    percentage: '72%',
  },
  {
    patternId: 'reverse-comparison',
    condition: (_report, _results, step) => {
      if (!step || step.blockType !== 'comparison') return false
      return step.errorMessage?.toLowerCase().includes('comparison') ||
        step.errorMessage?.toLowerCase().includes('expected') ||
        (typeof step.input === 'object' && step.input !== null && 'left' in (step.input as Record<string, unknown>) && 'right' in (step.input as Record<string, unknown>))
    },
    message: 'check your comparison direction — you might have the operator reversed',
    percentage: '65%',
  },
  {
    patternId: 'null-reference',
    condition: (_report, _results, step) => {
      if (!step) return false
      if (step.output === null) return true
      return step.errorMessage?.toLowerCase().includes('null') ||
        step.errorMessage?.toLowerCase().includes('undefined value') ||
        step.errorMessage?.toLowerCase().includes('not defined') ||
        false
    },
    message: 'check for null or undefined values — a variable might not be set',
    percentage: '68%',
  },
  {
    patternId: 'index-out-of-bounds',
    condition: (_report, _results, step) => {
      if (!step) return false
      return step.errorMessage?.toLowerCase().includes('bounds') ||
        step.errorMessage?.toLowerCase().includes('index out of') ||
        false
    },
    message: 'check your array access — you might be accessing an index that does not exist',
    percentage: '75%',
  },
  {
    patternId: 'type-mismatch',
    condition: (_report, results, _step) => {
      if (!results) return false
      return results.some((r) => {
        if (r.passed) return false
        return typeof r.expected !== typeof r.actual
      })
    },
    message: 'check your data types — expected and actual have different types',
    percentage: '58%',
  },
]

export function detectCommonMistake(
  report: ExecutionReport | null,
  results: TestResult[] | null,
  step: { blockType: string; errorMessage?: string; input?: unknown; output?: unknown } | null
): string | null {
  for (const pattern of MISTAKE_PATTERNS) {
    if (pattern.condition(report, results, step)) {
      return `${pattern.percentage} of developers make this mistake here — ${pattern.message}`
    }
  }
  return null
}

export { MISTAKE_PATTERNS }