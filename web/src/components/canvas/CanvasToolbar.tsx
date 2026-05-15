'use client'

import { Controls, Panel } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Trash2, Play, Loader2 } from 'lucide-react'
import { useCanvasStore } from '@/stores/canvas-store'
import { useState } from 'react'

interface CanvasToolbarProps {
  className?: string
  challengeId?: string
  onTest?: () => Promise<void>
  validationError?: string | null
}

export function CanvasToolbar({ className, challengeId, onTest, validationError: externalValidationError }: CanvasToolbarProps) {
  const { canUndo, canRedo, undo, redo, selectedBlockIds, removeBlocks, nodes, testStatus, resetTest } = useCanvasStore()
  const [internalValidationError, setInternalValidationError] = useState<string | null>(null)

  const isRunning = testStatus === 'running'
  const validationError = externalValidationError ?? internalValidationError

  const getButtonIcon = () => {
    if (isRunning) return <Loader2 className="h-4 w-4 animate-spin" />
    if (testStatus === 'success') return <Play className="h-4 w-4" />
    if (testStatus === 'error') return <Play className="h-4 w-4" />
    return <Play className="h-4 w-4" />
  }

  const getButtonStyle = () => {
    const base = 'gap-1 font-medium'
    if (isRunning) return `${base} bg-[#4F46E5] opacity-70 text-white cursor-not-allowed`
    if (testStatus === 'success') return `${base} bg-emerald-600 hover:bg-emerald-700 text-white`
    if (testStatus === 'error') return `${base} bg-rose-600 hover:bg-rose-700 text-white`
    return `${base} bg-[#6366F1] hover:bg-[#4F46E5] text-white`
  }

  return (
    <>
      <Panel position="top-right" className={className}>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo || isRunning}
            aria-label="Undo"
            tabIndex={0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo || isRunning}
            aria-label="Redo"
            tabIndex={0}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          {selectedBlockIds.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeBlocks(selectedBlockIds)}
              aria-label="Delete Selected"
              tabIndex={0}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </Panel>
      <Panel position="bottom-center" className={className}>
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={onTest}
            disabled={!onTest || isRunning || nodes.length === 0}
            className={getButtonStyle()}
            aria-label={isRunning ? 'Running your logic...' : 'Test Solution'}
            tabIndex={0}
          >
            {getButtonIcon()}
            {isRunning ? 'Running your logic...' : testStatus === 'success' ? 'All Passed!' : 'Test'}
          </Button>
          {validationError && (
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-1.5 max-w-xs text-center">
              {validationError}
            </p>
          )}
        </div>
      </Panel>
      <Controls
        showInteractive={false}
        className="!border-border !bg-card !text-foreground [&>button]:!border-border [&>button]:!bg-card [&>button]:!text-foreground [&>button:hover]:!bg-accent"
      />
    </>
  )
}