# Story 2.1: Install and Configure React Flow Canvas

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want React Flow (@xyflow/react) integrated into the application,
So that users can interact with a visual node-based canvas for building logic flows.

## Acceptance Criteria

1. **Given** the Next.js project is initialized (Epic 1), **when** `@xyflow/react` v12 is installed, **then** a `LogicBlockCanvas.tsx` component exists in `src/components/canvas/` and renders a React Flow provider with a dark grid background (UX-DR6) using the slate background (#0F172A) with subtle grid lines.

2. **Given** the canvas component is rendered, **when** I interact with it, **then** the canvas supports zoom (0.5x–2x), pan, and snap-to-grid via React Flow's built-in `<Controls />` and `snapToGrid`/`snapGrid` props.

3. **Given** the canvas component is rendered, **when** I view it, **then** undo/redo infrastructure is established: a history stack exists in the Zustand canvas store with `undo`/`redo` actions wired to `onNodesChange`/`onEdgesChange` callbacks (note: `useUndoRedo` was removed in @xyflow/react v12 — use manual state history via capturing change events into a history array), and undo/redo buttons are visible in `CanvasToolbar.tsx` wired to the store actions. Full change-tracking behavior finalized in Story 2.6.

4. **Given** the canvas is rendered on a challenge page (`/(app)/challenge/[id]/page.tsx`), **when** the page loads, **then** the canvas surface occupies the center panel per UX-DR3 (3-panel layout: left 280px, center flexible, right 300px) and the empty state displays: "Drag blocks here to build your logic" with arrow animation pointing to the block palette (UX-DR14).

5. **Given** the canvas is rendered on the challenge page, **when** the app loads, **then** keyboard shortcuts are registered via React Flow's `deleteKeyCode` and a custom keyboard handler: T=Test (placeholder), R=Reset (placeholder) (UX-DR17).

6. **Given** the canvas is rendered, **when** I use the keyboard, **then** Tab navigates between canvas controls, Enter activates selected elements, and focus indicators are visible (2px indigo outline, UX-DR13).

## Tasks / Subtasks

- [ ] Task 1: Install React Flow Dependency (AC: #1)
  - [ ] Install `@xyflow/react` at version 12.x (latest stable v12.10.2+)
  - [ ] Verify package added to `web/package.json`
  - [ ] Ensure no peer dependency conflicts with React 19
  - [ ] Import `@xyflow/react/dist/style.css` in the root layout (`src/app/layout.tsx`) — REQUIRED for React Flow components to render correctly

- [ ] Task 2: Create Challenge Page Route (AC: #4)
  - [ ] Create `web/src/app/(app)/challenge/[id]/page.tsx` — use `params: Promise<{ id: string }>` per Next.js 15 async params API, with `"use client"` directive
  - [ ] Implement 3-panel layout: left (280px, challenge description placeholder), center (flex, canvas), right (300px, block palette placeholder)
  - [ ] Use CSS Grid per UX-DR3: `grid-template-columns: 280px 1fr 300px`
  - [ ] Ensure page is a client component (`"use client"`) since React Flow requires browser APIs
  - [ ] Add responsive fallback for tablet/mobile: "Logic building is best on a larger screen" (UX-DR12)

- [ ] Task 3: Create LogicBlockCanvas Component (AC: #1, #2)
  - [ ] Create `web/src/components/canvas/LogicBlockCanvas.tsx`
  - [ ] Wrap with `<ReactFlowProvider>` for context isolation
  - [ ] Configure `<ReactFlow>` with:
    - `snapToGrid={true}` and `snapGrid={[16, 16]}` per architecture
    - `minZoom={0.5}` and `maxZoom={2}` per architecture
    - `fitView` on initial render with `fitViewOptions={{ padding: 0.2 }}`
    - `colorMode="dark"` for dark-mode-first aesthetic (UX-DR1)
    - `defaultNodes={[]}` and `defaultEdges={[]}` — empty initial state
  - [ ] Add `<Background>` component with dark grid pattern (Slate #1E293B lines on #0F172A background)
  - [ ] Style canvas container to fill available space with `width: 100%` and `height: 100%`

- [ ] Task 4: Create CanvasToolbar Component (AC: #2, #3)
  - [ ] Create `web/src/components/canvas/CanvasToolbar.tsx`
  - [ ] Add React Flow's `<Controls>` component for zoom in/out/fit-view
  - [ ] Add undo/redo buttons wired to Zustand canvas store `undo`/`redo` actions (infrastructure ready; full change-tracking across all node/edge interactions finalized in Story 2.6)
  - [ ] Position as floating panel using React Flow's `<Panel position="top-right">`
  - [ ] Style toolbar buttons with shadcn/ui Button component (ghost variant for icon-only)
  - [ ] Use Lucide icons: `Undo2`, `Redo2`, `ZoomIn`, `ZoomOut`, `Maximize2`

- [ ] Task 5: Implement Keyboard Shortcuts (AC: #5, #6)
  - [ ] Register keyboard shortcuts in LogicBlockCanvas or via custom hook `useCanvasKeyboard`
  - [ ] T key → console.log("Test") placeholder (full implementation in Story 2.4)
  - [ ] R key → console.log("Reset") placeholder (full implementation in Story 2.6)
  - [ ] Use React Flow's `deleteKeyCode="Delete"` for node removal
  - [ ] Ensure keyboard navigation: Tab-able canvas controls, visible 2px indigo focus rings (#6366F1)
  - [ ] Add `aria-label` to canvas: "Logic Block Canvas — interactive workspace" (UX-DR13)
  - [ ] Pass `ariaLabelConfig` prop to React Flow for customizable screen reader labels

- [ ] Task 6: Create useCanvasKeyboard Hook (AC: #5)
  - [ ] Create `web/src/hooks/use-canvas-keyboard.ts`
  - [ ] Listen for `keydown` events with specific shortcuts
  - [ ] Prevent default browser behavior for consumed shortcuts
  - [ ] Return key handlers object for consumption by canvas components

- [ ] Task 7: Implement Empty State (AC: #4)
  - [ ] Create `web/src/components/canvas/CanvasEmptyState.tsx` as a separate component
  - [ ] Show empty state overlay when `nodes.length === 0`
  - [ ] Display text: "Drag blocks here to build your logic"
  - [ ] Add subtle arrow animation pointing to the block palette (right side)
  - [ ] Use indigo accent color for empty state text (#6366F1 at 60% opacity)
  - [ ] Style with `absolute positioning` centered on canvas area

- [ ] Task 8: Create Zustand Canvas Store (AC: #2, #3)
  - [ ] Create `web/src/stores/canvas-store.ts`
  - [ ] Define state: `zoom`, `viewport`, `selectedBlockIds`, `canUndo`, `canRedo`, `historyStack` (array of change snapshots)
  - [ ] **IMPORTANT:** Do NOT store `nodes`/`edges` in Zustand — React Flow manages these internally via `useNodesState()`/`useEdgesState()` hooks. The Zustand store manages app-level canvas metadata (selection, viewport, undo/redo history).
  - [ ] Use Zustand v5.0.12 with Immer middleware per architecture
  - [ ] Define actions: `setZoom`, `setViewport`, `setSelectedBlockIds`, `pushHistory` (called via `onNodesChange`/`onEdgesChange`), `undo` (restores previous snapshot from history stack), `redo`
  - [ ] Use `status` enum pattern: `"idle" | "loading" | "success" | "error"`
  - [ ] Export typed hooks: `useCanvasStore`
  - [ ] Create `web/src/types/canvas-types.ts` with TypeScript types for `CanvasNode`, `CanvasEdge`, `BlockType`, `CanvasStatus`, `CanvasViewport`, `CanvasState`, `HistoryEntry`
  - [ ] Create `web/src/lib/validation/canvas.ts` with Zod schemas for node/edge/position validation

- [ ] Task 9: Testing & Quality Assurance
  - [ ] Write unit test for CanvasToolbar component rendering
  - [ ] Write unit test for CanvasEmptyState component rendering
  - [ ] Write unit test for empty state display (conditional on nodes array)
  - [ ] Write unit test for LogicBlockCanvas mount (mock React Flow internals)
  - [ ] Write unit test for useCanvasKeyboard hook
  - [ ] Write unit test for canvas store (addNode, removeNode, undo, redo)
  - [ ] Verify build: `npm run build` succeeds without errors
  - [ ] Verify dev server: `npm run dev` starts and page renders
  - [ ] Test keyboard navigation: Tab through controls, verify focus indicators
  - [ ] Test zoom/pan on the canvas surface
  - [ ] Verify dark grid background renders correctly
  - [ ] Verify responsive layout at 1024px+ (desktop), 768-1023px (tablet), <768px (mobile)

## Runnable Code Location

All runnable code MUST be created in the `web/` subfolder at the project root, NOT in the root directory.

- Project root for code: `web/`
- Example: `web/src/components/canvas/`, `web/src/stores/`, `web/src/app/(app)/challenge/`

## Dev Notes

### Architecture Patterns & Constraints

- **Canvas Technology:** React Flow (`@xyflow/react`) v12.10.2 — purpose-built for node-based visual editors with built-in drag, connect, snap, zoom, pan, and MiniMap. [Source: architecture.md#Core Architectural Decisions]
- **State Management:** Zustand v5.0.12 with Immer middleware for canvas state (`useCanvasStore`). React Flow's built-in state handles node/edge internals; Zustand manages app-level canvas metadata (selected blocks, undo/redo stack). [Source: architecture.md#State Management]
- **Layer Model:** React Flow provides the base canvas. Custom layers we build on top: custom node types per block category, custom edge types for data flow vs control flow, block validation engine, snap physics, and execution visualization. [Source: architecture.md#Canvas Technology]
- **Code Location:** ALL code in `web/` subfolder. Import alias `@/*` → `./src/*`. [Source: 1-1-initialize-project-repository-starter-template.md#Runnable Code Location]
- **Component Organization:** Canvas components in `src/components/canvas/` directory. Each component is PascalCase. [Source: architecture.md#Code Naming Conventions]
- **Loading State Pattern:** Use `status: "idle" | "loading" | "success" | "error"` — NOT boolean flags. [Source: architecture.md#State Update Patterns]
- **TypeScript:** Strict mode enabled. All props must be typed. Use `PascalCase` for types/interfaces. [Source: architecture.md#Pattern Examples]

### CRITICAL Anti-Patterns to AVOID

1. **DO NOT** put components outside `web/src/components/canvas/` — they must follow the architecture directory structure
2. **DO NOT** use boolean loading flags (`isLoading`, `hasError`) — use the `status` enum pattern
3. **DO NOT** throw errors in React components — use error boundaries and `status: "error"`
4. **DO NOT** forget `"use client"` directive — React Flow requires browser APIs (DOM, events)
5. **DO NOT** create a custom canvas library — React Flow already handles zoom, pan, snap, drag
6. **DO NOT** colocate canvas state with React Flow's internals — use Zustand for app-level state
7. **DO NOT** skip responsive layout — canvas page must degrade gracefully on tablet/mobile
8. **DO NOT** ignore accessibility — keyboard navigation and ARIA labels are required per WCAG 2.1 AA

### Project Structure Notes

Expected structure after this story:

```
web/src/
├── app/
│   └── (app)/
│       └── challenge/
│           └── [id]/
│               └── page.tsx               # Challenge page with 3-panel layout
├── components/
│   └── canvas/
│       ├── LogicBlockCanvas.tsx           # Main canvas wrapper (React Flow provider)
│       ├── CanvasToolbar.tsx              # Zoom, undo/redo controls
│       └── CanvasEmptyState.tsx           # Empty state display
├── stores/
│   └── canvas-store.ts                    # Zustand canvas state store
├── hooks/
│   └── use-canvas-keyboard.ts             # Keyboard shortcut handler
├── types/
│   └── canvas-types.ts                    # Canvas TypeScript types
└── lib/
    └── validation/
        └── canvas.ts                      # Canvas validation schemas (Zod)
```

### Previous Story Intelligence

**From Story 1.1 (Project Setup):**
- Project at `web/` uses Next.js 15 + React 19 + TypeScript strict mode + Tailwind CSS 4 + shadcn/ui
- Import alias `@/*` → `./src/*`
- Design tokens defined as CSS custom properties in `src/app/globals.css`
- shadcn/ui components available in `src/components/ui/` (button, card, dialog, tooltip, badge, skeleton)

**From Story 1.2 (Database Setup):**
- Code follows `web/` subfolder convention
- Drizzle ORM and Docker compose established
- Domain schemas follow `snake_case` for DB, `camelCase` for client-facing JSON

**From Story 1.4 (Auth Login):**
- Middleware pattern at `src/middleware.ts` for route protection
- Better Auth session management via HTTP-only cookies
- Protected routes use `(app)` route group

**Key Learnings:**
- All new pages go in `web/src/app/(app)/` for authenticated routes
- All new components go in `web/src/components/{domain}/` by feature
- Zustand stores go in `web/src/stores/` with `use{Name}Store` naming
- Design tokens (indigo, emerald, rose, amber, violet, slate) already in `globals.css`
- shadcn/ui Button variants: `default` (indigo filled), `secondary`, `ghost`, `destructive`

### Git Intelligence

- No existing canvas or React Flow code in the repository
- Project is greenfield — no prior canvas implementation to extend
- Recent commits are BMAD infrastructure only — no web/ directory created yet
- This story is the first to introduce the canvas domain

### Latest Technical Information

- **React Flow v12.10.2:** Latest stable. Key APIs:
  - `nodeTypes` and `edgeTypes` props for custom node/edge components
  - `<Background>` for grid patterns with `variant="dots"` compatible with dark mode
  - `<Controls>` for zoom/pan/fit-view controls
  - `<Panel>` for positioning toolbar overlays on the canvas
  - `snapToGrid={true}` + `snapGrid={[16, 16]}` for block snapping
  - `fitView` for initial auto-zoom to fit content
  - `colorMode="dark"` to match the logiq dark-mode-first design
  - `deleteKeyCode="Delete"` for keyboard-based node deletion
  - `useNodesState()` and `useEdgesState()` hooks for controlled state
  - `ariaLabelConfig` prop for customizable accessibility labels (v12 feature)
  - Drag-and-drop from external sources: `onDragOver` + `onDrop` callbacks (Story 2.2)
  - Connection validation: `isValidConnection` prop callback (Story 2.3)
  - Undo/Redo: `onNodesChange`/`onEdgesChange` with history stack management

- **Zustand v5.0.12:** Create stores with `create<T>()(immer((set) => ({...})))`. Use flat state shapes. Avoid nested objects for performance.

- **Next.js 15:** App Router with client components. `"use client"` required for components using browser APIs, event handlers, or state. Challenge page at `src/app/(app)/challenge/[id]/page.tsx` uses `params: Promise<{ id: string }>` in Next.js 15.

### Testing Standards

- **Unit Testing Framework:** Vitest + @testing-library/react
- **Store Testing:** Test Zustand stores directly — create store, call actions, assert state
- **Hook Testing:** `renderHook` from @testing-library/react
- **Component Testing:** Render with providers, assert elements, test user interactions
- **Canvas Testing:** React Flow components can be tricky to test — mock `@xyflow/react` where needed, or use React Flow's test utilities
- **Keyboard Testing:** `userEvent.keyboard()` for testing keyboard shortcuts
- **Accessibility Testing:** axe-core for automated WCAG checks
- **File Pattern:** `*.test.ts` and `*.test.tsx` co-located with source files

### Design Token Reference

```
Primary:    Indigo  #6366F1  → Primary actions, active states
Success:    Emerald #10B981  → Passing test cases (future)
Error:      Rose    #F43F5E  → Failed test cases (future)
Warning:    Amber   #F59E0B  → Edge case warnings (future)
Info:       Sky     #0EA5E9  → Information panels
Insight:    Violet  #8B5CF6  → Insight moments (future)
Background: Slate   #0F172A  → Canvas surface, dark backgrounds
Background: Slate   #1E293B  → Grid lines, card surfaces
Text:       Slate   #F8FAFC  → Primary text (light on dark)
Text:       Slate   #94A3B8  → Secondary text, labels
```

### Security Requirements

- Canvas page `/challenge/[id]` must be behind auth middleware (route group `(app)` handles this)
- No sensitive data in client-side canvas state — all user data via Server Actions
- Empty challenge page should not leak challenge data to unauthenticated users

### References

- [Source: architecture.md#Core Architectural Decisions] - React Flow v12.10.2, Zustand v5.0.12
- [Source: architecture.md#Canvas Technology] - Custom layers on top of React Flow
- [Source: architecture.md#State Management] - Zustand store design and Immer middleware
- [Source: architecture.md#Structure Patterns] - Project directory structure
- [Source: architecture.md#Naming Patterns] - Component/hook/store naming conventions
- [Source: architecture.md#Implementation Patterns] - Status enum, error handling, validation
- [Source: architecture.md#Project Structure] - Complete directory tree
- [Source: ux-design-specification.md#UX-DR1] - Design Token System (color palette)
- [Source: ux-design-specification.md#UX-DR3] - Spacing & Layout (3-panel, 280px/auto/300px)
- [Source: ux-design-specification.md#UX-DR6] - Logic Block Canvas design
- [Source: ux-design-specification.md#UX-DR13] - Accessibility standards (ARIA, keyboard, focus indicators)
- [Source: ux-design-specification.md#UX-DR14] - Empty States ("Drag blocks here to build your logic")
- [Source: ux-design-specification.md#UX-DR15] - Loading States (skeleton blocks)
- [Source: ux-design-specification.md#UX-DR17] - Desktop Features (keyboard shortcuts T=Test, R=Reset)
- [Source: ux-design-specification.md#UX-DR12] - Responsive Design (desktop 3-panel, mobile tabs)
- [Source: epics.md#Story 2.1] - Original story definition and acceptance criteria
- [Source: epics.md#FR1] - Functional Requirement: Drag and connect logic blocks
- [Source: 1-1-initialize-project-repository-starter-template.md] - Project foundation patterns

### Hard Dependencies (Must Be Completed First)

1. **Epic 1 (Stories 1.1-1.7):** The `web/` directory does NOT exist yet. Story 1.1 must scaffold the Next.js project, and Stories 1.2-1.7 must set up the database, auth, and middleware before the canvas page can be served behind authentication. At minimum, Story 1.1 (`create-next-app` + shadcn/ui init) must be completed so the `web/` directory, package.json, Tailwind CSS 4, `src/` structure, and `(app)` route group layout exist.
2. **Story 1.4 (Auth Middleware):** The challenge page at `(app)/challenge/[id]` relies on the `(app)` route group's auth middleware for route protection. A minimal `(app)/layout.tsx` must exist.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
