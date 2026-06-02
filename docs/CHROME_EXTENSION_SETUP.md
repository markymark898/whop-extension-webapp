# Chrome Extension Setup

## Local development

Install dependencies from the repo root:

```bash
pnpm install
```

Build the extension:

```bash
pnpm build:extension
```

Load it in Chrome:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select `extension/dist`.

## Development watch mode

```bash
pnpm dev:extension
```

After a rebuild, reload the extension from `chrome://extensions`.

## Manifest V3 structure

The manifest is at:

```text
extension/public/manifest.json
```

It declares:

- `manifest_version: 3`
- `background.service_worker`
- `type: "module"`
- `identity`, `storage`, `activeTab`, and `scripting` permissions
- Whop and local API host permissions
- A strict extension page content security policy

## Production host permissions

The template starts with:

```json
"host_permissions": ["https://api.whop.com/*", "http://localhost:3000/*"]
```

For production, replace localhost with your app origin:

```json
"host_permissions": [
  "https://api.whop.com/*",
  "https://your-domain.com/*"
]
```

Also update `connect-src` in `content_security_policy`.

## Why `activeTab` is used

The demo only reads the active tab after the user clicks the extension. That
means `activeTab` plus `scripting` is enough for the page snapshot demo. This is
less alarming than broad always-on content script host permissions.

If your product needs automatic page behavior, you can add content scripts or
optional host permissions, but do that deliberately and explain it in your
Chrome Web Store listing.

## Extension ID and OAuth redirect

Chrome identity uses:

```ts
chrome.identity.getRedirectURL("whop");
```

The result depends on the extension ID. If the ID changes, the Whop redirect URI
must be updated. Published Chrome Web Store IDs are stable. Unpacked extension
IDs can change if the extension key changes.

## Icons

This template omits production icon assets so the code stays text-only. Before
shipping, add PNG icons in the manifest:

```json
"icons": {
  "16": "icons/icon-16.png",
  "48": "icons/icon-48.png",
  "128": "icons/icon-128.png"
}
```

Chrome Web Store listings also require separate store assets and privacy
disclosures.
