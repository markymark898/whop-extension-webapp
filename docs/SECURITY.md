# Security Model

## Core principle

The extension is a public client. Treat everything inside it as inspectable and
modifiable by the user. Use it for UX, not final authorization.

## What must stay server-side

- `WHOP_API_KEY`
- `WHOP_WEBHOOK_SECRET`
- Database credentials
- Premium model/API keys
- Usage limit enforcement
- Final premium authorization checks

## What the extension stores

The extension stores Whop OAuth tokens in `chrome.storage.local`.

This is a practical default for a public browser extension, but it is not the
same as an HttpOnly server cookie. Keep scopes minimal and avoid requesting
permissions that would make token theft highly damaging.

## Why server-side rechecks matter

The popup receives an entitlement snapshot. A user can tamper with that local
state. Therefore:

- The popup can use the snapshot to show or hide UI.
- The server must recheck entitlement before doing premium work.

The included `/api/extension/premium-action` route calls the same entitlement
resolver before returning premium output. It also normalizes the page snapshot at
runtime so TypeScript types are not treated as a security boundary.

## CORS

Production should use:

```text
EXTENSION_ALLOWED_ORIGINS=chrome-extension://YOUR_EXTENSION_ID
```

Avoid `*` in production unless the endpoint is explicitly designed to be public.
This template uses bearer tokens and does not rely on cookies from the
extension, which keeps the CORS model simpler.

## Web app response hardening

The Next.js app sets baseline security headers from `next.config.ts`, including
clickjacking protection, `nosniff`, referrer policy, and a small CSP that blocks
framing this app and plugin objects without constraining the Whop checkout
iframe.

API routes return `Cache-Control: no-store` for entitlement responses. In
production, entitlement errors are intentionally generic so upstream API details
are not exposed to the extension UI.

## Webhooks

Always verify Whop webhook signatures before trusting payloads. The included
route uses the Whop SDK unwrap flow. For production:

- Return a 2xx quickly after verification.
- Enqueue slow work.
- Dedupe by `webhook-id`.
- Do not log full webhook payloads.
- Do not assume webhook ordering.

## Token storage alternatives

For a higher-security production app, consider a database-backed app session:

1. Extension starts Whop OAuth.
2. Extension sends the authorization code and PKCE verifier to your API.
3. API exchanges the code and stores Whop refresh tokens server-side.
4. API returns an app session token to the extension.
5. Extension never stores the Whop refresh token.

That model is stronger, but it requires a database, session rotation, and
revocation. This template keeps the default stateless for approachability.

## Chrome Web Store compliance notes

- Do not load remote JavaScript into extension pages.
- Bundle extension code.
- Request the narrowest useful permissions.
- Provide a privacy policy if collecting or transmitting user data.
- Disclose use of `identity`, `storage`, active tab data, and network requests.
- Do not collect active page text unless the feature clearly needs it and the
  user initiated the action.
- Keep extension UI rendering on DOM APIs such as `textContent` rather than
  inserting HTML strings from network or page data.
