# Deferred Work

## Deferred from: code review of story-1-4 (2026-05-08)

- In-memory rate limit has no shared state across serverless instances — Module-level `Map` isolated per function instance in Vercel/Lambda. Pre-existing design from Story 1.3.
- Race condition in in-memory rate limit counter — `entry.count++` is non-atomic read-modify-write. Pre-existing from Story 1.3.
- Memory leak in rate limit Map — keys grow unbounded with no TTL eviction except on-access. Pre-existing from Story 1.3.
- `checkRateLimit` return type inconsistency — `retryAfterSeconds` property guarded by `"in rateResult"` check suggesting optional return type. Pre-existing from Story 1.3.

## Deferred from: code review of story-1-1 (2026-05-05)

- `bcryptjs` in prod deps with no auth code — belongs to auth story implementation
- Missing `db:seed` script — not in Story 1-1 scope, needed when DB content stories begin
- No `prefers-reduced-motion` handling in framer-motion — UX accessibility story concern
- `oklch()` has no fallback for older browsers — modern-only acceptable for this project
- **Auth system stubbed:** All Supabase auth routes return 501. Auth must be rebuilt with Drizzle ORM + Better Auth (or similar) as part of Epic 1 auth stories (1-3 through 1-6). Files affected: 9 API routes in `src/app/api/auth/`, `src/app/auth/callback/route.ts`, `src/app/dashboard/page.tsx`, `src/middleware.ts` (simplified to passthrough).

## Deferred from: code review of story 1-3 (2026-05-06)

- Rate limiter per-process — defeated by multi-instance/serverless deployment. Dev notes document this as known limitation, plan to upgrade to Upstash for production.
- IP-based rate limiting trivially spoofable via x-forwarded-for — depends on deployment/proxy configuration to validate headers.
- FERPA access controls not implemented (AC #5) — educational records don't exist yet; FERPA requirements are broader than this story's scope.
- No CAPTCHA/bot protection on registration — future enhancement outside this story's scope.
- UUID v4 session tokens have limited entropy vs crypto.randomBytes — sufficient for current scale, upgrade path documented.
- No request body size limit on registration endpoint — Next.js default 1MB limit provides base protection.
- isValid can be stale with onBlur validation mode in react-hook-form — known react-hook-form behavior, UX improvement for later.
- Verifiable parental consent not implemented (COPPA) — self-reported checkbox accepted as MVP; verifiable consent flow deferred to future story.
- COPPA age-13 enforcement and FERPA notice removed from registration UI — deferred to post-MVP. Schema/API fields (date_of_birth, parental_consent) retained for future use.

## Deferred from: review of fix-register-required-error (2026-05-06)

- No CSRF protection on `POST /api/auth/register` — all state-changing auth endpoints should have CSRF validation.
- `dateOfBirth` accepts arbitrary unvalidated strings — schema should validate date format (ISO 8601 or `.date()`). Malformed strings cause opaque PostgreSQL type errors.
- `bcrypt.hash()` runs inside `db.transaction()` — CPU-intensive work inside transaction holds locks longer than necessary. Move hash computation before transaction.
- Error object not logged in catch block (`route.ts:94`) — `console.error` uses hardcoded message; actual error is discarded. Sanitized structured logging needed.
- Email enumeration via distinct 409 response — duplicate email returns explicit "already exists" message. Consider 200 + generic response to prevent user enumeration.
- Orphaned user if `createSession` or `setSessionCookie` fails after DB commit — transaction covers only user insertion; session creation outside. Failed session = permanent orphaned account.
- Rate limit consumed before input validation — invalid requests (bad JSON, missing fields) consume rate-limit tokens. Users who fat-finger inputs can get locked out.
- `null` values for optional fields rejected by Zod — `dateOfBirth` and `parentalConsent` accept `undefined` but not `null`. Use `.nullable().optional()` or `.preprocess()` for API resilience.
- Password trimming mismatch: `registerPasswordSchema` trims but `signInSchema` does not — users registering with whitespace-padded passwords will be unable to sign in.
- `displayName` regex (`[\p{L}\p{N}_\s]`) vs legacy `nameSchema` (`[a-zA-Z\s'-]`) are inconsistent — unify name validation across schemas.
- Password strength meter missing 128-char max-length check — shows "Strong" for passwords that will be rejected by the schema's `.max(128)`.
- No unit tests for `registerApiSchema` in `auth.test.ts` — API schema lacks direct test coverage independent of route integration tests.
- Registration success returns HTTP 200 instead of 201 — conformance with REST semantics and spec (I/O matrix specifies 201).

## Deferred from: code review of 1-4-implement-user-login-with-better-auth (2026-05-08)

- Custom auth instead of Better Auth — Spec requires Better Auth but codebase uses custom session management. Pre-existing from earlier stories (1.3), not introduced by this change.
- Rate limit key uses raw x-forwarded-for without validation — Pre-existing from Story 1.3 review; login route inherits same pattern.
