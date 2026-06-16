import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useCanvasKeyboard } from './use-canvas-keyboard'

describe('useCanvasKeyboard - undo/redo shortcuts', () => {
  it('calls onUndo when Ctrl+Z is pressed', () => {
    const onUndo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onUndo }))
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true })
    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('calls onUndo when Cmd+Z is pressed', () => {
    const onUndo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onUndo }))
    fireEvent.keyDown(window, { key: 'z', metaKey: true })
    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('calls onRedo when Ctrl+Shift+Z is pressed', () => {
    const onRedo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onRedo }))
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true })
    expect(onRedo).toHaveBeenCalledOnce()
  })

  it('calls onRedo when Cmd+Shift+Z is pressed', () => {
    const onRedo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onRedo }))
    fireEvent.keyDown(window, { key: 'z', metaKey: true, shiftKey: true })
    expect(onRedo).toHaveBeenCalledOnce()
  })

  it('calls onRedo when Ctrl+Y is pressed', () => {
    const onRedo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onRedo }))
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true })
    expect(onRedo).toHaveBeenCalledOnce()
  })

  it('does not call onUndo when Ctrl+Shift+Z is pressed', () => {
    const onUndo = vi.fn()
    const onRedo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onUndo, onRedo }))
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true })
    expect(onUndo).not.toHaveBeenCalled()
    expect(onRedo).toHaveBeenCalledOnce()
  })

  it('does not trigger undo/redo in input fields', () => {
    const onUndo = vi.fn()
    const onRedo = vi.fn()
    renderHook(() => useCanvasKeyboard({ onUndo, onRedo }))

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    fireEvent.keyDown(input, { key: 'z', ctrlKey: true })
    fireEvent.keyDown(input, { key: 'z', ctrlKey: true, shiftKey: true })
    fireEvent.keyDown(input, { key: 'y', ctrlKey: true })

    expect(onUndo).not.toHaveBeenCalled()
    expect(onRedo).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })

  it('calls onReset when R key is pressed', () => {
    const onReset = vi.fn()
    renderHook(() => useCanvasKeyboard({ onReset }))
    fireEvent.keyDown(window, { key: 'r' })
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('does not trigger R key in input fields', () => {
    const onReset = vi.fn()
    renderHook(() => useCanvasKeyboard({ onReset }))

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    fireEvent.keyDown(input, { key: 'r' })
    expect(onReset).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })
})