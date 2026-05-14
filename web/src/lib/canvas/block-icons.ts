import type { BlockType } from '@/types/canvas-types'
import {
  Repeat,
  GitBranch,
  Equal,
  Box,
  ArrowRight,
  CornerDownLeft,
  AlertTriangle,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<BlockType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  loop: Repeat,
  condition: GitBranch,
  comparison: Equal,
  variable: Box,
  assignment: ArrowRight,
  return: CornerDownLeft,
  edgeCase: AlertTriangle,
}

export const FALLBACK_ICON = Box