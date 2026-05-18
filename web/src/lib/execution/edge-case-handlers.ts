import type { EdgeCaseType } from '@/types/canvas-types'

export interface EdgeCaseResult {
  hit: boolean
  value?: unknown
}

export function handleEmptyInput(input: unknown): EdgeCaseResult {
  if (input === null || input === undefined) {
    return { hit: true, value: '' }
  }
  if (Array.isArray(input) && input.length === 0) {
    return { hit: true, value: [] }
  }
  if (typeof input === 'string' && input.length === 0) {
    return { hit: true, value: '' }
  }
  return { hit: false }
}

export function handleSingleElement(input: unknown): EdgeCaseResult {
  if (Array.isArray(input) && input.length === 1) {
    return { hit: true, value: input[0] }
  }
  return { hit: false }
}

export function handleAlreadySorted(input: unknown): EdgeCaseResult {
  if (!Array.isArray(input)) {
    return { hit: false }
  }
  const isSorted = input.every((v, i) => i === 0 || v >= input[i - 1])
  if (isSorted) {
    return { hit: true, value: input }
  }
  return { hit: false }
}

export function handleDuplicates(input: unknown): EdgeCaseResult {
  if (!Array.isArray(input)) {
    return { hit: false }
  }
  const hasDuplicates = new Set(input).size !== input.length
  if (hasDuplicates) {
    return { hit: true, value: [...new Set(input)] }
  }
  return { hit: false }
}

export function handleMaxValue(input: unknown, max?: number): EdgeCaseResult {
  const maxValue = max ?? Number.MAX_SAFE_INTEGER
  if (Array.isArray(input)) {
    if (input.some((v) => typeof v === 'number' && v > maxValue)) {
      return { hit: true, value: input.map((v) => (typeof v === 'number' && v > maxValue ? maxValue : v)) }
    }
    return { hit: false }
  }
  if (typeof input === 'number' && input > maxValue) {
    return { hit: true, value: maxValue }
  }
  if (input === Number.MAX_SAFE_INTEGER || input === Infinity) {
    return { hit: true, value: Number.MAX_SAFE_INTEGER }
  }
  return { hit: false }
}

export function evaluateEdgeCase(
  edgeCaseType: EdgeCaseType,
  input: unknown,
  config?: Record<string, unknown>
): EdgeCaseResult {
  switch (edgeCaseType) {
    case 'emptyInput':
      return handleEmptyInput(input)
    case 'singleElement':
      return handleSingleElement(input)
    case 'alreadySorted':
      return handleAlreadySorted(input)
    case 'duplicates':
      return handleDuplicates(input)
    case 'maxValue':
      return handleMaxValue(input, config?.max as number | undefined)
    default:
      return { hit: false }
  }
}