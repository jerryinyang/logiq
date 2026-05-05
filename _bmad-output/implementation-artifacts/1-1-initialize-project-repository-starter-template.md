# Story 1.1: Initialize Project Repository & Starter Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a configured Next.js 15 project with TypeScript, Tailwind, ESLint, and shadcn/ui,
So that the team has a consistent, production-ready foundation to build on.

## Acceptance Criteria

1. **Given** an empty repository, **when** I run `npx create-next-app@latest` with `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`, **then** the project scaffolds with App Router, TypeScript strict mode, and Tailwind CSS 4.

2. **Given** the initialized project, **when** `npx shadcn@latest init` is run, **then** shadcn/ui is initialized with default components.

3. **Given** the project is set up, **when** I run `npm run dev`, **then** the dev server starts with HMR and the app is accessible.

4. **Given** the project is set up, **when** I run `npm run build`, **then** the build completes without errors.

5. **Given** the initialized project, **when** I review `tsconfig.json`, **then** strict mode is enabled (`"strict": true`) and import alias `@/*` is configured.

6. **Given** the project is set up, **when** I review `tailwind.config.js` (or Tailwind CSS 4 config), **then** design tokens from UX-DR1 (color palette) and UX-DR3 (spacing scale) are defined as CSS custom properties.

## Tasks / Subtasks

