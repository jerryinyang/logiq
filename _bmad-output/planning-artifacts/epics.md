---
stepsCompleted:
  - 'Step 1: Validate Prerequisites and Extract Requirements'
  - 'Step 2: Design Epic List'
  - 'Step 3: Generate Epics and Stories'
inputDocuments:
  - '/Users/jerryinyang/Code/logiq/_bmad-output/planning-artifacts/prd.md'
  - '/Users/jerryinyang/Code/logiq/_bmad-output/planning-artifacts/architecture.md'
  - '/Users/jerryinyang/Code/logiq/_bmad-output/planning-artifacts/ux-design-specification.md'
  - '/Users/jerryinyang/Code/logiq/_bmad-output/brainstorming/brainstorming-session-2026-04-13-001.md'
  - '/Users/jerryinyang/Code/logiq/_bmad-output/brainstorming/brainstorming-session-transcript-2026-04-13.md'
---

# logiq - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for logiq, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can drag and connect visual logic blocks to construct algorithm solutions on a canvas [MVP]
FR2: Users can test their visual logic solution against challenge test cases [MVP]
FR3: Users can add edge case handling blocks to their logic flow [MVP]
FR4: Users can revise and iterate on their logic solution after failure [MVP]
FR5: Users can view the execution steps of their constructed logic flow [MVP]
FR6: Users can view the full skill map territory showing all concepts ahead [MVP]
FR7: Users can access sequentially unlocked challenges (1-3 at a time) [MVP]
FR8: Users can receive 2-3 challenge variants after completing a challenge [MVP]
FR9: Users can complete checkpoint challenges to unlock next skill clusters [MVP]
FR10: Users can receive targeted mini-challenges when stuck on specific sub-skills after 5+ failures on the same challenge (Bottleneck Detection & Intervention) [Phase 2]
FR11: Users can access hints after 3 failed attempts on a challenge [MVP]
FR12: Users can see their reasoning path score across 4 dimensions: problem breakdown quality, edge case proactivity, structure efficiency, and iteration improvement [MVP]
FR13: Users can view the reasoning scoring rubric explaining how scores are calculated [MVP]
FR14: Users can receive dimension-specific feedback on their reasoning quality [MVP]
FR15: Users can interact with 11 visual metaphors representing core DSA concepts (arrays, linked lists, stacks, queues, trees, graphs, hash maps, binary search, recursion, DP, two pointers) [MVP]
FR16: Users can watch algorithm execution visualized step-by-step [MVP]
FR17: Users can predict algorithm behavior before seeing execution results using a multiple-choice prediction interface with 4 options and a confidence rating (low/medium/high); wrong predictions are captured and displayed alongside actual results to highlight intuition-reality gaps [MVP]
FR18: Users can predict algorithm behavior before seeing execution results (prediction gates) [MVP]
FR19: Users can access micro-concept cards introducing new concepts with visual diagrams [MVP]
FR20: Users can track consecutive insight moments as streaks [MVP]
FR21: Users can see their "aha!" moments when solution paths improve by ≥30% reasoning score or 1+ O-notation efficiency level [MVP]
FR22: Users can view their personal breakthrough timeline showing cognitive growth over time [Phase 2]
FR23: Users can view alternative solution approaches to their own completed challenge (post-solve gating — 3 approaches shown) [MVP]
FR24: Users can view friends' progress and activity in a personal feed with micro-leaderboards ranked by growth metrics (reasoning score improvement, insight streaks) — not raw scores — limited to groups of up to 5 friends for human-scale social motivation [Phase 2]
FR25: Users can participate in optional group challenge projects where groups of 3-5 users are self-formed, collaboration occurs via shared visual canvas with real-time co-editing, and submission is a single group solution with individual contribution tracking [Phase 2]
FR26: Users can design and publish challenges for the community after mastering 5+ concepts in a skill area [Phase 2]
FR27: Users can attempt community-created challenges [Phase 2]
FR28: Users can view community-submitted solution approaches to any challenge they have completed, sorted by community rating, showing distinct logic block arrangements from other users [Phase 2]
FR29: Users can earn and view community recognition badges awarded for: Challenge Creator (5 published challenges), Master Solver (10 challenges mastered in one skill area), Insight Streak (7 consecutive insight moments), Community Helper (10 helpful comments on community solutions) [Phase 2]
FR30: Users can create and manage their learning account (email/password or OAuth provider) [MVP]
FR31: Users can view their progress across all skill areas over time via a visual progress dashboard [MVP]
FR32: Users can see their reasoning growth metrics visualized as trend charts for each of the 4 scoring dimensions [MVP]
FR33: Users can access their challenge history and completion status with filtering by skill area and date range [MVP]
FR34: Content designers can create challenges with test cases and edge cases using an internal challenge authoring tool [MVP]
FR35: Content designers can define progressive difficulty sequences for skill paths using the curriculum mapping interface [MVP]
FR36: Expert reviewers can validate challenge content for technical accuracy via a review workflow before publication [MVP]
FR37: Expert reviewers can calibrate reasoning scoring algorithms against expert judgment using a comparison dataset of platform scores vs. expert ratings [MVP]
FR38: Administrators can review scoring correlation data against expert judgment via a dashboard showing correlation coefficients by challenge type [Phase 2]
FR39: Administrators can review and approve community-created challenges before publication via a moderation queue [Phase 2]
FR40: Administrators can monitor failure pattern library accuracy by reviewing pattern match rates against actual user failure data [Phase 2]
FR41: Administrators can recalibrate scoring algorithm parameters and test changes against a holdout expert judgment dataset [Phase 2]
FR42: Administrators can analyze user learning outcome data including completion rates, retention metrics, and reasoning score distributions [Phase 2]
FR43: Users can articulate a brief explanation of why their solution works before advancing to the next challenge (lightweight MVP: optional text field for reasoning; Phase 2: required gate with minimum articulation quality check) [MVP]

### NonFunctional Requirements

NFR1: Logic block canvas interactions (drag, snap, connect) respond within 100ms for 95th percentile — measured by frontend RUM instrumentation
NFR2: Algorithm visualization animations render at 60fps minimum — measured by browser DevTools performance profiler
NFR3: Initial application page loads within 3 seconds on broadband (50Mbps+) for 95th percentile — measured by synthetic load testing and APM
NFR4: Skill map and dashboard interactions respond within 500ms for 95th percentile — measured by APM monitoring
NFR5: Real-time co-editing sessions maintain <200ms synchronization latency for 95th percentile — measured by WebSocket message timing [Phase 2]
NFR6: Reasoning score calculation completes within 2 seconds after solution submission for 95th percentile — measured by backend APM tracing
NFR7: System supports 10,000 concurrent active users with <10% performance degradation — measured by load testing at 10,000 concurrent connections
NFR8: All user data encrypted at rest and in transit using industry-standard encryption — verified by automated security scanning and penetration testing
NFR9: User authentication sessions expire after 30 days of inactivity — verified by session token validation checks
NFR10: User learning behavioral data is never sold or shared with third parties — verified by annual third-party privacy audit
NFR11: Application protected against common web vulnerabilities (XSS, CSRF, SQL injection) — verified by quarterly automated scanning and annual penetration testing
NFR12: Community-created challenges scanned for malicious content before publication with 100% automated scan coverage
NFR13: System supports 10x user growth from initial launch (up to 100,000 concurrent users) with <10% degradation — measured by load testing
NFR14: Challenge content delivery supports 50,000 concurrent users with <2s content load time for 95th percentile — measured by CDN monitoring
NFR15: Community challenge storage scales to 1 million user-generated challenges with <500ms query response time
NFR16: Data storage supports read-heavy workloads (10:1 read-to-write ratio) with <200ms read response time — measured by database APM
NFR17: Web application meets WCAG 2.1 AA compliance — verified by axe-core on every release and manual screen reader testing quarterly
NFR18: Visual canvas supports keyboard navigation for all logic block interactions — verified by keyboard-only usability testing
NFR19: Screen reader alternatives provided for all 11 visual metaphors with equivalent information content — verified by NVDA/VoiceOver testing
NFR20: Color choices accommodate color-blind users — no information conveyed solely through red-green differentiation — verified by color blindness simulation
NFR21: Focus management implemented for all interactive canvas elements with visible focus indicators and logical tab order — verified by keyboard navigation audit
NFR22: Application uptime target of 99.5% during business hours (06:00-24:00 UTC) — measured by health dashboard and synthetic monitoring
NFR23: User progress and reasoning scores persisted with zero data loss on session completion — measured by database transaction integrity checks
NFR24: When real-time collaboration connection drops, local work auto-saved every 30 seconds and synced within 10 seconds of reconnection [Phase 2]
NFR25: Failed challenge submissions retried up to 3 times with exponential backoff achieving >95% eventual success rate

### Additional Requirements

**Starter Template:** Next.js 15 App Router created via `npx create-next-app@latest` with TypeScript, Tailwind CSS, ESLint, App Router, src directory, and import alias `@/*`. shadcn/ui initialized via `npx shadcn@latest init`.

**Infrastructure & Deployment:**
- Vercel deployment with managed PostgreSQL (Neon/Supabase)
- Environment configurations: development (local Docker PostgreSQL), preview (Vercel preview with isolated DB branch), production (Vercel production with primary PostgreSQL)
- Vercel Analytics for page load/Web Vitals/function duration; Vercel Logs for error tracking
- Drizzle Kit for schema migrations (type-safe, versioned, rollback support)

**Technology Stack:**
- Frontend: Next.js 15 + React 19 + TypeScript strict mode
- State Management: Zustand v5 (4 stores: user, progress, challenge, canvas)
- Canvas: React Flow (@xyflow/react v12) with custom node/edge types
- Database: PostgreSQL + Drizzle ORM v0.45
- Authentication: Better Auth v1.4+ (email/password + OAuth via GitHub/Google)
- Animation: Framer Motion (UI) + custom Canvas 2D/WebGL (algorithm visualizations)
- Testing: Vitest + Testing Library (unit), Playwright (E2E)
- Styling: Tailwind CSS 4 + shadcn/ui + CSS custom properties for design tokens

