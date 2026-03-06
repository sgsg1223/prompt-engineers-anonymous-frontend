# Project Conventions

## Package manager

Use `pnpm` exclusively. Enforced by preinstall hook.

## TypeScript

Strict mode is on. Never suppress errors -- fix the root cause.

Forbidden: `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, disabling `strict` or `noImplicitAny` in tsconfig.

## Package versions

Never downgrade without explicit user approval. Try to fix forward first: read changelogs, check migration guides, search issues.

## Code quality

```bash
pnpm typecheck      # tsc --noEmit
pnpm format         # prettier --write
pnpm check          # both at once
```

Run before committing. `pnpm build` runs typecheck automatically via `prebuild`.

## File organization

- Routes: `app/` (Next.js App Router)
- Components: `components/`
- Global styles: `app/globals.css`
- Static assets: `public/`

## Routing patterns

- Root layout: `app/layout.tsx`
- Index routes: `page.tsx`
- Dynamic segments: `[id]` folders (`app/posts/[id]/page.tsx`)
- Route groups: `(group)` folders
- Navigation: Next.js `<Link href="/path">` component
- Data loading: async Server Components by default

## Testing

Vitest + `@testing-library/react`. Run with `pnpm test`.

## Git workflow

### Branch naming

- Features: `feat/description-with-hyphens`
- Bug fixes: `bug/description-with-hyphens`

### Pull request titles

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type: brief description of changes
```

Types: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `perf:`, `test:`, `chore:`

### Pushing changes

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make changes, then run quality checks:
   ```bash
   pnpm check          # typecheck + format check
   pnpm format         # fix formatting if needed
   ```
3. Commit with a descriptive message
4. Push and create a PR: `git push -u origin feat/my-feature`
5. Open a pull request against `master` -- use the PR template
6. Get a review before merging
