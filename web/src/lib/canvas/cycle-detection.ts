import type { Node, Edge } from '@xyflow/react'

interface SimpleEdge {
  source: string
  target: string
}

export function wouldCreateCycle(
  nodes: Node[],
  edges: Edge[],
  newEdge: { source: string; target: string }
): boolean {
  const { source, target } = newEdge

  if (source === target) {
    return true
  }

  const adjacencyList = new Map<string, Set<string>>()

  for (const node of nodes) {
    adjacencyList.set(node.id, new Set())
  }

  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.source)
    if (neighbors) {
      neighbors.add(edge.target)
    }
  }

  const newNeighbors = adjacencyList.get(source)
  if (newNeighbors) {
    newNeighbors.add(target)
  }

  return hasCycleDFS(adjacencyList)
}

function hasCycleDFS(adjacencyList: Map<string, Set<string>>): boolean {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  for (const node of adjacencyList.keys()) {
    if (dfsVisit(node, adjacencyList, visited, recursionStack)) {
      return true
    }
  }

  return false
}

function dfsVisit(
  node: string,
  adjacencyList: Map<string, Set<string>>,
  visited: Set<string>,
  recursionStack: Set<string>
): boolean {
  if (recursionStack.has(node)) {
    return true
  }

  if (visited.has(node)) {
    return false
  }

  visited.add(node)
  recursionStack.add(node)

  const neighbors = adjacencyList.get(node)
  if (neighbors) {
    for (const neighbor of neighbors) {
      if (dfsVisit(neighbor, adjacencyList, visited, recursionStack)) {
        return true
      }
    }
  }

  recursionStack.delete(node)
  return false
}

export function detectCycleInGraph(edges: SimpleEdge[]): boolean {
  const adjacencyList = new Map<string, Set<string>>()

  for (const edge of edges) {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, new Set())
    }
    if (!adjacencyList.has(edge.target)) {
      adjacencyList.set(edge.target, new Set())
    }
    adjacencyList.get(edge.source)!.add(edge.target)
  }

  return hasCycleDFS(adjacencyList)
}