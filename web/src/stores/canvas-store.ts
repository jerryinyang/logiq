import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { CanvasState, CanvasViewport, HistoryEntry, BlockType, BlockCategory, ConnectionValidationError } from '@/types/canvas-types'
import type { TestStatus, TestResult, ExecutionStep } from '@/types/execution-types'
import type { Node, Edge, XYPosition } from '@xyflow/react'
import { isValidBlockConnection } from '@/lib/canvas/block-validation'
import { wouldCreateCycle } from '@/lib/canvas/cycle-detection'

const MAX_HISTORY = 50

interface ValidationResult {
  valid: boolean
  error?: ConnectionValidationError
  reason?: string
}

interface CanvasStoreState extends Omit<CanvasState, 'viewport'> {
  viewport: CanvasViewport
  nodes: Node[]
  edges: Edge[]
  lastValidationError: string | null
  redoStack: HistoryEntry[]
  testStatus: TestStatus
  testResults: TestResult[] | null
  executionSteps: ExecutionStep[] | null
  pushHistory: (nodes: Node[], edges: Edge[]) => void
  setNodes: (nodesOrUpdater: Node[] | ((prev: Node[]) => Node[])) => void
  setEdges: (edgesOrUpdater: Edge[] | ((prev: Edge[]) => Edge[])) => void
  addBlock: (blockData: { id: string; type: BlockType; label: string; description: string; category: BlockCategory }, position: XYPosition) => void
  removeBlock: (blockId: string) => void
  removeBlocks: (blockIds: string[]) => void
  duplicateBlock: (blockId: string) => void
  getBlocksByCategory: (category: BlockType) => Node[]
  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  validateConnection: (sourceId: string, targetId: string, sourceHandleType?: string, targetHandleType?: string) => ValidationResult
  getBlockGraph: () => { nodes: Node[]; edges: Edge[] }
  setLastValidationError: (error: string | null) => void
  setSelectedBlockIds: (ids: string[]) => void
  setZoom: (zoom: number) => void
  setViewport: (viewport: CanvasViewport) => void
  undo: () => void
  redo: () => void
  setTestStatus: (status: TestStatus) => void
  setTestResults: (results: TestResult[] | null) => void
  setExecutionSteps: (steps: ExecutionStep[] | null) => void
  resetTest: () => void
}

const initialViewport: CanvasViewport = { x: 0, y: 0, zoom: 1 }

