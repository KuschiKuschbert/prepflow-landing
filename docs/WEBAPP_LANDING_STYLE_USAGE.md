# Webapp Landing Style Usage Guide

## Overview

This guide explains when and how to use landing page styles in the webapp context. The webapp follows a **hybrid approach**: landing page styles enhance user-facing elements (headers, CTAs, empty states) while Cyber Carrot Design System remains the default for data interfaces (tables, forms, dashboards).

## Decision Tree

### When to Use Landing Page Styles

Use landing page styles for:

1. **Page Headers** - `PageHeader` component with `useLandingStyles={true}`
2. **Navigation** - Breadcrumbs and user info in `NavigationHeader`
3. **CTAs and Action Buttons** - Primary conversion-focused buttons
4. **Empty States** - User guidance and onboarding
5. **Quick Actions** - Dashboard action cards
6. **Welcome Sections** - Feature introductions

### When to Use Cyber Carrot Design System

Use Cyber Carrot Design System for:

1. **Data Tables** - All table components
2. **Forms** - Input fields, selects, checkboxes
3. **Dashboards** - Data visualization and analytics
4. **Modals** - Dialog boxes and overlays
5. **Toasts** - Notification messages
6. **Settings Pages** - Configuration interfaces

## Component Usage Examples

### PageHeader with Landing Styles

```tsx
import { PageHeader } from '@/app/webapp/components/static/PageHeader';

<PageHeader
  title="Recipes"
  subtitle="Manage your recipe collection"
  icon={BookOpen}
  useLandingStyles={true}
/>;
```

### Button with Landing Styles

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" landingStyle={true} magnetic={true} glow={true} onClick={handleClick}>
  Add Recipe
</Button>;
```

### EmptyState Component

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus } from 'lucide-react';

<EmptyState
  title="No recipes found"
  message="Start by creating your first recipe"
  icon={Plus}
  actions={
    <Button onClick={onAddRecipe} landingStyle={true}>
      Add Recipe
    </Button>
  }
  useLandingStyles={true}
  variant="landing"
  animated={true}
/>;
```

### QuickActions with Landing Styles

The `QuickActions` component automatically uses landing page styles with:

- `LANDING_COLORS` constants
- `GlowCard` wrappers
- Landing typography
- Framer Motion animations

### Action Buttons

All action button components (`RecipesActionButtons`, `EquipmentActionButtons`, etc.) now use `LANDING_COLORS` constants:

```tsx
import { LANDING_COLORS } from '@/lib/landing-styles';

// Colors are referenced via constants
style={{
  background: `linear-gradient(to right, ${LANDING_COLORS.primary}, ${LANDING_COLORS.accent})`,
}}
```

## Style Utilities

### Landing Style Constants

```tsx
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  WEBAPP_LANDING_PRESETS,
  getWebappHeaderClasses,
  getWebappCTAClasses,
  getWebappEmptyStateClasses,
} from '@/lib/landing-styles';
```

### Webapp Style Decision Helpers

```tsx
import {
  shouldUseLandingStyles,
  getComponentStyleVariant,
  getAnimationConfig,
} from '@/lib/webapp-styles';

// Check if component should use landing styles
const useLanding = shouldUseLandingStyles('header', { userFacing: true });

// Get recommended style variant
const variant = getComponentStyleVariant('cta', { userFacing: true });

// Get animation configuration
const animConfig = getAnimationConfig('emptyState', { userFacing: true });
```

## Performance Considerations

1. **Animations**: Use `animated={false}` for components that render frequently
2. **ScrollReveal**: Only enable for above-the-fold content
3. **MagneticButton**: Use sparingly for primary CTAs only
4. **GlowCard**: Lightweight, safe to use on multiple cards

## Accessibility

All landing page components support:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Focus Management**: Visible focus indicators

## Migration Checklist

When migrating existing components:

- [ ] Import `LANDING_COLORS` instead of hardcoded hex values
- [ ] Use `LANDING_TYPOGRAPHY` for text sizing
- [ ] Apply `useLandingStyles` prop where appropriate
- [ ] Wrap with `ScrollReveal` for entrance animations
- [ ] Use `GlowCard` for card components
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Verify keyboard navigation works
- [ ] Check screen reader compatibility

## Best Practices

1. **Consistency**: Use landing styles consistently across similar components
2. **Performance**: Don't over-animate - use animations sparingly
3. **Accessibility**: Always test with keyboard and screen readers
4. **Backward Compatibility**: All enhancements are optional via props
5. **Documentation**: Document when landing styles are used and why

## Examples

### Before (Cyber Carrot Design System)

```tsx
<div className="mb-4">
  <h1 className="text-xl font-bold text-white">Recipes</h1>
  <p className="text-gray-400">Manage your recipes</p>
</div>
```

### After (Landing Styles)

```tsx
<PageHeader title="Recipes" subtitle="Manage your recipes" useLandingStyles={true} />
```

## Background and Spotlight Effects

### WebappBackground Component

For enhanced webapp pages, you can use the `WebappBackground` component to add subtle background effects:

```tsx
import { WebappBackground } from '@/components/ui';

// Minimal (just spotlight)
<WebappBackground spotlight={true} />

// Full effects
<WebappBackground
  spotlight={true}
  grid={true}
  cornerGlows={true}
  watermarks={true}
  particles={true}
  spotlightIntensity={0.08}
/>
```

**Props:**

- `spotlight?: boolean` - Enable mouse-following spotlight (default: true)
- `grid?: boolean` - Enable tron-like neon grid
- `cornerGlows?: boolean` - Enable corner gradient glows
- `watermarks?: boolean` - Enable logo watermarks
- `particles?: boolean` - Enable floating particles (default: false)
- `spotlightIntensity?: number` - Spotlight intensity (0-1, default: 0.08)

**When to Use:**

- Dashboard welcome pages
- Feature introduction pages
- Onboarding flows
- Special announcement pages

**When NOT to Use:**

- Data-heavy pages (tables, forms)
- Settings pages
- Pages with frequent updates

## Resources

- [Landing Page Style Guide](./LANDING_PAGE_STYLE_GUIDE.md)
- [Landing Style Migration Guide](./LANDING_STYLE_MIGRATION.md)
- [Landing Styles Utility File](../lib/landing-styles.ts)
- [Webapp Style Decision Helpers](../lib/webapp-styles.ts)
