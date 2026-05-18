'use client'

import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { TestResult } from '@/types/execution-types'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useCanvasStore } from '@/stores/canvas-store'

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (Array.isArray(value)) return JSON.stringify(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

interface EdgeCaseStressTestProps {
  standardResults: TestResult[]
  edgeCaseResults: TestResult[]
}

export function EdgeCaseStressTest({ standardResults, edgeCaseResults }: EdgeCaseStressTestProps) {
  const setStepThroughActive = useCanvasStore((s) => s.setStepThroughActive)

  const standardPassed = standardResults.filter((r) => r.passed).length
  const standardFailed = standardResults.length - standardPassed
  const edgeCasePassed = edgeCaseResults.filter((r) => r.passed).length
  const edgeCaseFailed = edgeCaseResults.length - edgeCasePassed
  const hasEdgeCaseFailures = edgeCaseFailed > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-700/50 hover:bg-emerald-900/70">
            {standardPassed}/{standardResults.length} standard passed
          </Badge>
          <Badge className={`${edgeCaseFailed > 0 ? 'bg-rose-900/50 text-rose-400 border-rose-700/50 hover:bg-rose-900/70' : 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50 hover:bg-emerald-900/70'}`}>
            {edgeCasePassed}/{edgeCaseResults.length} edge cases passed
          </Badge>
        </div>
        {hasEdgeCaseFailures && (
          <button
            onClick={() => { setStepThroughActive(true) }}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
            aria-label="Step through edge case failure"
          >
            Step Through
          </button>
        )}
      </div>

      <div className="border-t border-[#334155]" />

      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Standard Tests</h3>
        {standardResults.length === 0 ? (
          <p className="text-xs text-slate-400">No standard tests</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {standardResults.map((result) => (
              <AccordionItem key={result.testCaseId} value={`standard-${result.testCaseId}`}>
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <span className={result.passed ? 'text-slate-300' : 'text-white font-medium'}>
                      Test Case {result.testCaseId}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="rounded-md bg-slate-800/50 p-2.5">
                      <p className="text-slate-400 text-xs mb-1">Input</p>
                      <code className="text-slate-200 break-all">{formatValue(result.input)}</code>
                    </div>
                    {!result.passed && (
                      <>
                        <div className="rounded-md bg-emerald-950/30 p-2.5 border border-emerald-800/30">
                          <p className="text-emerald-400 text-xs mb-1">Expected</p>
                          <code className="text-emerald-300 break-all">{formatValue(result.expected)}</code>
                        </div>
                        <div className="rounded-md bg-rose-950/30 p-2.5 border border-rose-800/30">
                          <p className="text-rose-400 text-xs mb-1">Actual</p>
                          <code className="text-rose-300 break-all">{formatValue(result.actual)}</code>
                        </div>
                        {result.errorStep !== undefined && (
                          <p className="text-xs text-rose-400/80">
                            Failed at step {result.errorStep + 1}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-400">Edge Case Tests</h3>
          <Badge variant="outline" className="text-xs border-amber-600 text-amber-400">
            {edgeCaseResults.length} {edgeCaseResults.length === 1 ? 'test' : 'tests'}
          </Badge>
        </div>
        {edgeCaseResults.length === 0 ? (
          <p className="text-xs text-slate-400">No edge case tests</p>
        ) : (
          <Accordion type="multiple" defaultValue={hasEdgeCaseFailures ? edgeCaseResults.filter(r => !r.passed).map(r => `edge-${r.testCaseId}`) : []} className="w-full">
            {edgeCaseResults.map((result) => (
              <AccordionItem key={result.testCaseId} value={`edge-${result.testCaseId}`}>
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <span className={result.passed ? 'text-slate-300' : 'text-white font-medium'}>
                      Edge Case Test {result.testCaseId}
                    </span>
                    <Badge variant="outline" className="text-xs border-amber-600 text-amber-400">
                      edge case
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="rounded-md bg-slate-800/50 p-2.5">
                      <p className="text-slate-400 text-xs mb-1">Input</p>
                      <code className="text-slate-200 break-all">{formatValue(result.input)}</code>
                    </div>
                    {!result.passed && (
                      <>
                        <div className="rounded-md bg-emerald-950/30 p-2.5 border border-emerald-800/30">
                          <p className="text-emerald-400 text-xs mb-1">Expected</p>
                          <code className="text-emerald-300 break-all">{formatValue(result.expected)}</code>
                        </div>
                        <div className="rounded-md bg-rose-950/30 p-2.5 border border-rose-800/30">
                          <p className="text-rose-400 text-xs mb-1">Actual</p>
                          <code className="text-rose-300 break-all">{formatValue(result.actual)}</code>
                        </div>
                        {result.errorStep !== undefined && (
                          <p className="text-xs text-rose-400/80">
                            Failed at step {result.errorStep + 1}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}