# Story 1.4: Implement User Login with Better Auth

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a registered user,
I want to log in with my email and password,
So that I can access my account and resume my learning journey.

## Acceptance Criteria

1. **Given** I have a registered account, **when** I visit the login page (`/(auth)/login`) and enter correct credentials, **then** I am authenticated and redirected to the dashboard, a secure HTTP-only session cookie is set (NFR8), and the session expires after 30 days of inactivity (NFR9).

2. **Given** I have a registered account with "Remember me" selected, **when** I log in with correct credentials, **then** the session is extended to 90 days (per NFR9 for persistent sessions), the "remember me" preference is stored in the session configuration, and I remain logged in across browser sessions.

3. **Given** I am on the login page, **when** I enter an incorrect password, **then** I see an error message: "Invalid email or password", and the error message does not reveal whether the email exists in the system (security best practice).

3. **Given** I am not authenticated, **when** I try to access a protected route like `/dashboard`, **then** I am redirected to `/login` by the Next.js middleware (`src/middleware.ts`).

## Tasks / Subtasks

- [ ] Task 1: Create Login Page UI (AC: #1, #2, #3)
  - [ ] Create `src/app/(auth)/login/page.tsx` with login form
  - [ ] Implement form fields: email, password
  - [ ] Add client-side validation using Zod schema
  - [ ] Implement inline error display below each field
  - [ ] Add "Forgot password?" link (prepares for Story 1.6)
  - [ ] Display generic error message for failed logins
  - [ ] Ensure ARIA labels and accessibility compliance (UX-DR13)
  - [ ] Add "Remember me" checkbox for extended session (AC: #2)

- [ ] Task 2: Implement Login API Route (AC: #1, #2)
  - [ ] Create `src/app/api/auth/login/route.ts` POST handler
  - [ ] Validate input with Zod schema (email format, required fields)
  - [ ] Query user by email from database
  - [ ] Verify password hash with bcrypt comparison
  - [ ] Use timing-safe comparison to prevent enumeration attacks
  - [ ] Return generic error message for any authentication failure
  - [ ] Implement rate limiting to prevent brute force attacks
  - [ ] Log failed login attempts for security monitoring

- [ ] Task 3: Integrate Better Auth Session Management (AC: #1, #2)
  - [ ] Configure Better Auth credential provider
  - [ ] Create session on successful authentication
  - [ ] Set HTTP-only session cookie with secure flags (NFR8)
  - [ ] Configure session expiration: 30 days inactivity (NFR9)
  - [ ] Implement "Remember me" option: extend session to 90 days when selected (NFR9)
  - [ ] Implement redirect to dashboard after successful login
  - [ ] Handle authentication state updates in client components

- [ ] Task 4: Implement Auth Middleware (AC: #3)
  - [ ] Create `src/middleware.ts` for route protection
  - [ ] Define protected routes pattern (e.g., `/dashboard`, `/challenge/*`)
  - [ ] Check session validity on protected route access
  - [ ] Redirect unauthenticated users to `/login`
  - [ ] Preserve intended destination for post-login redirect
  - [ ] Exclude public routes: `/(auth)/*`, `/`, `/api/*`

- [ ] Task 5: Form Validation & Error Handling (AC: #2)
  - [ ] Define Zod validation schema for login inputs
  - [ ] Implement real-time validation on blur
  - [ ] Display contextual error messages below each field
  - [ ] Prevent form submission until all validations pass
  - [ ] Handle server-side validation errors gracefully
  - [ ] Implement loading state during authentication

- [ ] Task 6: Testing & Quality Assurance
  - [ ] Write unit tests for validation schema
  - [ ] Write integration tests for login API
  - [ ] Test password verification logic
  - [ ] Test middleware protection on various routes
  - [ ] Test session cookie configuration
  - [ ] Perform accessibility audit (keyboard navigation, screen reader)
  - [ ] Test edge cases: SQL injection, XSS attempts, rate limiting
  - [ ] Test concurrent session handling

## Dev Notes

### Architecture Patterns & Constraints

- **Authentication Library:** Better Auth (established in Epic 1) [Source: architecture.md#Core Architectural Decisions]
- **Password Verification:** bcrypt comparison with cost factor 12 from Story 1.3 [Source: epics.md#NFR8]
- **Database Schema:** Uses `users` table from Story 1.2 [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md]
- **Session Storage:** Database-backed sessions via Better Auth [Source: architecture.md#Session Management]
- **Validation:** Zod schema for both client and server-side validation
- **Security:** HTTP-only cookies, rate limiting, timing-safe comparisons [Source: architecture.md#Security Requirements]
- **File Location:** All code must be in `web/` subfolder at project root [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md#Runnable Code Location]

### Project Structure Notes

Expected structure for login feature:
```
web/src/app/(auth)/login/
├── page.tsx              # Login page component

web/src/app/api/auth/
├── login/
│   └── route.ts          # POST handler for login

web/src/
├── middleware.ts         # Next.js middleware for route protection
├── lib/
│   ├── validations/
│   │   └── auth.ts       # Zod schemas for auth forms (shared with Story 1.3)
│   ├── db/
│   │   └── schema/
│   │       └── users.ts  # Users table schema (from Story 1.2)
│   └── auth/
│       └── config.ts     # Better Auth configuration
```

### Previous Story Intelligence

**From Story 1.2 (Database Setup):**
- Database schema is already defined in `web/src/lib/db/schema/users.ts`
- Drizzle ORM is configured with migration support
- The `users` table includes: `id` (UUID), `email` (unique, indexed), `password_hash`, `display_name`, `role` (enum), timestamps
- PostgreSQL is running via Docker Compose

**From Story 1.3 (User Registration):**
- Registration creates users with bcrypt-hashed passwords
- Zod validation schemas are in `web/src/lib/validations/auth.ts`
- Better Auth is configured for session management
- Email/password authentication flow is established

**Key Learnings:**
- All database operations use Drizzle ORM for type safety
- Security best practices: generic error messages, rate limiting, timing-safe comparisons
- Session cookies must be HTTP-only and secure in production

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library [Source: architecture.md#Testing Standards]
- **Integration Testing:** Test API routes with mock database
- **E2E Testing:** Playwright for full login flow
- **Accessibility Testing:** Verify WCAG 2.1 AA compliance
- **Security Testing:** OWASP guidelines for authentication flows, penetration testing for common vulnerabilities

### Security Requirements

- Password verification with bcrypt (NFR8) [Source: epics.md#NFR8]
- Generic error messages to prevent email enumeration [Source: architecture.md#Security Requirements]
- Rate limiting on login endpoint (recommend: 5 attempts per minute per IP)
- HTTP-only, secure, same-site cookies for sessions
- Session expiration after 30 days of inactivity (NFR9) [Source: epics.md#NFR9]
- HTTPS required for all auth endpoints in production
- CSRF protection on all state-changing operations
- Logging of failed login attempts for security monitoring

### Latest Technical Information

- **Better Auth:** Latest stable version supports Next.js 15 App Router with middleware
- **Next.js 15 Middleware:** Use Edge Runtime for optimal performance
- **bcrypt:** Use constant-time comparison functions to prevent timing attacks
- **Zod:** v3.x provides schema validation with TypeScript inference
- **Rate Limiting:** Consider using `@upstash/ratelimit` or similar for distributed rate limiting

### References

- [Source: epics.md#Story 1.4] - Original story definition and acceptance criteria
- [Source: epics.md#NFR8] - Data encryption and security requirements
- [Source: epics.md#NFR9] - Session timeout requirements
- [Source: architecture.md#Core Architectural Decisions] - Better Auth configuration
- [Source: architecture.md#Security Requirements] - Authentication security patterns
- [Source: architecture.md#Session Management] - Session storage strategy
- [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md] - Database schema foundation
- [Source: 1-3-implement-user-registration-email-password.md] - Registration implementation reference
- [Source: ux-design-specification.md#UX-DR13] - Accessibility standards

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List