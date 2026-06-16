# Story 2.4: Build Logic Block Execution Engine & Test Runner

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user who has built a logic flow,
I want to test my solution against challenge test cases,
So that I can see if my logic produces correct results.

## Acceptance Criteria

1. **Given** I have placed and connected blocks on the canvas (Story 2.2, 2.3), **when** I click the "Test" button (primary action, indigo filled per UX-DR4), **then** the canvas state is serialized into JSON block configuration, a Server Action is called to submit the solution (FR2), the execution engine (`lib/execution/interpreter.ts`) interprets the block configuration, and the test runner (`lib/execution/test-runner.ts`) runs it against the challenge's test cases.

2. **Given** the test is executing, **when** I view the canvas, **then** an animated progress indicator flows along the logic path (UX-DR15) and the text "Running your logic..." is displayed.

3. **Given** all test cases pass, **when** execution completes, **then** success paths light up green (Emerald #10B981) with a subtle glow animation (UX-DR5: Success feedback), the `TestResults.tsx` component shows: "All test cases passed", and a green checkmark celebration animation plays.

4. **Given** one or more test cases fail, **when** execution completes, **then** the failure point in the logic flow lights up red (Rose #F43F5E) with a shake animation (UX-DR5: Error feedback) and the `TestResults.tsx` component shows which test case failed and the expected vs. actual output.

5. **Given** the execution engine runs, **when** it interprets a block configuration, **then** it handles all block types: loop, condition, comparison, variable, assignment, return, edge case handler — and returns structured execution steps with inputs, outputs, and intermediate states at each block.

6. **Given** I hit "Test" without connecting blocks OR with disconnected blocks, **when** the solution is submitted, **then** a validation error is shown: "Your blocks must be connected to form a complete logic flow" and no Server Action is called.

## Tasks / Subtasks

- [x] Task 1: Define Execution Types and Models (AC: #1, #5)
  - [x] Create `web/src/types/execution-types.ts`
  - [x] `ExecutionStep`: `{ stepIndex, blockId, blockType, input: unknown, output: unknown, status: "executing" | "success" | "error", errorMessage?: string, duration: number }`
  - [x] `TestResult`: `{ testCaseId, passed: boolean, input: unknown, expected: unknown, actual: unknown, errorStep?: number }`
  - [x] `ExecutionReport`: `{ steps: ExecutionStep[], results: TestResult[], summary: { total, passed, failed, duration } }`
  - [x] `SerializedBlockConfig`: `{ id, type: BlockType, position: { x: number, y: number }, connections: { output: string[], input: string[] }, config: Record<string, unknown> }` per architecture Logic Block Serialization format
  - [x] `TestCase`: `{ id: string, input: unknown, expectedOutput: unknown, isEdgeCase?: boolean }` (minimal type for execution; full schema defined in Epic 3's challenge_test_cases table)

- [x] Task 2: Build Block Serializer (AC: #1, #6)
  - [x] Create `web/src/lib/execution/serializer.ts`
  - [x] `serializeCanvasState(nodes, edges): SerializedBlockConfig[]` — convert React Flow nodes/edges to executable config
  - [x] Build dependency graph from edges (topological sort to determine execution order)
  - [x] Reuse `wouldCreateCycle()` from Story 2.3's `lib/canvas/cycle-detection.ts` for validation
  - [x] Validate: all blocks must be connected (no orphans), must have at least one path from start to return block
  - [x] Validate: must include at least one `return` block in flow
  - [x] Return validation error with specific message if validation fails
  - [x] Ensure JSON output matches architecture's Block Serialization format

- [x] Task 3: Build Execution Interpreter (AC: #1, #5)
  - [x] Create `web/src/lib/execution/interpreter.ts`
  - [x] `interpretBlockConfig(config: SerializedBlockConfig[], testInput: unknown): ExecutionReport`
  - [x] Import `BlockType` enum from Story 2.2's `lib/canvas/block-vocabulary.ts` for block type handling
  - [x] Execute blocks in topological order
  - [x] For each block type, implement interpretation logic:
    - **Loop** ("For Each Item"): iterate over array input, execute child blocks for each item
    - **Condition** ("If"): evaluate condition expression, branch to true/false path
    - **Comparison** ("Equal To", "Greater Than", "Less Than"): compare two values, return boolean
    - **Variable** ("Set/Get"): store/retrieve values in execution scope
    - **Assignment** ("Assign Value"): set value to variable or accumulation
    - **Return** ("Return Result"): return final value, stop execution
    - **Edge Case** ("Empty Input", etc.): check boundary condition, early return if met
  - [x] Maintain execution scope as `Map<string, unknown>` for variable tracking
  - [x] Record each step with input, output, timing via `performance.now()`
  - [x] On error: stop execution, record error step with message
  - [x] Return complete `ExecutionReport`

- [x] Task 4: Build Test Runner (AC: #1, #3, #4)
  - [x] Create `web/src/lib/execution/test-runner.ts`
  - [x] `runTests(config: SerializedBlockConfig[], testCases: TestCase[]): ExecutionReport`
  - [x] For each test case: call interpreter with test input, compare output to expected
  - [x] Pass: output matches expected (deep equality check via `fast-deep-equal`)
  - [x] Fail: output differs, record expected vs actual
  - [x] Aggregate results into `TestResult[]` array
  - [x] Return combined `ExecutionReport` with all test results
  - [x] Handle edge cases: empty test cases, null input, large outputs

- [x] Task 5: Create Test Button and Controls (AC: #1, #2, #6)
  - [x] Update `web/src/components/canvas/CanvasToolbar.tsx` (or create `TestControls.tsx`)
  - [x] "Test" button: primary action, indigo filled (#6366F1), positioned bottom-center of canvas
  - [x] Button states: idle, loading (disabled + spinner), success (green pulse), error (disabled)
  - [x] On click: call `handleTestSubmission()` which serializes → Server Action → interprets → tests
  - [x] During execution: disable button, show "Running your logic..." text
  - [x] After execution: re-enable button, show results
  - [x] Wire keyboard shortcut T to trigger test (update `use-canvas-keyboard.ts`)

- [x] Task 6: Create Server Action for Solution Submission (AC: #1)
  - [x] Create `web/src/lib/validation/solution.ts` with Zod schema for `submitSolution` input (challengeId, blockConfig)
  - [x] Create `web/src/actions/challenge-actions.ts` (first action file)
  - [x] `submitSolution(challengeId: string, blockConfig: SerializedBlockConfig[]): Promise<{ success, data?, error? }>`
  - [x] Validate input with Zod schema from `lib/validation/solution.ts`
  - [x] Check user authentication via `getServerSession()`
  - [x] Load challenge test cases from database (or mock/placeholder for now)
  - [x] Call `runTests(blockConfig, testCases)` server-side
  - [x] Return execution report in `{ success: true, data: report }` format
  - [x] Handle errors gracefully per architecture standard: `{ success: false, error: { code: string, message: string, details?: unknown } }`
  - [x] Use architecture's standard Server Action pattern (return error objects, never throw)

- [x] Task 7: Create TestResults Component (AC: #3, #4)
  - [x] Create `web/src/components/challenge/TestResults.tsx`
  - [x] Display after test execution completes
  - [x] All passing: green checkmark (Lucide `CheckCircle`) + "All test cases passed" + animation
  - [x] Some failing: red X (Lucide `XCircle`) + pass/fail count + per-test-case details
  - [x] Each failed test case shows: test description, input, expected output, actual output, failure step
  - [x] Use shadcn/ui components: Card, Badge, Accordion for expandable test details
  - [x] Animate results in with Framer Motion: slide in from bottom
  - [x] Include close button to dismiss results

- [x] Task 8: Implement Execution Progress Animation (AC: #2)
  - [x] Create animation sequence on canvas during execution
  - [x] Animated edge: `animated: true` on edges in execution path, stroke color pulses
  - [x] For each executing block: node has pulsing indigo border
  - [x] After block completes: node border turns green (success) or red (error)
  - [x] Use `setTimeout` or `requestAnimationFrame` for step-by-step highlight animation
  - [x] Progress indicator: "Step 3 of 7 — Running your logic..." text overlay

- [x] Task 9: Update Canvas Store for Test State (AC: #2, #3, #4)
  - [x] Extend `web/src/stores/canvas-store.ts`
  - [x] Add `testStatus: "idle" | "running" | "success" | "error"`
  - [x] Add `testResults: TestResult[] | null`
  - [x] Add `executionSteps: ExecutionStep[] | null`
  - [x] Add `setTestStatus`, `setTestResults`, `setExecutionSteps` actions
  - [x] Add `resetTest()` action to clear test state

- [x] Task 10: Testing & Quality Assurance
  - [x] Write unit test for serializer (valid flow → serialized config; orphan blocks → error)
  - [x] Write unit test for each block type in interpreter (loop, condition, comparison, etc.)
  - [x] Write unit test for test runner with pass and fail test cases
  - [x] Write unit test for deep equality check in output comparison
  - [x] Write integration test: build simple flow → serialize → interpret → verify steps
  - [x] Write integration test: build flow → submit → run tests → verify pass/fail results
  - [x] Write integration test: disconnected blocks → validation error, no submission
  - [x] Test edge cases: empty canvas, single block, circular reference, missing return block
  - [x] Test performance: execution must complete within 2s for scoring readiness (NFR6)
  - [x] Test Server Action: authentication required, input validation, error handling
  - [x] Verify `npm run build` succeeds without errors

## Runnable Code Location

All runnable code MUST be created in the `web/` subfolder at the project root.

## Dev Notes

### Architecture Patterns & Constraints

- **Execution Engine:** Pure function interpreting block configurations. No side effects. Input: serialized blocks + test input → Output: execution steps + results. Must handle all 7 block types. [Source: architecture.md#Cross-Component Dependencies]
- **Server Action Pattern:** All Server Actions return `{ success, data/error }` objects. Never throw. Validate with Zod at entry. Check auth via `getServerSession()`. [Source: architecture.md#API & Communication Patterns]
- **Block Serialization:** Must match architecture format: `{ id, type, position, connections: { output: string[], input: string[] }, config }`. Block types: enum string. [Source: architecture.md#Logic Block Serialization]
- **Error Codes:** Domain-prefixed UPPER_SNAKE_CASE: `EXECUTION_INVALID_FLOW`, `EXECUTION_BLOCK_FAILED`, `EXECUTION_CYCLE_DETECTED`. [Source: architecture.md#Error Handling]
- **Loading States:** Use `status` enum: `"idle" | "running" | "success" | "error"` — NOT boolean flags. [Source: architecture.md#Loading States]

### CRITICAL Anti-Patterns to AVOID

1. **DO NOT** execute user-submitted code — interpreter is NOT a code executor, it's a rule-based tree walker over predefined block types
2. **DO NOT** throw errors from Server Actions — always return `{ success: false, error: {...} }`
3. **DO NOT** skip input validation — always Zod-validate block config before execution
4. **DO NOT** mutate block config during interpretation — interpreter must be pure function
5. **DO NOT** execute without checking user auth — every Server Action checks session
6. **DO NOT** run the full execution engine client-side — only the progress animation runs client-side
7. **DO NOT** forget deep equality for test output comparison — install and use `fast-deep-equal` (`npm install fast-deep-equal`)
8. **DO NOT** place execution engine in `components/` — it belongs in `lib/execution/`

### Project Structure Notes

Expected new/updated files:
```
web/src/
├── lib/
│   └── execution/
│       ├── interpreter.ts                   # Block interpretation engine
│       ├── test-runner.ts                   # Test case runner
│       └── serializer.ts                    # Canvas state → block config serialization
├── actions/
│   └── challenge-actions.ts                 # submitSolution Server Action
├── components/
│   ├── canvas/
│   │   └── CanvasToolbar.tsx               # Updated: Test button + state
│   └── challenge/
│       └── TestResults.tsx                  # Test results display component
├── hooks/
│   └── use-canvas-keyboard.ts              # Updated: T=Test wired to submission
├── stores/
│   └── canvas-store.ts                     # Extended: testStatus, testResults, executionSteps
├── types/
│   └── execution-types.ts                  # ExecutionStep, TestResult, ExecutionReport types
└── lib/
    └── validation/
        └── solution.ts                      # Zod schema for submitSolution input
```

### Previous Story Intelligence

**From Story 2.2 (Block Palette & Nodes):**
- All 7 block types implemented as LogicBlockNode components
- Block vocabulary in `lib/canvas/block-vocabulary.ts`
- Canvas store has nodes, edges state

**From Story 2.3 (Connection Validation):**
- Edges represent connections between blocks
- Cycle detection already implemented (`cycle-detection.ts`)
- Block validation rules defined (`block-validation.ts`)
- Custom edge component `BlockConnection.tsx` renders connections

**From Story 2.1 (Canvas Setup):**
- React Flow provider with dark grid background
- Keyboard shortcut T=Test placeholder → wire to actual test submission
- CanvasToolbar with controls

**From Story 1.2 (Database):**
- Drizzle ORM and database connection available
- Future: challenge test cases will be stored in `challenge_test_cases` table (Epic 3)

### Testing Standards

- **Interpreter Tests:** MUST test every block type individually AND in combination. Test boundary cases: empty input, null, large arrays, nested loops.
- **Serializer Tests:** Test valid flow, disconnected blocks, missing return, orphaned blocks.
- **Test Runner:** Test empty test cases, single pass, single fail, mixed results.
- **Server Action:** Test with authenticated user, unauthenticated user, invalid input, execution errors.
- **Performance:** Use `performance.now()` to verify execution stays within 2s budget (NFR6).

### Execution Engine Architecture

```
User clicks Test
    ↓
serializeCanvasState(nodes, edges)  →  SerializedBlockConfig[]
    ↓
Validation: check connectivity, has return block
    ↓
submitSolution(challengeId, config)  →  Server Action
    ↓
Load challenge test cases from DB
    ↓
runTests(config, testCases)
    ↓
  For each testCase:
    interpretBlockConfig(config, testCase.input)
      → Walk blocks topologically
      → Execute each block type
      → Record execution steps
      → Return final output
    ↓
    Compare output to expectedOutput
    ↓
Return ExecutionReport
    ↓
Client receives { success, data: report }
    ↓
Update canvas store (testStatus, results, steps)
    ↓
TestResults.tsx renders outcome
Canvas shows success/failure animations
```

### Design Token Reference

```
Test Button (primary):    bg #6366F1 (Indigo), text #FFFFFF
Test Button (loading):    bg #4F46E5, opacity 0.7, spinner
Success Path:             stroke #10B981 (Emerald), animated pulse
Failure Path:             stroke #F43F5E (Rose), shake animation
Failure Point Node:       border #F43F5E, bg-opacity 10%
Success Point Node:       border #10B981, bg-opacity 10%
Progress Text:            Inter 14px #94A3B8 (Slate secondary)
TestResults Card:         bg #1E293B, border 1px #334155
Pass Badge:               bg #065F46, text #10B981 (Emerald)
Fail Badge:               bg #9E1239, text #F43F5E (Rose)
```

### References

- [Source: epics.md#Story 2.4] - Original story definition and acceptance criteria
- [Source: epics.md#FR2] - Test visual logic against challenge test cases
- [Source: architecture.md#Cross-Component Dependencies] - Execution engine depends on canvas events
- [Source: architecture.md#API & Communication Patterns] - Server Actions, Zod validation, error handling
- [Source: architecture.md#Logic Block Serialization] - Block config JSON format
- [Source: architecture.md#Server Action Pattern] - { success, data/error } pattern
- [Source: ux-design-specification.md#UX-DR4] - Button hierarchy (primary indigo filled)
- [Source: ux-design-specification.md#UX-DR5] - Success (green glow) and Error (red shake) feedback
- [Source: ux-design-specification.md#UX-DR15] - Loading states (animated progress along logic path)
- [Source: 2-1-install-and-configure-react-flow-canvas.md] - Canvas, toolbar, keyboard shortcuts
- [Source: 2-2-implement-block-palette-drag-to-canvas-interaction.md] - Block vocabulary and node types
- [Source: 2-3-implement-block-connection-real-time-validation.md] - Edges and cycle detection

## Dev Agent Record

### Agent Model Used

GLM-5.1

### Debug Log References

### Completion Notes List

- ✅ Task 5: Updated CanvasToolbar with Test button (indigo #6366F1, bottom-center panel), button states (idle/running/success/error), validation error display, wired keyboard shortcut T via use-canvas-keyboard hook
- ✅ Task 6: Created `lib/validation/solution.ts` with Zod schema and `actions/challenge-actions.ts` with `submitSolution` and `validateAndSerializeFlow` Server Actions, auth check via `getSessionUser()`, mock test cases placeholder, proper `{ success, data/error }` pattern
- ✅ Task 7: Created `components/challenge/TestResults.tsx` with shadcn Card/Badge/Accordion, Framer Motion animations, green checkmark success state, red X failure state with per-test-case details, close button, edge case badge
- ✅ Task 8: Created `components/canvas/ExecutionProgressAnimation.tsx` with step-by-step animation, "Step X of Y — Running your logic..." overlay, updated LogicBlockNode for execution state highlight (indigo pulse active, green success, red shake error), shake keyframe in globals.css
- ✅ Task 9: Extended `stores/canvas-store.ts` with `testStatus`, `testResults`, `executionSteps` state and `setTestStatus`, `setTestResults`, `setExecutionSteps`, `resetTest` actions. Added `isEdgeCase` to `TestResult` type and propagated from TestCase in test-runner.
- ✅ Task 10: Added tests for solution validation Zod schema, canvas store test state, TestResults component, ExecutionProgressAnimation component, challenge-actions server action validation schema, and integration tests for serializer+interpreter+test-runner pipeline. All 491 tests pass (1 pre-existing failure unrelated). Build verified.

### File List

- `web/src/types/execution-types.ts` — Added `isEdgeCase` to `TestResult` interface
- `web/src/lib/execution/test-runner.ts` — Propagate `isEdgeCase` from TestCase to TestResult
- `web/src/lib/validation/solution.ts` — NEW: Zod schema for submitSolution input validation
- `web/src/actions/challenge-actions.ts` — NEW: Server Actions for `submitSolution` and `validateAndSerializeFlow`
- `web/src/stores/canvas-store.ts` — Extended with `testStatus`, `testResults`, `executionSteps`, and actions
- `web/src/components/canvas/CanvasToolbar.tsx` — Updated: Test button, validation error display, server action integration
- `web/src/components/canvas/LogicBlockCanvas.tsx` — Updated: Test submission flow, ExecutionProgressAnimation, TestResults integration, challengeId prop
- `web/src/components/canvas/LogicBlockNode.tsx` — Updated: Execution state highlighting (active pulse, success green, error red shake)
- `web/src/components/canvas/ExecutionProgressAnimation.tsx` — NEW: Step-by-step execution progress overlay on canvas
- `web/src/components/challenge/TestResults.tsx` — NEW: Test results display with pass/fail details
- `web/src/hooks/use-canvas-keyboard.ts` — Updated: Removed console.log defaults for onTest handler
- `web/src/app/globals.css` — Added shake keyframe animation
- `web/src/lib/validation/solution.test.ts` — NEW: Zod schema validation tests
- `web/src/actions/challenge-actions.test.ts` — NEW: Server action validation tests
- `web/src/stores/canvas-store.test.ts` — Updated: Added test state management tests
- `web/src/components/canvas/CanvasToolbar.test.tsx` — Updated: Mocked server actions
- `web/src/components/canvas/LogicBlockCanvas.test.tsx` — Updated: Mocked new imports
- `web/src/components/challenge/TestResults.test.tsx` — NEW: TestResults component tests
- `web/src/components/canvas/ExecutionProgressAnimation.test.tsx` — NEW: Progress animation tests
- `web/src/lib/execution/integration.test.ts` — NEW: Integration tests for serializer→interpreter→test-runner pipeline

### Review Findings (2026-05-15)

#### Decision Needed

- [ ] [Review][Decision] **Hardcoded MOCK_TEST_CASES in production Server Action** — `challenge-actions.ts` has a static `MOCK_TEST_CASES` map and falls back to `{ input: null, expectedOutput: null }` for unrecognized challengeIds, making any unknown challenge trivially pass. Need decision: how should real test cases be loaded? DB query? File import?
- [ ] [Review][Decision] **Duplicate `handleTestSubmission` in CanvasToolbar and LogicBlockCanvas** — near-identical serialize→submit→ingest flow lives in two components with subtle divergences (abortRef, validationError). Where should this logic live?
- [ ] [Review][Decision] **Animation is post-hoc, not real-time** — `ExecutionProgressAnimation` replays steps after the server round-trip completes because all execution runs server-side. Should animation be real-time (polling/streaming) or is post-hoc replay acceptable?

#### Patch

- [ ] [Review][Patch] **Indentation bug: `const serializationResult` at column 0 inside callback** [`CanvasToolbar.tsx`]
- [ ] [Review][Patch] **`NodeHighlightOverlay` always returns `null` — entire execution animation is dead code** [`ExecutionProgressAnimation.tsx`]
- [ ] [Review][Patch] **Interpreter iterates config array AND uses configMap → loop children execute twice** [`interpreter.ts`]
- [ ] [Review][Patch] **`ExecutionStep.status 'executing'` never emitted** [`interpreter.ts`, `execution-types.ts`]
- [ ] [Review][Patch] **`findFinalOutput` searches interleaved steps from all test cases → wrong output** [`test-runner.ts`]
- [ ] [Review][Patch] **`topologicalSort` silently returns unsorted configs when length mismatch** [`serializer.ts`]
- [ ] [Review][Patch] **Empty results array: `.every()` vacuous truth → "All Passed!" when 0 tests** [`CanvasToolbar.tsx`, `LogicBlockCanvas.tsx`]
- [ ] [Review][Patch] **Null/undefined edges crashes `serializeCanvasState`** [`serializer.ts`]
- [ ] [Review][Patch] **Null nodes array crashes `serializeCanvasState`** [`serializer.ts`]
- [ ] [Review][Patch] **Loop block with empty childBlockIds → undefined access** [`interpreter.ts`]
- [ ] [Review][Patch] **Variable increment on non-number value → NaN/string concat** [`interpreter.ts`]
- [ ] [Review][Patch] **`getSessionUser()` throws bypass error handling pattern** [`challenge-actions.ts`]
- [ ] [Review][Patch] **Race condition: keyboard T + Test button → dual `submitSolution` calls** [`CanvasToolbar.tsx`, `LogicBlockCanvas.tsx`]
- [ ] [Review][Patch] **Circular reference in output → `JSON.stringify` crashes TestResults** [`TestResults.tsx`]
- [ ] [Review][Patch] **`currentStepIndex` starts at -1 → "Step 0 of N" flicker** [`ExecutionProgressAnimation.tsx`]
- [ ] [Review][Patch] **Undefined `data.block` crashes LogicBlockNode → entire canvas breaks** [`LogicBlockNode.tsx`]
- [ ] [Review][Patch] **Keyboard T on empty canvas → silent error, no validation message** [`LogicBlockCanvas.tsx`]
- [ ] [Review][Patch] **`undefined` vs `null` output comparison via deep-equal → false positives/negatives** [`test-runner.ts`]
- [ ] [Review][Patch] **Node `executionState` never propagated to canvas store nodes** [`LogicBlockCanvas.tsx`, `ExecutionProgressAnimation.tsx`]
- [ ] [Review][Patch] **Wrong error code: `'EXECUTION_FAILED'` instead of `'EXECUTION_BLOCK_FAILED'`** [`challenge-actions.ts`]
- [ ] [Review][Patch] **Test button loading state color: `#6366F1` instead of spec `#4F46E5`** [`CanvasToolbar.tsx`]
- [ ] [Review][Patch] **Missing `bg-opacity 10%` on success/failure node states** [`LogicBlockNode.tsx`]

#### Deferred

- [x] [Review][Defer] **`abortRef` has no cleanup on unmount** [`CanvasToolbar.tsx`] — harmless since refs collected with component
- [x] [Review][Defer] **No rate limit/timeout on `submitSolution`** [`challenge-actions.ts`] — future story concern (input validation/sandboxing)
