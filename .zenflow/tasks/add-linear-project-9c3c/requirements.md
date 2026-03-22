# Product Requirements Document: Georgia Boat Rental App Program

## Document Purpose

Define what the boat rental app program needs to achieve so the next steps can create a Linear project with the right milestones and bite-sized tasks. This document covers product scope, launch geography, and project-management constraints. It does not define implementation details.

## Current Context

- The workspace currently contains task scaffolding only; there is no existing app codebase to inherit product or architectural constraints from.
- The requested outcome is a new Linear project for a boating rental business with enough milestones and tasks to guide delivery of:
  - a waitlist landing page
  - a renter-facing mobile app
- The user asked for future tasks to focus on building, testing, and deployment only.

## Problem Statement

People interested in renting boats in Georgia do not yet have a clear, launch-ready product experience for discovering supported lakes, joining a waitlist, and later booking through a mobile app. The business needs a realistic first-market plan and an execution-ready project structure in Linear that keeps work small enough to ship steadily.

## Business Goal

Launch a Georgia-focused boat rental business starting from a short list of high-traffic lakes, validate demand through a waitlist landing page, and convert that demand into an MVP mobile booking experience.

## Product Outcome

The program should produce two customer-facing deliverables:

1. A waitlist landing page that captures demand before broad launch.
2. A mobile app MVP that allows renters to discover boats on supported lakes and complete core booking flows.

## Success Criteria

- The Linear project is organized around clear milestones and bite-sized tasks with no subtasks.
- The planned work covers build, test, and deployment for both the landing page and the mobile app.
- The landing page can validate demand by lake and collect qualified leads.
- The mobile app MVP supports the core renter journey from discovery to reservation management.
- Launch planning is grounded in a researched initial set of Georgia lakes rather than an arbitrary market list.

## Launch Geography Research

### Best-Supported Initial Lake List

Based on official U.S. Army Corps of Engineers visitation figures and lake project materials, the best-supported top five high-traffic lakes in Georgia are:

1. **Lake Sidney Lanier**
   - Official ACF visitation table shows **12,335,706 visits in FY2022**.
   - Source: USACE ACF Integrated Letter Report, Table 5  
     https://www.sam.usace.army.mil/Portals/46/docs/planning_environmental/docs/Agreements/Final/ACF_StayAgreement_ILR-TEA_FINAL.pdf
2. **Hartwell Lake**
   - USACE Savannah water control manual states Hartwell receives **more than 12 million visitors annually**.
   - Source: USACE Savannah River Basin Water Control Manual  
     https://water.sas.usace.army.mil/manual/manual.html
3. **Allatoona Lake**
   - USACE states the lake gets **nearly 7 million visitors each year**; the master plan appendix lists a **10-year average of 6,045,438** and a **peak of 6,929,550**.
   - Sources:  
     https://www.sam.usace.army.mil/Missions/Civil-Works/Recreation/Allatoona-Lake/About/History/  
     https://www.sam.usace.army.mil/Portals/46/docs/recreation/OP-AL%20%28Allatoona%29/Docs/Allatoona%20Lake%20Master%20Plan%20Five%20Year%20Update%202022%20Volume%201%20MP%20Appx%20A%20Appx%20B.pdf
4. **J. Strom Thurmond Lake**
   - USACE Savannah states visitation ranges from **5 to 8 million visitors annually**.
   - Source: USACE Savannah River Basin Water Control Manual  
     https://water.sas.usace.army.mil/manual/manual.html
5. **Walter F. George Lake**
   - Official ACF visitation table shows **2,311,049 visits in FY2022**.
   - Source: USACE ACF Integrated Letter Report, Table 5  
     https://www.sam.usace.army.mil/Portals/46/docs/planning_environmental/docs/Agreements/Final/ACF_StayAgreement_ILR-TEA_FINAL.pdf

### Research Notes

- This ranking is a **best-supported inference**, not a single official statewide leaderboard.
- Comparable statewide annual visitation data is easiest to obtain for USACE-managed lakes. Private or utility-managed lakes such as Oconee and Sinclair are important boating markets, but they do not expose similarly consistent public annual visitation figures in the sources reviewed.
- Hartwell and J. Strom Thurmond span the Georgia-South Carolina border, but both have substantial Georgia shoreline and are valid Georgia launch markets.

### Launch Assumption

Unless later business data says otherwise, the initial target geography for the business should be these five lakes, with early emphasis on **Lanier** and **Allatoona** because they combine strong visitation with proximity to metro Atlanta.

## Primary Users

### Prospective Renters

People in or traveling to Georgia who want an easy way to discover where they can rent a boat, understand availability, and book confidently.

### Operations Team

The internal team responsible for launching each lake, validating demand, and ensuring the renter experience can go live safely and reliably.

## In-Scope Requirements

### 1. Waitlist Landing Page

The landing page must:

- Explain the business clearly and quickly.
- Present the Georgia launch vision centered on the initial lake list.
- Let users join a waitlist with essential contact information.
- Capture which lake the user is interested in.
- Capture enough intent data to help prioritize launch order.
- Provide trust signals that make a new rental brand feel legitimate.
- Support measurement of traffic, conversion, and lake-level demand.

### 2. Mobile App MVP

The renter-facing mobile app must:

- Let users browse the supported lakes.
- Show available boats or rental options for each supported lake.
- Provide enough listing detail for an informed booking decision.
- Allow users to create an account or otherwise identify themselves for booking.
- Support the core booking flow through confirmation.
- Let users review and manage upcoming reservations.
- Communicate key trip details, policies, and safety expectations.

### 3. Launch Readiness

The overall program must include:

- Clear acceptance criteria for when the landing page is ready to go live.
- Clear acceptance criteria for when the mobile app MVP is ready to go live.
- Explicit testing work for critical user journeys.
- Explicit deployment work for pre-production and production release readiness.

### 4. Linear Project Structure Requirements

The future Linear setup must:

- Create one new project dedicated to this boat rental app program.
- Include milestones that reflect meaningful launch outcomes, not vague phases.
- Include enough tasks to cover end-to-end delivery without using subtasks.
- Keep tasks small enough to complete independently, but large enough to represent a useful unit of work.
- Focus on engineering delivery only:
  - building
  - testing
  - deployment

## Out of Scope

- Marketing campaign execution beyond the waitlist capture surface
- Fleet operations software beyond what is necessary for the renter MVP
- Owner or captain marketplace tooling
- Multi-state expansion beyond the Georgia launch lakes
- Back-office automation beyond what is required to support launch

## Product Assumptions

- The first release is renter-facing, not a full two-sided marketplace.
- Manual internal operations are acceptable initially where they do not block launch.
- The lake list should be good enough to seed project planning now and may be refined later if better demand or supply data appears.
- The future project plan should optimize for shipping a credible MVP, not a feature-complete marketplace.

## Open Questions For Later Steps

- Whether booking inventory is fully real-time at launch or partially managed operationally behind the scenes
- Whether payments, identity checks, waivers, and support flows are in MVP scope or launch-gated follow-on work
- Whether the initial go-live is one lake first or a multi-lake launch with staggered supply readiness
