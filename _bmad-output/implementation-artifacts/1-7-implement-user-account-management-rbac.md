# Story 1.7: Implement User Account Management & RBAC

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a logged-in user,
I want to view and manage my account settings,
So that I can control my profile and understand my access level.

## Acceptance Criteria

1. **Given** I am authenticated, **when** I visit `/profile`, **then** I see my display name, email, and role (from the `users` table), I can update my display name (3-50 chars), I can change my password (requires current password verification), and all changes are validated and persisted with appropriate success/error toast notifications.

2. **Given** I am updating my display name, **when** I submit an invalid name (empty, too long, or containing special characters), **then** I see inline validation errors, the form prevents submission until valid, and no database update occurs.

3. **Given** I am changing my password, **when** I enter my current password incorrectly, **then** I see an error: "Current password is incorrect", no password change occurs, and the attempt is logged for security monitoring.

4. **Given** I am changing my password, **when** I enter a valid current password and a new password (≥8 chars) with confirmation, **then** my password is updated (hashed with bcrypt per NFR8), I receive a confirmation email about the password change, all existing sessions remain active (unlike reset flow), and I see a success message.

5. **Given** I am a user with role `user`, **when** I try to access `/admin/dashboard` or any admin-only route, **then** I receive a 403 Forbidden response, I am redirected to the dashboard with an error toast: "Access denied. Admin privileges required.", and the attempt is logged for security audit.

6. **Given** I am on the profile page, **when** I click "Sign out", **then** my session is destroyed via Better Auth, I am redirected to the login page, and I see a logout confirmation message.

7. **Given** I am not authenticated, **when** I try to access `/profile`, **then** I am redirected to the login page with a return URL parameter to navigate back after authentication.

## Tasks / Subtasks

