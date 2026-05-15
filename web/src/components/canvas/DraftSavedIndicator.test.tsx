import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { DraftSavedIndicator } from './DraftSavedIndicator'

describe('DraftSavedIndicator', () => {
  it('does not render when lastSavedAt is null', () => {
    const { container } = render(<DraftSavedIndicator lastSavedAt={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders "Draft saved" text after save', () => {
    vi.useFakeTimers()
    render(<DraftSavedIndicator lastSavedAt={Date.now()} />)
    expect(screen.getByText('Draft saved')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('disappears after 2 seconds', () => {
    vi.useFakeTimers()
    render(<DraftSavedIndicator lastSavedAt={Date.now()} />)
    expect(screen.getByText('Draft saved')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2100)
    })

    expect(screen.queryByText('Draft saved')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})