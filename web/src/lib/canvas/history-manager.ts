import type { Node, Edge } from '@xyflow/react'

export interface HistorySnapshot {
  nodes: Node[]
  edges: Edge[]
  timestamp: number
}

export class HistoryManager {
  private states: HistorySnapshot[] = []
  private pointer: number = -1
  private maxEntries: number

  constructor(maxEntries: number = 50) {
    this.maxEntries = maxEntries
  }

  pushHistory(nodes: Node[], edges: Edge[]): void {
    this.states = this.states.slice(0, this.pointer + 1)

    const snapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      timestamp: Date.now(),
    }
    this.states.push(snapshot)
    this.pointer = this.states.length - 1

    if (this.states.length > this.maxEntries) {
      this.states = this.states.slice(-this.maxEntries)
      this.pointer = this.states.length - 1
    }
  }

  undo(): { nodes: Node[]; edges: Edge[] } | null {
    if (this.pointer <= 0) return null
    this.pointer--
    const snapshot = this.states[this.pointer]
    return {
      nodes: JSON.parse(JSON.stringify(snapshot.nodes)),
      edges: JSON.parse(JSON.stringify(snapshot.edges)),
    }
  }

  redo(): { nodes: Node[]; edges: Edge[] } | null {
    if (this.pointer >= this.states.length - 1) return null
    this.pointer++
    const snapshot = this.states[this.pointer]
    return {
      nodes: JSON.parse(JSON.stringify(snapshot.nodes)),
      edges: JSON.parse(JSON.stringify(snapshot.edges)),
    }
  }

  get canUndo(): boolean {
    return this.pointer > 0
  }

  get canRedo(): boolean {
    return this.pointer < this.states.length - 1
  }

  clear(): void {
    this.states = []
    this.pointer = -1
  }

  get historyLength(): number {
    return this.states.length
  }

  get redoLength(): number {
    return this.states.length - this.pointer - 1
  }

  getSnapshotList(): HistorySnapshot[] {
    return this.states
  }
}