- [ ] Task 1: Create Profile Page UI (AC: #1, #2, #6, #7)
  - [ ] Create `src/app/(app)/profile/page.tsx` with profile sections
  - [ ] Display user information: display name, email, role (read-only except display name)
  - [ ] Implement display name edit form with validation
  - [ ] Add password change section with current password, new password, confirm password fields
  - [ ] Implement client-side validation using Zod schemas
  - [ ] Add inline error display below each field
  - [ ] Disable submit buttons until validations pass
  - [ ] Add success/error toast notifications for all actions
  - [ ] Include "Sign out" button with confirmation
  - [ ] Ensure ARIA labels and accessibility compliance (UX-DR13)
  - [ ] Add responsive design for mobile/desktop

- [ ] Task 2: Implement Profile Update API Route (AC: #1, #2)
  - [ ] Create `src/app/api/user/profile/route.ts` PATCH handler
  - [ ] Authenticate user via Better Auth middleware
  - [ ] Validate display name input (3-50 chars, alphanumeric + spaces, basic punctuation)
  - [ ] Check for duplicate display names (optional, based on business rules)
  - [ ] Update user record in `users` table
  - [ ] Return updated user data
  - [ ] Implement rate limiting to prevent abuse

- [ ] Task 3: Implement Password Change API Route (AC: #3, #4)
  - [ ] Create `src/app/api/user/change-password/route.ts` POST handler
  - [ ] Authenticate user via Better Auth middleware
  - [ ] Validate current password by comparing hash (bcrypt.compare)
  - [ ] Validate new password strength (≥8 chars, complexity per NFR8)
  - [ ] Verify new password matches confirmation
  - [ ] Hash new password with bcrypt
  - [ ] Update password_hash in database
  - [ ] Keep existing sessions active (different from reset flow)
  - [ ] Send password change confirmation email
  - [ ] Log password change event for security audit
  - [ ] Return appropriate error messages

- [ ] Task 4: Implement Role-Based Access Control (RBAC) Middleware (AC: #5)
  - [ ] Create `src/middleware.ts` route protection logic (extend from Story 1.4)
  - [ ] Define role hierarchy: `admin` > `creator` > `user` (per epics.md RBAC specification)
  - [ ] Create route-to-role mapping configuration
  - [ ] Implement middleware check for protected routes
  - [ ] Return 403 Forbidden for insufficient permissions
  - [ ] Log unauthorized access attempts
  - [ ] Use Better Auth's built-in session and role helpers where applicable
  - [ ] Add helper function: `hasRole(user, requiredRole)`
  - [ ] Add server-side role checking for API routes

- [ ] Task 5: Create Admin Dashboard Shell (AC: #5)
  - [ ] Create `src/app/(app)/admin/dashboard/page.tsx`
  - [ ] Add middleware protection requiring `admin` role
  - [ ] Display basic admin interface placeholder
  - [ ] Show admin-only navigation items
  - [ ] Include role indicator in UI

- [ ] Task 6: Implement Logout Functionality (AC: #6)
  - [ ] Create logout server action or API route
  - [ ] Integrate with Better Auth session invalidation
  - [ ] Clear HTTP-only session cookies
  - [ ] Redirect to login page
  - [ ] Show logout confirmation toast

- [ ] Task 7: Email Notification for Password Change (AC: #4)
  - [ ] Extend email service from Story 1.6
  - [ ] Create password change confirmation email template
  - [ ] Include timestamp and device info if available
  - [ ] Add "Did not make this change?" security warning with support contact
  - [ ] Implement email sending function

- [ ] Task 8: Security Audit Logging (AC: #3, #4, #5)
  - [ ] Create `audit_logs` table schema (if not exists)
  - [ ] Log failed password attempts
  - [ ] Log successful password changes
  - [ ] Log unauthorized access attempts
  - [ ] Include: user_id, action, ip_address, user_agent, timestamp, metadata
  - [ ] Create query functions for audit log retrieval

- [ ] Task 9: Testing & Quality Assurance
  - [ ] Write unit tests for validation schemas
  - [ ] Write integration tests for profile update API
  - [ ] Write integration tests for password change API
  - [ ] Write integration tests for RBAC middleware
  - [ ] Test role-based route protection
  - [ ] Test session management after password change
  - [ ] Test email notification delivery
  - [ ] Perform accessibility audit (keyboard navigation, screen reader)
  - [ ] Test edge cases: concurrent updates, SQL injection, XSS attempts
  - [ ] Load test profile page with multiple users

## Dev Notes

### Architecture Patterns & Constraints

- **Authentication Library:** Better Auth (established in Epic 1) [Source: architecture.md#Core Architectural Decisions]
- **Password Hashing:** bcrypt with cost factor 12 (NFR8) [Source: epics.md#NFR8]
- **Database Schema:** Uses `users` table from Story 1.2 with role enum column [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md]
- **Validation:** Zod schema for both client and server-side validation
- **Security:** HTTP-only cookies, audit logging, role-based access control [Source: architecture.md#Security Requirements]
- **File Location:** All code must be in `web/` subfolder at project root [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md#Runnable Code Location]

### Project Structure Notes

Expected structure for account management feature:
```
web/src/app/(app)/
├── profile/
│   └── page.tsx              # User profile/settings page
└── admin/
    └── dashboard/
        └── page.tsx          # Admin dashboard (protected)

web/src/app/api/user/
├── profile/
│   └── route.ts              # PATCH handler for profile updates
└── change-password/
    └── route.ts              # POST handler for password changes

web/src/lib/
├── db/
│   └── schema/
│       ├── users.ts          # Users table (from Story 1.2)
│       └── audit-logs.ts     # Audit logs table (new)
├── email/
│   └── templates/
│       └── password-change.tsx  # Password change email template
├── validations/
│   └── profile.ts            # Zod schemas for profile forms
└── auth/
    └── rbac.ts               # Role-based access control utilities

web/src/middleware.ts         # Extended with RBAC logic
```

### Previous Story Intelligence

**From Story 1.2 (Database Setup):**
- `users` table schema includes: `id`, `email`, `password_hash`, `display_name`, `role` (enum), timestamps
- Role enum values: `user`, `creator`, `admin` (per epics.md RBAC specification)
- Drizzle ORM configured for type-safe queries

**From Story 1.3 (User Registration):**
- Zod validation schemas in `web/src/lib/validations/auth.ts`
- Password hashing pattern with bcrypt
- Display name validation patterns

**From Story 1.4 (User Login):**
- Better Auth session management configured
- Next.js middleware for route protection
- Session cookie handling
- Login/logout flow patterns

**From Story 1.6 (Password Reset):**
- Email service configuration
- Audit logging patterns
- Security event logging
- Email template structure

**Key Learnings:**
- All database operations use Drizzle ORM
- Environment variables for sensitive configuration
- HTTP-only cookies for session management
- Generic error messages for security
- Middleware pattern for route protection

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library [Source: architecture.md#Testing Standards]
- **Integration Testing:** Test API routes with mock database
- **E2E Testing:** Playwright for full profile management flow
- **Accessibility Testing:** Verify WCAG 2.1 AA compliance
- **Security Testing:** OWASP guidelines for account management
- **RBAC Testing:** Test all role combinations and route protections

### Security Requirements

- **Password Change Verification:** Current password must be verified before allowing change

- **Session Management:** Unlike password reset, password change keeps sessions active (user is already authenticated)

- **Audit Logging:** All sensitive actions must be logged:
  - Failed password attempts
  - Successful password changes
  - Unauthorized access attempts
  - Profile modifications

- **Rate Limiting:** Prevent brute force attacks on password change endpoint

- **Input Validation:** Sanitize all inputs to prevent XSS and SQL injection

- **Role-Based Access:** Strict enforcement of role requirements on all protected routes

- **Email Notifications:** Send confirmation emails for password changes (security best practice)

- **HTTPS Required:** All account management endpoints require HTTPS in production

### Role Hierarchy

```
admin     - Full system access, can access /admin/* routes
creator   - Challenge design mode, can create and manage own challenges
user      - Standard user access, can only access personal profile
```

### Latest Technical Information

- **Better Auth:** Supports custom session validation and role-based middleware. Uses built-in session management via HTTP-only cookies - verify if custom middleware is needed or if Better Auth's role-based helpers can be used.
- **Next.js 15:** Middleware runs on Edge runtime for performance
- **bcrypt:** Use same cost factor as registration for consistency
- **Zod:** v3.x provides schema validation with TypeScript inference
- **Email Services:** Use same provider configured in Story 1.6
- **Role Enum:** Use `user`, `creator`, `admin` per epics.md (NOT moderator)

### References

- [Source: epics.md#Story 1.7] - Original story definition and acceptance criteria
- [Source: epics.md#NFR8] - Data encryption and security requirements
- [Source: architecture.md#Core Architectural Decisions] - Better Auth configuration
- [Source: architecture.md#Security Requirements] - Authentication security patterns
- [Source: 1-2-set-up-postgresql-database-schema-drizzle-orm.md] - Database schema foundation
- [Source: 1-3-implement-user-registration-email-password.md] - Password hashing patterns
- [Source: 1-4-implement-user-login-with-better-auth.md] - Session management and middleware
- [Source: 1-6-implement-password-reset-flow.md] - Email service and audit logging
- [Source: ux-design-specification.md#UX-DR13] - Accessibility standards

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List