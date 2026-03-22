# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 987ec6ed-90d7-4e31-b04e-08170322adee -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Focus on **what** the feature should do and **why**, not **how** it should be built. Do not include technical implementation details, technology choices, or code-level decisions — those belong in the Technical Specification.

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 6305fcb6-338b-4b07-a062-de4b1f7aace1 -->

Create a technical specification based on the PRD in `{@artifacts_path}/requirements.md`.

1. Review existing codebase architecture and identify reusable components
2. Define the implementation approach

Do not include implementation steps, phases, or task breakdowns — those belong in the Planning step.

Save to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach referencing existing code patterns
- Source code structure changes
- Data model / API / interface changes
- Verification approach using project lint/test commands

### [x] Step: Planning
<!-- chat-id: c309932a-c3e3-4e01-9fc3-04e638849888 -->

Create a detailed implementation plan based on `{@artifacts_path}/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint). Avoid steps that are too granular (single function) or too broad (entire feature).

Important: unit tests must be part of each implementation task, not separate tasks. Each task should implement the code and its tests together, if relevant.

If the feature is trivial and doesn't warrant full specification, update this workflow to remove unnecessary steps and explain the reasoning to the user.

Save to `{@artifacts_path}/plan.md`.

Detailed execution plan created below. The generic Implementation placeholder has been replaced with concrete landing-page delivery tasks only; no application code, install/build command, or PR work is executed in this planning session.

### [ ] Step: Establish repository hygiene and the Next.js baseline

- Contracts:
  - `{@artifacts_path}/requirements.md`
  - `{@artifacts_path}/spec.md`
- Files:
  - Create: `.gitignore`
  - Create: `package.json`
  - Create: `package-lock.json`
  - Create: `tsconfig.json`
  - Create: `next-env.d.ts`
  - Create: `next.config.ts`
  - Create: `postcss.config.js`
  - Create: `eslint.config.mjs`
  - Create: `app/layout.tsx`
  - Create: `app/page.tsx`
  - Create: `app/globals.css`
  - Create: `vitest.config.ts`
  - Create: `vitest.setup.ts`
  - Create: `tests/app/page.test.tsx`
- Before any generated-file command such as `npm install`, `npm run build`, or a scaffold command, create or update `.gitignore` so it includes at minimum:
  - `node_modules/`
  - `.next/`
  - `dist/`
  - `build/`
  - `.cache/`
  - `coverage/`
  - `*.log`
  - `.env*`
- Because the repository already contains `.zenflow` task artifacts at the root, bootstrap the app in place without a destructive scaffold that would overwrite existing files.
- Introduce the minimal Next.js App Router baseline with React, TypeScript, Tailwind-compatible global styling, ESLint, and a test harness suitable for component and route-handler tests.
- Add package scripts for `dev`, `build`, `start`, `lint`, and `test`.
- Verification:
  - `.gitignore` exists before any install/build/scaffold command is run
  - `npm run lint`
  - `npm run test`
  - `npm run build`

### [ ] Step: Define shared landing-page content, typography, and visual tokens

- Contracts:
  - Brand and visual positioning requirements in `{@artifacts_path}/requirements.md`
  - Centralized content and image-strategy guidance in `{@artifacts_path}/spec.md`
- Files:
  - Create: `content/landing-page.ts`
  - Create: `components/landing/icons.tsx`
  - Modify: `app/layout.tsx`
  - Modify: `app/globals.css`
  - Modify: `next.config.ts`
  - Create: `tests/content/landing-page.test.ts`
- Centralize the page content so navigation items, lake options, featured-lake cards, benefits, CTA copy, and concierge details each have one source of truth.
- Load `Playfair Display` and `Plus Jakarta Sans` through `next/font`, not raw `<link>` tags.
- Recreate the supplied dark nautical palette, serif accents, and topo-pattern background as reusable styling tokens in global CSS.
- Replace Material Symbols with inline SVG components or another React-native icon approach.
- Decide and implement one image strategy:
  - either allow the provided remote image host in `next.config.ts`
  - or localize the assets under `public/`
- Verification:
  - Shared content exports cover all five lakes and both waitlist surfaces
  - `tests/content/landing-page.test.ts`
  - `npm run lint`

### [ ] Step: Implement the shared waitlist contract, API route, and reusable form

- Contracts:
  - Waitlist capture and success criteria in `{@artifacts_path}/requirements.md`
  - Request/response contract and validation rules in `{@artifacts_path}/spec.md`
- Files:
  - Create: `lib/waitlist-schema.ts`
  - Create: `lib/waitlist.ts`
  - Create: `components/landing/waitlist-form.tsx`
  - Create: `app/api/waitlist/route.ts`
  - Create: `tests/lib/waitlist-schema.test.ts`
  - Create: `tests/app/api/waitlist/route.test.ts`
  - Create: `tests/components/waitlist-form.test.tsx`
- Implement one shared waitlist form component that is reused in both the hero and footer surfaces.
- Keep the submission payload aligned to the spec:
  - `email`
  - `preferredLake`
  - `source`
- Validate both client and server submissions against the same supported lake set and response contract.
- Hide persistence details behind `lib/waitlist.ts` so the first implementation can stay simple while preserving a stable server-side interface for future CRM or database integration.
- Include inline loading, success, and error states so both form entry points behave consistently.
- Verification:
  - `tests/lib/waitlist-schema.test.ts`
  - `tests/app/api/waitlist/route.test.ts`
  - `tests/components/waitlist-form.test.tsx`
  - `npm run lint`
  - `npm run test`

### [ ] Step: Build the landing-page sections and compose the root route

- Contracts:
  - Required page structure and lake-market emphasis in `{@artifacts_path}/requirements.md`
  - Section-level component approach in `{@artifacts_path}/spec.md`
- Files:
  - Create: `components/landing/site-header.tsx`
  - Create: `components/landing/hero-section.tsx`
  - Create: `components/landing/lakes-section.tsx`
  - Create: `components/landing/benefits-section.tsx`
  - Create: `components/landing/cta-section.tsx`
  - Create: `components/landing/site-footer.tsx`
  - Modify: `app/page.tsx`
  - Create: `tests/components/landing-page.test.tsx`
- Rebuild the supplied HTML as focused React components rather than one monolithic page file.
- Preserve the supplied content hierarchy:
  - hero with luxury positioning and launch timing
  - market-selection waitlist bar
  - Georgia lakes showcase
  - trust-signals section
  - closing CTA
  - footer with secondary waitlist capture
- Use same-page section links for navigation unless a later requirement introduces separate routes.
- Ensure both waitlist form placements are wired to the same reusable form component and API contract.
- Verification:
  - `tests/components/landing-page.test.tsx`
  - `npm run lint`
  - `npm run test`

### [ ] Step: Polish responsive behavior, accessibility, and production-readiness details

- Contracts:
  - Responsiveness and accessibility requirements in `{@artifacts_path}/requirements.md`
  - Responsive and semantic implementation guidance in `{@artifacts_path}/spec.md`
- Files:
  - Modify: `components/landing/site-header.tsx`
  - Modify: `components/landing/hero-section.tsx`
  - Modify: `components/landing/lakes-section.tsx`
  - Modify: `components/landing/site-footer.tsx`
  - Modify: `app/layout.tsx`
  - Modify: `app/globals.css`
  - Modify: `tests/components/landing-page.test.tsx`
  - Modify: `tests/components/waitlist-form.test.tsx`
- Make the navigation and calls to action usable on mobile instead of remaining desktop-only.
- Audit heading order, landmark structure, labels, focus states, contrast, and keyboard interaction.
- Add metadata and baseline SEO fields in `app/layout.tsx` so the route is ready for sharing and indexing.
- Confirm image rendering, section spacing, and type scale hold up across phone, tablet, and desktop breakpoints.
- Verification:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - Manual responsive QA in the browser at mobile and desktop widths

### [ ] Step: Final verification, branch hygiene, and pull request handoff

- Contracts:
  - All planning constraints in `{@artifacts_path}/requirements.md`
  - Verification approach in `{@artifacts_path}/spec.md`
- Files:
  - Modify: `{@artifacts_path}/plan.md`
  - Modify: any implementation files touched by the completed work
- Run the full verification sequence after implementation is complete:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- Update this plan file by marking completed implementation steps with `[x]` and record the verification results directly in the relevant step notes.
- Review `git status` to ensure only intended project files are included and that generated artifacts remain ignored.
- Create the pull request with a concise summary of:
  - the new Next.js landing page structure
  - the shared waitlist contract and both capture surfaces
  - the verification evidence
  - any known follow-up, especially if waitlist persistence remains a temporary adapter
- Verification:
  - All implementation steps in this file are marked accurately
  - PR is opened against the correct base branch with verification evidence included
