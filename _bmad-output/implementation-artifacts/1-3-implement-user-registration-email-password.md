# Story 1.3: Implement User Registration (Email/Password)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a new user,
I want to register with email and password,
So that I can create an account and start using the platform.

## Acceptance Criteria

1. **Given** I am on the registration page (`/(auth)/register`), **when** I enter a valid email, password (≥8 chars), and display name, **then** my account is created in the `users` table with role `user`, my password is hashed using bcrypt before storage (NFR8), I am redirected to the dashboard (`/(app)/dashboard`), and I receive a welcome toast notification.

2. **Given** I am on the registration page, **when** I enter an email already associated with an account, **then** I see an error message: "An account with this email already exists", and no duplicate user record is created.

3. **Given** I am on the registration page, **when** I submit with invalid input (empty fields, weak password, malformed email), **then** I see inline validation errors below the relevant fields, no API call is made until validation passes, and the submit button is disabled.

4. **Given** the platform must comply with COPPA regulations (per epics.md), **when** a user attempts to register, **then** the registration form includes an optional age field or age verification step; users under 13 are informed that they need parental consent to create an account, and the system stores a `parental_consent` flag when applicable (per epics.md Data Privacy section).

5. **Given** the platform must comply with FERPA regulations (per epics.md), **when** educational records are created (progress, scores, learning outcomes), **then** all user data is treated as protected educational information with appropriate access controls and data handling procedures.

## Tasks / Subtasks

