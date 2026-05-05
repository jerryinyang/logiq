# Deferred Work

## Deferred from: code review of story-1-1 (2026-05-05)

- `bcryptjs` in prod deps with no auth code — belongs to auth story implementation
- Missing `db:seed` script — not in Story 1-1 scope, needed when DB content stories begin
- No `prefers-reduced-motion` handling in framer-motion — UX accessibility story concern
- `oklch()` has no fallback for older browsers — modern-only acceptable for this project
- **Auth system stubbed:** All Supabase auth routes return 501. Auth must be rebuilt with Drizzle ORM + Better Auth (or similar) as part of Epic 1 auth stories (1-3 through 1-6). Files affected: 9 API routes in `src/app/api/auth/`, `src/app/auth/callback/route.ts`, `src/app/dashboard/page.tsx`, `src/middleware.ts` (simplified to passthrough).
