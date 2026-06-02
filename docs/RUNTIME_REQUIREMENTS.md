# Runtime Requirements

This template targets Next.js 16, which requires Node.js 22.x.

The current workspace may have an older Node.js available. Use the included
version files before installing dependencies:

```bash
nvm use
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

Then install and build:

```bash
pnpm install
pnpm build
```