- [x] Task 1: Create Registration Page UI (AC: #1, #2, #3)
  - [x] Create `src/app/(auth)/register/page.tsx` with registration form
  - [x] Implement form fields: email, password, display name
  - [x] Add client-side validation using Zod schema
  - [x] Implement inline error display below each field
  - [x] Disable submit button until all validations pass
  - [x] Add welcome toast notification on success
  - [x] Ensure ARIA labels and accessibility compliance (UX-DR13)

- [x] Task 2: Implement Registration API Route (AC: #1, #2)
  - [x] Create `src/app/api/auth/register/route.ts` POST handler
  - [x] Validate input with Zod schema (email format, password ≥8 chars, required fields)
  - [x] Check for existing user by email (prevent duplicates)
  - [x] Hash password with bcrypt (cost factor per NFR8)
  - [x] Create user record in `users` table with role `user`
  - [x] Return appropriate error messages for duplicate emails
  - [x] Implement rate limiting to prevent abuse

- [x] Task 3: Integrate Session Management (AC: #1)
  - [x] Configure session creation after registration using sessions table
  - [x] Set HTTP-only session cookie (NFR8 security)
  - [x] Implement redirect to dashboard after successful registration
  - [x] Handle authentication state updates

- [x] Task 4: Form Validation & Error Handling (AC: #3)
  - [x] Define Zod validation schema for registration inputs
  - [x] Implement real-time validation on blur
  - [x] Display contextual error messages below each field
  - [x] Prevent form submission until all validations pass
  - [x] Handle server-side validation errors gracefully

- [x] Task 5: Testing & Quality Assurance
  - [x] Write unit tests for validation schema
  - [x] Write integration tests for registration API
  - [x] Test duplicate email handling
  - [x] Test password hashing verification
  - [x] Add rate limiter unit tests
  - [x] Test COPPA validation edge cases
  - [ ] Accessibility audit (keyboard navigation, screen reader) — requires manual testing

- [x] Task 6: COPPA/FERPA Compliance (AC: #4, #5)
  - [x] Add optional age field or date of birth to registration form
  - [x] Implement age verification logic (users under 13 require parental consent)
  - [x] Add parental consent flow: display consent notice and store consent flag when user indicates under 13
  - [x] Store `parental_consent` flag in `users` table (nullable, boolean)
  - [x] Add data handling notices consistent with FERPA requirements
  - [ ] Document data retention policy for educational records — deferred: policy-level documentation

## Dev Notes

### Architecture Patterns & Constraints

- **Authentication Library:** Better Auth (established in Epic 1) [Source: architecture.md#Core Architectural Decisions]
- **Password Hashing:** bcrypt with cost factor 12 (NFR8) [Source: epics.md#NFR8]
- **Database Schema:** Uses `users` table from Story 1.2 with columns: `id`, `email`, `password_hash`, `display_name`, `role` [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md]
- **Validation:** Zod schema for both client and server-side validation
- **Security:** HTTP-only cookies, rate limiting, timing-safe email existence checks [Source: architecture.md#Security Requirements]
- **File Location:** All code must be in `web/` subfolder at project root [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md#Runnable Code Location]

### Project Structure Notes

Expected structure for registration feature:
```
web/src/app/(auth)/register/
├── page.tsx              # Registration page component
└── actions.ts            # Server actions (if using Next.js actions pattern)

web/src/app/api/auth/
├── register/
│   └── route.ts          # POST handler for registration

web/src/lib/
├── validations/
│   └── auth.ts           # Zod schemas for auth forms
├── db/
│   └── schema/
│       └── users.ts      # Users table schema (from Story 1.2)
```

### Previous Story Intelligence

**From Story 1.2 (Database Setup):**
- Database schema is already defined in `web/src/lib/db/schema/users.ts`
- Drizzle ORM is configured with migration support
- Column naming follows `snake_case` convention
- The `users` table includes: `id` (UUID), `email` (unique, indexed), `password_hash`, `display_name`, `role` (enum), timestamps
- PostgreSQL is running via Docker Compose

**Key Learnings:**
- All database operations use Drizzle ORM for type safety
- Migrations are managed via `npm run db:generate` and `npm run db:migrate`
- Environment variables for database connection are in `.env`

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library [Source: architecture.md#Testing Standards]
- **Integration Testing:** Test API routes with mock database
- **E2E Testing:** Playwright for full registration flow
- **Accessibility Testing:** Verify WCAG 2.1 AA compliance
- **Security Testing:** OWASP guidelines for authentication flows

### Security Requirements

- Password must be hashed with bcrypt before storage (NFR8) [Source: epics.md#NFR8]
- Email enumeration prevention: use generic error messages for duplicate emails
- Rate limiting on registration endpoint to prevent brute force attacks
- Input sanitization to prevent XSS and SQL injection
- HTTPS required for all auth endpoints in production

### Latest Technical Information

- **Better Auth:** Latest stable version supports Next.js 15 App Router with server actions
- **bcrypt:** Use `bcryptjs` for better browser compatibility or native `bcrypt` for server-only
- **Zod:** v3.x provides schema validation with TypeScript inference
- **Next.js 15:** Use App Router patterns, server actions preferred over API routes when possible

### Technical Implementation Details

**Better Auth Configuration Example:**
```typescript
// web/src/lib/auth/config.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    hashPassword: async (password) => {
      const bcrypt = await import("bcryptjs");
      return bcrypt.hash(password, 12); // Cost factor 12
    },
    verifyPassword: async (password, hash) => {
      const bcrypt = await import("bcryptjs");
      return bcrypt.compare(password, hash);
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days (NFR9)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
});
```

**Zod Validation Schema:**
```typescript
// web/src/lib/validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  displayName: z.string()
    .min(3, "Display name must be at least 3 characters")
    .max(50, "Display name must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9_\s]+$/, "Display name can only contain letters, numbers, spaces, and underscores"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
```

**Rate Limiting Implementation:**
```typescript
// Use Vercel Edge Middleware or Upstash Ratelimit
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
  analytics: true,
});
```

### References

- [Source: epics.md#Story 1.3] - Original story definition and acceptance criteria
- [Source: epics.md#NFR8] - Data encryption and security requirements
- [Source: architecture.md#Core Architectural Decisions] - Better Auth configuration
- [Source: architecture.md#Security Requirements] - Authentication security patterns
- [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md] - Database schema foundation
- [Source: ux-design-specification.md#UX-DR13] - Accessibility standards

## Dev Agent Record

### Agent Model Used

opencode-deepseek-v4-flash

### Debug Log References

- Vitest v4.1.5 used for test execution
- Next.js 16.2.4 build successful
- 7 test files, 55 tests passing
- No external Better Auth dependency installed — used Drizzle ORM sessions table for session management
- Rate limiting uses in-memory Map (not Upstash Redis) — upgrade to Upstash for production
- sonner Toaster added to root layout with ThemeProvider for toast notifications

### Completion Notes List

- Created `web/src/lib/validations/auth.ts` — added `registerSchema`, `registerPasswordSchema` (no special char requirement per story spec), COPPA-aware `.superRefine()` for age/parental consent validation
- Created `web/src/app/(auth)/register/page.tsx` — registration form with email, password, display name, optional date of birth, FERPA notice, sonner toast on success, redirect to `/dashboard`
- Created `web/src/app/api/auth/register/route.ts` — POST handler with Zod validation, bcrypt hashing (cost 12), session creation via `sessions` table, HTTP-only cookie, rate limiting (5 req/min per IP), duplicate email detection (409 error)
- Created `web/src/lib/auth.ts` — server-side session management: `createSession`, `setSessionCookie`, `getSessionUser`, `clearSession` using Drizzle ORM sessions table
- Created `web/src/lib/rate-limit.ts` — in-memory sliding window rate limiter (5 requests per 60s window)
- Updated `web/src/lib/db/schema/users.ts` — added `date_of_birth` (date, nullable) and `parental_consent` (boolean, nullable) columns for COPPA compliance
- Updated `web/src/app/layout.tsx` — added ThemeProvider and sonner Toaster for toast support
- Added 4 test files:
  - `validations/auth.test.ts` — 19 tests for registerSchema, password rules, display name, trimming, COPPA validation
  - `api/auth/register/route.test.ts` — 5 tests for API: valid registration, duplicate email, invalid input, missing fields, server errors
  - `rate-limit.test.ts` — 4 tests for rate limiter basic behavior
  - Updated `db/schema/users.test.ts` — added tests for new COPPA columns
  - Updated `db/schema.test.ts` — added barrel export test for new columns

### File List

- web/src/app/(auth)/register/page.tsx (new)
- web/src/app/api/auth/register/route.ts (new)
- web/src/lib/auth.ts (new)
- web/src/lib/rate-limit.ts (new)
- web/src/lib/rate-limit.test.ts (new)
- web/src/lib/validations/auth.ts (modified)
- web/src/lib/validations/auth.test.ts (new)
- web/src/app/api/auth/register/route.test.ts (new)
- web/src/lib/db/schema/users.ts (modified)
- web/src/lib/db/schema/users.test.ts (modified)
- web/src/lib/db/schema.test.ts (modified)
- web/src/app/layout.tsx (modified)
- web/vitest.config.ts (new)

## Review Findings

- [x] [Review][Decision → Defer] Self-reported parentalConsent checkbox is not verifiable parental consent — Accepted as MVP. Verifiable parental consent deferred to future story.
- [x] [Review][Decision → Defer] COPPA age-13 enforcement and FERPA notice deferred to post-MVP — Registration page simplified; dateOfBirth and parentalConsent fields remain in schema/API for future use but UI and validation no longer enforce them.
- [x] [Review][Decision → Dismiss] Spec contradiction between AC #2 and dev notes on email enumeration — AC #2 takes precedence. Current 409 behavior is correct per spec.
- [x] [Review][Decision → Patch] Display name rejects non-Latin characters — Decision: broaden to Unicode `\p{L}` letters.
- [x] [Review][Defer] Rate limiter per-process — defeated by multi-instance/serverless deployment [web/src/lib/rate-limit.ts] — deferred, pre-existing: Dev notes document this as known limitation, plan to upgrade to Upstash for production
- [x] [Review][Defer] IP-based rate limiting trivially spoofable via x-forwarded-for — deferred, pre-existing: Depends on deployment/proxy configuration to validate headers
- [x] [Review][Defer] FERPA access controls not implemented [AC #5] — deferred, pre-existing: Educational records don't exist yet; FERPA requirements are broader than this story's scope
- [x] [Review][Defer] No CAPTCHA/bot protection on registration — deferred: Future enhancement outside this story's scope
- [x] [Review][Defer] UUID v4 session tokens have limited entropy vs crypto.randomBytes — deferred: Sufficient for current scale, upgrade path documented
- [x] [Review][Defer] No request body size limit on registration endpoint — deferred: Next.js default 1MB limit provides base protection
- [x] [Review][Defer] isValid can be stale with onBlur validation mode in react-hook-form — deferred: Known react-hook-form behavior, UX improvement for later

### Patches

- [x] [Review][Patch] Broaden displayName regex to support Unicode — Changed to `^[\p{L}\p{N}_\s]+$` with unicode flag. [web/src/lib/validations/auth.ts:89]
- [x] [Review][Patch] COPPA bypass via optional dateOfBirth — COPPA superRefine now requires parentalConsent when dateOfBirth is absent. DateOfBirth format and range validation added. [web/src/lib/validations/auth.ts:80-107]
- [x] [Review][Patch] Password special-char mismatch between UI and server schema — Added `.regex(/[^A-Za-z0-9]/, ...)` to registerPasswordSchema. [web/src/lib/validations/auth.ts:62-68]
- [x] [Review][Patch] calculateAge returns NaN for invalid date strings, bypassing COPPA — Added `isValidDateString` and `isFutureDate` validation; dateOfBirth now has format and future-date refinements. [web/src/lib/validations/auth.ts:91-93]
- [x] [Review][Patch] Plaintext session tokens in DB — Tokens now hashed with SHA-256 before storage. `createSession` uses `crypto.randomBytes(32)` for token generation. [web/src/lib/auth.ts:9-21]
- [x] [Review][Patch] getSessionUser returns full user row including password_hash — `getSessionUser` now uses selective column projection excluding `password_hash`. [web/src/lib/auth.ts:49-58]
- [x] [Review][Patch] Race condition on duplicate email registration — Registration now wrapped in `db.transaction()`. Unique constraint error (code 23505) caught and returned as 409. [web/src/app/api/auth/register/route.ts:35-70]
- [x] [Review][Patch] Invalid JSON body causes 500 — `request.json()` now wrapped in try/catch returning 400 for malformed JSON. [web/src/app/api/auth/register/route.ts:30-36]
- [x] [Review][Patch] Rate limiter Map grows unbounded — Added `cleanup()` function that sweeps expired entries on each `checkRateLimit` call. [web/src/lib/rate-limit.ts]
- [x] [Review][Patch] Expired sessions never cleaned from DB — `getSessionUser` now deletes expired session rows on detection. Added `cleanExpiredSessions()` utility. [web/src/lib/auth.ts]
- [x] [Review][Patch] Duplicate calculateAge function — Extracted to shared utility `web/src/lib/utils/date.ts`. Both client and server now import from single source. [web/src/lib/utils/date.ts]
- [x] [Review][Patch] calculateAge uses server-local timezone — Both copies now use UTC-based calculation (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`). [web/src/lib/utils/date.ts]
- [x] [Review][Patch] No email normalization — Added `.toLowerCase()` after `.trim()` on email in registerSchema. [web/src/lib/validations/auth.ts:82]
- [x] [Review][Patch] Password lacks .trim() — Added `.trim()` to registerPasswordSchema. [web/src/lib/validations/auth.ts:62]
- [x] [Review][Patch] Orphaned session/user rows on partial failure — User insert and session creation now wrapped in `db.transaction()`. Session cookie set outside transaction. [web/src/app/api/auth/register/route.ts:35-70]
- [x] [Review][Patch] Retry-After header dynamic — Rate limiter now returns `retryAfterSeconds` calculated from `entry.resetAt`. Route uses this for the header value. [web/src/app/api/auth/register/route.ts:22-25]
- [x] [Review][Patch] console.error may log password — Changed to sanitized log message: "Registration error: Please check server logs for details." [web/src/app/api/auth/register/route.ts:97]
- [x] [Review][Patch] Password max length not in UI — Added `maxLength={128}` to password FormInput. [web/src/app/(auth)/register/page.tsx]
- [x] [Review][Patch] Parental consent section now shown by default when no DOB — Updated form to show parental consent section when DOB is absent, per COPPA bypass fix. [web/src/app/(auth)/register/page.tsx]

## Change Log

- Implemented user registration (email/password) with full server-side API and client-side form
- Added session management using sessions table with HTTP-only cookies
- Added COPPA compliance: date of birth, age verification, parental consent flow
- Added FERPA data handling notice on registration form
- Added rate limiting (in-memory) for registration endpoint
- Added comprehensive test suite: 55 tests across 7 test files
- Extended users schema with COPPA columns
- Added ThemeProvider and sonner Toaster to root layout
