'use client'

import { useCallback } from 'react'
import { type Connection, type Edge } from '@xyflow/react'
import { useCanvasStore } from '@/stores/canvas-store'
import { toast } from 'sonner'
import { useCanvasAnnouncer } from '@/hooks/use-canvas-announcer'
import { isValidBlockConnection, BLOCK_LABELS } from '@/lib/canvas/block-validation'
import type { BlockType } from '@/types/canvas-types'

export function useBlockValidator() {
  const { announceRejection, announceCycleRejection, announceDirectionError } = useCanvasAnnouncer()

  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      const { source, target, sourceHandle, targetHandle } = connection

      if (!source || !target) return false

      if (source === target) {
        toast.error('Cannot connect a block to itself')
        announceRejection('Block', 'itself', 'self-connection not allowed')
        useCanvasStore.getState().setLastValidationError('Cannot connect a block to itself')
        return false
      }

      const sourceHandleType = sourceHandle
      const targetHandleType = targetHandle

      if (sourceHandleType === 'target') {
        toast.error('Cannot connect — must connect output to input')
        announceDirectionError()
        useCanvasStore.getState().setLastValidationError('Cannot connect — must connect output to input')
        return false
      }

      if (targetHandleType === 'source') {
        toast.error('Cannot connect — must connect output to input')
        announceDirectionError()
        useCanvasStore.getState().setLastValidationError('Cannot connect — must connect output to input')
        return false
      }

      const state = useCanvasStore.getState()
      const sourceNode = state.nodes.find((n) => n.id === source)
      const targetNode = state.nodes.find((n) => n.id === target)

      if (!sourceNode || !targetNode) return false

      const existingIncomer = state.edges.find((e) => e.target === target)
      if (existingIncomer) {
        const errorMessage = 'This block already has an incoming connection'
        toast.error(errorMessage)
        announceRejection('Block', 'target block', 'target already has incoming connection')
        state.setLastValidationError(errorMessage)
        return false
      }

      const sourceBlock = (sourceNode.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
      const targetBlock = (targetNode.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
      const sourceType = sourceBlock?.type as BlockType | undefined
      const targetType = targetBlock?.type as BlockType | undefined

      if (!sourceType || !targetType) return false

      const typeValidation = isValidBlockConnection(sourceType, targetType)
      if (!typeValidation.valid) {
        const sourceLabel = BLOCK_LABELS[sourceType]
        const targetLabel = BLOCK_LABELS[targetType]
        toast.error(typeValidation.reason ?? `Cannot connect ${sourceLabel} to ${targetLabel}`)
        announceRejection(sourceLabel, targetLabel, typeValidation.reason ?? 'incompatible types')
        state.setLastValidationError(typeValidation.reason ?? 'Connection not allowed')
        return false
      }

      const result = state.validateConnection(source, target, sourceHandle ?? undefined, targetHandle ?? undefined)
      if (!result.valid) {
        if (result.error === 'cycle-detected') {
          toast.error('Cannot create circular logic — this would cause infinite execution')
          announceCycleRejection()
          state.setLastValidationError(result.reason ?? 'Cycle detected')
        } else {
          toast.error(result.reason ?? 'Connection not allowed')
          const sourceLabel = BLOCK_LABELS[sourceType]
          const targetLabel = BLOCK_LABELS[targetType]
          announceRejection(sourceLabel, targetLabel, result.reason ?? 'connection not allowed')
          state.setLastValidationError(result.reason ?? 'Connection not allowed')
        }
        return false
      }

      return true
    },
    [announceRejection, announceCycleRejection, announceDirectionError]
  )

  return { isValidConnection }
}