export const useCanvasStore = create<CanvasStoreState>()(
  immer((set, get) => ({
    zoom: 1,
    viewport: initialViewport,
    selectedBlockIds: [],
    canUndo: false,
    canRedo: false,
    historyStack: [],
    redoStack: [],
    status: 'idle',
    nodes: [],
    edges: [],
    lastValidationError: null,
    testStatus: 'idle' as TestStatus,
    testResults: null,
    executionSteps: null,

    setNodes: (nodesOrUpdater: Node[] | ((prev: Node[]) => Node[])) => {
      set((state) => {
        state.nodes = typeof nodesOrUpdater === 'function'
          ? (nodesOrUpdater as (prev: Node[]) => Node[])(state.nodes)
          : nodesOrUpdater
      })
    },

    setEdges: (edgesOrUpdater: Edge[] | ((prev: Edge[]) => Edge[])) => {
      set((state) => {
        state.edges = typeof edgesOrUpdater === 'function'
          ? (edgesOrUpdater as (prev: Edge[]) => Edge[])(state.edges)
          : edgesOrUpdater
      })
    },

    pushHistory: (nodes: Node[], edges: Edge[]) => {
      set((state) => {
        const entry: HistoryEntry = {
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        }
        state.historyStack.push(entry)
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.canUndo = state.historyStack.length > 1
        state.canRedo = false
      })
    },

    addBlock: (blockData, position: XYPosition) => {
      const state = get()
      const currentNodes = [...state.nodes]
      const currentEdges = [...state.edges]

      const snapPosition = {
        x: Math.round(position.x / 16) * 16,
        y: Math.round(position.y / 16) * 16,
      }

      const newNode: Node = {
        id: blockData.id,
        type: 'logicBlock',
        position: snapPosition,
        data: {
          block: {
            id: blockData.id,
            type: blockData.type,
            category: blockData.category,
            label: blockData.label,
            description: blockData.description,
            connections: { input: [], output: [] },
          },
        },
      }

      set((state) => {
        state.historyStack.push({
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.nodes = [...currentNodes, newNode]
        state.edges = currentEdges
        state.redoStack = []
        state.canUndo = true
        state.canRedo = false
      })
    },

    removeBlock: (blockId: string) => {
      const state = get()
      const currentNodes = [...state.nodes]
      const currentEdges = [...state.edges]

      set((state) => {
        state.historyStack.push({
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.nodes = currentNodes.filter((n) => n.id !== blockId)
        state.edges = currentEdges.filter((e) => e.source !== blockId && e.target !== blockId)
        state.selectedBlockIds = state.selectedBlockIds.filter((id) => id !== blockId)
        state.redoStack = []
        state.canUndo = true
        state.canRedo = false
      })
    },

    removeBlocks: (blockIds: string[]) => {
      const state = get()
      const currentNodes = [...state.nodes]
      const currentEdges = [...state.edges]
      const idSet = new Set(blockIds)

      set((state) => {
        state.historyStack.push({
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.nodes = currentNodes.filter((n) => !idSet.has(n.id))
        state.edges = currentEdges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target))
        state.selectedBlockIds = state.selectedBlockIds.filter((id) => !idSet.has(id))
        state.redoStack = []
        state.canUndo = true
        state.canRedo = false
      })
    },

    duplicateBlock: (blockId: string) => {
      const state = get()
      const sourceNode = state.nodes.find((n) => n.id === blockId)
      if (!sourceNode) return

      const sourceData = sourceNode.data as Record<string, unknown> | undefined
      const sourceBlock = sourceData?.block as Record<string, unknown> | undefined
      if (!sourceBlock) return

      const currentNodes = [...state.nodes]
      const currentEdges = [...state.edges]
      const newId = crypto.randomUUID()
      const offsetPosition = {
        x: Math.round(((sourceNode.position?.x ?? 0) + 32) / 16) * 16,
        y: Math.round(((sourceNode.position?.y ?? 0) + 32) / 16) * 16,
      }

      const newNode: Node = {
        id: newId,
        type: sourceNode.type,
        position: offsetPosition,
        data: {
          ...JSON.parse(JSON.stringify(sourceNode.data)),
          block: {
            ...sourceBlock,
            id: newId,
            connections: { input: [], output: [] },
          },
        },
      }

      set((state) => {
        state.historyStack.push({
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.nodes = [...currentNodes, newNode]
        state.edges = currentEdges
        state.redoStack = []
        state.canUndo = true
        state.canRedo = false
      })
    },

    getBlocksByCategory: (category: BlockType) => {
      return get().nodes.filter(
        (node) => (node.data as Record<string, unknown>)?.block &&
          ((node.data as Record<string, unknown>).block as Record<string, unknown>)?.type === category
      )
    },

    addEdge: (edge: Edge) => {
      const state = get()
      const currentNodes = [...state.nodes]
      const currentEdges = [...state.edges]

      set((state) => {
        state.historyStack.push({
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.edges = [...currentEdges, edge]
        state.redoStack = []
        state.canUndo = true
        state.canRedo = false
        state.lastValidationError = null
      })
    },

    removeEdge: (edgeId: string) => {
      const state = get()
      const currentNodes = [...state.nodes]
      const currentEdges = [...state.edges]

      set((state) => {
        state.historyStack.push({
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        if (state.historyStack.length > MAX_HISTORY) {
          state.historyStack = state.historyStack.slice(-MAX_HISTORY)
        }
        state.edges = currentEdges.filter((e) => e.id !== edgeId)
        state.redoStack = []
        state.canUndo = true
        state.canRedo = false
      })
    },

    validateConnection: (sourceId: string, targetId: string, sourceHandleType?: string, targetHandleType?: string) => {
      const state = get()
      const sourceNode = state.nodes.find((n) => n.id === sourceId)
      const targetNode = state.nodes.find((n) => n.id === targetId)

      if (!sourceNode || !targetNode) {
        return { valid: false, error: 'incompatible-types' as ConnectionValidationError, reason: 'Source or target node not found' }
      }

      if (sourceId === targetId) {
        return { valid: false, error: 'self-connection' as ConnectionValidationError, reason: 'Cannot connect a block to itself' }
      }

      if (sourceHandleType === 'target' || targetHandleType === 'source') {
        return { valid: false, error: 'wrong-direction' as ConnectionValidationError, reason: 'Cannot connect — must connect output to input' }
      }

      const existingIncomer = state.edges.find((e) => e.target === targetId)
      if (existingIncomer) {
        return { valid: false, error: 'duplicate-input' as ConnectionValidationError, reason: 'This block already has an incoming connection' }
      }

      const sourceBlock = (sourceNode.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
      const targetBlock = (targetNode.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
      const sourceType = sourceBlock?.type as BlockType | undefined
      const targetType = targetBlock?.type as BlockType | undefined

      if (!sourceType || !targetType) {
        return { valid: false, error: 'incompatible-types' as ConnectionValidationError, reason: 'Invalid block types' }
      }

      const typeValidation = isValidBlockConnection(sourceType, targetType)
      if (!typeValidation.valid) {
        return { valid: false, error: 'incompatible-types' as ConnectionValidationError, reason: typeValidation.reason }
      }

      if (wouldCreateCycle(state.nodes, state.edges, { source: sourceId, target: targetId })) {
        return { valid: false, error: 'cycle-detected' as ConnectionValidationError, reason: 'Cannot create circular logic — this would cause infinite execution' }
      }

      return { valid: true }
    },

    getBlockGraph: () => {
      const state = get()
      return { nodes: state.nodes, edges: state.edges }
    },

    setLastValidationError: (error: string | null) => {
      set((state) => {
        state.lastValidationError = error
      })
    },

    setSelectedBlockIds: (ids: string[]) => {
      set((state) => {
        state.selectedBlockIds = ids
      })
    },

    setZoom: (zoom: number) => {
      set((state) => {
        state.zoom = Math.min(2, Math.max(0.5, zoom))
        state.viewport.zoom = state.zoom
      })
    },

    setViewport: (viewport: CanvasViewport) => {
      set((state) => {
        state.viewport = viewport
        state.zoom = viewport.zoom
      })
    },

    undo: () => {
      set((state) => {
        if (state.historyStack.length <= 1) return
        const prevState = state.historyStack.pop()
        if (!prevState) return
        const currentEntry: HistoryEntry = {
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
        }
        state.redoStack.push(currentEntry)
        state.nodes = prevState.nodes
        state.edges = prevState.edges
        state.canUndo = state.historyStack.length > 1
        state.canRedo = true
      })
    },

    redo: () => {
      set((state) => {
        if (state.redoStack.length === 0) return
        const nextState = state.redoStack.pop()
        if (!nextState) return
        const currentEntry: HistoryEntry = {
          timestamp: Date.now(),
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
        }
        state.historyStack.push(currentEntry)
        state.nodes = nextState.nodes
        state.edges = nextState.edges
        state.canUndo = state.historyStack.length > 1
        state.canRedo = state.redoStack.length > 0
      })
    },

    setTestStatus: (status: TestStatus) => {
      set((state) => {
        state.testStatus = status
      })
    },

    setTestResults: (results: TestResult[] | null) => {
      set((state) => {
        state.testResults = results
      })
    },

    setExecutionSteps: (steps: ExecutionStep[] | null) => {
      set((state) => {
        state.executionSteps = steps
      })
    },

    resetTest: () => {
      set((state) => {
        state.testStatus = 'idle'
        state.testResults = null
        state.executionSteps = null
      })
    },
  }))
)