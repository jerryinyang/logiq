import type { Node, Edge } from '@xyflow/react'
import type { DraftData } from '@/types/canvas-types'

const STORAGE_PREFIX = 'logiq:draft'
const MAX_DRAFTS_PER_USER = 20
const MAX_DRAFT_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const AUTO_SAVE_INTERVAL_MS = 30_000

let currentUserId = 'anonymous'

export function setCurrentUserId(userId: string): void {
  currentUserId = userId || 'anonymous'
}

export function getCurrentUserId(): string {
  return currentUserId
}

function getStorageKey(userId: string, challengeId: string): string {
  return `${STORAGE_PREFIX}:${userId}:${challengeId}`
}

function resolveUserId(userId?: string): string {
  const resolved = userId ?? currentUserId
  return resolved || 'anonymous'
}

export function saveDraft(
  challengeId: string,
  nodes: Node[],
  edges: Edge[],
  userId?: string
): void {
  const resolvedUserId = resolveUserId(userId)
  const key = getStorageKey(resolvedUserId, challengeId)
  const draft: DraftData = {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
    savedAt: new Date().toISOString(),
    version: 1,
  }

  try {
    localStorage.setItem(key, JSON.stringify(draft))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      evictOldestDrafts(userId)
      try {
        localStorage.setItem(key, JSON.stringify(draft))
      } catch {
        console.warn('Failed to save draft even after eviction:', error)
      }
    } else {
      console.warn('Failed to save draft:', error)
    }
  }
}

export function loadDraft(
  challengeId: string,
  userId?: string
): DraftData | null {
  const resolvedUserId = resolveUserId(userId)
  const key = getStorageKey(resolvedUserId, challengeId)
  const raw = localStorage.getItem(key)
  if (!raw) return null

  try {
    const draft: DraftData = JSON.parse(raw)
    if (!draft.nodes || !draft.edges || !draft.savedAt || draft.version !== 1) {
      return null
    }

    const savedAt = new Date(draft.savedAt).getTime()
    if (Date.now() - savedAt > MAX_DRAFT_AGE_MS) {
      return { ...draft, _expired: true as const }
    }

    return draft
  } catch {
    return null
  }
}

export function isDraftExpired(draft: DraftData): boolean {
  if (draft._expired) return true
  const savedAt = new Date(draft.savedAt).getTime()
  return Date.now() - savedAt > MAX_DRAFT_AGE_MS
}

export function clearDraft(
  challengeId: string,
  userId?: string
): void {
  const resolvedUserId = resolveUserId(userId)
  const key = getStorageKey(resolvedUserId, challengeId)
  localStorage.removeItem(key)
}

export function evictOldestDrafts(userId?: string): void {
  const resolvedUserId = resolveUserId(userId)
  const userPrefix = `${STORAGE_PREFIX}:${resolvedUserId}:`
  const drafts: { key: string; savedAt: number }[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(userPrefix)) {
      try {
        const raw = localStorage.getItem(key)
        if (raw) {
          const draft = JSON.parse(raw)
          drafts.push({ key, savedAt: new Date(draft.savedAt).getTime() })
        }
      } catch {
        continue
      }
    }
  }

  drafts.sort((a, b) => a.savedAt - b.savedAt)

  const toRemove = drafts.slice(0, Math.max(0, drafts.length - MAX_DRAFTS_PER_USER + 1))
  for (const item of toRemove) {
    localStorage.removeItem(item.key)
  }
}

export function startAutoSave(
  challengeId: string,
  getNodes: () => Node[],
  getEdges: () => Edge[],
  onSaved?: () => void,
  userId?: string
): () => void {
  saveDraft(challengeId, getNodes(), getEdges(), userId)
  onSaved?.()

  const intervalId = window.setInterval(() => {
    saveDraft(challengeId, getNodes(), getEdges(), userId)
    onSaved?.()
  }, AUTO_SAVE_INTERVAL_MS)

  return () => {
    window.clearInterval(intervalId)
  }
}

export { AUTO_SAVE_INTERVAL_MS, MAX_DRAFT_AGE_MS, MAX_DRAFTS_PER_USER }