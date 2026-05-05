# Story 1.6: Implement Password Reset Flow

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user who forgot my password,
I want to reset my password via email,
So that I can regain access to my account.

## Acceptance Criteria

1. **Given** I am on the login page (`/(auth)/login`), **when** I click "Forgot password?" and enter my registered email, **then** a password reset email is sent with a time-limited token link (expires in 1 hour), I see a generic confirmation message: "If an account exists with this email, you'll receive a reset link", and no error is shown even if the email doesn't exist (security).

2. **Given** I received the password reset email, **when** I click the link and navigate to `/(auth)/reset-password?token=<token>`, **then** the token is validated for existence and expiration, I can enter a new password (≥8 chars) with confirmation, and the form shows validation errors for weak passwords or mismatched confirmations.

3. **Given** I have a valid reset token, **when** I submit a new password, **then** my password is updated in the database (hashed with bcrypt per NFR8), all existing sessions are invalidated (security), the reset token is consumed/invalidated, I am redirected to the login page with a success message: "Password reset successfully. Please log in with your new password."

4. **Given** I try to use an expired or invalid reset token, **when** I navigate to the reset password page, **then** I see an error: "Invalid or expired reset link", I am offered to request a new reset link, and no password change is allowed.

## Tasks / Subtasks

- [ ] Task 1: Create Forgot Password Request Page UI (AC: #1)
  - [ ] Create `src/app/(auth)/forgot-password/page.tsx` with email input form
  - [ ] Add "Back to Login" link
  - [ ] Implement client-side email validation using Zod schema
  - [ ] Display generic success message after submission (prevent email enumeration)
  - [ ] Ensure ARIA labels and accessibility compliance (UX-DR13)

- [ ] Task 2: Implement Forgot Password API Route (AC: #1)
  - [ ] Create `src/app/api/auth/forgot-password/route.ts` POST handler
  - [ ] Validate email format with Zod schema
  - [ ] Look up user by email (silently fail if not found for security)
  - [ ] Generate cryptographically secure reset token (crypto.randomBytes)
  - [ ] Store token hash with expiration timestamp in `password_reset_tokens` table
  - [ ] Send reset email via email service (configure provider in .env)
  - [ ] Implement rate limiting (max 3 requests per email per hour)
  - [ ] Return generic success response regardless of email existence

- [ ] Task 3: Create Reset Password Page UI (AC: #2, #4)
  - [ ] Create `src/app/(auth)/reset-password/page.tsx` with token validation
  - [ ] Extract token from query parameter
  - [ ] Validate token on page load (show error if invalid/expired)
  - [ ] Implement form fields: new password, confirm password
  - [ ] Add client-side validation (password ≥8 chars, match confirmation)
  - [ ] Display inline validation errors below each field
  - [ ] Disable submit button until validations pass
  - [ ] Show "Request New Link" option for expired/invalid tokens

- [ ] Task 4: Implement Reset Password API Route (AC: #2, #3, #4)
  - [ ] Create `src/app/api/auth/reset-password/route.ts` POST handler
  - [ ] Validate token existence and expiration (1 hour TTL)
  - [ ] Validate new password strength (≥8 chars, complexity requirements)
  - [ ] Hash new password with bcrypt (cost factor per NFR8)
  - [ ] Update user's password_hash in database
  - [ ] Invalidate all existing sessions for the user (security)
  - [ ] Delete/consume the used reset token
  - [ ] Return appropriate error messages for invalid/expired tokens

- [ ] Task 5: Database Schema for Reset Tokens (AC: #1, #3)
  - [ ] Create `password_reset_tokens` table schema in Drizzle ORM
  - [ ] Columns: `id` (UUID), `user_id` (FK to users), `token_hash` (indexed), `expires_at` (timestamp), `created_at`
  - [ ] Add index on `token_hash` for fast lookups
  - [ ] Add cascade delete when user is deleted
  - [ ] Create migration file for new table

- [ ] Task 6: Email Service Integration (AC: #1)
  - [ ] Configure email provider (Resend, SendGrid, or SMTP) in `.env`
  - [ ] Create email template for password reset
  - [ ] Include reset link with token parameter
  - [ ] Add branding and clear instructions
  - [ ] Implement email sending function/service

- [ ] Task 7: Session Invalidation Logic (AC: #3)
  - [ ] Integrate with Better Auth session management
  - [ ] Revoke all active sessions for the user after password reset
  - [ ] Clear session cookies on next request
  - [ ] Log security event for audit trail

- [ ] Task 8: Testing & Quality Assurance
  - [ ] Write unit tests for token generation and validation
  - [ ] Write integration tests for forgot password flow
  - [ ] Write integration tests for reset password flow
  - [ ] Test token expiration handling
  - [ ] Test session invalidation after reset
  - [ ] Test rate limiting on forgot password endpoint
  - [ ] Test email enumeration prevention
  - [ ] Perform accessibility audit
  - [ ] Test edge cases: SQL injection, XSS attempts, very long tokens

## Dev Notes

### Architecture Patterns & Constraints

- **Authentication Library:** Better Auth (established in Epic 1) [Source: architecture.md#Core Architectural Decisions]
- **Password Hashing:** bcrypt with cost factor 12 (NFR8) [Source: epics.md#NFR8]
- **Token Generation:** Node.js crypto module for cryptographically secure random bytes
- **Token Storage:** Hash tokens before storing (never store plain text tokens)
- **Email Service:** Configurable provider via environment variables (Resend recommended for Next.js)
- **Security:** Generic error messages, rate limiting, token expiration, session invalidation [Source: architecture.md#Security Requirements]
- **File Location:** All code must be in `web/` subfolder at project root [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md#Runnable Code Location]

### Project Structure Notes

Expected structure for password reset feature:
```
web/src/app/(auth)/
├── forgot-password/
│   └── page.tsx              # Forgot password request form
├── reset-password/
│   └── page.tsx              # Reset password form with token validation
└── login/
    └── page.tsx              # Login page (add "Forgot password?" link)

web/src/app/api/auth/
├── forgot-password/
│   └── route.ts              # POST handler for reset token generation
└── reset-password/
    └── route.ts              # POST handler for password reset

web/src/lib/
├── db/
│   └── schema/
│       └── password-reset-tokens.ts  # Reset tokens table schema
├── email/
│   └── templates/
│       └── reset-password.tsx        # Email template component
└── validations/
    └── auth.ts                       # Zod schemas (extend from Story 1.3)
```

### Previous Story Intelligence

**From Story 1.3 (User Registration):**
- Zod validation schemas established in `web/src/lib/validations/auth.ts`
- bcrypt password hashing pattern implemented
- User lookup patterns using Drizzle ORM
- Form validation and error display patterns

**From Story 1.4 (User Login):**
- Better Auth session management configured
- Session cookie handling established
- Generic error message patterns for security
- Login page location and structure

**From Story 1.5 (OAuth Login):**
- Email service configuration patterns
- Security best practices for authentication flows

**Key Learnings:**
- All database operations use Drizzle ORM for type safety
- Environment variables for sensitive configuration
- HTTP-only cookies for session management
- Generic error messages prevent information disclosure

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library [Source: architecture.md#Testing Standards]
- **Integration Testing:** Test API routes with mock database and email service
- **E2E Testing:** Playwright for full password reset flow
- **Accessibility Testing:** Verify WCAG 2.1 AA compliance
- **Security Testing:** OWASP guidelines for password reset flows
- **Email Testing:** Use test mode or mock email service in development

### Security Requirements

- **Token Security:**
  - Generate tokens with `crypto.randomBytes(32)`
  - Hash tokens before storing (SHA-256)
  - Never log or expose raw tokens
  - One-time use tokens (invalidate after use)

- **Token Expiration:** 1 hour TTL (configurable via environment variable)

- **Rate Limiting:** Max 3 reset requests per email per hour to prevent abuse

- **Email Enumeration Prevention:** Always return generic success message regardless of email existence

- **Session Invalidation:** All existing sessions must be revoked after password reset (critical security requirement)

- **Password Requirements:** Same as registration (≥8 chars, complexity rules per NFR8)

- **HTTPS Required:** All password reset endpoints require HTTPS in production

### Latest Technical Information

- **Better Auth:** Supports session revocation via `revokeUserSessions(userId)` method
- **bcrypt:** Use same cost factor as registration for consistency
- **Node.js crypto:** `crypto.randomBytes()` for secure token generation
- **Email Services:** Resend (recommended for Next.js), SendGrid, or SMTP via nodemailer
- **Next.js 15:** Use App Router patterns, server actions for form submissions

### References

- [Source: epics.md#Story 1.6] - Original story definition and acceptance criteria
- [Source: epics.md#NFR8] - Data encryption and security requirements
- [Source: architecture.md#Core Architectural Decisions] - Better Auth configuration
- [Source: architecture.md#Security Requirements] - Authentication security patterns
- [Source: 1-3-implement-user-registration-email-password.md] - Password hashing patterns
- [Source: 1-4-implement-user-login-with-better-auth.md] - Session management patterns
- [Source: ux-design-specification.md#UX-DR13] - Accessibility standards

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List