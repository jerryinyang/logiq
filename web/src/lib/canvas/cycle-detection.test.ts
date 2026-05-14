import { describe, it, expect } from 'vitest'
import { wouldCreateCycle, detectCycleInGraph } from './cycle-detection'
import type { Node, Edge } from '@xyflow/react'

function makeNode(id: string): Node {
  return { id, type: 'logicBlock', position: { x: 0, y: 0 }, data: {} }
}

function makeEdge(id: string, source: string, target: string): Edge {
  return { id, source, target }
}

describe('cycle-detection', () => {
  describe('wouldCreateCycle', () => {
    it('detects self-connection as cycle', () => {
      const nodes = [makeNode('a')]
      const edges: Edge[] = []
      expect(wouldCreateCycle(nodes, edges, { source: 'a', target: 'a' })).toBe(true)
    })

    it('returns false for DAG with no cycle', () => {
      const nodes = [makeNode('a'), makeNode('b')]
      const edges: Edge[] = []
      expect(wouldCreateCycle(nodes, edges, { source: 'a', target: 'b' })).toBe(false)
    })

    it('returns false for linear chain (no cycle)', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c')]
      const edges = [makeEdge('e1', 'a', 'b')]
      expect(wouldCreateCycle(nodes, edges, { source: 'b', target: 'c' })).toBe(false)
    })

    it('detects simple two-node cycle', () => {
      const nodes = [makeNode('a'), makeNode('b')]
      const edges = [makeEdge('e1', 'a', 'b')]
      expect(wouldCreateCycle(nodes, edges, { source: 'b', target: 'a' })).toBe(true)
    })

    it('detects longer cycle', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c')]
      const edges = [
        makeEdge('e1', 'a', 'b'),
        makeEdge('e2', 'b', 'c'),
      ]
      expect(wouldCreateCycle(nodes, edges, { source: 'c', target: 'a' })).toBe(true)
    })

    it('returns false for branching DAG', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')]
      const edges = [
        makeEdge('e1', 'a', 'b'),
        makeEdge('e2', 'a', 'c'),
      ]
      expect(wouldCreateCycle(nodes, edges, { source: 'b', target: 'd' })).toBe(false)
    })

    it('detects cycle in branch rejoining', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')]
      const edges = [
        makeEdge('e1', 'a', 'b'),
        makeEdge('e2', 'a', 'c'),
        makeEdge('e3', 'b', 'd'),
      ]
      expect(wouldCreateCycle(nodes, edges, { source: 'd', target: 'a' })).toBe(true)
    })

    it('handles empty graph', () => {
      const nodes = [makeNode('a'), makeNode('b')]
      const edges: Edge[] = []
      expect(wouldCreateCycle(nodes, edges, { source: 'a', target: 'b' })).toBe(false)
    })

    it('handles single node (self-loop prevention)', () => {
      const nodes = [makeNode('a')]
      const edges: Edge[] = []
      expect(wouldCreateCycle(nodes, edges, { source: 'a', target: 'a' })).toBe(true)
    })

    it('does not create false positive for parallel edges to same target', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c')]
      const edges = [makeEdge('e1', 'a', 'c')]
      expect(wouldCreateCycle(nodes, edges, { source: 'b', target: 'c' })).toBe(false)
    })

    it('detects 4-node cycle', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')]
      const edges = [
        makeEdge('e1', 'a', 'b'),
        makeEdge('e2', 'b', 'c'),
        makeEdge('e3', 'c', 'd'),
      ]
      expect(wouldCreateCycle(nodes, edges, { source: 'd', target: 'a' })).toBe(true)
    })
  })

  describe('detectCycleInGraph', () => {
    it('returns false for empty edges', () => {
      expect(detectCycleInGraph([])).toBe(false)
    })

    it('returns false for single edge (no cycle)', () => {
      expect(detectCycleInGraph([{ source: 'a', target: 'b' }])).toBe(false)
    })

    it('detects simple cycle', () => {
      expect(detectCycleInGraph([
        { source: 'a', target: 'b' },
        { source: 'b', target: 'a' },
      ])).toBe(true)
    })

    it('returns false for DAG', () => {
      expect(detectCycleInGraph([
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
        { source: 'a', target: 'c' },
      ])).toBe(false)
    })

    it('detects longer cycle', () => {
      expect(detectCycleInGraph([
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
        { source: 'c', target: 'a' },
      ])).toBe(true)
    })

    it('returns false for linear chain', () => {
      expect(detectCycleInGraph([
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
        { source: 'c', target: 'd' },
      ])).toBe(false)
    })
  })
})