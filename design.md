# Landing Page Design

## Purpose

The landing page now has to support two demand signals instead of one:

- `Free waitlist` keeps the lowest-friction signup path for visitors who want updates.
- `$25 refundable deposit` introduces a higher-intent path that is clearly framed as refundable and stronger proof of demand.

The frontend should treat both paths as part of the same landing-page story, then follow either one with referral sharing.

## Shared Content Model

All conversion messaging lives in [`content/landing-page.ts`](/C:/Users/1solo/.zenflow/worktrees/add-new-deposit-option-b042/content/landing-page.ts) so the hero and footer can render the same copy hierarchy without hardcoded strings.

The shared hierarchy is:

1. Conversion-flow framing
2. Choice-specific copy for `Free waitlist` and `$25 refundable deposit`
3. Choice-specific success copy
4. Referral share state copy

## Hero Surface

The Hero surface remains the primary conversion entry point.

- Keep the luxury brand framing, launch-market context, and current hero imagery.
- Introduce copy that explains there are two commitment levels without making the layout feel like a checkout flow.
- When the richer form lands, the hero should lead with the conversion selector, then the shared lake/email fields, then the choice-specific CTA.

## Footer Surface

The Footer surface stays as the lower-page conversion repeat.

- Reuse the same conversion choices and success messaging as the hero.
- Preserve the stacked layout and concierge adjacency so the footer still feels like a softer final prompt.
- Do not create footer-only deposit language; the difference between the two paths should stay centralized.

## Pre-Submission Copy

Before submit, the interface should make the distinction explicit:

- `Free waitlist` is for lightweight interest and launch updates.
- `$25 refundable deposit` is for visitors willing to signal stronger booking intent.

Deposit copy must always keep three ideas together:

1. The amount is `$25`
2. The amount is `refundable`
3. The current frontend is collecting intent, not pretending that live payment has already happened

## Success State

The Success state should branch by conversion choice.

- Free waitlist success confirms lake interest, launch updates, and next-step sharing.
- Deposit success confirms deposit intent, explains that payment follow-up happens separately, and avoids language that sounds like a completed charge.

## Referral Share State

The Referral share state appears only after a successful signup.

- Primary action: copy the personal share link.
- Fallback: provide a manual copy path if the clipboard action fails.
- Copy should explain that referral rate matters because it shows organic demand from completed signups, not just traffic.

## Copy Principles

- Keep the free path easy and credible.
- Keep the deposit path premium, clear, and non-misleading.
- Keep referral language simple enough that sharing feels like a natural follow-up instead of a separate campaign.
