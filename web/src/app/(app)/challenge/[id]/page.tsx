'use client'

import { LogicBlockCanvas } from '@/components/canvas/LogicBlockCanvas'

interface ChallengePageProps {
  params: Promise<{ id: string }>
}

export default function ChallengePage({ params }: ChallengePageProps) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Desktop 3-panel layout */}
      <div className="hidden h-full grid-cols-[280px_1fr_300px] lg:grid">
        {/* Left panel - Challenge description */}
        <aside className="border-r border-border bg-card p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-foreground">Challenge</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Challenge description will appear here.
          </p>
        </aside>

        {/* Center panel - Canvas */}
        <main className="relative overflow-hidden">
          <LogicBlockCanvas />
        </main>

        {/* Right panel - Block palette */}
        <aside className="border-l border-border bg-card p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-foreground">Blocks</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Block palette will appear here.
          </p>
        </aside>
      </div>

      {/* Tablet/Mobile fallback */}
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 lg:hidden">
        <p className="text-center text-lg font-medium text-muted-foreground">
          Logic building is best on a larger screen
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Please switch to a desktop or laptop for the full experience.
        </p>
      </div>
    </div>
  )
}
