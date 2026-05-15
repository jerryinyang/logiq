import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { CanvasState, CanvasViewport, BlockType, BlockCategory, ConnectionValidationError, DraftStatus } from '@/types/canvas-types'
import type { TestStatus, TestResult, ExecutionStep } from '@/types/execution-types'
import type { Node, Edge, XYPosition } from '@xyflow/react'
import { isValidBlockConnection } from '@/lib/canvas/block-validation'
import { wouldCreateCycle } from '@/lib/canvas/cycle-detection'
import { HistoryManager } from '@/lib/canvas/history-manager'

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
  redoStack: { timestamp: number; nodes: Node[]; edges: Edge[] }[]
  testStatus: TestStatus
  testResults: TestResult[] | null
  executionSteps: ExecutionStep[] | null
  currentStepIndex: number
  isPlaying: boolean
  stepThroughActive: boolean
  historyManager: HistoryManager
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
  pushHistory: (nodes: Node[], edges: Edge[]) => void
  undo: () => void
  redo: () => void
  setTestStatus: (status: TestStatus) => void
  setTestResults: (results: TestResult[] | null) => void
  setExecutionSteps: (steps: ExecutionStep[] | null) => void
  nextStep: () => void
  previousStep: () => void
  togglePlay: () => void
  resetSteps: () => void
  setStepThroughActive: (active: boolean) => void
  resetTest: () => void
  resetCanvas: () => void
  setDraftStatus: (status: DraftStatus) => void
}

const historyManager = new HistoryManager(50)

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
    currentStepIndex: -1,
    isPlaying: false,
    stepThroughActive: false,
    historyManager,
    draftStatus: 'none' as DraftStatus,
    resetCount: 0,

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
        const mgr = state.historyManager
        mgr.pushHistory(nodes, edges)
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
      })
    },

    addBlock: (blockData, position: XYPosition) => {
      const currentNodes = [...get().nodes]
      const currentEdges = [...get().edges]

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
        const mgr = state.historyManager
        mgr.pushHistory(currentNodes, currentEdges)
        state.nodes = [...currentNodes, newNode]
        state.edges = currentEdges
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
      })
    },

    removeBlock: (blockId: string) => {
      const currentNodes = [...get().nodes]
      const currentEdges = [...get().edges]

      set((state) => {
        const mgr = state.historyManager
        mgr.pushHistory(currentNodes, currentEdges)
        state.nodes = currentNodes.filter((n) => n.id !== blockId)
        state.edges = currentEdges.filter((e) => e.source !== blockId && e.target !== blockId)
        state.selectedBlockIds = state.selectedBlockIds.filter((id) => id !== blockId)
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
      })
    },

    removeBlocks: (blockIds: string[]) => {
      const currentNodes = [...get().nodes]
      const currentEdges = [...get().edges]
      const idSet = new Set(blockIds)

      set((state) => {
        const mgr = state.historyManager
        mgr.pushHistory(currentNodes, currentEdges)
        state.nodes = currentNodes.filter((n) => !idSet.has(n.id))
        state.edges = currentEdges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target))
        state.selectedBlockIds = state.selectedBlockIds.filter((id) => !idSet.has(id))
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
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
        const mgr = state.historyManager
        mgr.pushHistory(currentNodes, currentEdges)
        state.nodes = [...currentNodes, newNode]
        state.edges = currentEdges
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
      })
    },

    getBlocksByCategory: (category: BlockType) => {
      return get().nodes.filter(
        (node) => (node.data as Record<string, unknown>)?.block &&
          ((node.data as Record<string, unknown>).block as Record<string, unknown>)?.type === category
      )
    },

    addEdge: (edge: Edge) => {
      const currentNodes = [...get().nodes]
      const currentEdges = [...get().edges]

      set((state) => {
        const mgr = state.historyManager
        mgr.pushHistory(currentNodes, currentEdges)
        state.edges = [...currentEdges, edge]
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
        state.lastValidationError = null
      })
    },

    removeEdge: (edgeId: string) => {
      const currentNodes = [...get().nodes]
      const currentEdges = [...get().edges]

      set((state) => {
        const mgr = state.historyManager
        mgr.pushHistory(currentNodes, currentEdges)
        state.edges = currentEdges.filter((e) => e.id !== edgeId)
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
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
      const mgr = get().historyManager
      const result = mgr.undo()
      if (!result) return

      set((state) => {
        state.nodes = JSON.parse(JSON.stringify(result.nodes))
        state.edges = JSON.parse(JSON.stringify(result.edges))
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
      })
    },

    redo: () => {
      const mgr = get().historyManager
      const result = mgr.redo()
      if (!result) return

      set((state) => {
        state.nodes = JSON.parse(JSON.stringify(result.nodes))
        state.edges = JSON.parse(JSON.stringify(result.edges))
        state.historyStack = mgr.getSnapshotList() as { timestamp: number; nodes: Node[]; edges: Edge[] }[]
        state.canUndo = mgr.canUndo
        state.canRedo = mgr.canRedo
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
        state.currentStepIndex = steps && steps.length > 0 ? 0 : -1
        state.isPlaying = false
      })
    },

    nextStep: () => {
      set((state) => {
        if (!state.executionSteps) return
        const maxIndex = state.executionSteps.length - 1
        if (state.currentStepIndex < maxIndex) {
          state.currentStepIndex += 1
        }
      })
    },

    previousStep: () => {
      set((state) => {
        if (state.currentStepIndex > 0) {
          state.currentStepIndex -= 1
        }
      })
    },

    togglePlay: () => {
      set((state) => {
        state.isPlaying = !state.isPlaying
      })
    },

    resetSteps: () => {
      set((state) => {
        state.currentStepIndex = state.executionSteps && state.executionSteps.length > 0 ? 0 : -1
        state.isPlaying = false
      })
    },

    setStepThroughActive: (active: boolean) => {
      set((state) => {
        state.stepThroughActive = active
        if (active) {
          state.currentStepIndex = state.executionSteps && state.executionSteps.length > 0 ? 0 : -1
          state.isPlaying = false
        } else {
          state.isPlaying = false
        }
      })
    },

    resetTest: () => {
      set((state) => {
        state.testStatus = 'idle'
        state.testResults = null
        state.executionSteps = null
        state.currentStepIndex = -1
        state.isPlaying = false
        state.stepThroughActive = false
      })
    },

    resetCanvas: () => {
      const mgr = get().historyManager
      mgr.clear()
      set((state) => {
        state.nodes = []
        state.edges = []
        state.selectedBlockIds = []
        state.canUndo = false
        state.canRedo = false
        state.historyStack = []
        state.redoStack = []
        state.lastValidationError = null
        state.testStatus = 'idle'
        state.testResults = null
        state.executionSteps = null
        state.currentStepIndex = -1
        state.isPlaying = false
        state.stepThroughActive = false
        state.draftStatus = 'none'
        state.resetCount += 1
      })
    },

    setDraftStatus: (status: DraftStatus) => {
      set((state) => {
        state.draftStatus = status
      })
    },
  }))
)