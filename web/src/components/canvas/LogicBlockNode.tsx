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

type LogicBlockNodeType = Node<LogicBlockNodeData, 'logicBlock'>

function LogicBlockNodeInner({ data, id, selected }: NodeProps<LogicBlockNodeType>) {
  const block = data.block
  const Icon = CATEGORY_ICONS[block.type] ?? FALLBACK_ICON

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          data-nodeid={id}
          aria-label={`${block.category.label} — ${block.description}`}
          className="group relative flex w-[220px] flex-col gap-1.5 rounded-lg border border-[#334155] bg-[#1E293B] p-3 shadow-md transition-[transform,outline-color] duration-150 hover:scale-[1.02]"
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: block.category.color,
            outline: selected ? '2px solid #6366F1' : '2px solid transparent',
            outlineOffset: '2px',
          }}
        >
          <Handle
            type="target"
            position={Position.Top}
            className="!h-2 !w-2 !border-2 !border-[#334155] !bg-[#64748B]"
          />

          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0" style={{ color: block.category.color }} />
            <span className="flex-1 truncate font-mono text-sm text-[#F8FAFC]">
              {block.label}
            </span>
            <Badge
              variant="outline"
              className="shrink-0 border-0 px-1.5 py-0 text-[10px]"
              style={{ backgroundColor: `${block.category.color}20`, color: block.category.color }}
            >
              {block.category.label}
            </Badge>
          </div>

          <p className="line-clamp-2 text-xs text-[#94A3B8]">{block.description}</p>

          <Handle
            type="source"
            position={Position.Bottom}
            className="!h-2 !w-2 !border-2 !border-[#334155] !bg-[#64748B]"
          />

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