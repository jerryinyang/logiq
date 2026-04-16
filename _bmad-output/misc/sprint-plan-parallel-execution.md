# logiq — Sprint Plan & Parallel Team Execution

**Generated:** 2026-04-14
**Project:** logiq
**Team Size:** 3 developers
**Total Epics:** 11 | **Total Stories:** 61

---

## Sprint Status

All items currently at `backlog`. Status tracked in:
`_bmad-output/implementation-artifacts/sprint-status.yaml`

### Status Flow

- **Epic:** `backlog` → `in-progress` → `done`
- **Story:** `backlog` → `ready-for-dev` → `in-progress` → `review` → `done`
- **Retrospective:** `optional` ↔ `done`

---

## Epic Summary

| Epic | Phase | Stories | Focus |
|---|---|---|---|
| **1. Project Foundation & Auth** | MVP | 7 | Next.js starter, DB schema, Better Auth, RBAC |
| **2. Logic Block Canvas & Core** | MVP | 7 | React Flow canvas, drag/connect, execution engine, test runner |
| **3. Learning Progression** | MVP | 6 | Skill map, challenge unlock, variants, hints |
| **4. Reasoning Scoring & Feedback** | MVP | 4 | 4-dimension scoring engine, rubrics, expert correlation |
| **5. Visual Learning & Metaphors** | MVP | 5 | 11 DSA visual metaphors, prediction gates, micro-concept cards |
| **6. Gamification & Growth** | MVP | 3 | Insight streaks, aha! moments, "Explain Your Thinking" gate |
| **7. Progress Dashboard & History** | MVP | 3 | Dashboard shell, trend charts, filtered history |
| **8. Post-Solve Solution Sharing** | MVP | 1 | Completion-gated alternative solution viewing |
| **9. Content Management & Quality** | MVP | 4 | Authoring tool, variant builder, expert review, calibration |
| **10. Community & Collaboration** | Phase 2 | 7 | Mini-challenges, social feed, group canvas, badges |
| **11. Admin Dashboard & Analytics** | Phase 2 | 5 | Scoring correlation, moderation, pattern monitor, analytics |

---

## Parallel Work Assignment

### Developer 1: Backend / Server Developer

**Primary responsibility:** Infrastructure, APIs, database, auth, scoring engine

| Order | Epic | Stories | Notes |
|---|---|---|---|
| 1st | **Epic 1** (all) | 1-1 through 1-7 | Foundation — MUST start first |
| 2nd | **Epic 4** (all) | 4-1 through 4-4 | Scoring engine depends on DB from Epic 1 |
| 3rd | **Epic 8** | 8-1 | Solution sharing — API + data access |
| 4th | **Epic 10** (backend stories) | 10-1, 10-3, 10-4 | Bottleneck detection, friend feed, WebSocket |
| 5th | **Epic 11** (all) | 11-1 through 11-5 | Admin dashboards, analytics APIs |

### Developer 2: Frontend / UX Designer

**Primary responsibility:** UI components, canvas, visualizations, design system

| Order | Epic | Stories | Notes |
|---|---|---|---|
| 1st | **Epic 2** (all) | 2-1 through 2-7 | Core canvas — can start after Story 1.1 scaffolding |
| 2nd | **Epic 5** (all) | 5-1 through 5-5 | Visual metaphors — builds on canvas from Epic 2 |
| 3rd | **Epic 7** (all) | 7-1 through 7-3 | Dashboard UI — depends on scoring data from Epic 4 |
| 4th | **Epic 3** (frontend stories) | 3-2, 3-6 | Skill map visualization, challenge page layout |
| 5th | **Epic 6** (all) | 6-1 through 6-3 | Gamification UI components |

### Developer 3: Domain Expert / Content Manager

**Primary responsibility:** Content schema, progression logic, authoring tools, hint systems

| Order | Epic | Stories | Notes |
|---|---|---|---|
| 1st | **Epic 3** (all) | 3-1 through 3-6 | Data model + progression engine — start after Story 1.2 DB setup |
| 2nd | **Epic 9** (all) | 9-1 through 9-4 | Authoring tool, review workflow — builds on Epic 3 schema |
| 3rd | **Epic 5** (content work) | 5-2, 5-5 | Metaphor content, micro-concept cards — content-heavy |
| 4th | **Epic 4** (content work) | 4-2 | Scoring rubrics — domain expertise needed |
| 5th | **Epic 10** (content stories) | 10-2, 10-5, 10-7 | Timeline, challenge design mode, badges |

---

## Execution Workflow Per Story

Each team member follows this cycle for every story they implement:

1. **`[CS] Create Story`** → run `bmad-create-story` with the story key
2. **`[VS] Validate Story`** → run `bmad-create-story:validate` to check readiness
3. **`[DS] Dev Story`** → run `bmad-dev-story` to implement
4. **`[CR] Code Review`** → run `bmad-code-review` (another team member or fresh LLM)
5. Mark story as `done` in sprint-status.yaml
6. Move to next story

### Branch Strategy

Each developer works on their own branch per epic:

```
epic-1-auth        (Backend Developer)
epic-2-canvas      (Frontend Developer)
epic-3-progression (Domain Expert)
```

Merge to `main` as stories reach `done`.

---

## Dependency Map

Stories that must wait for others:

