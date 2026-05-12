# Story 2.5: Implement Step-Through Execution Visualization

Status: ready-for-dev

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

- [ ] Task 1: Create Execution Step Tracker (AC: #1, #2)
  - [ ] Create `web/src/lib/execution/step-tracker.ts`
  - [ ] `getExecutionPath(steps: ExecutionStep[]): { currentIndex, totalSteps, step, hasNext, hasPrevious, failureIndex, failureStep }`
  - [ ] Track current step index with reactive state
  - [ ] Provide step navigation: `nextStep()`, `previousStep()`, `goToStep(index)`
  - [ ] Identify failure step index from ExecutionReport
  - [ ] Return current step's block ID for canvas highlighting

- [ ] Task 2: Create ExecutionOverlay Component (AC: #1, #2, #3, #6)
  - [ ] Create `web/src/components/canvas/ExecutionOverlay.tsx`
  - [ ] Show when canvas store `testStatus === "error"` (test failed)
  - [ ] Render playback controls:
    - Play/Pause button (Lucide `Play`/`Pause`)
    - Step Forward button (Lucide `StepForward`)
    - Step Back button (Lucide `StepBack`)
    - Progress indicator: "Step {current}/{total}"
  - [ ] Position: floating panel at bottom-center of canvas via React Flow `<Panel>`
  - [ ] Dark background (#1E293B), rounded, with control buttons
  - [ ] Step description panel below controls (expandable)
  - [ ] Auto-play mode: step forward every 500ms until failure point or end
  - [ ] Pause automatically at failure step

- [ ] Task 3: Implement Canvas Block Highlighting (AC: #1, #2, #3)
  - [ ] Create `web/src/lib/canvas/execution-highlighter.ts`
  - [ ] Map execution step's `blockId` to canvas node and edge
  - [ ] `getHighlightStyles(blockId, currentStepIndex, failureIndex): { nodeClass, edgeClass }`
  - [ ] Define per-state styles for React Flow nodes/edges:
    - Unexecuted: neutral (Slate #64748B)
    - Currently executing: indigo pulse border (#6366F1) + opacity 1.0
    - Executed (success): emerald border (#10B981) + opacity 0.8
    - Failure point: rose border (#F43F5E) + shake animation + red glow
    - Not yet executed: dimmed opacity 0.4
  - [ ] Define edge styles: executed path has brighter stroke (#10B981 3px), unexecuted path is dimmed (#64748B 1px opacity 0.3)
  - [ ] Update `LogicBlockCanvas.tsx`: consume `getHighlightStyles()` results, apply to node data and `useEdgesState` so styles re-render reactively when `currentStepIndex` changes
  - [ ] Return style objects consumable by node/edge rendering

- [ ] Task 4: Create Step Description Panel (AC: #2, #4)
  - [ ] Create `web/src/components/canvas/StepDescription.tsx` (separate component imported by `ExecutionOverlay.tsx`)
  - [ ] Show current step details: block type icon, label, description
  - [ ] Show input value, operation, output value for current step
  - [ ] At failure point: show expected vs actual, error message
  - [ ] Show common mistake context if applicable (configurable via pattern library from Task 5)
  - [ ] Style: card with monospace values (JetBrains Mono), clear visual hierarchy
  - [ ] Collapsible/expandable: collapsed by default showing step summary, expandable to full detail

- [ ] Task 5: Implement Common Mistake Pattern Matching (AC: #4)
  - [ ] Create `web/src/lib/execution/mistake-patterns.ts`
  - [ ] Define pattern library: `{ patternId, condition: (report) => boolean, message: string }`
  - [ ] Example patterns:
    - Off-by-one errors: actual output differs by exactly 1
    - Missing edge case: fails on empty input test but not non-empty
    - Reverse comparison: got > when expected <
    - Index out of bounds: error on array iteration
  - [ ] `detectCommonMistake(report: ExecutionReport): string | null`
  - [ ] Return formatted message: "80% of developers make this mistake here — check your comparison direction"
  - [ ] Display in step description panel when pattern matches

- [ ] Task 6: Keyboard Navigation for Step-Through (AC: #6)
  - [ ] Update `web/src/hooks/use-canvas-keyboard.ts`
  - [ ] When ExecutionOverlay is active:
    - Arrow Right → `nextStep()`
    - Arrow Left → `previousStep()`
    - Space → toggle play/pause
  - [ ] Prevent default browser scroll behavior for consumed keys
  - [ ] Register keyboard listeners when overlay mounts, remove on unmount

- [ ] Task 7: Screen Reader Announcements (AC: #5)
  - [ ] Update `web/src/hooks/use-canvas-announcer.ts`
  - [ ] Render a visually-hidden `<div aria-live="assertive" aria-atomic="true">` inside `ExecutionOverlay.tsx` that the hook updates on each step transition
  - [ ] On each step: announce "Step {N}: {block label} — {status}"
  - [ ] On success step: announce "Step {N}: {block label} — passed"
  - [ ] On failure step: announce "Step {N}: {block label} — failed. {error message}"
  - [ ] On play start: announce "Auto-playing execution steps"
  - [ ] On pause: announce "Execution paused at step {N}"
  - [ ] Use `aria-live="assertive"` for step announcements (user must hear)

- [ ] Task 8: Integrate with Test Results (AC: #1)
  - [ ] Wire canvas store `executionSteps` to ExecutionOverlay
  - [ ] When test results arrive with failures: auto-show ExecutionOverlay
  - [ ] Auto-scroll/highlight to first failure step
  - [ ] Allow user to switch between different failed test cases
  - [ ] Update `TestResults.tsx` (Story 2.4, `web/src/components/challenge/TestResults.tsx`): add "Step Through Failure" button that sets `stepThroughActive = true` in canvas store and opens the overlay

- [ ] Task 9: Update Canvas Store for Step State (AC: #1, #2, #3)
  - [ ] Extend `web/src/stores/canvas-store.ts`
  - [ ] Add `currentStepIndex: number`
  - [ ] Add `isPlaying: boolean`
  - [ ] Add `stepThroughActive: boolean`
  - [ ] Add actions: `nextStep`, `previousStep`, `togglePlay`, `resetSteps`
  - [ ] Add computed: `currentStep`, `isAtFailure`, `isAtStart`, `isAtEnd`

- [ ] Task 10: Testing & Quality Assurance
  - [ ] Write unit test for step tracker navigation (next, previous, bounds)
  - [ ] Write unit test for execution highlighter styles at each step
  - [ ] Write unit test for common mistake pattern detection
  - [ ] Write unit test for auto-play timing (500ms interval, stops at failure)
  - [ ] Write unit test for auto-play interval cleanup on unmount (no memory leak)
  - [ ] Write unit test for keyboard listener registration and cleanup on unmount
  - [ ] Write integration test: test fails → overlay appears → step through → highlights update
  - [ ] Write integration test: play mode → auto-advances → pauses at failure
  - [ ] Test keyboard navigation: arrow keys, space bar (verify preventDefault)
  - [ ] Accessibility test: screen reader announcements for each step
  - [ ] Test edge cases: single step execution, no failures, all failures
  - [ ] Test common mistake message display on matching failure
  - [ ] Verify `npm run build` succeeds without errors

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
