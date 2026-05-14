import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BlockConnection } from './BlockConnection'

vi.mock('@xyflow/react', () => ({
  BaseEdge: ({ id, path, markerEnd, style }: any) => (
    <path
      data-testid="base-edge"
      id={id}
      d={path}
      markerEnd={typeof markerEnd === 'string' ? markerEnd : undefined}
      stroke={style?.stroke}
      strokeWidth={style?.strokeWidth}
    />
  ),
  EdgeLabelRenderer: ({ children }: any) => <div data-testid="edge-label-renderer">{children}</div>,
  getBezierPath: () => ['M 0 0 C 0 50 0 50 0 100', 0, 50],
  MarkerType: { ArrowClosed: 'arrowclosed' },
}))

describe('BlockConnection', () => {
  it('renders a valid edge with Slate stroke color', () => {
    const { container } = render(
      <BlockConnection
        {...({
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceX: 0,
          sourceY: 0,
          targetX: 0,
          targetY: 100,
          data: { valid: true },
          animated: false,
        } as any)}
      />
    )
    const edge = container.querySelector('[data-testid="base-edge"]')
    expect(edge).toBeInTheDocument()
    expect(edge?.getAttribute('stroke')).toBe('#64748B')
  })

  it('renders an invalid edge with Rose stroke color', () => {
    const { container } = render(
      <BlockConnection
        {...{
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceX: 0,
          sourceY: 0,
          targetX: 0,
          targetY: 100,
          data: { valid: false },
          animated: false,
        } as any}
      />
    )
    const edge = container.querySelector('[data-testid="base-edge"]')
    expect(edge).toBeInTheDocument()
    expect(edge?.getAttribute('stroke')).toBe('#F43F5E')
  })

  it('renders X indicator on invalid edge', () => {
    const { container } = render(
      <BlockConnection
        {...{
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceX: 0,
          sourceY: 0,
          targetX: 0,
          targetY: 100,
          data: { valid: false },
          animated: false,
        } as any}
      />
    )
    expect(container.textContent).toContain('✕')
  })

  it('does not render X indicator on valid edge', () => {
    const { container } = render(
      <BlockConnection
        {...{
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceX: 0,
          sourceY: 0,
          targetX: 0,
          targetY: 100,
          data: { valid: true },
          animated: false,
        } as any}
      />
    )
    expect(container.textContent).not.toContain('✕')
  })

  it('has data attributes for valid edge', () => {
    const { container } = render(
      <BlockConnection
        {...{
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceX: 0,
          sourceY: 0,
          targetX: 0,
          targetY: 100,
          data: { valid: true, fromType: 'loop', toType: 'condition' },
          animated: false,
        } as any}
      />
    )
    const dataEls = container.querySelectorAll('[data-edge-valid="true"]')
    expect(dataEls.length).toBeGreaterThan(0)
  })

  it('has data attributes for invalid edge with from/to types', () => {
    const { container } = render(
      <BlockConnection
        {...{
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceX: 0,
          sourceY: 0,
          targetX: 0,
          targetY: 100,
          data: { valid: false, fromType: 'loop', toType: 'return' },
          animated: false,
        } as any}
      />
    )
    const dataEls = container.querySelectorAll('[data-edge-from="loop"]')
    expect(dataEls.length).toBeGreaterThan(0)
    const dataEls2 = container.querySelectorAll('[data-edge-to="return"]')
    expect(dataEls2.length).toBeGreaterThan(0)
  })
})