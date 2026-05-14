import { useEffect, useCallback } from 'react'

interface UseCanvasKeyboardOptions {
  onTest?: () => void
  onReset?: () => void
}

interface CanvasKeyboardHandlers {
  handleKeyDown: (e: KeyboardEvent) => void
}

export function useCanvasKeyboard({
  onTest = () => console.log('Test'),
  onReset = () => console.log('Reset'),
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
    },
    [onTest, onReset]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { handleKeyDown }
}
