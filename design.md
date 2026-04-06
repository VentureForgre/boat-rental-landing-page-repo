# Landing Page Design

## Purpose

The landing page is now deposit-only around the upgraded offer.

- The only conversion path is the `$200 today for any 2 days` offer.
- The page should explain why this signal matters: `100 deposits. $20,000. Louder than 1,000 free emails.`
- Every successful offer request should transition into referral sharing so referral rate can prove organic demand.

## Shared Content Model

All conversion messaging lives in [`content/landing-page.ts`](/C:/Users/1solo/.zenflow/worktrees/update-the-landing-page-df50/content/landing-page.ts) so the hero and footer stay in sync.

The shared hierarchy is:

1. Compact hero offer card
2. Footer offer brief with demand-proof copy
3. Surface-specific form intro and supporting copy
4. Success state copy
5. Referral share state copy
6. Popup capture copy for the 30% off save

## Hero surface

The Hero surface is the primary conversion entry point.

- Keep the cinematic image and premium tone.
- Keep the section intentionally short: eyebrow, short headline, one sentence, lake field, email field, CTA.
- Use the heading `Claim $200 Today For Any 2 Charter Days`.
- Do not show the demand-proof metric, proof cards, value props, or referral copy before submit.
- Keep both `lake` and `email` visible in the hero card.
- Keep the CTA explicit: the visitor is claiming today's offer now and choosing exact days later with concierge.

## Footer surface

The Footer surface remains the final conversion repeat.

- Keep the section title `Get The $200 Offer`.
- Keep the longer offer brief in the footer.
- Keep the stacked layout and concierge adjacency.
- Preserve the darker footer aesthetic and the denser utility layout.
- The supporting copy should explicitly mention flexible redemption for any two charter days to ground the value.

## Pre-Submission Copy

Before submit, the interface should make these ideas obvious:

1. The amount is `$200`
2. The guest can redeem `any 2 days` later
3. Concierge confirms the exact day selection after the request is submitted
4. Referral rate shows whether signups are bringing in more signups organically

## Success state

The Success state confirms the offer request without implying the reservation is fully scheduled on-page.

- Confirm with the message `Your $200 offer request is in. Concierge follow-up comes next to lock in the two charter days you want.`
- Explain that final scheduling happens in a later concierge follow-up.
- Keep the tone premium and confident, not transactional.

## Referral share state

The Referral share state appears immediately after a successful offer request.

- Use the heading `Share to keep the offer list moving`.
- Primary action: copy the personal share link.
- Fallback: highlight the link for manual copy if clipboard APIs fail.
- Copy should explain that referral rate tracks what share of completed $200 offer requests came from another signup's shared link.

## Popup

The popup is a separate save mechanism, not a replacement for the inline forms.

- Trigger after a short delay and on desktop exit intent.
- Keep the styling aligned with the rest of the site.
- Focus the message on `30% off` plus the `$200 today for any 2 days` offer.
- Ask only for email in the popup.

## Copy Principles

- Keep the experience premium, sharp, and high-intent.
- Avoid any free-waitlist framing.
- Never imply final scheduling has already been completed.
- Make the hero card as short as possible.
- Use the phrase `Offer brief` only for the footer treatment, not the hero card.
