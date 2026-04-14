---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '/home/l2e/smirk/logiq/_bmad-output/planning-artifacts/prd.md'
  - '/home/l2e/smirk/logiq/_bmad-output/planning-artifacts/ux-design-specification.md'
  - '/home/l2e/smirk/logiq/_bmad-output/brainstorming/brainstorming-session-2026-04-13-001.md'
  - '/home/l2e/smirk/logiq/_bmad-output/brainstorming/brainstorming-session-transcript-2026-04-13.md'
  - '/home/l2e/smirk/logiq/docs/ideas.md'
workflowType: 'architecture'
project_name: 'logiq'
user_name: '0x01'
date: '2026-04-14'
lastStep: 8
status: 'complete'
completedAt: '2026-04-14'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
51+ functional requirements across 8 domains: Challenge Interaction (logic block canvas, test execution, edge case handling, iteration), Learning Progression (skill map, sequential unlocking, variants, checkpoint gating, bottleneck detection), Reasoning Evaluation (4-dimensional scoring, visible rubrics, dimension-specific feedback), Visual Learning (11 visual metaphors, step-through algorithm visualization, prediction gates), Gamification (insight streaks, aha! moment tracking, explain-your-thinking gate), Post-Solve/Community (solution sharing, challenge design mode, friend activity feeds), Progress Tracking (growth visualization, skill mastery mapping), and Account/Community Management.

Architecturally, this translates to: a visual canvas frontend, a scoring/progression backend engine, a content management system for challenges and variants, a real-time collaboration layer (optional), and analytics for reasoning pattern tracking.

**Non-Functional Requirements:**
- **Performance:** Canvas interactions <100ms response; algorithm visualizations at 60fps; smooth step-through execution.
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions); iPad Safari; graceful degradation on lower-end devices.
- **Accessibility:** WCAG 2.1 AA compliance.
- **Data Privacy:** User learning data and behavioral analytics handled responsibly; transparent data practices.
- **Offline Support:** Local storage for draft challenge work; server-synced progress for account continuity.

These NFRs drive architectural decisions: frontend rendering strategy, state management approach, data sync patterns, and browser compatibility requirements.

**Scale & Complexity:**

- Primary domain: Full-stack web application (complex frontend canvas + backend scoring/progression engines)
- Complexity level: High
- Estimated architectural components: 8-12 major components

### Technical Constraints & Dependencies

- **Canvas Technology:** HTML5 Canvas or SVG for drag-and-drop logic blocks; WebGL for complex algorithm visualizations.
- **Design System:** Tailwind CSS + shadcn/ui for base components; extensive custom components required.
- **Scoring Engine:** Must produce scores correlating >0.7 with expert developer judgment — requires algorithmic design and validation pipeline.
- **Real-Time Collaboration (Phase 2+):** WebSocket-based synchronization with conflict resolution for simultaneous edits.
- **Content Delivery:** Progressive challenge/variant delivery with gated access based on completion criteria.
- **Visual Metaphors:** 11 unique animated representations — custom engineering effort, not off-the-shelf.

### Cross-Cutting Concerns Identified

1. **State Management:** Complex user state (progress, scores, insight moments, variant history) must be locally cached and server-synced.
2. **Performance Budget:** Core interaction loop (drag → connect → test → feedback) must feel instant — drives rendering and data architecture choices.
3. **Content Pipeline:** Challenges, variants, visual metaphors, and scoring rubrics require a structured content management approach.
4. **Scoring Validation:** The reasoning scoring engine requires continuous validation against expert judgment — architecture must support A/B testing and calibration.
5. **Accessibility + Canvas:** WCAG AA compliance for a canvas-based interaction is non-trivial — requires keyboard alternatives and screen reader support for visual logic blocks.
6. **Progressive Enhancement:** Core canvas degrades gracefully on lower-end devices; mobile responsive for non-canvas features (account management, community).
7. **Data Privacy:** Learning behavioral data tracking requires responsible handling and user transparency.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (Next.js frontend + API backend) based on project requirements: complex visual canvas interactions, reasoning scoring engine, progressive content delivery, and optional real-time collaboration.

### Starter Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **create-next-app (official)** | Clean slate, full control, App Router, TypeScript, well-documented | Requires manual setup of Tailwind, shadcn/ui, linting |
| **Next.js 15 + Shadcn Starter** | Pre-configured Tailwind 4, shadcn/ui, ESLint, Prettier, Docker | Adds auth/payments/DB layers not needed for MVP |
| **T3 Stack (create-t3-app)** | Type-safe full-stack with tRPC, Prisma, Tailwind | Overkill for MVP; tRPC coupling limits backend language choice |

### Selected Approach: create-next-app + Manual shadcn/ui Integration

**Rationale for Selection:**
The UX specification already committed to Tailwind CSS + shadcn/ui for the design system. Logiq's architecture is dominated by custom components (Logic Block Canvas, 11 visual metaphors, reasoning score dashboard, skill map) rather than standard CRUD UI. A minimal, well-configured foundation gives us the right base without unnecessary abstractions. We'll add Tailwind and shadcn/ui explicitly, keeping full control over the canvas architecture.

**Initialization Command:**

