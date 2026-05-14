import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanvasToolbar } from './CanvasToolbar'
import { ReactFlowProvider } from '@xyflow/react'

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>)
}

describe('CanvasToolbar', () => {
  it('renders undo and redo buttons', () => {
    renderWithProvider(<CanvasToolbar />)
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument()
  })

  it('disables undo button when history is empty', () => {
    renderWithProvider(<CanvasToolbar />)
    const undoButton = screen.getByRole('button', { name: /undo/i })
    expect(undoButton).toBeDisabled()
  })

  it('disables redo button when no redo available', () => {
    renderWithProvider(<CanvasToolbar />)
    const redoButton = screen.getByRole('button', { name: /redo/i })
    expect(redoButton).toBeDisabled()
  })
})
