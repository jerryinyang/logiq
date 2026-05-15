import type { ExecutionStep } from '@/types/execution-types'
import type { Node, Edge } from '@xyflow/react'

export type StepHighlightState = 'unexecuted' | 'currently-executing' | 'executed-success' | 'executed-failure' | 'not-yet-executed'

export interface NodeHighlightStyle {
  className: string
  style: React.CSSProperties
}

export interface EdgeHighlightStyle {
  style: React.CSSProperties
}

export function getBlockHighlightState(
  blockId: string,
  steps: ExecutionStep[],
  currentStepIndex: number,
  failureIndex: number | null
): StepHighlightState {
  const stepIndex = steps.findIndex((s) => s.blockId === blockId)
  if (stepIndex === -1) return 'unexecuted'
  if (stepIndex > currentStepIndex) return 'not-yet-executed'
  if (stepIndex === currentStepIndex) {
    if (failureIndex !== null && stepIndex === failureIndex) return 'executed-failure'
    return 'currently-executing'
  }
  if (failureIndex !== null && stepIndex === failureIndex) return 'executed-failure'
  return 'executed-success'
}

export function getHighlightStyles(
  blockId: string,
  steps: ExecutionStep[],
  currentStepIndex: number,
  failureIndex: number | null
): { nodeStyle: NodeHighlightStyle; edgeStyle: EdgeHighlightStyle } {
  const state = getBlockHighlightState(blockId, steps, currentStepIndex, failureIndex)

  switch (state) {
    case 'currently-executing':
      return {
        nodeStyle: {
          className: 'animate-pulse',
          style: {
            outline: '2px solid #6366F1',
            outlineOffset: '2px',
            boxShadow: '0 0 12px 2px rgba(99,102,241,0.4)',
            opacity: 1,
          },
        },
        edgeStyle: {
          style: {
            stroke: '#10B981',
            strokeWidth: 3,
            opacity: 1,
          },
        },
      }
    case 'executed-success':
      return {
        nodeStyle: {
          className: '',
          style: {
            outline: '2px solid #10B981',
            outlineOffset: '2px',
            boxShadow: '0 0 10px 2px rgba(16,185,129,0.3)',
            opacity: 0.8,
          },
        },
        edgeStyle: {
          style: {
            stroke: '#10B981',
            strokeWidth: 3,
            opacity: 1,
          },
        },
      }
    case 'executed-failure':
      return {
        nodeStyle: {
          className: 'animate-shake',
          style: {
            outline: '3px solid #F43F5E',
            outlineOffset: '2px',
            boxShadow: '0 0 12px 3px rgba(244,63,94,0.5)',
            opacity: 1,
          },
        },
        edgeStyle: {
          style: {
            stroke: '#F43F5E',
            strokeWidth: 3,
            opacity: 1,
          },
        },
      }
    case 'not-yet-executed':
      return {
        nodeStyle: {
          className: '',
          style: {
            opacity: 0.4,
            outline: '2px solid transparent',
            outlineOffset: '2px',
          },
        },
        edgeStyle: {
          style: {
            stroke: '#64748B',
            strokeWidth: 1,
            opacity: 0.3,
          },
        },
      }
    case 'unexecuted':
    default:
      return {
        nodeStyle: {
          className: '',
          style: {
            opacity: 1,
            outline: '2px solid transparent',
            outlineOffset: '2px',
          },
        },
        edgeStyle: {
          style: {
            stroke: '#64748B',
            strokeWidth: 2,
            opacity: 1,
          },
        },
      }
  }
}

export function applyExecutionHighlighting(
  nodes: Node[],
  edges: Edge[],
  steps: ExecutionStep[],
  currentStepIndex: number,
  failureIndex: number | null
): { nodes: Node[]; edges: Edge[] } {
  if (!steps || steps.length === 0) return { nodes, edges }

  const highlightedNodes = nodes.map((node) => {
    const { nodeStyle } = getHighlightStyles(node.id, steps, currentStepIndex, failureIndex)

    return {
      ...node,
      data: {
        ...node.data,
        executionHighlight: nodeStyle.className,
        executionHighlightStyle: nodeStyle.style,
      },
    }
  })

  const stepBlockIds = new Set(steps.map((s) => s.blockId))

  const highlightedEdges = edges.map((edge) => {
    const sourceStepIdx = steps.findIndex((s) => s.blockId === edge.source)
    const targetStepIdx = steps.findIndex((s) => s.blockId === edge.target)

    const sourceVisited = sourceStepIdx !== -1 && sourceStepIdx <= currentStepIndex
    const targetVisited = targetStepIdx !== -1 && targetStepIdx <= currentStepIndex

    if (sourceVisited && targetVisited && stepBlockIds.has(edge.source) && stepBlockIds.has(edge.target)) {
      const isFailureEdge = failureIndex !== null &&
        (sourceStepIdx === failureIndex || targetStepIdx === failureIndex)

      if (isFailureEdge) {
        return {
          ...edge,
          style: { stroke: '#F43F5E', strokeWidth: 3, opacity: 1 },
        }
      }
      return {
        ...edge,
        style: { stroke: '#10B981', strokeWidth: 3, opacity: 1 },
      }
    }

    if (sourceVisited || targetVisited) {
      return {
        ...edge,
        style: { stroke: '#64748B', strokeWidth: 2, opacity: 0.5 },
      }
    }

    return {
      ...edge,
      style: { stroke: '#64748B', strokeWidth: 1, opacity: 0.3 },
    }
  })

  return { nodes: highlightedNodes, edges: highlightedEdges }
}