```bash
npx create-next-app@latest logiq-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd logiq-web
npx shadcn@latest init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript strict mode — type safety across all components
- Next.js 15 App Router — file-based routing, server/client component separation
- React 19 — latest concurrent rendering features

**Styling Solution:**
- Tailwind CSS 4 — utility-first styling, design token system
- shadcn/ui — accessible base components (buttons, dialogs, cards, tooltips) added via CLI
- CSS custom properties for design tokens — enables theming

**Build Tooling:**
- Next.js built-in bundling (Webpack/Turbopack) — automatic optimization, code splitting
- ESLint — code quality enforcement
- Import alias `@/*` — clean module resolution

**Testing Framework:**
- To be added in architectural decisions (Vitest + Testing Library recommended for unit; Playwright for E2E)

**Code Organization:**
- `src/` directory structure — separation of app logic from components
- App Router conventions — route-based code organization
- Client/Server component boundaries — explicit `use client` directives

**Development Experience:**
- Hot Module Replacement (HMR) — instant feedback during development
- TypeScript incremental compilation — fast type checking
- ESLint integration — real-time code quality feedback

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Frontend framework: Next.js 15 + TypeScript + React 19 (starter)
- State management: Zustand v5
- Canvas technology: React Flow (@xyflow/react) v12
- Database: PostgreSQL + Drizzle ORM v0.45
- Backend API: Next.js Server Actions + API Routes
- Authentication: Better Auth v1.4+
- Deployment: Vercel + managed PostgreSQL (Neon/Supabase)

**Important Decisions (Shape Architecture):**
- Testing: Vitest + Testing Library (unit), Playwright (E2E) — TBD in implementation patterns
- Animation: Framer Motion for UI transitions; custom Canvas/WebGL for algorithm visualizations
- Content management: JSON/MDX-based challenge definitions with server-side validation
- Real-time collaboration (Phase 2+): WebSocket via Supabase Realtime or custom WebSocket server

**Deferred Decisions (Post-MVP):**
- CDN strategy for static assets (Vercel default sufficient for MVP)
- Multi-region database replication
- Advanced monitoring/observability (Vercel Analytics + basic logging for MVP)
- Code export pipeline (visual logic → programming language code)

### Data Architecture

**Database: PostgreSQL + Drizzle ORM (v0.45.2)**

Decision: Relational PostgreSQL with Drizzle ORM for type-safe, lightweight data access.

Rationale: Logiq's data model is highly relational — users have progress records, progress links to challenges, challenges have variants and solutions, users have friend relationships. PostgreSQL provides ACID guarantees for scoring integrity. Drizzle ORM is lightweight (~1/10th the runtime of Prisma), fully type-safe with TypeScript, and has excellent Next.js App Router support.

Schema domains:
- `users` — Authentication profile, display name, settings
- `user_progress` — Challenge completions, reasoning scores, insight moments, streaks
- `challenges` — Challenge definitions, descriptions, block vocabulary, test cases, variants
- `solutions` — User-submitted logic block configurations (JSON), reasoning explanation text
- `skill_clusters` — Skill map topology, prerequisite relationships, unlock criteria
- `friend_relationships` — User-to-user friend graph
- `community_challenges` — User-created challenges, moderation status

Migration: Drizzle Kit for schema migrations — type-safe, versioned, rollback support.

Caching: Next.js data cache (`revalidateTag`) for static challenge content. No Redis for MVP — PostgreSQL read performance is sufficient for anticipated load.

### Authentication & Security

**Authentication: Better Auth (v1.4+)**

Decision: Self-hosted, framework-agnostic authentication with Better Auth.

Rationale: Better Auth is designed for the modern TypeScript stack, supports email/password + OAuth providers out of the box, and integrates directly with our PostgreSQL database via Drizzle. It's lighter than NextAuth.js and avoids vendor lock-in (unlike Clerk). The team has flagged and patched a security vulnerability (unauthenticated API key creation) in v1.4+, so we'll use v1.4+ exclusively.

Pattern: Database session management with secure HTTP-only cookies. OAuth providers (GitHub, Google) for developer-friendly onboarding.

Authorization: Role-based access control (RBAC) with roles: `user`, `creator` (challenge design mode unlocked), `admin` (platform moderation, scoring calibration).

API Security: Server Actions enforce authorization at the function level. API Routes use middleware for rate limiting (Vercel Edge Middleware, 100 req/min per user for challenge submissions).

### API & Communication Patterns

**Backend API: Next.js Server Actions + API Routes**

Decision: Keep everything in Next.js — Server Actions for mutations, API Routes for external integrations.

Rationale: MVP simplicity. One codebase, one deployment. Server Actions handle user mutations (submit solution, save progress, update settings) with built-in CSRF protection and type safety. API Routes handle webhook integrations, external scoring validation, and future AI-powered features.

API Design Standards:
- Server Actions: Zod-validated inputs, typed return values, error objects (not throws)
- API Routes: RESTful conventions, JSON responses, standardized error format `{ error: string, details?: unknown }`
- Rate limiting: Vercel Edge Middleware with IP-based + user-based throttling
- Error handling: Global error boundary in Next.js App Router, structured logging with `console.error` + Vercel Log Drain

### Frontend Architecture

**State Management: Zustand (v5.0.12)**

Decision: Zustand for global application state + local React state for canvas-specific interactions.

Rationale: Zustand is ~3KB gzipped, has zero boilerplate, and excellent TypeScript support. Logiq's global state (user progress, navigation, scoring display, settings) fits perfectly into 3-4 stores. The canvas interaction state (block positions, connection state, drag state) is highly localized and transient — better managed with React `useState`/`useReducer` + React Flow's built-in state.

Store design:
- `useUserStore` — User profile, authentication state, settings
- `useProgressStore` — Challenge completions, reasoning scores, insight streaks
- `useChallengeStore` — Current challenge state, variant history, attempt count
- `useCanvasStore` — Canvas zoom level, block palette, selected blocks (non-persistent)

**Canvas Technology: React Flow (@xyflow/react v12.10.2)**

Decision: React Flow for the Logic Block Canvas — node-based visual editor with drag, connect, snap, zoom, pan.

Rationale: React Flow is purpose-built for this exact interaction pattern. It handles the hard problems out of the box:
- Node dragging with snap-to-grid
- Connection validation (custom edge types for block logic flow)
- Zoom and pan (essential for complex logic flows)
- MiniMap (for large canvases)
- Selection and multi-select
- Undo/redo hooks

Custom layers we build on top:
- Custom node types for each block category (loops, conditions, comparisons, edge case handlers)
- Custom edge types for data flow vs control flow connections
- Block validation engine (incompatible block combinations rejected)
- Snap physics and connection feedback
- Execution visualization (step-through with color-coded paths)

**Animation: Framer Motion (UI) + Custom Canvas (algorithm visualization)**

Decision: Framer Motion for UI transitions (page transitions, modal animations, score reveals); custom Canvas 2D/WebGL for algorithm step-through visualizations.

Rationale: Framer Motion is the standard for React UI animations — smooth, declarative, gesture-driven. Algorithm visualizations (array sorting, tree traversal, pathfinding) need frame-by-frame control at 60fps — custom Canvas rendering gives us that precision.

**Routing Strategy:** Next.js App Router with route groups:
- `(app)/` — Authenticated application routes (canvas, skill map, dashboard)
- `(auth)/` — Login, register, password reset
- `(public)/` — Landing page, community challenges (public view)
- `(admin)/` — Admin dashboard, scoring calibration, content review

### Infrastructure & Deployment

**Hosting: Vercel + Managed PostgreSQL (Neon or Supabase)**

Decision: Vercel for Next.js deployment; Neon or Supabase for managed PostgreSQL.

Rationale: Vercel is built by the Next.js team — zero-config deployments, automatic preview branches for every PR, edge functions for rate limiting, built-in HTTPS, and optimal React rendering. Pairing with a managed PostgreSQL provider gives us backups, connection pooling, and zero-maintenance database.

Environment Configuration:
- `development` — Local with `docker compose` PostgreSQL or local `pg`
- `preview` — Vercel preview deployment with isolated database branch
- `production` — Vercel production with primary PostgreSQL instance

Monitoring (MVP):
- Vercel Analytics for page load, Web Vitals, function duration
- Vercel Logs for error tracking
- Sentry (optional add-on) for client-side error tracking

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (`create-next-app` + shadcn/ui) — foundation
2. Database schema design + Drizzle setup — data layer
3. Authentication setup (Better Auth + database tables) — security
4. Zustand stores — state management
5. React Flow canvas prototype — core interaction
6. Challenge content pipeline — content layer
7. Reasoning scoring engine — scoring layer
8. Skill map UI + progression logic — navigation
9. Failure visualization engine — feedback layer
10. Post-solve solution sharing — community layer

**Cross-Component Dependencies:**
- React Flow canvas depends on Zustand stores (canvas state) and challenge data (block vocabulary, test cases)
- Reasoning scoring engine depends on canvas interaction events (block placements, revisions) and user progress data
- Better Auth provides session context to all Server Actions — every mutation is auth-guarded
- Drizzle schema drives both Server Action validation (Zod schemas generated from schema) and database migrations
- Skill map progression depends on user progress data and challenge unlock criteria
- Failure visualization depends on the execution engine that runs logic block configurations against test cases

**Risk Mitigation:**
- Canvas complexity is the highest technical risk — build a working prototype of one challenge (linear search) before committing to the full block vocabulary
- Scoring engine accuracy (>0.7 expert correlation) requires iterative calibration — architecture must support easy score algorithm swapping and A/B testing
- React Flow may not support all custom block interaction needs — have React Konva as fallback option

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

14 potential conflict areas identified where AI agents could make incompatible choices without established patterns.

### Naming Patterns

**Database Naming Conventions:**

- **Table names:** `snake_case` plural — `users`, `user_progress`, `skill_clusters`
- **Column names:** `snake_case` — `user_id`, `created_at`, `is_active`
- **Foreign keys:** `{table}_id` format — `user_id`, `challenge_id`, `cluster_id`
- **Junction tables:** alphabetical order — `friend_relationships` (not `relationships_friends`)
- **Index names:** `idx_{table}_{column}` — `idx_users_email`, `idx_user_progress_user_id`
- **Enum values:** `snake_case` — `pending`, `completed`, `in_progress`

**API Naming Conventions:**

- **REST endpoints:** plural `snake_case` — `/api/challenges`, `/api/user-progress`
- **Route parameters:** `:id` format — `/api/challenges/:id`
- **Query parameters:** `snake_case` — `?user_id=`, `?cluster_id=`
- **Server Actions:** camelCase verb-noun — `submitSolution()`, `getUserProgress()`, `unlockNextChallenge()`
- **JSON response fields:** `camelCase` for client-facing data (transformed from `snake_case` DB via Drizzle select maps)

**Code Naming Conventions:**

- **Components:** `PascalCase` — `LogicBlockCanvas.tsx`, `ReasoningScore.tsx`, `SkillMap.tsx`
- **Hooks:** `use` prefix + camelCase — `useCanvasInteraction()`, `useProgression()`
- **Zustand stores:** `use` + `{Domain}` + `Store` — `useUserStore`, `useProgressStore`
- **Utility functions:** camelCase — `calculateReasoningScore()`, `validateBlockConnection()`
- **Types/Interfaces:** `PascalCase` — `Challenge`, `UserProgress`, `ReasoningScoreDimensions`
- **Type files:** kebab-case — `challenge-types.ts`, `scoring-types.ts`
- **Constants:** `UPPER_SNAKE_CASE` — `MAX_ATTEMPTS`, `HINT_UNLOCK_THRESHOLD`

### Structure Patterns

**Project Organization:**

```
src/
├── app/                          # Next.js App Router routes
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/                    # Authenticated app routes
│   │   ├── challenge/[id]/page.tsx
│   │   ├── skill-map/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Landing
│   │   └── community/page.tsx
│   ├── (admin)/                  # Admin routes
│   │   └── dashboard/page.tsx
│   ├── api/                      # API routes
│   │   └── webhooks/             # External webhooks
│   └── layout.tsx                # Root layout
├── lib/                          # Shared library code
│   ├── db/                       # Database layer
│   │   ├── schema.ts             # Drizzle schema definitions
│   │   ├── schema/               # Sharded schema files (if split)
│   │   │   ├── users.ts
│   │   │   ├── challenges.ts
│   │   │   └── progress.ts
│   │   ├── queries/              # Reusable query functions
│   │   └── migrations/           # Drizzle migrations
│   ├── auth/                     # Better Auth configuration
│   │   ├── auth.ts               # Auth instance
│   │   └── guards.ts             # Authorization guards
│   ├── scoring/                  # Reasoning scoring engine
│   │   ├── engine.ts             # Core scoring algorithm
│   │   ├── dimensions.ts         # Scoring dimension definitions
│   │   └── calibration.ts        # A/B testing and calibration
│   └── validation/               # Zod schemas
│       ├── challenge.ts
│       ├── solution.ts
│       └── progress.ts
├── actions/                      # Server Actions
│   ├── challenge-actions.ts
│   ├── progress-actions.ts
│   └── user-actions.ts
├── components/                   # React components
│   ├── canvas/                   # Canvas-specific components
│   │   ├── LogicBlockCanvas.tsx
│   │   ├── LogicBlockNode.tsx
│   │   ├── BlockConnection.tsx
│   │   └── BlockPalette.tsx
│   ├── scoring/                  # Scoring UI components
│   │   ├── ReasoningScore.tsx
│   │   ├── ScoreBreakdown.tsx
│   │   └── ScoreFeedback.tsx
│   ├── progression/              # Skill map and progression
│   │   ├── SkillMap.tsx
│   │   ├── SkillNode.tsx
│   │   └── CheckpointCard.tsx
│   ├── visualization/            # Algorithm visualizations
│   │   ├── ArrayVisualizer.tsx
│   │   ├── TreeVisualizer.tsx
│   │   └── MetaphorDisplay.tsx
│   ├── gamification/             # Gamification UI
│   │   ├── InsightStreak.tsx
│   │   ├── AhaMomentTracker.tsx
│   │   └── ProgressBadge.tsx
│   └── ui/                       # shadcn/ui base components
│       ├── button.tsx
│       ├── card.tsx
│       └── dialog.tsx
├── stores/                       # Zustand stores
│   ├── user-store.ts
│   ├── progress-store.ts
│   ├── challenge-store.ts
│   └── canvas-store.ts
├── hooks/                        # Custom React hooks
│   ├── use-canvas-interaction.ts
│   ├── use-scoring-feedback.ts
│   └── use-challenge-variant.ts
├── types/                        # Shared TypeScript types
│   ├── challenge-types.ts
│   ├── scoring-types.ts
│   └── canvas-types.ts
├── config/                       # Configuration
│   ├── app.ts                    # App configuration
│   └── constants.ts              # Shared constants
└── utils/                        # Utility functions
    ├── formatting.ts
    ├── validation.ts
    └── analytics.ts
```

**Component Organization:** By feature domain (canvas, scoring, progression, visualization, gamification). Each domain folder contains all components related to that feature. shadcn/ui base components live in `components/ui/`.

**Tests:** Co-located with source files using `*.test.ts` / `*.test.tsx` naming. E2E tests in `e2e/` directory at project root.

**Server Actions:** Separate `/actions` directory — not colocated in components. Each action file corresponds to a domain (challenge, progress, user). This keeps server logic auditable and testable independently.

**Drizzle Schema:** Split by domain in `lib/db/schema/` — `users.ts`, `challenges.ts`, `progress.ts`. Re-exported from `lib/db/schema.ts` barrel file.

### Format Patterns

**API Response Formats:**

- **Success:** `{ success: true, data: <T> }`
- **Error:** `{ success: false, error: { code: string, message: string, details?: unknown } }`
- **Server Actions return:** Zod-validated typed objects — never raw `any`
- **HTTP status codes:** 200 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 429 (rate limited), 500 (server error)

**Data Exchange Formats:**

- **JSON fields (client-facing):** `camelCase` — transformed from DB `snake_case` via Drizzle select maps
- **Dates:** ISO 8601 strings (`"2026-04-14T10:30:00Z"`) — never epoch timestamps in API responses
- **Booleans:** `true`/`false` — never `1`/`0`
- **Null handling:** `null` for absent values, never `undefined` in serialized data
- **Arrays:** Always arrays for collections — never objects with numeric keys
- **Reasoning scores:** `{ problemBreakdown: number, edgeCaseProactivity: number, structureEfficiency: number, iterationImprovement: number, overall: number }` — all 0-100 scale

**Logic Block Serialization:**

- Block configurations stored as JSON: `{ id: string, type: BlockType, position: { x, y }, connections: { output: string[], input: string[] }, config: Record<string, unknown> }`
- Block types: enum — `"loop" | "condition" | "comparison" | "assignment" | "return" | "edgeCase" | "variable"`

### Communication Patterns

**Server Action Naming:**

- **Mutations:** verb-noun, imperative — `submitSolution()`, `saveProgress()`, `unlockChallenge()`
- **Queries:** get/fetch/list prefix — `getChallenge()`, `getUserProgress()`, `listVariants()`
- **All Server Actions:** must have Zod input validation, typed return, and return `{ success, data/error }` shape

**State Update Patterns:**

- **Zustand stores:** Immer middleware for nested state — `set((state) => { state.current.score = 85 })`
- **State shape:** flat preferred over nested — `{ scores: { problemBreakdown: 80 } }` not `{ scores: { dimensions: [{ name: 'problemBreakdown', value: 80 }] } }`
- **Loading states:** `status: 'idle' | 'loading' | 'success' | 'error'` — not separate boolean flags
- **Optimistic updates:** Use Zustand + Server Action rollback on failure for canvas interactions

**Event Patterns (Phase 2+ Real-Time):**

- **Event naming:** `{domain}.{action}` — `challenge.submitted`, `progress.updated`, `friend.requested`
- **Event payloads:** always include `{ eventId: string, timestamp: string, actorId: string, data: <T> }`
- **Event versioning:** `v1` prefix in payload — `v1.challenge.submitted`

### Process Patterns

**Error Handling:**

- **Server Actions:** Return error objects, never throw — `{ success: false, error: { code: 'CHALLENGE_NOT_FOUND', message: '...' } }`
- **Client-side:** Try/catch around Server Action calls, display user-friendly messages via toast
- **Error codes:** Domain-prefixed uppercase snake_case — `SCORING_CALCULATION_ERROR`, `BLOCK_INVALID_CONNECTION`
- **Error boundaries:** React Error Boundary wrapping each major feature section (canvas, scoring, skill map)
- **Logging:** `console.error` for server errors (captured by Vercel Log Drain); structured format `{ level, message, context, userId? }`

**Loading States:**

- **Canvas:** No loading state for block interactions (instant). Show skeleton only for initial challenge data fetch.
- **Scoring:** Show "Calculating..." animation during score computation (<200ms target).
- **Navigation:** Next.js built-in loading states for route transitions.
- **Global loading:** Single loading context in `useUserStore` for app-wide loading indicator.

**Validation:**

- **Boundary:** Zod validation at Server Action entry point — all inputs validated before execution
- **Client-side:** React Hook Form + Zod for form inputs; block connection validation in React Flow custom validators
- **Shared:** Zod schemas defined in `lib/validation/` imported by both client and server

**Authentication Flow:**

- **Protected routes:** Middleware checks session → redirects to `/login` if unauthenticated
- **Server Actions:** Session check via `getServerSession()` at start of each action
- **Role checks:** `requireRole('admin')` guard in admin Server Actions

### Enforcement Guidelines

**All AI Agents MUST:**

- Follow naming conventions exactly as specified above
- Place files in the correct directory structure
- Use the `{ success, data/error }` response pattern for all Server Actions
- Validate all Server Action inputs with Zod schemas from `lib/validation/`
- Use `status` enum for loading states, not boolean flags
- Store dates as ISO 8601 strings
- Use `camelCase` for client-facing JSON, `snake_case` for database
- Co-locate tests with source files using `*.test.ts` naming

**Pattern Enforcement:**

- ESLint rules enforce naming conventions (`@typescript-eslint/naming-convention`)
- Import order enforced via `eslint-plugin-import` and `prettier-plugin-sort-imports`
- Code review checklist includes pattern compliance verification
- Pattern violations documented in PR comments with reference to this document

### Pattern Examples

**Good — Server Action:**
```typescript
// actions/challenge-actions.ts
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth";
import { submitSolutionSchema } from "@/lib/validation/solution";

export async function submitSolution(input: z.infer<typeof submitSolutionSchema>) {
  const session = await getServerSession();
  if (!session) return { success: false, error: { code: "UNAUTHORIZED", message: "..." } };

  const validated = submitSolutionSchema.parse(input);
  // ... execute logic
  return { success: true, data: { scoreId: "abc123", scores: { ... } } };
}
```

**Good — Zustand store:**
```typescript
// stores/progress-store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ProgressStatus = "idle" | "loading" | "success" | "error";

interface ProgressState {
  status: ProgressStatus;
  currentChallenge: Challenge | null;
  scores: ReasoningScores | null;
  setCurrentChallenge: (challenge: Challenge) => void;
  setScores: (scores: ReasoningScores) => void;
}

export const useProgressStore = create<ProgressState>()(
  immer((set) => ({
    status: "idle",
    currentChallenge: null,
    scores: null,
    setCurrentChallenge: (challenge) => set((state) => {
      state.currentChallenge = challenge;
      state.status = "success";
    }),
    setScores: (scores) => set((state) => { state.scores = scores; }),
  }))
);
```

**Anti-Pattern — Throwing from Server Action:**
```typescript
// BAD
export async function submitSolution(input: unknown) {
  const validated = schema.parse(input);
  const result = await db.insert(...);
  if (!result) throw new Error("Failed");  // DON'T throw
  return result;
}
```

**Anti-Pattern — Boolean loading flags:**
```typescript
// BAD
interface State {
  isLoading: boolean;
  hasError: boolean;
  isLoaded: boolean;  // DON'T use multiple booleans
}

// GOOD
interface State {
  status: "idle" | "loading" | "success" | "error";  // Single source of truth
}
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
logiq-web/
├── package.json                    # Dependencies and scripts
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration + design tokens
├── tsconfig.json                   # TypeScript strict configuration
├── .env.example                    # Environment variable template
├── .env.local                      # Local environment (gitignored)
├── .eslintrc.json                  # ESLint configuration + naming convention rules
├── .prettierrc                     # Prettier configuration
├── .gitignore                      # Git ignore patterns
├── README.md                       # Project documentation
├── docker-compose.yml              # Local PostgreSQL + services
├── drizzle.config.ts               # Drizzle Kit configuration
│
├── e2e/                            # End-to-end tests (Playwright)
│   ├── challenge-interaction.spec.ts
│   ├── progression-flow.spec.ts
│   └── auth-flow.spec.ts
│
├── public/                         # Static assets (served as-is)
│   ├── favicon.ico
│   ├── og-image.png                # Open Graph image
│   └── assets/                     # Algorithm visualization assets
│       ├── metaphors/              # Visual metaphor images/SVGs
│       │   ├── array-strip.svg
│       │   ├── linked-list-clips.svg
│       │   └── ...
│       └── icons/                  # Custom icons
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # Global styles + design tokens (CSS variables)
│   │   ├── layout.tsx              # Root layout + providers (theme, auth, stores)
│   │   │
│   │   ├── (auth)/                 # Auth route group (public)
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx        # Registration page
│   │   │   ├── callback/
│   │   │   │   └── page.tsx        # OAuth callback handler
│   │   │   └── layout.tsx         # Auth layout (minimal, centered)
│   │   │
│   │   ├── (app)/                  # Authenticated app routes
│   │   │   ├── challenge/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Challenge page (canvas + scoring)
│   │   │   ├── skill-map/
│   │   │   │   └── page.tsx        # Full skill map visualization
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # User dashboard (progress, streaks, stats)
│   │   │   ├── profile/
│   │   │   │   └── page.tsx        # User profile settings
│   │   │   ├── community/
│   │   │   │   ├── page.tsx        # Community challenges browse
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Community challenge detail
│   │   │   └── layout.tsx         # App layout (nav, sidebar, footer)
│   │   │
│   │   ├── (public)/               # Public routes
│   │   │   ├── page.tsx            # Landing page
│   │   │   └── about/
│   │   │       └── page.tsx        # About/philosophy page
│   │   │
│   │   ├── (admin)/                # Admin routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Admin dashboard (scoring correlation, content review)
│   │   │   ├── challenges/
│   │   │   │   ├── page.tsx        # Challenge management list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Challenge edit/detail
│   │   │   ├── scoring/
│   │   │   │   └── page.tsx        # Scoring calibration dashboard
│   │   │   └── layout.tsx         # Admin layout
│   │   │
│   │   ├── api/                    # API routes
│   │   │   └── webhooks/
│   │   │       └── route.ts        # External webhook handlers (Stripe, etc.)
│   │   │
│   │   └── not-found.tsx           # 404 page
│   │
│   ├── actions/                    # Server Actions (domain-separated)
│   │   ├── challenge-actions.ts    # Challenge CRUD, submission, variant delivery
│   │   ├── progress-actions.ts     # Progress tracking, scoring, streaks
│   │   ├── user-actions.ts         # User profile, settings, friend management
│   │   ├── community-actions.ts    # Community challenges, solution sharing
│   │   └── admin-actions.ts        # Admin operations (guarded)
│   │
│   ├── components/                 # React components (by feature domain)
│   │   ├── canvas/                 # Logic Block Canvas components
│   │   │   ├── LogicBlockCanvas.tsx         # Main canvas wrapper (React Flow provider)
│   │   │   ├── LogicBlockNode.tsx           # Custom node for a logic block
│   │   │   ├── BlockConnection.tsx          # Custom edge/connection type
│   │   │   ├── BlockPalette.tsx             # Draggable block sidebar
│   │   │   ├── BlockValidator.tsx           # Real-time connection validator
│   │   │   ├── CanvasToolbar.tsx            # Zoom, undo/redo, minimap controls
│   │   │   └── ExecutionOverlay.tsx         # Step-through execution visualization
│   │   │
│   │   ├── scoring/                # Reasoning scoring UI
│   │   │   ├── ReasoningScore.tsx           # Score display widget
│   │   │   ├── ScoreBreakdown.tsx           # 4-dimension score breakdown
│   │   │   ├── ScoreFeedback.tsx            # Dimension-specific feedback
│   │   │   └── ScoreCalibration.tsx         # Admin scoring calibration view
│   │   │
│   │   ├── progression/            # Skill map and progression
│   │   │   ├── SkillMap.tsx               # Full skill map visualization
│   │   │   ├── SkillNode.tsx              # Individual skill/cluster node
│   │   │   ├── CheckpointCard.tsx          # Checkpoint challenge card
│   │   │   ├── UnlockAnimation.tsx         # Unlock transition animation
│   │   │   └── ProgressPath.tsx            # Progress connector lines
│   │   │
│   │   ├── visualization/          # Algorithm visualizations (11 metaphors)
│   │   │   ├── ArrayVisualizer.tsx          # Array as sliding strip
│   │   │   ├── LinkedListVisualizer.tsx     # Linked list as paper clips
│   │   │   ├── StackVisualizer.tsx          # Stack as plates
│   │   │   ├── TreeVisualizer.tsx           # Tree as organism
│   │   │   ├── GraphVisualizer.tsx          # Graph as city map
│   │   │   ├── HashMapVisualizer.tsx        # Hash map as filing cabinet
│   │   │   ├── BinarySearchVisualizer.tsx   # Binary search as book-closing
│   │   │   ├── RecursionVisualizer.tsx      # Recursion as nesting dolls
│   │   │   ├── DPVisualizer.tsx             # Dynamic programming as construction
│   │   │   ├── TwoPointersVisualizer.tsx    # Two pointers as converging scissors
│   │   │   ├── QueueVisualizer.tsx          # Queue as conveyor belt
│   │   │   └── MetaphorDisplay.tsx          # Generic metaphor display wrapper
│   │   │
│   │   ├── gamification/           # Gamification UI
│   │   │   ├── InsightStreak.tsx            # Streak counter + animation
│   │   │   ├── AhaMomentTracker.tsx         # Aha! moment celebration
│   │   │   ├── ProgressBadge.tsx            # Badge/unlock notification
│   │   │   └── VariantCard.tsx              # Variant challenge delivery card
│   │   │
│   │   ├── challenge/              # Challenge-specific UI
│   │   │   ├── ChallengeDescription.tsx     # Challenge problem statement
│   │   │   ├── ChallengeHeader.tsx          # Title, difficulty, metadata
│   │   │   ├── TestResults.tsx              # Test case pass/fail display
│   │   │   ├── HintPanel.tsx                # Gated hints display
│   │   │   ├── EdgeCaseStressTest.tsx       # Edge case test results
│   │   │   ├── PredictionGate.tsx           # "What happens next?" prompt
│   │   │   └── SolutionShare.tsx            # Post-solve alternative solutions
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── AppNav.tsx                   # Top navigation bar
│   │   │   ├── AppSidebar.tsx               # Side navigation
│   │   │   ├── AppFooter.tsx                # Footer
│   │   │   └── Providers.tsx                # Theme, auth, store providers
│   │   │
│   │   └── ui/                     # shadcn/ui base components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── tooltip.tsx
│   │       ├── toast.tsx
│   │       ├── badge.tsx
│   │       ├── progress.tsx
│   │       ├── skeleton.tsx
│   │       ├── tabs.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── separator.tsx
│   │       ├── alert.tsx
│   │       ├── label.tsx
│   │       └── input.tsx
│   │
│   ├── lib/                        # Shared library code
│   │   ├── db/                     # Database layer
│   │   │   ├── index.ts            # DB connection + Drizzle client
│   │   │   ├── schema.ts           # Barrel re-export of all schemas
│   │   │   ├── schema/             # Domain-separated schema files
│   │   │   │   ├── users.ts        # User tables
│   │   │   │   ├── challenges.ts   # Challenge + solution tables
│   │   │   │   ├── progress.ts     # Progress + scoring tables
│   │   │   │   ├── social.ts       # Friend + community tables
│   │   │   │   └── enums.ts        # Shared enum definitions
│   │   │   ├── queries/            # Reusable query functions
│   │   │   │   ├── challenge-queries.ts
│   │   │   │   ├── progress-queries.ts
│   │   │   │   └── user-queries.ts
│   │   │   └── migrations/         # Drizzle migration files
│   │   │       ├── 001_initial_schema.ts
│   │   │       └── ...
│   │   │
│   │   ├── auth/                   # Authentication
│   │   │   ├── auth.ts             # Better Auth instance configuration
│   │   │   ├── guards.ts           # Role-based authorization guards
│   │   │   └── middleware.ts       # Next.js auth middleware
│   │   │
│   │   ├── scoring/                # Reasoning scoring engine
│   │   │   ├── engine.ts           # Core scoring algorithm
│   │   │   ├── dimensions.ts       # 4 dimension definitions + weights
│   │   │   ├── rubrics.ts          # Scoring rubrics per dimension
│   │   │   ├── calibration.ts      # A/B testing and expert correlation
│   │   │   └── scoring-events.ts   # Events captured for scoring
│   │   │
│   │   ├── execution/              # Logic block execution engine
│   │   │   ├── interpreter.ts      # Executes block configurations
│   │   │   ├── test-runner.ts      # Runs logic against test cases
│   │   │   ├── edge-cases.ts       # Known edge case definitions
│   │   │   └── step-tracker.ts     # Step-through execution state
│   │   │
│   │   ├── validation/             # Zod schemas (shared client/server)
│   │   │   ├── challenge.ts        # Challenge input/output schemas
│   │   │   ├── solution.ts         # Solution submission schema
│   │   │   ├── progress.ts         # Progress update schemas
│   │   │   ├── scoring.ts          # Score submission schemas
│   │   │   └── user.ts             # User input schemas
│   │   │
│   │   └── constants/              # Shared constants
│   │       ├── block-types.ts      # Logic block type definitions
│   │       ├── scoring-constants.ts  # Scoring thresholds, weights
│   │       ├── progression.ts      # Unlock criteria, checkpoint intervals
│   │       └── limits.ts           # Rate limits, max attempts, etc.
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── user-store.ts           # User profile, auth state, settings
│   │   ├── progress-store.ts       # Challenge progress, scores, streaks
│   │   ├── challenge-store.ts      # Current challenge, variants, attempts
│   │   └── canvas-store.ts         # Canvas zoom, palette, selection
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-canvas-interaction.ts    # Canvas drag/connect logic
│   │   ├── use-scoring-feedback.ts      # Score calculation + display
│   │   ├── use-challenge-variant.ts     # Variant delivery after completion
│   │   ├── use-hint-gating.ts           # Hint unlock after attempts
│   │   ├── use-insight-streak.ts        # Insight streak tracking
│   │   └── use-bottleneck-detection.ts  # 5+ failure detection
│   │
│   ├── types/                      # Shared TypeScript types
│   │   ├── challenge-types.ts      # Challenge, block, test case types
│   │   ├── scoring-types.ts        # Reasoning score, dimension types
│   │   ├── canvas-types.ts         # React Flow node/edge types
│   │   ├── progression-types.ts    # Skill map, unlock, checkpoint types
│   │   └── user-types.ts           # User, role, settings types
│   │
│   ├── config/                     # Configuration
│   │   ├── app.ts                  # App configuration (feature flags, env)
│   │   └── constants.ts            # Global constants
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatting.ts           # Date, number, score formatting
│   │   ├── validation.ts           # Shared validation helpers
│   │   ├── analytics.ts            # Event tracking, analytics helpers
│   │   └── helpers.ts              # General utility functions
│   │
│   └── middleware.ts               # Next.js middleware (auth, rate limiting)
```

### Architectural Boundaries

**API Boundaries:**

- **Server Actions** (`src/actions/`) are the mutation layer — all data modifications go through here. Each action is auth-guarded, Zod-validated, returns `{ success, data/error }`.
- **API Routes** (`src/app/api/`) are for external integrations — webhooks, third-party services. Not used for internal CRUD.
- **Client components** call Server Actions directly — no separate API layer for frontend-backend communication.
- **Auth boundary** is at the middleware level (`src/middleware.ts`) for route protection and at the Server Action level (`getServerSession()`) for mutation protection.

**Component Boundaries:**

- **Feature-domain components** (`components/canvas/`, `components/scoring/`, etc.) own their UI logic exclusively. No cross-domain imports allowed.
- **Canvas components** own all React Flow interaction logic. They consume Zustand stores but don't mutate them directly — they call Server Actions or store setters.
- **Visualization components** (`components/visualization/`) are pure presentational components — they receive data props and render. No state management.
- **shadcn/ui components** (`components/ui/`) are the only base components — no other UI libraries permitted.

**Service Boundaries:**

- **Scoring engine** (`lib/scoring/`) is a pure computation layer — it receives interaction events and returns scores. It doesn't persist data; Server Actions do.
- **Execution engine** (`lib/execution/`) interprets block configurations and runs them against test cases. It's stateless — receives config, returns results.
- **Database layer** (`lib/db/`) is the only data access point. No direct DB queries in components or actions — always go through query functions in `lib/db/queries/`.
- **Validation layer** (`lib/validation/`) provides Zod schemas used by both Server Actions (input validation) and client components (form validation).

**Data Boundaries:**

- **Drizzle schema** (`lib/db/schema/`) defines the single source of truth for data structure. TypeScript types in `types/` derive from schema definitions.
- **Caching boundary**: Static challenge content uses Next.js `revalidateTag`. User-specific data (progress, scores) is never cached — always fresh from DB.
- **State persistence boundary**: Zustand stores hold transient UI state. Persistent state (progress, scores) flows through Server Actions → DB.

### Requirements to Structure Mapping

**Challenge Interaction (FR1-FR5):**
- Canvas: `src/components/canvas/LogicBlockCanvas.tsx`, `LogicBlockNode.tsx`, `BlockConnection.tsx`
- Execution: `src/lib/execution/interpreter.ts`, `test-runner.ts`
- Test feedback: `src/components/challenge/TestResults.tsx`, `EdgeCaseStressTest.tsx`
- State: `src/stores/canvas-store.ts`, `challenge-store.ts`

**Learning Progression (FR6-FR11):**
- Skill map: `src/components/progression/SkillMap.tsx`, `SkillNode.tsx`
- Progression logic: `src/lib/constants/progression.ts`, `src/actions/progress-actions.ts`
- Variant delivery: `src/hooks/use-challenge-variant.ts`, `src/components/gamification/VariantCard.tsx`
- Hint gating: `src/hooks/use-hint-gating.ts`, `src/components/challenge/HintPanel.tsx`

**Reasoning Evaluation (FR12-FR14):**
- Scoring engine: `src/lib/scoring/engine.ts`, `dimensions.ts`, `rubrics.ts`
- Score UI: `src/components/scoring/ReasoningScore.tsx`, `ScoreBreakdown.tsx`
- Calibration: `src/lib/scoring/calibration.ts`, `src/app/(admin)/scoring/page.tsx`

**Visual Learning (FR15-FR17):**
- Metaphors: `src/components/visualization/` (11 visualizer components)
- Step-through: `src/lib/execution/step-tracker.ts`, `src/components/canvas/ExecutionOverlay.tsx`
- Prediction gate: `src/components/challenge/PredictionGate.tsx`

**Gamification (FR18-FR20):**
- Insight streaks: `src/components/gamification/InsightStreak.tsx`, `src/hooks/use-insight-streak.ts`
- Aha! tracking: `src/components/gamification/AhaMomentTracker.tsx`
- Explain thinking: `src/components/challenge/` (gating component)

**Post-Solve/Community (FR21-FR24):**
- Solution sharing: `src/components/challenge/SolutionShare.tsx`, `src/actions/community-actions.ts`
- Challenge design: `src/app/(app)/community/[id]/page.tsx`
- Friend activity: `src/app/(app)/community/page.tsx`

**Progress Tracking (FR25-FR27):**
- Dashboard: `src/app/(app)/dashboard/page.tsx`
- Growth visualization: `src/components/progression/ProgressPath.tsx`
- State: `src/stores/progress-store.ts`

### Integration Points

**Internal Communication:**
- Components → Server Actions: Direct function calls (no HTTP)
- Components → Zustand stores: Direct state access + setters
- Server Actions → DB: Via `lib/db/queries/` functions only
- Scoring engine → Server Actions: Scoring results returned as data, actions persist

**External Integrations:**
- OAuth providers → Better Auth callback (`src/app/(auth)/callback/page.tsx`)
- Webhooks → API routes (`src/app/api/webhooks/route.ts`)
- Vercel Analytics → `src/utils/analytics.ts`
- Vercel Log Drain → `console.error` structured logging

**Data Flow:**
1. User interacts with canvas → React Flow events → Zustand store updates
2. User hits "Test" → Canvas state serialized → Server Action called → Execution engine runs → Results returned → UI updates
3. Solution submitted → Scoring engine computes → Server Action persists → Progress store updates → UI reflects new scores/streaks
4. Challenge completed → Variant unlocked → UI presents next challenge or variant

### File Organization Patterns

**Configuration Files:** All root-level config files (`package.json`, `next.config.js`, `tailwind.config.js`, `tsconfig.json`, `drizzle.config.ts`) at project root for standard tooling discovery.

**Source Organization:** Feature-domain organization within `src/` — `app/` for routes, `components/` by domain, `lib/` by technical layer, `stores/` and `hooks/` as flat directories.

**Test Organization:** Unit/integration tests co-located (`*.test.ts`/`*.test.tsx` next to source). E2E tests in `e2e/` at project root with Playwright configuration.

**Asset Organization:** Static assets in `public/` — metaphors in `public/assets/metaphors/`, icons in `public/assets/icons/`. Dynamic assets (user-generated content images) stored in cloud storage, not in repo.

### Development Workflow Integration

**Development Server Structure:** `npm run dev` starts Next.js dev server with HMR. `docker compose up` runs local PostgreSQL for DB integration. Drizzle Studio (`npm run db:studio`) for database browsing.

**Build Process Structure:** `npm run build` produces optimized Next.js build. `npm run db:generate` and `npm run db:migrate` for schema migrations before deployment.

**Deployment Structure:** Vercel handles build and deployment automatically on git push. Environment variables configured in Vercel dashboard. Database migrations run as pre-deployment step via `drizzle-kit migrate`.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are mutually compatible with no conflicts identified:
- Next.js 15 + React 19 + TypeScript 5 + Tailwind 4 form a native stack
- Zustand v5 and React Flow v12 are standard React libraries — no state management conflicts
- Drizzle ORM v0.45.2 + PostgreSQL — native compatibility, lightweight runtime
- Better Auth v1.4+ integrates directly with Drizzle + PostgreSQL — designed for this stack
- Framer Motion (UI animations) and React Flow (canvas) operate in separate domains — no overlap
- Vercel deployment is the native platform for Next.js — zero-config fit

**Pattern Consistency:**
All implementation patterns reinforce architectural decisions:
- Naming: snake_case (DB) → camelCase (client) → PascalCase (components) — consistent transformation chain
- Server Actions: return `{ success, data/error }` — aligns with Next.js App Router and avoids throw/catch ambiguity
- Zustand + Immer: supports flat state preference with nested update ergonomics
- Error handling: return objects from Server Actions, catch + toast on client — consistent unidirectional error flow
- Loading states: single `status` enum — eliminates boolean state explosion across all stores

**Structure Alignment:**
Project structure enables all architectural decisions:
- Feature-domain components (`components/canvas/`, `components/scoring/`) support the isolation required for React Flow canvas
- Separate `/actions/` directory keeps Server Actions auditable and testable independent of UI
- `lib/scoring/` and `lib/execution/` as pure computation layers match the "no persistence in engine" decision
- Route groups `(app)`, `(auth)`, `(public)`, `(admin)` enforce the access boundary decisions
- Requirements-to-structure mapping confirms every FR category has specific file locations

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All 51+ functional requirements across 8 categories have explicit architectural support:

| FR Category | Architectural Support | Files |
|-------------|----------------------|-------|
| Challenge Interaction (FR1-5) | Canvas, execution engine, test feedback | `components/canvas/`, `lib/execution/`, `components/challenge/` |
| Learning Progression (FR6-11) | Skill map, variant delivery, hint gating | `components/progression/`, `hooks/`, `lib/constants/` |
| Reasoning Evaluation (FR12-14) | Scoring engine, score UI, calibration | `lib/scoring/`, `components/scoring/`, `(admin)/scoring/` |
| Visual Learning (FR15-17) | 11 metaphor visualizers, step-through | `components/visualization/`, `lib/execution/step-tracker.ts` |
| Gamification (FR18-20) | Insight streaks, aha tracking | `components/gamification/`, `hooks/` |
| Post-Solve/Community (FR21-24) | Solution sharing, challenge design | `components/challenge/SolutionShare.tsx`, `actions/community-actions.ts` |
| Progress Tracking (FR25-27) | Dashboard, growth visualization | `app/(app)/dashboard/`, `components/progression/ProgressPath.tsx` |
| Account/Community Management | User actions, friend relationships | `actions/user-actions.ts`, `lib/db/schema/social.ts` |

**Non-Functional Requirements Coverage:**

| NFR | Architectural Support |
|-----|----------------------|
| Performance <100ms canvas | React Flow optimized rendering; Zustand minimal overhead; no unnecessary re-renders |
| 60fps visualizations | Custom Canvas 2D/WebGL for algorithm visualizations; Framer Motion for UI (GPU-accelerated) |
| Browser support | React Flow supports Chrome/Firefox/Safari/Edge; iPad Safari requires touch testing |
| Accessibility WCAG 2.1 AA | shadcn/ui accessible base components; canvas requires keyboard navigation plan (see gaps) |
| Data privacy | Self-hosted Better Auth; PostgreSQL data control; no third-party analytics beyond Vercel |
| Offline support | Zustand stores + localStorage for draft challenge work; server sync on reconnect |

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions documented with verified versions:
- Frontend: Next.js 15, React 19, TypeScript 5
- State: Zustand v5.0.12
- Canvas: React Flow (@xyflow/react) v12.10.2
- Database: PostgreSQL, Drizzle ORM v0.45.2
- Auth: Better Auth v1.4+
- Animation: Framer Motion (latest)
- Deployment: Vercel + Neon/Supabase
- Testing: Vitest (unit), Testing Library (component), Playwright (E2E)

**Structure Completeness:**
Complete directory tree with ~120 specific files/directories defined. Every feature domain has component, store, hook, action, and type locations specified.

**Pattern Completeness:**
All 14 conflict areas addressed with naming conventions, format rules, and concrete good/anti-pattern examples for Server Actions, Zustand stores, error handling, and loading states.

### Gap Analysis Results

**Important Gaps (recommended to address before implementation):**

1. **Canvas Accessibility (WCAG AA):** The React Flow canvas is inherently visual. WCAG 2.1 AA requires keyboard navigation and screen reader support. Architecture should define an alternative interaction model (keyboard-driven block placement, ARIA descriptions for logic flows). **Recommendation:** Create a `src/lib/accessibility/canvas-a11y.ts` module that provides keyboard interaction handlers and ARIA generators for canvas state.

2. **Testing Framework Specification:** Vitest + Testing Library mentioned as TBD. **Recommendation:** Lock in Vitest (unit), Testing Library (component), Playwright (E2E) — all work natively with Next.js App Router.

3. **Challenge Content Format:** Challenge definitions described as "JSON/MDX-based" but no schema or location defined. **Recommendation:** Store challenge content in database `challenges` table with admin-managed content — allows dynamic content updates without deployments.

**Minor Gaps (can be addressed during implementation):**

1. **Docker Compose Definition:** `docker-compose.yml` listed but content not specified. Needs PostgreSQL service with version, port mapping, and volume persistence.
2. **Package Scripts:** `package.json` scripts not enumerated. Should include: `dev`, `build`, `start`, `lint`, `db:generate`, `db:migrate`, `db:studio`, `test`, `test:e2e`.
3. **Environment Variables Schema:** `.env.example` listed but variables not documented. Needs: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, OAuth client IDs, Vercel analytics ID.

### Validation Issues Addressed

**Resolved through this validation:**
- Testing framework: Specified as Vitest + Testing Library (unit/component) + Playwright (E2E)
- Challenge content: Recommend database-stored content with admin management (not files) — allows dynamic content updates without deployments
- Canvas accessibility: Flagged as implementation-story concern with recommended `canvas-a11y.ts` module

**Deferred to implementation:**
- Docker Compose content (standard PostgreSQL service)
- Package scripts enumeration (Next.js standard + Drizzle commands)
- Environment variables documentation (Better Auth + Drizzle standard variables)

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (High complexity, 8-12 components)
- [x] Technical constraints identified (canvas, scoring accuracy, real-time)
- [x] Cross-cutting concerns mapped (7 concerns: state, performance, content, scoring, a11y, progressive enhancement, privacy)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions (7 technologies)
- [x] Technology stack fully specified (full-stack Next.js + PostgreSQL)
- [x] Integration patterns defined (Server Actions, Zustand, Drizzle)
- [x] Performance considerations addressed (<100ms canvas, 60fps viz)

**✅ Implementation Patterns**
- [x] Naming conventions established (DB, API, code — all with examples)
- [x] Structure patterns defined (feature-domain organization, 120+ files)
- [x] Communication patterns specified (Server Action naming, state updates, events)
- [x] Process patterns documented (error handling, loading, validation, auth flow)

**✅ Project Structure**
- [x] Complete directory structure defined (full tree with all files)
- [x] Component boundaries established (API, component, service, data boundaries)
- [x] Integration points mapped (internal, external, data flow)
- [x] Requirements to structure mapping complete (51+ FRs → specific files)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH — All critical decisions made, patterns documented with examples, structure complete with requirements mapping. Minor gaps (Docker, scripts, env vars) are standard boilerplate that don't affect architectural coherence.

**Key Strengths:**
- Clear technology stack with verified versions — no ambiguity for AI agents
- React Flow choice perfectly matches the core canvas interaction requirement
- Pure computation layers (scoring, execution) separated from persistence — testable and swappable
- Feature-domain component organization prevents cross-cutting conflicts
- Comprehensive naming and format patterns eliminate 14 identified conflict areas
- Requirements-to-structure mapping ensures every FR has a home

**Areas for Future Enhancement:**
- Real-time collaboration architecture (Phase 2+) — WebSocket layer not yet designed
- Code export pipeline (visual logic → programming language) — deferred to post-MVP
- Advanced monitoring/observability beyond Vercel Analytics — can be added incrementally
- Multi-region database replication — not needed for MVP scale

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented — do not substitute technologies without explicit approval
- Use implementation patterns consistently — naming conventions, response formats, and state patterns are non-negotiable
- Respect project structure boundaries — place files in the specified directories
- Refer to this document for all architectural questions — do not make assumptions
- First implementation story: Initialize project with `npx create-next-app@latest logiq-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` followed by `npx shadcn@latest init`

**Implementation Sequence (from Decision Impact Analysis):**
1. Project initialization (`create-next-app` + shadcn/ui)
2. Database schema design + Drizzle setup
3. Authentication setup (Better Auth + database tables)
4. Zustand stores
5. React Flow canvas prototype (linear search challenge)
6. Challenge content pipeline
7. Reasoning scoring engine
8. Skill map UI + progression logic
9. Failure visualization engine
10. Post-solve solution sharing
