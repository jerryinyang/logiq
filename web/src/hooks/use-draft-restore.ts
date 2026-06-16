'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useCanvasStore } from '@/stores/canvas-store'
import { useUserStore } from '@/stores/user-store'
import { loadDraft, isDraftExpired, clearDraft } from '@/lib/canvas/auto-save'
import type { Node, Edge } from '@xyflow/react'
import { toast } from 'sonner'

export function useDraftRestore(challengeId: string | undefined) {
  const setNodes = useCanvasStore((s) => s.setNodes)
  const setEdges = useCanvasStore((s) => s.setEdges)
  const pushHistory = useCanvasStore((s) => s.pushHistory)
  const setDraftStatus = useCanvasStore((s) => s.setDraftStatus)
  const userId = useUserStore((s) => s.id)
  const [restoredDraft, setRestoredDraft] = useState<{ expired: boolean } | null>(null)
  const hasRestored = useRef(false)

  useEffect(() => {
    hasRestored.current = false
  }, [challengeId])

  const restoreDraft = useCallback(() => {
    if (!challengeId || hasRestored.current) return

    const draft = loadDraft(challengeId, userId ?? undefined)
    if (!draft) return

    hasRestored.current = true

    if (isDraftExpired(draft)) {
      setRestoredDraft({ expired: true })
      return
    }

    setDraftStatus('restoring')
    useCanvasStore.getState().historyManager.clear()
    pushHistory(draft.nodes as Node[], draft.edges as Edge[])
    setDraftStatus('restored')
    setRestoredDraft({ expired: false })
  }, [challengeId, userId, setNodes, setEdges, pushHistory, setDraftStatus])

  const acceptExpiredDraft = useCallback(() => {
    if (!challengeId || !restoredDraft?.expired) return

    const draft = loadDraft(challengeId, userId ?? undefined)
    if (!draft) {
      toast.error('Draft could not be restored — it may have been removed', { duration: 4000 })
      setRestoredDraft(null)
      return
    }

    setDraftStatus('restoring')
    useCanvasStore.getState().historyManager.clear()
    setNodes(draft.nodes as Node[])
    setEdges(draft.edges as Edge[])
    pushHistory(draft.nodes as Node[], draft.edges as Edge[])
    setDraftStatus('restored')
    setRestoredDraft(null)
  }, [challengeId, restoredDraft, setNodes, setEdges, pushHistory, setDraftStatus])

  const declineExpiredDraft = useCallback(() => {
    if (challengeId) {
      clearDraft(challengeId, userId ?? undefined)
    }
    setDraftStatus('none')
    setRestoredDraft(null)
  }, [challengeId, userId, setDraftStatus])

  useEffect(() => {
    restoreDraft()
  }, [restoreDraft])

  return {
    restoredDraft,
    acceptExpiredDraft,
    declineExpiredDraft,
  }
}