'use client'

import { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  SelectionMode,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
  type OnSelectionChangeFunc,
  type NodeTypes,
  type EdgeTypes,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import { LogicBlockNode } from './LogicBlockNode'
import { BlockConnection } from './BlockConnection'
import { CanvasToolbar } from './CanvasToolbar'
import { CanvasEmptyState } from './CanvasEmptyState'
import { ExecutionProgressAnimation } from './ExecutionProgressAnimation'
import { ExecutionOverlay } from './ExecutionOverlay'
import { TestResults } from '@/components/challenge/TestResults'
import { ResetConfirmDialog } from './ResetConfirmDialog'
import { DraftSavedIndicator } from './DraftSavedIndicator'
import { DraftExpiredDialog } from './DraftExpiredDialog'
import { useCanvasKeyboard } from '@/hooks/use-canvas-keyboard'
import { useCanvasAnnouncer } from '@/hooks/use-canvas-announcer'
import { useCanvasStore } from '@/stores/canvas-store'
import { useDraftRestore } from '@/hooks/use-draft-restore'
import { useAutoSave } from '@/hooks/use-auto-save'
import { clearDraft } from '@/lib/canvas/auto-save'
import { BLOCK_LABELS } from '@/lib/canvas/block-validation'
import { serializeCanvasState } from '@/lib/execution/serializer'
import { submitSolution } from '@/actions/challenge-actions'
import { applyExecutionHighlighting } from '@/lib/canvas/execution-highlighter'
import { getExecutionPath, isAtFailurePoint } from '@/lib/execution/step-tracker'
import { toast } from 'sonner'
import type { BlockType } from '@/types/canvas-types'
import type { BlockVocabularyEntry } from '@/lib/canvas/block-vocabulary'
import { RotateCcw } from 'lucide-react'

const nodeTypes: NodeTypes = {
  logicBlock: LogicBlockNode,
}

const edgeTypes: EdgeTypes = {
  blockConnection: BlockConnection,
}

function CanvasContent({ challengeId }: { challengeId?: string }) {
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const setNodes = useCanvasStore((s) => s.setNodes)
  const setEdges = useCanvasStore((s) => s.setEdges)
  const addBlock = useCanvasStore((s) => s.addBlock)
  const addEdge = useCanvasStore((s) => s.addEdge)
  const setSelectedBlockIds = useCanvasStore((s) => s.setSelectedBlockIds)
  const pushHistory = useCanvasStore((s) => s.pushHistory)
  const validateConnection = useCanvasStore((s) => s.validateConnection)
  const undo = useCanvasStore((s) => s.undo)
  const redo = useCanvasStore((s) => s.redo)
  const resetCanvas = useCanvasStore((s) => s.resetCanvas)
  const testStatus = useCanvasStore((s) => s.testStatus)
  const testResults = useCanvasStore((s) => s.testResults)
  const setTestStatus = useCanvasStore((s) => s.setTestStatus)
  const setTestResults = useCanvasStore((s) => s.setTestResults)
  const setExecutionSteps = useCanvasStore((s) => s.setExecutionSteps)
  const executionSteps = useCanvasStore((s) => s.executionSteps)
  const resetTest = useCanvasStore((s) => s.resetTest)
  const currentStepIndex = useCanvasStore((s) => s.currentStepIndex)
  const stepThroughActive = useCanvasStore((s) => s.stepThroughActive)
  const isPlaying = useCanvasStore((s) => s.isPlaying)
  const nextStepAction = useCanvasStore((s) => s.nextStep)
  const previousStepAction = useCanvasStore((s) => s.previousStep)
  const togglePlayAction = useCanvasStore((s) => s.togglePlay)
  const setStepThroughActive = useCanvasStore((s) => s.setStepThroughActive)
  const { screenToFlowPosition } = useReactFlow()
  const { announceConnection, announceRejection, announceStep, announceAutoPlayStart, announcePause } = useCanvasAnnouncer()

  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const prevStepIndexRef = useRef<number>(-1)
  const prevIsPlayingRef = useRef<boolean>(false)

  const { restoredDraft, acceptExpiredDraft, declineExpiredDraft } = useDraftRestore(challengeId)
  const { lastSavedAt } = useAutoSave(challengeId)

  useEffect(() => {
    if (restoredDraft && !restoredDraft.expired) {
      toast('Draft restored', {
        duration: 4000,
        style: {
          background: '#1E293B',
          borderLeft: '3px solid #6366F1',
        },
      })
    }
  }, [restoredDraft])

  const handleResetConfirm = useCallback(() => {
    resetCanvas()
    if (challengeId) {
      clearDraft(challengeId)
    }
    setResetDialogOpen(false)
  }, [resetCanvas, challengeId])

  const handleReset = useCallback(() => {
    setResetDialogOpen(true)
  }, [])

  useEffect(() => {
    if (testStatus !== 'success' && testStatus !== 'error') return
    if (!executionSteps || executionSteps.length === 0) return

    setNodes((nds: Node[]) =>
      nds.map((node) => {
        const step = executionSteps.find((s) => s.blockId === node.id)
        if (!step) return node
        return {
          ...node,
          data: {
            ...node.data,
            executionState: step.status === 'error' ? 'error' : 'success',
          },
        }
      })
    )
  }, [testStatus, executionSteps, setNodes])

  useEffect(() => {
    if (!stepThroughActive || !executionSteps || executionSteps.length === 0) return

    const pathInfo = getExecutionPath(executionSteps)
    const failureIndex = pathInfo?.failureIndex ?? null

    if (currentStepIndex >= 0 && currentStepIndex < executionSteps.length) {
      const step = executionSteps[currentStepIndex]
      const atFailure = isAtFailurePoint(currentStepIndex, failureIndex)

      if (atFailure) {
        announceStepFailure(currentStepIndex, step)
      } else {
        announceStepSuccess(currentStepIndex, step)
      }
    }
  }, [stepThroughActive, currentStepIndex, executionSteps])

  useEffect(() => {
    if (isPlaying && !prevIsPlayingRef.current) {
      announceAutoPlayStart()
    } else if (!isPlaying && prevIsPlayingRef.current && stepThroughActive) {
      announcePause(currentStepIndex)
    }
    prevIsPlayingRef.current = isPlaying
  }, [isPlaying, stepThroughActive, currentStepIndex])

  const announceStepSuccess = useCallback((index: number, step: { blockType: string }) => {
    const region = document.getElementById('logiq-canvas-step-announcer')
    if (region) {
      const label = BLOCK_LABELS[step.blockType as keyof typeof BLOCK_LABELS] ?? step.blockType
      region.textContent = `Step ${index + 1}: ${label} — passed`
    }
  }, [])

  const announceStepFailure = useCallback((index: number, step: { blockType: string; errorMessage?: string }) => {
    const region = document.getElementById('logiq-canvas-step-announcer')
    if (region) {
      const label = BLOCK_LABELS[step.blockType as keyof typeof BLOCK_LABELS] ?? step.blockType
      const errorPart = step.errorMessage ? `. ${step.errorMessage}` : ''
      region.textContent = `Step ${index + 1}: ${label} — failed${errorPart}`
    }
  }, [])

  const highlightedState = useMemo(() => {
    if (!stepThroughActive || !executionSteps || currentStepIndex < 0) {
      return { nodes, edges }
    }
    const pathInfo = getExecutionPath(executionSteps)
    return applyExecutionHighlighting(
      nodes,
      edges,
      executionSteps,
      currentStepIndex,
      pathInfo?.failureIndex ?? null
    )
  }, [nodes, edges, stepThroughActive, executionSteps, currentStepIndex])

  const handleTestSubmission = useCallback(async () => {
    const currentStatus = useCanvasStore.getState().testStatus
    if (currentStatus === 'running') return

    setValidationError(null)
    resetTest()

    if (nodes.length === 0) {
      setValidationError('Your blocks must be connected to form a complete logic flow')
      setTestStatus('error')
      return
    }

    const serializationResult = serializeCanvasState(nodes, edges)
    if (!serializationResult.success || !serializationResult.data) {
      setValidationError(serializationResult.error?.message ?? 'Your blocks must be connected to form a complete logic flow')
      setTestStatus('error')
      return
    }

    setTestStatus('running')

    try {
      const challengeIdToUse = challengeId ?? 'mock-1'
      const result = await submitSolution(challengeIdToUse, serializationResult.data)

      if (!result.success || !result.data) {
        setTestStatus('error')
        setValidationError(result.error?.message ?? 'An error occurred')
        return
      }

      const report = result.data
      setExecutionSteps(report.steps)
      setTestResults(report.results)

      const allPassed = report.results.length > 0 && report.results.every((r) => r.passed)
      setTestStatus(allPassed ? 'success' : 'error')
    } catch {
      setTestStatus('error')
      setValidationError('Execution failed unexpectedly')
    }
  }, [nodes, edges, challengeId, resetTest, setTestStatus, setTestResults, setExecutionSteps])

  useCanvasKeyboard({
    onTest: handleTestSubmission,
    onReset: handleReset,
    onUndo: undo,
    onRedo: redo,
    stepThroughActive,
    onStepForward: nextStepAction,
    onStepBack: previousStepAction,
    onTogglePlay: togglePlayAction,
  })

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds: Node[]) => {
        const updated = applyNodeChanges(changes, nds)
        const isPositionOnly = changes.every((c) => c.type === 'position')
        if (!isPositionOnly) {
          const currentEdges = useCanvasStore.getState().edges
          pushHistory(updated, currentEdges)
        }
        return updated
      })
    },
    [pushHistory, setNodes]
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds: Edge[]) => {
        const updated = applyEdgeChanges(changes, eds)
        const currentNodes = useCanvasStore.getState().nodes
        pushHistory(currentNodes, updated)
        return updated
      })
    },
    [pushHistory, setEdges]
  )

  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes: selectedNodes }) => {
      setSelectedBlockIds(selectedNodes.map((n) => n.id))
    },
    [setSelectedBlockIds]
  )

  const isValidConnection = useCallback(
    (connectionOrEdge: Connection | Edge): boolean => {
      const source = connectionOrEdge.source
      const target = connectionOrEdge.target
      if (!source || !target) return false

      const sourceHandle = 'sourceHandle' in connectionOrEdge ? connectionOrEdge.sourceHandle : undefined
      const targetHandle = 'targetHandle' in connectionOrEdge ? connectionOrEdge.targetHandle : undefined

      const result = validateConnection(source, target, sourceHandle ?? undefined, targetHandle ?? undefined)
      if (!result.valid) {
        return false
      }
      return true
    },
    [validateConnection]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection
      if (!source || !target) return

      const sourceNode = useCanvasStore.getState().nodes.find((n) => n.id === source)
      const targetNode = useCanvasStore.getState().nodes.find((n) => n.id === target)
      if (!sourceNode || !targetNode) return

      const sourceBlock = (sourceNode.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
      const targetBlock = (targetNode.data as Record<string, unknown>)?.block as Record<string, unknown> | undefined
      const sourceType = sourceBlock?.type as BlockType | undefined
      const targetType = targetBlock?.type as BlockType | undefined
      const sourceLabel = (sourceType && BLOCK_LABELS[sourceType]) ?? 'Block'
      const targetLabel = (targetType && BLOCK_LABELS[targetType]) ?? 'Block'

      const newEdge: Edge = {
        id: `edge-${source}-${target}`,
        source,
        target,
        type: 'blockConnection',
        animated: true,
      }

      addEdge(newEdge)

      announceConnection(sourceLabel, targetLabel)

      setTimeout(() => {
        useCanvasStore.getState().setEdges((eds: Edge[]) =>
          eds.map((e) =>
            e.id === newEdge.id ? { ...e, animated: false } : e
          )
        )
      }, 500)
    },
    [addEdge, announceConnection]
  )

  const onConnectStart = useCallback(
    (_event: MouseEvent | TouchEvent, _params: { nodeId: string | null; handleId: string | null; handleType: string | null }) => {
      setConnectingFrom(_params.nodeId)
    },
    []
  )

  const onConnectEnd = useCallback(
    (_event: MouseEvent | TouchEvent) => {
      setConnectingFrom(null)
    },
    []
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      let data: string
      try {
        data = event.dataTransfer.getData('application/logiq-block')
      } catch {
        return
      }
      if (!data) return

      let entry: BlockVocabularyEntry
      try {
        entry = JSON.parse(data)
      } catch {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      if (!position) return

      const clampedPosition = {
        x: Math.max(-5000, Math.min(5000, position.x)),
        y: Math.max(-5000, Math.min(5000, position.y)),
      }

      addBlock(
        {
          id: crypto.randomUUID(),
          type: entry.type,
          label: entry.label,
          description: entry.description,
          category: entry.category,
        },
        clampedPosition
      )
    },
    [addBlock, screenToFlowPosition]
  )

  return (
    <div className="relative h-full w-full" role="application" aria-label="Logic Block Canvas — interactive workspace">
      <div
        id="logiq-canvas-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="logiq-canvas-step-announcer"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
      <ReactFlow
        nodes={highlightedState.nodes}
        edges={highlightedState.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onSelectionChange={onSelectionChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
        selectionMode={SelectionMode.Partial}
        multiSelectionKeyCode="Shift"
        snapToGrid={true}
        snapGrid={[16, 16]}
        minZoom={0.5}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        colorMode="dark"
        deleteKeyCode="Delete"
        className="bg-[#0F172A]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#1E293B"
        />
        <CanvasToolbar challengeId={challengeId} onTest={handleTestSubmission} validationError={validationError} onReset={handleReset} />
        {nodes.length === 0 && <CanvasEmptyState />}
        {stepThroughActive && <ExecutionOverlay />}
      </ReactFlow>
      <ExecutionProgressAnimation challengeId={challengeId} />
      {testResults && (testStatus === 'success' || testStatus === 'error') && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <TestResults
            results={testResults}
            onClose={resetTest}
          />
        </div>
      )}
      <ResetConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onConfirm={handleResetConfirm}
      />
      <DraftExpiredDialog
        open={restoredDraft?.expired ?? false}
        onRestore={acceptExpiredDraft}
        onStartFresh={declineExpiredDraft}
      />
      <DraftSavedIndicator lastSavedAt={lastSavedAt} />
    </div>
  )
}

export { CanvasContent }

export function LogicBlockCanvas({ challengeId }: { challengeId?: string }) {
  return (
    <ReactFlowProvider>
      <CanvasContent challengeId={challengeId} />
    </ReactFlowProvider>
  )
}