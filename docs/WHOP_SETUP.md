# Whop Setup

## 1. Create or choose a Whop product

Create the Whop product or experience that should unlock the extension. Copy the
access resource you want to gate against. The check-access endpoint accepts:

- Company id
- Product id
- Experience id

Set it in:

```text
apps/web/.env.local
WHOP_ACCESS_RESOURCE_ID=exp_or_prod_xxxxxxxxxxxxx
```

## 2. Create a paid plan

Create a Whop pricing plan for premium access. Copy the plan id and set:

```text
WHOP_PLAN_ID=plan_xxxxxxxxxxxxx
```

The template checkout page uses this plan id with the Whop checkout embed and
also exposes a hosted checkout fallback link.

## 3. Create a Whop OAuth app

Create an OAuth app in the Whop developer dashboard and copy the app id:

```text
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxxxxxxxxxx
```

The extension needs this public client id too:

```text
extension/.env
VITE_WHOP_CLIENT_ID=app_xxxxxxxxxxxxx
```

## 4. Add the Chrome redirect URI

Build and load the extension once, then open the extension options page. Copy
the displayed redirect URI:

```text
https://<extension-id>.chromiumapp.org/whop
```

Add that exact URI to the Whop OAuth app.

Important: unpacked extension IDs and published Chrome Web Store IDs can differ.
Before production, add the final published extension redirect URI as well.

## 5. Add a server API key

Create a Whop API key with enough permission to check access for the selected
resource. Set it only in the web app environment:

```text
WHOP_API_KEY=...
```

Do not put this value in `extension/.env`, the manifest, or client-side code.

## 6. Configure webhooks

Create a Whop webhook endpoint:

```text
https://your-domain.com/api/webhooks/whop
```

Select the events you need, such as:

- `payment.succeeded`
- `membership.activated`
- `membership.deactivated`

Set:

```text
WHOP_WEBHOOK_SECRET=...
```

The included webhook route verifies signatures with the Whop SDK and logs the
event. In a production app, enqueue the event, dedupe it, and update your
database.

## 7. Disable mock mode

When real credentials are ready:

```text
WHOP_MOCK_MODE=false
```

Also update the extension options page or rebuild the extension with:

```text
VITE_MOCK_MODE=false
```

## 8. Production environment checklist

- `NEXT_PUBLIC_APP_URL` is your HTTPS app URL.
- `EXTENSION_ALLOWED_ORIGINS` is `chrome-extension://YOUR_EXTENSION_ID`.
- `WHOP_ACCESS_RESOURCE_ID` points to the correct experience, product, or company. Use `exp_...` when your Whop product grants access to a connected experience; use `prod_...` when you want to gate exactly on that product.
- `WHOP_PLAN_ID` points to the paid plan.
- `WHOP_API_KEY` is server-only.
- `WHOP_WEBHOOK_SECRET` is server-only.
- Whop OAuth redirect URIs include the final Chrome extension redirect URI.