| Waiting Story | Depends On | Reason |
|---|---|---|
| 1-2 (DB schema) | 1-1 (project init) | Needs project structure |
| 1-3 through 1-7 | 1-2, 1-4 | Need DB + auth foundation |
| 2-1 (React Flow) | 1-1 | Needs project scaffolding |
| 2-4 (execution engine) | 2-1, 2-2, 2-3 | Needs canvas + blocks |
| 3-1 (challenge schema) | 1-2 | Needs DB/ORM setup |
| 3-3 (unlocking logic) | 3-1, 3-2 | Needs schema + skill map |
| 4-1 (scoring engine) | 1-2 | Needs DB schema |
| 4-4 (expert correlation) | 4-1, 4-2, 4-3 | Needs scoring engine + data |
| 5-2 (remaining metaphors) | 5-1 | Needs metaphor framework |
| 9-1 (authoring tool) | 1-7, 3-1 | Needs RBAC + challenge schema |
| 10-4 (shared canvas) | 2-1 through 2-7 | Needs core canvas |
| 11-1 (admin dashboard) | 1-7, 4-4 | Needs RBAC + scoring pipeline |

---

## Parallel Execution Matrix (Week 1)

Assuming all 3 developers start simultaneously:

| Week | Backend Developer | Frontend Developer | Domain Expert |
|---|---|---|---|
| **Days 1-2** | Epic 1: Stories 1.1, 1.2 | Epic 1: Story 1.1 (wait), then Epic 2 prep | Epic 1: Story 1.2 (wait), then Epic 3 prep |
| **Days 3-5** | Epic 1: Stories 1.3–1.7 | Epic 2: Stories 2.1–2.3 | Epic 3: Stories 3.1–3.3 |
| **Days 6-7** | Epic 4: Stories 4.1–4.2 | Epic 2: Stories 2.4–2.7 | Epic 3: Stories 3.4–3.6 |

After Epic 1 Story 1.1 is done → Frontend and Domain Expert can unblock on their first epics.

---

## Quick Reference: All Story Keys

### Epic 1
- `1-1-initialize-project-repository-starter-template`
- `1-2-set-up-postgresql-database-schema-drizzle-orm`
- `1-3-implement-user-registration-email-password`
- `1-4-implement-user-login-with-better-auth`
- `1-5-implement-oauth-login-github-google`
- `1-6-implement-password-reset-flow`
- `1-7-implement-user-account-management-rbac`

### Epic 2
- `2-1-install-and-configure-react-flow-canvas`
- `2-2-implement-block-palette-drag-to-canvas-interaction`
- `2-3-implement-block-connection-real-time-validation`
- `2-4-build-logic-block-execution-engine-test-runner`
- `2-5-implement-step-through-execution-visualization`
- `2-6-implement-iteration-canvas-state-persistence`
- `2-7-implement-edge-case-handling-blocks`

### Epic 3
- `3-1-create-challenge-data-model-content-schema`
- `3-2-build-skill-map-visualization-sequential-unlocking`
- `3-3-implement-challenge-unlocking-logic-progression-engine`
- `3-4-implement-progressive-variant-system`
- `3-5-implement-gated-hint-system`
- `3-6-implement-challenge-page-layout-challenge-description-component`

### Epic 4
- `4-1-define-scoring-engine-algorithm-dimensions`
- `4-2-implement-scoring-rubrics-dimension-specific-feedback`
- `4-3-persist-scores-record-scoring-events`
- `4-4-implement-expert-correlation-validation-pipeline`

### Epic 5
- `5-1-build-visual-metaphor-display-framework-first-3-metaphors`
- `5-2-implement-remaining-8-visual-metaphors`
- `5-3-implement-step-through-algorithm-execution-visualization`
- `5-4-implement-prediction-gate-for-new-concepts`
- `5-5-implement-micro-concept-card-delivery-system`

### Epic 6
- `6-1-implement-insight-streak-detection-tracker`
- `6-2-implement-aha-moment-detection-tracker`
- `6-3-implement-explain-your-thinking-gate-lightweight-mvp`

### Epic 7
- `7-1-build-progress-dashboard-shell-progress-overview`
- `7-2-implement-reasoning-growth-trend-charts`
- `7-3-implement-challenge-history-with-filtering`

### Epic 8
- `8-1-implement-post-solve-solution-sharing-completion-gated`

### Epic 9
- `9-1-build-challenge-authoring-tool`
- `9-2-build-challenge-variant-difficulty-sequence-builder`
- `9-3-implement-expert-review-workflow`
- `9-4-implement-scoring-calibration-comparison-tool`

### Epic 10
- `10-1-implement-bottleneck-detection-mini-challenge-intervention`
- `10-2-implement-personal-breakthrough-timeline`
- `10-3-implement-friend-activity-feed-micro-leaderboards`
- `10-4-implement-group-challenge-projects-shared-canvas`
- `10-5-implement-challenge-design-mode-community-publication`
- `10-6-implement-community-solution-browsing-rating`
- `10-7-implement-community-recognition-badge-system`

### Epic 11
- `11-1-build-admin-dashboard-shell-scoring-correlation-view`
- `11-2-implement-community-challenge-moderation-queue`
- `11-3-implement-failure-pattern-library-accuracy-monitor`
- `11-4-implement-scoring-algorithm-recalibration-tools`
- `11-5-implement-learning-outcome-analytics-dashboard`
