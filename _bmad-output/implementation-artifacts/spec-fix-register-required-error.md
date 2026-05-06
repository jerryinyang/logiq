---
title: 'Fix Register Page "Required" Error on Valid Form Submission'
type: 'bugfix'
created: '2026-05-06'
baseline_commit: '2433481f45429dfd95d73156f0051d3b1769295e'
status: 'done'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The registration page shows a "Required" error popup when a user fills in all fields and submits. The client-side `onSubmit` intentionally excludes `confirmPassword` from the API payload, but the server validates with the same `registerSchema` that requires `confirmPassword`, causing Zod's default `z.string()` type error: `"Required"`.

**Approach:** Derive a server-specific Zod schema (`registerApiSchema`) by omitting `confirmPassword` from the existing `registerSchema`. The server route then validates against the API schema instead of the full form schema. The client-side `registerSchema` and its `confirmPassword`/`refine()` remain unchanged.

## Boundaries & Constraints

**Always:** Use `registerSchema.omit({ confirmPassword: true })` to create the API schema. Keep existing `registerSchema` unchanged. Do not modify client-side form or validation logic. Do not send `confirmPassword` to the server.

**Ask First:** None — the fix is contained to the server-side validation entry point.

**Never:** Do not remove `confirmPassword` from the client-side schema. Do not change the client-side `onSubmit` to include `confirmPassword` in the API payload. Do not add `confirmPassword` as `.optional()` on the client schema (it must remain required for form validation).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path — all fields valid | `{ email, password, displayName }` (no confirmPassword) | 201, user created, session cookie set, JSON with user data | N/A |
| Missing required field (email) | `{ password, displayName }` | 400, error array with `{ field: "email", message: "Required" }` | Zebra provides "Required" for actually missing fields |
| Duplicate email | `{ email: "existing@test.com", password, displayName }` | 409, error: "An account with this email already exists" | Transaction rollback |
| Invalid JSON body | `"not json"` | 400, error: "Invalid request body" | try/catch on `request.json()` |
| Rate limited | 6th+ request in 60s window | 429, Retry-After header, error message | Rate limiter returns retryAfterSeconds |

</frozen-after-approval>

## Code Map

- `web/src/lib/validations/auth.ts` — Registration Zod schemas; add `registerApiSchema` export by omitting `confirmPassword`
- `web/src/app/api/auth/register/route.ts` — API POST handler; swap `registerSchema` import/usage for `registerApiSchema`

## Tasks & Acceptance

**Execution:**
- [x] `web/src/lib/validations/auth.ts` — Add `export const registerApiSchema = registerSchema.omit({ confirmPassword: true });` — Server can validate API payloads without requiring the client-only `confirmPassword` field
- [x] `web/src/app/api/auth/register/route.ts` — Replace `registerSchema` import and `registerSchema.safeParse(body)` with `registerApiSchema` — Fix the false "Required" error on valid registration submissions

**Acceptance Criteria:**
- Given all required fields (email, password ≥8 chars, displayName) are filled and passwords match, when user clicks "Create account", then account is created and user is redirected to dashboard with welcome toast — no "Required" error appears
- Given the register API receives `{ email: "user@test.com", password: "StrongPass1!", displayName: "Alice" }` without `confirmPassword`, when the server validates and creates the user, then the response is 201 with user data
- Given the register API receives `{ password: "StrongPass1!", displayName: "Alice" }` missing email, when the server validates, then the response is 400 with error `{ field: "email", message: "Required" }`

## Design Notes

The `registerSchema` serves dual purposes: client-side form validation (needs `confirmPassword` + `refine()` for password match) and server-side API validation (should NOT need `confirmPassword`). Zod's `.omit()` creates a derived schema without `confirmPassword` — the cleanest way to split the two use cases without duplicating the full schema definition.

## Verification

**Commands:**
- `npm run test` -- expected: all existing tests pass (55 tests across 7 files); confirm no regressions
- `npm run build` -- expected: TypeScript compilation succeeds in `web/`

## Suggested Review Order

- Entry point: the `registerApiSchema` export that omits `confirmPassword` — the core fix splitting client schema from server validation
  [`auth.ts:92`](../../web/src/lib/validations/auth.ts#L92)

- Import swap in the route handler — `registerSchema` replaced with `registerApiSchema`
  [`route.ts:6`](../../web/src/app/api/auth/register/route.ts#L6)

- Usage site — `registerApiSchema.safeParse(body)` now validates without requiring `confirmPassword`
  [`route.ts:39`](../../web/src/app/api/auth/register/route.ts#L39)
