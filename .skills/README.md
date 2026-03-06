# Skills

AI skill files that give assistants deep context about this project's stack. Automatically discovered by compatible tools.

## Available skills

| Skill | What it covers | Source |
|-------|---------------|--------|
| `dfds-npmrc-setup.md` | GitHub Package Registry auth, token setup, SSO, troubleshooting | Project |
| `navigator-ui.md` | Navigator components, tokens, icons, dark mode, TypeScript patterns | Project |
| `compass-ui.md` | Compass UI NavigationMenu and navigation patterns | Project |
| `agent-browser.md` | Headless browser automation (navigation, forms, screenshots) | [vercel-labs](https://github.com/vercel-labs/agent-browser) |
| `next-best-practices/` | Next.js best practices: RSC boundaries, async patterns, data fetching, routing | Project |

## Recommended order for new projects

1. `dfds-npmrc-setup.md` -- auth first
2. `next-best-practices/` -- understand Next.js patterns
3. `navigator-ui.md` -- build UI
4. `compass-ui.md` -- navigation components

## Browser automation (optional)

```bash
npm install -g agent-browser && agent-browser install
```
