# Story 2.5: Implement Step-Through Execution Visualization

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user whose logic failed a test case,
I want to step through my logic execution one step at a time,
So that I can see exactly where and why my logic broke.

## Acceptance Criteria

1. **Given** my logic solution failed one or more test cases (Story 2.4), **when** I view the canvas after failure, **then** the `ExecutionOverlay.tsx` component is active with play/pause/step controls (UX-DR10) and the failure path is highlighted in red (Rose #F43F5E).

2. **Given** I click the "Step" button, **when** I step through execution, **then** each block in the flow is highlighted sequentially as it executes, the current block's operation is described in a panel: "Step 2: Compare value — expected > 5, got 3", and when execution reaches the failure point, it stops and the red highlight intensifies.

3. **Given** I click "Play", **when** the auto step-through runs, **then** blocks light up sequentially at a readable pace (500ms per step) and the execution pauses automatically at the failure point.

4. **Given** I am viewing a failure, **when** the failure point is highlighted, **then** a common mistake context may display: "80% of developers make this mistake here" if pattern matches (UX-DR10).

5. **Given** I am using a screen reader, **when** the step-through execution runs, **then** each step is announced: "Step 1: Loop through items", "Step 2: Compare value — failed" (UX-DR13).

6. **Given** I am at any step in the execution, **when** I use keyboard controls, **then** Arrow Right = step forward, Arrow Left = step back, Space = play/pause (UX-DR17).

## Tasks / Subtasks

- [x] Task 1: Create Execution Step Tracker (AC: #1, #2)
  - [x] Create `web/src/lib/execution/step-tracker.ts`
  - [x] `getExecutionPath(steps: ExecutionStep[]): { currentIndex, totalSteps, step, hasNext, hasPrevious, failureIndex, failureStep }`
  - [x] Track current step index with reactive state
  - [x] Provide step navigation: `nextStep()`, `previousStep()`, `goToStep(index)`
  - [x] Identify failure step index from ExecutionReport
  - [x] Return current step's block ID for canvas highlighting

- [x] Task 2: Create ExecutionOverlay Component (AC: #1, #2, #3, #6)
  - [x] Create `web/src/components/canvas/ExecutionOverlay.tsx`
  - [x] Show when canvas store `testStatus === "error"` (test failed)
  - [x] Render playback controls:
    - [x] Play/Pause button (Lucide `Play`/`Pause`)
    - [x] Step Forward button (Lucide `StepForward`)
    - [x] Step Back button (Lucide `StepBack`)
    - [x] Progress indicator: "Step {current}/{total}"
  - [x] Position: floating panel at bottom-center of canvas via React Flow `<Panel>`
  - [x] Dark background (#1E293B), rounded, with control buttons
  - [x] Step description panel below controls (expandable)
  - [x] Auto-play mode: step forward every 500ms until failure point or end
  - [x] Pause automatically at failure step

- [x] Task 3: Implement Canvas Block Highlighting (AC: #1, #2, #3)
  - [x] Create `web/src/lib/canvas/execution-highlighter.ts`
  - [x] Map execution step's `blockId` to canvas node and edge
  - [x] `getHighlightStyles(blockId, currentStepIndex, failureIndex): { nodeClass, edgeClass }`
  - [x] Define per-state styles for React Flow nodes/edges:
    - [x] Unexecuted: neutral (Slate #64748B)
    - [x] Currently executing: indigo pulse border (#6366F1) + opacity 1.0
    - [x] Executed (success): emerald border (#10B981) + opacity 0.8
    - [x] Failure point: rose border (#F43F5E) + shake animation + red glow
    - [x] Not yet executed: dimmed opacity 0.4
  - [x] Define edge styles: executed path has brighter stroke (#10B981 3px), unexecuted path is dimmed (#64748B 1px opacity 0.3)
  - [x] Update `LogicBlockCanvas.tsx`: consume `getHighlightStyles()` results, apply to node data and `useEdgesState` so styles re-render reactively when `currentStepIndex` changes
  - [x] Return style objects consumable by node/edge rendering

- [x] Task 4: Create Step Description Panel (AC: #2, #4)
  - [x] Create `web/src/components/canvas/StepDescription.tsx` (separate component imported by `ExecutionOverlay.tsx`)
  - [x] Show current step details: block type icon, label, description
  - [x] Show input value, operation, output value for current step
  - [x] At failure point: show expected vs actual, error message
  - [x] Show common mistake context if applicable (configurable via pattern library from Task 5)
  - [x] Style: card with monospace values (JetBrains Mono), clear visual hierarchy
  - [x] Collapsible/expandable: collapsed by default showing step summary, expandable to full detail

- [x] Task 5: Implement Common Mistake Pattern Matching (AC: #4)
  - [x] Create `web/src/lib/execution/mistake-patterns.ts`
  - [x] Define pattern library: `{ patternId, condition: (report) => boolean, message: string }`
  - [x] Example patterns:
    - [x] Off-by-one errors: actual output differs by exactly 1
    - [x] Missing edge case: fails on empty input test but not non-empty
    - [x] Reverse comparison: got > when expected <
    - [x] Index out of bounds: error on array iteration
  - [x] `detectCommonMistake(report: ExecutionReport): string | null`
  - [x] Return formatted message: "80% of developers make this mistake here — check your comparison direction"
  - [x] Display in step description panel when pattern matches

- [x] Task 6: Keyboard Navigation for Step-Through (AC: #6)
  - [x] Update `web/src/hooks/use-canvas-keyboard.ts`
  - [x] When ExecutionOverlay is active:
    - [x] Arrow Right → `nextStep()`
    - [x] Arrow Left → `previousStep()`
    - [x] Space → toggle play/pause
  - [x] Prevent default browser scroll behavior for consumed keys
  - [x] Register keyboard listeners when overlay mounts, remove on unmount

- [x] Task 7: Screen Reader Announcements (AC: #5)
  - [x] Update `web/src/hooks/use-canvas-announcer.ts`
  - [x] Render a visually-hidden `<div aria-live="assertive" aria-atomic="true">` inside `ExecutionOverlay.tsx` that the hook updates on each step transition
  - [x] On each step: announce "Step {N}: {block label} — {status}"
  - [x] On success step: announce "Step {N}: {block label} — passed"
  - [x] On failure step: announce "Step {N}: {block label} — failed. {error message}"
  - [x] On play start: announce "Auto-playing execution steps"
  - [x] On pause: announce "Execution paused at step {N}"
  - [x] Use `aria-live="assertive"` for step announcements (user must hear)

- [x] Task 8: Integrate with Test Results (AC: #1)
  - [x] Wire canvas store `executionSteps` to ExecutionOverlay
  - [x] When test results arrive with failures: auto-show ExecutionOverlay
  - [x] Auto-scroll/highlight to first failure step
  - [x] Allow user to switch between different failed test cases
  - [x] Update `TestResults.tsx` (Story 2.4, `web/src/components/challenge/TestResults.tsx`): add "Step Through Failure" button that sets `stepThroughActive = true` in canvas store and opens the overlay

- [x] Task 9: Update Canvas Store for Step State (AC: #1, #2, #3)
  - [x] Extend `web/src/stores/canvas-store.ts`
  - [x] Add `currentStepIndex: number`
  - [x] Add `isPlaying: boolean`
  - [x] Add `stepThroughActive: boolean`
  - [x] Add actions: `nextStep`, `previousStep`, `togglePlay`, `resetSteps`
  - [x] Add computed: `currentStep`, `isAtFailure`, `isAtStart`, `isAtEnd`

- [x] Task 10: Testing & Quality Assurance
  - [x] Write unit test for step tracker navigation (next, previous, bounds)
  - [x] Write unit test for execution highlighter styles at each step
  - [x] Write unit test for common mistake pattern detection
  - [x] Write unit test for auto-play timing (500ms interval, stops at failure)
  - [x] Write unit test for auto-play interval cleanup on unmount (no memory leak)
  - [x] Write unit test for keyboard listener registration and cleanup on unmount
  - [x] Write integration test: test fails → overlay appears → step through → highlights update
  - [x] Write integration test: play mode → auto-advances → pauses at failure
  - [x] Test keyboard navigation: arrow keys, space bar (verify preventDefault)
  - [x] Accessibility test: screen reader announcements for each step
  - [x] Test edge cases: single step execution, no failures, all failures
  - [x] Test common mistake message display on matching failure
  - [x] Verify `npm run build` succeeds without errors

## Runnable Code Location

All runnable code MUST be created in the `web/` subfolder at the project root.

## Dev Notes

### Architecture Patterns & Constraints

- **Step-Through Architecture:** Execution engine (Story 2.4) produces `ExecutionStep[]` array. Step tracker maintains `currentStepIndex`. Canvas highlighter maps step to node/edge visual state. User navigates with controls or keyboard. [Source: architecture.md#Canvas Technology — Execution visualization]
- **Visual Feedback Layer:** React Flow nodes accept custom `className` or `style` via data props. Update node data to trigger re-render with visual changes. Edges can be updated via `useEdgesState` for path highlighting. [Source: React Flow v12 docs#Custom Nodes]
- **Animation Rhythm:** Auto-play advances every 500ms (±20ms tolerance). Use `setInterval` (not `requestAnimationFrame` — step-through is discrete, not continuous animation). Clear interval on pause/stop.
- **Accessibility Priority:** Screen reader announcements are REQUIRED (WCAG 2.1 AA). Each step transition must be announced. Failure detection must be communicated audibly. [Source: ux-design-specification.md#Canvas Accessibility]

### CRITICAL Anti-Patterns to AVOID

1. **DO NOT** let auto-play continue past the failure point — MUST pause automatically
2. **DO NOT** forget to clear step interval on component unmount — causes memory leak
3. **DO NOT** show step-through overlay for passing tests — only show on failure
4. **DO NOT** hard-code step timing — use configurable constant `AUTO_PLAY_INTERVAL_MS = 500`
5. **DO NOT** mutate execution steps directly — clone before navigation
6. **DO NOT** skip screen reader announcements — every step transition needs announcement

### Project Structure Notes

Expected new/updated files:
```
web/src/
├── lib/
│   └── execution/
│       ├── step-tracker.ts                  # Step navigation state
│       └── mistake-patterns.ts             # Common mistake detection
│   └── canvas/
│       └── execution-highlighter.ts         # Node/edge style mapping
├── components/
│   ├── canvas/
│   │   ├── ExecutionOverlay.tsx             # Play/Pause/Step controls
│   │   ├── StepDescription.tsx             # Step detail card (imported by ExecutionOverlay)
│   │   └── LogicBlockCanvas.tsx            # Updated: applies highlight styles to nodes/edges
│   └── challenge/
│       └── TestResults.tsx                 # Updated: "Step Through Failure" button
├── hooks/
│   ├── use-canvas-keyboard.ts              # Updated: step-through keyboard nav
│   └── use-canvas-announcer.ts             # Updated: step announcements
├── stores/
│   └── canvas-store.ts                     # Extended: step state
```

### Previous Story Intelligence

**From Story 2.4 (Execution Engine):**
- `TestResults.tsx` shows pass/fail results with expected vs actual
- `executionSteps` array in canvas store from `ExecutionReport`
- Canvas store has `testStatus: "idle" | "running" | "success" | "error"`
- Server Action `submitSolution` returns `ExecutionReport`

**From Story 2.3 (Connections):**
- Custom edge `BlockConnection.tsx` renders connection paths with styles
- `use-canvas-announcer.ts` for screen reader integration

**From Story 2.2 (Nodes):**
- `LogicBlockNode.tsx` custom node with Handle components
- Block types and vocabulary defined

**From Story 2.1 (Canvas):**
- `CanvasToolbar.tsx` has zoom/undo/redo controls
- `use-canvas-keyboard.ts` for keyboard shortcuts

### Testing Standards

- **Step Tracker Tests:** Pure state machine — test all transitions, bounds, failure detection
- **Execution Highlighter:** Test each state (unexecuted, executing, executed, failure) for all block types
- **Auto-Play:** Use fake timers (`vi.useFakeTimers()`) to test interval-based auto-advance
- **Accessibility:** Test that `aria-live` region content changes on each step
- **Integration:** Full flow from test failure → overlay appears → step through → verify UI changes

### State Machine for Step-Through

```
IDLE ──(test fails)──→ READY (step 0, failure step detected)
                         │
                    ┌────┤
                    ▼    ▼
                  STEP_FORWARD  PLAYING
                    │    │         │
                    │    └──→ PAUSED
                    ▼         (at failure or end)
              (next step)
                    │
                    ├──→ atFailure? → SHOW_CONTEXT (mistake pattern)
                    │
                    └──→ atEnd? → COMPLETE (disable forward)
```

### Design Token Reference

```
Execution Overlay:          bg #1E293B, border #334155, rounded-xl
Executing Node Border:      #6366F1 (Indigo), 2px, pulse animation
Executed Node Border:       #10B981 (Emerald), 2px, static
Failure Node Border:        #F43F5E (Rose), 3px, shake + glow
Unexecuted Node:            opacity 0.4
Executed Edge Stroke:       #10B981, 3px
Unexecuted Edge Stroke:     #64748B, 1px, opacity 0.3
Play/Pause Button:          bg #6366F1 (Indigo), icon white
Step Button:                bg #334155 (Slate), icon #94A3B8
Progress Text:              Inter 12px #94A3B8, monospaced step count
Step Description Card:      bg #0F172A, border #334155, monospace values
```

### References

- [Source: epics.md#Story 2.5] - Original story definition and acceptance criteria
- [Source: epics.md#FR5] - View execution steps of constructed logic flow
- [Source: architecture.md#Canvas Technology] - Step-through execution visualization layer
- [Source: ux-design-specification.md#UX-DR10] - Failure Visualization Engine (play/pause/step)
- [Source: ux-design-specification.md#UX-DR5] - Error feedback: red highlighting, shake animation
- [Source: ux-design-specification.md#UX-DR13] - Screen reader: step announcements
- [Source: ux-design-specification.md#UX-DR17] - Keyboard shortcuts (Space=play/pause, arrows=step)
- [Source: 2-4-build-logic-block-execution-engine-test-runner.md] - Execution engine and test runner
- [Source: 2-3-implement-block-connection-real-time-validation.md] - Edge components
- [Source: 2-1-install-and-configure-react-flow-canvas.md] - Canvas keyboard shortcuts

## Dev Agent Record

### Agent Model Used

glm-5.1

### Debug Log References

- All unit tests for step-tracker, execution-highlighter, mistake-patterns, canvas-store (step state), use-canvas-keyboard, use-canvas-announcer pass
- Integration tests for step-through flow pass
- `npm run build` succeeds without errors
- Pre-existing test failures in interpreter.test.ts and canvas-store-block-management.test.ts are unrelated to this story

### Completion Notes List

- Task 1: Created `step-tracker.ts` with `getExecutionPath()`, `canStepForward()`, `canStepBackward()`, `isAtFailurePoint()`, etc. 19 unit tests pass.
- Task 9: Extended `canvas-store.ts` with `currentStepIndex`, `isPlaying`, `stepThroughActive`, plus actions `nextStep`, `previousStep`, `togglePlay`, `resetSteps`, `setStepThroughActive`. 12 new store tests pass.
- Task 3: Created `execution-highlighter.ts` with `getBlockHighlightState()`, `getHighlightStyles()`, `applyExecutionHighlighting()`. Implements all 5 visual states (unexecuted, currently-executing, executed-success, executed-failure, not-yet-executed). 16 unit tests pass.
- Task 2: Created `ExecutionOverlay.tsx` with play/pause/step controls, auto-play at 500ms, pause at failure, progress indicator. Uses React Flow `<Panel position="bottom-center">`.
- Task 4: Created `StepDescription.tsx` with collapsible step details, block type label, input/output values, error messages, and common mistake context integration.
- Task 5: Created `mistake-patterns.ts` with 6 pattern detectors (off-by-one, missing-edge-case, reverse-comparison, null-reference, index-out-of-bounds, type-mismatch). 12 unit tests pass.
- Task 6: Updated `use-canvas-keyboard.ts` with step-through keyboard controls (Arrow Right/Left/Space) when overlay active. 11 tests pass.
- Task 7: Updated `use-canvas-announcer.ts` with `announceStep()`, `announceStepSuccess()`, `announceStepFailure()`, `announceAutoPlayStart()`, `announcePause()`. Added `aria-live="assertive"` announcer div. 10 tests pass.
- Task 8: Integrated ExecutionOverlay into LogicBlockCanvas with execution highlighting, step-announcer div, keyboard controls with step-through support. Updated TestResults.tsx with "Step Through" button.
- Task 10: Created comprehensive integration tests in `step-through-integration.test.ts`. All 108 story-related tests pass. Build succeeds.

### File List

- `web/src/lib/execution/step-tracker.ts` (new)
- `web/src/lib/execution/step-tracker.test.ts` (new)
- `web/src/lib/canvas/execution-highlighter.ts` (new)
- `web/src/lib/canvas/execution-highlighter.test.ts` (new)
- `web/src/lib/execution/mistake-patterns.ts` (new)
- `web/src/lib/execution/mistake-patterns.test.ts` (new)
- `web/src/lib/execution/step-through-integration.test.ts` (new)
- `web/src/components/canvas/ExecutionOverlay.tsx` (new)
- `web/src/components/canvas/StepDescription.tsx` (new)
- `web/src/stores/canvas-store.ts` (modified)
- `web/src/stores/canvas-store.test.ts` (modified)
- `web/src/hooks/use-canvas-keyboard.ts` (modified)
- `web/src/hooks/use-canvas-keyboard.test.ts` (modified)
- `web/src/hooks/use-canvas-announcer.ts` (modified)
- `web/src/hooks/use-canvas-announcer.test.ts` (modified)
- `web/src/components/canvas/LogicBlockCanvas.tsx` (modified)
- `web/src/components/challenge/TestResults.tsx` (modified)
