---
name: compass-ui
description: |
  DFDS CompassUI Design System (Legacy) - Fallback React component library for components not yet available in Navigator. Tailwind v3/v4 support, atomic design structure, comprehensive token system.

  **USE ONLY when component is NOT available in Navigator.** Navigator is the primary design system - CompassUI is the legacy fallback.
user-invocable: true
allowed-tools: [Read, Write, Edit]
metadata:
  packages:
    - "@dfds-frontend/compass-ui"
  last_verified: "2026-02-03"
  repository: "https://github.com/dfds-frontend/dxp"
  storybook: "https://ds-storybook-dfds.vercel.app"
  supernova: "https://responsible-swan-cyan.supernova-docs.io/latest/welcome-to-dfds-design-system-K4CwBKTz"
  figma: "https://www.figma.com/design/9xpqZr1GVjGoOum6kUjLAd/Compass-Library"
  figma_icons: "https://www.figma.com/design/VfFzccnn9iIPzmm6XmInRV/Icon-Library"
  primary_system: "Navigator (@dfds-frontend/navigator-components)"
---

# DFDS CompassUI Design System (Legacy)

⚠️ **Status: Legacy / Maintenance Mode**

**IMPORTANT**: CompassUI is the **legacy** DFDS design system. The primary design system is now **Navigator** (`@dfds-frontend/navigator-components`).

**When to use CompassUI:**

- ✅ When a component is NOT available in Navigator
- ✅ When migrating from older DFDS projects
- ❌ Do NOT use for new components if Navigator equivalent exists

**Always check Navigator first** - See `.skills/navigator-ui.md`

---

## Table of Contents

