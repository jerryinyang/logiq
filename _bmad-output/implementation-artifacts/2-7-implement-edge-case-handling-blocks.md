# Story 2.7: Implement Edge Case Handling Blocks

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user building a robust solution,
I want to add edge case handling blocks to my logic flow,
So that my solution handles boundary conditions correctly.

## Acceptance Criteria

1. **Given** I am viewing the block palette (Story 2.2), **when** I look at the Edge Case category, **then** I see blocks for: "Empty input", "Single element", "Already sorted", "Duplicates", "Max value" (FR3) — each with a descriptive label and amber warning accent color (UX-DR5: Warning).

2. **Given** I drag an edge case handler block onto the canvas, **when** I connect it to my logic flow, **then** it integrates as a conditional branch in the logic and the block label shows which edge case it handles with an amber left border.

3. **Given** my solution includes edge case handling blocks, **when** I hit "Test" (Story 2.4), **then** the test runner executes against both standard test cases AND the edge case stress test (FR3).

4. **Given** an edge case fails, **when** I view the results, **then** the `EdgeCaseStressTest.tsx` component shows which edge case broke with red highlighting (Rose #F43F5E) and the step-through execution (Story 2.5) shows the failure path through the edge case branch.

5. **Given** I am using keyboard navigation, **when** I add an edge case block, **then** it can be placed and connected using Tab, Enter, and Arrow keys (UX-DR13).

6. **Given** the test runner distinguishes edge case test cases from standard test cases, **when** I view test results, **then** edge case failures are grouped separately under "Edge Case Tests" header with visual distinction from standard test failures.

## Tasks / Subtasks

- [ ] Task 1: Define Edge Case Block Types and Config (AC: #1, #2)
  - [ ] Update `web/src/lib/canvas/block-vocabulary.ts`
  - [ ] Add edge case block definitions to `EdgeCaseBlockType`:
    - "Empty Input" — checks if input is null/undefined/empty array, provides early return
    - "Single Element" — checks if array/collection has exactly 1 item, handles trivially
    - "Already Sorted" — checks if input is already in target state, returns immediately
    - "Duplicates" — checks for duplicate values in input, handles deduplication
    - "Max Value" — checks for edge of numeric range, applies max constraint
  - [ ] Each edge case block config: `{ id: string, type: "edgeCase", category: "edgeCaseHandler", edgeCaseType: EdgeCaseType }` where `EdgeCaseType = "emptyInput" | "singleElement" | "alreadySorted" | "duplicates" | "maxValue"`
  - [ ] Set category color to Amber (#F59E0B) — matches Warning semantic color (UX-DR1)
  - [ ] Also create `web/src/lib/execution/edge-cases.ts` for runtime edge case type constants and metadata (per architecture.md#Execution Engine — "Known edge case definitions"): exports `EDGE_CASE_TYPES` constant array, `EdgeCaseMeta` descriptors with name/description/icon for each type

- [ ] Task 2: Extend LogicBlockNode for Edge Case Rendering (AC: #2)
  - [ ] Extend `web/src/components/canvas/LogicBlockNode.tsx` — add edge case rendering branch for `type: "edgeCase"` (per architecture pattern: single `LogicBlockNode` handles all block types via `type` prop)
  - [ ] Edge case node visual characteristics:
    - Left border: Amber (#F59E0B), 4px, with warning triangle icon
    - Label: "Edge Case: [type]" in JetBrains Mono 12px
    - Below label: specific edge case description (e.g., "Check for empty input")
    - Diamond-shaped badge → "Edge Case" in Amber
  - [ ] Has both `<Handle type="target">` (top) and `<Handle type="source">` (bottom)
  - [ ] Two source handles: one for "edge case applies" (early return path), one for "normal flow continues"
  - [ ] ARIA label: "Edge case handler — [type]"
  - [ ] Right-click context menu: delete, duplicate (same as regular blocks)

- [ ] Task 3: Create Edge Case Handler Helpers (AC: #3)
  - [ ] Create `web/src/lib/execution/edge-case-handlers.ts` — pure helper functions for each edge case type
  - [ ] Implement helper functions (all receive `input`, return `{ hit: boolean; value?: unknown }`):
    - `handleEmptyInput(input: unknown)` — `input == null || (Array.isArray(input) && input.length === 0) || (typeof input === "string" && input.length === 0)`; on hit: return early/default value (empty string "", empty array `[]`, or 0 based on context)
    - `handleSingleElement(input: unknown)` — `Array.isArray(input) && input.length === 1`; on hit: return the single element directly
    - `handleAlreadySorted(input: unknown)` — checks if array is already in ASC order via `input.every((v, i) => i === 0 || v >= input[i - 1])`; on hit: return input unchanged (skip sort logic)
    - `handleDuplicates(input: unknown)` — checks for duplicates via `new Set(input).size !== input.length`; on hit: return `[...new Set(input)]` (deduplicated)
    - `handleMaxValue(input: number | number[], max: number)` — `Array.isArray(input) ? input.some(v => v > max) : input > max`; on hit: clamp/clip values to max
  - [ ] Export a dispatch function: `evaluateEdgeCase(edgeCaseType: EdgeCaseType, input: unknown, config?: Record<string, unknown>): { hit: boolean; value?: unknown }`

- [ ] Task 3a: Integrate Edge Case Handler into Interpreter (AC: #3)
  - [ ] Update `web/src/lib/execution/interpreter.ts` (Story 2.4)
  - [ ] In the block execution loop, when encountering `type: "edgeCase"`:
    - Call `evaluateEdgeCase(block.edgeCaseType, currentInput, block.config)`
    - On `hit === true`: record execution step `{ edgeCaseDetected: true, edgeCaseType, edgeCaseHit: true }`, branch to early return path (skip remaining blocks, follow "Case Detected" output handle)
    - On `hit === false`: record execution step `{ edgeCaseDetected: false, edgeCaseType, edgeCaseHit: false }`, continue to normal flow path (follow "Continue" output handle)
  - [ ] Record edge case detection in execution step: `{ edgeCaseDetected: boolean, edgeCaseType: string, edgeCaseHit?: boolean }`

- [ ] Task 4: Implement Edge Case Stress Test Runner (AC: #3, #6)
  - [ ] Create `web/src/lib/execution/edge-case-runner.ts`
  - [ ] `runEdgeCaseTests(config: SerializedBlockConfig[], testCases: TestCase[]): { standard: TestResult[], edgeCase: TestResult[] }`
  - [ ] Split test cases: `is_edge_case === true` → edge case tests, otherwise → standard tests
  - [ ] Run standard tests through normal test runner
  - [ ] For edge case tests: each test is designed to trigger a specific edge case
  - [ ] Verify: edge case test failure means handler block didn't handle the case correctly
  - [ ] Return categorized results with `TestResult` linked to `edgeCaseType`

- [ ] Task 5: Create EdgeCaseStressTest Component (AC: #4)
  - [ ] Create `web/src/components/challenge/EdgeCaseStressTest.tsx`
  - [ ] Accept `{ standardResults: TestResult[], edgeCaseResults: TestResult[] }` props
  - [ ] Two sections: "Standard Tests" + "Edge Case Tests" with visual divider
  - [ ] Edge case section header: amber accent, warning triangle icon (Lucide `AlertTriangle`)
  - [ ] Each failing edge case: shows which edge case type, input, expected behavior, actual behavior
  - [ ] Pass/fail count badges for each section
  - [ ] Edge case failure → highlights corresponding edge case block on canvas (red)
  - [ ] When user steps through execution (Story 2.5), edge case branch path is highlighted
  - [ ] Collapsible sections via shadcn/ui Accordion, edge case section expanded by default on failure

- [ ] Task 6: Update Block Connection Validation for Edge Case (AC: #2)
  - [ ] Update `web/src/lib/canvas/block-validation.ts` (Story 2.3)
  - [ ] Edge case blocks: can connect TO any block type (condition, comparison, assignment)
  - [ ] Edge case blocks: can connect FROM loop, condition blocks
  - [ ] Two output paths: "Case Detected" (early return path) and "Continue" (normal flow)
  - [ ] Validation: both output paths must eventually connect to a return block or be terminated

- [ ] Task 7: Update Block Palette for Edge Case Category (AC: #1)
  - [ ] Update `web/src/components/canvas/BlockPalette.tsx`
  - [ ] Edge Case category: amber header (matching color), warning triangle icon
  - [ ] Blocks sorted with most common edge cases first (Empty Input, Single Element)
  - [ ] Each edge case block preview shows: warning icon, name, description
  - [ ] Category position: last in palette accordion (edge cases are "advanced" usage)

- [ ] Task 8: Update TestResults for Edge Case Separation (AC: #4, #6)
  - [ ] Update `web/src/components/challenge/TestResults.tsx` (Story 2.4)
  - [ ] Integrate `EdgeCaseStressTest.tsx` results
  - [ ] When edge cases exist: show segmented results (Standard + Edge Case)
  - [ ] When no edge cases in solution: hide edge case section
  - [ ] Edge case failure count in summary: "2/3 standard passed, 0/2 edge cases passed"

- [ ] Task 9: Update Canvas Store for Edge Case State (AC: #3, #4)
  - [ ] Extend `web/src/stores/canvas-store.ts`
  - [ ] Add `edgeCaseResults: { standard: TestResult[], edgeCase: TestResult[] } | null`
  - [ ] Add `activeEdgeCase: string | null` — which edge case block is being inspected
  - [ ] Add `edgeCaseHitCount: number` — detected edge cases during execution

- [ ] Task 10: Update Step Tracker for Edge Case Branching (AC: #4)
  - [ ] Update `web/src/lib/execution/step-tracker.ts` (Story 2.5)
  - [ ] Add edge case step tracking: when execution enters an edge case block, record `{ stepType: "edgeCase", edgeCaseType, hit: boolean }`
  - [ ] On edge case hit: the step-through path follows the "Case Detected" branch (early return) — highlight this path in the ExecutionOverlay
  - [ ] On edge case miss: the step-through path follows the "Continue" branch (normal flow) — highlight accordingly
  - [ ] Ensure screen reader announces edge case step: "Step N: Edge case [type] — [hit/missed]"

- [ ] Task 11: Testing & Quality Assurance
  - [ ] Write unit test for each edge case handler function (empty input, single element, etc.)
  - [ ] Write unit test for `evaluateEdgeCase` dispatch function (correct dispatch per edgeCaseType)
  - [ ] Write unit test for edge case runner (split test cases, correct categorization)
  - [ ] Write unit test for edge case block node rendering (amber coloring, dual handles)
  - [ ] Write unit test for connection validation with edge case blocks
  - [ ] Write integration test: edge case block + normal flow → test → edge case hit → correct output
  - [ ] Write integration test: edge case block + normal flow → test → edge case missed → failure reported
  - [ ] Write integration test: edge case test failure → EdgeCaseStressTest component shows failure
  - [ ] Write integration test: step-through shows edge case branch path on failure
  - [ ] Test all 5 edge case types individually
  - [ ] Test edge case handler WITH and WITHOUT edge case being triggered
  - [ ] Accessibility: screen reader announces "Edge case [type] — [hit/missed]"
  - [ ] Verify `npm run build` succeeds without errors

## Runnable Code Location

All runnable code MUST be created in the `web/` subfolder at the project root.

## Dev Notes

### Architecture Patterns & Constraints

- **Edge Case Branching:** Unlike normal blocks which have one output path, edge case handler blocks have TWO output Handles: one for "edge case detected" (early return) and one for "normal flow continues". This requires React Flow nodes with multiple source handles. [Source: architecture.md#Canvas Technology — Custom node types]
- **Interpreter Pattern:** Edge case handlers are evaluated BEFORE the main logic. If edge case is detected: take early return path, skip remaining blocks. If not: continue to normal flow. This is a guard clause pattern in visual form. Handler functions live in `lib/execution/edge-case-handlers.ts` as pure functions, dispatched from `interpreter.ts`. [Source: architecture.md#Cross-Component Dependencies]
- **Test Case Categorization:** Test cases already have `is_edge_case` boolean flag (from `challenge_test_cases` table schema, Epic 3). Edge case test runner splits on this flag. [Source: epics.md#Story 3.1 — challenge_test_cases table]
- **Visual Consistency:** Edge case blocks use the amber/warning color from UX-DR1. This creates a visual pattern: amber = potential issue to handle. Distinct from indigo (normal blocks), rose (errors), emerald (success). [Source: ux-design-specification.md#UX-DR1]

### CRITICAL Anti-Patterns to AVOID

1. **DO NOT** make edge case blocks optional in test execution — must always run edge case tests alongside standard tests
2. **DO NOT** merge edge case results with standard results — must be visually separated
3. **DO NOT** use the same Handle for both edge case output paths — use separate source Handles with IDs
4. **DO NOT** skip edge case validation in connection rules — both output paths must be valid
5. **DO NOT** hardcode edge case block behavior — interpreter must dispatch generically via `evaluateEdgeCase()` based on `edgeCaseType`
6. **DO NOT** show edge case section when user hasn't added edge case blocks to canvas
7. **DO NOT** inline edge case logic directly in interpreter — use `edge-case-handlers.ts` pure functions for testability

### Project Structure Notes

Expected new/updated files:
```
web/src/
├── lib/
│   ├── canvas/
│   │   ├── block-vocabulary.ts             # Updated: edge case block definitions + EdgeCaseType
│   │   └── block-validation.ts            # Updated: edge case connection rules
│   └── execution/
│       ├── edge-cases.ts                   # Edge case type constants & metadata (new, per architecture)
│       ├── edge-case-handlers.ts           # Pure handler functions per type (new)
│       ├── edge-case-runner.ts             # Edge case test runner (new)
│       ├── interpreter.ts                  # Updated: integrates edge case handler dispatch
│       ├── step-tracker.ts                 # Updated: edge case branching step tracking
│       └── test-runner.ts                  # Updated: calls edge case runner
├── components/
│   ├── canvas/
│   │   ├── LogicBlockNode.tsx             # Updated: edge case visual variant (amber, dual handles)
│   │   └── BlockPalette.tsx               # Updated: edge case category
│   └── challenge/
│       ├── EdgeCaseStressTest.tsx          # Edge case results display (new)
│       └── TestResults.tsx                 # Updated: segmented standard + edge case results
├── stores/
│   └── canvas-store.ts                     # Extended: edge case state (results, active, hitCount)
└── types/
    └── canvas-types.ts                     # Updated: EdgeCaseType, EdgeCaseBlockConfig, dual-handle types
```

### Previous Story Intelligence

**From Story 2.6 (Iteration & Persistence):**
- Undo/redo history enabled — edge case block changes are history-tracked
- Auto-save includes edge case block configurations
- Reset clears edge case blocks same as regular blocks

**From Story 2.5 (Step-Through):**
- `ExecutionOverlay.tsx` shows step-through on failure
- `step-tracker.ts` manages execution step state — must be updated to track edge case branching (see Task 10)
- Edge case branch path must be highlighted during step-through
- Screen reader must announce edge case detection: "Step N: Edge case [type] — [hit/missed]"

**From Story 2.4 (Execution Engine):**
- `interpreter.ts` handles all block types — add edge case handler
- `test-runner.ts` calls interpreter per test case — add edge case runner
- Server Action `submitSolution` returns `ExecutionReport`

**From Story 2.3 (Connections):**
- `isValidBlockConnection` validates block compatibility — add edge case rules
- Cycle detection handles edge case two-output paths

**From Story 2.2 (Nodes & Palette):**
- `LogicBlockNode.tsx` renders custom nodes — extend for edge case visual
- `block-vocabulary.ts` defines available blocks — add edge case blocks
- `BlockPalette.tsx` shows categories — add edge case category

**From Story 2.1 (Canvas):**
- Canvas foundation with React Flow provider

### Testing Standards

- **Handler Unit Tests:** Test each handler function (`handleEmptyInput`, `handleSingleElement`, etc.) in isolation with matching and non-matching inputs. Test `evaluateEdgeCase` dispatch for correct handler selection.
- **Interpreter Edge Case Tests:** Test interpreter with edge case blocks — verify branch taken (hit path vs. miss path)
- **Integration:** Full flow from block placement → connection → test → edge case detection → results display
- **Dual-Handle Testing:** Verify both output paths render and accept connections; verify `connection.sourceHandle` correctly distinguishes "edge-case-hit" from "edge-case-miss"
- **Step-Through:** Verify edge case branch path is highlighted during step-through

### Edge Case Block Visual Spec

```
┌─────────────────────────────────────┐
│ ⚠ Edge Case: Empty Input      [x]  │  Amber left border (4px, #F59E0B)
│ Check for empty input or null       │  Amber text for "Edge Case"
│                                     │
│ ◉ target (top handle)               │  Single target handle (input)
│                                     │
│ ↓ handled (edge case hit)           │  Source handle A — "early return" path
│ ↓ continue (edge case miss)         │  Source handle B — "normal flow" path
│                                     │  Two source handles with IDs:
│                                     │    handleId="edge-case-hit"
│                                     │    handleId="edge-case-miss"
└─────────────────────────────────────┘
```

**Handle IDs:** Target = `"target"`, Source A = `"edge-case-hit"` (early return when condition met), Source B = `"edge-case-miss"` (continue to next block when condition not met). React Flow `isValidConnection` must use `connection.sourceHandle` to differentiate which output path the user connected to.

### References

- [Source: epics.md#Story 2.7] - Original story definition and acceptance criteria
- [Source: epics.md#FR3] - Add edge case handling blocks to logic flow
- [Source: architecture.md#Canvas Technology] - Custom node types with multiple handles
- [Source: architecture.md#Cross-Component Dependencies] - Execution engine depends on block config
- [Source: ux-design-specification.md#UX-DR5] - Warning feedback pattern (amber)
- [Source: ux-design-specification.md#UX-DR13] - Keyboard accessibility for block placement
- [Source: 2-4-build-logic-block-execution-engine-test-runner.md] - Interpreter and test runner
- [Source: 2-5-implement-step-through-execution-visualization.md] - Step-through on failure
- [Source: 2-3-implement-block-connection-real-time-validation.md] - Connection validation
- [Source: 2-2-implement-block-palette-drag-to-canvas-interaction.md] - Block palette and nodes

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
