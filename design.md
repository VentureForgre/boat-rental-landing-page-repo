# Landing Page Design

## Purpose

The landing page is now deposit-only.

- The only conversion path is a `$25 refundable deposit`.
- The page should explain why this signal matters: `100 deposits. $2,500. Louder than 1,000 free emails.`
- Every successful deposit request should transition into referral sharing so referral rate can prove organic demand.

## Shared Content Model

All conversion messaging lives in [`content/landing-page.ts`](/C:/Users/1solo/.zenflow/worktrees/add-new-deposit-option-b042/content/landing-page.ts) so the hero and footer stay in sync.

The shared hierarchy is:

1. Reservation brief headline and demand-proof callout
2. Three proof cards: refundable deposit, concierge follow-up, referral proof
3. Deposit-specific value props and disclaimer
4. Surface-specific form intro and supporting copy
5. Success state copy
6. Referral share state copy

## Hero surface

The Hero surface is the primary conversion entry point.

- Keep the cinematic image and premium tone.
- Replace the old selector with a richer reservation brief that feels like a luxury charter folio, not a checkout form.
- Lead with the metric callout, then the three proof cards, then the deposit value props, then the form shell.
- Use the heading `Request a $25 refundable priority deposit`.
- Inside the form shell, use the section title `Priority deposit request`.
- Keep the CTA explicit: the visitor is requesting deposit priority, not completing payment on the spot.

## Footer surface

The Footer surface remains the final conversion repeat.

- Reuse the same deposit-only reservation brief and submit CTA as the hero.
- Keep the stacked layout and concierge adjacency.
- Preserve the darker footer aesthetic while matching the same copy hierarchy.
- The supporting copy should explicitly mention `Launch priority for Lake Sidney Lanier` to ground the default market selection.

## Pre-Submission Copy

Before submit, the interface should make these ideas obvious:

1. The amount is `$25`
2. The deposit is `refundable`
3. Concierge confirms the deposit collection after the request is submitted
4. Referral rate shows whether signups are bringing in more signups organically

## Success state

The Success state confirms the deposit request without implying a completed charge.

- Confirm with the message `Your $25 refundable priority request is in. Concierge follow-up comes next to finalize the deposit.`
- Explain that payment collection happens in a later concierge follow-up.
- Keep the tone premium and confident, not transactional.

## Referral share state

The Referral share state appears immediately after a successful deposit request.

- Use the heading `Keep the priority list moving`.
- Primary action: copy the personal share link.
- Fallback: highlight the link for manual copy if clipboard APIs fail.
- Copy should explain that referral rate tracks what share of completed deposit requests came from another signup's shared link.

## Copy Principles

- Keep the experience premium, sharp, and high-intent.
- Avoid any free-waitlist framing.
- Never imply payment has already been processed.
- Make the demand proof legible at a glance.
- Use the phrase `reservation brief` when describing the top half of the card in design discussions so implementation and docs stay aligned.
