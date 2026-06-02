# Testing

## Mock mode smoke test

1. Start the web app:

```bash
pnpm dev:web
```

2. Build the extension:

```bash
pnpm build:extension
```

3. Load `extension/dist` in Chrome.
4. Open the extension popup.
5. Click `Mock free`.
6. Click `Run page analysis`.
7. Confirm free facts appear and premium is locked.
8. Click `Mock premium`.
9. Run page analysis again.
10. Confirm premium summary and action items appear.

## Real Whop smoke test

1. Set `WHOP_MOCK_MODE=false` in `apps/web/.env.local`.
2. Set `VITE_MOCK_MODE=false` in `extension/.env`.
3. Configure Whop OAuth redirect URI from the extension options page.
4. Configure `WHOP_API_KEY`, `WHOP_ACCESS_RESOURCE_ID`, and `WHOP_PLAN_ID`.
5. Rebuild the extension.
6. Sign in with Whop from the popup.
7. Confirm `/api/extension/entitlements` returns the expected tier.
8. Buy the plan through `/checkout`.
9. Sign in with Whop in the extension, or refresh access if already signed in.
10. Confirm premium action succeeds.

## API checks

Health:

```bash
curl http://localhost:3000/api/health
```

Mock entitlement:

```bash
curl -X POST http://localhost:3000/api/extension/entitlements \
  -H "Authorization: Bearer mock-premium" \
  -H "Content-Type: application/json"
```

Mock premium action:

```bash
curl -X POST http://localhost:3000/api/extension/premium-action \
  -H "Authorization: Bearer mock-premium" \
  -H "Content-Type: application/json" \
  -d '{"page":{"title":"Example","url":"https://example.com","headings":["Example"],"text":"Example page text for testing.","wordCount":5}}'
```

## Chrome checks

- Inspect the popup from `chrome://extensions`.
- Inspect the service worker from `chrome://extensions`.
- Confirm no remote JavaScript is loaded by extension pages.
- Confirm the manifest includes only necessary permissions.
- Confirm production `host_permissions` includes your API origin.
- Confirm Whop OAuth redirects back to the extension.

## Webhook testing

Use a tunnel such as ngrok or Cloudflare Tunnel:

```bash
ngrok http 3000
```

Set the Whop webhook URL to:

```text
https://your-tunnel.example/api/webhooks/whop
```

Then trigger a Whop checkout or membership event and confirm the server logs the
verified event.

## Build checks

Run:

```bash
pnpm typecheck
pnpm build
```

If dependencies are not installed yet, run `pnpm install` first.
