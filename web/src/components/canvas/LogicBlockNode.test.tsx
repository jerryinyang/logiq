import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LogicBlockNode } from '@/components/canvas/LogicBlockNode'
import type { LogicBlockNodeData } from '@/types/canvas-types'

const mockBlock: LogicBlockNodeData = {
  block: {
    id: 'test-block-1',
    type: 'loop',
    category: { type: 'loop', label: 'Loop', color: '#0EA5E9' },
    label: 'For Each Item',
    description: 'Iterate over each item in a collection and apply logic to it',
    position: { x: 0, y: 0 },
    connections: { input: [], output: [] },
  },
}

vi.mock('@xyflow/react', () => ({
  Handle: ({ type, position }: any) => (
    <div data-testid={`handle-${type}`} data-position={position} />
  ),
  Position: { Top: 'top' as const, Bottom: 'bottom' as const },
}))

vi.mock('@/components/ui/context-menu', () => ({
  ContextMenu: ({ children }: any) => <div data-testid="context-menu">{children}</div>,
  ContextMenuTrigger: ({ children }: any) => <div data-testid="context-menu-trigger">{children}</div>,
  ContextMenuContent: ({ children }: any) => <div data-testid="context-menu-content">{children}</div>,
  ContextMenuItem: ({ children, onClick }: any) => (
    <div data-testid="context-menu-item" onClick={onClick}>{children}</div>
  ),
}))

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  TooltipTrigger: ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, style }: any) => <span data-testid="badge" style={style}>{children}</span>,
}))

const baseNodeProps = {
  type: 'logicBlock' as const,
  selected: false as const,
  dragging: false,
  draggable: false,
  selectable: false,
  deletable: false,
  isConnectable: false,
  zIndex: 0,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
}

describe('LogicBlockNode', () => {
  it('renders block label', () => {
    const { container } = render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    expect(container.textContent).toContain('For Each Item')
  })

  it('renders block description', () => {
    const { container } = render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    expect(container.textContent).toContain('Iterate over each item')
  })

  it('renders category badge', () => {
    const { container } = render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    expect(container.textContent).toContain('Loop')
  })

  it('has handles for input and output', () => {
    const { container } = render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    expect(container.querySelector('[data-testid="handle-target"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="handle-source"]')).toBeInTheDocument()
  })

  it('has data-nodeid attribute', () => {
    const { container } = render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    expect(container.querySelector('[data-nodeid="test-node"]')).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    const { container } = render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    expect(container.querySelector('[aria-label]')).toBeInTheDocument()
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toContain('Loop')
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toContain('Iterate over each item')
  })

  it('dispatches delete event on context menu delete click', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
    render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    const deleteItems = screen.getAllByText('Delete')
    fireEvent.click(deleteItems[0])
    expect(dispatchSpy).toHaveBeenCalled()
  })

  it('dispatches duplicate event on context menu duplicate click', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
    render(
      <LogicBlockNode id="test-node" data={mockBlock} {...baseNodeProps} />
    )
    const duplicateItems = screen.getAllByText('Duplicate')
    fireEvent.click(duplicateItems[0])
    expect(dispatchSpy).toHaveBeenCalled()
  })
})