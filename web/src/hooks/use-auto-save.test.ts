import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutoSave } from './use-auto-save'
import { useCanvasStore } from '@/stores/canvas-store'

vi.mock('@/lib/canvas/auto-save', () => ({
  startAutoSave: vi.fn(() => () => {}),
  clearDraft: vi.fn(),
}))

import { startAutoSave, clearDraft } from '@/lib/canvas/auto-save'

describe('useAutoSave', () => {
  beforeEach(() => {
    const { historyManager } = useCanvasStore.getState()
    historyManager.clear()
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      draftStatus: 'none',
      testStatus: 'idle',
    })
    vi.clearAllMocks()
  })

  it('starts auto-save when challengeId is provided', () => {
    renderHook(() => useAutoSave('challenge-1'))
    expect(startAutoSave).toHaveBeenCalledWith(
      'challenge-1',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      undefined
    )
  })

  it('does not start auto-save when challengeId is undefined', () => {
    renderHook(() => useAutoSave(undefined))
    expect(startAutoSave).not.toHaveBeenCalled()
  })

  it('clears draft on successful test', () => {
    renderHook(() => useAutoSave('challenge-1'))
    act(() => {
      useCanvasStore.getState().setTestStatus('success')
    })
    expect(clearDraft).toHaveBeenCalledWith('challenge-1', undefined)
  })

  it('does not clear draft on error test', () => {
    renderHook(() => useAutoSave('challenge-1'))
    act(() => {
      useCanvasStore.getState().setTestStatus('error')
    })
    expect(clearDraft).not.toHaveBeenCalled()
  })
})
