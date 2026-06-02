# Customization

## Rename the product

Edit:

```text
apps/web/lib/plans.ts
extension/public/manifest.json
extension/popup.html
extension/options.html
```

Search for `Focus Lens`.

## Change free and premium features

Edit:

```text
apps/web/lib/plans.ts
```

The API returns `FREE_FEATURES` or `PREMIUM_FEATURES` in the entitlement
snapshot. The popup renders these as feature chips.

## Replace the demo premium action

The premium action route is:

```text
apps/web/app/api/extension/premium-action/route.ts
```

The deterministic analysis helper is:

```text
apps/web/lib/demo-analysis.ts
```

Replace this helper with your real premium work. Examples:

- AI summary
- CRM enrichment
- private dataset lookup
- export to workspace
- paid automation
- advanced page annotation

Keep the entitlement check before the premium work.

## Add usage limits

For usage limits, add a database and record:

- Whop user id
- extension id/version
- action type
- request timestamp
- usage units
- entitlement tier at request time

Then check the limit in the premium API route after verifying Whop access.

## Add a database

The Whop SaaS Starter uses a fuller SaaS pattern with auth, plans, webhooks,
dashboard, and database-backed config. For this extension template, a good first
database addition is:

```text
User
  id
  whopUserId
  email
  createdAt

SubscriptionCache
  id
  whopUserId
  resourceId
  accessLevel
  status
  updatedAt

WebhookEvent
  id
  webhookId
  type
  receivedAt
```

You can still call Whop check-access live for sensitive premium actions.

## Make the extension always-on

The demo uses user-triggered `activeTab`. If your product needs persistent page
behavior:

1. Add content scripts in `manifest.json`.
2. Add explicit `host_permissions` or `optional_host_permissions`.
3. Create a clear onboarding screen that explains why page access is needed.
4. Keep premium server work behind the Next.js API.

## Brand and UI

The web app uses plain CSS in:

```text
apps/web/app/globals.css
```

The extension uses:

```text
extension/src/styles.css
```

The palette deliberately avoids a one-note theme. Update colors, spacing, and
copy to match your product.
