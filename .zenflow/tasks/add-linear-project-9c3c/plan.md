# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 3e2aa65c-4195-4d53-ab98-9a583aecb8e1 -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Focus on **what** the feature should do and **why**, not **how** it should be built. Do not include technical implementation details, technology choices, or code-level decisions — those belong in the Technical Specification.

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 1daaeb42-d842-4817-98e7-f3806e262ef3 -->

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
<!-- chat-id: f0ffcc22-148f-4444-959f-e38afa1f29bb -->

Create a detailed implementation plan based on `{@artifacts_path}/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint). Avoid steps that are too granular (single function) or too broad (entire feature).

Important: unit tests must be part of each implementation task, not separate tasks. Each task should implement the code and its tests together, if relevant.

If the feature is trivial and doesn't warrant full specification, update this workflow to remove unnecessary steps and explain the reasoning to the user.

Save to `{@artifacts_path}/plan.md`.

Detailed execution plan created below. The generic Implementation placeholder has been replaced with concrete Linear setup tasks only; no implementation work is executed in this planning session.

### [x] Step: Finalize Linear project payload and reusable taxonomy
<!-- chat-id: 866ce1cb-7265-4b75-89c0-679e1a325e08 -->

- Contracts:
  - `{@artifacts_path}/requirements.md`
  - `{@artifacts_path}/spec.md`
- Prepare the project payload that will be used for Linear creation:
  - Project name: `Georgia Boat Rental App`
  - Project summary: `Build, test, and deploy a waitlist landing page and renter mobile app MVP for launch on Georgia's highest-traffic lakes.`
  - Project state: active
  - Scope note: create only build, test, and deploy issues
- Prepare a project document payload that captures:
  - PRD summary
  - the five researched Georgia lakes
  - the prioritization note that Lanier and Allatoona are the default initial emphasis
- Prepare and normalize the reusable label set:
  - `Build`
  - `Test`
  - `Deploy`
  - `Landing Page`
  - `Mobile App`
  - `Platform`
  - `Launch Geography`
- Verification:
  - The payload includes the five launch lakes and the build/test/deploy-only constraint
  - The payload does not rely on subtasks or parent-child issue relationships

### [x] Step: Create the Linear project and outcome-based milestones
<!-- chat-id: da46033c-48e4-4ae5-a975-ed1de265d42b -->

- Contracts:
  - Linear Project Entity fields in `{@artifacts_path}/spec.md`
  - Linear Milestone Entity fields in `{@artifacts_path}/spec.md`
- Create one Linear project for the full program.
- Create these milestones with outcome-based descriptions:
  - `Georgia Launch Market Definition Locked`
  - `Waitlist Landing Page Ready For Production`
  - `Waitlist Landing Page Live And Verified`
  - `Mobile App MVP Ready For Beta`
  - `Mobile App MVP Production Launch Ready`
- Verification:
  - Exactly one new Linear project exists for this initiative
  - All five milestones exist and are attached to the project
  - Milestone descriptions reflect outcomes rather than generic phases

### [x] Step: Seed the "Georgia Launch Market Definition Locked" issue batch
<!-- chat-id: 67386334-c65e-46cb-ad87-d6c57286f7ae -->

- Contracts:
  - Launch geography section in `{@artifacts_path}/requirements.md`
  - Planning implications in `{@artifacts_path}/spec.md`
- Create these top-level issues and attach them to the `Georgia Launch Market Definition Locked` milestone:
  - `Build canonical launch-lake dataset for Lake Sidney Lanier, Hartwell Lake, Allatoona Lake, J. Strom Thurmond Lake, and Walter F. George Lake`
  - `Build lake-priority configuration that emphasizes Lanier and Allatoona in first-launch flows`
  - `Build shared lake copy and naming contract for landing page and mobile app surfaces`
  - `Test lake dataset rendering and lake-selection integrity across supported launch markets`
  - `Deploy shared launch-geography configuration and seed data to non-production environments`
- Label guidance:
  - Use `Build`, `Test`, or `Deploy` as the delivery-type label
  - Add `Launch Geography` and `Platform` where relevant
- Verification:
  - Five top-level issues exist under this milestone
  - Every issue is attached to the project and milestone with no `parentId`

### [x] Step: Seed the "Waitlist Landing Page Ready For Production" issue batch
<!-- chat-id: b46937e0-14a4-4cdb-8c20-bbfa4fbbc64c -->

- Contracts:
  - Waitlist Landing Page scope in `{@artifacts_path}/requirements.md`
  - Issue sizing and taxonomy rules in `{@artifacts_path}/spec.md`