- [Quick Reference](#quick-reference)
- [Installation](#installation)
- [Setup & Configuration](#setup--configuration)
- [Component Organization](#component-organization)
- [Using Components](#using-components)
- [Tokens](#tokens)
- [Component Status Tags](#component-status-tags)
- [Migration to Navigator](#migration-to-navigator)
- [Common Issues](#common-issues)

---

## Quick Reference

### Package

```bash
pnpm add @dfds-frontend/compass-ui
```

### Documentation Links

- **Storybook**: https://ds-storybook-dfds.vercel.app
- **Supernova Docs**: https://responsible-swan-cyan.supernova-docs.io/latest/welcome-to-dfds-design-system-K4CwBKTz
- **Figma Library**: https://www.figma.com/design/9xpqZr1GVjGoOum6kUjLAd/Compass-Library
- **Icons (Figma)**: https://www.figma.com/design/VfFzccnn9iIPzmm6XmInRV/Icon-Library

### Basic Import

```typescript
import { Button, Card, MediaCard } from "@dfds-frontend/compass-ui";
```

---

## Installation

### Step 1: Install Package

```bash
pnpm add @dfds-frontend/compass-ui
```

### Step 2: Configure Styles

Choose the setup that matches your project's CSS framework.

---

## Setup & Configuration

### Tailwind v4 (Recommended)

Import CompassUI base and theme styles, plus use `@source` directive:

```css
/* src/styles.css or app/globals.css */
@import "@dfds-frontend/compass-ui/styles/base";
@import "@dfds-frontend/compass-ui/styles/theme";
@import "tailwindcss";
@source '../node_modules/@dfds-frontend/compass-ui';
```

**Why this order?**

1. CompassUI base styles first
2. CompassUI theme tokens
3. Tailwind CSS last
4. `@source` scans CompassUI for class names

### Tailwind v3

Import base styles, then add Tailwind directives and preset:

```css
/* global.css */
@import "@dfds-frontend/compass-ui/styles/base";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```javascript
// tailwind.config.js
import preset from "@dfds-frontend/compass-ui/tailwind/preset";

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [preset],
  content: [
    // Your app content
    "./src/**/*.{js,jsx,ts,tsx}",
    // Scan CompassUI components
    "./node_modules/@dfds-frontend/compass-ui/components/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
```

### Standalone (No Tailwind)

If you don't use Tailwind, import the standalone bundle:

```css
/* global.css */
@import "@dfds-frontend/compass-ui/styles/standalone";
```

⚠️ **Note**: Standalone provides component styles but NOT design tokens for your project.

### Tokens-Only

Use just CSS tokens/variables without components:

```css
/* global.css */
@import "@dfds-frontend/compass-ui/tokens/primitive";
@import "@dfds-frontend/compass-ui/tokens/semantic";
@import "@dfds-frontend/compass-ui/tokens/components";
```

**Token Dependencies:**

- `semantic.css` depends on `primitive.css`
- `components.css` depends on `semantic.css`
- Import all dependencies manually (no auto-import)

---

## Component Organization

CompassUI follows **Atomic Design** principles:

### Component Structure

```
@dfds-frontend/compass-ui
├── components/
│   ├── atoms/          # Basic building blocks (Button, Input, Label)
│   ├── molecules/      # Simple component groups (FormInput, Card parts)
│   ├── organisms/      # Complex components (MediaCard, Navigation)
│   ├── forms/          # Form-specific components
│   ├── icons/          # Icon components
│   ├── media/          # Media components (Image, Video)
│   ├── navigations/    # Navigation components
│   └── typography/     # Text components
```

### Path Aliases (Internal Development)

When working **inside** CompassUI repository:

- `@atoms/*` → `./components/atoms/*`
- `@molecules/*` → `./components/molecules/*`
- `@organisms/*` → `./components/organisms/*`
- `@components/*` → `./components/*`
- `@forms/*` → `./components/forms/*`
- `@icons` → `./components/icons/index.ts`
- `@typography/*` → `./components/foundation/typography/*`
- `@utils/*` → `./components/utils/*`
- `@helpers/*` → `./helpers/*`
- `@hooks/*` → `./hooks/*`

**Consumer projects**: Import directly from package root:

```typescript
import { Button } from "@dfds-frontend/compass-ui";
```

---

## Using Components

### Basic Example

```typescript
import {
  Button,
  MediaCard,
  CardMedia,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardButtons
} from '@dfds-frontend/compass-ui'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-6">
      <MediaCard>
        <CardMedia src="https://placehold.co/1600x900" />
        <CardContent>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna
          </CardDescription>
        </CardContent>
        <CardFooter>
          <CardButtons>
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
          </CardButtons>
        </CardFooter>
      </MediaCard>
    </main>
  )
}
```

### Common Components

#### Buttons

```typescript
import { Button } from '@dfds-frontend/compass-ui'

<Button>Default Button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button disabled>Disabled</Button>
```

#### Cards

```typescript
import {
  MediaCard,
  CardMedia,
  CardContent,
  CardTitle,
  CardDescription
} from '@dfds-frontend/compass-ui'

<MediaCard>
  <CardMedia src="/image.jpg" />
  <CardContent>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardContent>
</MediaCard>
```

#### Forms

```typescript
import { Input, Label, FormField } from '@dfds-frontend/compass-ui'

<FormField>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</FormField>
```

---

## Tokens

CompassUI provides three token layers:

### 1. Primitive Tokens

Base values (colors, spacing, typography scales)

```css
@import "@dfds-frontend/compass-ui/tokens/primitive";
```

### 2. Semantic Tokens

Purpose-based tokens that reference primitives

```css
@import "@dfds-frontend/compass-ui/tokens/semantic";
```

### 3. Component Tokens

Component-specific styling tokens

```css
@import "@dfds-frontend/compass-ui/tokens/components";
```

### Token Usage

```css
.custom-component {
  /* Use CSS variables from tokens */
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}
```

---

## Component Status Tags

CompassUI uses Storybook tags to indicate component status. Check Storybook before using:

### Status Tags

- **`stable`** - Production-ready, fully tested
- **`new`** - Recently added
- **`beta`** - Testing phase (not stable)
- **`alpha`** - Early development (not stable)
- **`experimental`** - Experimental (not stable)
- **`deprecated`** - Avoid in new code
- **`outdated`** - Design changes not yet implemented
- **`rc`** - Release candidate (not fully stable)

### Special Tags

- **`danger`** - Requires particular attention (security, breaking changes)
- **`code-only`** - Exists in code only, not in design

### Versioning Tags

- **`version:*`** - Component version (e.g., `version:2.1.0`)
- **`v:*`** - Short version (e.g., `v:2.1`)

### How to Check Status

1. Visit [Storybook](https://ds-storybook-dfds.vercel.app)
2. Find the component
3. Check badges at the top
4. **Prefer `stable` components** for production

---

## Migration to Navigator

**Navigator is the future** - CompassUI is in maintenance mode.

### Migration Strategy

1. **Check Navigator first**: Always look for component in Navigator
2. **Use CompassUI temporarily**: Only if Navigator doesn't have it
3. **Plan migration**: Schedule update when Navigator adds the component
4. **Don't mix patterns**: Keep Navigator and CompassUI separate where possible

### Component Mapping

| CompassUI   | Navigator Status           |
| ----------- | -------------------------- |
| Button      | ✅ Available in Navigator  |
| TextInput   | ✅ Available in Navigator  |
| Label       | ✅ Available in Navigator  |
| SelectInput | ✅ Available in Navigator  |
| Card        | ❌ Use CompassUI MediaCard |
| MediaCard   | ❌ Not yet in Navigator    |
| FormField   | ❌ Not yet in Navigator    |

Check Navigator skill (`.skills/navigator-ui.md`) for full component list.

---

## Common Issues

### Issue 1: Styles Not Loading

**Problem**: Components render but have no styling

**Solution**: Verify import order in your CSS:

```css
/* CORRECT order for Tailwind v4 */
@import "@dfds-frontend/compass-ui/styles/base";
@import "@dfds-frontend/compass-ui/styles/theme";
@import "tailwindcss";
@source '../node_modules/@dfds-frontend/compass-ui';
```

### Issue 2: Tailwind Classes Not Working

**Problem**: Tailwind utilities from CompassUI don't work

**Tailwind v3 Solution**: Add content path in `tailwind.config.js`:

```javascript
content: [
  "./node_modules/@dfds-frontend/compass-ui/components/**/*.{js,ts,jsx,tsx}",
];
```

**Tailwind v4 Solution**: Add `@source` directive:

```css
@source '../node_modules/@dfds-frontend/compass-ui';
```

### Issue 3: TypeScript Errors with Imports

**Problem**: Cannot find module '@dfds-frontend/compass-ui'

**Solution**:

1. Ensure package is installed: `pnpm add @dfds-frontend/compass-ui`
2. Restart TypeScript server in your IDE
3. Check `node_modules/@dfds-frontend` folder exists

### Issue 4: Component Conflicts with Navigator

**Problem**: Both CompassUI and Navigator have same component name

**Solution**: Use named imports with aliases:

```typescript
import { Button as CompassButton } from '@dfds-frontend/compass-ui'
import { Button as NavigatorButton } from '@dfds-frontend/navigator-components'

// Use Navigator by default
<NavigatorButton>Primary Action</NavigatorButton>

// Use CompassUI only when necessary
<CompassButton>Legacy Action</CompassButton>
```

### Issue 5: Standalone Bundle Size

**Problem**: Standalone bundle adds too much CSS

**Solution**: Switch to Tailwind setup instead of standalone:

```css
/* Remove standalone */
/* @import '@dfds-frontend/compass-ui/styles/standalone'; */

/* Use Tailwind setup instead */
@import "@dfds-frontend/compass-ui/styles/base";
@import "@dfds-frontend/compass-ui/styles/theme";
@import "tailwindcss";
@source '../node_modules/@dfds-frontend/compass-ui';
```

---

## Example Projects

Reference implementations in the DXP monorepo:

- **Tailwind v4**: `apps/web` - https://github.com/dfds-frontend/dxp/tree/main/apps/web
- **Tailwind v3**: `apps/web-v3` - https://github.com/dfds-frontend/dxp/tree/main/apps/web-v3
- **Emotion**: `apps/web-emotion` - https://github.com/dfds-frontend/dxp/tree/main/apps/web-emotion

---

## Quick Decision Tree

```
Need a component?
│
├─ Is it in Navigator?
│  ├─ YES → Use Navigator (@dfds-frontend/navigator-components)
│  └─ NO → Check CompassUI Storybook
│     │
│     ├─ Found in CompassUI?
│     │  ├─ Check tag: Is it 'stable'?
│     │  │  ├─ YES → Use CompassUI temporarily
│     │  │  └─ NO → Consider custom implementation or wait
│     │  └─ Plan migration to Navigator when available
│     │
│     └─ Not in CompassUI?
│        └─ Build custom component or request from design team
```

---

## Summary

**CompassUI** is DFDS's legacy design system:

- ✅ Use when Navigator doesn't have the component
- ✅ Supports Tailwind v3 and v4
- ✅ Comprehensive token system
- ✅ Well-documented in Storybook
- ⚠️ In maintenance mode - Navigator is the future
- ❌ Don't use if Navigator equivalent exists

**Always prefer Navigator** - See `.skills/navigator-ui.md`
