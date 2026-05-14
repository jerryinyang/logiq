'use client'

import { useCallback, useEffect } from 'react'
import { LogicBlockCanvas } from '@/components/canvas/LogicBlockCanvas'
import { BlockPalette } from '@/components/canvas/BlockPalette'
import { useCanvasStore } from '@/stores/canvas-store'

interface ChallengePageProps {
  params: Promise<{ id: string }>
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const removeBlock = useCanvasStore((s) => s.removeBlock)
  const duplicateBlock = useCanvasStore((s) => s.duplicateBlock)

  const handleDeleteBlock = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string }
      if (detail?.id) removeBlock(detail.id)
    },
    [removeBlock]
  )

  const handleDuplicateBlock = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string }
      if (detail?.id) duplicateBlock(detail.id)
    },
    [duplicateBlock]
  )

  const handleDescribeBlock = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string }
      if (detail?.id) {
        const node = document.querySelector(`[data-nodeid="${detail.id}"]`)
        if (node) {
          const label = node.querySelector('.font-mono')?.textContent ?? detail.id
          const desc = node.querySelector('.line-clamp-2')?.textContent ?? ''
          alert(`${label}\n\n${desc}`)
        }
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener('logiq:delete-block', handleDeleteBlock)
    window.addEventListener('logiq:duplicate-block', handleDuplicateBlock)
    window.addEventListener('logiq:describe-block', handleDescribeBlock)
    return () => {
      window.removeEventListener('logiq:delete-block', handleDeleteBlock)
      window.removeEventListener('logiq:duplicate-block', handleDuplicateBlock)
      window.removeEventListener('logiq:describe-block', handleDescribeBlock)
    }
  }, [handleDeleteBlock, handleDuplicateBlock, handleDescribeBlock])

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="hidden h-full grid-cols-[280px_1fr_300px] lg:grid">
        <aside className="border-r border-border bg-card p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-foreground">Challenge</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Challenge description will appear here.
          </p>
        </aside>

        <main className="relative overflow-hidden">
          <LogicBlockCanvas />
        </main>

        <aside className="border-l border-border bg-card">
          <BlockPalette />
        </aside>
      </div>

      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 lg:hidden">
        <p className="text-center text-lg font-medium text-muted-foreground">
          Logic building is best on a larger screen
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Please switch to a desktop or laptop for the full experience.
        </p>
      </div>
    </div>
  )
}