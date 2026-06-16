import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  saveDraft,
  loadDraft,
  clearDraft,
  evictOldestDrafts,
  startAutoSave,
  isDraftExpired,
  AUTO_SAVE_INTERVAL_MS,
  MAX_DRAFT_AGE_MS,
} from './auto-save'

const mockNodes = [
  { id: '1', type: 'logicBlock', position: { x: 0, y: 0 }, data: { block: { id: '1', type: 'condition' } } },
]
const mockEdges = [
  { id: 'e1', source: '1', target: '2', type: 'blockConnection' },
]

describe('auto-save', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('saveDraft / loadDraft', () => {
    it('saves and loads a draft', () => {
      saveDraft('challenge-1', mockNodes as any, mockEdges as any, 'user-1')
      const draft = loadDraft('challenge-1', 'user-1')
      expect(draft).not.toBeNull()
      expect(draft!.nodes).toHaveLength(1)
      expect(draft!.edges).toHaveLength(1)
      expect(draft!.version).toBe(1)
      expect(draft!.savedAt).toBeTruthy()
    })

    it('returns null when no draft exists', () => {
      const draft = loadDraft('nonexistent', 'user-1')
      expect(draft).toBeNull()
    })

    it('scopes drafts by user', () => {
      saveDraft('challenge-1', mockNodes as any, mockEdges as any, 'user-1')
      const draft = loadDraft('challenge-1', 'user-2')
      expect(draft).toBeNull()
    })

    it('uses "anonymous" as default userId', () => {
      saveDraft('challenge-1', mockNodes as any, mockEdges as any)
      const draft = loadDraft('challenge-1')
      expect(draft).not.toBeNull()
    })

    it('deep copies nodes to prevent mutation', () => {
      const nodes = [{ id: '1', position: { x: 0, y: 0 }, data: { value: 'original' } }] as any
      saveDraft('challenge-1', nodes, mockEdges as any, 'user-1')

      nodes[0].data.value = 'modified'

      const draft = loadDraft('challenge-1', 'user-1')
      expect(draft!.nodes[0].data.value).toBe('original')
    })

    it('stores correct localStorage key format', () => {
      saveDraft('my-challenge', mockNodes as any, mockEdges as any, 'usr-123')
      const key = Object.keys(localStorage).find((k) => k.includes('my-challenge'))
      expect(key).toBe('logiq:draft:usr-123:my-challenge')
    })
  })

  describe('clearDraft', () => {
    it('removes a draft from localStorage', () => {
      saveDraft('challenge-1', mockNodes as any, mockEdges as any, 'user-1')
      expect(loadDraft('challenge-1', 'user-1')).not.toBeNull()

      clearDraft('challenge-1', 'user-1')
      expect(loadDraft('challenge-1', 'user-1')).toBeNull()
    })

    it('handles clearing nonexistent draft gracefully', () => {
      expect(() => clearDraft('nonexistent', 'user-1')).not.toThrow()
    })
  })

  describe('isDraftExpired', () => {
    it('returns false for recent drafts', () => {
      saveDraft('challenge-1', mockNodes as any, mockEdges as any, 'user-1')
      const draft = loadDraft('challenge-1', 'user-1')
      expect(isDraftExpired(draft!)).toBe(false)
    })

    it('returns true for drafts older than 7 days', () => {
      const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      const draft = {
        nodes: mockNodes as any,
        edges: mockEdges as any,
        savedAt: oldDate,
        version: 1,
      }
      localStorage.setItem('logiq:draft:user-1:challenge-old', JSON.stringify(draft))
      const loaded = loadDraft('challenge-old', 'user-1')
      expect(loaded).not.toBeNull()
      expect(isDraftExpired(loaded!)).toBe(true)
    })
  })

  describe('evictOldestDrafts', () => {
    it('evicts oldest drafts when limit is exceeded', () => {
      for (let i = 0; i < 22; i++) {
        const nodes = [{ id: `node-${i}`, position: { x: i, y: i }, data: {} }] as any
        vi.advanceTimersByTime(1000)
        saveDraft(`challenge-${i}`, nodes, [], 'user-1')
      }

      evictOldestDrafts('user-1')

      let count = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('logiq:draft:user-1:')) count++
      }
      expect(count).toBeLessThanOrEqual(20)
    })
  })

  describe('startAutoSave', () => {
    it('saves immediately on start', () => {
      const getNodes = () => mockNodes as any
      const getEdges = () => mockEdges as any
      const onSaved = vi.fn()

      startAutoSave('challenge-1', getNodes, getEdges, onSaved, 'user-1')

      expect(loadDraft('challenge-1', 'user-1')).not.toBeNull()
    })

    it('returns a cleanup function that stops the interval', () => {
      const getNodes = () => mockNodes as any
      const getEdges = () => mockEdges as any
      const onSaved = vi.fn()

      const cleanup = startAutoSave('challenge-1', getNodes, getEdges, onSaved, 'user-1')
      onSaved.mockReset()

      cleanup()

      vi.advanceTimersByTime(AUTO_SAVE_INTERVAL_MS + 1000)
      expect(onSaved).not.toHaveBeenCalled()
    })

    it('calls onSaved callback on initial save and each auto-save interval', () => {
      const getNodes = () => mockNodes as any
      const getEdges = () => mockEdges as any
      const onSaved = vi.fn()

      const cleanup = startAutoSave('challenge-1', getNodes, getEdges, onSaved, 'user-1')

      expect(onSaved).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(AUTO_SAVE_INTERVAL_MS)
      expect(onSaved).toHaveBeenCalledTimes(2)

      vi.advanceTimersByTime(AUTO_SAVE_INTERVAL_MS)
      expect(onSaved).toHaveBeenCalledTimes(3)

      cleanup()
    })
  })

  describe('localStorage quota handling', () => {
    it('handles quota exceeded error by evicting and retrying', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      let callCount = 0
      setItemSpy.mockImplementation((key: string, value: string) => {
        callCount++
        if (callCount === 1) {
          const error = new DOMException('QuotaExceededError', 'QuotaExceededError')
          throw error
        }
        localStorage.setItem(key, value)
      })

      expect(() => {
        saveDraft('challenge-1', mockNodes as any, mockEdges as any, 'user-1')
      }).not.toThrow()

      setItemSpy.mockRestore()
    })
  })

  describe('invalid draft data', () => {
    it('returns null for corrupt JSON data', () => {
      localStorage.setItem('logiq:draft:user-1:challenge-1', 'not-json')
      const draft = loadDraft('challenge-1', 'user-1')
      expect(draft).toBeNull()
    })

    it('returns null for draft without required fields', () => {
      localStorage.setItem('logiq:draft:user-1:challenge-1', JSON.stringify({ nodes: [] }))
      const draft = loadDraft('challenge-1', 'user-1')
      expect(draft).toBeNull()
    })

    it('returns null for draft with wrong version', () => {
      localStorage.setItem('logiq:draft:user-1:challenge-1', JSON.stringify({
        nodes: [],
        edges: [],
        savedAt: new Date().toISOString(),
        version: 99,
      }))
      const draft = loadDraft('challenge-1', 'user-1')
      expect(draft).toBeNull()
    })
  })
})