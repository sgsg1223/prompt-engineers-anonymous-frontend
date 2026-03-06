---
name: navigator-ui
description: |
  DFDS Navigator Design System - Production-ready React components, design tokens, and icons for building consistent DFDS user interfaces. Tailwind v3/v4 integration, dark mode support, type-safe patterns.

  Use when building DFDS applications, styling components, implementing design tokens, working with icons, or setting up dark mode. Prevents common import errors, theming issues, and TypeScript forwardRef problems.
user-invocable: true
allowed-tools: [Read, Write, Edit]
metadata:
  packages:
    - "@dfds-frontend/navigator-components"
    - "@dfds-frontend/navigator-styles"
    - "@dfds-frontend/navigator-icons"
  last_verified: "2026-02-02"
  repository: "https://github.com/dfds-frontend/navigator"
  documentation: "https://navigator.dfds.com"
  legacy_package: "@dfds-ui/react-components"
---

# DFDS Navigator Design System

⚠️ **Status: Production Ready**

The DFDS Navigator Design System provides a comprehensive UI library for building consistent, accessible, and brand-compliant DFDS applications. It consists of three core packages working together to deliver components, styling, and icons.

**Current Packages:**
- `@dfds-frontend/navigator-components` - React component library
- `@dfds-frontend/navigator-styles` - Design tokens and Tailwind integration
- `@dfds-frontend/navigator-icons` - Icon component library

