'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ExecutionStep, TestResult } from '@/types/execution-types'
import { BLOCK_LABELS } from '@/lib/canvas/block-validation'
import { detectCommonMistake } from '@/lib/execution/mistake-patterns'

interface StepDescriptionProps {
  step: ExecutionStep | null
  stepIndex: number
  totalSteps: number
  isAtFailure: boolean
  testResults: TestResult[] | null
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (Array.isArray(value)) return JSON.stringify(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function StepDescription({ step, stepIndex, totalSteps, isAtFailure, testResults }: StepDescriptionProps) {
  const [expanded, setExpanded] = useState(false)

  if (!step) {
    return null
  }

  const blockLabel = BLOCK_LABELS[step.blockType as keyof typeof BLOCK_LABELS] ?? step.blockType
  const mistakeMessage = isAtFailure
    ? detectCommonMistake(null, testResults, {
        blockType: step.blockType,
        errorMessage: step.errorMessage,
        input: step.input,
        output: step.output,
      })
    : null

  const statusLabel = step.status === 'error' ? 'failed' : step.status === 'success' ? 'passed' : 'executing'

  return (
    <div className="mt-2 w-full rounded-lg border border-[#334155] bg-[#0F172A] text-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-[#1E293B] transition-colors"
        aria-expanded={expanded}
        aria-label={`Step ${stepIndex + 1} of ${totalSteps}: ${blockLabel} — ${statusLabel}. ${expanded ? 'Collapse details' : 'Expand details'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
            step.status === 'error' ? 'bg-rose-900/50 text-rose-400' :
            step.status === 'success' ? 'bg-emerald-900/50 text-emerald-400' :
            'bg-indigo-900/50 text-indigo-400'
          }`}>
            Step {stepIndex + 1}/{totalSteps}
          </span>
          <span className="text-slate-300 truncate">{blockLabel}</span>
          <span className={`text-xs ${
            step.status === 'error' ? 'text-rose-400' :
            step.status === 'success' ? 'text-emerald-400' :
            'text-indigo-400'
          }`}>
            — {statusLabel}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 text-xs">
          <div className="rounded-md bg-slate-800/50 p-2">
            <p className="text-slate-400 mb-1">Block Type</p>
            <code className="text-slate-200">{blockLabel}</code>
          </div>

          {step.input !== undefined && step.input !== null && (
            <div className="rounded-md bg-slate-800/50 p-2">
              <p className="text-slate-400 mb-1">Input</p>
              <code className="text-slate-200 break-all">{formatValue(step.input)}</code>
            </div>
          )}

          {step.output !== undefined && step.output !== null && (
            <div className="rounded-md bg-slate-800/50 p-2">
              <p className="text-slate-400 mb-1">Output</p>
              <code className={`break-all ${step.status === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
                {formatValue(step.output)}
              </code>
            </div>
          )}

          {isAtFailure && step.errorMessage && (
            <div className="rounded-md bg-rose-950/30 border border-rose-800/30 p-2">
              <p className="text-rose-400 mb-1">Error</p>
              <code className="text-rose-300 break-all">{step.errorMessage}</code>
            </div>
          )}

          {mistakeMessage && (
            <div className="rounded-md bg-amber-950/30 border border-amber-800/30 p-2">
              <p className="text-amber-300 text-xs">💡 {mistakeMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}