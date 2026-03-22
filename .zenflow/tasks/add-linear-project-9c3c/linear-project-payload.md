# Linear Project Payload: Georgia Boat Rental App

## Project payload

- Name: `Georgia Boat Rental App`
- Summary: `Build, test, and deploy a waitlist landing page and renter mobile app MVP for launch on Georgia's highest-traffic lakes.`
- State: `active`
- Scope note: Create only build, test, and deploy issues.
- Planning constraint: Do not use subtasks, parent issues, or parent-child issue relationships.

## Project document payload

- Title: `Georgia Boat Rental App PRD Summary And Launch Geography`
- Project association: `Georgia Boat Rental App`

### Markdown body

```md
# Georgia Boat Rental App

## Program summary

This project covers delivery of two customer-facing outcomes:

1. A waitlist landing page that explains the launch, captures qualified leads, and records lake interest.
2. A renter-facing mobile app MVP that supports lake discovery, boat browsing, booking, and reservation management.

Only build, test, and deployment work should be represented as Linear issues. Do not create subtasks or parent-child issue relationships.

## Georgia launch lakes

The initial launch geography is the following five-lake set:

1. Lake Sidney Lanier
2. Hartwell Lake
3. Allatoona Lake
4. J. Strom Thurmond Lake
5. Walter F. George Lake

These lakes were selected from the best-supported public visitation research available in the planning artifacts.

## Prioritization note

When prioritization is required, default initial emphasis to Lake Sidney Lanier and Allatoona Lake because they combine strong visitation with proximity to metro Atlanta.
```

## Reusable label set

| Label | Type | Use |
| --- | --- | --- |
| `Build` | Delivery | Implementation work that creates or configures product behavior |
| `Test` | Delivery | Verification work for feature quality, compatibility, smoke coverage, or release readiness |
| `Deploy` | Delivery | Release, environment promotion, rollout, and productionization work |
| `Landing Page` | Surface | Work specific to the waitlist landing page |
| `Mobile App` | Surface | Work specific to the renter-facing mobile app |
| `Platform` | Shared scope | Shared infrastructure, environment, analytics, monitoring, or release pipeline work |
| `Launch Geography` | Shared scope | Work tied to lake datasets, lake prioritization, or launch-market content |

## Normalization rules

- Every issue should use exactly one delivery label: `Build`, `Test`, or `Deploy`.
- Add a surface label when work is tied to a product surface: `Landing Page` or `Mobile App`.
- Add `Platform` when work is shared across surfaces or focuses on environments, pipelines, analytics, or monitoring.
- Add `Launch Geography` when work is specifically about the five launch lakes, lake copy, or launch-market prioritization.
- Do not create labels for phases, teams, or parent-child grouping.

## Verification

- The payload includes the five launch lakes.
- The document payload includes the Lanier and Allatoona prioritization note.
- The scope is limited to build, test, and deployment issues.
- The setup explicitly avoids subtasks and parent-child issue relationships.
