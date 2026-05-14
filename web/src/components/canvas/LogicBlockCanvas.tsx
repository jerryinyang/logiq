'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  SelectionMode,
  useReactFlow,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnSelectionChangeFunc,
  type NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import { LogicBlockNode } from './LogicBlockNode'
import { CanvasToolbar } from './CanvasToolbar'
import { CanvasEmptyState } from './CanvasEmptyState'
import { useCanvasKeyboard } from '@/hooks/use-canvas-keyboard'
import { useCanvasStore } from '@/stores/canvas-store'
import type { BlockVocabularyEntry } from '@/lib/canvas/block-vocabulary'

const nodeTypes: NodeTypes = {
  logicBlock: LogicBlockNode,
}

function CanvasContent() {
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const setNodes = useCanvasStore((s) => s.setNodes)
  const setEdges = useCanvasStore((s) => s.setEdges)
  const addBlock = useCanvasStore((s) => s.addBlock)
  const setSelectedBlockIds = useCanvasStore((s) => s.setSelectedBlockIds)
  const pushHistory = useCanvasStore((s) => s.pushHistory)
  const { screenToFlowPosition } = useReactFlow()

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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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

export function LogicBlockCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  )
}