'use client'

import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import type { LogicBlockNodeData, BlockType } from '@/types/canvas-types'
import { CATEGORY_ICONS, FALLBACK_ICON } from '@/lib/canvas/block-icons'
import { AlertTriangle } from 'lucide-react'

type LogicBlockNodeType = Node<LogicBlockNodeData, 'logicBlock'>

function LogicBlockNodeInner({ data, id, selected }: NodeProps<LogicBlockNodeType>) {
  const block = data.block
  const Icon = CATEGORY_ICONS[block.type] ?? FALLBACK_ICON

  const execState = (data as Record<string, unknown> & { executionState?: 'active' | 'success' | 'error' }).executionState

  let outlineStyle: React.CSSProperties = selected
    ? { outline: '2px solid #6366F1', outlineOffset: '2px' }
    : { outline: '2px solid transparent', outlineOffset: '2px' }
  let borderExtra = ''
  let glowStyle: React.CSSProperties = {}

  if (execState === 'active') {
    outlineStyle = { outline: '2px solid #6366F1', outlineOffset: '2px' }
    glowStyle = { boxShadow: '0 0 12px 2px rgba(99,102,241,0.4)' }
    borderExtra = 'animate-pulse'
  } else if (execState === 'success') {
    outlineStyle = { outline: '2px solid #10B981', outlineOffset: '2px' }
    glowStyle = { boxShadow: '0 0 10px 2px rgba(16,185,129,0.3)' }
  } else if (execState === 'error') {
    outlineStyle = { outline: '2px solid #F43F5E', outlineOffset: '2px' }
    glowStyle = { boxShadow: '0 0 10px 2px rgba(244,63,94,0.3)' }
    borderExtra = 'animate-shake'
  }

  const isEdgeCase = block.type === 'edgeCase'

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          data-nodeid={id}
          aria-label={isEdgeCase ? `Edge case handler — ${block.label}` : `${block.category.label} — ${block.description}`}
          className={`group relative flex w-[220px] flex-col gap-1.5 rounded-lg border border-[#334155] bg-[#1E293B] p-3 shadow-md transition-[transform,outline-color] duration-150 hover:scale-[1.02] ${borderExtra}`}
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: block.category.color,
            ...outlineStyle,
            ...glowStyle,
          }}
        >
          <Handle
            type="target"
            position={Position.Top}
            className="!h-2 !w-2 !border-2 !border-[#334155] !bg-[#6366F1]"
          />

          <div className="flex items-center gap-2">
            {isEdgeCase ? (
              <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: '#F59E0B' }} />
            ) : (
              <Icon className="h-4 w-4 shrink-0" style={{ color: block.category.color }} />
            )}
            <span className="flex-1 truncate font-mono text-xs text-[#F8FAFC]">
              {isEdgeCase ? `Edge Case: ${block.label}` : block.label}
            </span>
            <Badge
              variant="outline"
              className="shrink-0 border-0 px-1.5 py-0 text-[10px]"
              style={{ backgroundColor: `${block.category.color}20`, color: block.category.color }}
            >
              {isEdgeCase ? 'Edge Case' : block.category.label}
            </Badge>
          </div>

          <p className="line-clamp-2 text-xs text-[#94A3B8]">{block.description}</p>

          {isEdgeCase ? (
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                id="edge-case-hit"
                className="!h-2 !w-2 !border-2 !border-[#334155] !bg-[#F43F5E]"
                style={{ bottom: -4, left: '30%', position: 'absolute' }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="edge-case-miss"
                className="!h-2 !w-2 !border-2 !border-[#334155] !bg-[#10B981]"
                style={{ bottom: -4, right: '30%', position: 'absolute' }}
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] mt-0.5">
                <span>Case Detected</span>
                <span>Continue</span>
              </div>
            </>
          ) : block.type !== 'return' ? (
            <Handle
              type="source"
              position={Position.Bottom}
              className="!h-2 !w-2 !border-2 !border-[#334155] !bg-[#10B981]"
            />
          ) : null}

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 pointer-events-none" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[250px]">
              <p className="font-medium">{block.label}</p>
              <p className="text-muted-foreground">{block.description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            const event = new CustomEvent('logiq:delete-block', { detail: { id } })
            window.dispatchEvent(event)
          }}
        >
          Delete
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            const event = new CustomEvent('logiq:duplicate-block', { detail: { id } })
            window.dispatchEvent(event)
          }}
        >
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            const event = new CustomEvent('logiq:describe-block', { detail: { id } })
            window.dispatchEvent(event)
          }}
        >
          Describe
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export const LogicBlockNode = memo(LogicBlockNodeInner)