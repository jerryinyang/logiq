# Story 1.5: Implement OAuth Login (GitHub & Google)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to log in with my GitHub or Google account,
So that I can onboard quickly without managing another password.

## Acceptance Criteria

1. **Given** Better Auth is configured with GitHub and Google OAuth providers, **when** I click "Sign in with GitHub" on the login page, **then** I am redirected to the OAuth provider, upon successful authorization I am redirected to the default callback path handled by Better Auth, a `users` record is automatically created if one doesn't exist (via Better Auth's adapter), and I am logged in and redirected to the dashboard.

2. **Given** I already have an email/password account, **when** I log in via OAuth using the same email address, **then** Better Auth automatically links the OAuth account to my existing user record (account linking), and I am logged in as my existing account.

## Tasks / Subtasks

- [ ] Task 1: Configure OAuth Providers in Better Auth (AC: #1)
  - [ ] Register application in GitHub Developer Settings (OAuth Apps)
  - [ ] Register application in Google Cloud Console (Credentials > OAuth 2.0 Client IDs)
  - [ ] Add OAuth credentials to environment variables (`.env`)
  - [ ] Configure GitHub provider in Better Auth config
  - [ ] Configure Google provider in Better Auth config
  - [ ] Better Auth automatically handles callback routes at `/api/auth/callback/*`
  - [ ] Configure required OAuth scopes: `user:email` for GitHub, `email profile` for Google

- [ ] Task 2: Create OAuth UI Components (AC: #1)
  - [ ] Add "Sign in with GitHub" button to login page (`/(auth)/login/page.tsx`)
  - [ ] Add "Sign in with Google" button to login page
  - [ ] Add "Sign in with GitHub" button to registration page (`/(auth)/register/page.tsx`)
  - [ ] Add "Sign in with Google" button to registration page
  - [ ] Style OAuth buttons per brand guidelines (UX-DR1)
  - [ ] Ensure ARIA labels and accessibility compliance (UX-DR13)
  - [ ] Add visual separator between OAuth and email/password login

- [ ] Task 3: Verify Better Auth OAuth Flow (AC: #1, #2)
  - [ ] Better Auth automatically handles authorization code exchange
  - [ ] Better Auth automatically creates/links user accounts via Drizzle adapter
  - [ ] Verify session creation after successful OAuth authentication
  - [ ] Verify automatic account linking for existing email/password users
  - [ ] Handle OAuth errors gracefully via Better Auth's error handling

- [ ] Task 4: Database Schema for OAuth Accounts (AC: #1)
  - [ ] Better Auth stores OAuth account links in the `account` table (via adapter)
  - [ ] Verify schema includes: `userId`, `accountId`, `provider`, `providerAccountId`, `access_token`, `refresh_token`, `expires_at`
  - [ ] No custom `oauth_accounts` table needed - Better Auth manages this
  - [ ] Create migration with `npm run db:generate` and apply with `npm run db:migrate`

- [ ] Task 5: Security & Error Handling
  - [ ] OAuth state parameter validation handled by Better Auth (prevents CSRF)
  - [ ] Token encryption at rest with bcrypt or AES-256 (NFR8) - Better Auth adapter handles storage
  - [ ] Implement rate limiting on OAuth endpoints
  - [ ] Log OAuth authentication events for security monitoring
  - [ ] Handle OAuth provider downtime gracefully
  - [ ] Verify Better Auth's built-in account linking security (email verification)

- [ ] Task 6: Testing & Quality Assurance
  - [ ] Write integration tests for OAuth flow (mock OAuth providers)
  - [ ] Test new user creation via OAuth
  - [ ] Test automatic account linking (email match, different providers)
  - [ ] Test error handling: invalid tokens, expired tokens, network failures
  - [ ] Perform accessibility audit on OAuth buttons
  - [ ] Test edge cases: special characters in names, very long emails, duplicate accounts
  - [ ] Security testing: CSRF, account takeover attempts

## Dev Notes

### Architecture Patterns & Constraints

- **Authentication Library:** Better Auth with OAuth support [Source: architecture.md#Core Architectural Decisions]
- **OAuth Providers:** GitHub and Google (as specified in epics)
- **Database Schema:** Extends `users` table from Story 1.2 or uses separate `oauth_accounts` table [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md]
- **Token Storage:** Encrypted at rest using AES-256-GCM (NFR8) [Source: epics.md#NFR8]
- **Session Management:** Same session system as email/password login (Story 1.4) [Source: 1-4-implement-user-login-with-better-auth.md]
- **File Location:** All code must be in `web/` subfolder at project root [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md#Runnable Code Location]

### Project Structure Notes

Expected structure for OAuth feature:
```
web/src/app/(auth)/
├── login/
│   └── page.tsx              # Login page with OAuth buttons (updated from Story 1.4)
├── register/
│   └── page.tsx              # Registration page with OAuth buttons (updated from Story 1.3)

web/src/app/api/auth/
├── callback/
│   ├── github/
│   │   └── route.ts          # GitHub OAuth callback handler
│   └── google/
│       └── route.ts          # Google OAuth callback handler

web/src/lib/
├── auth/
│   └── config.ts             # Better Auth config with OAuth providers (updated)
├── db/
│   └── schema/
│       ├── users.ts          # Users table (may need extension)
│       └── oauth-accounts.ts # OAuth accounts table (if separate)
└── crypto/
    └── encryption.ts         # Token encryption utilities
```

### Previous Story Intelligence

**From Story 1.2 (Database Setup):**
- Database schema is already defined in `web/src/lib/db/schema/users.ts`
- Drizzle ORM is configured with migration support
- The `users` table includes: `id` (UUID), `email` (unique, indexed), `password_hash`, `display_name`, `role` (enum), timestamps
- PostgreSQL is running via Docker Compose

**From Story 1.3 (User Registration):**
- User creation flow is established
- Zod validation schemas are in `web/src/lib/validations/auth.ts`
- Email uniqueness is enforced at database level

**From Story 1.4 (User Login):**
- Better Auth is configured for credential-based authentication
- Session management uses HTTP-only cookies
- Middleware protects authenticated routes
- Generic error messages prevent information leakage

**Key Learnings:**
- All database operations use Drizzle ORM for type safety
- Security best practices: encryption, rate limiting, CSRF protection
- Account linking requires careful handling to prevent account takeover

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library [Source: architecture.md#Testing Standards]
- **Integration Testing:** Mock OAuth providers using libraries like `msw` or test doubles
- **E2E Testing:** Playwright for full OAuth flow (may require manual testing for real OAuth)
- **Accessibility Testing:** Verify WCAG 2.1 AA compliance
- **Security Testing:** OWASP guidelines for OAuth implementation, penetration testing

### Security Requirements

- OAuth state parameter validation to prevent CSRF attacks [Source: architecture.md#Security Requirements]
- Token encryption at rest with bcrypt or AES-256 (NFR8) [Source: epics.md#NFR8]
- Rate limiting on OAuth endpoints to prevent abuse
- Account linking requires email verification to prevent account takeover
- HTTPS required for all OAuth flows in production
- Secure handling of OAuth tokens (never expose in client-side code)
- Logging of OAuth authentication events for security monitoring
- Scope minimization: only request necessary OAuth scopes

### Latest Technical Information

- **Better Auth OAuth:** Latest version supports multiple OAuth providers with automatic account linking
- **GitHub OAuth API:** v3 REST API or v4 GraphQL API for user profile retrieval
- **Google OAuth 2.0:** Use OpenID Connect for identity verification
- **Next.js 15:** App Router supports OAuth flows with server components and route handlers
- **Encryption:** Use `@noble/ciphers` or Node.js `crypto` module for token encryption

### References

- [Source: epics.md#Story 1.5] - Original story definition and acceptance criteria
- [Source: epics.md#NFR8] - Data encryption and security requirements
- [Source: architecture.md#Core Architectural Decisions] - Better Auth configuration
- [Source: architecture.md#Security Requirements] - OAuth security patterns
- [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md] - Database schema foundation
- [Source: 1-3-implement-user-registration-email-password.md] - User creation reference
- [Source: 1-4-implement-user-login-with-better-auth.md] - Session management reference
- [Source: ux-design-specification.md#UX-DR1] - Brand/color guidelines for OAuth buttons
- [Source: ux-design-specification.md#UX-DR13] - Accessibility standards

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List