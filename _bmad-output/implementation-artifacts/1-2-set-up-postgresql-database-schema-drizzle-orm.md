# Story 1.2: Set Up PostgreSQL Database Schema & Drizzle ORM

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a versioned PostgreSQL schema with Drizzle ORM,
So that all user and authentication data is stored reliably and type-safely.

## Acceptance Criteria

1. **Given** a local PostgreSQL running via `docker compose`, **when** Drizzle ORM is installed and configured (`drizzle.config.ts`), **then** the schema domain files exist in `lib/db/schema/`: `users.ts`, `enums.ts`, and the barrel re-export is at `lib/db/schema.ts`.

2. **Given** Drizzle is configured, **when** I run `npm run db:generate`, **then** migration files are produced without errors.

3. **Given** migrations are generated, **when** I run `npm run db:migrate`, **then** migrations are applied to the local PostgreSQL database without errors.

4. **Given** the `users` table schema, **when** it is defined, **then** it includes: `id` (UUID PK), `email` (unique, indexed), `password_hash`, `display_name`, `role` (enum: user/creator/admin), `created_at`, `updated_at`, `session_token`, `session_expires_at`, and column naming follows `snake_case` convention per Architecture standards.

## Tasks / Subtasks

- [ ] Task 1: Set Up Local PostgreSQL via Docker (AC: #1)
  - [ ] Create `docker-compose.yml` with PostgreSQL service
  - [ ] Configure environment variables for database connection (host, port, user, password, database name)
  - [ ] Ensure database starts and is accessible
  - [ ] Add `.env.example` with required database env vars

- [ ] Task 2: Install and Configure Drizzle ORM (AC: #1, #2, #3)
  - [ ] Install `drizzle-orm` and `drizzle-kit`
  - [ ] Create `drizzle.config.ts` with database connection config
  - [ ] Set up `src/lib/db/` directory structure
  - [ ] Create `src/lib/db/index.ts` for database connection pool
  - [ ] Add npm scripts: `db:generate`, `db:migrate`, `db:push`, `db:studio`

- [ ] Task 3: Define Database Enums (AC: #4)
  - [ ] Create `src/lib/db/schema/enums.ts`
  - [ ] Define `user_role` enum with values: `user`, `creator`, `admin`
  - [ ] Export enum for use in other schema files

- [ ] Task 4: Define Users Table Schema (AC: #4)
  - [ ] Create `src/lib/db/schema/users.ts`
  - [ ] Define `users` table with columns:
    - `id` (UUID, primary key, default: `gen_random_uuid()`)
    - `email` (varchar, unique, indexed, not null)
    - `password_hash` (varchar, nullable - null for OAuth-only users)
    - `display_name` (varchar, not null)
    - `role` (enum: user/creator/admin, default: `user`)
    - `created_at` (timestamp, default: `now()`)
    - `updated_at` (timestamp, default: `now()`)
    - `session_token` (varchar, nullable)
    - `session_expires_at` (timestamp, nullable)
  - [ ] Use `snake_case` for all column names per architecture standards
  - [ ] Add indexes on `email` column

- [ ] Task 5: Create Barrel Re-export (AC: #1)
  - [ ] Create `src/lib/db/schema.ts` barrel file
  - [ ] Re-export all schema modules from `schema/` directory

- [ ] Task 6: Generate and Apply Migrations (AC: #2, #3)
  - [ ] Run `npm run db:generate` and verify migration files are created
  - [ ] Run `npm run db:migrate` and verify tables are created in PostgreSQL
  - [ ] Verify schema with `drizzle-kit studio` or database query

## Runnable Code Location

All runnable code (database schema, Drizzle config, etc.) MUST be created in the `web/` subfolder at the project root, NOT in the root directory. This avoids conflicts with architectural docs and BMad tooling.

- Project root for code: `/home/l2e/smirk/logiq/web/`
- Example: `web/src/lib/db/`, `web/drizzle.config.ts`, etc.

## Dev Notes

### Architecture Patterns & Constraints

- **Database:** PostgreSQL + Drizzle ORM v0.45 [Source: architecture.md#Core Architectural Decisions]
- **Column Naming:** `snake_case` for database columns per Architecture standards [Source: architecture.md#Database Naming Convention]
- **Schema Organization:** Domain files in `lib/db/schema/`, barrel re-export at `lib/db/schema.ts` [Source: architecture.md#Project Structure]
- **Infrastructure & Deployment:**
  - Development: local Docker PostgreSQL
  - Preview: Vercel preview with isolated DB branch
  - Production: Vercel production with primary PostgreSQL
  - Drizzle Kit for schema migrations (type-safe, versioned, rollback support) [Source: architecture.md#Infrastructure & Deployment]

### Project Structure Notes

- Expected structure:
```
web/src/lib/db/
├── index.ts              # Database connection pool export
├── schema.ts             # Barrel re-export of all schema modules
├── schema/
│   ├── enums.ts          # PostgreSQL enum definitions
│   └── users.ts          # Users table schema
drizzle.config.ts         # Drizzle Kit configuration
drizzle/                  # Generated migrations (auto-created)
docker-compose.yml        # Local PostgreSQL service
```

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library
- For this story: verify schema definitions, migration generation, and migration application
- Consider adding a simple integration test that verifies database connection [Source: architecture.md#Testing Standards]

### Security Requirements

- All user data encrypted at rest and in transit (NFR8) [Source: epics.md#NFR8]
- Password hashing with bcrypt (used in Story 1.3) [Source: epics.md#Story 1.3]

### References

- [Source: architecture.md#Core Architectural Decisions] - PostgreSQL + Drizzle ORM v0.45
- [Source: architecture.md#Database Naming Convention] - snake_case for columns
- [Source: architecture.md#Project Structure] - Schema organization
- [Source: architecture.md#Infrastructure & Deployment] - Drizzle Kit migrations
- [Source: epics.md#Story 1.2] - Original story definition
- [Source: epics.md#NFR8] - Data encryption requirement

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
