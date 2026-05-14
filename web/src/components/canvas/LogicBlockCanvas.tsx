'use client'

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import { CanvasToolbar } from './CanvasToolbar'
import { CanvasEmptyState } from './CanvasEmptyState'
import { useCanvasKeyboard } from '@/hooks/use-canvas-keyboard'
import { useCanvasStore } from '@/stores/canvas-store'

function CanvasContent() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const pushHistory = useCanvasStore((s) => s.pushHistory)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds)
        pushHistory(updated, edges)
        return updated
      })
    },
    [edges, pushHistory]
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds)
        pushHistory(nodes, updated)
        return updated
      })
    },
    [nodes, pushHistory]
  )

  useCanvasKeyboard()

  return (
    <div className="h-full w-full" role="application" aria-label="Logic Block Canvas — interactive workspace">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