- Create these top-level issues and attach them to the `Waitlist Landing Page Ready For Production` milestone:
  - `Build landing page information architecture and content hierarchy`
  - `Build responsive hero, value-proposition, and trust sections for the waitlist page`
  - `Build supported-lake showcase section for the five Georgia launch markets`
  - `Build waitlist form fields for contact capture and lake-interest selection`
  - `Build waitlist form validation, success states, and anti-spam protection`
  - `Build waitlist submission persistence or CRM handoff`
  - `Build landing page analytics events for visit, form start, submit, and selected lake`
  - `Configure landing page preview and production environment variables`
  - `Test landing page responsiveness, accessibility, and browser compatibility`
  - `Test waitlist submission, analytics, and lead-routing integrity`
- Label guidance:
  - Use `Landing Page` on every issue in this batch
  - Pair each issue with exactly one of `Build`, `Test`, or `Deploy`
- Verification:
  - Ten top-level issues exist under this milestone
  - Titles are action-oriented and scoped to landing-page build, test, or deployment work only

### [ ] Step: Seed the "Waitlist Landing Page Live And Verified" issue batch

- Contracts:
  - Launch readiness scope in `{@artifacts_path}/requirements.md`
  - Verification rules in `{@artifacts_path}/spec.md`
- Create these top-level issues and attach them to the `Waitlist Landing Page Live And Verified` milestone:
  - `Deploy landing page preview workflow and protected QA URL`
  - `Deploy production landing page with domain, SSL, and cache configuration`
  - `Test production smoke coverage for page load, form submit, and confirmation flow`
  - `Validate production monitoring, alerting, and waitlist observability`
  - `Deploy live conversion dashboard for page traffic and waitlist submissions`
- Label guidance:
  - Use `Landing Page` on every issue in this batch
  - Use `Deploy` for rollout work and `Test` for live verification work
- Verification:
  - Five top-level issues exist under this milestone
  - The batch covers release, smoke testing, and post-launch observability

### [ ] Step: Seed the "Mobile App MVP Ready For Beta" issue batch

- Contracts:
  - Mobile App MVP scope in `{@artifacts_path}/requirements.md`
  - Issue volume and top-level-only rules in `{@artifacts_path}/spec.md`
- Create these top-level issues and attach them to the `Mobile App MVP Ready For Beta` milestone:
  - `Build mobile app authentication entry, sign-up, and sign-in flows`
  - `Build mobile app navigation shell and session bootstrap`
  - `Build supported-lakes browse screen`
  - `Build lake detail screen with availability overview`
  - `Build boat listing cards and listing detail experience`
  - `Build lake and boat search, filter, and sort controls`
  - `Build booking flow step for date, duration, and party selection`
  - `Build booking checkout and reservation confirmation flow`
  - `Build reservation management screen for upcoming trips`
  - `Build trip details, policies, and safety briefing surfaces`
  - `Build user profile and saved renter details flow`
  - `Configure mobile app environment settings for local, staging, and beta builds`
  - `Test core renter flows across iOS and Android beta targets`
  - `Test authentication recovery, offline/error states, and accessibility readiness`
- Label guidance:
  - Use `Mobile App` on every issue in this batch
  - Pair each issue with exactly one of `Build`, `Test`, or `Deploy`
- Verification:
  - Fourteen top-level issues exist under this milestone
  - The batch covers the full renter MVP path from discovery through reservation management

### [ ] Step: Seed the "Mobile App MVP Production Launch Ready" issue batch

- Contracts:
  - Launch-readiness requirements in `{@artifacts_path}/requirements.md`
  - Deployment verification approach in `{@artifacts_path}/spec.md`
- Create these top-level issues and attach them to the `Mobile App MVP Production Launch Ready` milestone:
  - `Build iOS and Android release pipeline for beta and production builds`
  - `Configure mobile crash reporting, analytics, and performance monitoring`
  - `Deploy seeded staging data and environment promotion flow for supported lakes`
  - `Test end-to-end reservation lifecycle in staging with launch-lake inventory`
  - `Deploy internal beta builds and verify install and update flows`
  - `Build app store release metadata, screenshots, and configuration package`
  - `Deploy production mobile release candidates to app distribution channels`
  - `Test post-release smoke coverage and production monitoring after mobile launch`
- Label guidance:
  - Use `Mobile App` on every issue in this batch
  - Add `Platform` to shared release-pipeline and observability issues
- Verification:
  - Eight top-level issues exist under this milestone
  - The batch covers release pipelines, staged verification, and production launch checks

### [ ] Step: Audit the final Linear project for completeness

- Contracts:
  - All planning constraints in `{@artifacts_path}/requirements.md`
  - All Linear setup rules in `{@artifacts_path}/spec.md`
- Perform a final audit of the created Linear project:
  - Confirm the project contains one document, five milestones, and the full issue inventory
  - Confirm the issue count is 42 total top-level issues
  - Confirm every issue belongs to the project and exactly one milestone
  - Confirm no issues were created as subtasks or with parent-child relations
  - Confirm the launch lakes are preserved in the project documentation
  - Confirm work is limited to build, test, and deployment topics
- Verification:
  - Capture the final project URL or identifier for handoff
  - Record any deviations from the planned milestone or issue inventory before closing the session
