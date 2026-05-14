import { z } from 'zod'

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const canvasNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['loop', 'condition', 'comparison', 'assignment', 'return', 'variable', 'edgeCase']),
  label: z.string().min(1),
  position: positionSchema,
  data: z.record(z.string(), z.unknown()).optional().default({}),
})

export const canvasEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.enum(['default', 'step', 'smoothstep', 'straight']).optional().default('default'),
  animated: z.boolean().optional().default(false),
  data: z.record(z.string(), z.unknown()).optional().default({}),
})

export const historyEntrySchema = z.object({
  timestamp: z.number(),
  nodes: z.array(canvasNodeSchema),
  edges: z.array(canvasEdgeSchema),
})

export const canvasViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number().min(0.5).max(2),
})

export const canvasStateSchema = z.object({
  zoom: z.number().min(0.5).max(2),
  viewport: canvasViewportSchema,
  selectedBlockIds: z.array(z.string()),
  canUndo: z.boolean(),
  canRedo: z.boolean(),
  historyStack: z.array(historyEntrySchema),
  status: z.enum(['idle', 'loading', 'success', 'error']),
})

export type ValidatedNode = z.infer<typeof canvasNodeSchema>
export type ValidatedEdge = z.infer<typeof canvasEdgeSchema>
export type ValidatedHistoryEntry = z.infer<typeof historyEntrySchema>
export type ValidatedViewport = z.infer<typeof canvasViewportSchema>
export type ValidatedCanvasState = z.infer<typeof canvasStateSchema>
