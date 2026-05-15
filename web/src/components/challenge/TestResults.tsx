'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { TestResult } from '@/types/execution-types'

interface TestResultsProps {
  results: TestResult[]
  onClose: () => void
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (Array.isArray(value)) return JSON.stringify(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function TestResults({ results, onClose }: TestResultsProps) {
  const passedCount = results.filter((r) => r.passed).length
  const failedCount = results.length - passedCount
  const allPassed = failedCount === 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg"
      >
        <Card className="border-[#334155] bg-[#1E293B] text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {allPassed ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </motion.div>
                  <span>All test cases passed</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <span>Some tests failed</span>
                </>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {allPassed ? (
                  <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-700/50 hover:bg-emerald-900/70">
                    {passedCount} passed
                  </Badge>
                ) : (
                  <>
                    <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-700/50 hover:bg-emerald-900/70">
                      {passedCount} passed
                    </Badge>
                    <Badge className="bg-rose-900/50 text-rose-400 border-rose-700/50 hover:bg-rose-900/70">
                      {failedCount} failed
                    </Badge>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Close results"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {allPassed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-2 py-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.3 }}
                  className="text-5xl"
                >
                  &#10003;
                </motion.div>
                <p className="text-sm text-slate-400">
                  All {results.length} test case{results.length !== 1 ? 's' : ''} passed
                </p>
              </motion.div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {results.map((result) => (
                  <AccordionItem key={result.testCaseId} value={result.testCaseId}>
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
                        {result.isEdgeCase && (
                          <Badge variant="outline" className="text-xs border-amber-600 text-amber-400">
                            edge case
                          </Badge>
                        )}
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
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}