# How to Create a Paid Chrome Extension Using Whop

This guide explains how to turn this starter package into a paid Chrome extension business using Whop.

The package includes two pieces:

- A Manifest V3 Chrome extension
- A Next.js web app/API

Whop handles the business infrastructure: customer payments, subscriptions, billing management, user sign-in, and access checks. Your job is to replace the template feature with your real extension product, connect your own Whop credentials, deploy the web app, and publish the extension.

## Key Takeaways

- You can sell access to a Chrome extension with Whop handling customer login, checkout, billing management, subscriptions, and access checks.
- The Chrome extension should contain the customer-facing interface, while the Next.js web app should contain private server logic and Whop API calls.
- Paying customers should install the extension from the Chrome Web Store so everyone uses one stable extension ID for OAuth.
- Developer Mode is useful for local testing, but it is not the right customer distribution path because unpacked extensions can create different extension IDs.
- The core build pattern is simple: Whop confirms access, the extension unlocks the paid feature, and the backend protects anything valuable or private.

## Project Overview

This starter is built for creators who want to sell a paid Chrome extension without building their own subscription system.

The finished product has three user states:

- Signed out: the user sees the extension benefits, a `Login` button, and a `Sign up` button.
- Signed in without access: the user sees a locked access state and a clear path to checkout.
- Signed in with access: the user sees an active access indicator and the paid extension feature immediately.

The starter includes:

- A Chrome extension popup with Whop login, signup, access status, billing, refresh, logout, and a gated feature area.
- A Next.js web app that hosts checkout, documentation, and API routes.
- A server-side entitlement check that asks Whop whether the signed-in user has access.
- A Whop billing link that sends customers to Whop's hosted membership management page.
- A clean placeholder area where students replace the template content with their real extension product.

## Tech Stack

- Manifest V3 Chrome Extension: the installable browser extension customers use.
- Vite: builds the extension bundle.
- TypeScript: used across the extension and web app.
- Next.js App Router: powers the web app, checkout page, docs page, and backend API routes.
- Whop OAuth: signs users in through Whop from the Chrome extension.
- Whop access checks: confirms whether a user has access to the configured product, experience, or business.
- Whop Checkout: sends non-customers to purchase the plan connected to the extension.
- Whop hosted memberships page: lets customers manage billing, subscriptions, payment methods, and cancellations.

## Main Pages and Files

Chrome extension:

- `extension/popup.html`: popup shell.
- `extension/src/popup.ts`: login flow, account state, gated UI, and customer-facing popup logic.
- `extension/src/background.ts`: background/service worker logic and extension message handling.
- `extension/src/styles.css`: popup styling.
- `extension/public/manifest.json`: extension name, permissions, icons, OAuth permissions, and host permissions.
- `extension/.env`: browser-safe extension build variables.

Web app:

- `apps/web/app/page.tsx`: public web landing page.
- `apps/web/app/checkout/page.tsx`: checkout page used by the extension signup button.
- `apps/web/app/docs/page.tsx`: documentation page.
- `apps/web/app/api/extension/config/route.ts`: extension configuration endpoint.
- `apps/web/app/api/extension/entitlements/route.ts`: Whop access check endpoint.
- `apps/web/app/api/extension/gated-resource/route.ts`: sample protected server-side endpoint for paid features.
- `apps/web/app/api/extension/billing-portal/route.ts`: billing URL endpoint.
- `apps/web/lib/whop.ts`: Whop API helper functions.
- `apps/web/.env.local`: local web app environment variables and server secrets.

## Access Flow

The paid extension flow works like this:

1. A customer opens the Chrome extension.
2. If they are not signed in, they can log in with Whop OAuth or sign up through checkout.
3. The extension receives the Whop OAuth result and asks the web app to check access.
4. The web app calls Whop using server-side credentials.
5. Whop returns whether the user has access to the configured resource.
6. If access is active, the extension shows the gated feature.
7. If access is missing, the extension keeps the feature locked and shows the signup path.
8. If the user wants billing help, the billing icon opens Whop's hosted memberships page.

## What You Need First

Before using this starter, have these ready:

- A Whop business account.
- A Whop product, experience, or business resource that should control access.
- A Whop paid plan for checkout.
- A Whop OAuth app for extension login.
- A server host such as Vercel, Lovable, Railway, Render, or another Next.js-capable platform.
- A Chrome Web Store developer account for production distribution.
- Basic familiarity with editing TypeScript, environment variables, and Chrome extension manifests.

## Build This With an Agentic Coder

If you are giving this starter to an AI coding agent, use a prompt like this:

```text
Build a paid Chrome extension using this Whop Chrome extension starter.

Keep Whop responsible for OAuth login, checkout, subscription access, billing management, and entitlement checks.

Replace the template gated feature in extension/src/popup.ts with my real extension feature. Keep the feature hidden unless Whop confirms entitlement.hasAccess is true.

Keep private logic, API keys, AI calls, database queries, and protected data in the Next.js web app. Use apps/web/app/api/extension/gated-resource/route.ts for server-side paid functionality.

Update the extension manifest only with the Chrome permissions my feature actually needs. Do not add broad host permissions unless the feature requires them.

Prepare the app for production using my hosted web domain, my published Chrome extension ID, and my Whop credentials.
```

## What Whop Handles

When you use Whop with this starter, Whop becomes the source of truth for customer access.

Whop handles:

- User sign-in through Whop OAuth
- Customer checkout
- Subscription or one-time payment collection
- Payment method updates
- Cancellation and membership management
- Billing portal access
- Access decisions for your product, experience, or business

This means your Chrome extension does not need to build its own login system, payment processor, subscription database, billing portal, or entitlement logic from scratch.

The extension asks, "Does this user have access?" Whop answers.

## How This Starter Works

The Chrome extension is the customer-facing product surface. It shows login, sign-up, billing, status, and the gated feature area.

The Next.js app is the trusted backend. It stores server-only credentials, talks to Whop, checks access, renders the checkout page, and exposes API routes that the extension can call.

This split is important because a Chrome extension is public client-side code. Users can inspect extension files. Never put private Whop API keys or webhook secrets directly inside the extension.

## What the User Sees

Before login or purchase, the extension shows:

- A locked access status
- A short explanation of the paid extension benefits
- A `Login` button
- A `Sign up` button

After the user pays and Whop confirms access, the extension shows:

- A visible access-active indicator
- The message `Premium gate is open`
- The paid/gated content area
- Account icons for refresh, billing, logout, and settings

Paid users should not see unnecessary checkout buttons. They already have access, so the gated content should appear automatically.

## Credentials You Need From Whop

You need the following values from your Whop dashboard.

The Whop docs that matter most for this starter are:

- [Whop OAuth](https://docs.whop.com/developer/guides/oauth), for creating the app ID and redirect URI
- [Whop authentication and resource IDs](https://docs.whop.com/developer/guides/authentication#resource-ids-and-access-levels), for understanding `prod_`, `exp_`, and `biz_` access checks
- [Whop check access API](https://docs.whop.com/api-reference/users/check-access), for the server-side entitlement check
- [Whop webhooks](https://docs.whop.com/developer/guides/webhooks), if you later want to react to membership/payment events

Quick credential map:

| Credential | Where to find it in Whop | Starts with |
| --- | --- | --- |
| OAuth App ID | Developer dashboard, inside your OAuth app credentials | `app_` |
| Access Resource ID | Product, Experience, or Business settings/details | `prod_`, `exp_`, or `biz_` |
| Plan ID | Product pricing/plans area | `plan_` |
| API Key | Developer/API keys area | Usually `apik_` |
| Business/Company ID | Business/company settings | `biz_` |
| Webhook Secret | Developer/webhooks area after creating a webhook | Varies |
| Billing URL | Use Whop's hosted memberships page | `https://whop.com/@me/settings/memberships/` |

### 1. Whop OAuth App ID

Environment variable:

```text
NEXT_PUBLIC_WHOP_APP_ID=app_...
VITE_WHOP_CLIENT_ID=app_...
```

Where to get it:

Go to your Whop dashboard, open the developer area, create or select an OAuth app, then copy the client/app ID. It usually starts with `app_`.

In the Whop OAuth settings, also add your Chrome extension redirect URI:

```text
https://<extension-id>.chromiumapp.org/whop
```

Whop's OAuth docs explain that redirect URIs must be added exactly, and that the client ID looks like `app_...`.

What it does:

This is the public client ID used by the extension to start Whop login.

This value is safe to expose in the extension.

### 2. Whop Access Resource ID

Environment variable:

```text
WHOP_ACCESS_RESOURCE_ID=prod_...
VITE_WHOP_ACCESS_RESOURCE_ID=prod_...
```

Where to get it:

In Whop, open the product, experience, or business that should unlock your extension. Copy the ID from that resource's settings/details area.

Common formats:

```text
prod_...   Product ID
exp_...    Experience ID
biz_...    Business/company ID
```

Recommended default:

Use `prod_...` for most paid Chrome extensions. Product-level access is precise and usually matches what the customer bought.

What it does:

This is the Whop resource your backend checks when deciding whether to unlock the paid extension feature.

The Whop authentication docs describe the resource ID prefixes: `prod_` checks a product, `exp_` checks an experience, and `biz_` checks a company/business.

### 3. Whop Plan ID

Environment variable:

```text
WHOP_PLAN_ID=plan_...
```

Where to get it:

In your Whop dashboard, open the product you are selling, go to its pricing/plans area, select the paid plan, and copy the plan ID. It usually starts with `plan_`.

What it does:

This powers the checkout link:

```text
https://whop.com/checkout/<plan_id>
```

Customers use this to buy access.

### 4. Whop API Key

Environment variable:

```text
WHOP_API_KEY=...
```

Where to get it:

Create an API key from your Whop developer or business dashboard. Treat it like a password.

What it does:

The backend can use this key to check access server-side.

Important:

Never put this key in `extension/.env`. Never expose it in Chrome extension code. It belongs only in the web app/server environment.

### 5. Whop Business or Company ID

Environment variable:

```text
WHOP_COMPANY_ID=biz_...
```

Where to get it:

Open your Whop business/company settings and copy the business ID. It usually starts with `biz_`.

What it does:

This is useful for server-side Whop API calls that need to know which Whop business owns the product.

### 6. Billing Portal URL

Environment variable:

```text
WHOP_BILLING_PORTAL_FALLBACK_URL=https://whop.com/@me/settings/memberships/
```

Where to get it:

Use Whop's customer memberships page:

```text
https://whop.com/@me/settings/memberships/
```

What it does:

When customers click the billing icon in the extension, they are sent to Whop to manage their memberships, payment methods, subscriptions, and cancellations.

For most builders, this is better than building a custom billing portal.

### 7. Optional Webhook Secret

Environment variable:

```text
WHOP_WEBHOOK_SECRET=...
```

Where to get it:

Create a webhook in Whop's developer area and copy the webhook signing secret.

What it does:

Webhooks let your backend react to membership events, payment events, cancellations, and renewals.

You do not need webhooks for the basic extension access check to work, but they are useful if you later add your own database.

## Where to Put the Credentials

There are two env files during local development.

### Web App Environment

File:

```text
apps/web/.env.local
```

Put server and web values here:

```text
NEXT_PUBLIC_APP_URL=http://localhost:3001
EXTENSION_ALLOWED_ORIGINS=*

NEXT_PUBLIC_WHOP_APP_ID=app_...
WHOP_ACCESS_RESOURCE_ID=prod_...
WHOP_COMPANY_ID=biz_...
WHOP_PLAN_ID=plan_...
WHOP_API_KEY=...
WHOP_WEBHOOK_SECRET=

WHOP_MOCK_MODE=false
WHOP_ALLOW_FREE_ACCESS=false
WHOP_BILLING_PORTAL_FALLBACK_URL=https://whop.com/@me/settings/memberships/
```

Important:

`WHOP_API_KEY` goes here only. It should never go into the extension.

### Chrome Extension Environment

File:

```text
extension/.env
```

Put extension-safe values here:

```text
VITE_API_BASE_URL=http://localhost:3001
VITE_CHECKOUT_URL=http://localhost:3001/checkout?source=extension
VITE_WHOP_CLIENT_ID=app_...
VITE_WHOP_ACCESS_RESOURCE_ID=prod_...
VITE_WHOP_OAUTH_SCOPE=openid profile email
VITE_MOCK_MODE=false
```

These values are compiled into the extension build.

## Credentials to Add to Your Hosting Provider

When you deploy the web app to Vercel, Lovable, Railway, Render, or another web host, add the web app variables as environment variables or account secrets in that platform's project settings.

For the web app/server, add:

```text
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
EXTENSION_ALLOWED_ORIGINS=chrome-extension://your_published_extension_id
NEXT_PUBLIC_WHOP_APP_ID=app_...
WHOP_ACCESS_RESOURCE_ID=prod_...
WHOP_COMPANY_ID=biz_...
WHOP_PLAN_ID=plan_...
WHOP_API_KEY=...
WHOP_WEBHOOK_SECRET=...
WHOP_MOCK_MODE=false
WHOP_ALLOW_FREE_ACCESS=false
WHOP_BILLING_PORTAL_FALLBACK_URL=https://whop.com/@me/settings/memberships/
```

The private values are:

```text
WHOP_API_KEY
WHOP_WEBHOOK_SECRET
```

These must stay server-side only. Add them to your web host's secrets/environment variable dashboard. Do not put them into Chrome extension code.

The public values are:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_WHOP_APP_ID
EXTENSION_ALLOWED_ORIGINS
WHOP_ACCESS_RESOURCE_ID
WHOP_COMPANY_ID
WHOP_PLAN_ID
WHOP_MOCK_MODE
WHOP_ALLOW_FREE_ACCESS
WHOP_BILLING_PORTAL_FALLBACK_URL
```

These still belong in the web app environment, but they are not secret in the same way an API key is.

For the Chrome extension build, add these to `extension/.env` before building the production ZIP:

```text
VITE_API_BASE_URL=https://your-production-domain.com
VITE_CHECKOUT_URL=https://your-production-domain.com/checkout?source=extension
VITE_WHOP_CLIENT_ID=app_...
VITE_WHOP_ACCESS_RESOURCE_ID=prod_...
VITE_WHOP_OAUTH_SCOPE=openid profile email
VITE_MOCK_MODE=false
```

Anything that starts with `VITE_` is compiled into the extension bundle. Only put browser-safe values there.

## Local Development Flow

Use localhost first. Do not start with production deployment.

1. Install dependencies.
2. Configure `apps/web/.env.local`.
3. Configure `extension/.env`.
4. Run the web app locally.
5. Build the extension.
6. Load `extension/dist` in Chrome as an unpacked extension.
7. Copy the Chrome OAuth redirect URI.
8. Add that redirect URI to your Whop OAuth app.
9. Test login, sign-up, billing, and gated access.

The local web app runs at:

```text
http://localhost:3001
```

The unpacked Chrome extension folder is:

```text
extension/dist
```

## Whop OAuth Redirect URI

After you load the unpacked extension in Chrome, Chrome gives it an extension ID.

The redirect URI looks like this:

```text
https://<extension-id>.chromiumapp.org/whop
```

Add that exact URI to your Whop OAuth app.

This redirect URI is for the Chrome extension OAuth login flow. It is not the same thing as your hosted web app URL.

During local development, the extension may have a temporary unpacked extension ID, so the OAuth redirect URI may look like:

```text
https://temporary_local_extension_id.chromiumapp.org/whop
```

When you publish to the Chrome Web Store, Chrome gives the published extension its own stable extension ID. Your production OAuth redirect URI should use that published Chrome extension ID:

```text
https://published_chrome_extension_id.chromiumapp.org/whop
```

Your hosted server domain is used for the web app, checkout, and API calls:

```text
https://your-domain.com
https://your-domain.com/checkout?source=extension
https://your-domain.com/api/extension/entitlements
```

So the production setup uses both:

- The Chrome extension redirect URI for OAuth login: `https://<published-extension-id>.chromiumapp.org/whop`
- The hosted web app domain for backend and checkout: `https://your-domain.com`

Do not replace the Chrome OAuth redirect URI with only your hosted server domain unless you are building a normal website login flow instead of a Chrome extension login flow. For this starter, the extension uses Chrome's OAuth redirect pattern, so Whop needs the `chromiumapp.org` redirect URI.

When you publish to the Chrome Web Store, your final extension ID may be different from your local unpacked extension ID. Add the production Chrome extension redirect URI to Whop as well.

### Why Developer Mode Is Only for Testing

An unpacked extension can work in development mode, but it is not a good production setup for customers.

When someone loads the extension unpacked in Chrome Developer Mode, Chrome creates an extension ID for that local unpacked extension. If each customer downloads the project files and loads their own copy manually, those customers can end up with different extension IDs.

That matters because Whop OAuth only works when the redirect URI is already allowed in the Whop OAuth app.

If every customer has a different unpacked extension ID, the business owner would have to manually add each customer's redirect URI to Whop:

```text
https://customer_extension_id.chromiumapp.org/whop
```

That does not scale and creates a bad customer experience.

For real customers, the correct setup is:

1. The business owner uploads the extension to the Chrome Web Store.
2. Chrome gives the published extension one stable extension ID.
3. The business owner adds this one redirect URI to the Whop OAuth app:

```text
https://published_extension_id.chromiumapp.org/whop
```

4. Every customer installs the extension from the Chrome Web Store.
5. Every customer gets the same published extension ID.
6. Whop OAuth works normally for everyone.

Developer Mode is for builders, students, and testing. Paying customers should install the extension through the Chrome Web Store or another managed distribution method that keeps one stable extension ID.

## Where to Put Your Own Extension Content

The main Chrome extension UI is here:

```text
extension/src/popup.ts
```

The popup shell is here:

```text
extension/popup.html
```

The extension styling is here:

```text
extension/src/styles.css
```

The paid content placeholder is rendered in:

```text
renderGatedContent()
```

Inside `extension/src/popup.ts`, look for:

```text
Your paid extension feature goes here
```

Replace that area with the real content or UI your paid extension should show after Whop confirms access.

Examples:

- A private dashboard
- A research tool
- A scraping tool
- An AI workflow
- A Chrome side panel
- A paid automation
- A private data view
- A productivity feature

The important rule:

Only show paid content after `entitlement.hasAccess` is true.

For most student projects, this is the main place to start. Keep the login, signup, billing, logout, and refresh controls in place. Replace only the inside of the gated content area with the student's actual product.

If the paid feature is mostly user interface, build it in:

```text
extension/src/popup.ts
extension/src/styles.css
```

If the paid feature needs to talk to websites, use Chrome APIs, or run in the background, add that logic in:

```text
extension/src/background.ts
extension/public/manifest.json
```

If the paid feature needs private data, AI calls, database queries, or anything valuable that users should not be able to inspect, keep that logic on the server instead of in the extension.

In that case, the extension should call your backend, and the backend should check Whop access before returning the paid result.

## Where to Put Server-Side Gated Logic

The sample gated endpoint is:

```text
apps/web/app/api/extension/gated-resource/route.ts
```

This endpoint checks Whop access before returning a paid response.

Replace the sample payload with your real server-side paid feature.

Examples:

- Call your AI model
- Query your database
- Return private data
- Generate a report
- Run a premium workflow
- Fetch customer-only content

The backend should always recheck Whop access before returning valuable paid output.

This starter already includes that pattern. The extension can call the backend route, and the backend checks Whop before returning the gated response.

Use this rule:

- Put visible interface in the extension.
- Put secret keys, private logic, AI calls, and protected data in the web app.
- Let Whop decide whether the user has access before the private server response is returned.

If you change the shape of the gated response, update shared extension types here:

```text
extension/src/shared/types.ts
```

## Where Checkout Lives

Checkout lives in the web app:

```text
apps/web/app/checkout/page.tsx
```

The checkout URL is built from:

```text
WHOP_PLAN_ID=plan_...
```

Users who do not have access click `Sign up` in the extension and are sent to checkout.

## Where Billing Lives

Billing is handled by Whop.

The extension billing icon opens:

```text
https://whop.com/@me/settings/memberships/
```

This lets customers manage their own memberships, subscriptions, cancellations, and payment methods directly through Whop.

You do not need to build a billing portal.

## What to Change Before Giving This to Customers

Change the extension name:

```text
extension/public/manifest.json
```

Update:

```json
"name": "Your Extension Name",
"description": "Your extension description",
"default_title": "Your Extension Name"
```

Change the popup title:

```text
extension/popup.html
```

Change the website copy:

```text
apps/web/app/page.tsx
apps/web/app/checkout/page.tsx
apps/web/app/demo/page.tsx
```

Change the plan/product messaging:

```text
apps/web/lib/plans.ts
```

Replace the gated feature:

```text
extension/src/popup.ts
apps/web/app/api/extension/gated-resource/route.ts
```

## Chrome Web Store Permissions

Before uploading the extension to the Chrome Web Store, review the permissions in the extension manifest.

The manifest file is here:

```text
extension/public/manifest.json
```

Chrome extensions must declare the browser permissions they use. Google explains this in the official Chrome Extensions documentation: [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions).

This starter intentionally keeps permissions small. The template only needs permissions for things like:

```json
"permissions": [
  "identity",
  "storage"
]
```

What those mean:

- `identity` lets the extension run the Chrome OAuth login flow.
- `storage` lets the extension store lightweight local state, such as the user's session/access status.

The template also uses host permissions for the web app/API domains the extension talks to:

```json
"host_permissions": [
  "https://api.whop.com/*",
  "https://your-domain.com/*"
]
```

For local development, you may also see:

```json
"host_permissions": [
  "http://localhost:3001/*"
]
```

Before submitting to the Chrome Web Store, replace local development hosts with the real production domain.

Do not request permissions just because they might be useful later. Chrome permissions can create install warnings, and Google may reject or question extensions that request more access than the product actually needs.

For example:

- Do not add `tabs` unless your feature truly needs to read tab information.
- Do not add `scripting` unless your feature injects scripts into web pages.
- Do not add broad host access like `https://*/*` unless your extension genuinely needs access to every website.
- Do not add `activeTab` unless your extension needs temporary access to the current page after a user action.

If a student's paid feature needs additional browser capabilities, they should add the permission that matches the actual feature, then explain that permission clearly in the Chrome Web Store listing.

Examples:

- A productivity popup that only talks to your API may only need `identity`, `storage`, and your API host permissions.
- A page analyzer may need `activeTab` or `scripting`.
- A website-specific tool may need host permission for that specific website only.
- A tool that works across many websites may need broader host permissions, but that should be justified by the product itself.

Chrome also supports optional permissions. If a feature does not need a permission immediately at install time, consider requesting it later when the user turns on that feature. This can reduce scary install warnings and make the extension easier for customers to trust.

The rule is simple:

Ask Chrome only for the permissions your extension actually uses.

## Production Deployment

For production, deploy the Next.js app to a hosting provider such as Vercel.

Then update your production environment variables:

```text
NEXT_PUBLIC_APP_URL=https://your-domain.com
EXTENSION_ALLOWED_ORIGINS=chrome-extension://your_extension_id
NEXT_PUBLIC_WHOP_APP_ID=app_...
WHOP_ACCESS_RESOURCE_ID=prod_...
WHOP_COMPANY_ID=biz_...
WHOP_PLAN_ID=plan_...
WHOP_API_KEY=...
WHOP_WEBHOOK_SECRET=...
WHOP_MOCK_MODE=false
WHOP_ALLOW_FREE_ACCESS=true
WHOP_BILLING_PORTAL_FALLBACK_URL=https://whop.com/@me/settings/memberships/
```

Update the extension production env:

```text
VITE_API_BASE_URL=https://your-domain.com
VITE_CHECKOUT_URL=https://your-domain.com/checkout?source=extension
VITE_WHOP_CLIENT_ID=app_...
VITE_WHOP_ACCESS_RESOURCE_ID=prod_...
VITE_WHOP_OAUTH_SCOPE=openid profile email
VITE_MOCK_MODE=false
```

Then rebuild the extension.

## Publishing to Chrome

Build the extension and upload the ZIP to the Chrome Web Store.

The build output folder is:

```text
extension/dist
```

The packaged ZIP is:

```text
extension/whop-extension-starter.zip
```

For local testing, load the folder. For Chrome Web Store submission, upload the ZIP.

## Final Mental Model

The Chrome extension is the product interface.

The Next.js app is the trusted backend.

Whop is the system of record for users, payments, subscriptions, billing, and access.

Your paid feature should unlock only when Whop says the user has access. That is the core idea. Build your extension around that boundary, and you can focus on the product instead of building subscription infrastructure from scratch.
