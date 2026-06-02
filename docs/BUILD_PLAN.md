# Build Plan

## Goal

Build a reusable Chrome extension template that can gate free and premium
features through Whop, while also including a concrete demo product so builders
can see the complete loop.

## Deliverables

1. Research Whop API feasibility and Chrome extension constraints.
2. Pick an architecture that keeps server secrets out of the extension.
3. Build a Next.js app for checkout, entitlement checks, and webhook examples.
4. Build a Manifest V3 extension with Whop OAuth, entitlement refresh, free
   local analysis, and premium server analysis.
5. Document setup, security, customization, and testing.

## Chosen architecture

The selected architecture is:

- Chrome extension performs Whop OAuth 2.1 + PKCE with `chrome.identity`.
- Extension stores user OAuth tokens in `chrome.storage.local`.
- Extension calls the Next.js API for entitlement checks.
- Next.js fetches Whop user info from the user token, then checks access against
  `WHOP_ACCESS_RESOURCE_ID` using the server-side `WHOP_API_KEY` when configured.
- Premium actions are never trusted from the popup state; the premium API route
  rechecks entitlement before doing work.
- Checkout happens in the Next.js web app, not inside the extension popup.

## Why this plan

This gives a practical starter with a small number of moving pieces. It avoids a
database by default, which is good for a template, but it leaves room to add a
database-backed account model later.

## Remaining production tasks for a real product

- Add real Whop app credentials and resource ids.
- Add the final Chrome extension ID redirect URI in Whop.
- Replace mock premium analysis with the real premium feature.
- Set `EXTENSION_ALLOWED_ORIGINS` to the published extension origin.
- Add a privacy policy and Chrome Web Store listing disclosures.
- Optionally add a database for user accounts, audit logs, usage limits, and
  webhook-backed subscription caching.
