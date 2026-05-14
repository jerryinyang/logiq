'use client'

import { useCallback, useState } from 'react'
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
import { useCanvasKeyboard } from '@/hooks/use-canvas-keyboard'
import { useCanvasAnnouncer } from '@/hooks/use-canvas-announcer'
import { useCanvasStore } from '@/stores/canvas-store'
import { BLOCK_LABELS } from '@/lib/canvas/block-validation'
import type { BlockType } from '@/types/canvas-types'
import type { BlockVocabularyEntry } from '@/lib/canvas/block-vocabulary'

const nodeTypes: NodeTypes = {
  logicBlock: LogicBlockNode,
}

const edgeTypes: EdgeTypes = {
  blockConnection: BlockConnection,
}

function CanvasContent() {
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const setNodes = useCanvasStore((s) => s.setNodes)
  const setEdges = useCanvasStore((s) => s.setEdges)
  const addBlock = useCanvasStore((s) => s.addBlock)
  const addEdge = useCanvasStore((s) => s.addEdge)
  const setSelectedBlockIds = useCanvasStore((s) => s.setSelectedBlockIds)
  const pushHistory = useCanvasStore((s) => s.pushHistory)
  const validateConnection = useCanvasStore((s) => s.validateConnection)
  const { screenToFlowPosition } = useReactFlow()
  const { announceConnection, announceRejection } = useCanvasAnnouncer()

  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds: Node[]) => {
        const updated = applyNodeChanges(changes, nds)
        const currentEdges = useCanvasStore.getState().edges
        pushHistory(updated, currentEdges)
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

  useCanvasKeyboard()

  return (
    <div className="h-full w-full" role="application" aria-label="Logic Block Canvas — interactive workspace">
      <div
        id="logiq-canvas-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        <CanvasToolbar />
        {nodes.length === 0 && <CanvasEmptyState />}
      </ReactFlow>
    </div>
  )
}

export { CanvasContent }

export function LogicBlockCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  )
}