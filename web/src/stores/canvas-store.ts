import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { CanvasState, CanvasViewport, HistoryEntry } from '@/types/canvas-types'
import type { Node, Edge } from '@xyflow/react'

const MAX_HISTORY = 50

interface CanvasStoreState extends Omit<CanvasState, 'viewport'> {
  viewport: CanvasViewport
  pushHistory: (nodes: Node[], edges: Edge[]) => void
  setZoom: (zoom: number) => void
  setViewport: (viewport: CanvasViewport) => void
  setSelectedBlockIds: (ids: string[]) => void
  undo: () => void
  redo: () => void
}

const initialViewport: CanvasViewport = { x: 0, y: 0, zoom: 1 }

export const useCanvasStore = create<CanvasStoreState>()(
  immer((set) => ({
    zoom: 1,
    viewport: initialViewport,
    selectedBlockIds: [],
    canUndo: false,
    canRedo: false,
    historyStack: [],
    status: 'idle',

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

    setSelectedBlockIds: (ids: string[]) => {
      set((state) => {
        state.selectedBlockIds = ids
      })
    },

    undo: () => {
      set((state) => {
        if (state.historyStack.length <= 1) return
        const current = state.historyStack.pop()
        if (current) {
          state.canRedo = true
          state.canUndo = state.historyStack.length > 1
        }
      })
    },

    redo: () => {
      set((state) => {
        state.canRedo = false
        state.canUndo = state.historyStack.length > 1
      })
    },
  }))
)
