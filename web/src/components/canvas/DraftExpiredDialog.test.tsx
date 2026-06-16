import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DraftExpiredDialog } from './DraftExpiredDialog'

describe('DraftExpiredDialog', () => {
  it('renders when open', () => {
    render(
      <DraftExpiredDialog open={true} onRestore={vi.fn()} onStartFresh={vi.fn()} />
    )
    expect(screen.getByText('Restore or start fresh?')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <DraftExpiredDialog open={false} onRestore={vi.fn()} onStartFresh={vi.fn()} />
    )
    expect(screen.queryByText('Restore or start fresh?')).not.toBeInTheDocument()
  })

  it('calls onRestore when Restore draft button is clicked', () => {
    const onRestore = vi.fn()
    render(
      <DraftExpiredDialog open={true} onRestore={onRestore} onStartFresh={vi.fn()} />
    )
    fireEvent.click(screen.getByText('Restore draft'))
    expect(onRestore).toHaveBeenCalledOnce()
  })

  it('calls onStartFresh when Start fresh button is clicked', () => {
    const onStartFresh = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <DraftExpiredDialog open={true} onRestore={vi.fn()} onStartFresh={onStartFresh} />
    )
    fireEvent.click(screen.getByText('Start fresh'))
    expect(onStartFresh).toHaveBeenCalled()
  })
})