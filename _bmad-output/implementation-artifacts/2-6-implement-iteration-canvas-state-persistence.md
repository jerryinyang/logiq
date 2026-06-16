# Story 2.6: Implement Iteration & Canvas State Persistence

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user revising my solution after failure,
I want to modify my logic blocks and retest,
So that I can iterate toward a correct solution.

## Acceptance Criteria

1. **Given** my solution failed testing (Story 2.4), **when** I modify blocks on the canvas (add, remove, reconnect), **then** changes are reflected instantly with <100ms response (NFR1) and the canvas state is auto-saved to localStorage every 30 seconds during active work (per architecture.md#State Management draft-work pattern).

2. **Given** I have made changes to the canvas, **when** I click "Test" again (FR4), **then** the updated logic is submitted for testing and the test execution and feedback loop repeats (per Story 2.4 and 2.5).

3. **Given** I click "Reset" (R key, UX-DR17), **when** I confirm the reset in a dialog, **then** all blocks are cleared from the canvas and the empty state reappears: "Drag blocks here to build your logic".

4. **Given** I navigate away from the challenge and return (same browser, same user), **when** the canvas loads, **then** my last saved draft is restored from local storage and a toast notification says: "Draft restored" (toast auto-dismisses after 4s, per UX feedback patterns).

5. **Given** the canvas auto-save triggers, **when** the draft is persisted, **then** a subtle "Draft saved" indicator appears briefly (2s) in the bottom-right corner of the canvas (no toast, non-disruptive).

6. **Given** I attempt "Undo" after modifying the canvas, **when** I press Ctrl+Z or click undo, **then** the last canvas operation is reversed and the previous state is restored (per React Flow's undo/redo hooks).

## Tasks / Subtasks

- [x] Task 1: Implement Canvas History (Undo/Redo) (AC: #6)
  - [x] Create `web/src/lib/canvas/history-manager.ts`
  - [x] Track node/edge changes in a history stack (max 50 entries)
  - [x] Each history entry: `{ nodes, edges, timestamp }` — snapshot of full state
  - [x] `pushHistory(nodes, edges)` — add snapshot before each state change
  - [x] `undo()`: return `{ nodes, edges }` from previous snapshot, move pointer back
  - [x] `redo()`: return `{ nodes, edges }` from next snapshot, move pointer forward
  - [x] On new modification after undo: truncate redo stack
  - [x] Track `canUndo` and `canRedo` booleans
  - [x] Integrate with React Flow's `onNodesChange`/`onEdgesChange` to capture changes

- [x] Task 2: Integrate Undo/Redo into Canvas Store (AC: #6)
  - [x] Extend `web/src/stores/canvas-store.ts`
  - [x] Add history manager instance or methods: `undo()`, `redo()`
  - [x] Add `canUndo: boolean`, `canRedo: boolean` state
  - [x] Wire Ctrl+Z / Cmd+Z to `undo()` via keyboard hook
  - [x] Wire Ctrl+Shift+Z / Cmd+Shift+Z to `redo()`
  - [x] Wire Ctrl+Y to `redo()`

- [x] Task 3: Implement Auto-Save to Local Storage (AC: #1, #4, #5)
  - [x] Create `web/src/lib/canvas/auto-save.ts`
  - [x] `saveDraft(challengeId: string, nodes: Node[], edges: Edge[]): void` — serialize and write to localStorage (userId obtained from `useUserStore.getState().user.id` internally)
  - [x] `loadDraft(challengeId: string): { nodes: Node[], edges: Edge[] } | null` — read and deserialize from localStorage
  - [x] `clearDraft(challengeId: string): void` — remove draft from localStorage
  - [x] Storage key format: `logiq:draft:{userId}:{challengeId}`
  - [x] Auto-save interval: 30 seconds during active canvas interaction (debounced)
  - [x] On save: show subtle "Draft saved" indicator (small text, bottom-right, 2s fade out)
  - [x] Handle storage quota exceeded: catch error, warn user, clear oldest drafts
  - [x] Serialize dates as ISO 8601 strings, exclude non-serializable data

- [x] Task 4: Implement Draft Restoration (AC: #4)
  - [x] On challenge page mount (`/(app)/challenge/[id]/page.tsx`):
    - Check localStorage for existing draft via `loadDraft(challengeId)`
    - If draft exists: restore nodes and edges to React Flow state
    - Show toast: "Draft restored" (Lucide `FileClock` icon, slate style)
    - If draft is older than 7 days: show toast with "Restore or start fresh?" option
  - [x] Track draft load status in canvas store: `draftStatus: "none" | "restoring" | "restored" | "saved"`
  - [x] On successful fresh test pass: auto-clear draft (solution is correct, no need to restore)

- [x] Task 5: Implement Reset Canvas (AC: #3)
  - [x] Add "Reset" button to `CanvasToolbar.tsx` (danger variant: filled rose #F43F5E background, white text per UX-DR4 button hierarchy)
  - [x] On click: show shadcn/ui AlertDialog confirmation:
    - Title: "Reset Canvas?"
    - Body: "All blocks and connections will be cleared. This cannot be undone."
    - Confirm: "Reset" (danger button)
    - Cancel: "Keep working" (secondary button)
  - [x] On confirm: set nodes and edges to empty arrays, clear draft, reset undo history
  - [x] Show empty state: "Drag blocks here to build your logic"
  - [x] Wire keyboard shortcut R key: triggers confirmation dialog
  - [x] Track reset in canvas store: `resetCount` for analytics

- [x] Task 6: Wire Keyboard R Shortcut to Reset (AC: #3)
  - [x] Update `web/src/hooks/use-canvas-keyboard.ts`
  - [x] R key → open reset confirmation dialog
  - [x] Only trigger if no text input is focused (check `document.activeElement`)

- [x] Task 7: Implement Canvas Toolbar Updates (AC: #3, #6)
  - [x] Update `web/src/components/canvas/CanvasToolbar.tsx`
  - [x] Undo button: enabled when `canUndo`, uses `Undo2` icon
  - [x] Redo button: enabled when `canRedo`, uses `Redo2` icon
  - [x] Reset button: filled rose #F43F5E background, white text, uses `RotateCcw` icon (UX-DR4 danger button)
  - [x] Disable undo/redo buttons when not available (gray state)
  - [x] Tooltips on hover: "Undo (Ctrl+Z)", "Redo (Ctrl+Shift+Z)", "Reset canvas"
  - [x] Undo/Redo buttons use shadcn/ui Button ghost variant with icon only; Reset uses danger filled variant with icon + label

- [x] Task 8: Testing & Quality Assurance
  - [x] Write unit test for history manager (push, undo, redo, truncate on new change)
  - [x] Write unit test for auto-save (save, load, clear via localStorage mock)
  - [x] Write unit test for draft restoration on page mount
  - [x] Write unit test for reset canvas (clear state, show empty state)
  - [x] Write unit test for undo keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
  - [x] Write integration test: modify canvas → auto-save → navigate away → return → draft restored
  - [x] Write integration test: undo → state reverts → redo → state returns
  - [x] Write integration test: reset → confirm → canvas clears
  - [x] Test localStorage quota handling
  - [x] Test draft expiration (7-day cutoff)
  - [x] Verify auto-save interval timing (within 30s window)
  - [x] Accessibility: reset dialog keyboard trap, ARIA announcements
  - [x] Verify `npm run build` succeeds without errors

## Runnable Code Location

All runnable code MUST be created in the `web/` subfolder at the project root.

## Dev Notes

### Architecture Patterns & Constraints

- **LocalStorage Pattern:** Drafts stored in browser localStorage scoped to user+challenge. JSON serialization. No sensitive data — canvas state is block positions and connections only. [Source: architecture.md#Cross-Cutting Concerns — State Management]
- **History Stack:** Maximum 50 entries to prevent memory issues. Each entry is a full snapshot (not deltas). Simpler implementation. Size: ~10KB per snapshot with moderate block count (20 blocks). **Note:** This custom history-manager.ts replaces React Flow's built-in undo/redo hooks (which were enabled in Story 2.1). The custom approach gives us exact control over snapshot timing (only on meaningful changes, not every position update) and integrates cleanly with our Zustand canvas store. [Source: architecture.md#Canvas Technology — Undo/redo hooks]
- **Auto-Save Timing:** 30 second interval, debounced from last interaction. Uses `window.setInterval` scoped to challenge page lifetime. Cleared on unmount. [Source: architecture.md#Cross-Cutting Concerns — State Management; prd.md#State Management — Local storage for offline draft work]
- **State Reconciliation:** On draft restore, React Flow's `setNodes`/`setEdges` sets initial state. History stack is initialized fresh (past state unavailable). Undo only works from restore point forward. Draft restoration happens in `page.tsx` useEffect; `LogicBlockCanvas.tsx` receives restored nodes/edges as initial props rather than pulling from store directly. [Source: architecture.md#State Update Patterns]

### CRITICAL Anti-Patterns to AVOID

1. **DO NOT** use cookies for canvas drafts — use localStorage (5MB limit is sufficient)
2. **DO NOT** save sensitive user data in localStorage — block configuration only
3. **DO NOT** skip reset confirmation — canvas clearing is destructive
4. **DO NOT** create history snapshots on every keystroke/mouse move — only on meaningful node/edge changes
5. **DO NOT** let history stack grow unbounded — enforce 50-entry limit with FIFO removal
6. **DO NOT** auto-restore draft without notification — user must know their work was restored
7. **DO NOT** serialize non-serializable objects (functions, symbols, undefined) into localStorage

### Project Structure Notes

Expected new/updated files:
```
web/src/
├── lib/
│   └── canvas/
│       ├── history-manager.ts               # Undo/redo history stack
│       └── auto-save.ts                     # LocalStorage draft persistence
├── components/
│   └── canvas/
│       ├── CanvasToolbar.tsx                # Updated: Undo, Redo, Reset buttons
│       ├── LogicBlockCanvas.tsx            # Updated: Restore draft on mount
│       └── ResetConfirmDialog.tsx           # Reset confirmation modal
├── hooks/
│   └── use-canvas-keyboard.ts              # Updated: Ctrl+Z/Y/Shift+Z undo/redo, R key reset
├── stores/
│   └── canvas-store.ts                     # Extended: history, draft, reset state
├── types/
│   └── canvas-types.ts                     # Updated: DraftData, HistoryEntry interfaces
└── app/
    └── (app)/
        └── challenge/
            └── [id]/
                └── page.tsx                 # Updated: draft restoration on mount
```

### Previous Story Intelligence

**From Story 2.5 (Step-Through):**
- `ExecutionOverlay.tsx` controls that activate after test failure
- Step tracker with current step index

**From Story 2.4 (Execution Engine):**
- `submitSolution` Server Action for test submission
- `TestResults.tsx` showing pass/fail
- Canvas store `testStatus` state

**From Story 2.3 (Connection Validation):**
- Edge management via canvas store

**From Story 2.2 (Block Palette):**
- Block additions via `addBlock` canvas store action
- Block removal via `removeBlock` action

**From Story 2.1 (Canvas Setup):**
- `CanvasToolbar.tsx` with zoom controls
- `use-canvas-keyboard.ts` keyboard hook
- Canvas store foundation

### Testing Standards

- **localStorage Mocking:** Use `vi.stubGlobal('localStorage', mockStorage)` or `jsdom`'s built-in localStorage
- **History Tests:** Pure state machine — test all transitions and edge cases
- **Integration:** Full flow from modification → save → navigate → restore
- **Timing:** Use `vi.useFakeTimers()` for auto-save interval testing

### localStorage Key Schema

```
Key:   logiq:draft:{userId}:{challengeId}
Value: JSON stringified { nodes: Node[], edges: Edge[], savedAt: ISO8601, version: 1 }
Example key: logiq:draft:usr_abc123:challenge_linear-search
Max draft age: 7 days (604800000ms)
Max drafts per user: 20 (FIFO eviction of oldest)
```

### Design Token Reference

```
Reset Button (danger):     bg #F43F5E (Rose), text #FFFFFF, filled variant (UX-DR4)
Undo/Redo Button:          bg transparent, icon #94A3B8 (Slate secondary), ghost variant
Undo/Redo Disabled:        opacity 0.4
Draft Saved Indicator:     text Inter 11px #94A3B8, position: fixed bottom-right canvas
Toast (Draft Restored):    bg #1E293B, border left 3px #6366F1 (Indigo)
Reset Dialog Overlay:      bg #0F172A at 60% opacity
```

### References

- [Source: epics.md#Story 2.6] - Original story definition and acceptance criteria
- [Source: epics.md#FR4] - Revise and iterate on logic solution after failure
- [Source: epics.md#NFR1] - Canvas interactions <100ms
- [Source: architecture.md#Cross-Cutting Concerns — State Management] - localStorage draft persistence pattern
- [Source: architecture.md#Canvas Technology] - Undo/redo hooks, canvas state
- [Source: architecture.md#State Update Patterns] - Zustand state updates, status enums
- [Source: ux-design-specification.md#UX-DR4] - Button hierarchy (danger button for reset)
- [Source: ux-design-specification.md#UX-DR14] - Empty state ("Drag blocks here...")
- [Source: ux-design-specification.md#UX-DR17] - Keyboard shortcuts (Ctrl+Z, R=Reset)
- [Source: 2-4-build-logic-block-execution-engine-test-runner.md] - Test submission flow
- [Source: 2-5-implement-step-through-execution-visualization.md] - Execution overlay

## Dev Agent Record

### Agent Model Used

glm-5.1

### Debug Log References

### Completion Notes List

- ✅ Implemented HistoryManager class with pointer-based undo/redo (max 50 entries) replacing inline history in canvas-store
- ✅ Refactored canvas-store to use HistoryManager, added resetCanvas(), setDraftStatus(), draftStatus, resetCount
- ✅ Created auto-save.ts with saveDraft/loadDraft/clearDraft/startAutoSave with localStorage key format logiq:draft:{userId}:{challengeId}, 30s interval, quota handling, 7-day expiry
- ✅ Created use-draft-restore.ts hook for draft restoration on page mount with expired draft dialog
- ✅ Created use-auto-save.ts hook for 30s auto-save interval with draft clearing on test success
- ✅ Created DraftSavedIndicator component (subtle 2s bottom-right indicator per AC#5)
- ✅ Created ResetConfirmDialog component (shadcn AlertDialog with danger button per AC#3)
- ✅ Created DraftExpiredDialog component for 7-day old drafts
- ✅ Updated LogicBlockCanvas to integrate all new features (draft restore, auto-save, reset dialog, undo/redo)
- ✅ Updated CanvasToolbar with Reset button (rose #F43F5E), Undo/Redo with tooltips, disabled states at 0.4 opacity
- ✅ Updated use-canvas-keyboard with Ctrl+Z/Y/Shift+Z undo/redo and R key reset
- ✅ Updated challenge page to pass challengeId to LogicBlockCanvas
- ✅ All 238+ tests pass including new history-manager, auto-save, draft-restore, reset, undo/redo keyboard tests
- ✅ Build succeeds without errors

### File List

- web/src/lib/canvas/history-manager.ts (NEW)
- web/src/lib/canvas/history-manager.test.ts (NEW)
- web/src/lib/canvas/auto-save.ts (NEW)
- web/src/lib/canvas/auto-save.test.ts (NEW)
- web/src/stores/canvas-store.ts (MODIFIED)
- web/src/stores/canvas-store.test.ts (MODIFIED)
- web/src/stores/canvas-store-undo-redo-reset.test.ts (NEW)
- web/src/types/canvas-types.ts (MODIFIED - added DraftStatus, DraftData types)
- web/src/hooks/use-canvas-keyboard.ts (MODIFIED)
- web/src/hooks/use-canvas-keyboard.test.ts (MODIFIED)
- web/src/hooks/use-canvas-keyboard-undo-redo.test.ts (NEW)
- web/src/hooks/use-draft-restore.ts (NEW)
- web/src/hooks/use-draft-restore.test.ts (NEW)
- web/src/hooks/use-auto-save.ts (NEW)
- web/src/hooks/use-auto-save.test.ts (NEW)
- web/src/components/canvas/LogicBlockCanvas.tsx (MODIFIED)
- web/src/components/canvas/CanvasToolbar.tsx (MODIFIED)
- web/src/components/canvas/ResetConfirmDialog.tsx (NEW)
- web/src/components/canvas/ResetConfirmDialog.test.tsx (NEW)
- web/src/components/canvas/DraftSavedIndicator.tsx (NEW)
- web/src/components/canvas/DraftSavedIndicator.test.tsx (NEW)
- web/src/components/canvas/DraftExpiredDialog.tsx (NEW)
- web/src/components/canvas/DraftExpiredDialog.test.tsx (NEW)
- web/src/app/(app)/challenge/[id]/page.tsx (MODIFIED)

### Review Findings (2026-05-15)

#### Decision Needed

- [x] [Review][Decision] T/R keyboard shortcuts NOT guarded during step-through execution **→ Resolved: Block both T and R during step-through.**
- [x] [Review][Decision] localStorage userId always `"anonymous"` **→ Resolved: Source from useUserStore. Created `web/src/stores/user-store.ts` and integrated into hooks.**
- [x] [Review][Decision] Auto-save is fixed 30s interval, not debounced from interaction **→ Resolved: Keep fixed 30s interval (intentional).**
- [x] [Review][Decision] React Flow's built-in `<Controls>` component coexists with custom undo/redo toolbar **→ Resolved: Removed built-in Controls, added custom zoom in/out/fit-view buttons.**
- [x] [Review][Decision] DraftSavedIndicator uses viewport `fixed` positioning vs canvas-relative `absolute` **→ Resolved: Changed to canvas-container relative positioning (`absolute`).**

#### Patch

- [x] [Review][Patch] HistoryManager module singleton leaks state across challenge navigations [web/src/stores/canvas-store.ts:60, web/src/lib/canvas/history-manager.ts:9]
- [x] [Review][Patch] `_expired` property smuggled through type assertion without type declaration [web/src/lib/canvas/auto-save.ts:1217]
- [x] [Review][Patch] pushHistory mutations happen OUTSIDE Zustand set() callback [web/src/stores/canvas-store.ts:601-658]
- [x] [Review][Patch] Reset button not disabled while test is running [web/src/components/canvas/CanvasToolbar.tsx:100-112]
- [x] [Review][Patch] Dead Zustand subscriptions cause unnecessary re-renders [web/src/components/canvas/LogicBlockCanvas.tsx:260-264, web/src/hooks/use-auto-save.ts:53-54]
- [x] [Review][Patch] `hasRestored` ref never resets when challengeId changes [web/src/hooks/use-draft-restore.ts:1659-1667]
- [x] [Review][Patch] declineExpiredDraft doesn't call clearDraft — user stuck in expired draft loop [web/src/hooks/use-draft-restore.ts:1696-1699]
- [x] [Review][Patch] startAutoSave writes immediately on mount, races with draft restore [web/src/lib/canvas/auto-save.ts:1273]
- [x] [Review][Patch] Post-reset auto-save saves empty canvas as draft [web/src/components/canvas/LogicBlockCanvas.tsx:284-290]
- [x] [Review][Patch] Ctrl+R / Ctrl+T hijacked by R/T keyboard handler [web/src/hooks/use-canvas-keyboard.ts:75-84]
- [x] [Review][Patch] DraftExpiredDialog onStartFresh fires on any dialog close (ESC/X) [web/src/components/canvas/DraftExpiredDialog.tsx:2406]
- [x] [Review][Patch] Node drag floods history, evicting meaningful undo states [web/src/components/canvas/LogicBlockCanvas.tsx:247-257]
- [x] [Review][Patch] Duplicate expiration logic between loadDraft and isDraftExpired [web/src/lib/canvas/auto-save.ts]
- [x] [Review][Patch] undo()/redo() return raw snapshot references without defensive copy [web/src/lib/canvas/history-manager.ts:916-928]
- [x] [Review][Patch] Initial save in startAutoSave doesn't trigger onSaved callback [web/src/lib/canvas/auto-save.ts:1275]
- [x] [Review][Patch] Toast "Draft restored" uses sonner default success styling, not indigo design token [web/src/components/canvas/LogicBlockCanvas.tsx]
- [x] [Review][Patch] acceptExpiredDraft silently fails if draft evicted between dialog and click [web/src/hooks/use-draft-restore.ts:41-42]
- [x] [Review][Patch] Undo/redo active during step-through execution visualization [web/src/hooks/use-canvas-keyboard.ts:39-57]
