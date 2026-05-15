import { describe, it, expect } from 'vitest'
import {
  getBlockHighlightState,
  getHighlightStyles,
  applyExecutionHighlighting,
  type StepHighlightState,
} from './execution-highlighter'
import type { ExecutionStep } from '@/types/execution-types'

const mockSteps: ExecutionStep[] = [
  { stepIndex: 0, blockId: 'block-1', blockType: 'variable', input: null, output: 5, status: 'success', duration: 1 },
  { stepIndex: 1, blockId: 'block-2', blockType: 'comparison', input: { left: 5, right: 3 }, output: true, status: 'success', duration: 1 },
  { stepIndex: 2, blockId: 'block-3', blockType: 'condition', input: true, output: true, status: 'success', duration: 1 },
  { stepIndex: 3, blockId: 'block-4', blockType: 'return', input: true, output: false, status: 'error', duration: 1, errorMessage: 'Expected true, got false' },
]

describe('execution-highlighter', () => {
  describe('getBlockHighlightState', () => {
    it('returns "unexecuted" for block not in steps', () => {
      expect(getBlockHighlightState('unknown-block', mockSteps, 2, null)).toBe('unexecuted')
    })

    it('returns "currently-executing" for block at current step', () => {
      expect(getBlockHighlightState('block-2', mockSteps, 1, null)).toBe('currently-executing')
    })

    it('returns "executed-success" for block before current step with success status', () => {
      expect(getBlockHighlightState('block-1', mockSteps, 2, null)).toBe('executed-success')
    })

    it('returns "executed-failure" for block at failure index', () => {
      expect(getBlockHighlightState('block-4', mockSteps, 3, 3)).toBe('executed-failure')
    })

    it('returns "not-yet-executed" for block after current step', () => {
      expect(getBlockHighlightState('block-3', mockSteps, 0, null)).toBe('not-yet-executed')
    })

    it('returns "currently-executing" when current step is also failure', () => {
      expect(getBlockHighlightState('block-4', mockSteps, 3, 3)).toBe('executed-failure')
    })

    it('returns "currently-executing" at step 0', () => {
      expect(getBlockHighlightState('block-1', mockSteps, 0, null)).toBe('currently-executing')
    })
  })

  describe('getHighlightStyles', () => {
    it('returns currently-executing styles with indigo pulse', () => {
      const { nodeStyle, edgeStyle } = getHighlightStyles('block-2', mockSteps, 1, null)
      expect(nodeStyle.className).toContain('animate-pulse')
      expect(nodeStyle.style.outline).toContain('#6366F1')
      expect(edgeStyle.style.stroke).toBe('#10B981')
    })

    it('returns executed-success styles with emerald border', () => {
      const { nodeStyle, edgeStyle } = getHighlightStyles('block-1', mockSteps, 2, null)
      expect(nodeStyle.style.outline).toContain('#10B981')
      expect(nodeStyle.style.opacity).toBe(0.8)
      expect(edgeStyle.style.stroke).toBe('#10B981')
    })

    it('returns failure styles with rose border and shake', () => {
      const { nodeStyle, edgeStyle } = getHighlightStyles('block-4', mockSteps, 3, 3)
      expect(nodeStyle.className).toContain('animate-shake')
      expect(nodeStyle.style.outline).toContain('#F43F5E')
      expect(edgeStyle.style.stroke).toBe('#F43F5E')
    })

    it('returns not-yet-executed styles with dim opacity', () => {
      const { nodeStyle, edgeStyle } = getHighlightStyles('block-3', mockSteps, 0, null)
      expect(nodeStyle.style.opacity).toBe(0.4)
      expect(edgeStyle.style.opacity).toBe(0.3)
      expect(edgeStyle.style.stroke).toBe('#64748B')
    })

    it('returns unexecuted styles with neutral defaults', () => {
      const { nodeStyle } = getHighlightStyles('unknown', mockSteps, 1, null)
      expect(nodeStyle.style.opacity).toBe(1)
    })
  })

  describe('applyExecutionHighlighting', () => {
    const mockNodes = [
      { id: 'block-1', type: 'logicBlock', position: { x: 0, y: 0 }, data: {} },
      { id: 'block-2', type: 'logicBlock', position: { x: 100, y: 100 }, data: {} },
      { id: 'block-3', type: 'logicBlock', position: { x: 200, y: 200 }, data: {} },
      { id: 'block-4', type: 'logicBlock', position: { x: 300, y: 300 }, data: {} },
    ]

    const mockEdges = [
      { id: 'e-1-2', source: 'block-1', target: 'block-2', type: 'blockConnection' },
      { id: 'e-2-3', source: 'block-2', target: 'block-3', type: 'blockConnection' },
      { id: 'e-3-4', source: 'block-3', target: 'block-4', type: 'blockConnection' },
    ]

    it('returns original nodes/edges when steps is empty', () => {
      const result = applyExecutionHighlighting(mockNodes, mockEdges, [], 0, null)
      expect(result.nodes).toEqual(mockNodes)
      expect(result.edges).toEqual(mockEdges)
    })

    it('applies execution highlight data to nodes', () => {
      const result = applyExecutionHighlighting(mockNodes, mockEdges, mockSteps, 1, null)
      const block1 = result.nodes.find((n) => n.id === 'block-1')
      const block2 = result.nodes.find((n) => n.id === 'block-2')
      expect(block1?.data).toHaveProperty('executionHighlight')
      expect(block1?.data).toHaveProperty('executionHighlightStyle')
      expect(block2?.data).toHaveProperty('executionHighlight')
    })

    it('applies edge highlighting for visited paths', () => {
      const result = applyExecutionHighlighting(mockNodes, mockEdges, mockSteps, 2, null)
      const visitedEdge = result.edges.find((e) => e.id === 'e-1-2')
      expect(visitedEdge?.style?.stroke).toBeDefined()
    })

    it('marks failure edge with rose color', () => {
      const result = applyExecutionHighlighting(mockNodes, mockEdges, mockSteps, 3, 3)
      const failureEdge = result.edges.find((e) => e.id === 'e-3-4')
      expect(failureEdge?.style?.stroke).toBe('#F43F5E')
    })
  })
})