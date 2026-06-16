import { z } from 'zod'
import type { BlockType } from '@/types/canvas-types'

const blockConfigSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['loop', 'condition', 'comparison', 'assignment', 'return', 'variable', 'edgeCase']),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  connections: z.object({
    output: z.array(z.string()),
    input: z.array(z.string()),
  }),
  config: z.record(z.unknown()),
})

export const submitSolutionSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  blockConfig: z.array(blockConfigSchema).min(1, 'Block configuration cannot be empty'),
})

export type SubmitSolutionInput = z.infer<typeof submitSolutionSchema>

export type SolutionBlockConfig = z.infer<typeof blockConfigSchema>