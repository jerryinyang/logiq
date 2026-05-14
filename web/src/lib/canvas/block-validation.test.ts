import { describe, it, expect } from 'vitest'
import { isValidBlockConnection, getConnectionRules, COMPATIBLE_CONNECTIONS, BLOCK_LABELS } from './block-validation'
import type { BlockType } from '@/types/canvas-types'

describe('block-validation', () => {
  describe('isValidBlockConnection', () => {
    describe('valid connections', () => {
      it('allows Loop → Condition', () => {
        expect(isValidBlockConnection('loop', 'condition')).toEqual({ valid: true })
      })

      it('allows Loop → Comparison', () => {
        expect(isValidBlockConnection('loop', 'comparison')).toEqual({ valid: true })
      })

      it('allows Loop → Variable', () => {
        expect(isValidBlockConnection('loop', 'variable')).toEqual({ valid: true })
      })

      it('allows Loop → Assignment', () => {
        expect(isValidBlockConnection('loop', 'assignment')).toEqual({ valid: true })
      })

      it('allows Loop → EdgeCase', () => {
        expect(isValidBlockConnection('loop', 'edgeCase')).toEqual({ valid: true })
      })

      it('allows Condition → Assignment', () => {
        expect(isValidBlockConnection('condition', 'assignment')).toEqual({ valid: true })
      })

      it('allows Condition → Comparison', () => {
        expect(isValidBlockConnection('condition', 'comparison')).toEqual({ valid: true })
      })

      it('allows Condition → Return', () => {
        expect(isValidBlockConnection('condition', 'return')).toEqual({ valid: true })
      })

      it('allows Condition → EdgeCase', () => {
        expect(isValidBlockConnection('condition', 'edgeCase')).toEqual({ valid: true })
      })

      it('allows Comparison → Condition', () => {
        expect(isValidBlockConnection('comparison', 'condition')).toEqual({ valid: true })
      })

      it('allows Comparison → Assignment', () => {
        expect(isValidBlockConnection('comparison', 'assignment')).toEqual({ valid: true })
      })

      it('allows Comparison → Return', () => {
        expect(isValidBlockConnection('comparison', 'return')).toEqual({ valid: true })
      })

      it('allows Variable → Comparison', () => {
        expect(isValidBlockConnection('variable', 'comparison')).toEqual({ valid: true })
      })

      it('allows Variable → Assignment', () => {
        expect(isValidBlockConnection('variable', 'assignment')).toEqual({ valid: true })
      })

      it('allows Assignment → Return', () => {
        expect(isValidBlockConnection('assignment', 'return')).toEqual({ valid: true })
      })

      it('allows Assignment → Comparison', () => {
        expect(isValidBlockConnection('assignment', 'comparison')).toEqual({ valid: true })
      })

      it('allows EdgeCase → Condition', () => {
        expect(isValidBlockConnection('edgeCase', 'condition')).toEqual({ valid: true })
      })

      it('allows EdgeCase → Comparison', () => {
        expect(isValidBlockConnection('edgeCase', 'comparison')).toEqual({ valid: true })
      })

      it('allows EdgeCase → Assignment', () => {
        expect(isValidBlockConnection('edgeCase', 'assignment')).toEqual({ valid: true })
      })
    })

    describe('invalid connections', () => {
      it('rejects self-connections', () => {
        const result = isValidBlockConnection('loop', 'loop')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('itself')
      })

      it('rejects Return → any (terminal block)', () => {
        const result = isValidBlockConnection('return', 'condition')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('terminal')
      })

      it('rejects Loop → Return (not in compatibility list)', () => {
        const result = isValidBlockConnection('loop', 'return')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('incompatible types')
      })

      it('rejects Variable → Condition (not in compatibility list)', () => {
        const result = isValidBlockConnection('variable', 'condition')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('incompatible types')
      })

      it('rejects Variable → Return (not in compatibility list)', () => {
        const result = isValidBlockConnection('variable', 'return')
        expect(result.valid).toBe(false)
      })

      it('rejects Return → Return (self-connection + terminal)', () => {
        const result = isValidBlockConnection('return', 'return')
        expect(result.valid).toBe(false)
      })

      it('rejects Condition → Loop (not in compatibility list)', () => {
        const result = isValidBlockConnection('condition', 'loop')
        expect(result.valid).toBe(false)
      })

      it('rejects Comparison → Loop (not in compatibility list)', () => {
        const result = isValidBlockConnection('comparison', 'loop')
        expect(result.valid).toBe(false)
      })

      it('rejects Assignment → Loop (not in compatibility list)', () => {
        const result = isValidBlockConnection('assignment', 'loop')
        expect(result.valid).toBe(false)
      })

      it('rejects EdgeCase → Loop (not in compatibility list)', () => {
        const result = isValidBlockConnection('edgeCase', 'loop')
        expect(result.valid).toBe(false)
      })

      it('rejects EdgeCase → Return (not in compatibility list)', () => {
        const result = isValidBlockConnection('edgeCase', 'return')
        expect(result.valid).toBe(false)
      })
    })

    describe('all block type pairs', () => {
      const allTypes: BlockType[] = ['loop', 'condition', 'comparison', 'variable', 'assignment', 'return', 'edgeCase']

      it('every combination returns a result', () => {
        for (const from of allTypes) {
          for (const to of allTypes) {
            const result = isValidBlockConnection(from, to)
            expect(result).toHaveProperty('valid')
            expect(typeof result.valid).toBe('boolean')
          }
        }
      })

      it('no valid connection is self-referential', () => {
        for (const from of allTypes) {
          const result = isValidBlockConnection(from, from)
          expect(result.valid).toBe(false)
        }
      })

      it('valid connections match the compatibility matrix', () => {
        for (const from of allTypes) {
          for (const to of allTypes) {
            const result = isValidBlockConnection(from, to)
            const expected = COMPATIBLE_CONNECTIONS[from]?.includes(to) ?? false
            expect(result.valid).toBe(expected)
          }
        }
      })
    })
  })

  describe('getConnectionRules', () => {
    it('returns all 49 rules (7x7)', () => {
      const rules = getConnectionRules()
      expect(rules).toHaveLength(49)
    })

    it('every rule has fromType, toType, and allowed', () => {
      const rules = getConnectionRules()
      for (const rule of rules) {
        expect(rule).toHaveProperty('fromType')
        expect(rule).toHaveProperty('toType')
        expect(rule).toHaveProperty('allowed')
        expect(typeof rule.allowed).toBe('boolean')
      }
    })

    it('invalid rules include a reason', () => {
      const rules = getConnectionRules()
      const invalidRules = rules.filter((r) => !r.allowed)
      for (const rule of invalidRules) {
        expect(rule.reason).toBeTruthy()
      }
    })
  })

  describe('COMPATIBLE_CONNECTIONS', () => {
    it('Return has no outgoing connections', () => {
      expect(COMPATIBLE_CONNECTIONS.return).toEqual([])
    })

    it('all types are defined as keys', () => {
      const expectedTypes: BlockType[] = ['loop', 'condition', 'comparison', 'variable', 'assignment', 'return', 'edgeCase']
      for (const t of expectedTypes) {
        expect(COMPATIBLE_CONNECTIONS).toHaveProperty(t)
      }
    })
  })

  describe('BLOCK_LABELS', () => {
    it('all block types have labels', () => {
      const allTypes: BlockType[] = ['loop', 'condition', 'comparison', 'variable', 'assignment', 'return', 'edgeCase']
      for (const t of allTypes) {
        expect(BLOCK_LABELS[t]).toBeTruthy()
        expect(typeof BLOCK_LABELS[t]).toBe('string')
      }
    })
  })
})