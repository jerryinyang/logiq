import { describe, it, expect } from 'vitest'
import { submitSolutionSchema } from './solution'
import type { BlockType } from '@/types/canvas-types'

describe('solution validation', () => {
  const validBlockConfig = {
    id: 'block-1',
    type: 'variable' as BlockType,
    position: { x: 100, y: 100 },
    connections: { output: ['block-2'], input: [] },
    config: { variableName: 'x', value: 10 },
  }

  it('validates a valid submit solution input', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [validBlockConfig],
    })
    expect(result.success).toBe(true)
  })

  it('requires challengeId', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: '',
      blockConfig: [validBlockConfig],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('required')
    }
  })

  it('requires non-empty blockConfig', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [],
    })
    expect(result.success).toBe(false)
  })

  it('validates block type enum', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [{ ...validBlockConfig, type: 'invalid' }],
    })
    expect(result.success).toBe(false)
  })

  it('requires id in block config', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [{ ...validBlockConfig, id: '' }],
    })
    expect(result.success).toBe(false)
  })

  it('accepts all valid block types', () => {
    const types: BlockType[] = ['loop', 'condition', 'comparison', 'assignment', 'return', 'variable', 'edgeCase']
    for (const type of types) {
      const result = submitSolutionSchema.safeParse({
        challengeId: 'challenge-1',
        blockConfig: [{ ...validBlockConfig, type }],
      })
      expect(result.success).toBe(true)
    }
  })

  it('allows optional fields in connections', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [{
        id: 'block-1',
        type: 'return' as BlockType,
        position: { x: 0, y: 0 },
        connections: { output: [], input: [] },
        config: {},
      }],
    })
    expect(result.success).toBe(true)
  })

  it('validates position has numeric x and y', () => {
    const result = submitSolutionSchema.safeParse({
      challengeId: 'challenge-1',
      blockConfig: [{ ...validBlockConfig, position: { x: 'abc', y: 100 } }],
    })
    expect(result.success).toBe(false)
  })
})