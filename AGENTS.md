# AI Assistant Quick Reference

Next.js + DFDS Navigator Design System hackathon starter.

## Essentials

- **Package manager**: `pnpm` only (enforced)
- **Dev server**: `pnpm dev` on port 3000
- **Auth**: `npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend`
- **Routing**: File-based in `app/` with Next.js App Router
- **Testing**: `pnpm test` (Vitest + Testing Library)
- **Typecheck**: `pnpm typecheck`
- **Format**: `pnpm format` (Prettier)

## Packages

| Package | Purpose |
|---------|---------|
| `@dfds-frontend/navigator-components` | UI components |
| `@dfds-frontend/navigator-styles` | Design tokens + Tailwind v4 preset |
| `@dfds-frontend/navigator-icons` | Icon components |
| `@dfds-frontend/compass-ui` | NavigationMenu, navigation patterns |

## Rules

1. **Never suppress TypeScript errors** (`@ts-ignore`, `@ts-expect-error`, `@ts-nocheck` are forbidden). Fix the root cause.
2. **Never downgrade packages** without explicit user approval. Fix forward first.
3. **Always run `pnpm typecheck` and `pnpm format`** before committing.

## Git workflow

- Branch from `master`: `feat/description` or `bug/description`
- PR titles use conventional commits: `feat: add login page`, `fix: broken nav link`
- Run `pnpm check` before pushing
- Always create a PR -- never push directly to `master`
- Use the PR template at `.github/PULL_REQUEST_TEMPLATE.md`

## Skills (`.skills/`)

| File | What it covers |
|------|---------------|
| `navigator-ui.md` | Navigator component API reference |
| `compass-ui.md` | Compass UI navigation components |
| `next-best-practices/` | Next.js best practices (RSC, data patterns, routing) |
| `dfds-npmrc-setup.md` | GitHub Package Registry auth |
| `agent-browser.md` | Headless browser automation |
