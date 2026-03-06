# Copilot Instructions

DFDS Navigator hackathon starter on Next.js. Read `CONVENTIONS.md` for project rules.

## Setup

```bash
npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend
pnpm install
pnpm dev    # http://localhost:3000
```

Auth details: `.skills/dfds-npmrc-setup.md`

## Rules (enforced)

- **pnpm only** -- never npm or yarn
- **TypeScript strict** -- never suppress errors, fix root cause
- **No package downgrades** without explicit user approval
- **Always use PRs** -- NEVER push directly to `main` or `master`. Always create a feature branch and PR
- Run `pnpm typecheck` and `pnpm format` before committing

## Architecture

### File-based routing (`app/`)

- File names = URL paths (`app/about/page.tsx` -> `/about`)
- Root layout: `app/layout.tsx` (wraps all routes with NavigationMenu)
- Dynamic segments: `[id]` folders (`app/posts/[id]/page.tsx`)
- Navigation: Next.js `<Link href="/path">` component

### Data loading

```tsx
// Server Component (default -- data ready before render)
export default async function PostsPage() {
  const data = await fetch("/api/posts").then((r) => r.json());
  return <div>{/* render data */}</div>;
}

// Client Component (for interactivity)
'use client';
export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Server Actions

- Full SSR enabled by default
- Server Actions: type-safe server functions
- Route Handlers: define API endpoints alongside frontend code

## DFDS packages

| Package | Purpose |
|---------|---------|
| `navigator-components` | Button, TextInput, StatusBadge, Grid, etc. |
| `navigator-styles` | Design tokens + Tailwind v4 preset |
| `navigator-icons` | Static/dynamic/flexible icon loading |
| `compass-ui` | NavigationMenu (responsive, with DFDS logo) |

API reference: `.skills/navigator-ui.md` and `.skills/compass-ui.md`

## Project structure

```
app/
  layout.tsx       Root layout (NavigationMenu + shell)
  page.tsx         Home page
  globals.css      Global styles + Tailwind config
components/        Reusable components
public/            Static assets
```

## Skills (`.skills/`)

All skills are project-local and auto-available to AI assistants:

- `navigator-ui.md` -- Navigator component reference
- `compass-ui.md` -- Compass UI navigation
- `next-best-practices/` -- Next.js best practices (RSC, data patterns, routing, etc.)
- `dfds-npmrc-setup.md` -- GitHub Package Registry auth
- `agent-browser.md` -- Headless browser automation

## Git workflow

**CRITICAL: Never push directly to `main` or `master`**

1. Create feature branch: `git checkout -b feat/description` or `bug/description`
2. Make changes and commit with conventional commit message
3. Push branch: `git push -u origin feat/description`
4. Create pull request on GitHub
5. Get review before merging

Branch naming:
- Features: `feat/description-with-hyphens`
- Bugs: `bug/description-with-hyphens`

PR titles use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: description`
- `fix: description`
- `docs: description`
- `refactor: description`
- `test: description`
- `chore: description`
