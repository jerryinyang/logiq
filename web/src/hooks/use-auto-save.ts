'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useCanvasStore } from '@/stores/canvas-store'
import { useUserStore } from '@/stores/user-store'
import { startAutoSave, clearDraft } from '@/lib/canvas/auto-save'
import type { Node, Edge } from '@xyflow/react'

export function useAutoSave(challengeId: string | undefined) {
  const testStatus = useCanvasStore((s) => s.testStatus)
  const draftStatus = useCanvasStore((s) => s.draftStatus)
  const resetCount = useCanvasStore((s) => s.resetCount)
  const setDraftStatus = useCanvasStore((s) => s.setDraftStatus)
  const userId = useUserStore((s) => s.id)
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const getNodes = useCallback(() => useCanvasStore.getState().nodes as Node[], [])
  const getEdges = useCallback(() => useCanvasStore.getState().edges as Edge[], [])

  useEffect(() => {
    if (!challengeId) return
    if (draftStatus === 'restoring') return

    cleanupRef.current?.()

    const cleanup = startAutoSave(
      challengeId,
      getNodes,
      getEdges,
      () => {
        setDraftStatus('saved')
        setLastSavedAt(Date.now())
      },
      userId ?? undefined
    )

    cleanupRef.current = cleanup

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [challengeId, userId, getNodes, getEdges, setDraftStatus, draftStatus])

  useEffect(() => {
    if (testStatus === 'success' && challengeId) {
      clearDraft(challengeId, userId ?? undefined)
    }
  }, [testStatus, challengeId, userId])

  return { lastSavedAt }
}