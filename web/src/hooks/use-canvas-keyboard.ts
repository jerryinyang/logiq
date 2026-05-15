import { useEffect, useCallback } from 'react'

interface UseCanvasKeyboardOptions {
  onTest?: () => void
  onReset?: () => void
  onUndo?: () => void
  onRedo?: () => void
  stepThroughActive?: boolean
  onStepForward?: () => void
  onStepBack?: () => void
  onTogglePlay?: () => void
}

interface CanvasKeyboardHandlers {
  handleKeyDown: (e: KeyboardEvent) => void
}

export function useCanvasKeyboard({
  onTest = () => {},
  onReset = () => {},
  onUndo = () => {},
  onRedo = () => {},
  stepThroughActive = false,
  onStepForward,
  onStepBack,
  onTogglePlay,
}: UseCanvasKeyboardOptions = {}): CanvasKeyboardHandlers {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target?.tagName ?? ''
      const isInput =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        (target as HTMLElement)?.isContentEditable

      if (isInput) return

      if (stepThroughActive) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault()
            onStepForward?.()
            break
          case 'ArrowLeft':
            e.preventDefault()
            onStepBack?.()
            break
          case ' ':
            e.preventDefault()
            onTogglePlay?.()
            break
        }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        onRedo()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        onUndo()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        onRedo()
        return
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 't':
            e.preventDefault()
            onTest()
            break
          case 'r':
            e.preventDefault()
            onReset()
            break
        }
      }
    },
    [onTest, onReset, onUndo, onRedo, stepThroughActive, onStepForward, onStepBack, onTogglePlay]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { handleKeyDown }
}