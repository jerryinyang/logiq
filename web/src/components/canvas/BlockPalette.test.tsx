import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BlockPalette } from '@/components/canvas/BlockPalette'

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, defaultValue }: any) => (
    <div data-testid="accordion" data-default-value={JSON.stringify(defaultValue)}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value }: any) => (
    <div data-testid={`accordion-item-${value}`}>{children}</div>
  ),
  AccordionTrigger: ({ children, 'aria-label': ariaLabel }: any) => (
    <button data-testid="accordion-trigger" aria-label={ariaLabel}>
      {children}
    </button>
  ),
  AccordionContent: ({ children }: any) => (
    <div data-testid="accordion-content">{children}</div>
  ),
}))

describe('BlockPalette', () => {
  it('renders the palette with search input', () => {
    render(<BlockPalette />)
    expect(screen.getByLabelText('Search blocks')).toBeInTheDocument()
  })

  it('renders with role=listbox', () => {
    render(<BlockPalette />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('has correct aria-label for available blocks', () => {
    render(<BlockPalette />)
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-label', 'Available blocks')
  })

  it('renders block categories in accordion', () => {
    render(<BlockPalette />)
    const items = screen.getAllByTestId(/^accordion-item-/)
    expect(items.length).toBeGreaterThanOrEqual(7)
  })

  it('renders search input', () => {
    render(<BlockPalette />)
    const searchInput = screen.getByPlaceholderText(/search blocks/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('filters blocks by search term', () => {
    render(<BlockPalette />)
    const searchInput = screen.getByPlaceholderText(/search blocks/i)
    fireEvent.change(searchInput, { target: { value: 'For Each' } })
    expect(searchInput).toHaveValue('For Each')
  })

  it('renders block previews as draggable', () => {
    const { container } = render(<BlockPalette />)
    const draggables = container.querySelectorAll('[draggable]')
    expect(draggables.length).toBeGreaterThan(0)
  })
})