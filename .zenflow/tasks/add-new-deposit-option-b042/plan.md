# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 571b21de-d032-43e1-9e99-b5d94d0e1532 -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Focus on **what** the feature should do and **why**, not **how** it should be built. Do not include technical implementation details, technology choices, or code-level decisions — those belong in the Technical Specification.

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 3b410965-b385-458a-aa72-234b89b78be1 -->

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
<!-- chat-id: 6c9b6855-7067-4ea3-b03c-f0cb321a2bac -->

Create a detailed implementation plan based on `{@artifacts_path}/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint). Avoid steps that are too granular (single function) or too broad (entire feature).

Important: unit tests must be part of each implementation task, not separate tasks. Each task should implement the code and its tests together, if relevant.

If the feature is trivial and doesn't warrant full specification, update this workflow to remove unnecessary steps and explain the reasoning to the user.

Save to `{@artifacts_path}/plan.md`.

### [x] Step: Update landing-page content and design documentation
<!-- chat-id: 1a98b517-832c-499d-bd29-f6c2dac4be4c -->

Implement the copy and design-system-facing content changes that make the new conversion model explicit before touching behavior.

- Files:
- Modify `content/landing-page.ts`
- Modify `tests/content/landing-page.test.ts`
- Create `design.md`
- Contracts and decisions:
- Keep all new deposit/referral messaging centralized in `content/landing-page.ts` so the hero and footer continue to consume shared content instead of hardcoded strings.
- Add structured content for the two conversion choices, deposit-specific value props, success copy variants, and referral share copy.
- Treat `design.md` as a new file because it does not exist in the repo today; document the frontend states, copy hierarchy, and the distinction between free signup and refundable deposit intent.
- Verification:
- Run `npm test -- tests/content/landing-page.test.ts`
- Confirm the content tests assert the new copy structure and that `design.md` reflects the implemented UX states and messaging.

### [x] Step: Extend waitlist contracts, persistence, and API response for deposit/referral tracking
<!-- chat-id: 8883b53a-ac00-4c4d-862a-0fac83c703b2 -->

Implement the backend-facing frontend contract so submissions can distinguish intent and referral attribution without adding payment processing.

- Files:
- Modify `lib/waitlist-schema.ts`
- Modify `lib/waitlist.ts`
- Modify `app/api/waitlist/route.ts`
- Modify `tests/lib/waitlist-schema.test.ts`
- Modify `tests/app/api/waitlist/route.test.ts`
- Contracts and decisions:
- Extend `WaitlistSubmission` with `conversionType` and optional `referralCode`.
- Extend the success response with `conversionType`, `referralCode`, and `shareUrl`.
- Expand `WaitlistEntry` with generated referral metadata, `isReferral`, and deposit intent fields such as `depositAmountCents` and `depositStatus: "pending"`.
- Keep the route at `app/api/waitlist/route.ts`; it should validate the richer payload, persist the new metadata, and return share-state data for the client success UI.
- Verification:
- Run `npm test -- tests/lib/waitlist-schema.test.ts tests/app/api/waitlist/route.test.ts`
- Confirm valid waitlist and deposit submissions both succeed, invalid referral/conversion values fail validation, and the API returns the new share payload.

### [x] Step: Implement the shared dual-conversion form and post-signup referral sharing UI
<!-- chat-id: 6f6d130d-8134-44b4-9ef6-3990e74c1a84 -->

Refactor the shared form component so both landing-page conversion surfaces support free signup, refundable deposit intent, and a referral share follow-up.

- Files:
- Modify `components/landing/waitlist-form.tsx`
- Modify `tests/components/waitlist-form.test.tsx`
- Contracts and decisions:
- Add a visible conversion selector for `waitlist` vs `deposit` while preserving the existing lake/email fields and shared `source` handling.
- Accept an optional referral prop from the page layer and include it in the submission payload when present.
- Tailor CTA labels, explanatory copy, and success messaging by conversion type without implying payment was processed.
- Render a referral share panel only after success; make copy-to-clipboard the primary path and keep the success state usable if clipboard APIs are unavailable.
- Verification:
- Run `npm test -- tests/components/waitlist-form.test.tsx`
- Confirm the component submits the correct payload for both conversion types, blocks invalid input client-side, and renders referral share UI after success.
- Verification completed: `npm test -- tests/components/waitlist-form.test.tsx`

### [x] Step: Propagate referral context through the landing page and run full verification
<!-- chat-id: 7218336b-87fa-40d9-b43f-511fc4d55544 -->

Wire the landing page to accept referral links on entry, pass them to both form surfaces, and verify the whole experience end to end at the page level.

- Files:
- Modify `app/page.tsx`
- Modify `components/landing/hero-section.tsx`
- Modify `components/landing/site-footer.tsx`
- Modify `tests/app/page.test.tsx`
- Modify `tests/components/landing-page.test.tsx`
- Contracts and decisions:
- Update `app/page.tsx` to read `searchParams`, normalize a supported `ref` query param, and pass the referral code into both `HeroSection` and `SiteFooter`.
- Keep referral parsing at the page boundary so the shared form stays focused on UI and submission behavior.
- Update the page/component tests to cover rendering with and without referral context, and to ensure the landing page still exposes the expected core sections after the conversion-flow changes.
- Verification:
- Run `npm run lint`
- Run `npm test`
- Run `npm run build`
- Record the verification results in this plan during implementation, then prepare the branch for PR creation after all checks pass.
- Verification completed:
- `npm test -- tests/app/page.test.tsx tests/components/landing-page.test.tsx`
- `npm run lint`
- `npm test`
- `npm run build`

### [x] Step: make a PR
<!-- chat-id: 2121f41c-3a58-4e05-98b0-045c95f16e4e -->

make the freaking PR

### [x] Step: fix stuff


Remove the free waitlist path.

Only have that deposit option. Make it look prettier, while fitting the aesthetic

- Verification completed:
- `npm test -- tests/content/landing-page.test.ts tests/components/waitlist-form.test.tsx tests/components/landing-page.test.tsx tests/lib/waitlist-schema.test.ts tests/app/api/waitlist/route.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`

### [x] Step: push the code to the PR
<!-- chat-id: 5e4465e1-32b5-4a6d-8f26-ed22387c0b37 -->

Push the code to the PR
