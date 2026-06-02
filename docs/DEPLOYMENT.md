# Deployment

This project has two live surfaces:

1. The Next.js web/API app.
2. The Chrome extension package.

Deploy the web app first. The extension needs the final web URL in its config.

## Vercel settings

Use Vercel's defaults for the web app:

```text
Framework Preset: Next.js
Root Directory: apps/web
Build Command: leave empty/default
Install Command: leave empty/default
Output Directory: leave empty/default
Node.js Version: 22.x
```

The important part is the root directory. Because Vercel is only building `apps/web`, it can install and build that app like a normal Next.js project. You do not need a custom pnpm install command for the hosted web app.

If Vercel previously saved a custom install command such as `corepack enable && pnpm install`, remove it from the project settings. That command can make Vercel use an older pnpm/corepack path and produce registry fetch errors like `ERR_INVALID_THIS`.

## Environment variables

For a mock public demo, set:

```text
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
EXTENSION_ALLOWED_ORIGINS=*
WHOP_MOCK_MODE=true
WHOP_ALLOW_FREE_ACCESS=true
```

For a real Whop-backed product, set:

```text
NEXT_PUBLIC_APP_URL=https://your-domain.com
EXTENSION_ALLOWED_ORIGINS=chrome-extension://YOUR_EXTENSION_ID
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxxxxxxxxxx
WHOP_ACCESS_RESOURCE_ID=exp_or_prod_xxxxxxxxxxxxx
WHOP_PLAN_ID=plan_xxxxxxxxxxxxx
WHOP_API_KEY=...
WHOP_WEBHOOK_SECRET=...
WHOP_MOCK_MODE=false
WHOP_ALLOW_FREE_ACCESS=true
```

## Local install

The repo root uses pnpm workspaces for local development because it contains both the web app and the extension. Use Node.js 22.x:

```bash
nvm use
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
```

Run the web app:

```bash
cp apps/web/.env.example apps/web/.env.local
pnpm dev:web
```

Build the extension:

```bash
cp extension/.env.example extension/.env
pnpm build:extension
```

Load `extension/dist` from `chrome://extensions`.

## Configure Whop

After the extension is loaded, copy the redirect URI from the extension options page:

```text
https://<extension-id>.chromiumapp.org/whop
```

Add it to the Whop OAuth app. Add the final Chrome Web Store extension redirect URI before production launch.

Set the webhook URL to:

```text
https://your-domain.com/api/webhooks/whop
```

## Build the production extension

Update `extension/.env`:

```text
VITE_API_BASE_URL=https://your-domain.com
VITE_CHECKOUT_URL=https://your-domain.com/checkout?source=extension
VITE_WHOP_CLIENT_ID=app_xxxxxxxxxxxxx
VITE_WHOP_ACCESS_RESOURCE_ID=exp_or_prod_xxxxxxxxxxxxx
VITE_WHOP_OAUTH_SCOPE=openid profile email
VITE_MOCK_MODE=false
```

Update `extension/public/manifest.json`:

```json
"host_permissions": [
  "https://api.whop.com/*",
  "https://your-domain.com/*"
]
```

Also update `connect-src` in `content_security_policy`.

Build:

```bash
pnpm build:extension
```

Zip the contents of `extension/dist` and upload that zip to the Chrome Web Store.

## If you specifically want pnpm on Vercel

You can use pnpm on Vercel, but it should be an explicit choice. Add `ENABLE_EXPERIMENTAL_COREPACK=1` and use a pinned install command such as:

```text
corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm install --no-frozen-lockfile
```

That is a workaround for package-manager pinning, not the recommended default for this template's web deployment.

## Make the GitHub repo public

The initial push is private until reviewed. To publish it as a public template:

```bash
gh repo edit colinmcdermott/whop-chrome-extension-template --visibility public
```

GitHub already has `is_template=true` set for this repository.
