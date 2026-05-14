import type { Node, Edge } from '@xyflow/react'

export type BlockType =
  | 'loop'
  | 'condition'
  | 'comparison'
  | 'assignment'
  | 'return'
  | 'variable'
  | 'edgeCase'

export interface BlockCategory {
  type: BlockType
  label: string
  color: string
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  { type: 'loop', label: 'Loop', color: '#0EA5E9' },
  { type: 'condition', label: 'Condition', color: '#F59E0B' },
  { type: 'comparison', label: 'Comparison', color: '#6366F1' },
  { type: 'variable', label: 'Variable', color: '#10B981' },
  { type: 'assignment', label: 'Assignment', color: '#8B5CF6' },
  { type: 'return', label: 'Return', color: '#F43F5E' },
  { type: 'edgeCase', label: 'Edge Case', color: '#F59E0B' },
]

export const BLOCK_CATEGORY_MAP: Record<BlockType, BlockCategory> = Object.fromEntries(
  BLOCK_CATEGORIES.map((c) => [c.type, c])
) as Record<BlockType, BlockCategory>

export interface BlockConnections {
  input: string[]
  output: string[]
}

export interface LogicBlock {
  id: string
  type: BlockType
  category: BlockCategory
  label: string
  description: string
  position: CanvasPosition
  connections: BlockConnections
}

export interface LogicBlockNodeData {
  block: LogicBlock
  [key: string]: unknown
}

export type CanvasStatus = 'idle' | 'loading' | 'success' | 'error'

export interface CanvasPosition {
  x: number
  y: number
}

export interface CanvasViewport {
  x: number
  y: number
  zoom: number
}

export interface CanvasNode {
  id: string
  type: BlockType
  label: string
  position: CanvasPosition
  data: Record<string, unknown>
}

export interface CanvasEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: 'default' | 'step' | 'smoothstep' | 'straight'
  animated?: boolean
  data?: Record<string, unknown>
}

export interface HistoryEntry {
  timestamp: number
  nodes: Node[]
  edges: Edge[]
}

export interface CanvasState {
  zoom: number
  viewport: CanvasViewport
  selectedBlockIds: string[]
  canUndo: boolean
  canRedo: boolean
  historyStack: HistoryEntry[]
  status: CanvasStatus
}