- [x] Task 1: Initialize Next.js 15 Project (AC: #1, #3, #4)
  - [x] Run `npx create-next-app@latest` with required flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - [x] Verify project structure: App Router in `src/app/`, TypeScript config, Tailwind config, ESLint config
  - [x] Ensure `npm run dev` starts successfully with HMR
  - [x] Ensure `npm run build` completes without errors

- [x] Task 2: Configure TypeScript Strict Mode (AC: #5)
  - [x] Verify `"strict": true` in `tsconfig.json`
  - [x] Verify `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }` are configured
  - [x] Ensure no TypeScript errors across the project

- [x] Task 3: Initialize shadcn/ui (AC: #2)
  - [x] Run `npx shadcn@latest init`
  - [x] Configure shadcn/ui with default style (New York or Default)
  - [x] Verify shadcn/ui components directory is set up at `src/components/ui/`
  - [x] Install initial base components: button, input, card, dialog, toast, dropdown-menu, select, label, separator, badge, tooltip, skeleton, alert, avatar

- [x] Task 4: Configure Tailwind Design Tokens (AC: #6)
  - [x] Define CSS custom properties for UX-DR1 color palette in global CSS:
    - Primary Indigo (#6366F1)
    - Success Emerald (#10B981)
    - Error Rose (#F43F5E)
    - Warning Amber (#F59E0B)
    - Info Sky (#0EA5E9)
    - Insight Violet (#8B5CF6)
    - Neutral Backgrounds Slate (#0F172A/#1E293B)
    - Neutral Text Slate (#F8FAFC/#94A3B8)
  - [x] Define UX-DR3 spacing scale as CSS variables (4, 8, 12, 16, 24, 32, 48, 64, 96px)
  - [x] Map Tailwind CSS config to use these CSS custom properties
  - [x] Configure dark mode support (dark-mode-first per UX-DR1)

## Runnable Code Location

All runnable code (Next.js app, components, etc.) MUST be created in the `web/` subfolder at the project root, NOT in the root directory. This avoids conflicts with architectural docs and BMad tooling.

- Project root: `/home/l2e/smirk/logiq/web/`
- Example: `web/src/app/`, `web/src/components/`, etc.

## Dev Notes

### Architecture Patterns & Constraints

- **Starter Template:** Next.js 15 App Router created via `npx create-next-app@latest` with TypeScript, Tailwind CSS, ESLint, App Router, src directory, and import alias `@/*`. shadcn/ui initialized via `npx shadcn@latest init`. [Source: architecture.md#Starter Template Selection]
- **Technology Stack:**
  - Frontend: Next.js 15 + React 19 + TypeScript strict mode
  - Styling: Tailwind CSS 4 + shadcn/ui + CSS custom properties for design tokens
  - Testing: Vitest + Testing Library (unit), Playwright (E2E) [Source: architecture.md#Technology Stack]
- **Code Structure:**
  - All source code under `src/` directory
  - Import alias `@/*` maps to `./src/*`
  - Components organized in `src/components/` with `ui/` subdirectory for shadcn/ui components
  - Pages in `src/app/` using Next.js App Router conventions [Source: architecture.md#Project Structure]

### Project Structure Notes

- Expected structure after initialization:
```
web/src/
├── app/                    # Next.js App Router pages & layouts
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities, configs, shared code
└── styles/                 # Global styles with design tokens
    └── globals.css         # Tailwind directives + CSS custom properties
```

### Testing Standards

- **Unit Testing Framework:** Vitest + Testing Library
- **E2E Testing Framework:** Playwright
- For this story: verify build succeeds, dev server starts, and basic component rendering tests [Source: architecture.md#Testing Standards]

### References

- [Source: architecture.md#Starter Template Selection] - Next.js 15 + shadcn/ui initialization
- [Source: architecture.md#Technology Stack] - Full tech stack with versions
- [Source: architecture.md#Project Structure] - Folder organization and naming conventions
- [Source: ux-design-specification.md#UX-DR1] - Design Token System (color palette)
- [Source: ux-design-specification.md#UX-DR3] - Spacing & Layout (spacing scale)
- [Source: epics.md#Story 1.1] - Original story definition

## Dev Agent Record

### Agent Model Used

GLM-5.1

### Debug Log References

### Completion Notes List

- Restructured existing project to use `src/` directory convention (moved `app/`, `components/`, `lib/`, `hooks/`, `middleware.ts` into `src/`)
- Configured `tsconfig.json` with `"strict": true`, `"baseUrl": "."`, and `"paths": { "@/*": ["./src/*"] }`
- Verified shadcn/ui already initialized with New York style; all 14 required base components present in `src/components/ui/`
- Replaced default design tokens in `src/app/globals.css` with logiq-specific UX-DR1 color palette (Primary Indigo, Success Emerald, Error Rose, Warning Amber, Info Sky, Insight Violet, Slate neutral backgrounds/text) using oklch color space
- Added UX-DR3 spacing scale as CSS custom properties (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- Configured Tailwind CSS `@theme` block to map design tokens to utility classes
- Implemented dark-mode-first theming: `:root` uses dark theme colors (Slate backgrounds), `.dark` class overrides for light-variant adjustments
- Added semantic color tokens: `--success`, `--warning`, `--info`, `--insight` mapped to UX-DR1 palette colors
- Updated `src/app/layout.tsx` to use Inter (primary) and JetBrains Mono (secondary/code) fonts per UX spec
- Fixed TypeScript error in `logiq-logo.tsx` (framer-motion `ease` string type)
- Created `.env.local` and `.env.example` with placeholder Supabase environment variables
- Removed `typescript.ignoreBuildErrors` from `next.config.mjs` for production quality
- Build (`npm run build`) and dev server (`npm run dev`) both verified working
- TypeScript type check (`npx tsc --noEmit`) passes with zero errors

### File List

- web/src/app/globals.css (modified - added logiq design tokens, UX-DR1 colors, UX-DR3 spacing, dark-mode-first theming)
- web/src/app/layout.tsx (modified - Inter/JetBrains Mono fonts, updated metadata)
- web/src/components/logiq-logo.tsx (modified - fixed framer-motion type error)
- web/tsconfig.json (modified - added baseUrl, updated paths to ./src/*)
- web/components.json (modified - updated css path to src/app/globals.css)
- web/next.config.mjs (modified - removed ignoreBuildErrors)
- web/.env.local (created - placeholder Supabase env vars)
- web/.env.example (created - environment variable template)
- web/src/middleware.ts (moved from web/middleware.ts)
- web/src/app/ (moved from web/app/)
- web/src/components/ (moved from web/components/)
- web/src/lib/ (moved from web/lib/)
- web/src/hooks/ (moved from web/hooks/)

### Review Findings

- [x] [Review][Decision] `package.json` name is `"my-project"` not `"logiq"` — resolved: renamed to `"logiq-web"` per architecture.md
- [x] [Review][Decision] Supabase deps present but `.env.example` labels them `(legacy)` — resolved: removed all Supabase deps and lib, stubbed auth routes
- [x] [Review][Decision] `images: { unoptimized: true }` with no justification — resolved: removed, replaced with `reactStrictMode: true`
- [x] [Review][Decision] Both `package-lock.json` and `pnpm-lock.yaml` exist — resolved: kept npm per architecture.md, removed pnpm-lock.yaml
- [x] [Review][Decision] `.env.example` dual database strategy (Postgres + Supabase) unclear — resolved: removed Supabase vars, Postgres via Drizzle ORM only
- [x] [Review][Decision] WCAG 2.1 AA contrast ratios unverified for oklch color pairings — resolved: adjusted lightness values to pass AA (4.5:1+)
- [x] [Review][Patch] Font CSS variables misnamed: `--font-dm-sans` loads Inter, `--font-dm-mono` loads JetBrains Mono [`layout.tsx:7,13`]
- [x] [Review][Patch] TypeScript `target: "ES6"` outdated for Next.js 16 + React 19 — should be ES2022+ [`tsconfig.json:7`]
- [x] [Review][Patch] Missing `reactStrictMode: true` in Next.js config [`next.config.mjs`]
- [x] [Review][Patch] `themeColor: '#0F172A'` doesn't match actual `--background` oklch value [`layout.tsx:23`]
- [x] [Review][Patch] tsconfig includes `.next/dev/types/**/*.ts` — stale cache risk [`tsconfig.json:19`]
- [x] [Review][Patch] Logo SVG lacks ARIA attributes — screen readers get no context [`logiq-logo.tsx:29-42`]
- [x] [Review][Patch] Missing `suppressHydrationWarning` on `<html>` for theme provider [`layout.tsx:33`]
- [x] [Review][Patch] Missing `typecheck` script in `package.json` [`package.json`]
- [x] [Review][Patch] `.env.example` ships real-looking credentials (`logiq_dev`) — should use CHANGEME placeholders [`.env.example:3-4`]
- [x] [Review][Patch] `--radius` not re-declared in `.dark` block (inconsistency) [`globals.css:46`]
- [x] [Review][Patch] No `global-error.tsx` error boundary at root [`layout.tsx`]
- [x] [Review][Defer] `bcryptjs` in prod deps with no auth code — deferred to auth story [`package.json:43`]
- [x] [Review][Defer] Missing `db:seed` script — not in story scope [`package.json`]
- [x] [Review][Defer] No `prefers-reduced-motion` handling in framer-motion — UX story concern [`logiq-logo.tsx:40-47`]
- [x] [Review][Defer] `oklch()` has no fallback for older browsers — modern-only acceptable [`globals.css`]
