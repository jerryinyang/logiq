# Story 2.4: Build Logic Block Execution Engine & Test Runner

Status: ready-for-dev

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

- [ ] Task 1: Define Execution Types and Models (AC: #1, #5)
  - [ ] Create `web/src/types/execution-types.ts`
  - [ ] `ExecutionStep`: `{ stepIndex, blockId, blockType, input: unknown, output: unknown, status: "executing" | "success" | "error", errorMessage?: string, duration: number }`
  - [ ] `TestResult`: `{ testCaseId, passed: boolean, input: unknown, expected: unknown, actual: unknown, errorStep?: number }`
  - [ ] `ExecutionReport`: `{ steps: ExecutionStep[], results: TestResult[], summary: { total, passed, failed, duration } }`
  - [ ] `SerializedBlockConfig`: `{ id, type: BlockType, position: { x: number, y: number }, connections: { output: string[], input: string[] }, config: Record<string, unknown> }` per architecture Logic Block Serialization format
  - [ ] `TestCase`: `{ id: string, input: unknown, expectedOutput: unknown, isEdgeCase?: boolean }` (minimal type for execution; full schema defined in Epic 3's challenge_test_cases table)

- [ ] Task 2: Build Block Serializer (AC: #1, #6)
  - [ ] Create `web/src/lib/execution/serializer.ts`
  - [ ] `serializeCanvasState(nodes, edges): SerializedBlockConfig[]` — convert React Flow nodes/edges to executable config
  - [ ] Build dependency graph from edges (topological sort to determine execution order)
  - [ ] Reuse `wouldCreateCycle()` from Story 2.3's `lib/canvas/cycle-detection.ts` for validation
  - [ ] Validate: all blocks must be connected (no orphans), must have at least one path from start to return block
  - [ ] Validate: must include at least one `return` block in flow
  - [ ] Return validation error with specific message if validation fails
  - [ ] Ensure JSON output matches architecture's Block Serialization format

- [ ] Task 3: Build Execution Interpreter (AC: #1, #5)
  - [ ] Create `web/src/lib/execution/interpreter.ts`
  - [ ] `interpretBlockConfig(config: SerializedBlockConfig[], testInput: unknown): ExecutionReport`
  - [ ] Import `BlockType` enum from Story 2.2's `lib/canvas/block-vocabulary.ts` for block type handling
  - [ ] Execute blocks in topological order
  - [ ] For each block type, implement interpretation logic:
    - **Loop** ("For Each Item"): iterate over array input, execute child blocks for each item
    - **Condition** ("If"): evaluate condition expression, branch to true/false path
    - **Comparison** ("Equal To", "Greater Than", "Less Than"): compare two values, return boolean
    - **Variable** ("Set/Get"): store/retrieve values in execution scope
    - **Assignment** ("Assign Value"): set value to variable or accumulation
    - **Return** ("Return Result"): return final value, stop execution
    - **Edge Case** ("Empty Input", etc.): check boundary condition, early return if met
  - [ ] Maintain execution scope as `Map<string, unknown>` for variable tracking
  - [ ] Record each step with input, output, timing via `performance.now()`
  - [ ] On error: stop execution, record error step with message
  - [ ] Return complete `ExecutionReport`

- [ ] Task 4: Build Test Runner (AC: #1, #3, #4)
  - [ ] Create `web/src/lib/execution/test-runner.ts`
  - [ ] `runTests(config: SerializedBlockConfig[], testCases: TestCase[]): ExecutionReport`
  - [ ] For each test case: call interpreter with test input, compare output to expected
  - [ ] Pass: output matches expected (deep equality check via `fast-deep-equal`)
  - [ ] Fail: output differs, record expected vs actual
  - [ ] Aggregate results into `TestResult[]` array
  - [ ] Return combined `ExecutionReport` with all test results
  - [ ] Handle edge cases: empty test cases, null input, large outputs

- [ ] Task 5: Create Test Button and Controls (AC: #1, #2, #6)
  - [ ] Update `web/src/components/canvas/CanvasToolbar.tsx` (or create `TestControls.tsx`)
  - [ ] "Test" button: primary action, indigo filled (#6366F1), positioned bottom-center of canvas
  - [ ] Button states: idle, loading (disabled + spinner), success (green pulse), error (disabled)
  - [ ] On click: call `handleTestSubmission()` which serializes → Server Action → interprets → tests
  - [ ] During execution: disable button, show "Running your logic..." text
  - [ ] After execution: re-enable button, show results
  - [ ] Wire keyboard shortcut T to trigger test (update `use-canvas-keyboard.ts`)

- [ ] Task 6: Create Server Action for Solution Submission (AC: #1)
  - [ ] Create `web/src/lib/validation/solution.ts` with Zod schema for `submitSolution` input (challengeId, blockConfig)
  - [ ] Create `web/src/actions/challenge-actions.ts` (first action file)
  - [ ] `submitSolution(challengeId: string, blockConfig: SerializedBlockConfig[]): Promise<{ success, data?, error? }>`
  - [ ] Validate input with Zod schema from `lib/validation/solution.ts`
  - [ ] Check user authentication via `getServerSession()`
  - [ ] Load challenge test cases from database (or mock/placeholder for now)
  - [ ] Call `runTests(blockConfig, testCases)` server-side
  - [ ] Return execution report in `{ success: true, data: report }` format
  - [ ] Handle errors gracefully per architecture standard: `{ success: false, error: { code: string, message: string, details?: unknown } }`
  - [ ] Use architecture's standard Server Action pattern (return error objects, never throw)

- [ ] Task 7: Create TestResults Component (AC: #3, #4)
  - [ ] Create `web/src/components/challenge/TestResults.tsx`
  - [ ] Display after test execution completes
  - [ ] All passing: green checkmark (Lucide `CheckCircle`) + "All test cases passed" + animation
  - [ ] Some failing: red X (Lucide `XCircle`) + pass/fail count + per-test-case details
  - [ ] Each failed test case shows: test description, input, expected output, actual output, failure step
  - [ ] Use shadcn/ui components: Card, Badge, Accordion for expandable test details
  - [ ] Animate results in with Framer Motion: slide in from bottom
  - [ ] Include close button to dismiss results

- [ ] Task 8: Implement Execution Progress Animation (AC: #2)
  - [ ] Create animation sequence on canvas during execution
  - [ ] Animated edge: `animated: true` on edges in execution path, stroke color pulses
  - [ ] For each executing block: node has pulsing indigo border
  - [ ] After block completes: node border turns green (success) or red (error)
  - [ ] Use `setTimeout` or `requestAnimationFrame` for step-by-step highlight animation
  - [ ] Progress indicator: "Step 3 of 7 — Running your logic..." text overlay

- [ ] Task 9: Update Canvas Store for Test State (AC: #2, #3, #4)
  - [ ] Extend `web/src/stores/canvas-store.ts`
  - [ ] Add `testStatus: "idle" | "running" | "success" | "error"`
  - [ ] Add `testResults: TestResult[] | null`
  - [ ] Add `executionSteps: ExecutionStep[] | null`
  - [ ] Add `setTestStatus`, `setTestResults`, `setExecutionSteps` actions
  - [ ] Add `resetTest()` action to clear test state

- [ ] Task 10: Testing & Quality Assurance
  - [ ] Write unit test for serializer (valid flow → serialized config; orphan blocks → error)
  - [ ] Write unit test for each block type in interpreter (loop, condition, comparison, etc.)
  - [ ] Write unit test for test runner with pass and fail test cases
  - [ ] Write unit test for deep equality check in output comparison
  - [ ] Write integration test: build simple flow → serialize → interpret → verify steps
  - [ ] Write integration test: build flow → submit → run tests → verify pass/fail results
  - [ ] Write integration test: disconnected blocks → validation error, no submission
  - [ ] Test edge cases: empty canvas, single block, circular reference, missing return block
  - [ ] Test performance: execution must complete within 2s for scoring readiness (NFR6)
  - [ ] Test Server Action: authentication required, input validation, error handling
  - [ ] Verify `npm run build` succeeds without errors

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
