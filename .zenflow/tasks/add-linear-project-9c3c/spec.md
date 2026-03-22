# Technical Specification: Georgia Boat Rental App Linear Project Setup

## Purpose

Define the technical approach for creating a new Linear project that plans delivery of:

- a waitlist landing page
- a renter-facing mobile app MVP

This specification covers how the Linear project should be structured and verified. It does not execute the setup and does not define implementation task breakdowns for the app itself.

## Technical Context

- The workspace is effectively greenfield. There is no existing application source tree, package manifest, CI configuration, or reusable UI/component code.
- The only current project artifacts are:
  - [requirements.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\requirements.md)
  - [plan.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\plan.md)
- The primary system to be changed in later steps is Linear, using the available Linear MCP tools for projects, milestones, documents, and issues.
- Because there is no application codebase yet, this step defines a delivery-management structure rather than extending an existing implementation.

## Existing Architecture And Reusable Inputs

There are no reusable source modules or established code patterns in the repository.

Reusable inputs for later execution are limited to:

- the PRD in [requirements.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\requirements.md)
- the researched launch-lake list captured in that PRD
- the existing Zenflow task metadata and artifact path

Implication:

- the Linear project setup should be treated as a greenfield planning artifact
- milestone names, labels, and issue descriptions must be defined from the PRD instead of inferred from existing project conventions

## Implementation Approach

### 1. Create A Single Dedicated Linear Project

Create one new Linear project for the full program rather than separate projects for landing page and mobile. The project should represent the full Georgia launch initiative and act as the parent container for milestones and issues.

Recommended project metadata:

- Name: `Georgia Boat Rental App`
- Summary: `Build, test, and deploy a waitlist landing page and renter mobile app MVP for launch on Georgia's highest-traffic lakes.`
- Teams: attach the primary product/engineering team that will own delivery
- State: active

If team ownership is ambiguous at execution time, use the default product engineering team rather than splitting ownership across multiple teams.

### 2. Use Outcome-Based Milestones

Milestones should represent launch outcomes, not vague phases. Each milestone should correspond to a state that can be verified in Linear and understood by stakeholders without reading issue details.

Recommended milestone model:

1. `Georgia Launch Market Definition Locked`
2. `Waitlist Landing Page Ready For Production`
3. `Waitlist Landing Page Live And Verified`
4. `Mobile App MVP Ready For Beta`
5. `Mobile App MVP Production Launch Ready`

Milestone design rules:

- each milestone description should state the business outcome and acceptance boundary
- milestone names should be stable enough to survive issue reprioritization
- target dates are optional in this step and can remain unset if delivery timing is not yet known

### 3. Seed The Project With Bite-Sized Top-Level Issues Only

All planned work should be represented as normal Linear issues. Do not create subtasks or parent-child issue hierarchies.

Issue sizing rules:

- each issue should represent a coherent work unit that can typically be completed independently
- issues should not collapse multiple systems into one ticket
- issues should not be so small that they only describe a single minor code edit
- target granularity should generally land in the range of a focused implementation, test, or deployment unit

Project seeding rules:

- create enough issues to cover landing page, mobile app, testing, and deployment end to end
- keep work limited to build, test, and deployment activities
- exclude marketing, sales operations, hiring, partnership outreach, and non-launch back-office work
- assign every issue to the new project
- attach each issue to the most relevant milestone

Recommended issue volume:

- approximately 30 to 45 top-level issues total

That range is large enough to stay actionable without creating overly broad tickets.

### 4. Standardize Issue Taxonomy

Later execution should apply a consistent taxonomy so the project is easy to filter and audit.

Recommended labels:

- `Build`
- `Test`
- `Deploy`
- `Landing Page`
- `Mobile App`
- `Platform`
- `Launch Geography`

Recommended issue conventions:

- titles should start with an action verb such as `Build`, `Implement`, `Test`, `Deploy`, `Configure`, or `Validate`
- descriptions should include a concise objective, the expected result, and any notable scope boundaries
- priority should be used sparingly; only clearly launch-critical items should be marked above normal
- do not use parent issue fields or sub-issue relationships

### 5. Encode Georgia Launch Geography Directly Into Planning Artifacts

The Linear setup must preserve the researched starting market so future delivery work stays aligned to the launch thesis.

The researched lake set is:

1. Lake Sidney Lanier
2. Hartwell Lake
3. Allatoona Lake
4. J. Strom Thurmond Lake
5. Walter F. George Lake

Planning implications:

- landing-page issues should include support for lake-interest capture across these five lakes
- mobile-app issues should assume browsing and discovery support for these lakes at MVP scope
- launch-readiness issues should treat Lanier and Allatoona as the default initial emphasis when prioritization is needed

This information does not require separate market-research issues in Linear because the research already exists; it should instead shape milestone descriptions and issue acceptance criteria.

### 6. Preserve Research And Scope In Linear Documentation

Create one Linear document linked to the project, or use the project description if a separate document is unnecessary, to store:

- the PRD summary
- the top-five Georgia lakes and rationale
- the scope constraint that only build, test, and deployment issues should be created

This avoids duplicating long research notes across many issue descriptions while still keeping the project self-contained inside Linear.

## Source Code Structure Changes

There are no application source files to modify in this step.

Expected repository artifact changes for this step:

- add [spec.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\spec.md)
- update [plan.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\plan.md) to mark Technical Specification complete

No package, build, deployment, or runtime configuration files are introduced because the repository does not yet contain an application implementation.

## Data Model, API, And Interface Changes

This step does not add software APIs. The relevant entities are Linear workspace objects that will be created in later steps.

### Linear Project Entity

Fields to set:

- project name
- summary/description
- owning team or teams
- project state

### Linear Milestone Entity

Fields to set:

- milestone name
- description
- optional target date
- associated project

### Linear Issue Entity

Fields to set:

- title
- description
- project
- milestone
- labels
- optional priority

Fields to avoid:

- `parentId`
- sub-issue relationships
- duplicate planning structures outside the project/milestone/issue model

### Optional Linear Document Entity

Fields to set:

- title
- markdown content summarizing PRD scope and launch-lake research
- project association

## Verification Approach

There are no repository lint, test, or build commands available in the current codebase, so verification for this work is state-based rather than code-based.

Verification for this specification step:

- confirm [spec.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\spec.md) exists and matches the PRD
- confirm [plan.md](C:\Users\1solo\.zenflow\worktrees\add-linear-project-9c3c\.zenflow\tasks\add-linear-project-9c3c\plan.md) marks Technical Specification as complete

Verification for later execution of the Linear setup:

- confirm exactly one new Linear project is created for this initiative
- confirm the project contains the intended milestone set
- confirm all seeded work items are standard issues with no subtasks
- confirm each issue belongs to the project and is assigned an appropriate milestone
- confirm issue scope is limited to build, test, and deployment concerns
- confirm the five Georgia lakes are reflected in the project documentation and in relevant issue descriptions
- confirm the resulting issue set is detailed enough to plan implementation without requiring parent-child issue nesting

## Assumptions

- The Linear workspace already exists and the authenticated user has permission to create projects, milestones, issues, and documents.
- A suitable owning team exists in Linear; if not, the default engineering team will be used during execution.
- Exact milestone dates are not required at this step.
- No code scaffolding or repository bootstrapping is part of this technical-specification step.
