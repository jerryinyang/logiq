import type { Node, Edge } from '@xyflow/react'

export type BlockType =
  | 'condition'
  | 'loop'
  | 'variable'
  | 'function'
  | 'output'
  | 'input'
  | 'operator'
  | 'comment'

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
