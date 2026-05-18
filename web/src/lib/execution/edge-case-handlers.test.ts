import { describe, it, expect } from 'vitest'
import {
  handleEmptyInput,
  handleSingleElement,
  handleAlreadySorted,
  handleDuplicates,
  handleMaxValue,
  evaluateEdgeCase,
} from './edge-case-handlers'

describe('edge-case-handlers', () => {
  describe('handleEmptyInput', () => {
    it('detects null as empty', () => {
      expect(handleEmptyInput(null)).toEqual({ hit: true, value: '' })
    })

    it('detects undefined as empty', () => {
      expect(handleEmptyInput(undefined)).toEqual({ hit: true, value: '' })
    })

    it('detects empty array as empty', () => {
      expect(handleEmptyInput([])).toEqual({ hit: true, value: [] })
    })

    it('detects empty string as empty', () => {
      expect(handleEmptyInput('')).toEqual({ hit: true, value: '' })
    })

    it('does not detect non-empty array as empty', () => {
      expect(handleEmptyInput([1, 2, 3])).toEqual({ hit: false })
    })

    it('does not detect non-empty string as empty', () => {
      expect(handleEmptyInput('hello')).toEqual({ hit: false })
    })

    it('does not detect number as empty', () => {
      expect(handleEmptyInput(42)).toEqual({ hit: false })
    })

    it('does not detect zero as empty', () => {
      expect(handleEmptyInput(0)).toEqual({ hit: false })
    })
  })

  describe('handleSingleElement', () => {
    it('detects single element array', () => {
      expect(handleSingleElement([42])).toEqual({ hit: true, value: 42 })
    })

    it('detects single element array with object', () => {
      expect(handleSingleElement([{ a: 1 }])).toEqual({ hit: true, value: { a: 1 } })
    })

    it('does not detect empty array as single element', () => {
      expect(handleSingleElement([])).toEqual({ hit: false })
    })

    it('does not detect multi-element array as single element', () => {
      expect(handleSingleElement([1, 2])).toEqual({ hit: false })
    })

    it('does not detect non-array as single element', () => {
      expect(handleSingleElement('hello')).toEqual({ hit: false })
    })

    it('does not detect number as single element', () => {
      expect(handleSingleElement(42)).toEqual({ hit: false })
    })
  })

  describe('handleAlreadySorted', () => {
    it('detects sorted ascending array', () => {
      expect(handleAlreadySorted([1, 2, 3])).toEqual({ hit: true, value: [1, 2, 3] })
    })

    it('detects single element array as sorted', () => {
      expect(handleAlreadySorted([42])).toEqual({ hit: true, value: [42] })
    })

    it('detects empty array as sorted', () => {
      expect(handleAlreadySorted([])).toEqual({ hit: true, value: [] })
    })

    it('detects array with equal consecutive elements as sorted', () => {
      expect(handleAlreadySorted([1, 1, 2, 3])).toEqual({ hit: true, value: [1, 1, 2, 3] })
    })

    it('does not detect unsorted array as sorted', () => {
      expect(handleAlreadySorted([3, 1, 2])).toEqual({ hit: false })
    })

    it('does not detect descending array as sorted', () => {
      expect(handleAlreadySorted([3, 2, 1])).toEqual({ hit: false })
    })

    it('does not detect non-array as sorted', () => {
      expect(handleAlreadySorted('abc')).toEqual({ hit: false })
    })

    it('does not detect number as sorted', () => {
      expect(handleAlreadySorted(42)).toEqual({ hit: false })
    })
  })

  describe('handleDuplicates', () => {
    it('detects duplicates in array', () => {
      expect(handleDuplicates([1, 2, 2])).toEqual({ hit: true, value: [1, 2] })
    })

    it('detects duplicates with multiple occurrences', () => {
      expect(handleDuplicates([1, 1, 1])).toEqual({ hit: true, value: [1] })
    })

    it('does not detect duplicates in array with unique elements', () => {
      expect(handleDuplicates([1, 2, 3])).toEqual({ hit: false })
    })

    it('does not detect duplicates in empty array', () => {
      expect(handleDuplicates([])).toEqual({ hit: false })
    })

    it('does not detect duplicates in single element array', () => {
      expect(handleDuplicates([42])).toEqual({ hit: false })
    })

    it('does not detect duplicates in non-array', () => {
      expect(handleDuplicates('hello')).toEqual({ hit: false })
    })

    it('does not detect duplicates in number', () => {
      expect(handleDuplicates(42)).toEqual({ hit: false })
    })
  })

  describe('handleMaxValue', () => {
    it('detects max safe integer', () => {
      expect(handleMaxValue(Number.MAX_SAFE_INTEGER)).toEqual({
        hit: true,
        value: Number.MAX_SAFE_INTEGER,
      })
    })

    it('detects Infinity', () => {
      expect(handleMaxValue(Infinity)).toEqual({
        hit: true,
        value: Number.MAX_SAFE_INTEGER,
      })
    })

    it('detects value exceeding custom max', () => {
      expect(handleMaxValue(150, 100)).toEqual({ hit: true, value: 100 })
    })

    it('detects max value in array', () => {
      expect(handleMaxValue([50, 150, 75], 100)).toEqual({
        hit: true,
        value: [50, 100, 75],
      })
    })

    it('does not detect value within max', () => {
      expect(handleMaxValue(50, 100)).toEqual({ hit: false })
    })

    it('does not detect array within max', () => {
      expect(handleMaxValue([50, 75, 90], 100)).toEqual({ hit: false })
    })

    it('does not detect normal number as max', () => {
      expect(handleMaxValue(42)).toEqual({ hit: false })
    })

    it('clamps array values exceeding max', () => {
      expect(handleMaxValue([10, 200, 30], 100)).toEqual({
        hit: true,
        value: [10, 100, 30],
      })
    })
  })

  describe('evaluateEdgeCase', () => {
    it('dispatches to handleEmptyInput for emptyInput type', () => {
      expect(evaluateEdgeCase('emptyInput', null)).toEqual({ hit: true, value: '' })
      expect(evaluateEdgeCase('emptyInput', [1, 2, 3])).toEqual({ hit: false })
    })

    it('dispatches to handleSingleElement for singleElement type', () => {
      expect(evaluateEdgeCase('singleElement', [42])).toEqual({ hit: true, value: 42 })
      expect(evaluateEdgeCase('singleElement', [1, 2])).toEqual({ hit: false })
    })

    it('dispatches to handleAlreadySorted for alreadySorted type', () => {
      expect(evaluateEdgeCase('alreadySorted', [1, 2, 3])).toEqual({ hit: true, value: [1, 2, 3] })
      expect(evaluateEdgeCase('alreadySorted', [3, 1, 2])).toEqual({ hit: false })
    })

    it('dispatches to handleDuplicates for duplicates type', () => {
      expect(evaluateEdgeCase('duplicates', [1, 2, 2])).toEqual({ hit: true, value: [1, 2] })
      expect(evaluateEdgeCase('duplicates', [1, 2, 3])).toEqual({ hit: false })
    })

    it('dispatches to handleMaxValue for maxValue type', () => {
      expect(evaluateEdgeCase('maxValue', Number.MAX_SAFE_INTEGER)).toEqual({
        hit: true,
        value: Number.MAX_SAFE_INTEGER,
      })
      expect(evaluateEdgeCase('maxValue', 42)).toEqual({ hit: false })
    })

    it('passes config max to handleMaxValue', () => {
      expect(evaluateEdgeCase('maxValue', 150, { max: 100 })).toEqual({ hit: true, value: 100 })
      expect(evaluateEdgeCase('maxValue', 50, { max: 100 })).toEqual({ hit: false })
    })

    it('returns hit false for unknown edge case type', () => {
      expect(evaluateEdgeCase('unknown' as any, [1, 2, 3])).toEqual({ hit: false })
    })
  })
})