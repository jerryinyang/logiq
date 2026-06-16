import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExecutionProgressAnimation } from './ExecutionProgressAnimation'

vi.mock('@/stores/canvas-store', () => {
  const state = {
    testStatus: 'idle' as string,
    executionSteps: null as any,
    setEdges: vi.fn(),
  }
  return {
    useCanvasStore: (selector: any) => selector(state),
  }
})

describe('ExecutionProgressAnimation', () => {
  it('renders nothing when test status is idle', () => {
    const { container } = render(<ExecutionProgressAnimation />)
    expect(container.innerHTML).not.toContain('Running your logic')
  })
})