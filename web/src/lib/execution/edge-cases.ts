import type { EdgeCaseType } from '@/types/canvas-types'

export interface EdgeCaseMeta {
  type: EdgeCaseType
  name: string
  description: string
  icon: string
}

export const EDGE_CASE_TYPES: EdgeCaseType[] = [
  'emptyInput',
  'singleElement',
  'alreadySorted',
  'duplicates',
  'maxValue',
]

export const EDGE_CASE_META: Record<EdgeCaseType, EdgeCaseMeta> = {
  emptyInput: {
    type: 'emptyInput',
    name: 'Empty Input',
    description: 'Check for empty input or null',
    icon: 'AlertTriangle',
  },
  singleElement: {
    type: 'singleElement',
    name: 'Single Element',
    description: 'Check for a collection with only one element',
    icon: 'AlertTriangle',
  },
  alreadySorted: {
    type: 'alreadySorted',
    name: 'Already Sorted',
    description: 'Check for input already in sorted order',
    icon: 'AlertTriangle',
  },
  duplicates: {
    type: 'duplicates',
    name: 'Duplicates',
    description: 'Check for duplicate values in input',
    icon: 'AlertTriangle',
  },
  maxValue: {
    type: 'maxValue',
    name: 'Max Value',
    description: 'Check for values at the maximum boundary',
    icon: 'AlertTriangle',
  },
}