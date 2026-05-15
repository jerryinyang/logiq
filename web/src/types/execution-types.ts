import type { BlockType } from '@/types/canvas-types'

export interface ExecutionStep {
  stepIndex: number
  blockId: string
  blockType: BlockType
  input: unknown
  output: unknown
  status: 'executing' | 'success' | 'error'
  errorMessage?: string
  duration: number
}

export interface TestResult {
  testCaseId: string
  passed: boolean
  input: unknown
  expected: unknown
  actual: unknown
  errorStep?: number
  isEdgeCase?: boolean
}

export interface ExecutionReport {
  steps: ExecutionStep[]
  results: TestResult[]
  summary: {
    total: number
    passed: number
    failed: number
    duration: number
  }
}

export interface SerializedBlockConfig {
  id: string
  type: BlockType
  position: { x: number; y: number }
  connections: { output: string[]; input: string[] }
  config: Record<string, unknown>
}

export interface TestCase {
  id: string
  input: unknown
  expectedOutput: unknown
  isEdgeCase?: boolean
}

export type TestStatus = 'idle' | 'running' | 'success' | 'error'
