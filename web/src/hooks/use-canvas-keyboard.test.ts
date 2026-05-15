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

  describe('step-through keyboard controls', () => {
    it('calls onStepForward when ArrowRight is pressed during step-through', () => {
      const onStepForward = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: true,
        onStepForward,
      }))
      fireEvent.keyDown(window, { key: 'ArrowRight' })
      expect(onStepForward).toHaveBeenCalledOnce()
    })

    it('calls onStepBack when ArrowLeft is pressed during step-through', () => {
      const onStepBack = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: true,
        onStepBack,
      }))
      fireEvent.keyDown(window, { key: 'ArrowLeft' })
      expect(onStepBack).toHaveBeenCalledOnce()
    })

    it('calls onTogglePlay when Space is pressed during step-through', () => {
      const onTogglePlay = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: true,
        onTogglePlay,
      }))
      fireEvent.keyDown(window, { key: ' ' })
      expect(onTogglePlay).toHaveBeenCalledOnce()
    })

    it('does not trigger onStepForward when step-through is not active', () => {
      const onStepForward = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: false,
        onStepForward,
      }))
      fireEvent.keyDown(window, { key: 'ArrowRight' })
      expect(onStepForward).not.toHaveBeenCalled()
    })

    it('prevents default browser behavior for step-through keys', () => {
      const onStepForward = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: true,
        onStepForward,
      }))
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      const preventDefault = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)
      expect(preventDefault).toHaveBeenCalled()
    })

    it('does not trigger step-through keys in input fields', () => {
      const onStepForward = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: true,
        onStepForward,
      }))

      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      fireEvent.keyDown(input, { key: 'ArrowRight' })
      expect(onStepForward).not.toHaveBeenCalled()

      document.body.removeChild(input)
    })

    it('does not trigger test/reset shortcuts during step-through', () => {
      const onTest = vi.fn()
      const onReset = vi.fn()
      renderHook(() => useCanvasKeyboard({
        stepThroughActive: true,
        onTest,
        onReset,
      }))
      fireEvent.keyDown(window, { key: 't' })
      fireEvent.keyDown(window, { key: 'r' })
      expect(onTest).not.toHaveBeenCalled()
      expect(onReset).not.toHaveBeenCalled()
    })
  })
})