This skill provides comprehensive guidance for setup, component usage, theming, dark mode, TypeScript patterns, and migration from legacy DFDS UI.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Packages Overview](#packages-overview)
- [Setup & Installation](#setup--installation)
- [Components](#components)
- [Icons](#icons)
- [Design Tokens](#design-tokens)
- [Dark Mode](#dark-mode)
- [TypeScript Patterns](#typescript-patterns)
- [Legacy Migration](#legacy-migration)
- [Common Issues](#common-issues)

---

## Quick Start

### Installation

```bash
# Install all three packages
pnpm add @dfds-frontend/navigator-components
pnpm add @dfds-frontend/navigator-styles
pnpm add @dfds-frontend/navigator-icons

# Optional: Radix UI for SelectInput
pnpm add @radix-ui/react-select
```

### Basic Setup

```typescript
// app/layout.tsx or main entry
import '@dfds-frontend/navigator-components/styles'
import { Button } from '@dfds-frontend/navigator-components'

export default function App() {
  return <Button>Click me</Button>
}
```

---

## Packages Overview

### @dfds-frontend/navigator-components

Production-ready React components following DFDS brand guidelines.

**Key Components:**
- `Button` - Primary, secondary, tertiary variants
- `TextInput` - Text input with label and validation
- `Label` - Form labels with required indicator
- `SelectInput` - Dropdown select (requires Radix UI)
- `NativeSelectInput` - Native HTML select (experimental)

**Installation:**
```bash
pnpm add @dfds-frontend/navigator-components
```

### @dfds-frontend/navigator-styles

Design tokens, Tailwind presets, and utility functions.

**Features:**
- Primitive, semantic, and typography tokens
- Tailwind v3 and v4 presets
- Utility functions (`cn`, `getBreakpoints`)
- Font imports

**Installation:**
```bash
pnpm add @dfds-frontend/navigator-styles
```

### @dfds-frontend/navigator-icons

Icon component library with multiple loading strategies.

**Features:**
- Direct imports for static icons
- Dynamic loading with `DynamicIcon`
- Flexible props with `Icon` component
- Type-safe icon names

**Installation:**
```bash
pnpm add @dfds-frontend/navigator-icons
```

---

## Setup & Installation

### CSS Entry Point

Import Navigator styles in your app entry:

```css
/* app/globals.css or similar */
@import '@dfds-frontend/navigator-components/styles';

/* Optional: Access source files for custom builds */
@source '../node_modules/@dfds-frontend/navigator-components/src';
```

### Tailwind v3 Configuration

```javascript
// tailwind.config.js
module.exports = {
  presets: [
    require('@dfds-frontend/navigator-styles/tailwind/v3')
  ],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@dfds-frontend/navigator-components/**/*.js'
  ]
}
```

### Tailwind v4 Configuration

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@dfds-frontend/navigator-styles/tailwind/v4';
@import '@dfds-frontend/navigator-styles/fonts';
```

**Why v4?**: Tailwind v4 uses CSS imports instead of JavaScript config, providing faster builds and better IDE support.

---

## Components

### Importing Components

```typescript
// Core components
import { Button, TextInput, Label, SelectInput } from '@dfds-frontend/navigator-components'

// Experimental components
import { NativeSelectInput } from '@dfds-frontend/navigator-components/experimental'
```

### Button Component

```tsx
import { Button } from '@dfds-frontend/navigator-components'

function Example() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button disabled>Disabled</Button>
    </>
  )
}
```

### TextInput Component

```tsx
import { TextInput, Label } from '@dfds-frontend/navigator-components'

function Example() {
  return (
    <div>
      <Label htmlFor="email">Email</Label>
      <TextInput
        id="email"
        type="email"
        placeholder="Enter your email"
        required
      />
    </div>
  )
}
```

### SelectInput Component

**Important**: Requires `@radix-ui/react-select` as peer dependency.

```bash
pnpm add @radix-ui/react-select
```

```tsx
import { SelectInput } from '@dfds-frontend/navigator-components'

function Example() {
  return (
    <SelectInput
      options={[
        { value: 'dk', label: 'Denmark' },
        { value: 'no', label: 'Norway' },
        { value: 'se', label: 'Sweden' }
      ]}
      value="dk"
      onChange={(value) => console.log(value)}
    />
  )
}
```

**Alternative**: Use `NativeSelectInput` for simpler use cases without Radix dependency.

---

---

## Icons

Navigator provides three icon loading strategies for different use cases.

### Strategy 1: Direct Import (Static)

**Use when**: Icon is always the same, best tree-shaking

```typescript
import { SearchIconComponent } from '@dfds-frontend/navigator-icons/icons'

function Example() {
  return <SearchIconComponent className="w-5 h-5" />
}
```

**Pros**: Smallest bundle size, fastest loading
**Cons**: Cannot change icon dynamically

### Strategy 2: Dynamic Loading

**Use when**: Icon changes based on state/props

```typescript
import { DynamicIcon } from '@dfds-frontend/navigator-icons'

function Example({ isLoading }: { isLoading: boolean }) {
  return (
    <DynamicIcon
      icon={isLoading ? 'LoadingIcon' : 'SearchIcon'}
      className="w-5 h-5"
    />
  )
}
```

**Pros**: Flexible, type-safe icon names
**Cons**: Slightly larger bundle (includes switching logic)

### Strategy 3: Flexible Prop Pattern

**Use when**: Building reusable components that accept icon props

```typescript
import { Icon, type IconProp } from '@dfds-frontend/navigator-icons'

interface CardProps {
  icon: IconProp
  title: string
}

function Card({ icon, title }: CardProps) {
  return (
    <div>
      <Icon icon={icon} className="w-6 h-6" />
      <h3>{title}</h3>
    </div>
  )
}

// Usage
<Card icon="SearchIcon" title="Search" />
<Card icon={<CustomIcon />} title="Custom" />
```

**Pros**: Maximum flexibility, accepts icon names or JSX
**Cons**: Largest bundle size

### Icon Naming Convention

All icons follow the pattern: `{Name}Icon` or `{Name}IconComponent`

```typescript
// Import names
import { SearchIconComponent } from '@dfds-frontend/navigator-icons/icons'
import { LoadingIconComponent } from '@dfds-frontend/navigator-icons/icons'

// String names (for DynamicIcon)
<DynamicIcon icon="SearchIcon" />
<DynamicIcon icon="LoadingIcon" />
```

---

## Design Tokens

### Token Types

Navigator provides three levels of design tokens:

1. **Primitive tokens** - Raw values (colors, spacing, etc.)
2. **Semantic tokens** - Purpose-based tokens (primary, secondary, error)
3. **Typography tokens** - Font families, sizes, weights

### CSS Imports

```css
/* Import all token types */
@import '@dfds-frontend/navigator-styles/fonts';
@import '@dfds-frontend/navigator-styles/tokens/primitive';
@import '@dfds-frontend/navigator-styles/tokens/semantic';
@import '@dfds-frontend/navigator-styles/tokens/typography';
```

### Using Tokens in CSS

```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-md);
}
```

### Using Tokens in JavaScript

```typescript
import { cn, getBreakpoints } from '@dfds-frontend/navigator-styles/utils'

// cn() - Tailwind class merging utility
const buttonClasses = cn(
  'px-4 py-2',
  'bg-primary text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)

// getBreakpoints() - Responsive breakpoint values
const breakpoints = getBreakpoints()
// { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }
```

---

## Dark Mode

Navigator components automatically support dark mode using Tailwind's `dark:` variant strategy.

### Setup

Add `dark` class to a container element to enable dark mode:

```tsx
<section className="dark">
  {/* All Navigator components inside automatically switch to dark mode */}
  <Button>Dark mode button</Button>
</section>
```

### How It Works

Components use `on-dark:` Tailwind variant which activates when a parent has the `dark` class:

```css
/* Component styles automatically include */
.button {
  background-color: var(--color-primary);
}

.dark .button {
  background-color: var(--color-primary-dark);
}
```

### Application-Wide Dark Mode

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  return (
    <html className={isDark ? 'dark' : ''}>
      <body>{children}</body>
    </html>
  )
}
```

### User Preference Detection

```tsx
import { useEffect, useState } from 'react'

function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check user's system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return [isDark, setIsDark] as const
}
```

---

## TypeScript Patterns

### Generic forwardRef Pattern

Navigator components use a polymorphic pattern allowing components to render as different HTML elements while maintaining type safety.

**Pattern Structure:**

```typescript
import React from 'react'

// Component props with generic element type
interface ComponentProps<E extends React.ElementType = 'span'> {
  as?: E
  children: React.ReactNode
}

// Implementation function with generic
function ComponentImpl<E extends React.ElementType = 'span'>(
  props: ComponentProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const { as: Component = 'span', children, ...rest } = props

  return (
    <Component ref={ref} {...rest}>
      {children}
    </Component>
  )
}

// Set display name for debugging
ComponentImpl.displayName = 'Component'

// Export with proper typing
export const Component = React.forwardRef(ComponentImpl) as <
  E extends React.ElementType = 'span',
>(
  props: ComponentProps<E> & { ref?: React.ForwardedRef<Element> }
) => React.ReactElement | null
```

**Usage:**

```tsx
// Render as span (default)
<Component>Text</Component>

// Render as button
<Component as="button" onClick={() => {}}>
  Click me
</Component>

// Render as link
<Component as="a" href="/page">
  Link
</Component>

// Full type safety maintained for all element types
```

**Why This Pattern?**

1. **Flexibility**: Same component can be button, link, div, etc.
2. **Type Safety**: TypeScript knows valid props for each element type
3. **Ref Forwarding**: Refs work correctly for any element type
4. **API Simplicity**: Single component instead of Button, LinkButton, etc.

### Type-Safe Icon Props

```typescript
import { type IconProp } from '@dfds-frontend/navigator-icons'

interface CardProps {
  icon: IconProp  // Accepts icon name string or JSX element
  title: string
}
```

---

## Legacy Migration

### Migrating from @dfds-ui/* Packages

The legacy DFDS UI library is being replaced by Navigator. Here's how to migrate:

#### Package Mapping

| Legacy Package | Navigator Package |
|----------------|-------------------|
| `@dfds-ui/react-components` | `@dfds-frontend/navigator-components` |
| `@dfds-ui/typography` | `@dfds-frontend/navigator-styles` (typography tokens) |
| `@dfds-ui/forms` | `@dfds-frontend/navigator-components` (form components) |
| `@dfds-ui/icons` | `@dfds-frontend/navigator-icons` |

#### Component Mapping

| Legacy | Navigator |
|--------|-----------|
| `<Button />` | `<Button />` (same API) |
| `<Card />` | Build with design tokens + Tailwind |
| `<Column />, <Container />` | Use Tailwind layout utilities |
| `<Text />` | Use typography tokens + semantic HTML |
| `<Switch />` | `<TextInput type="checkbox" />` or custom component |
| `<Logo />` | Import from `@dfds-frontend/navigator-icons` |

#### Import Updates

```typescript
// Before (Legacy)
import { Button, Card, Column, Container } from "@dfds-ui/react-components"
import { Logo } from "@dfds-ui/react-components/logo"
import { Text } from "@dfds-ui/typography"
import { Switch } from "@dfds-ui/forms"
import { BuPax, No } from "@dfds-ui/icons/system"

// After (Navigator)
import { Button } from "@dfds-frontend/navigator-components"
import { LogoIconComponent } from "@dfds-frontend/navigator-icons/icons"
import { BuPaxIconComponent, NoIconComponent } from "@dfds-frontend/navigator-icons/icons"

// Layout: Use Tailwind utilities
<div className="container mx-auto">
  <div className="grid grid-cols-12 gap-4">
    {/* Content */}
  </div>
</div>

// Typography: Use semantic HTML + tokens
<h1 className="text-2xl font-bold">Heading</h1>
<p className="text-base">Body text</p>
```

#### Migration Strategy

1. **Install Navigator packages** alongside legacy packages
2. **Migrate incrementally** - Start with new features using Navigator
3. **Create adapter components** if needed for gradual migration
4. **Update imports** file by file
5. **Remove legacy packages** once migration complete

#### Breaking Changes

- **Layout components removed**: Use Tailwind/CSS Grid instead
- **Typography component removed**: Use semantic HTML + design tokens
- **Icon imports changed**: New icon component pattern
- **Theming approach**: CSS variables instead of JavaScript theme objects

---

## Common Issues

### Issue #1: SelectInput Peer Dependency Missing

**Error**: "Cannot find module '@radix-ui/react-select'"

**Cause**: `SelectInput` requires Radix UI as a peer dependency but it's not installed.

**Solution**:
```bash
pnpm add @radix-ui/react-select
```

**Alternative**: Use `NativeSelectInput` if you don't need Radix features:
```typescript
import { NativeSelectInput } from '@dfds-frontend/navigator-components/experimental'
```

### Issue #2: Styles Not Loading

**Error**: Components appear unstyled

**Cause**: Navigator styles not imported in application entry.

**Solution**: Import styles in your main CSS or app entry:
```css
@import '@dfds-frontend/navigator-components/styles';
```

### Issue #3: Tailwind Classes Not Working

**Error**: Tailwind utility classes don't apply

**Cause**: Tailwind not configured to scan Navigator components.

**Solution**: Update `content` in tailwind.config.js:
```javascript
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@dfds-frontend/navigator-components/**/*.js'  // Add this
  ]
}
```

### Issue #4: Dark Mode Not Working

**Error**: Dark mode styles don't apply

**Cause**: Missing `dark` class on container element.

**Solution**: Add `dark` class to parent:
```tsx
<section className="dark">
  <Button>This will use dark mode styles</Button>
</section>
```

### Issue #5: Icon Not Found

**Error**: "Cannot find icon 'XyzIcon'"

**Cause**: Icon name doesn't match available icons or wrong import path.

**Solution**: Check icon naming convention and import path:
```typescript
// Correct - use IconComponent suffix for direct imports
import { SearchIconComponent } from '@dfds-frontend/navigator-icons/icons'

// Correct - use Icon name (no Component suffix) for dynamic
<DynamicIcon icon="SearchIcon" />
```

### Issue #6: TypeScript Generic Component Errors

**Error**: Type errors with polymorphic components

**Cause**: Incorrect usage of `as` prop or missing type annotations.

**Solution**: Ensure proper typing when using `as` prop:
```typescript
// If component accepts 'as' prop
<Component as="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}>
  Click
</Component>
```

### Issue #7: Font Loading Issues

**Error**: Custom fonts not loading

**Cause**: Font imports not included in build.

**Solution**: Import fonts in your global CSS:
```css
@import '@dfds-frontend/navigator-styles/fonts';
```

---

## Additional Resources

**Official Documentation**:
- Navigator Documentation: https://navigator.dfds.com
- DFDS Design System: https://design.dfds.com
- Component Storybook: https://storybook.navigator.dfds.com

**Package Repositories**:
- GitHub: https://github.com/dfds-frontend/navigator
- npm: https://www.npmjs.com/org/dfds-frontend

**Support**:
- Issues: https://github.com/dfds-frontend/navigator/issues
- Slack: #navigator-support (internal)

**Related Skills**:
- `tailwind-v4-shadcn` - Tailwind v4 patterns
- `next` - If building with Next.js
- `react-hook-form-zod` - Form handling with validation

---

**Last verified**: 2026-02-02 | **Skill version**: 2.0.0 | **Changes**: Complete rewrite with comprehensive component docs, icon strategies, TypeScript patterns, dark mode guide, legacy migration path, and common issues prevention
