'use client'

import { memo, useState, useEffect } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react'

export type BlockConnectionEdge = Edge & {
  type: 'blockConnection'
  data?: {
    valid?: boolean
    fromType?: string
    toType?: string
  }
}

function BlockConnectionEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerEnd,
  animated,
}: EdgeProps<BlockConnectionEdge>) {
  const isValid = data?.valid !== false
  const [showSnap, setShowSnap] = useState(animated ?? false)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setShowSnap(false), 500)
      return () => clearTimeout(timer)
    }
  }, [animated])

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const strokeColor = isValid ? '#64748B' : '#F43F5E'

  return (
    <>
      <svg style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <marker
            id="logiq-arrow-valid"
            viewBox="0 0 16 16"
            refX="14"
            refY="8"
            markerWidth="16"
            markerHeight="16"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 16 8 L 0 16 z" fill="#64748B" />
          </marker>
          <marker
            id="logiq-arrow-invalid"
            viewBox="0 0 16 16"
            refX="14"
            refY="8"
            markerWidth="16"
            markerHeight="16"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 16 8 L 0 16 z" fill="#F43F5E" />
          </marker>
        </defs>
      </svg>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd ?? (isValid ? 'url(#logiq-arrow-valid)' : 'url(#logiq-arrow-invalid)')}
        style={{
          stroke: strokeColor,
          strokeWidth: 2,
          ...style,
          ...(showSnap ? { strokeDasharray: '5 5' } : {}),
        }}
      />
      {!isValid && (
        <EdgeLabelRenderer>
          <div
            data-edge-valid={isValid}
            data-edge-from={data?.fromType}
            data-edge-to={data?.toType}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F43F5E] text-xs font-bold text-white"
            aria-hidden="true"
          >
            ✕
          </div>
        </EdgeLabelRenderer>
      )}
      <EdgeLabelRenderer>
        <div
          data-edge-valid={isValid}
          data-edge-from={data?.fromType}
          data-edge-to={data?.toType}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'none',
            width: 0,
            height: 0,
          }}
          aria-hidden="true"
        />
      </EdgeLabelRenderer>
    </>
  )
}

export const BlockConnection = memo(BlockConnectionEdgeInner)