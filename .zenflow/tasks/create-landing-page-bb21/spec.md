# Technical Specification: Luxe Lake Escapes Next.js Landing Page

## Purpose

Define the technical approach for turning the supplied standalone Luxe Lake Escapes landing page into a Next.js implementation that fits this repository's current state. This specification describes architecture, interfaces, repository changes, and verification expectations. It does not break the work into implementation tasks.

## Technical Context

- The current worktree is effectively greenfield. There is no existing Next.js app, package manifest, component library, design system, or test setup to extend.
- The only tracked repository artifacts for this task are:
  - [requirements.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/requirements.md)
  - [plan.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/plan.md)
- The user explicitly wants the delivered experience in Next.js, so later implementation should create a minimal marketing-site application rather than preserving the original HTML as a static file.
- Because no prior project conventions are present in this worktree, the technical direction should favor a simple, maintainable baseline:
  - Next.js with the App Router
  - React and TypeScript
  - Tailwind CSS for utility styling
  - `next/font` for typography instead of raw `<link>` font tags
  - `next/image` for hero and lake imagery, with explicit handling for remote image hosts or localized assets
- There are no current lint, test, or build commands available in the repository, so later implementation will need to introduce them as part of the app scaffold.

## Existing Architecture And Reusable Inputs

There are no reusable source files or established implementation patterns in the repository.

Reusable inputs available for later execution are limited to:

- the PRD in [requirements.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/requirements.md)
- the user-supplied HTML, copy, and visual hierarchy in the task description
- the Zenflow task artifact structure for recording progress

Implications:

- this should be treated as a greenfield Next.js landing-page build
- component boundaries and file structure should be defined from the supplied experience rather than inferred from an existing app
- content values that may change later, such as launch timing, phone number, and lake list, should be isolated in data constants instead of hard-coded across multiple components

## Implementation Approach

### 1. Build A Single-Route Next.js Marketing Surface

The page should ship initially as a single route at the site root. The supplied navigation can behave as same-page section links until separate routes are justified.

This approach matches the PRD:

- one polished landing page
- two waitlist conversion surfaces
- no multi-page booking flow

Recommended route model:

- `/` for the marketing page
- `/api/waitlist` for waitlist submission handling if the implementation includes server-side collection during the build step

### 2. Compose The Page From Section-Level React Components

The supplied HTML should not remain one monolithic JSX file. Later implementation should split the page into focused components that mirror the content structure:

- navigation/header shell
- hero section
- waitlist form surface
- lakes showcase section
- benefits or trust-signals section
- closing CTA section
- footer with repeated waitlist capture

The waitlist UI should be implemented as a shared form component used in both the hero and footer so both surfaces submit the same payload shape and validation rules.

### 3. Centralize Static Content And Launch Geography

Because the copy and lake list are repeated across the page, later implementation should define a single source of truth for:

- lake options
- featured lake card content
- benefit cards
- navigation items
- CTA copy
- concierge contact details

This avoids duplication between sections and keeps future copy refreshes localized. It also ensures the two waitlist forms use the exact same lake set.

### 4. Preserve The Premium Visual Direction With Native Next.js Patterns

The implementation should preserve the supplied luxury aesthetic while using framework-native primitives:

- load Playfair Display and Plus Jakarta Sans through `next/font`
- reproduce the dark palette and accent color through shared CSS variables or Tailwind theme tokens
- keep the topo-pattern background as a reusable CSS utility or background token
- use `next/image` for responsive images instead of raw `<img>` tags
- replace icon-font dependence with a React-compatible approach such as inline SVGs or a lightweight icon library

Because the page is imagery-heavy, image handling should be explicit. If the provided remote Google-hosted images are kept, the Next.js config must allow that host. If they are localized later, they should live under `public/` and be referenced consistently.

### 5. Treat Waitlist Submission As A Real Interface, Even If Persistence Evolves Later

The PRD requires the business to understand demand by lake, so the implementation should define a stable submission contract rather than handling form state entirely in the client with no server boundary.

