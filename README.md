# DFDS Next.js Starter

Full-stack React starter built on **Next.js** with the **DFDS Navigator Design System** and **Compass UI** navigation. Clone, authenticate, build.

## Quick start

```bash
# 1. Authenticate with GitHub Package Registry (one-time)
npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend

# 2. Install and run
pnpm install
pnpm dev          # http://localhost:3000
```

> Trouble authenticating? See `.skills/dfds-npmrc-setup.md` for the full walkthrough.

## What's included

| Layer | Package | What it gives you |
|-------|---------|-------------------|
| Components | `navigator-components` | Button, TextInput, StatusBadge, Grid, Accordion, ... |
| Navigation | `compass-ui` | Responsive NavigationMenu with DFDS logo |
| Tokens & CSS | `navigator-styles` | Design tokens + Tailwind v4 preset |
| Icons | `navigator-icons` | Static, dynamic, and flexible icon loading |
| Framework | Next.js | App Router, SSR, streaming, server actions |
| Testing | Vitest + Testing Library | `pnpm test` |

## Project structure

```
app/
  layout.tsx       Root layout (NavigationMenu + shell)
  page.tsx         Home page with component showcase
  globals.css      Global styles + Tailwind config
components/        Reusable components
public/            Static assets
```

## Scripts

```bash
pnpm dev            # Dev server on :3000
pnpm build          # Production build (typechecks first)
pnpm start          # Start production server
pnpm test           # Run tests
pnpm typecheck      # tsc --noEmit
pnpm format         # Format with Prettier
pnpm check          # Typecheck + format check
```

## Architecture

### App Router

Next.js App Router with file-based routing:
- `app/page.tsx` → `/` (home page)
- `app/about/page.tsx` → `/about`
- `app/layout.tsx` → wraps all pages

### Data fetching

```tsx
// Server Component (default - data fetching on server)
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
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

```tsx
'use server';
export async function submitForm(formData: FormData) {
  // Server-side logic
  const result = await db.insert(formData);
  return result;
}
```

## Development

### TypeScript strict mode

TypeScript is configured in strict mode. Never suppress errors with `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck` — fix the root cause instead.

### Package manager

**pnpm only**. The `preinstall` script enforces this.

### Code quality

Before committing:

```bash
pnpm check    # Runs typecheck + format check
```

## Skills

All skills are in `.skills/` and auto-available to AI assistants:

- `navigator-ui.md` — Navigator component API reference
- `compass-ui.md` — Compass UI navigation
- `next-best-practices/` — Next.js best practices
- `dfds-npmrc-setup.md` — GitHub Package Registry auth
- `agent-browser.md` — Headless browser automation

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Navigator & Compass UI (DXP monorepo)](https://github.com/dfds-frontend/dxp) · [Storybook](https://ds-storybook-dfds.vercel.app)

## Contributing

Read `CONVENTIONS.md` for project rules and conventions.
