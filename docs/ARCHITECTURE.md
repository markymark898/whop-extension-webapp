# Architecture

## Repository layout

```text
whop-chrome-extension-template/
  apps/web/
    app/
      api/extension/config
      api/extension/entitlements
      api/extension/premium-action
      api/webhooks/whop
      checkout/
      demo/
      docs/
    components/
    lib/
  extension/
    public/manifest.json
    src/background.ts
    src/popup.ts
    src/options.ts
    src/shared/
  docs/
```

## Runtime responsibilities

### Chrome extension

The extension owns:

- User-triggered Whop OAuth with PKCE.
- Local token refresh.
- Reading the active tab after the user opens the popup.
- Showing free vs premium UI.
- Calling the Next.js API for premium actions.

The extension does not own:

- Whop API keys.
- Webhook secrets.
- Final premium authorization decisions.
- Payment UI.
- Durable business records.

### Next.js app

The Next.js app owns:

- Public product/demo pages.
- Whop checkout page.
- CORS handling for `chrome-extension://` callers.
- Entitlement checks against Whop.
- Premium server endpoints.
- Whop webhook verification example.

## Entitlement model

The extension receives an `EntitlementSnapshot`:

```ts
type EntitlementSnapshot = {
  hasAccess: boolean;
  accessLevel: "no_access" | "customer" | "admin";
  tier: "free" | "premium" | "admin";
  checkedAt: string;
  expiresAt: string;
  checkoutUrl: string;
  features: string[];
};
```

This snapshot is useful for UI. It is not a security primitive. Premium API
routes call `resolveEntitlementFromRequest()` again before doing premium work.

## OAuth flow

1. Popup sends `SIGN_IN` to `background.ts`.
2. Background creates PKCE verifier, state, nonce, and challenge.
3. Background calls `chrome.identity.launchWebAuthFlow()`.
4. Whop redirects to the Chrome-generated `chromiumapp.org` URL.
5. Background exchanges the authorization code for tokens.
6. Background stores tokens in `chrome.storage.local`.
7. Background calls `/api/extension/entitlements`.

## Premium action flow

1. Popup collects a page snapshot using `chrome.scripting.executeScript`.
2. Popup sends `PREMIUM_ACTION` to the background service worker.
3. Background gets a valid Whop access token.
4. Background posts to `/api/extension/premium-action`.
5. Next.js rechecks Whop access.
6. If access is active, Next.js returns premium analysis.
7. If access is inactive, Next.js returns `402 premium_required`.

## Mock mode

Mock mode exists for template demos. It accepts tokens like:

```text
mock-free
mock-premium
mock-admin
```

The web app defaults to mock mode in development when `WHOP_API_KEY` is not set.
Turn it off with:

```text
WHOP_MOCK_MODE=false
```

## Why no database by default

A Chrome extension gating template should be easy to inspect and adapt. A
database is useful for:

- Usage limits.
- Team accounts.
- Audit logs.
- Webhook event deduplication.
- Cached subscription state.
- App sessions that avoid storing Whop refresh tokens in the extension.

But a database is not required to prove Whop access on each premium request.
This template keeps the first implementation stateless.
