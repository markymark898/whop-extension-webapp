# Research And Feasibility

## Short answer

Yes, this is feasible with Whop.

The best default design is a split system:

- Use the Chrome extension as a public OAuth client.
- Use Whop OAuth 2.1 + PKCE for sign-in.
- Use a Next.js API to check entitlements with Whop.
- Keep Whop API keys, webhook secrets, and premium server work out of the
  extension package.
- Open checkout in a normal web page rather than embedding checkout inside the
  extension.

This repo implements that design.

## Source-backed facts

Whop OAuth supports OAuth 2.1 + PKCE. The docs show an authorization redirect,
code challenge, code verifier, and token exchange without requiring a client
secret in the browser-side example. Source:
https://docs.whop.com/developer/guides/oauth

Whop has a check-access endpoint:

```text
GET /api/v1/users/{id}/access/{resource_id}
```

The resource id can be a company, product, or experience id. The response
contains `has_access` and `access_level`. For a Chrome extension, there is no
Whop route param, so the template uses `WHOP_ACCESS_RESOURCE_ID` to tell the API
which resource to check. If your plan grants access to a connected experience,
use the `exp_...` experience id. If you want to gate exactly on a product, use
the `prod_...` product id. Source:
https://docs.whop.com/api-reference/users/check-access

Whop checkout can be embedded on a website with `@whop/checkout/react` or a
hosted script loader. This template follows the Whop SaaS Starter pattern: mount
`WhopCheckoutEmbed`, use `skipRedirect`, and redirect from `onComplete` after
the receipt is returned.
Source:
https://docs.whop.com/manage-your-business/payment-processing/embed-checkout

Whop webhooks support events such as `payment.succeeded`,
`membership.activated`, and `membership.deactivated`. They follow the Standard
Webhooks spec and should be verified before trusting payloads. Source:
https://docs.whop.com/developer/guides/webhooks

Chrome Manifest V3 uses extension service workers instead of persistent
background pages, and it blocks remotely hosted extension code. Sources:
https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3 and
https://developer.chrome.com/docs/extensions/mv3/service_workers/basics

Chrome's identity API provides `getRedirectURL()` and `launchWebAuthFlow()` for
OAuth with non-Google identity providers. The generated redirect URL matches:

```text
https://<extension-id>.chromiumapp.org/*
```

Source: https://developer.chrome.com/docs/extensions/reference/api/identity

Chrome storage has separate `local`, `sync`, and `session` areas. `storage.local`
is persistent, while `storage.session` is memory-backed and cleared on restart.
Source: https://developer.chrome.com/docs/extensions/reference/api/storage

Next.js 16 is a reasonable current choice for the web/API app. The official
upgrade notes state that Next.js 16 uses Turbopack by default, requires Node.js
20.9+, and continues the App Router model. Source:
https://nextjs.org/docs/app/guides/upgrading/version-16

The Whop SaaS Starter uses a similar product concept: Whop auth, payments,
webhooks, dashboard, and plan gating. This template borrows the architectural
ideas, but intentionally avoids the full database/dashboard surface so the
Chrome extension case stays small and portable. Source:
https://github.com/whopio/whop-saas-starter

## Key feasibility question: Can a Chrome extension use Whop OAuth?

The extension can generate a redirect URI with:

```ts
chrome.identity.getRedirectURL("whop");
```

For an unpacked extension this will be:

```text
https://<temporary-extension-id>.chromiumapp.org/whop
```

For the Chrome Web Store build it will be:

```text
https://<published-extension-id>.chromiumapp.org/whop
```

Whop requires redirect URIs to match exactly. The practical setup is:

1. Load the unpacked extension once.
2. Copy the redirect URI from the options page.
3. Add it to the Whop OAuth app.
4. Repeat with the final published extension ID before production launch.

If the Whop dashboard ever rejects `chromiumapp.org` redirect URIs, the fallback
is a web relay flow:

1. Extension opens `https://yourapp.com/extension/login`.
2. Next.js performs Whop OAuth using a normal HTTPS redirect URI.
3. Next.js redirects back to the extension with a one-time code.
4. Extension exchanges that one-time code with your API for an app session.

That fallback is more complex and usually requires a database. The direct
`chrome.identity` approach is the better first template.

## Option matrix

| Option | How it works | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| Extension OAuth plus Next entitlement API | Extension signs in with Whop using PKCE, then asks your server to check access. | Good security boundary, simple UX, no database required by default. | Extension stores OAuth tokens locally. | Chosen default. |
| Direct extension-to-Whop gating | Extension calls Whop check-access directly. | Fewer moving pieces. | Harder to keep enforcement trustworthy; no place for premium server work; tempting to expose secrets. | Only okay for display-only gating. |
| Web app session only | User logs into the website, extension relies on web cookies/session. | Server controls refresh tokens. | Cross-origin cookies, SameSite, and extension CORS create more setup friction. | Better for mature SaaS, not starter default. |
| Server code exchange and app session | Extension gets OAuth code, server stores Whop tokens, extension stores your app token. | Strongest control of Whop refresh token. | Needs persistent sessions/database. | Good advanced variant. |
| Whop app iframe model | Build a Whop app that runs inside Whop. | Native Whop context and user token headers. | Not a Chrome extension distribution model. | Not this project. |
| License key only | User pastes a Whop license key into the extension. | Simple and familiar. | Worse UX, more support, easier sharing unless server-verified often. | Optional fallback, not primary. |

## Why checkout belongs in the web app

Chrome MV3 does not allow remotely hosted code in extension pages. Whop checkout
is a remote checkout experience, and even if an iframe can technically be shown,
it is cleaner and safer to open a normal web checkout page. The extension popup
is small, ephemeral, and not a good payment surface.

The implemented pattern is:

1. Extension detects no premium access.
2. Extension opens `https://yourapp.com/checkout?source=extension`.
3. Next.js renders Whop checkout.
4. User completes payment.
5. User returns to the extension and signs in with Whop, or refreshes access if already signed in.

## Why webhooks are not the only gate

Webhooks are excellent for syncing your database and reacting to changes, but
they should not be the only live authorization check for a stateless template.
The extension can ask the API to call Whop check-access whenever it needs a fresh
answer.

If you add a database later, use webhooks to maintain a cached subscription
table, but still design premium endpoints so stale cache data fails closed when
appropriate.

## Main risks

1. OAuth tokens in extension storage are reachable by extension code. Mitigate by
   requesting minimal scopes, keeping premium enforcement server-side, and
   avoiding powerful user scopes unless needed.
2. Chrome extension IDs differ between unpacked and published builds unless you
   control the key. Whop redirect URIs must be updated accordingly.
3. CORS must allow `chrome-extension://<id>` origins for production.
4. Host permissions must include your API origin and Whop OAuth/API origins.
5. Manifest V3 service workers are not persistent. Store durable state in
   `chrome.storage`, not module-level variables.
6. Users can modify client-side extension code. Never trust a popup claim that a
   user is premium. Recheck on the server.

## Conclusion

Whop is a strong fit for paid Chrome extension gating when the extension is a
public OAuth client and the Next.js app owns entitlement enforcement. The
architecture is feasible, production-adaptable, and significantly simpler than
building a payment and subscription system from scratch.