Recommended behavior:

- both waitlist forms submit to the same interface
- each submission includes the selected lake and an indicator of where the lead came from
- the server returns a simple success or failure response suitable for inline confirmation messaging

If durable persistence is not yet available during implementation, the storage layer should still be abstracted behind a narrow server-side interface so a later backend or CRM integration does not force a client-contract rewrite.

### 6. Build For Responsive Behavior And Basic Accessibility From The Start

The implementation should preserve the supplied layout intent while adapting to smaller screens with explicit Next.js and Tailwind-friendly structure.

Required behaviors:

- readable heading and body scale on mobile and desktop
- stacked waitlist controls on narrow screens
- keyboard-accessible inputs, buttons, and links
- semantic headings and section landmarks
- visible labels, placeholders, and success/error messaging for the forms

## Source Code Structure Changes

There are no existing application files to modify, so later implementation will introduce the initial web app structure.

Expected repository changes for the landing-page build:

- create `package.json` with Next.js, React, TypeScript, and styling/test scripts
- create app bootstrap files such as `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, and related TypeScript/config files
- create landing-page components under a focused directory such as `components/landing/`
- create shared content or config modules under a directory such as `lib/` or `content/`
- create a waitlist API handler such as `app/api/waitlist/route.ts`
- add static imagery under `public/` if the implementation chooses to localize assets
- add project hygiene files that do not yet exist, including `.gitignore`
- add tests for rendered page structure and waitlist behavior once the test harness is introduced

Expected artifact changes for this specification step only:

- add [spec.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/spec.md)
- update [plan.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/plan.md) to mark Technical Specification complete

## Data Model, API, And Interface Changes

This step does not implement runtime code, but later work should use explicit application contracts.

### Landing Page Content Model

The marketing page should be backed by structured constants rather than duplicated literals.

Recommended content entities:

- `LakeOption`
  - `id`
  - `name`
  - `label`
  - `priorityTag`
- `LakeFeature`
  - `name`
  - `region`
  - `headlineTag`
  - `image`
  - `alt`
- `BenefitCard`
  - `title`
  - `description`
  - `icon`

### Waitlist Submission Interface

Recommended request payload:

- `email: string`
- `preferredLake: string`
- `source: "hero" | "footer"`

Recommended server-managed fields if persistence is added:

- `submittedAt`
- normalized lead identifier

Recommended response shape:

- success response: `{ ok: true, message: string }`
- validation or processing error: `{ ok: false, message: string, fieldErrors?: Record<string, string> }`

### Validation Rules

Minimum validation expectations:

- `email` must be present and valid email syntax
- `preferredLake` must match one of the supported lake options
- `source` must be one of the known form locations

These rules should be shared between both waitlist surfaces through one form model and one server contract.

## Verification Approach

The repository currently has no existing app scaffold or package scripts, so this specification step cannot rely on pre-existing lint or test commands.

Verification for this step:

- confirm [spec.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/spec.md) exists and aligns with the PRD
- confirm [plan.md](C:/Users/1solo/.zenflow/worktrees/create-landing-page-bb21/.zenflow/tasks/create-landing-page-bb21/plan.md) marks Technical Specification as complete

Verification expectations for later implementation, once the Next.js app exists:

- run `npm run lint`
- run the project test command, expected to be introduced as `npm run test`
- run `npm run build`
- verify both waitlist surfaces submit the same payload contract
- verify the page renders correctly on mobile and desktop layouts
- verify the configured image strategy works in Next.js without runtime host errors

## Assumptions

- The project should use Next.js App Router unless later codebase context introduces a conflicting standard.
- There is no existing backend or CRM integration available in this worktree for waitlist storage.
- The supplied HTML is the visual and content reference, but later implementation may replace icon fonts and direct image tags with Next.js-native equivalents.
- Time-sensitive copy such as `Coming Summer 2025` is preserved for now and should be isolated so it can be revised without structural code changes.
