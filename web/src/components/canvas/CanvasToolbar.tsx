'use client'

import { Panel } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Trash2, Play, Loader2, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useCanvasStore } from '@/stores/canvas-store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState, useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'

interface CanvasToolbarProps {
  className?: string
  challengeId?: string
  onTest?: () => Promise<void>
  validationError?: string | null
  onReset?: () => void
}

export function CanvasToolbar({ className, challengeId, onTest, validationError: externalValidationError, onReset }: CanvasToolbarProps) {
  const { canUndo, canRedo, undo, redo, selectedBlockIds, removeBlocks, nodes, testStatus, resetTest, setZoom, zoom } = useCanvasStore()
  const { fitView } = useReactFlow()
  const [internalValidationError, setInternalValidationError] = useState<string | null>(null)

  const isRunning = testStatus === 'running'
  const validationError = externalValidationError ?? internalValidationError

  const handleZoomIn = useCallback(() => setZoom(zoom + 0.1), [setZoom, zoom])
  const handleZoomOut = useCallback(() => setZoom(zoom - 0.1), [setZoom, zoom])
  const handleFitView = useCallback(() => fitView({ padding: 0.2 }), [fitView])

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
    <TooltipProvider delayDuration={300}>
      <>
        <Panel position="top-right" className={className}>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo || isRunning}
                  aria-label="Undo"
                  tabIndex={0}
                  className={!canUndo || isRunning ? 'opacity-40' : ''}
                >
                  <Undo2 className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo || isRunning}
                  aria-label="Redo"
                  tabIndex={0}
                  className={!canRedo || isRunning ? 'opacity-40' : ''}
                >
                  <Redo2 className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
            {selectedBlockIds.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBlocks(selectedBlockIds)}
                    aria-label="Delete Selected"
                    tabIndex={0}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="gap-1 bg-[#F43F5E] text-white hover:bg-[#E11D48]"
                  size="sm"
                  onClick={onReset}
                  disabled={isRunning}
                  aria-label="Reset canvas"
                  tabIndex={0}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset canvas</TooltipContent>
            </Tooltip>
            <div className="mx-1 h-6 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  tabIndex={0}
                >
                  <ZoomIn className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  tabIndex={0}
                >
                  <ZoomOut className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFitView}
                  aria-label="Fit view"
                  tabIndex={0}
                >
                  <Maximize2 className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit view</TooltipContent>
            </Tooltip>
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
      </>
    </TooltipProvider>
  )
}