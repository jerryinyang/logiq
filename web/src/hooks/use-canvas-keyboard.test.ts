import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCanvasKeyboard } from './use-canvas-keyboard'
import { fireEvent } from '@testing-library/react'

describe('useCanvasKeyboard', () => {
  it('returns handleKeyDown function', () => {
    const { result } = renderHook(() => useCanvasKeyboard())
    expect(result.current.handleKeyDown).toBeDefined()
    expect(typeof result.current.handleKeyDown).toBe('function')
  })

  it('calls onTest when T key is pressed', () => {
    const onTest = vi.fn()
    renderHook(() => useCanvasKeyboard({ onTest }))
    fireEvent.keyDown(window, { key: 't' })
    expect(onTest).toHaveBeenCalledOnce()
  })

  it('calls onReset when R key is pressed', () => {
    const onReset = vi.fn()
    renderHook(() => useCanvasKeyboard({ onReset }))
    fireEvent.keyDown(window, { key: 'r' })
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('does not trigger shortcuts when in input field', () => {
    const onTest = vi.fn()
    renderHook(() => useCanvasKeyboard({ onTest }))

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    fireEvent.keyDown(input, { key: 't' })
    expect(onTest).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })
})
