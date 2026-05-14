'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BLOCK_CATEGORIES } from '@/types/canvas-types'
import { BLOCKS_BY_CATEGORY } from '@/lib/canvas/block-vocabulary'
import type { BlockType, BlockCategory } from '@/types/canvas-types'
import type { BlockVocabularyEntry } from '@/lib/canvas/block-vocabulary'
import { CATEGORY_ICONS, FALLBACK_ICON } from '@/lib/canvas/block-icons'

function BlockPreview({ entry }: { entry: BlockVocabularyEntry }) {
  const Icon = CATEGORY_ICONS[entry.type] ?? FALLBACK_ICON

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData('application/logiq-block', JSON.stringify(entry))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      role="option"
      aria-label={`${entry.label} — ${entry.description}`}
      tabIndex={0}
      className="flex cursor-grab items-center gap-3 rounded-md border border-border/50 bg-card px-3 py-2 transition-colors hover:border-primary/50 hover:bg-accent/10 active:cursor-grabbing"
      style={{ borderLeftWidth: '3px', borderLeftColor: entry.category.color }}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: entry.category.color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-xs text-foreground">{entry.label}</p>
        <p className="truncate text-[10px] text-muted-foreground">{entry.description}</p>
      </div>
    </div>
  )
}

export function BlockPalette() {
  const [search, setSearch] = useState('')

  return (
    <aside
      className="flex h-full w-[300px] flex-col overflow-y-auto p-4"
      role="listbox"
      aria-label="Available blocks"
    >
      <h2 className="mb-3 text-lg font-semibold text-foreground">Blocks</h2>

      <input
        type="search"
        placeholder="Search blocks…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search blocks"
      />

      <Accordion type="multiple" defaultValue={BLOCK_CATEGORIES.map((c: BlockCategory) => c.type)} className="flex-1">
        {BLOCK_CATEGORIES.map((category: BlockCategory) => {
          const blocks = (BLOCKS_BY_CATEGORY[category.type] ?? []).filter((b: BlockVocabularyEntry) => {
            if (!search) return true
            const q = search.toLowerCase()
            return (
              b.label.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
            )
          })

          if (blocks.length === 0 && search) return null

          return (
            <AccordionItem key={category.type} value={category.type}>
              <AccordionTrigger
                className="hover:no-underline"
                aria-label={`Available blocks — ${category.label} — ${blocks.length} items`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{category.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{blocks.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2" role="group" aria-label={`${category.label} blocks`}>
                  {blocks.map((block: BlockVocabularyEntry) => (
                    <BlockPreview key={`${block.type}-${block.label}`} entry={block} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </aside>
  )
}