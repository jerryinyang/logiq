'use server'

import { getSessionUser } from '@/lib/auth'
import { submitSolutionSchema } from '@/lib/validation/solution'
import { serializeCanvasState } from '@/lib/execution/serializer'
import { runTests } from '@/lib/execution/test-runner'
import type { SerializedBlockConfig, TestCase, ExecutionReport } from '@/types/execution-types'
import type { Node, Edge } from '@xyflow/react'

interface ActionResult<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

const MOCK_TEST_CASES: Record<string, TestCase[]> = {
  'mock-1': [
    { id: 'tc-1', input: [3, 1, 2], expectedOutput: [1, 2, 3] },
    { id: 'tc-2', input: [5, 4, 3, 2, 1], expectedOutput: [1, 2, 3, 4, 5] },
    { id: 'tc-3', input: [], expectedOutput: [], isEdgeCase: true },
  ],
  'mock-2': [
    { id: 'tc-1', input: [10, 20, 30], expectedOutput: 30 },
    { id: 'tc-2', input: [5], expectedOutput: 5, isEdgeCase: true },
  ],
}

function getTestCasesForChallenge(challengeId: string): TestCase[] {
  return MOCK_TEST_CASES[challengeId] ?? [
    { id: 'tc-default', input: null, expectedOutput: null },
  ]
}

export async function submitSolution(
  challengeId: string,
  blockConfig: SerializedBlockConfig[]
): Promise<ActionResult<ExecutionReport>> {
  const user = await getSessionUser()
  if (!user) {
    return {
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required to submit a solution',
      },
    }
  }

  const parsed = submitSolutionSchema.safeParse({ challengeId, blockConfig })
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: firstError?.message ?? 'Invalid input',
        details: parsed.error.flatten(),
      },
    }
  }

  const testCases = getTestCasesForChallenge(challengeId)

  try {
    const report = runTests(blockConfig, testCases)
    return { success: true, data: report }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_FAILED',
        message: err instanceof Error ? err.message : 'Execution failed unexpectedly',
      },
    }
  }
}

export async function validateAndSerializeFlow(
  nodes: Node[],
  edges: Edge[]
): Promise<ActionResult<SerializedBlockConfig[]>> {
  const user = await getSessionUser()
  if (!user) {
    return {
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required to validate a flow',
      },
    }
  }

  const result = serializeCanvasState(nodes, edges)
  if (!result.success || !result.data) {
    return {
      success: false,
      error: {
        code: result.error?.code ?? 'EXECUTION_INVALID_FLOW',
        message: result.error?.message ?? 'Invalid logic flow',
      },
    }
  }

  return { success: true, data: result.data }
}