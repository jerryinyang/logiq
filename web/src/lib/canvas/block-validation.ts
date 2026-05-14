import type { BlockType } from '@/types/canvas-types'

export interface ConnectionRule {
  fromType: BlockType
  toType: BlockType
  allowed: boolean
  reason?: string
}

type CompatibilityMatrix = Record<BlockType, BlockType[]>

const COMPATIBLE_CONNECTIONS: CompatibilityMatrix = {
  loop: ['condition', 'comparison', 'variable', 'assignment', 'edgeCase'],
  condition: ['assignment', 'comparison', 'return', 'edgeCase'],
  comparison: ['condition', 'assignment', 'return'],
  variable: ['comparison', 'assignment'],
  assignment: ['return', 'comparison'],
  return: [],
  edgeCase: ['condition', 'comparison', 'assignment'],
}

const BLOCK_LABELS: Record<BlockType, string> = {
  loop: 'Loop',
  condition: 'Condition',
  comparison: 'Comparison',
  variable: 'Variable',
  assignment: 'Assignment',
  return: 'Return',
  edgeCase: 'Edge Case',
}

export function isValidBlockConnection(
  fromType: BlockType,
  toType: BlockType
): { valid: boolean; reason?: string } {
  if (fromType === toType) {
    return { valid: false, reason: 'Cannot connect a block to itself' }
  }

  const allowedTargets = COMPATIBLE_CONNECTIONS[fromType]
  if (!allowedTargets) {
    return {
      valid: false,
      reason: `Cannot connect ${BLOCK_LABELS[fromType]} to ${BLOCK_LABELS[toType]} — incompatible types`,
    }
  }

  if (allowedTargets.length === 0) {
    return {
      valid: false,
      reason: `${BLOCK_LABELS[fromType]} is a terminal block with no valid outgoing connections`,
    }
  }

  if (!allowedTargets.includes(toType)) {
    return {
      valid: false,
      reason: `Cannot connect ${BLOCK_LABELS[fromType]} to ${BLOCK_LABELS[toType]} — incompatible types`,
    }
  }

  return { valid: true }
}

export function getConnectionRules(): ConnectionRule[] {
  const allTypes: BlockType[] = ['loop', 'condition', 'comparison', 'variable', 'assignment', 'return', 'edgeCase']
  const rules: ConnectionRule[] = []

  for (const fromType of allTypes) {
    for (const toType of allTypes) {
      const { valid, reason } = isValidBlockConnection(fromType, toType)
      rules.push({ fromType, toType, allowed: valid, reason })
    }
  }

  return rules
}

export { COMPATIBLE_CONNECTIONS, BLOCK_LABELS }