# Story 1.3: Implement User Registration (Email/Password)

Status: ready-for-dev

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

- [ ] Task 1: Create Registration Page UI (AC: #1, #2, #3)
  - [ ] Create `src/app/(auth)/register/page.tsx` with registration form
  - [ ] Implement form fields: email, password, display name
  - [ ] Add client-side validation using Zod schema
  - [ ] Implement inline error display below each field
  - [ ] Disable submit button until all validations pass
  - [ ] Add welcome toast notification on success
  - [ ] Ensure ARIA labels and accessibility compliance (UX-DR13)

- [ ] Task 2: Implement Registration API Route (AC: #1, #2)
  - [ ] Create `src/app/api/auth/register/route.ts` POST handler
  - [ ] Validate input with Zod schema (email format, password ≥8 chars, required fields)
  - [ ] Check for existing user by email (prevent duplicates)
  - [ ] Hash password with bcrypt (cost factor per NFR8)
  - [ ] Create user record in `users` table with role `user`
  - [ ] Return appropriate error messages for duplicate emails
  - [ ] Implement rate limiting to prevent abuse

- [ ] Task 3: Integrate Better Auth for Session Management (AC: #1)
  - [ ] Configure Better Auth session creation after registration
  - [ ] Set HTTP-only session cookie (NFR8 security)
  - [ ] Implement redirect to dashboard after successful registration
  - [ ] Handle authentication state updates

- [ ] Task 4: Form Validation & Error Handling (AC: #3)
  - [ ] Define Zod validation schema for registration inputs
  - [ ] Implement real-time validation on blur
  - [ ] Display contextual error messages below each field
  - [ ] Prevent form submission until all validations pass
  - [ ] Handle server-side validation errors gracefully

- [ ] Task 5: Testing & Quality Assurance
  - [ ] Write unit tests for validation schema
  - [ ] Write integration tests for registration API
  - [ ] Test duplicate email handling
  - [ ] Test password hashing verification
  - [ ] Perform accessibility audit (keyboard navigation, screen reader)
  - [ ] Test edge cases: very long inputs, special characters, SQL injection attempts

- [ ] Task 6: COPPA/FERPA Compliance (AC: #4, #5)
  - [ ] Add optional age field or date of birth to registration form
  - [ ] Implement age verification logic (users under 13 require parental consent)
  - [ ] Add parental consent flow: display consent notice and store consent flag when user indicates under 13
  - [ ] Store `parental_consent` flag in `users` table (nullable, boolean)
  - [ ] Add data handling notices consistent with FERPA requirements
  - [ ] Document data retention policy for educational records

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
