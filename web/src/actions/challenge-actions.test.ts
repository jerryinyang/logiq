import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitSolutionSchema } from '@/lib/validation/solution'

vi.mock('@/lib/auth', () => ({
  getSessionUser: vi.fn(),
}))

vi.mock('@/lib/execution/test-runner', () => ({
  runTests: vi.fn(),
}))

vi.mock('@/lib/execution/serializer', () => ({
  serializeCanvasState: vi.fn(),
}))

describe('solution validation schema', () => {
  it('accepts valid input with all block types', () => {
    const types = ['loop', 'condition', 'comparison', 'assignment', 'return', 'variable', 'edgeCase']
    for (const type of types) {
      const result = submitSolutionSchema.safeParse({
        challengeId: 'challenge-1',
        blockConfig: [{
          id: 'block-1',
          type,
          position: { x: 0, y: 0 },
          connections: { output: [], input: [] },
          config: {},
        }],
      })
      expect(result.success, `type ${type} should be valid`).toBe(true)
    }
  })

  it('rejects invalid block type', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [{
        id: 'block-1',
        type: 'invalid',
        position: { x: 0, y: 0 },
        connections: { output: [], input: [] },
        config: {},
      }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty block config', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing challengeId', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: '',
      blockConfig: [{
        id: 'block-1',
        type: 'return',
        position: { x: 0, y: 0 },
        connections: { output: [], input: [] },
        config: {},
      }],
    })
    expect(result.success).toBe(false)
  })
})