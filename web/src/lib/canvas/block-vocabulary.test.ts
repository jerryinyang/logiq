import { describe, it, expect } from 'vitest'
import { BLOCK_VOCABULARY, BLOCKS_BY_CATEGORY } from './block-vocabulary'
import { BLOCK_CATEGORIES } from '@/types/canvas-types'
import type { BlockType } from '@/types/canvas-types'

describe('block-vocabulary', () => {
  it('has all block categories with blocks represented', () => {
    const vocabularyTypes = new Set(BLOCK_VOCABULARY.map((b) => b.type))
    for (const category of BLOCK_CATEGORIES) {
      if (category.type === 'return') continue
      expect(vocabularyTypes.has(category.type)).toBe(true)
    }
  })

  it('has blocks for every populated category', () => {
    for (const category of BLOCK_CATEGORIES) {
      const blocks = BLOCKS_BY_CATEGORY[category.type]
      if (category.type === 'return') {
        expect(blocks).toEqual([])
        continue
      }
      expect(blocks.length).toBeGreaterThan(0)
    }
  })

  it('each block has required fields', () => {
    for (const block of BLOCK_VOCABULARY) {
      expect(block.type).toBeDefined()
      expect(block.label).toBeTruthy()
      expect(block.description).toBeTruthy()
      expect(block.category).toBeDefined()
      expect(block.category.type).toBe(block.type)
      expect(block.category.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(block.category.label).toBeTruthy()
    }
  })

  it('loop category has expected blocks', () => {
    const loopBlocks = BLOCKS_BY_CATEGORY['loop']
    expect(loopBlocks).toHaveLength(3)
    expect(loopBlocks.map((b) => b.label)).toContain('For Each Item')
    expect(loopBlocks.map((b) => b.label)).toContain('While Condition True')
    expect(loopBlocks.map((b) => b.label)).toContain('Iterate N Times')
  })

  it('condition category has expected blocks', () => {
    const conditionBlocks = BLOCKS_BY_CATEGORY['condition']
    expect(conditionBlocks).toHaveLength(3)
    expect(conditionBlocks.map((b) => b.label)).toContain('If Condition')
    expect(conditionBlocks.map((b) => b.label)).toContain('If-Else Branch')
    expect(conditionBlocks.map((b) => b.label)).toContain('Switch Case')
  })

  it('comparison category has expected blocks', () => {
    const comparisonBlocks = BLOCKS_BY_CATEGORY['comparison']
    expect(comparisonBlocks).toHaveLength(4)
  })

  it('variable category has expected blocks', () => {
    const variableBlocks = BLOCKS_BY_CATEGORY['variable']
    expect(variableBlocks).toHaveLength(3)
  })

  it('assignment category has expected blocks', () => {
    const assignmentBlocks = BLOCKS_BY_CATEGORY['assignment']
    expect(assignmentBlocks).toHaveLength(3)
  })

  it('edgeCase category has expected blocks', () => {
    const edgeCaseBlocks = BLOCKS_BY_CATEGORY['edgeCase']
    expect(edgeCaseBlocks).toHaveLength(5)
  })

  it('return category exists but may be empty', () => {
    expect(Array.isArray(BLOCKS_BY_CATEGORY['return'])).toBe(true)
  })
})