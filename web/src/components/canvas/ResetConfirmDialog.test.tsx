import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResetConfirmDialog } from './ResetConfirmDialog'

describe('ResetConfirmDialog', () => {
  it('renders when open', () => {
    render(
      <ResetConfirmDialog open={true} onOpenChange={vi.fn()} onConfirm={vi.fn()} />
    )
    expect(screen.getByText('Reset Canvas?')).toBeInTheDocument()
    expect(screen.getByText('All blocks and connections will be cleared. This cannot be undone.')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <ResetConfirmDialog open={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />
    )
    expect(screen.queryByText('Reset Canvas?')).not.toBeInTheDocument()
  })

  it('calls onConfirm when Reset button is clicked', () => {
    const onConfirm = vi.fn()
    render(
      <ResetConfirmDialog open={true} onOpenChange={vi.fn()} onConfirm={onConfirm} />
    )
    fireEvent.click(screen.getByText('Reset'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onOpenChange when Keep working is clicked', () => {
    const onOpenChange = vi.fn()
    render(
      <ResetConfirmDialog open={true} onOpenChange={onOpenChange} onConfirm={vi.fn()} />
    )
    fireEvent.click(screen.getByText('Keep working'))
    expect(onOpenChange).toHaveBeenCalled()
  })
})