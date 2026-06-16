import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanvasEmptyState } from './CanvasEmptyState'

describe('CanvasEmptyState', () => {
  it('renders empty state message', () => {
    render(<CanvasEmptyState />)
    expect(screen.getByText(/drag blocks here to build your logic/i)).toBeInTheDocument()
  })

  it('renders arrow animation svg', () => {
    render(<CanvasEmptyState />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('uses indigo accent color for text', () => {
    render(<CanvasEmptyState />)
    const text = screen.getByText(/drag blocks here to build your logic/i)
    expect(text).toHaveClass('text-indigo/60')
  })
})
