# Story 2.3: Implement Block Connection & Real-Time Validation

Status: ready-for-dev

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

- [ ] Task 1: Define Block Compatibility Rules (AC: #2, #5, #6)
  - [ ] Create `web/src/lib/canvas/block-validation.ts`
  - [ ] Define `ConnectionRule` type: `{ fromType: BlockType, toType: BlockType, allowed: boolean, reason?: string }`
  - [ ] Verify actual `BlockType` enum values from `canvas-types.ts` (⚠️ Story 2.2 may have `edgeCase` or `edgeCaseHandler` — check the codebase; architecture.md canonical is `edgeCase`)
  - [ ] Define compatibility matrix for all block types:
    - Loop → Condition, Comparison, Variable, Assignment, EdgeCase
    - Condition → Assignment, Comparison, Return, EdgeCase
    - Comparison → Condition, Assignment, Return
    - Variable → Comparison, Assignment
    - Assignment → Return, Comparison
    - Return → (none — terminal block; no source Handle rendered)
    - EdgeCase → Condition, Comparison, Assignment
  - [ ] Define disallowed connection reasons as readable strings
  - [ ] Export `isValidBlockConnection(fromType, toType): { valid: boolean; reason?: string }`

- [ ] Task 2: Create Custom Edge Component (AC: #1, #3)
  - [ ] Create `web/src/components/canvas/BlockConnection.tsx`
  - [ ] Use React Flow's `BaseEdge` and `getBezierPath()` for curved path rendering (import from `@xyflow/react`)
  - [ ] Style: Slate #64748B stroke, 2px width, with arrow marker (`MarkerType.ArrowClosed` from `@xyflow/react`)
  - [ ] On valid: neutral color with subtle glow
  - [ ] On invalid: animation with red X indicator (absolute positioned)
  - [ ] Add data attributes for testability: `data-edge-valid`, `data-edge-from`, `data-edge-to`
  - [ ] Register as custom edge type: `edgeTypes={{ blockConnection: BlockConnection }}`

- [ ] Task 3: Implement Connection Validation Handler (AC: #2, #5, #6)
  - [ ] Create `web/src/components/canvas/BlockValidator.tsx` (or add as hook `useBlockValidator.ts`)
  - [ ] Implement `isValidConnection` callback for React Flow's `<ReactFlow>` component
  - [ ] Check: source Handle position must be "source" (output) and target must be "target" (input)
  - [ ] Check: source and target must be different nodes (no self-connections)
  - [ ] Check: target must not already have an incoming connection (single input per block)
  - [ ] Check: block types must be compatible per compatibility matrix
  - [ ] Check: connection must not create a cycle (use `getOutgoers`/`getIncomers` from `@xyflow/react` or custom DFS)
  - [ ] Return `false` + show toast/indicator for invalid connections (use shadcn/ui Toast via `toast()` from `@/components/ui/toast`)
  - [ ] Return `true` for valid connections

- [ ] Task 4: Implement Cycle Detection (AC: #5)
  - [ ] Add cycle detection logic in `web/src/lib/canvas/cycle-detection.ts`
  - [ ] Use DFS/BFS on nodes+edges graph to detect if adding new edge creates cycle
  - [ ] Extract to pure function: `wouldCreateCycle(nodes, edges, newEdge): boolean`
  - [ ] Call before allowing any new connection
  - [ ] Show toast notification for cycle rejection

- [ ] Task 5: Create Connection Event Handlers (AC: #1, #3)
  - [ ] Implement `onConnect` callback: create new edge on valid connection
  - [ ] Use `addEdge()` from `@xyflow/react` to add edge to state
  - [ ] Set edge `type: "blockConnection"` and `animated: true` for initial snap animation
  - [ ] After 500ms, set `animated: false` for static display
  - [ ] Update canvas store with new edge
  - [ ] Implement `onConnectStart`, `onConnectEnd` for visual feedback during drag
  - [ ] On `onConnectEnd` with no valid target: clean up temporary connection line

- [ ] Task 6: Implement Handle Direction Validation (AC: #6)
  - [ ] Each `LogicBlockNode` has `Handle type="target"` (top) and `Handle type="source"` (bottom)
  - [ ] In `isValidConnection`: reject source→source and target→target connections
  - [ ] Visual feedback: rejected Handle shows amber pulse for 1s
  - [ ] Screen reader: "Cannot connect — must connect output to input"

- [ ] Task 7: Screen Reader Announcer (AC: #3, #4)
  - [ ] Create `web/src/hooks/use-canvas-announcer.ts`
  - [ ] Use `aria-live="polite"` region for connection announcements
  - [ ] On valid connection: announce "Connected [block A] to [block B]"
  - [ ] On rejected connection: announce "Cannot connect [block A] to [block B] — [reason]"
  - [ ] On flow build: announce ordered list of connected blocks
  - [ ] On cycle rejection: announce "Cannot create circular logic"

- [ ] Task 8: Update Canvas Store for Edges (AC: #1, #2, #3)
  - [ ] Extend `web/src/stores/canvas-store.ts`
  - [ ] Add `addEdge(edge: Edge)` action
  - [ ] Add `removeEdge(edgeId: string)` action
  - [ ] Add `validateConnection(fromId, toId): boolean` action (calls validation lib)
  - [ ] Add `getBlockGraph(): { nodes, edges }` selector for cycle detection
  - [ ] Track `lastValidationError: string | null` for UI display

- [ ] Task 9: Testing & Quality Assurance
  - [ ] Write unit test for block compatibility matrix (all valid/invalid pairs)
  - [ ] Write unit test for cycle detection algorithm (DFS correctness)
  - [ ] Write unit test for `isValidBlockConnection` for all block type pairs
  - [ ] Write unit test for Handle direction validation (source→target only)
  - [ ] Write unit test for canvas store edge actions
  - [ ] Write integration test: drag connection → valid → edge created
  - [ ] Write integration test: drag connection → incompatible → rejected + tooltip
  - [ ] Write integration test: drag connection → cycle → rejected + toast
  - [ ] Write integration test: drag connection → wrong direction → rejected
  - [ ] Accessibility test: screen reader announcement for connections
  - [ ] Verify `npm run build` succeeds without errors

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
