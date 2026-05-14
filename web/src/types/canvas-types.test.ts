import { describe, it, expect } from 'vitest'
import {
  BLOCK_CATEGORIES,
  BLOCK_CATEGORY_MAP,
  type BlockType,
  type BlockCategory,
  type LogicBlock,
  type LogicBlockNodeData,
} from './canvas-types'

describe('canvas-types', () => {
  describe('BLOCK_CATEGORIES', () => {
    it('has 7 categories', () => {
      expect(BLOCK_CATEGORIES).toHaveLength(7)
    })

    it('each category has type, label, and color', () => {
      for (const cat of BLOCK_CATEGORIES) {
        expect(cat.type).toBeDefined()
        expect(cat.label).toBeTruthy()
        expect(cat.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    })

    it('contains expected category types', () => {
      const types = BLOCK_CATEGORIES.map((c) => c.type)
      expect(types).toContain('loop')
      expect(types).toContain('condition')
      expect(types).toContain('comparison')
      expect(types).toContain('assignment')
      expect(types).toContain('return')
      expect(types).toContain('variable')
      expect(types).toContain('edgeCase')
    })

    it('has correct colors per category', () => {
      const loop = BLOCK_CATEGORIES.find((c) => c.type === 'loop')
      expect(loop?.color).toBe('#0EA5E9')
      const condition = BLOCK_CATEGORIES.find((c) => c.type === 'condition')
      expect(condition?.color).toBe('#F59E0B')
      const comparison = BLOCK_CATEGORIES.find((c) => c.type === 'comparison')
      expect(comparison?.color).toBe('#6366F1')
    })
  })

  describe('BLOCK_CATEGORY_MAP', () => {
    it('maps each BlockType to its category', () => {
      for (const cat of BLOCK_CATEGORIES) {
        expect(BLOCK_CATEGORY_MAP[cat.type]).toEqual(cat)
      }
    })
  })

  describe('type compatibility', () => {
    it('BlockType includes all required values', () => {
      const types: BlockType[] = ['loop', 'condition', 'comparison', 'assignment', 'return', 'variable', 'edgeCase']
      expect(types).toHaveLength(7)
    })

    it('LogicBlock interface is satisfiable', () => {
      const block: LogicBlock = {
        id: 'test',
        type: 'loop',
        category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
        label: 'For Each Item',
        description: 'Iterate over items',
        position: { x: 0, y: 0 },
        connections: { input: [], output: [] },
      }
      expect(block.id).toBe('test')
    })

    it('LogicBlockNodeData interface is satisfiable', () => {
      const data: LogicBlockNodeData = {
        block: {
          id: 'test',
          type: 'loop',
          category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
          label: 'For Each Item',
          description: 'Iterate over items',
          position: { x: 0, y: 0 },
          connections: { input: [], output: [] },
        },
      }
      expect(data.block.type).toBe('loop')
    })
  })
})