import { describe, it, expect } from 'vitest'
import { EDGE_CASE_TYPES, EDGE_CASE_META } from './edge-cases'

describe('edge-cases', () => {
  describe('EDGE_CASE_TYPES', () => {
    it('contains all five edge case types', () => {
      expect(EDGE_CASE_TYPES).toHaveLength(5)
      expect(EDGE_CASE_TYPES).toContain('emptyInput')
      expect(EDGE_CASE_TYPES).toContain('singleElement')
      expect(EDGE_CASE_TYPES).toContain('alreadySorted')
      expect(EDGE_CASE_TYPES).toContain('duplicates')
      expect(EDGE_CASE_TYPES).toContain('maxValue')
    })
  })

  describe('EDGE_CASE_META', () => {
    it('has metadata for each edge case type', () => {
      for (const type of EDGE_CASE_TYPES) {
        expect(EDGE_CASE_META[type]).toBeDefined()
        expect(EDGE_CASE_META[type].name).toBeTruthy()
        expect(EDGE_CASE_META[type].description).toBeTruthy()
        expect(EDGE_CASE_META[type].icon).toBeTruthy()
      }
    })

    it('has correct names for each type', () => {
      expect(EDGE_CASE_META.emptyInput.name).toBe('Empty Input')
      expect(EDGE_CASE_META.singleElement.name).toBe('Single Element')
      expect(EDGE_CASE_META.alreadySorted.name).toBe('Already Sorted')
      expect(EDGE_CASE_META.duplicates.name).toBe('Duplicates')
      expect(EDGE_CASE_META.maxValue.name).toBe('Max Value')
    })
  })
})