# Story 2.6: Implement Iteration & Canvas State Persistence

Status: ready-for-dev

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

- [ ] Task 1: Implement Canvas History (Undo/Redo) (AC: #6)
  - [ ] Create `web/src/lib/canvas/history-manager.ts`
  - [ ] Track node/edge changes in a history stack (max 50 entries)
  - [ ] Each history entry: `{ nodes, edges, timestamp }` — snapshot of full state
  - [ ] `pushHistory(nodes, edges)` — add snapshot before each state change
  - [ ] `undo()`: return `{ nodes, edges }` from previous snapshot, move pointer back
  - [ ] `redo()`: return `{ nodes, edges }` from next snapshot, move pointer forward
  - [ ] On new modification after undo: truncate redo stack
  - [ ] Track `canUndo` and `canRedo` booleans
  - [ ] Integrate with React Flow's `onNodesChange`/`onEdgesChange` to capture changes

- [ ] Task 2: Integrate Undo/Redo into Canvas Store (AC: #6)
  - [ ] Extend `web/src/stores/canvas-store.ts`
  - [ ] Add history manager instance or methods: `undo()`, `redo()`
  - [ ] Add `canUndo: boolean`, `canRedo: boolean` state
  - [ ] Wire Ctrl+Z / Cmd+Z to `undo()` via keyboard hook
  - [ ] Wire Ctrl+Shift+Z / Cmd+Shift+Z to `redo()`
  - [ ] Wire Ctrl+Y to `redo()`

- [ ] Task 3: Implement Auto-Save to Local Storage (AC: #1, #4, #5)
  - [ ] Create `web/src/lib/canvas/auto-save.ts`
  - [ ] `saveDraft(challengeId: string, nodes: Node[], edges: Edge[]): void` — serialize and write to localStorage (userId obtained from `useUserStore.getState().user.id` internally)
  - [ ] `loadDraft(challengeId: string): { nodes: Node[], edges: Edge[] } | null` — read and deserialize from localStorage
  - [ ] `clearDraft(challengeId: string): void` — remove draft from localStorage
  - [ ] Storage key format: `logiq:draft:{userId}:{challengeId}`
  - [ ] Auto-save interval: 30 seconds during active canvas interaction (debounced)
  - [ ] On save: show subtle "Draft saved" indicator (small text, bottom-right, 2s fade out)
  - [ ] Handle storage quota exceeded: catch error, warn user, clear oldest drafts
  - [ ] Serialize dates as ISO 8601 strings, exclude non-serializable data

- [ ] Task 4: Implement Draft Restoration (AC: #4)
  - [ ] On challenge page mount (`/(app)/challenge/[id]/page.tsx`):
    - Check localStorage for existing draft via `loadDraft(challengeId)`
    - If draft exists: restore nodes and edges to React Flow state
    - Show toast: "Draft restored" (Lucide `FileClock` icon, slate style)
    - If draft is older than 7 days: show toast with "Restore or start fresh?" option
  - [ ] Track draft load status in canvas store: `draftStatus: "none" | "restoring" | "restored" | "saved"`
  - [ ] On successful fresh test pass: auto-clear draft (solution is correct, no need to restore)

- [ ] Task 5: Implement Reset Canvas (AC: #3)
  - [ ] Add "Reset" button to `CanvasToolbar.tsx` (danger variant: filled rose #F43F5E background, white text per UX-DR4 button hierarchy)
  - [ ] On click: show shadcn/ui AlertDialog confirmation:
    - Title: "Reset Canvas?"
    - Body: "All blocks and connections will be cleared. This cannot be undone."
    - Confirm: "Reset" (danger button)
    - Cancel: "Keep working" (secondary button)
  - [ ] On confirm: set nodes and edges to empty arrays, clear draft, reset undo history
  - [ ] Show empty state: "Drag blocks here to build your logic"
  - [ ] Wire keyboard shortcut R key: triggers confirmation dialog
  - [ ] Track reset in canvas store: `resetCount` for analytics

- [ ] Task 6: Wire Keyboard R Shortcut to Reset (AC: #3)
  - [ ] Update `web/src/hooks/use-canvas-keyboard.ts`
  - [ ] R key → open reset confirmation dialog
  - [ ] Only trigger if no text input is focused (check `document.activeElement`)

- [ ] Task 7: Implement Canvas Toolbar Updates (AC: #3, #6)
  - [ ] Update `web/src/components/canvas/CanvasToolbar.tsx`
  - [ ] Undo button: enabled when `canUndo`, uses `Undo2` icon
  - [ ] Redo button: enabled when `canRedo`, uses `Redo2` icon
  - [ ] Reset button: filled rose #F43F5E background, white text, uses `RotateCcw` icon (UX-DR4 danger button)
  - [ ] Disable undo/redo buttons when not available (gray state)
  - [ ] Tooltips on hover: "Undo (Ctrl+Z)", "Redo (Ctrl+Shift+Z)", "Reset canvas"
  - [ ] Undo/Redo buttons use shadcn/ui Button ghost variant with icon only; Reset uses danger filled variant with icon + label

- [ ] Task 8: Testing & Quality Assurance
  - [ ] Write unit test for history manager (push, undo, redo, truncate on new change)
  - [ ] Write unit test for auto-save (save, load, clear via localStorage mock)
  - [ ] Write unit test for draft restoration on page mount
  - [ ] Write unit test for reset canvas (clear state, show empty state)
  - [ ] Write unit test for undo keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
  - [ ] Write integration test: modify canvas → auto-save → navigate away → return → draft restored
  - [ ] Write integration test: undo → state reverts → redo → state returns
  - [ ] Write integration test: reset → confirm → canvas clears
  - [ ] Test localStorage quota handling
  - [ ] Test draft expiration (7-day cutoff)
  - [ ] Verify auto-save interval timing (within 30s window)
  - [ ] Accessibility: reset dialog keyboard trap, ARIA announcements
  - [ ] Verify `npm run build` succeeds without errors

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
