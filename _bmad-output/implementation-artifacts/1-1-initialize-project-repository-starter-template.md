# Story 1.1: Initialize Project Repository & Starter Template

Status: ready-for-dev

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

- [ ] Task 1: Initialize Next.js 15 Project (AC: #1, #3, #4)
  - [ ] Run `npx create-next-app@latest` with required flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - [ ] Verify project structure: App Router in `src/app/`, TypeScript config, Tailwind config, ESLint config
  - [ ] Ensure `npm run dev` starts successfully with HMR
  - [ ] Ensure `npm run build` completes without errors

- [ ] Task 2: Configure TypeScript Strict Mode (AC: #5)
  - [ ] Verify `"strict": true` in `tsconfig.json`
  - [ ] Verify `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }` are configured
  - [ ] Ensure no TypeScript errors across the project

- [ ] Task 3: Initialize shadcn/ui (AC: #2)
  - [ ] Run `npx shadcn@latest init`
  - [ ] Configure shadcn/ui with default style (New York or Default)
  - [ ] Verify shadcn/ui components directory is set up at `src/components/ui/`
  - [ ] Install initial base components: button, input, card, dialog, toast, dropdown-menu, select, label, separator, badge, tooltip, skeleton, alert, avatar

- [ ] Task 4: Configure Tailwind Design Tokens (AC: #6)
  - [ ] Define CSS custom properties for UX-DR1 color palette in global CSS:
    - Primary Indigo (#6366F1)
    - Success Emerald (#10B981)
    - Error Rose (#F43F5E)
    - Warning Amber (#F59E0B)
    - Info Sky (#0EA5E9)
    - Insight Violet (#8B5CF6)
    - Neutral Backgrounds Slate (#0F172A/#1E293B)
    - Neutral Text Slate (#F8FAFC/#94A3B8)
  - [ ] Define UX-DR3 spacing scale as CSS variables (4, 8, 12, 16, 24, 32, 48, 64, 96px)
  - [ ] Map Tailwind CSS config to use these CSS custom properties
  - [ ] Configure dark mode support (dark-mode-first per UX-DR1)

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
src/
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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
