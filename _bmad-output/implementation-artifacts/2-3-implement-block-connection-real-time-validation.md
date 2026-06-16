# Story 2.3: Implement Block Connection & Real-Time Validation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user building a logic flow,
I want to connect blocks together and see validation feedback in real-time,
So that I can construct a valid algorithm before testing.

## Acceptance Criteria

1. **Given** two blocks are on the canvas (Story 2.2), **when** I drag a connection from an output Handle to an input Handle, **then** a `BlockConnection.tsx` edge is created with a curved bezier path (UX-DR6) and a snap animation plays.

2. **Given** I am connecting two incompatible blocks, **when** the connection is attempted, **then** a red X indicator appears on the connection line (UX-DR5: Error feedback), the connection is rejected (edge not created), and a tooltip explains: "Cannot connect [block A] to [block B] — incompatible types".

3. **Given** a valid connection is made, **when** I view the connection, **then** it displays with a neutral Slate color (#64748B) indicating a valid link and the screen reader announces: "Connected [block A] to [block B]" (UX-DR13).

4. **Given** a logic flow is being built, **when** I view the canvas, **then** the connected flow is visually clear — blocks are positioned with readable connection paths — and the flow is announced as an ordered list to screen readers (UX-DR13).

5. **Given** I attempt to create a connection that would form a cycle, **when** the connection is completed, **then** the connection is rejected and a toast notification warns: "Cannot create circular logic — this would cause infinite execution".

6. **Given** I drag a connection from an input Handle to another input Handle (or output to output), **when** the connection is attempted, **then** the connection is rejected and the source Handle shows a red amber pulse to indicate wrong direction.

## Tasks / Subtasks

- [x] Task 1: Define Block Compatibility Rules (AC: #2, #5, #6)
  - [x] Create `web/src/lib/canvas/block-validation.ts`
  - [x] Define `ConnectionRule` type: `{ fromType: BlockType, toType: BlockType, allowed: boolean, reason?: string }`
  - [x] Verify actual `BlockType` enum values from `canvas-types.ts` (⚠️ Story 2.2 may have `edgeCase` or `edgeCaseHandler` — check the codebase; architecture.md canonical is `edgeCase`)
  - [x] Define compatibility matrix for all block types:
    - Loop → Condition, Comparison, Variable, Assignment, EdgeCase
    - Condition → Assignment, Comparison, Return, EdgeCase
    - Comparison → Condition, Assignment, Return
    - Variable → Comparison, Assignment
    - Assignment → Return, Comparison
    - Return → (none — terminal block; no source Handle rendered)
    - EdgeCase → Condition, Comparison, Assignment
  - [x] Define disallowed connection reasons as readable strings
  - [x] Export `isValidBlockConnection(fromType, toType): { valid: boolean; reason?: string }`

- [x] Task 2: Create Custom Edge Component (AC: #1, #3)
  - [x] Create `web/src/components/canvas/BlockConnection.tsx`
  - [x] Use React Flow's `BaseEdge` and `getBezierPath()` for curved path rendering (import from `@xyflow/react`)
  - [x] Style: Slate #64748B stroke, 2px width, with arrow marker (`MarkerType.ArrowClosed` from `@xyflow/react`)
  - [x] On valid: neutral color with subtle glow
  - [x] On invalid: animation with red X indicator (absolute positioned)
  - [x] Add data attributes for testability: `data-edge-valid`, `data-edge-from`, `data-edge-to`
  - [x] Register as custom edge type: `edgeTypes={{ blockConnection: BlockConnection }}`

- [x] Task 3: Implement Connection Validation Handler (AC: #2, #5, #6)
  - [x] Create `web/src/components/canvas/BlockValidator.tsx` (or add as hook `useBlockValidator.ts`)
  - [x] Implement `isValidConnection` callback for React Flow's `<ReactFlow>` component
  - [x] Check: source Handle position must be "source" (output) and target must be "target" (input)
  - [x] Check: source and target must be different nodes (no self-connections)
  - [x] Check: target must not already have an incoming connection (single input per block)
  - [x] Check: block types must be compatible per compatibility matrix
  - [x] Check: connection must not create a cycle (use `getOutgoers`/`getIncomers` from `@xyflow/react` or custom DFS)
  - [x] Return `false` + show toast/indicator for invalid connections (use shadcn/ui Toast via `toast()` from `@/components/ui/toast`)
  - [x] Return `true` for valid connections

- [x] Task 4: Implement Cycle Detection (AC: #5)
  - [x] Add cycle detection logic in `web/src/lib/canvas/cycle-detection.ts`
  - [x] Use DFS/BFS on nodes+edges graph to detect if adding new edge creates cycle
  - [x] Extract to pure function: `wouldCreateCycle(nodes, edges, newEdge): boolean`
  - [x] Call before allowing any new connection
  - [x] Show toast notification for cycle rejection

- [x] Task 5: Create Connection Event Handlers (AC: #1, #3)
  - [x] Implement `onConnect` callback: create new edge on valid connection
  - [x] Use `addEdge()` from `@xyflow/react` to add edge to state
  - [x] Set edge `type: "blockConnection"` and `animated: true` for initial snap animation
  - [x] After 500ms, set `animated: false` for static display
  - [x] Update canvas store with new edge
  - [x] Implement `onConnectStart`, `onConnectEnd` for visual feedback during drag
  - [x] On `onConnectEnd` with no valid target: clean up temporary connection line

- [x] Task 6: Implement Handle Direction Validation (AC: #6)
  - [x] Each `LogicBlockNode` has `Handle type="target"` (top) and `Handle type="source"` (bottom)
  - [x] In `isValidConnection`: reject source→source and target→target connections
  - [x] Visual feedback: rejected Handle shows amber pulse for 1s
  - [x] Screen reader: "Cannot connect — must connect output to input"

- [x] Task 7: Screen Reader Announcer (AC: #3, #4)
  - [x] Create `web/src/hooks/use-canvas-announcer.ts`
  - [x] Use `aria-live="polite"` region for connection announcements
  - [x] On valid connection: announce "Connected [block A] to [block B]"
  - [x] On rejected connection: announce "Cannot connect [block A] to [block B] — [reason]"
  - [x] On flow build: announce ordered list of connected blocks
  - [x] On cycle rejection: announce "Cannot create circular logic"

- [x] Task 8: Update Canvas Store for Edges (AC: #1, #2, #3)
  - [x] Extend `web/src/stores/canvas-store.ts`
  - [x] Add `addEdge(edge: Edge)` action
  - [x] Add `removeEdge(edgeId: string)` action
  - [x] Add `validateConnection(fromId, toId): boolean` action (calls validation lib)
  - [x] Add `getBlockGraph(): { nodes, edges }` selector for cycle detection
  - [x] Track `lastValidationError: string | null` for UI display

- [x] Task 9: Testing & Quality Assurance
  - [x] Write unit test for block compatibility matrix (all valid/invalid pairs)
  - [x] Write unit test for cycle detection algorithm (DFS correctness)
  - [x] Write unit test for `isValidBlockConnection` for all block type pairs
  - [x] Write unit test for Handle direction validation (source→target only)
  - [x] Write unit test for canvas store edge actions
  - [x] Write integration test: drag connection → valid → edge created
  - [x] Write integration test: drag connection → incompatible → rejected + tooltip
  - [x] Write integration test: drag connection → cycle → rejected + toast
  - [x] Write integration test: drag connection → wrong direction → rejected
  - [x] Accessibility test: screen reader announcement for connections
  - [x] Verify `npm run build` succeeds without errors

## Runnable Code Location

All runnable code MUST be created in the `web/` subfolder at the project root.

## Dev Notes

### Architecture Patterns & Constraints

- **React Flow Connection Flow:** User drags from Handle → React Flow fires `onConnectStart` → connection line renders → user drops on target Handle → `isValidConnection` callback runs → if true, `onConnect` creates edge → edge renders with custom `BlockConnection` component. [Source: React Flow v12 docs#Connection Events]
- **Custom Edges:** `BlockConnection.tsx` is a custom edge component registered via `edgeTypes`. Uses `BaseEdge` + `getBezierPath()` for rendered path. Can include interactive elements via `EdgeLabelRenderer`. [Source: architecture.md#Canvas Technology]
- **Validation Architecture:** Block validation rules in `lib/canvas/block-validation.ts` as pure functions. Called from `isValidConnection` prop on `<ReactFlow>`. No side effects in validation — only boolean + reason string. [Source: architecture.md#Validation]
- **Cycle Detection:** Independent `cycle-detection.ts` module. Runs on each connection attempt. Must complete in <16ms (single frame) to not block UI. React Flow's `getOutgoers`/`getIncomers` (from `@xyflow/react`) can assist but a custom DFS is recommended for complete cycle detection on the full graph (since `getOutgoers` only checks forward reachability from one node). [Source: architecture.md#Canvas Technology]
- **State:** Edges stored in React Flow's edge state (`useEdgesState`) and mirrored in Zustand store for cross-component access. [Source: architecture.md#State Management]
- **Toasts:** All user-facing notifications use the shadcn/ui Toast system (or `sonner` if configured). Import `toast` from the configured location. [Source: architecture.md#Style]

### CRITICAL Anti-Patterns to AVOID

1. **DO NOT** allow self-connections — block connected to itself is invalid
2. **DO NOT** allow multiple inputs to a single target Handle — each block has one input; for blocks needing multiple inputs (e.g., Comparison comparing two values), use separate variable assignment blocks upstream
3. **DO NOT** skip cycle detection — infinite loops would crash execution engine (Story 2.4)
4. **DO NOT** hardcode connection rules in components — use `block-validation.ts` pure functions
5. **DO NOT** create edges without validation — always check `isValidConnection` first
6. **DO NOT** use string interpolation for error messages without i18n consideration
7. **DO NOT** let temporary connection lines persist after failed connection — clean up in `onConnectEnd`
8. **DO NOT** render a `<Handle type="source">` on the Return block — it is a terminal block with no valid outgoing connections
9. **DO NOT** use `window.alert()` or `console.log` for user-facing notifications — use shadcn/ui Toast (`toast()` from `sonner` or `@/components/ui/toast`)

### Project Structure Notes

Expected new/updated files:
```
web/src/
├── lib/
│   └── canvas/
│       ├── block-validation.ts              # Compatibility rules + validation
│       └── cycle-detection.ts               # DFS-based cycle detection
├── components/
│   └── canvas/
│       ├── BlockConnection.tsx              # Custom edge component (bezier)
│       ├── BlockValidator.tsx              # Validation handler component/hook
│       └── LogicBlockCanvas.tsx            # Updated with isValidConnection prop
├── hooks/
│   └── use-canvas-announcer.ts             # Screen reader announcements
├── stores/
│   └── canvas-store.ts                     # Extended with edge management
└── types/
    └── canvas-types.ts                     # Extended with Edge, ConnectionRule types
```

### Previous Story Intelligence

**From Story 2.2 (Block Palette & Nodes):**
- `LogicBlockNode.tsx` has `<Handle type="target">` (top) and `<Handle type="source">` (bottom)
- Block types enum defined: loop, condition, comparison, variable, assignment, return, edgeCase (⚠️ Verify actual enum value in `canvas-types.ts` — Story 2.2 may have been implemented with `edgeCase` or `edgeCaseHandler`; use whatever is in the codebase)
- Block vocabulary defined in `lib/canvas/block-vocabulary.ts`
- Canvas store has `addBlock`, `removeBlock`, node state
- BlockPalette provides drag sources; canvas is the drop target
- **Return block is terminal** — it should NOT render a `<Handle type="source">` since no outgoing connections are valid from a return block

**From Story 2.1 (Canvas Setup):**
- React Flow provider with `<ReactFlow>` rendering dark grid background
- Zoom/pan/snap-to-grid already configured
- Keyboard shortcuts hook exists

### Testing Standards

- **Unit Tests:** Pure validation functions must have 100% coverage. Test all block type pairs.
- **Cycle Detection:** Test with known DAG, known cyclic graph, single node, empty graph
- **Integration Tests:** Full connection flow from Handle drag to edge creation
- **Collaboration Note:** Cycle detection algorithm should be pure-function tested; avoid mutation

### Design Token Reference

```
Valid Connection:    stroke #64748B (Slate 400), 2px
Invalid Connection:  stroke #F43F5E (Rose/Error), 2px, with X indicator
Arrow Marker:        fill #64748B, MarkerType.ArrowClosed
Connection Animation: stroke-dasharray transition on valid connection
Block Handle (source): bg #10B981 (Emerald), size 10px
Block Handle (target): bg #6366F1 (Indigo), size 10px
Handle invalid pulse:  box-shadow 0 0 0 3px #F59E0B (Amber), 1s animation
```

### Screen Reader Announcement Spec

```
aria-live="polite" region in canvas wrapper:
  Valid:       "Connected [Compare Value] to [Return Result]"
  Invalid:     "Cannot connect [Loop Items] to [Return Result] — incompatible types"
  Cycle:       "Cannot create circular logic — this would cause infinite execution"
  Direction:   "Cannot connect — must connect output to input"
```

### References

- [Source: epics.md#Story 2.3] - Original story definition and acceptance criteria
- [Source: epics.md#FR1] - Drag and connect visual logic blocks
- [Source: architecture.md#Canvas Technology] - Custom edge types, connection validation
- [Source: architecture.md#Logic Block Serialization] - Block config JSON with connections
- [Source: ux-design-specification.md#UX-DR6] - Connection lines (curved paths), block design
- [Source: ux-design-specification.md#UX-DR5] - Error/Warning feedback patterns
- [Source: ux-design-specification.md#UX-DR13] - Screen reader announcements, ARIA
- [Source: 2-1-install-and-configure-react-flow-canvas.md] - Canvas foundation
- [Source: 2-2-implement-block-palette-drag-to-canvas-interaction.md] - Node types, block vocabulary
- [Source: React Flow v12 docs#Connection Events] - onConnect, isValidConnection API

## Dev Agent Record

### Agent Model Used

GLM-5.1

### Debug Log References

- All unit tests pass (39 block-validation, 17 cycle-detection, 17 canvas-store-edges, 6 BlockConnection, 5 announcer, 7 BlockValidator)
- TypeScript compilation passes cleanly
- Next.js build succeeds without errors
- Total test count: 388 passed (1 pre-existing unrelated fail in forgot-password route)

### Completion Notes List

- ✅ Task 1: Block compatibility rules defined in `block-validation.ts` with full type pair coverage and BLOCK_LABELS map
- ✅ Task 2: Custom `BlockConnection` edge component with bezier path, Slate #64748B valid color, Rose #F43F5E invalid color, red X indicator, SVG arrow markers, snap animation (500ms dasharray)
- ✅ Task 3: `useBlockValidator` hook implements `isValidConnection` with self-connection, direction, duplicate-input, type-compatibility, and cycle checks; uses `sonner` toast for user feedback
- ✅ Task 4: DFS-based `wouldCreateCycle()` pure function in `cycle-detection.ts`; 17 tests covering all graph scenarios
- ✅ Task 5: `onConnect`, `onConnectStart`, `onConnectEnd` handlers in `LogicBlockCanvas.tsx`; edges created with `type: 'blockConnection'` and `animated: true` then set to `false` after 500ms
- ✅ Task 6: Handle direction validation in `isValidConnection`; source handle type checked, Return block omits source Handle
- ✅ Task 7: `use-canvas-announcer.ts` hook with `aria-live="polite"` region for all connection announcements
- ✅ Task 8: Canvas store extended with `addEdge`, `removeEdge`, `validateConnection`, `getBlockGraph`, `setLastValidationError`
- ✅ Task 9: 94 new/updated tests covering validation, cycle detection, store actions, components, and accessibility

### File List

- web/src/lib/canvas/block-validation.ts (new)
- web/src/lib/canvas/block-validation.test.ts (new)
- web/src/lib/canvas/cycle-detection.ts (new)
- web/src/lib/canvas/cycle-detection.test.ts (new)
- web/src/components/canvas/BlockConnection.tsx (new)
- web/src/components/canvas/BlockConnection.test.tsx (new)
- web/src/components/canvas/BlockValidator.tsx (new)
- web/src/components/canvas/BlockValidator.test.tsx (new)
- web/src/components/canvas/LogicBlockCanvas.tsx (modified)
- web/src/components/canvas/LogicBlockCanvas.test.tsx (modified)
- web/src/components/canvas/LogicBlockNode.tsx (modified)
- web/src/hooks/use-canvas-announcer.ts (new)
- web/src/hooks/use-canvas-announcer.test.ts (new)
- web/src/stores/canvas-store.ts (modified)
- web/src/stores/canvas-store.test.ts (modified)
- web/src/stores/canvas-store-edges.test.ts (new)
- web/src/types/canvas-types.ts (modified)
