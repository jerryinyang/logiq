'use client'

import { Controls, Panel } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2 } from 'lucide-react'
import { useCanvasStore } from '@/stores/canvas-store'

interface CanvasToolbarProps {
  className?: string
}

export function CanvasToolbar({ className }: CanvasToolbarProps) {
  const { canUndo, canRedo, undo, redo } = useCanvasStore()

  return (
    <>
      <Panel position="top-right" className={className}>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
            tabIndex={0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
            tabIndex={0}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </Panel>
      <Controls
        showInteractive={false}
        className="!border-border !bg-card !text-foreground [&>button]:!border-border [&>button]:!bg-card [&>button]:!text-foreground [&>button:hover]:!bg-accent"
      />
    </>
  )
}
