'use client'

import { useCallback } from 'react'
import { useCanvasStore } from '@/stores/canvas-store'
import { BLOCK_LABELS } from '@/lib/canvas/block-validation'

export function useCanvasAnnouncer() {
  const announce = useCallback((message: string) => {
    const region = document.getElementById('logiq-canvas-announcer')
    if (region) {
      region.textContent = ''
      region.textContent = message
    }
  }, [])

  const announceConnection = useCallback(
    (sourceLabel: string, targetLabel: string) => {
      announce(`Connected ${sourceLabel} to ${targetLabel}`)
    },
    [announce]
  )

  const announceRejection = useCallback(
    (sourceLabel: string, targetLabel: string, reason: string) => {
      announce(`Cannot connect ${sourceLabel} to ${targetLabel} — ${reason}`)
    },
    [announce]
  )

  const announceCycleRejection = useCallback(() => {
    announce('Cannot create circular logic — this would cause infinite execution')
  }, [announce])

  const announceDirectionError = useCallback(() => {
    announce('Cannot connect — must connect output to input')
  }, [announce])

  const announceFlow = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState()
    if (edges.length === 0) return

    const incomingCount = new Map<string, number>()
    for (const edge of edges) {
      incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
    }

    const starters = nodes.filter((node) => {
      const count = incomingCount.get(node.id) ?? 0
      return count === 0
    })

    if (starters.length === 0) return

    const ordered: string[] = []
    const visited = new Set<string>()
    const edgeMap = new Map<string, string[]>()

    for (const edge of edges) {
      const list = edgeMap.get(edge.source) ?? []
      list.push(edge.target)
      edgeMap.set(edge.source, list)
    }

    function walk(nodeId: string) {
      if (visited.has(nodeId)) return
      visited.add(nodeId)
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        const block = (node.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
        const blockType = block?.type as string | undefined
        const label = (blockType && BLOCK_LABELS[blockType as keyof typeof BLOCK_LABELS]) ?? 'Unknown'
        ordered.push(label)
      }
      const targets = edgeMap.get(nodeId) ?? []
      for (const target of targets) {
        walk(target)
      }
    }

    for (const starter of starters) {
      walk(starter.id)
    }

    if (ordered.length > 0) {
      announce(`Connected flow: ${ordered.join(', then ')}`)
    }
  }, [announce])

  return {
    announce,
    announceConnection,
    announceRejection,
    announceCycleRejection,
    announceDirectionError,
    announceFlow,
  }
}