**Integration Requirements:**
- OAuth providers (GitHub, Google) via Better Auth callback
- Webhooks via API routes (Stripe, etc.)
- Vercel Analytics integration
- Vercel Log Drain via structured `console.error` logging

**API Standards:**
- Server Actions for mutations (Zod-validated, typed returns, error objects)
- API Routes for external integrations (RESTful, JSON responses, standardized error format)
- Rate limiting via Vercel Edge Middleware (100 req/min per user for challenge submissions)
- Response format: `{ success: true, data: <T> }` or `{ success: false, error: { code, message, details? } }`

**RBAC:** Roles: `user`, `creator` (challenge design mode), `admin` (moderation, scoring calibration)

**Data Privacy:**
- COPPA compliance: users under 13 require verifiable parental consent
- FERPA compliance: educational records treated as protected information with access controls
- Data retention: users can request deletion; inactive accounts purged after 24 months

**Framework References:**
- Bloom's Taxonomy cognitive domain alignment (remember → understand → apply → analyze → evaluate → create)
- ACM Computing Curriculum guidelines for CS education

### UX Design Requirements

UX-DR1: **Design Token System** — Implement dark-mode-first color palette: Primary Indigo (#6366F1), Success Emerald (#10B981), Error Rose (#F43F5E), Warning Amber (#F59E0B), Info Sky (#0EA5E9), Insight Violet (#8B5CF6), Neutral Backgrounds Slate (#0F172A/#1E293B), Neutral Text Slate (#F8FAFC/#94A3B8). All combinations must meet WCAG 2.1 AA contrast ratios.

UX-DR2: **Typography System** — Inter as primary typeface (H1: 40px/700, H2: 32px/600, H3: 24px/600, H4: 20px/600, Body: 16px/400, Small: 14px/400, Tiny: 12px/400); JetBrains Mono for code-adjacent elements (block labels, algorithm annotations).

UX-DR3: **Spacing & Layout** — 8px base unit scale (4, 8, 12, 16, 24, 32, 48, 64, 96px). Desktop: 3-panel layout (left 280px challenge description, center flexible canvas, right 300px blocks & scoring). Tablet: 2-panel with collapsible sides. Mobile: single panel with tabbed navigation.

UX-DR4: **Button Hierarchy** — Primary (filled indigo, white text, one per screen), Secondary (outlined indigo), Tertiary (text link indigo), Danger (filled rose), Disabled (gray, low opacity). No more than 2 primary actions visible simultaneously.

UX-DR5: **Feedback Visual Patterns** — Success (emerald checkmark + glow), Error (rose X + shake), Warning (amber triangle + pulse), Info (sky circle + static), Insight (violet sparkle + celebration). Toast notifications top-right, auto-dismiss 4s for success/info, require dismissal for warnings. Insight celebrations are modal-level.

UX-DR6: **Logic Block Canvas Component** — Core interaction component with: canvas surface (dark grid), block palette (right panel, categorized), connected block flow (center), connection lines (curved), test button (floating), validation indicators (green/red). States: Empty, Building, Testing (animation), Complete (celebration), Failed (red paths with step-through). Must support keyboard navigation (Tab, Enter, Arrow keys), ARIA labels, screen reader announces flow structure.

UX-DR7: **Visual Metaphor Display Component** — 11 metaphors: Array=sliding strip, Linked List=paper clips, Stack=plates, Queue=conveyor belt, Tree=organism, Graph=city map, Hash Map=filing cabinet, Binary Search=book-closing, Recursion=nesting dolls, DP=construction, Two Pointers=converging scissors. States: Static, Animated, Interactive.

UX-DR8: **Reasoning Score Dashboard Component** — 4-dimensional score display (Problem Breakdown, Edge Case Proactivity, Structure Efficiency, Iteration Improvement) with gauge meters or radar chart, expandable dimension cards with scores and feedback, improvement suggestions.

UX-DR9: **Skill Map Component** — Visual territory map with sequential unlocking. Node states: locked (gray, tooltip shows prerequisite), current (highlighted), completed (green with mastery rating), mastered. Full territory visible, 1-3 challenges unlocked at a time.

UX-DR10: **Failure Visualization Engine Component** — Step-through player (play/pause/step controls), logic flow with red-highlighted failure path, error description panel, common mistake context ("80% of devs make this mistake here").

UX-DR11: **Insight Streak Tracker Component** — Streak counter (prominent display), insight moment timeline, growth chart (reasoning score over time).

UX-DR12: **Responsive Strategy** — Desktop-first design (build for 1280px+, adapt down). Core canvas interaction desktop-primary. Mobile is companion experience (view progress, browse solutions, manage account) — NOT canvas building. Display "Logic building is best on a larger screen" messaging on mobile.

UX-DR13: **Accessibility Implementation** — WCAG 2.1 AA compliance. Full keyboard support for canvas. Screen reader: canvas announced as workspace, blocks with ARIA labels, flow as ordered list, failures with descriptions. Touch targets minimum 48x48px. Visible focus rings (2px indigo outline). Respect prefers-reduced-motion.

UX-DR14: **Empty States** — Define empty states for: Empty Canvas ("Drag blocks here to build your logic"), No Hints ("Keep trying! Hints unlock after a few attempts"), No Solution Sharing ("Complete to see other approaches"), No Friend Activity ("Add friends to see progress"), First Visit ("Welcome! Start with your first challenge").

UX-DR15: **Loading States** — Canvas: skeleton blocks + "Preparing workspace...". Test Execution: animated progress along logic flow path. Skill Map: faded outline with stagger node appearance. Solution Sharing: skeleton solution cards.

UX-DR16: **Modal/Overlay Patterns** — Dim background (60% black overlay), center modal, slide-in animation, close via X/Escape/background click. Small (320px) micro-concepts, medium (480px) celebrations/hints, large (720px) solution comparison/settings.

UX-DR17: **Desktop Keyboard Shortcuts** — T=Test, R=Reset, H=Hint, S=Skill Map. Right-click context menu on blocks (delete, duplicate, describe). Shift+click for multi-block selection.

UX-DR18: **Micro-Concept Card Component** — 3-4 sentence cards with single visual diagram for new concept introductions before first challenge using that concept.

UX-DR19: **Hint Gating Component** — Hints unlock after 3 failed attempts. Each hint reveals one layer — directional nudge, not solution. Attempt counter visible to user.

UX-DR20: **Prediction Gate Component** — Multiple-choice prediction interface (4 options + confidence rating low/medium/high). Wrong predictions displayed alongside actual results to highlight intuition-reality gaps.

### FR Coverage Map

FR1: Epic 2 - Drag and connect visual logic blocks on canvas
FR2: Epic 2 - Test visual logic solution against challenge test cases
FR3: Epic 2 - Add edge case handling blocks to logic flow
FR4: Epic 2 - Revise and iterate on logic solution after failure
FR5: Epic 2 - View execution steps of constructed logic flow
FR6: Epic 3 - View full skill map territory showing all concepts ahead
FR7: Epic 3 - Access sequentially unlocked challenges (1-3 at a time)
FR8: Epic 3 - Receive 2-3 challenge variants after completing a challenge
FR9: Epic 3 - Complete checkpoint challenges to unlock next skill clusters
FR10: Epic 10 - Receive targeted mini-challenges after 5+ failures (Bottleneck Detection)
FR11: Epic 3 - Access hints after 3 failed attempts on a challenge
FR12: Epic 4 - See reasoning path score across 4 dimensions
FR13: Epic 4 - View reasoning scoring rubric explaining score calculation
FR14: Epic 4 - Receive dimension-specific feedback on reasoning quality
FR15: Epic 5 - Interact with 11 visual metaphors for DSA concepts
FR16: Epic 5 - Watch algorithm execution visualized step-by-step
FR17: Epic 5 - Predict algorithm behavior via multiple-choice prediction interface with confidence rating
FR18: Epic 5 - Predict algorithm behavior via prediction gates
FR19: Epic 5 - Access micro-concept cards introducing new concepts with visual diagrams
FR20: Epic 6 - Track consecutive insight moments as streaks
FR21: Epic 6 - See "aha!" moments when solution paths improve
FR22: Epic 10 - View personal breakthrough timeline showing cognitive growth over time
FR23: Epic 8 - View alternative solution approaches after completing challenge (post-solve gating)
FR24: Epic 10 - View friends' progress and activity with micro-leaderboards (Phase 2)
FR25: Epic 10 - Participate in optional group challenge projects with shared canvas (Phase 2)
FR26: Epic 10 - Design and publish challenges for community after mastery (Phase 2)
FR27: Epic 10 - Attempt community-created challenges (Phase 2)
FR28: Epic 10 - View community-submitted solutions sorted by rating (Phase 2)
FR29: Epic 10 - Earn and view community recognition badges (Phase 2)
FR30: Epic 1 - Create and manage learning account (email/password or OAuth)
FR31: Epic 7 - View progress across all skill areas via visual progress dashboard
FR32: Epic 7 - See reasoning growth metrics as trend charts for 4 scoring dimensions
FR33: Epic 7 - Access challenge history and completion status with filtering
FR34: Epic 9 - Content designers create challenges with test cases and edge cases
FR35: Epic 9 - Define progressive difficulty sequences for skill paths
FR36: Epic 9 - Expert reviewers validate challenge content before publication
FR37: Epic 9 - Expert reviewers calibrate scoring algorithms against expert judgment
FR38: Epic 11 - Review scoring correlation data against expert judgment (Phase 2)
FR39: Epic 11 - Review and approve community-created challenges via moderation queue (Phase 2)
FR40: Epic 11 - Monitor failure pattern library accuracy (Phase 2)
FR41: Epic 11 - Recalibrate scoring algorithm parameters (Phase 2)
FR42: Epic 11 - Analyze user learning outcome data (Phase 2)
FR43: Epic 6 - Articulate brief explanation of why solution works before advancing

## Epic List

### Epic 1: Project Foundation & Authentication
Users can create accounts, log in, and access the platform securely. Establishes the Next.js starter, Better Auth, PostgreSQL schema, RBAC foundation, and COPPA/FERPA compliance scaffolding.
**FRs covered:** FR30
**Phase:** MVP

### Epic 2: Logic Block Canvas & Challenge Core
Users can build, test, and iterate on visual logic solutions through the core drag-and-connect interaction. Includes React Flow canvas, custom block nodes, execution engine, test runner, step-through visualization, and real-time block validation.
**FRs covered:** FR1, FR2, FR3, FR4, FR5
**Phase:** MVP

### Epic 3: Learning Progression System
Users can navigate the skill map, receive sequentially unlocked challenges (1-3 at a time), complete variants after mastery, access gated hints after 3 failures, and complete checkpoint challenges to unlock skill clusters.
**FRs covered:** FR6, FR7, FR8, FR9, FR11
**Phase:** MVP

### Epic 4: Reasoning Scoring & Feedback
Users can see their 4-dimensional reasoning scores (problem breakdown, edge case proactivity, structure efficiency, iteration improvement) with transparent rubrics and dimension-specific feedback. Includes the scoring engine algorithm and expert correlation validation pipeline.
**FRs covered:** FR12, FR13, FR14
**Phase:** MVP

### Epic 5: Visual Learning & Metaphors
Users can interact with 11 visual metaphors for DSA concepts, watch step-through algorithm executions, predict algorithm behavior via prediction gates (4 options + confidence rating), and access micro-concept cards introducing new concepts.
**FRs covered:** FR15, FR16, FR17, FR18, FR19
**Phase:** MVP

### Epic 6: Gamification & Growth Tracking
Users can track consecutive insight moments as streaks, see "aha!" moments when solution paths improve by ≥30% or 1+ O-notation, and articulate their reasoning via the "Explain Your Thinking" gate (lightweight MVP: optional text field).
**FRs covered:** FR20, FR21, FR43
**Phase:** MVP

### Epic 7: Progress Dashboard & History
Users can view their progress across all skill areas via a visual dashboard, see reasoning growth trend charts for each scoring dimension, and access their challenge history filtered by skill area and date range.
**FRs covered:** FR31, FR32, FR33
**Phase:** MVP

### Epic 8: Post-Solve Solution Sharing
Users can view 3 alternative solution approaches to their own completed challenge after completing it, learning that "there are many right answers." Solutions include creator reasoning annotations.
**FRs covered:** FR23
**Phase:** MVP

### Epic 9: Content Management & Quality Pipeline
Content designers can create challenges with test cases and edge cases via an internal authoring tool, define progressive difficulty sequences, and expert reviewers can validate content and calibrate scoring algorithms against expert judgment before publication.
**FRs covered:** FR34, FR35, FR36, FR37
**Phase:** MVP

### Epic 10: Community & Collaboration
Users can receive targeted mini-challenges when stuck after 5+ failures, view personal breakthrough timelines, engage with friends via activity feeds and micro-leaderboards (growth metrics, up to 5 friends), participate in group challenges with shared canvas co-editing, design and publish community challenges after mastery, attempt community challenges, view community solutions sorted by rating, and earn recognition badges.
**FRs covered:** FR10, FR22, FR24, FR25, FR26, FR27, FR28, FR29
**Phase:** Phase 2

### Epic 11: Admin Dashboard & Analytics
Administrators can review scoring correlation data, moderate community-created challenges via a queue, monitor failure pattern library accuracy, recalibrate scoring algorithm parameters, and analyze user learning outcome data including completion rates and retention metrics.
**FRs covered:** FR38, FR39, FR40, FR41, FR42
**Phase:** Phase 2

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: Project Foundation & Authentication

Users can create accounts, log in, and access the platform securely. Establishes the Next.js starter, Better Auth, PostgreSQL schema, RBAC foundation, and COPPA/FERPA compliance scaffolding.
**FRs covered:** FR30
**Phase:** MVP

### Story 1.1: Initialize Project Repository & Starter Template
As a developer,
I want a configured Next.js 15 project with TypeScript, Tailwind, ESLint, and shadcn/ui,
So that the team has a consistent, production-ready foundation to build on.

**Acceptance Criteria:**

**Given** an empty repository
**When** I run `npx create-next-app@latest` with `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
**Then** the project scaffolds with App Router, TypeScript strict mode, and Tailwind CSS 4
**And** `npx shadcn@latest init` initializes shadcn/ui with default components
**And** `npm run dev` starts the dev server with HMR
**And** `npm run build` completes without errors

**Given** the initialized project
**When** I review `tsconfig.json`
**Then** strict mode is enabled (`"strict": true`)
**And** import alias `@/*` is configured

**Given** the project is set up
**When** I review `tailwind.config.js`
**Then** design tokens from UX-DR1 (color palette) and UX-DR3 (spacing scale) are defined as CSS custom properties

### Story 1.2: Set Up PostgreSQL Database Schema & Drizzle ORM
As a developer,
I want a versioned PostgreSQL schema with Drizzle ORM,
So that all user and authentication data is stored reliably and type-safely.

**Acceptance Criteria:**

**Given** a local PostgreSQL running via `docker compose`
**When** Drizzle ORM is installed and configured (`drizzle.config.ts`)
**Then** the schema domain files exist in `lib/db/schema/`: `users.ts`, `enums.ts`
**And** the barrel re-export is at `lib/db/schema.ts`
**And** `npm run db:generate` produces migration files
**And** `npm run db:migrate` applies them without errors

**Given** the `users` table schema
**When** it is defined
**Then** it includes: `id` (UUID PK), `email` (unique, indexed), `password_hash`, `display_name`, `role` (enum: user/creator/admin), `created_at`, `updated_at`, `session_token`, `session_expires_at`
**And** column naming follows `snake_case` convention per Architecture standards

### Story 1.3: Implement User Registration (Email/Password)
As a new user,
I want to register with email and password,
So that I can create an account and start using the platform.

**Acceptance Criteria:**

**Given** I am on the registration page (`/(auth)/register`)
**When** I enter a valid email, password (≥8 chars), and display name
**Then** my account is created in the `users` table with role `user`
**And** my password is hashed using bcrypt before storage (NFR8)
**And** I am redirected to the dashboard (`/(app)/dashboard`)
**And** I receive a welcome toast notification

**Given** I am on the registration page
**When** I enter an email already associated with an account
**Then** I see an error message: "An account with this email already exists"
**And** no duplicate user record is created

**Given** I am on the registration page
**When** I submit with invalid input (empty fields, weak password, malformed email)
**Then** I see inline validation errors below the relevant fields
**And** no API call is made until validation passes
**And** the submit button is disabled

### Story 1.4: Implement User Login with Better Auth
As a registered user,
I want to log in with my email and password,
So that I can access my account and resume my learning journey.

**Acceptance Criteria:**

**Given** I have a registered account
**When** I visit the login page (`/(auth)/login`) and enter correct credentials
**Then** I am authenticated and redirected to the dashboard
**And** a secure HTTP-only session cookie is set (NFR8)
**And** the session expires after 30 days of inactivity (NFR9)

**Given** I am on the login page
**When** I enter an incorrect password
**Then** I see an error message: "Invalid email or password"
**And** the error message does not reveal whether the email exists in the system (security best practice)

**Given** I am not authenticated
**When** I try to access a protected route like `/dashboard`
**Then** I am redirected to `/login` by the Next.js middleware (`src/middleware.ts`)

### Story 1.5: Implement OAuth Login (GitHub & Google)
As a developer,
I want to log in with my GitHub or Google account,
So that I can onboard quickly without managing another password.

**Acceptance Criteria:**

**Given** Better Auth is configured with GitHub and Google OAuth providers
**When** I click "Sign in with GitHub" on the login page
**Then** I am redirected to the OAuth provider
**And** upon successful authorization, I am redirected to `/callback`
**And** a `users` record is created if one doesn't exist (linked by OAuth provider ID)
**And** I am logged in and redirected to the dashboard

**Given** I already have an email/password account
**When** I log in via OAuth using the same email address
**Then** the accounts are linked (OAuth provider ID associated with existing user)
**And** I am logged in as my existing account

### Story 1.6: Implement Password Reset Flow
As a user who forgot my password,
I want to reset my password via email,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Forgot password?" and enter my registered email
**Then** a password reset email is sent with a time-limited token link
**And** I see a confirmation: "If an account exists with this email, you'll receive a reset link"

**Given** I received the password reset email
**When** I click the link and enter a new password
**Then** my password is updated (hashed with bcrypt)
**And** all existing sessions are invalidated (security)
**And** I am redirected to the login page with a success message

### Story 1.7: Implement User Account Management & RBAC
As a logged-in user,
I want to view and manage my account settings,
So that I can control my profile and understand my access level.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I visit `/profile`
**Then** I see my display name, email, and role
**And** I can update my display name
**And** I can change my password (requires current password)

**Given** I am a user with role `user`
**When** I try to access `/admin/dashboard`
**Then** I receive a 403 Forbidden response
**And** I am redirected to the dashboard

**Given** I am on the profile page
**When** I click "Sign out"
**Then** my session is destroyed
**And** I am redirected to the login page

## Epic 2: Logic Block Canvas & Challenge Core

Users can build, test, and iterate on visual logic solutions through the core drag-and-connect interaction. Includes React Flow canvas, custom block nodes, execution engine, test runner, step-through visualization, and real-time block validation.
**FRs covered:** FR1, FR2, FR3, FR4, FR5
**Phase:** MVP

### Story 2.1: Install and Configure React Flow Canvas
As a developer,
I want React Flow (@xyflow/react) integrated into the application,
So that users can interact with a visual node-based canvas for building logic flows.

**Acceptance Criteria:**

**Given** the Next.js project is initialized (Epic 1)
**When** `@xyflow/react` v12 is installed
**Then** a `LogicBlockCanvas.tsx` component exists in `src/components/canvas/`
**And** it renders a React Flow provider with a dark grid background (UX-DR6)
**And** the canvas supports zoom, pan, and snap-to-grid
**And** undo/redo hooks are enabled
**And** zoom, undo/redo controls are visible in `CanvasToolbar.tsx`

**Given** the canvas is rendered on a challenge page (`/(app)/challenge/[id]/page.tsx`)
**When** the page loads
**Then** the canvas surface occupies the center panel per UX-DR3 (3-panel layout)
**And** the empty state displays: "Drag blocks here to build your logic" with arrow animation pointing to the block palette (UX-DR14)
**And** keyboard shortcuts are registered: T=Test, R=Reset (UX-DR17)

**Given** the canvas is rendered
**When** I use the keyboard
**Then** Tab navigates between canvas controls
**And** Enter activates selected elements
**And** focus indicators are visible (2px indigo outline, UX-DR13)

### Story 2.2: Implement Block Palette & Drag-to-Canvas Interaction
As a user attempting a challenge,
I want to drag logic blocks from a categorized palette onto the canvas,
So that I can start building my algorithm solution visually.

**Acceptance Criteria:**

**Given** I am on a challenge page with the canvas rendered
**When** I view the right panel
**Then** I see the `BlockPalette.tsx` component with blocks organized by category (UX-DR6)
**And** categories include: Loop, Condition, Comparison, Variable, Assignment, Return, Edge Case Handler

**Given** I am viewing the block palette
**When** I drag a block and drop it onto the canvas
**Then** a `LogicBlockNode.tsx` appears at the drop position with a snap animation (NFR1 <100ms)
**And** the block displays its type label and description
**And** connection points (input/output) are visible on the block
**And** the block has an ARIA label: "[Block type] — [description]" (UX-DR13)

**Given** a block is on the canvas
**When** I hover over it
**Then** a tooltip appears with the block description
**And** right-clicking shows a context menu with: delete, duplicate, describe (UX-DR17)

**Given** multiple blocks are on the canvas
**When** I Shift+click on multiple blocks
**Then** they are selected together for batch operations (UX-DR17)

### Story 2.3: Implement Block Connection & Real-Time Validation
As a user building a logic flow,
I want to connect blocks together and see validation feedback in real-time,
So that I can construct a valid algorithm before testing.

**Acceptance Criteria:**

**Given** two blocks are on the canvas
**When** I drag a connection from an output point to an input point
**Then** a `BlockConnection.tsx` edge is created with a curved path (UX-DR6)
**And** a snap animation plays
**And** the connection is validated against the block compatibility rules

**Given** I am connecting two incompatible blocks
**When** the connection is attempted
**Then** a red X indicator appears on the connection line (UX-DR5: Error feedback)
**And** the connection is rejected (edge not created)
**And** a tooltip explains: "Cannot connect [block A] to [block B]"

**Given** a valid connection is made
**When** I view the connection
**Then** it displays with a neutral color indicating a valid link
**And** the screen reader announces: "Connected [block A] to [block B]" (UX-DR13)

**Given** a logic flow is being built
**When** I view the canvas
**Then** the connected flow is visually clear — blocks are positioned with readable connection paths
**And** the flow is announced as an ordered list to screen readers (UX-DR13)

### Story 2.4: Build Logic Block Execution Engine & Test Runner
As a user who has built a logic flow,
I want to test my solution against challenge test cases,
So that I can see if my logic produces correct results.

**Acceptance Criteria:**

**Given** I have placed and connected blocks on the canvas
**When** I click the "Test" button (primary action, indigo filled per UX-DR4)
**Then** the canvas state is serialized into JSON block configuration
**And** a Server Action is called to submit the solution (FR2)
**And** the execution engine (`lib/execution/interpreter.ts`) interprets the block configuration
**And** the test runner (`lib/execution/test-runner.ts`) runs it against the challenge's test cases

**Given** the test is executing
**When** I view the canvas
**Then** an animated progress indicator flows along the logic path (UX-DR15)
**And** the text "Running your logic..." is displayed

**Given** all test cases pass
**When** execution completes
**Then** success paths light up green with a subtle glow animation (UX-DR5: Success feedback)
**And** the `TestResults.tsx` component shows: "All test cases passed"
**And** a green checkmark celebration animation plays

**Given** one or more test cases fail
**When** execution completes
**Then** the failure point in the logic flow lights up red with a shake animation (UX-DR5: Error feedback)
**And** the `TestResults.tsx` component shows which test case failed and the expected vs. actual output

### Story 2.5: Implement Step-Through Execution Visualization
As a user whose logic failed a test case,
I want to step through my logic execution one step at a time,
So that I can see exactly where and why my logic broke.

**Acceptance Criteria:**

**Given** my logic solution failed one or more test cases
**When** I view the canvas after failure
**Then** the `ExecutionOverlay.tsx` component is active with play/pause/step controls (UX-DR10)
**And** the failure path is highlighted in red

**Given** I click the "Step" button
**When** I step through execution
**Then** each block in the flow is highlighted sequentially as it executes
**And** the current block's operation is described in a panel: "Step 2: Compare value — expected > 5, got 3"
**And** when execution reaches the failure point, it stops and the red highlight intensifies
**And** the error description panel shows: "Failure at step [N]: [specific reason]"

**Given** I click "Play"
**When** the auto step-through runs
**Then** blocks light up sequentially at a readable pace
**And** the execution pauses automatically at the failure point

**Given** I am viewing a failure
**When** the failure point is highlighted
**Then** a common mistake context may display: "80% of devs make this mistake here" (if pattern matches) (UX-DR10)

**Given** I am using a screen reader
**When** the step-through execution runs
**Then** each step is announced: "Step 1: Loop through items", "Step 2: Compare value — failed" (UX-DR13)

### Story 2.6: Implement Iteration & Canvas State Persistence
As a user revising my solution after failure,
I want to modify my logic blocks and retest,
So that I can iterate toward a correct solution.

**Acceptance Criteria:**

**Given** my solution failed testing
**When** I modify blocks on the canvas (add, remove, reconnect)
**Then** changes are reflected instantly with <100ms response (NFR1)
**And** the canvas state is auto-saved to local storage every 30 seconds (NFR23)

**Given** I have made changes to the canvas
**When** I click "Test" again (FR4)
**Then** the updated logic is submitted for testing
**And** the test execution and feedback loop repeats (per Story 2.4 and 2.5)

**Given** I click "Reset" (R key, UX-DR17)
**When** I confirm the reset
**Then** all blocks are cleared from the canvas
**And** the empty state reappears

**Given** I navigate away from the challenge and return
**When** the canvas loads
**Then** my last saved draft is restored from local storage
**And** a toast notification says: "Draft restored"

### Story 2.7: Implement Edge Case Handling Blocks
As a user building a robust solution,
I want to add edge case handling blocks to my logic flow,
So that my solution handles boundary conditions correctly.

**Acceptance Criteria:**

**Given** I am viewing the block palette
**When** I look at the Edge Case category
**Then** I see blocks for: "Empty input", "Single element", "Already sorted", "Duplicates", "Max value" (FR3)

**Given** I drag an edge case handler block onto the canvas
**When** I connect it to my logic flow
**Then** it integrates as a conditional branch in the logic
**And** the block label shows which edge case it handles

**Given** my solution includes edge case handling blocks
**When** I hit "Test"
**Then** the test runner executes against both standard test cases AND the edge case stress test (FR3)
**And** if an edge case fails, the `EdgeCaseStressTest.tsx` component shows which edge case broke with red highlighting
**And** the step-through execution (Story 2.5) shows the failure path through the edge case branch

**Given** I am using keyboard navigation
**When** I add an edge case block
**Then** it can be placed and connected using Tab, Enter, and Arrow keys (UX-DR13)

## Epic 3: Learning Progression System

Users can navigate the skill map, receive sequentially unlocked challenges (1-3 at a time), complete variants after mastery, access gated hints after 3 failures, and complete checkpoint challenges to unlock skill clusters.
**FRs covered:** FR6, FR7, FR8, FR9, FR11
**Phase:** MVP

### Story 3.1: Create Challenge Data Model & Content Schema
As a content designer,
I want a structured data model for challenges, variants, and skill clusters,
So that the progression system can deliver the right challenges to users at the right time.

**Acceptance Criteria:**

**Given** the Drizzle ORM setup exists (from Epic 1)
**When** I define the challenge domain schemas in `lib/db/schema/challenges.ts`
**Then** the following tables exist:
- `challenges`: `id`, `title`, `description`, `difficulty`, `skill_cluster_id`, `block_vocabulary` (JSON), `created_at`, `updated_at`, `status` (enum: draft/review/published)
- `challenge_variants`: `id`, `challenge_id`, `variant_number`, `description`, `constraints`, `test_cases` (JSON)
- `challenge_test_cases`: `id`, `challenge_id` or `variant_id`, `input` (JSON), `expected_output` (JSON), `is_edge_case` (boolean), `difficulty_weight`
- `skill_clusters`: `id`, `name`, `description`, `order_index`, `prerequisite_cluster_ids` (JSON array)
- `skill_cluster_challenges`: junction table linking challenges to clusters with `is_checkpoint` flag

**Given** the schemas are defined
**When** I run `npm run db:generate` and `npm run db:migrate`
**Then** migrations apply without errors
**And** the barrel re-export in `lib/db/schema.ts` includes the new schemas

### Story 3.2: Build Skill Map Visualization with Sequential Unlocking
As a user viewing their learning path,
I want to see the full skill map territory with my current challenge highlighted,
So that I always know "what's next" and can see how far I've come.

**Acceptance Criteria:**

**Given** I am authenticated and visit `/skill-map`
**When** the page loads
**Then** the `SkillMap.tsx` component renders a visual territory map with nodes and connecting paths (UX-DR9)
**And** each `SkillNode.tsx` displays the cluster name with an icon
**And** completed clusters show green with a mastery rating
**And** the current cluster is highlighted with indigo primary color
**And** locked clusters are grayed with a tooltip showing prerequisites

**Given** I am viewing the skill map
**When** I look at the current cluster
**Then** 1-3 challenge nodes are visible within it (UX-DR9)
**And** the current challenge is highlighted
**And** the next challenge is visible but locked
**And** completed challenges show green with a checkmark

**Given** I click on a challenge node
**When** it is the current or completed challenge
**Then** I navigate to the challenge page (`/challenge/[id]`)
**And** when it is a locked challenge
**Then** I see a tooltip: "Complete [prerequisite challenge] to unlock"

**Given** I am using a screen reader
**When** the skill map loads
**Then** each node is announced with its state: "Array Basics — current", "Sorting Strategies — locked, requires Array Basics"

**Given** the skill map page loads
**When** nodes render
**Then** they appear with a stagger animation (UX-DR15: loading state)

### Story 3.3: Implement Challenge Unlocking Logic & Progression Engine
As a user completing a challenge,
I want the next challenge to unlock automatically,
So that I can continue my learning journey without interruption.

**Acceptance Criteria:**

**Given** I complete a challenge (all test cases pass)
**When** the completion is recorded in `user_progress`
**Then** the progression logic evaluates unlock criteria
**And** if the next challenge's prerequisites are met, it becomes unlocked
**And** the next challenge appears with an "unlocked" animation

**Given** I complete the last challenge in a skill cluster
**When** the progression logic evaluates
**Then** the next skill cluster is unlocked (if all prerequisites are met)
**And** if there is a checkpoint challenge, it becomes the current challenge
**And** I see a toast notification: "New skill cluster unlocked: [Cluster Name]"

**Given** the progression engine runs
**When** it evaluates unlock criteria
**Then** it completes within 500ms (NFR4)
**And** the logic is executed via a Server Action (`unlockNextChallenge()`)

**Given** a checkpoint challenge is the current challenge
**When** I complete it
**Then** the next skill cluster's first challenge is unlocked
**And** I see an unlock celebration animation (UX-DR5: Insight pattern)

### Story 3.4: Implement Progressive Variant System
As a user who completed a challenge,
I want to receive 2-3 variant challenges,
So that I can generalize my understanding instead of just replicating a solution.

**Acceptance Criteria:**

**Given** I complete a challenge that has variants defined
**When** the completion is confirmed
**Then** a `VariantCard.tsx` component appears presenting the variant options (FR8)
**And** the card shows: "Challenge mastered! Now try a variant:" with 2-3 variant choices
**And** each variant shows its unique constraint difference (e.g., "Sorted array input", "Duplicate values included")

**Given** I select a variant to attempt
**When** the variant loads on the canvas
**Then** the challenge description updates to reflect the variant's constraints
**And** my previous solution is pre-loaded on the canvas for reference
**And** I must adapt my logic to the new constraints

**Given** I complete a variant
**When** all variant test cases pass
**Then** I receive updated reasoning scores reflecting the variant adaptation
**And** the next challenge on the skill map remains available as an alternative

**Given** I choose not to attempt variants
**When** I dismiss the variant card
**Then** I am returned to the skill map with the next challenge available

### Story 3.5: Implement Gated Hint System
As a user struggling with a challenge,
I want hints to unlock after I've made several attempts,
So that I get help without losing the productive struggle.

**Acceptance Criteria:**

**Given** I am on a challenge page and have failed 0-2 attempts
**When** I look for hints
**Then** the hint panel shows: "Keep trying! Hints unlock after a few attempts" with an attempt counter (UX-DR14)
**And** no hint content is visible

**Given** I have failed 3 attempts on the same challenge
**When** I view the hint panel
**Then** Hint 1 unlocks with a directional nudge (not the solution): "Think about what happens when the array is already sorted"
**And** an amber warning indicator pulses briefly (UX-DR5: Warning pattern)

**Given** I have failed 5 attempts on the same challenge
**When** I view the hint panel
**Then** Hint 2 unlocks with a more specific nudge targeting the likely misunderstanding
**And** the hint is presented in a medium modal (480px) per UX-DR16

**Given** I am using keyboard navigation
**When** hints are available
**Then** I can navigate and read hints using Tab and Enter (UX-DR13)

### Story 3.6: Implement Challenge Page Layout & Challenge Description Component
As a user starting a challenge,
I want a clear, scannable challenge description alongside the canvas,
So that I can understand what I need to build without being intimidated.

**Acceptance Criteria:**

**Given** I navigate to a challenge (`/challenge/[id]`)
**When** the page loads
**Then** the 3-panel layout renders: left panel (280px) with challenge description, center canvas, right panel (300px) with block palette (UX-DR3)
**And** the `ChallengeDescription.tsx` component shows: title (H1), difficulty badge, concise problem statement (scannable, no walls of text), and a visual example

**Given** I view the challenge description
**When** I read the problem statement
**Then** it is structured as: "Goal", "Input", "Output", "Example" — each section is concise and visually separated
**And** the language avoids intimidating jargon (UX per the "Concise, scannable" principle)

**Given** I am on mobile (responsive)
**When** I visit the challenge page
**Then** the layout switches to tabbed navigation: Challenge | Canvas | Blocks (UX-DR12)
**And** a message says: "Logic building is best on a larger screen"

## Epic 4: Reasoning Scoring & Feedback

Users can see their 4-dimensional reasoning scores (problem breakdown, edge case proactivity, structure efficiency, iteration improvement) with transparent rubrics and dimension-specific feedback. Includes the scoring engine algorithm and expert correlation validation pipeline.
**FRs covered:** FR12, FR13, FR14
**Phase:** MVP

### Story 4.1: Define Scoring Engine Algorithm & Dimensions
As a platform,
I want a pure computation scoring engine that evaluates user reasoning across 4 dimensions,
So that users receive scores that reflect their cognitive process, not just correctness.

**Acceptance Criteria:**

**Given** the scoring engine module exists at `lib/scoring/engine.ts`
**When** it receives canvas interaction events (block placements, revisions, edge case additions, test results)
**Then** it computes scores across 4 dimensions (FR12):
- `problemBreakdown` (0-100): Did the user decompose the problem into logical steps before building?
- `edgeCaseProactivity` (0-100): Did the user anticipate and handle edge cases before being prompted?
- `structureEfficiency` (0-100): Did the user choose an efficient algorithmic structure (e.g., O(n) vs O(n²))?
- `iterationImprovement` (0-100): Did the user's solution improve across iterations after failure?

**Given** the engine computes scores
**When** it receives a completed solution
**Then** it returns `{ problemBreakdown, edgeCaseProactivity, structureEfficiency, iterationImprovement, overall }` — all on 0-100 scale
**And** `overall` is a weighted composite of the 4 dimensions
**And** computation completes within 2 seconds (NFR6)

**Given** the scoring dimensions are defined in `lib/scoring/dimensions.ts`
**When** reviewed by a domain expert
**Then** each dimension has a clear rubric explaining what behaviors map to what score ranges

### Story 4.2: Implement Scoring Rubrics & Dimension-Specific Feedback
As a user viewing my scores,
I want to understand why I received each score and how to improve,
So that scoring is transparent and actionable.

**Acceptance Criteria:**

**Given** the scoring rubrics are defined in `lib/scoring/rubrics.ts`
**When** a user completes a challenge and receives scores
**Then** the `ScoreBreakdown.tsx` component displays each dimension as an expandable card (UX-DR8)
**And** each card shows: score (0-100), a label (e.g., "Good", "Needs Work"), and specific feedback

**Given** I expand the "Problem Breakdown" dimension
**When** I view the feedback
**Then** it says something like: "You broke the problem into 3 logical steps. Consider decomposing further for complex challenges." (dimension-specific feedback, FR14)
**And** the rubric is visible: "Excellent = 5+ logical steps with clear separation; Good = 3-4 steps; Needs Work = 1-2 steps or no decomposition"

**Given** I expand the "Edge Case Proactivity" dimension
**When** I view the feedback
**Then** it says: "You handled 2 of 5 relevant edge cases. Try anticipating empty input and single-element cases earlier."
**And** the rubric explains the expected edge cases for this challenge type

**Given** the scoring UI renders
**When** I view it
**Then** colors map to score ranges: ≥80 = emerald (success), 50-79 = amber (warning), <50 = rose (error) per UX-DR1
**And** the overall score is displayed as a gauge meter or radar chart (UX-DR8)

**Given** I am using a screen reader
**When** scores are displayed
**Then** each dimension score is announced: "Problem Breakdown: 75 out of 100 — Good"

### Story 4.3: Persist Scores & Record Scoring Events
As a platform,
I want to store user reasoning scores and the interaction events that produced them,
So that users can track their growth over time and administrators can calibrate the algorithm.

**Acceptance Criteria:**

**Given** the scoring engine produces scores
**When** I complete a challenge
**Then** a Server Action persists the scores to the `user_progress` table
**And** the record includes: `user_id`, `challenge_id`, `variant_id` (nullable), `scores` (JSON: all 4 dimensions + overall), `created_at`

**Given** the scoring events are captured in `lib/scoring/scoring-events.ts`
**When** a user interacts with the canvas
**Then** events are recorded: block placements, block deletions, connection changes, test attempts, edge case additions
**And** events are associated with the current challenge attempt

**Given** the `user_progress` table schema
**When** reviewed
**Then** it includes: `id` (UUID PK), `user_id` (FK), `challenge_id` (FK), `variant_id` (FK, nullable), `status` (enum: in_progress/completed/mastered), `scores` (JSON), `attempt_count`, `insight_moments` (JSON array), `completed_at`
**And** all scores are persisted as integers (0-100)

### Story 4.4: Implement Expert Correlation Validation Pipeline
As an expert reviewer,
I want to compare platform-generated scores against my own expert judgment,
So that I can validate and calibrate the scoring algorithm to maintain >0.7 correlation.

**Acceptance Criteria:**

**Given** the calibration module exists at `lib/scoring/calibration.ts`
**When** an expert reviews a user's completed challenge
**Then** they can provide their own score (0-100) for each of the 4 dimensions
**And** the expert scores are stored in an `expert_judgments` table: `id`, `user_id`, `challenge_id`, `expert_scores` (JSON), `created_at`

**Given** expert judgments and platform scores exist for a challenge
**When** the calibration pipeline runs
**Then** it computes Pearson correlation coefficients for each dimension
**And** it displays: "Problem Breakdown correlation: 0.82, Edge Case Proactivity: 0.71, Structure Efficiency: 0.79, Iteration Improvement: 0.68"
**And** it flags dimensions below 0.7 threshold for recalibration

**Given** a dimension correlation falls below 0.7
**When** I view the calibration dashboard (admin)
**Then** I see: "Iteration Improvement needs recalibration (0.68). Review scoring rubric or adjust weights."
**And** I can adjust dimension weights and re-run correlation against the holdout dataset

## Epic 5: Visual Learning & Metaphors

Users can interact with 11 visual metaphors for DSA concepts, watch step-through algorithm executions, predict algorithm behavior via prediction gates (4 options + confidence rating), and access micro-concept cards introducing new concepts.
**FRs covered:** FR15, FR16, FR17, FR18, FR19
**Phase:** MVP

### Story 5.1: Build Visual Metaphor Display Framework & First 3 Metaphors
As a user learning a new DSA concept,
I want to see a physical visual metaphor that makes the abstract concept intuitively graspable,
So that I can understand the concept through a concrete mental model.

**Acceptance Criteria:**

**Given** the `MetaphorDisplay.tsx` generic wrapper component exists
**When** it receives a metaphor type prop
**Then** it renders the appropriate metaphor visualization component
**And** it supports 3 states: Static (concept intro), Animated (execution), Interactive (user manipulates) per UX-DR7

**Given** I encounter the Array concept for the first time
**When** the metaphor displays
**Then** `ArrayVisualizer.tsx` renders an array as a horizontal sliding strip (UX-DR7)
**And** elements slide left/right during algorithm execution at 60fps (NFR2)
**And** alt text describes: "Array represented as horizontal sliding strip with labeled positions" (NFR19)

**Given** I encounter the Linked List concept
**When** the metaphor displays
**Then** `LinkedListVisualizer.tsx` renders linked list nodes as a chain of paper clips (UX-DR7)
**And** pointer connections between clips are visible and animate during traversal

**Given** I encounter the Stack concept
**When** the metaphor displays
**Then** `StackVisualizer.tsx` renders a stack as a pile of plates (UX-DR7)
**And** push adds a plate on top, pop removes the top plate — with smooth CSS animations

**Given** I am using a screen reader
**When** any metaphor displays
**Then** equivalent descriptive alt text is provided (NFR19)
**And** screen reader announces the concept being illustrated

### Story 5.2: Implement Remaining 8 Visual Metaphors
As a user learning advanced DSA concepts,
I want to see physical metaphors for Queue, Tree, Graph, Hash Map, Binary Search, Recursion, DP, and Two Pointers,
So that all 11 core DSA concepts have intuitive visual representations.

**Acceptance Criteria:**

**Given** the metaphor framework exists (Story 5.1)
**When** each remaining metaphor component is implemented
**Then** the following render correctly:
- `QueueVisualizer.tsx`: Queue as conveyor belt (items enter one end, exit the other)
- `TreeVisualizer.tsx`: Tree as living organism with branching growth
- `GraphVisualizer.tsx`: Graph as city map with intersections and roads
- `HashMapVisualizer.tsx`: Hash map as filing cabinet (keys map to drawers)
- `BinarySearchVisualizer.tsx`: Binary search as book-closing ritual (halving search space)
- `RecursionVisualizer.tsx`: Recursion as Russian nesting dolls (call stack as spatial depth)
- `DPVisualizer.tsx`: Dynamic programming as construction site (building on previous results)
- `TwoPointersVisualizer.tsx`: Two pointers as converging scissors (moving toward center)

**Given** any metaphor is animated
**When** I view it
**Then** animations run at 60fps (NFR2)
**And** prefers-reduced-motion is respected — static color changes replace animations (UX-DR13)

**Given** I view any metaphor on a color-blind simulator
**When** the visualization uses color
**Then** information is not conveyed solely through red-green differentiation (NFR20)

### Story 5.3: Implement Step-Through Algorithm Execution Visualization
As a user watching an algorithm execute,
I want to see each step animated on the visual metaphor,
So that I can understand how the algorithm transforms data over time.

**Acceptance Criteria:**

**Given** the step-through execution engine (`lib/execution/step-tracker.ts`) produces execution steps
**When** a user's logic runs against a test case
**Then** each step is mapped to a visual state change on the metaphor display
**And** the `ExecutionOverlay.tsx` component shows play/pause/step controls (UX-DR10)

**Given** I click "Play" on the step-through player
**When** execution animates
**Then** each step is shown sequentially with the metaphor updating (e.g., sliding strip moves, plates stack/unstack)
**And** the current step is highlighted on the canvas logic flow
**And** the animation runs at 60fps (NFR2)

**Given** I click "Step"
**When** I advance one step
**Then** the metaphor updates to show the state after that step
**And** a description panel shows: "Step 3: Comparing element at index 2 with target"
**And** I can go back to previous steps or forward to next steps

**Given** I use keyboard navigation
**When** controlling step-through execution
**Then** Space = play/pause, Arrow Right = step forward, Arrow Left = step back

### Story 5.4: Implement Prediction Gate for New Concepts
As a user encountering a new algorithm concept,
I want to predict what happens next before seeing the execution,
So that I can discover the gap between my intuition and reality.

**Acceptance Criteria:**

**Given** a challenge introduces a new concept for the first time
**When** the algorithm execution reaches a decision point
**Then** a `PredictionGate.tsx` modal appears (medium size, 480px, per UX-DR16)
**And** it presents: "What happens next?" with 4 multiple-choice options
**And** I must select a confidence rating: Low, Medium, High

**Given** I make my prediction
**When** I submit it
**Then** the actual execution result is revealed
**And** if I was wrong, the gap is highlighted: "You predicted X, but the algorithm did Y. This is where your intuition differs — let's see why."
**And** my wrong prediction is captured and displayed alongside the actual result (FR17)

**Given** I was correct in my prediction
**When** the result is revealed
**Then** I see a positive reinforcement: "Correct! Your intuition matches the algorithm's behavior."
**And** my confidence rating is recorded for scoring

**Given** the prediction gate appears
**When** I review its placement
**Then** it only appears for new concepts — not on every execution step
**And** it is framed as a learning tool, not a test (per UX design principles)

### Story 5.5: Implement Micro-Concept Card Delivery System
As a user starting a challenge with a new concept,
I want a brief 3-4 sentence introduction with a visual diagram,
So that I have just enough orientation before jumping into practice.

**Acceptance Criteria:**

**Given** a challenge introduces a concept the user hasn't encountered
**When** I first load the challenge
**Then** a `MicroConceptCard.tsx` dialog appears (small size, 320px, per UX-DR16)
**And** it contains: concept name, 3-4 sentence explanation, and a single visual diagram (UX-DR18)
**And** the card dismisses via clicking away, Escape key, or an "I'm ready" button

**Given** I have already encountered this concept in a previous challenge
**When** I load the challenge
**Then** no micro-concept card appears (respects the user's familiarity)

**Given** I view the micro-concept card
**When** I read it
**Then** the content is concise — no walls of text, no videos, no long articles (UX principle: "challenges ARE the curriculum")
**And** the visual diagram is one of the metaphor components from UX-DR7

**Given** I dismiss the card
**When** I proceed to the canvas
**Then** the prediction gate (Story 5.4) may follow if this is the first execution of the concept

## Epic 6: Gamification & Growth Tracking

Users can track consecutive insight moments as streaks, see "aha!" moments when solution paths improve by ≥30% or 1+ O-notation, and articulate their reasoning via the "Explain Your Thinking" gate (lightweight MVP: optional text field).
**FRs covered:** FR20, FR21, FR43
**Phase:** MVP

### Story 6.1: Implement Insight Streak Detection & Tracker
As a user who recovers from failure productively,
I want my consecutive insight moments tracked as a streak,
So that I am rewarded for learning behavior, not just correctness.

**Acceptance Criteria:**

**Given** the insight streak detection logic exists in `use-insight-streak.ts`
**When** a user revises their solution after failure AND the revision shows improvement (score increase, fewer failures, better structure)
**Then** an insight moment is recorded
**And** the streak counter increments

**Given** a user makes a test attempt that does NOT show improvement
**When** the attempt is evaluated
**Then** the streak resets to 0
**And** a supportive message appears: "Every recovery is a learning opportunity"

**Given** the streak counter displays
**When** I view the `InsightStreak.tsx` component
**Then** it shows the current streak prominently (UX-DR11)
**And** a violet sparkle celebration animation plays when the streak increments (UX-DR5: Insight pattern)

**Given** the streak counter is visible
**When** I hover over it
**Then** a tooltip explains: "Insight streak: consecutive moments where you recovered from failure with a better solution"

### Story 6.2: Implement Aha! Moment Detection & Tracker
As a user whose reasoning dramatically improves,
I want the platform to detect and celebrate my breakthrough,
So that I see my own cognitive growth visually.

**Acceptance Criteria:**

**Given** I complete a challenge and receive reasoning scores
**When** the scoring engine evaluates my solution
**Then** the aha! detection checks: "Did reasoning score improve ≥30% from previous attempt OR O-notation efficiency improved by 1+ level?" (FR21)

**Given** an aha! moment is detected
**When** the `AhaMomentTracker.tsx` component activates
**Then** a modal celebration appears (medium size, 480px, per UX-DR16)
**And** it shows: "Aha! Moment detected! You improved from [previous score] to [new score]"
**And** the specific improvement dimension is highlighted (e.g., "Your edge case proactivity jumped from 30 to 85")
**And** a violet celebration animation plays (UX-DR5)

**Given** I acknowledge the celebration
**When** I dismiss the modal
**Then** the aha! moment is recorded in `user_progress.insight_moments` (JSON array)
**And** it appears in my personal breakthrough timeline

**Given** no aha! moment is detected
**When** I complete the challenge
**Then** no celebration appears — just the standard score display

### Story 6.3: Implement "Explain Your Thinking" Gate (Lightweight MVP)
As a user who completed a challenge,
I want to optionally articulate why my solution works,
So that I reinforce my understanding before moving on.

**Acceptance Criteria:**

**Given** I completed a challenge (all test cases pass)
**When** I view the post-completion screen
**Then** an optional text field appears: "Explain your thinking — why does your solution work?" (FR43 lightweight MVP)
**And** a placeholder text says: "Optional: Share your reasoning before continuing..."

**Given** I type my reasoning
**When** I submit it
**Then** my explanation is saved to my `user_progress` record
**And** I proceed to the variant choice or next challenge
**And** no quality check is enforced (lightweight MVP — optional, no minimum quality)

**Given** I skip the text field
**When** I click "Continue"
**Then** I proceed without any penalty
**And** no explanation is recorded

**Given** I use the text field
**When** I review its placement
**Then** it is a tertiary action link (per UX-DR4: button hierarchy)
**And** it is clearly marked as optional to prevent frustration

## Epic 7: Progress Dashboard & History

Users can view their progress across all skill areas via a visual dashboard, see reasoning growth trend charts for each scoring dimension, and access their challenge history filtered by skill area and date range.
**FRs covered:** FR31, FR32, FR33
**Phase:** MVP

### Story 7.1: Build Progress Dashboard Shell & Progress Overview
As a user returning to the platform,
I want to see my overall progress across skill areas at a glance,
So that I can quickly understand where I stand and what to work on next.

**Acceptance Criteria:**

**Given** I visit `/dashboard`
**When** the page loads
**Then** the dashboard renders with: my insight streak count, total challenges completed, total aha! moments, current skill cluster progress (UX-DR3, UX-DR11)

**Given** I view my skill area progress
**When** the dashboard queries my `user_progress` records
**Then** each skill cluster shows a progress bar: "Array Basics — 3/5 challenges completed"
**And** completed clusters show a mastery rating
**And** the current cluster is highlighted with indigo

**Given** the dashboard page loads
**When** I review performance
**Then** all interactions respond within 500ms (NFR4)
**And** initial page load completes within 3 seconds (NFR3)

**Given** I am using a screen reader
**When** the dashboard loads
**Then** each progress metric is announced clearly

### Story 7.2: Implement Reasoning Growth Trend Charts
As a user tracking my cognitive growth,
I want to see trend charts for each of my 4 reasoning score dimensions,
So that I can visually confirm I'm improving over time.

**Acceptance Criteria:**

**Given** I view the dashboard growth section
**When** the trend charts render
**Then** 4 line charts display: Problem Breakdown, Edge Case Proactivity, Structure Efficiency, Iteration Improvement (UX-DR8)
**And** each chart shows scores over time (x-axis: date, y-axis: score 0-100)
**And** a trend line indicates overall direction

**Given** I select a specific dimension chart
**When** I hover over a data point
**Then** a tooltip shows: "Challenge: [name] — Score: [N] — Date: [date]"
**And** I can click to see that challenge's detailed score breakdown

**Given** I have no score history yet
**When** the charts render
**Then** an empty state shows: "Complete challenges to see your reasoning growth"
**And** the charts area is not blank — it shows placeholder axes with encouragement text

### Story 7.3: Implement Challenge History with Filtering
As a user reviewing my learning journey,
I want to access my challenge history filtered by skill area and date range,
So that I can review past work and see my progression patterns.

**Acceptance Criteria:**

**Given** I visit the challenge history section on `/dashboard`
**When** the history table renders
**Then** it shows: challenge name, skill cluster, completion status, reasoning score (overall), date completed, attempt count
**And** entries are sorted by date (most recent first)

**Given** I apply a skill area filter
**When** I select "Array Basics" from the dropdown
**Then** only challenges from that skill cluster display
**And** the filter persists across page refreshes

**Given** I apply a date range filter
**When** I select "Last 30 days" from the date picker
**Then** only challenges completed in that range display
**And** the filter combines with the skill area filter (AND logic)

**Given** I click on a completed challenge in history
**When** I view it
**Then** I can see my submitted solution (logic block configuration)
**And** I can see my reasoning score breakdown for that attempt

## Epic 8: Post-Solve Solution Sharing

Users can view 3 alternative solution approaches to their own completed challenge after completing it, learning that "there are many right answers." Solutions include creator reasoning annotations.
**FRs covered:** FR23
**Phase:** MVP

### Story 8.1: Implement Post-Solve Solution Sharing (Completion-Gated)
As a user who completed a challenge,
I want to see how others solved the same problem differently,
So that I discover approaches I never considered.

**Acceptance Criteria:**

**Given** I completed a challenge (all test cases pass, including variants if attempted)
**When** I view the post-completion screen
**Then** a "See How Others Solved It" button appears (secondary action per UX-DR4)
**And** clicking it opens the `SolutionShare.tsx` component

**Given** I have NOT completed the challenge
**When** I try to access solution sharing
**Then** I see: "Complete this challenge to see how others solved it" with a lock icon (UX-DR14)

**Given** I view the solution sharing component
**When** it loads
**Then** skeleton solution cards display: "Loading approaches from the community..." (UX-DR15)
**And** 3 alternative solution approaches are shown (FR23)

**Given** I select a solution to view
**When** the solution renders
**Then** I see the visual logic flow display (same canvas component, read-only)
**And** I can step through the other user's logic with play/pause/step controls
**And** the creator's reasoning annotations are displayed: "I chose this approach because..."
**And** a "Many right answers" framing is visible throughout (per UX design principle)

**Given** I view multiple solutions
**When** I compare them
**Then** I can see the key difference: "This approach handles edge cases differently" or "This uses a more efficient structure"

**Given** the solutions load
**When** there are fewer than 3 alternative solutions available
**Then** I see: "2 approaches available — more will appear as the community grows"

## Epic 9: Content Management & Quality Pipeline

Content designers can create challenges with test cases and edge cases via an internal authoring tool, define progressive difficulty sequences, and expert reviewers can validate content and calibrate scoring algorithms against expert judgment before publication.
**FRs covered:** FR34, FR35, FR36, FR37
**Phase:** MVP

### Story 9.1: Build Challenge Authoring Tool
As a content designer,
I want to create challenges with test cases and edge cases using an internal tool,
So that I can populate the challenge library efficiently.

**Acceptance Criteria:**

**Given** I have the `creator` or `admin` role
**When** I visit the authoring interface
**Then** I can create a new challenge with: title, description, difficulty rating, skill cluster assignment, block vocabulary definition
**And** I can add test cases: input (JSON), expected output (JSON), is_edge_case flag, difficulty_weight

**Given** I save a challenge draft
**When** it is persisted
**Then** the challenge status is `draft`
**And** it is not visible to users on the skill map

**Given** I submit a challenge for review
**When** I change the status to `review`
**Then** it becomes visible in the expert review queue (FR36)
**And** I receive a confirmation: "Challenge submitted for review"

**Given** I am building a challenge
**When** I preview it
**Then** I see how it will appear on the challenge page (Story 3.6 layout)
**And** I can test my own test cases against a reference solution

### Story 9.2: Build Challenge Variant & Difficulty Sequence Builder
As a content designer,
I want to define progressive difficulty sequences and create variants for challenges,
So that users receive calibrated learning progression.

**Acceptance Criteria:**

**Given** I have created a challenge
**When** I add variants
**Then** I can define 2-3 variants per challenge with: variant number, unique constraints, additional test cases, description

**Given** I define a skill cluster's challenge sequence
**When** I use the curriculum mapping interface
**Then** I can order challenges within the cluster by difficulty
**And** I can mark any challenge as a checkpoint challenge (`is_checkpoint` flag)
**And** I can define prerequisite clusters for unlocking

**Given** I save a difficulty sequence
**When** it is persisted
**Then** the `skill_cluster_challenges` junction table reflects the order
**And** the progression engine (Story 3.3) uses this order for unlocking

### Story 9.3: Implement Expert Review Workflow
As an expert reviewer,
I want to validate challenge content for technical accuracy before publication,
So that users receive high-quality, pedagogically sound challenges.

**Acceptance Criteria:**

**Given** I have the `admin` role
**When** I visit the review queue
**Then** I see challenges with status `review`
**And** each entry shows: challenge title, creator, submitted date, difficulty

**Given** I select a challenge to review
**When** I view the review interface
**Then** I can see the challenge description, test cases, block vocabulary, and reference solution
**And** I can attempt the challenge myself on the canvas
**And** I can approve (status → `published`) or reject (status → `draft`) with feedback comments

**Given** I reject a challenge
**When** I submit feedback
**Then** the creator receives a notification with my comments
**And** the challenge returns to draft status for revision

**Given** I approve a challenge
**When** it is published
**Then** it becomes visible on the skill map for users
**And** the approval is logged with timestamp and reviewer ID

### Story 9.4: Implement Scoring Calibration Comparison Tool
As an expert reviewer,
I want to calibrate reasoning scoring algorithms against my expert judgment,
So that platform scores maintain >0.7 correlation with expert assessment.

**Acceptance Criteria:**

**Given** I have the `admin` role
**When** I visit the scoring calibration interface
**Then** I can review user-completed challenges with their logic block configurations
**And** I can provide my own score (0-100) for each of the 4 dimensions

**Given** I submit expert scores for a challenge
**When** they are persisted
**Then** they are stored in the `expert_judgments` table (Story 4.4)
**And** the calibration pipeline recomputes correlation coefficients

**Given** I view the calibration results
**When** I review correlation data
**Then** I see Pearson coefficients for each dimension
**And** I can see which challenge types produce the strongest/weakest correlations
**And** I can filter by challenge type, difficulty, or date range

## Epic 10: Community & Collaboration

Users can receive targeted mini-challenges when stuck after 5+ failures, view personal breakthrough timelines, engage with friends via activity feeds and micro-leaderboards (growth metrics, up to 5 friends), participate in group challenges with shared canvas co-editing, design and publish community challenges after mastery, attempt community challenges, view community solutions sorted by rating, and earn recognition badges.
**FRs covered:** FR10, FR22, FR24, FR25, FR26, FR27, FR28, FR29
**Phase:** Phase 2

### Story 10.1: Implement Bottleneck Detection & Mini-Challenge Intervention
As a user stuck on a challenge after 5+ failures,
I want the platform to detect my specific bottleneck and offer a targeted mini-challenge,
So that I can overcome the sub-skill block and return to the main challenge.

**Acceptance Criteria:**

**Given** I have failed the same challenge 5+ times
**When** the `use-bottleneck-detection.ts` hook evaluates my attempt history
**Then** it identifies the specific struggle point (e.g., "loop termination conditions," "edge case handling for duplicates")
**And** it offers a targeted mini-challenge focused only on that sub-skill

**Given** I accept the mini-challenge offer
**When** the mini-challenge loads
**Then** it presents a simplified version of the bottleneck concept
**And** I complete it using the same canvas interaction (Stories 2.1-2.7)
**And** upon completion, I return to the main challenge

**Given** I decline the mini-challenge
**When** I dismiss the offer
**Then** Hint 2 unlocks (Story 3.5) and I can continue retrying the main challenge

### Story 10.2: Implement Personal Breakthrough Timeline
As a user tracking my cognitive growth,
I want to view a timeline of my aha! moments and insight breakthroughs,
So that I can see my learning journey visually mapped over time.

**Acceptance Criteria:**

**Given** I have completed multiple challenges with aha! moments
**When** I view my breakthrough timeline (FR22)
**Then** I see a chronological timeline: date, challenge name, improvement metric (e.g., "Reasoning score: 45 → 78"), improvement dimension highlighted

**Given** I select a breakthrough entry
**When** I expand it
**Then** I see the before/after solution comparison
**And** I can view both solutions on the canvas (side-by-side or toggle)

**Given** I have no aha! moments yet
**When** I view the timeline
**Then** an empty state shows: "Complete challenges with improved reasoning to see your breakthroughs here"

### Story 10.3: Implement Friend Activity Feed & Micro-Leaderboards
As a user who wants social accountability,
I want to see my friends' progress and compete on growth metrics,
So that I stay motivated through human-scale social connection.

**Acceptance Criteria:**

**Given** the `friend_relationships` table exists in the schema
**When** I add a friend (by email or username)
**Then** a friend relationship record is created (bidirectional or pending-accept)
**And** the relationship is limited to groups of up to 5 friends (FR24)

**Given** I view the community page (`/(app)/community`)
**When** my friends are active
**Then** I see a personal feed: "Sarah just cracked the Binary Search challenge!" or "Alex had 3 insight moments today"
**And** activities are based on growth metrics (reasoning score improvement, insight streaks) — NOT raw scores (FR24)

**Given** I view the micro-leaderboard
**When** it renders
**Then** it shows my friend group ranked by growth metrics
**And** the ranking resets periodically (weekly) to keep it fresh
**And** my position is highlighted

**Given** I am using the friend feed on mobile
**When** I view it
**Then** it renders as a responsive feed in the mobile tabbed navigation (UX-DR12)

### Story 10.4: Implement Group Challenge Projects with Shared Canvas
As a user collaborating with friends,
I want to work on a group challenge with real-time shared canvas editing,
So that we can solve problems together and learn from each other's thinking.

**Acceptance Criteria:**

**Given** a group challenge is created by a team of 3-5 users (FR25)
**When** the shared canvas loads
**Then** WebSocket-based synchronization maintains <200ms latency (NFR5)
**And** presence indicators show which collaborators are active

**Given** multiple users edit the canvas simultaneously
**When** a conflict occurs
**Then** conflict resolution applies last-write-wins with operational transformation
**And** local work is auto-saved every 30 seconds and synced within 10 seconds of reconnection (NFR24)

**Given** the group submits their solution
**When** submission occurs
**Then** it is a single group solution with individual contribution tracking (FR25)
**And** each member receives the same reasoning scores
**And** contribution data is recorded for the group leader's review

### Story 10.5: Implement Challenge Design Mode & Community Publication
As a user who has mastered 5+ concepts,
I want to design and publish challenges for the community,
So that I can prove mastery through creation and contribute to the platform.

**Acceptance Criteria:**

**Given** I have mastered 5+ concepts in a skill area
**When** I visit the community page
**Then** I see an invitation: "Design a challenge for the community" (FR26)

**Given** I start designing a challenge
**When** I use the challenge design interface
**Then** it mirrors the content designer's authoring tool (Story 9.1) with simplified UI
**And** I can define: problem description, block vocabulary, test cases, edge cases, and a reference solution

**Given** I submit my challenge for publication
**When** it enters the moderation queue
**Then** it is reviewed by an admin (Story 9.3 workflow applies)
**And** upon approval, it becomes visible as a community challenge (FR27)

### Story 10.6: Implement Community Solution Browsing & Rating
As a user who completed challenges,
I want to view community-submitted solutions sorted by rating,
So that I can learn from the best approaches.

**Acceptance Criteria:**

**Given** I completed a challenge that has community solutions
**When** I browse solutions (FR28)
**Then** I see solutions sorted by community rating (upvotes)
**And** each solution shows: creator display name, distinct logic block arrangement preview, rating score

**Given** I view a community solution
**When** I click on it
**Then** the visual logic flow displays (read-only canvas)
**And** I can step through the solution with play/pause/step controls
**And** I can upvote the solution

### Story 10.7: Implement Community Recognition Badge System
As an active community member,
I want to earn and view recognition badges,
So that my contributions are acknowledged.

**Acceptance Criteria:**

**Given** the badge system is defined
**When** I earn a badge
**Then** the `ProgressBadge.tsx` component displays a celebration
**And** the badge is recorded in my `user_progress` record

**Given** the badge criteria are evaluated
**When** I meet criteria for:
- Challenge Creator: 5 published challenges
- Master Solver: 10 challenges mastered in one skill area
- Insight Streak: 7 consecutive insight moments
- Community Helper: 10 helpful comments on community solutions
**Then** the badge is automatically awarded (FR29)

**Given** I view my profile
**When** I look at my badges section
**Then** I see all earned badges with dates earned
**And** I see badges I'm working toward with progress indicators

## Epic 11: Admin Dashboard & Analytics

Administrators can review scoring correlation data, moderate community-created challenges via a queue, monitor failure pattern library accuracy, recalibrate scoring algorithm parameters, and analyze user learning outcome data including completion rates and retention metrics.
**FRs covered:** FR38, FR39, FR40, FR41, FR42
**Phase:** Phase 2

### Story 11.1: Build Admin Dashboard Shell & Scoring Correlation View
As an administrator,
I want to review scoring correlation data against expert judgment,
So that I can ensure platform scoring accuracy remains above 0.7.

**Acceptance Criteria:**

**Given** I have the `admin` role
**When** I visit `/admin/dashboard`
**Then** the admin dashboard renders with a sidebar navigation
**And** the default view shows scoring correlation data (FR38)

**Given** I view the scoring correlation dashboard
**When** it loads
**Then** it shows correlation coefficients by challenge type
**And** a summary: "Overall correlation: 0.78 — above threshold (0.7)"
**And** flagged dimensions below 0.7 are highlighted in amber

**Given** I drill into a specific challenge type
**When** I filter by "Array Basics"
**Then** I see per-challenge correlation data
**And** I can compare platform scores vs. expert ratings in a scatter plot

### Story 11.2: Implement Community Challenge Moderation Queue
As an administrator,
I want to review and approve community-created challenges before publication,
So that community content quality remains high.

**Acceptance Criteria:**

**Given** I have the `admin` role
**When** I visit the moderation queue (`/admin/challenges`)
**Then** I see community-created challenges awaiting review (FR39)
**And** each entry shows: title, creator, submitted date, difficulty

**Given** I review a community challenge
**When** I open it
**Then** I can see the full challenge specification and attempt it on the canvas
**And** I can approve (publish) or reject with feedback

**Given** I approve a challenge
**When** it is published
**Then** it becomes visible on the community challenges page
**And** the creator receives a notification

### Story 11.3: Implement Failure Pattern Library Accuracy Monitor
As an administrator,
I want to monitor failure pattern library accuracy,
So that our "80% of devs make this mistake" claims remain valid.

**Acceptance Criteria:**

**Given** I visit the failure patterns page (`/admin/scoring`)
**When** it loads
**Then** I see known failure patterns with their match rates against actual user failure data (FR40)
**And** each pattern shows: pattern description, claimed match rate, actual match rate, last updated

**Given** a pattern's actual match rate diverges significantly from the claimed rate
**When** I review the data
**Then** the pattern is flagged for review
**And** I can update the claimed rate or archive the pattern

### Story 11.4: Implement Scoring Algorithm Recalibration Tools
As an administrator,
I want to recalibrate scoring algorithm parameters and test changes,
So that I can improve scoring accuracy continuously.

**Acceptance Criteria:**

**Given** I visit the scoring calibration page (`/admin/scoring`)
**When** I adjust dimension weights
**Then** I can test changes against the holdout expert judgment dataset (FR41)
**And** I see updated correlation coefficients in real-time
**And** I can save the new weights as a versioned calibration

**Given** I want to swap scoring algorithms
**When** I select an alternative algorithm
**Then** I can A/B test it against a subset of challenges
**And** I can compare correlation results between the two algorithms

### Story 11.5: Implement Learning Outcome Analytics Dashboard
As an administrator,
I want to analyze user learning outcome data,
So that I can understand platform effectiveness and identify improvement areas.

**Acceptance Criteria:**

**Given** I visit the analytics page (`/admin/analytics`)
**When** it loads
**Then** I see: completion rates by challenge, 7-day and 30-day retention rates, reasoning score distributions (FR42)
**And** each metric is filterable by date range, challenge type, and user cohort

**Given** I filter by a date range
**When** I review the data
**Then** I see trend charts for each metric
**And** I can export the data as CSV

**Given** I review retention data
**When** I identify a drop-off point
**Then** I can drill into specific challenges with high abandonment rates
**And** I can see the failure patterns associated with those challenges

<!-- End of epics and stories -->
