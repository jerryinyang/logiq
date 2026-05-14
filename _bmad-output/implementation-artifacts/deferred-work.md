# Deferred Work

## Deferred from: code review of 1-6-implement-password-reset-flow.md (2026-05-12)

- **[LOW] In-memory rate limiter doesn't share across instances** — Pre-existing issue in `rate-limit.ts`, not introduced by story 1.6. Needs Redis or external store for multi-instance deployments. [web/src/lib/rate-limit.ts]
- **[LOW] No background cleanup for expired reset tokens** — Tokens only deleted on use. Without a cleanup job, the `password_reset_tokens` table grows indefinitely. Needs a cron job or scheduled task. [password_reset_tokens table]

## Deferred from: code review of 1-7-implement-user-account-management-rbac.md (2026-05-13)

- **[MED] State-changing API endpoints lack CSRF protection** — Profile update (PATCH /api/user/profile) and password change (POST /api/user/change-password) rely on cookie-based session auth but lack CSRF tokens or SameSite=Strict enforcement on the session cookie. Pre-existing pattern, not introduced by this story. [web/src/app/api/user/profile/route.ts, web/src/app/api/user/change-password/route.ts]
- **[LOW] Password change lacks step-up authentication** — No re-prompt, MFA challenge, or confirmation token required beyond the current password. Architectural decision out of scope for this story. [web/src/app/api/user/change-password/route.ts]
- **[LOW] OAuth callback assigns hardcoded `user` role regardless of provider claims** — No mapping from provider claims (GitHub org membership, Google Workspace admin status, SAML attributes) to the RBAC hierarchy. Future enhancement. [web/src/app/api/auth/oauth/[provider]/callback/route.ts]

## Deferred from: code review of 2-2-implement-block-palette-drag-to-canvas-interaction.md (2026-05-14)

- **[LOW] JSON.stringify deep-clone drops non-serializable data** — Pre-existing pattern inherited from Story 2.1. History stack entries lose functions, Maps, Sets, BigInts. [web/src/stores/canvas-store.ts]
- **[LOW] getBlocksByCategory not reactive as Zustand selector** — Not currently consumed by any component, so functionally inert. [web/src/stores/canvas-store.ts]
- **[LOW] Return category renders empty with "0 items"** — Spec-defined design: `return` is a BlockType enum value but has no specific return blocks in vocabulary. May be intentional placeholder. [web/src/types/canvas-types.ts]
- **[LOW] Bypasses useNodesState/useEdgesState** — Design decision to use store directly for node/edge state. Not a functional bug. [web/src/components/canvas/LogicBlockCanvas.tsx]
- **[LOW] crypto.randomUUID() unavailable in non-secure contexts** — Pre-existing browser API compatibility concern. Falls over on HTTP and older browsers. [web/src/components/canvas/LogicBlockCanvas.tsx, web/src/stores/canvas-store.ts]
