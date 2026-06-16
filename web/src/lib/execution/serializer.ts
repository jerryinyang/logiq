import type { Node, Edge } from '@xyflow/react'
import type { SerializedBlockConfig } from '@/types/execution-types'
import type { BlockType } from '@/types/canvas-types'
import { detectCycleInGraph } from '@/lib/canvas/cycle-detection'

interface SerializationResult {
  success: boolean
  data?: SerializedBlockConfig[]
  error?: { code: string; message: string }
}

function topologicalSort(configs: SerializedBlockConfig[]): SerializedBlockConfig[] {
  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const config of configs) {
    if (!inDegree.has(config.id)) inDegree.set(config.id, 0)
    if (!adjacency.has(config.id)) adjacency.set(config.id, [])
  }

  for (const config of configs) {
    for (const targetId of config.connections.output) {
      adjacency.get(config.id)!.push(targetId)
      inDegree.set(targetId, (inDegree.get(targetId) ?? 0) + 1)
    }
  }

  const queue: string[] = []
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id)
  }

  const sorted: string[] = []
  while (queue.length > 0) {
    const current = queue.shift()!
    sorted.push(current)

    for (const neighbor of adjacency.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1
      inDegree.set(neighbor, newDegree)
      if (newDegree === 0) queue.push(neighbor)
    }
  }

  if (sorted.length !== configs.length) {
    return configs
  }

  const configMap = new Map(configs.map((c) => [c.id, c]))
  return sorted.map((id) => configMap.get(id)!)
}

export function serializeCanvasState(
  nodes: Node[],
  edges: Edge[]
): SerializationResult {
  if (!nodes || !Array.isArray(nodes)) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_INVALID_FLOW',
        message: 'No blocks on the canvas',
      },
    }
  }

  if (!edges || !Array.isArray(edges)) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_INVALID_FLOW',
        message: 'Your blocks must be connected to form a complete logic flow',
      },
    }
  }

  if (nodes.length === 0) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_INVALID_FLOW',
        message: 'Your blocks must be connected to form a complete logic flow',
      },
    }
  }

  const simpleEdges = edges.map((e) => ({
    source: e.source,
    target: e.target,
  }))

  if (detectCycleInGraph(simpleEdges)) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_CYCLE_DETECTED',
        message: 'Your logic flow contains a cycle — blocks must form a direct path',
      },
    }
  }

  const connectedNodeIds = new Set<string>()
  for (const edge of edges) {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  }

  const orphanNodes = nodes.filter((n) => !connectedNodeIds.has(n.id))
  if (nodes.length > 1 && orphanNodes.length > 0) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_INVALID_FLOW',
        message: 'Your blocks must be connected to form a complete logic flow',
      },
    }
  }

  const hasReturnBlock = nodes.some((node) => {
    const block = (node.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
    return block?.type === 'return'
  })

  if (!hasReturnBlock) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_INVALID_FLOW',
        message: 'Your logic flow must include a Return block',
      },
    }
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  for (const nodeId of connectedNodeIds) {
    if (!nodeMap.has(nodeId)) {
      return {
        success: false,
        error: {
          code: 'EXECUTION_INVALID_FLOW',
          message: 'Your blocks must be connected to form a complete logic flow',
        },
      }
    }
  }

  const configs: SerializedBlockConfig[] = nodes.map((node) => {
    const block = (node.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
    const blockType = (block?.type as BlockType) ?? 'return'
    const blockConfig = (block?.config as Record<string, unknown>) ?? {}

    const inputConnections: string[] = []
    const outputConnections: string[] = []

    for (const edge of edges) {
      if (edge.target === node.id) inputConnections.push(edge.source)
      if (edge.source === node.id) outputConnections.push(edge.target)
    }

    return {
      id: node.id,
      type: blockType,
      position: { x: node.position.x, y: node.position.y },
      connections: {
        output: outputConnections,
        input: inputConnections,
      },
      config: blockConfig,
    }
  })

  const sorted = topologicalSort(configs)

  if (sorted.length !== configs.length) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_INVALID_FLOW',
        message: 'Execution order could not be determined — blocks may form an unsupported structure',
      },
    }
  }

  return { success: true, data: sorted }
}
