import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDraftRestore } from './use-draft-restore'
import { loadDraft, saveDraft, clearDraft, isDraftExpired } from '@/lib/canvas/auto-save'
import { useCanvasStore } from '@/stores/canvas-store'

vi.mock('@/lib/canvas/auto-save', () => ({
  loadDraft: vi.fn(),
  saveDraft: vi.fn(),
  clearDraft: vi.fn(),
  isDraftExpired: vi.fn(),
}))

describe('useDraftRestore', () => {
  beforeEach(() => {
    const { historyManager } = useCanvasStore.getState()
    historyManager.clear()
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      draftStatus: 'none',
      canUndo: false,
      canRedo: false,
      historyStack: [],
      redoStack: [],
    })
    vi.clearAllMocks()
  })

  it('does not restore when no draft exists', () => {
    vi.mocked(loadDraft).mockReturnValue(null)
    const { result } = renderHook(() => useDraftRestore('challenge-1'))
    expect(result.current.restoredDraft).toBeNull()
  })

  it('restores a valid draft on mount', () => {
    const draft = {
      nodes: [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
      edges: [],
      savedAt: new Date().toISOString(),
      version: 1,
    }
    vi.mocked(loadDraft).mockReturnValue(draft)
    vi.mocked(isDraftExpired).mockReturnValue(false)

    renderHook(() => useDraftRestore('challenge-1'))

    const state = useCanvasStore.getState()
    expect(state.draftStatus).toBe('restored')
  })

  it('sets expired state when draft is older than 7 days', () => {
    const draft = {
      nodes: [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
      edges: [],
      savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
    }
    vi.mocked(loadDraft).mockReturnValue(draft)
    vi.mocked(isDraftExpired).mockReturnValue(true)

    const { result } = renderHook(() => useDraftRestore('challenge-1'))
    expect(result.current.restoredDraft).toEqual({ expired: true })
  })

  it('accept expired draft restores the draft', () => {
    const draft = {
      nodes: [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
      edges: [],
      savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
    }
    vi.mocked(loadDraft).mockReturnValue(draft)
    vi.mocked(isDraftExpired).mockReturnValue(true)

    const { result } = renderHook(() => useDraftRestore('challenge-1'))

    vi.mocked(loadDraft).mockReturnValue(draft)
    vi.mocked(isDraftExpired).mockReturnValue(false)

    act(() => {
      result.current.acceptExpiredDraft()
    })

    const state = useCanvasStore.getState()
    expect(state.draftStatus).toBe('restored')
  })

  it('decline expired draft sets status to none', () => {
    const draft = {
      nodes: [],
      edges: [],
      savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
    }
    vi.mocked(loadDraft).mockReturnValue(draft)
    vi.mocked(isDraftExpired).mockReturnValue(true)

    const { result } = renderHook(() => useDraftRestore('challenge-1'))

    act(() => {
      result.current.declineExpiredDraft()
    })

    const state = useCanvasStore.getState()
    expect(state.draftStatus).toBe('none')
  })

  it('does not attempt restore without challengeId', () => {
    renderHook(() => useDraftRestore(undefined))
    expect(loadDraft).not.toHaveBeenCalled()
  })
})