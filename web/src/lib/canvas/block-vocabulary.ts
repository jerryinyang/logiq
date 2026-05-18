import type { BlockType, BlockCategory, EdgeCaseType } from '@/types/canvas-types'
import { BLOCK_CATEGORY_MAP } from '@/types/canvas-types'

export interface BlockVocabularyEntry {
  type: BlockType
  label: string
  description: string
  category: BlockCategory
  edgeCaseType?: EdgeCaseType
}

const loopBlocks: BlockVocabularyEntry[] = [
  {
    type: 'loop',
    label: 'For Each Item',
    description: 'Iterate over each item in a collection and apply logic to it',
    category: BLOCK_CATEGORY_MAP.loop,
  },
  {
    type: 'loop',
    label: 'While Condition True',
    description: 'Repeat execution while a specified condition remains true',
    category: BLOCK_CATEGORY_MAP.loop,
  },
  {
    type: 'loop',
    label: 'Iterate N Times',
    description: 'Execute a block of logic a fixed number of times',
    category: BLOCK_CATEGORY_MAP.loop,
  },
]

const conditionBlocks: BlockVocabularyEntry[] = [
  {
    type: 'condition',
    label: 'If Condition',
    description: 'Execute logic only if a condition is true',
    category: BLOCK_CATEGORY_MAP.condition,
  },
  {
    type: 'condition',
    label: 'If-Else Branch',
    description: 'Choose between two branches based on a condition',
    category: BLOCK_CATEGORY_MAP.condition,
  },
  {
    type: 'condition',
    label: 'Switch Case',
    description: 'Branch logic based on multiple possible values',
    category: BLOCK_CATEGORY_MAP.condition,
  },
]

const comparisonBlocks: BlockVocabularyEntry[] = [
  {
    type: 'comparison',
    label: 'Equal To',
    description: 'Check if two values are exactly equal',
    category: BLOCK_CATEGORY_MAP.comparison,
  },
  {
    type: 'comparison',
    label: 'Greater Than',
    description: 'Check if one value is greater than another',
    category: BLOCK_CATEGORY_MAP.comparison,
  },
  {
    type: 'comparison',
    label: 'Less Than',
    description: 'Check if one value is less than another',
    category: BLOCK_CATEGORY_MAP.comparison,
  },
  {
    type: 'comparison',
    label: 'Contains',
    description: 'Check if a collection contains a specific value',
    category: BLOCK_CATEGORY_MAP.comparison,
  },
]

const variableBlocks: BlockVocabularyEntry[] = [
  {
    type: 'variable',
    label: 'Set Variable',
    description: 'Assign a value to a named variable',
    category: BLOCK_CATEGORY_MAP.variable,
  },
  {
    type: 'variable',
    label: 'Get Variable',
    description: 'Retrieve the value of a named variable',
    category: BLOCK_CATEGORY_MAP.variable,
  },
  {
    type: 'variable',
    label: 'Increment Variable',
    description: 'Increase a numeric variable by a specified amount',
    category: BLOCK_CATEGORY_MAP.variable,
  },
]

const assignmentBlocks: BlockVocabularyEntry[] = [
  {
    type: 'assignment',
    label: 'Assign Value',
    description: 'Compute and store a value into a target',
    category: BLOCK_CATEGORY_MAP.assignment,
  },
  {
    type: 'assignment',
    label: 'Return Result',
    description: 'Return a computed value as the output of a function',
    category: BLOCK_CATEGORY_MAP.assignment,
  },
  {
    type: 'assignment',
    label: 'Store in Collection',
    description: 'Add a value to a collection or data structure',
    category: BLOCK_CATEGORY_MAP.assignment,
  },
]

const edgeCaseBlocks: BlockVocabularyEntry[] = [
  {
    type: 'edgeCase',
    label: 'Empty Input',
    description: 'Handle the case where input is empty or null',
    category: BLOCK_CATEGORY_MAP.edgeCase,
    edgeCaseType: 'emptyInput',
  },
  {
    type: 'edgeCase',
    label: 'Single Element',
    description: 'Handle the case where a collection has only one element',
    category: BLOCK_CATEGORY_MAP.edgeCase,
    edgeCaseType: 'singleElement',
  },
  {
    type: 'edgeCase',
    label: 'Already Sorted',
    description: 'Handle the case where input is already in sorted order',
    category: BLOCK_CATEGORY_MAP.edgeCase,
    edgeCaseType: 'alreadySorted',
  },
  {
    type: 'edgeCase',
    label: 'Duplicates',
    description: 'Handle the case where input contains duplicate values',
    category: BLOCK_CATEGORY_MAP.edgeCase,
    edgeCaseType: 'duplicates',
  },
  {
    type: 'edgeCase',
    label: 'Max Value',
    description: 'Handle the case where a value reaches the maximum boundary',
    category: BLOCK_CATEGORY_MAP.edgeCase,
    edgeCaseType: 'maxValue',
  },
]

export const BLOCK_VOCABULARY: BlockVocabularyEntry[] = [
  ...loopBlocks,
  ...conditionBlocks,
  ...comparisonBlocks,
  ...variableBlocks,
  ...assignmentBlocks,
  ...edgeCaseBlocks,
]

export const BLOCKS_BY_CATEGORY: Record<BlockType, BlockVocabularyEntry[]> = {
  loop: loopBlocks,
  condition: conditionBlocks,
  comparison: comparisonBlocks,
  variable: variableBlocks,
  assignment: assignmentBlocks,
  return: [],
  edgeCase: edgeCaseBlocks,
}