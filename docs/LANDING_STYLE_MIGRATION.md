# Landing Page Style Migration Guide

**Last Updated:** January 2025

This guide provides practical examples and best practices for applying landing page styles to new components and migrating existing components to use the landing page style system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Migration Examples](#migration-examples)
3. [Component Patterns](#component-patterns)
4. [Common Pitfalls](#common-pitfalls)
5. [Best Practices](#best-practices)
6. [Style Utilities Reference](#style-utilities-reference)

---

## Quick Start

### 1. Import Style Utilities

```typescript
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  LANDING_SPACING,
  getGlowColor,
  getSectionClasses,
} from '@/lib/landing-styles';
```

### 2. Use Landing Page Components

```typescript
import { MagneticButton } from '@/components/ui/MagneticButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
```

### 3. Apply Fluid Typography

```typescript
<h2 className="text-fluid-3xl font-bold text-white">Section Title</h2>
<p className="text-fluid-base text-gray-400">Body text content</p>
```

### 4. Structure Sections

```typescript
<section className={getSectionClasses({ padding: 'large' })}>
  <div className="mx-auto max-w-7xl px-6">
    <ScrollReveal variant="fade-up">
      {/* Section content */}
    </ScrollReveal>
  </div>
</section>
```

---

## Migration Examples

### Example 1: Converting a Standard Section to Landing Page Style

**Before (Webapp Style):**

```typescript
<section className="py-8 desktop:py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl desktop:text-3xl font-semibold text-white mb-4">
      Features
    </h2>
    <p className="text-base text-gray-300">
      Our amazing features
    </p>
  </div>
</section>
```

**After (Landing Page Style):**

```typescript
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getSectionClasses } from '@/lib/landing-styles';

<section className={getSectionClasses({ padding: 'large' })}>
  <div className="mx-auto max-w-7xl px-6">
    <ScrollReveal variant="fade-up">
      <h2 className="text-fluid-3xl font-bold text-white mb-6">
        Features
      </h2>
      <p className="text-fluid-base text-gray-400">
        Our amazing features
      </p>
    </ScrollReveal>
  </div>
</section>
```

**Key Changes:**

- ✅ Replaced fixed padding with `getSectionClasses()` utility
- ✅ Changed container to `max-w-7xl mx-auto px-6` pattern
- ✅ Replaced fixed typography with fluid typography classes
- ✅ Added `ScrollReveal` for entrance animation
- ✅ Updated text colors to landing page palette

### Example 2: Converting a Button to MagneticButton

**Before (Standard Button):**

```typescript
<button
  onClick={handleClick}
  className="bg-[#29E7CD] hover:bg-[#29E7CD]/90 rounded-lg px-6 py-3 text-white font-medium transition-colors"
>
  Get Started
</button>
```

**After (MagneticButton):**

```typescript
import { MagneticButton } from '@/components/ui/MagneticButton';

<MagneticButton
  onClick={handleClick}
  className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] rounded-2xl px-8 py-4 text-white font-medium"
  strength={0.3}
  scaleOnHover={true}
>
  Get Started
</MagneticButton>
```

**Key Changes:**

- ✅ Replaced standard button with `MagneticButton`
- ✅ Added gradient background (`from-[#29E7CD] to-[#D925C7]`)
- ✅ Increased border radius to `rounded-2xl`
- ✅ Added magnetic hover effect
- ✅ Enabled scale animation on hover

### Example 3: Converting Cards to GlowCard

**Before (Standard Card):**

```typescript
<div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6">
  <h3 className="text-xl font-semibold text-white mb-2">Feature</h3>
  <p className="text-gray-400">Feature description</p>
</div>
```

**After (GlowCard):**

```typescript
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getGlowColor } from '@/lib/landing-styles';

<ScrollReveal variant="fade-up" delay={0.1}>
  <GlowCard
    glowColor={getGlowColor('#29E7CD')}
    className="p-8"
  >
    <h3 className="text-fluid-xl font-bold text-white mb-3">Feature</h3>
    <p className="text-fluid-base text-gray-400">Feature description</p>
  </GlowCard>
</ScrollReveal>
```

**Key Changes:**

- ✅ Replaced standard card with `GlowCard`
- ✅ Added glow effect with `getGlowColor()` utility
- ✅ Wrapped in `ScrollReveal` for entrance animation
- ✅ Updated typography to fluid classes
- ✅ Increased padding for better spacing

### Example 4: Converting a Feature Grid

**Before (Webapp Grid):**

```typescript
<div className="grid grid-cols-1 desktop:grid-cols-3 gap-6">
  {features.map((feature) => (
    <div key={feature.id} className="bg-[#1f1f1f] p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
      <p className="text-sm text-gray-400 mt-2">{feature.description}</p>
    </div>
  ))}
</div>
```

**After (Landing Page Grid):**

```typescript
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LANDING_COLORS } from '@/lib/landing-styles';

<div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-8">
  {features.map((feature, index) => (
    <ScrollReveal
      key={feature.id}
      variant="fade-up"
      delay={index * 0.1}
    >
      <GlowCard
        glowColor={LANDING_COLORS.glow.primary}
        className="p-8"
      >
        <h3 className="text-fluid-xl font-bold text-white mb-3">
          {feature.title}
        </h3>
        <p className="text-fluid-base text-gray-400">
          {feature.description}
        </p>
      </GlowCard>
    </ScrollReveal>
  ))}
</div>
```

**Key Changes:**

- ✅ Updated grid breakpoints to landing page system (`tablet:`, `desktop:`)
- ✅ Wrapped each card in `ScrollReveal` with staggered delays
- ✅ Replaced standard cards with `GlowCard`
- ✅ Updated typography to fluid classes
- ✅ Increased gap spacing for better visual hierarchy

### Example 5: Converting a Hero Section

**Before (Basic Hero):**

```typescript
<section className="py-16 desktop:py-24">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-4xl desktop:text-6xl font-bold text-white mb-4">
      Welcome to PrepFlow
    </h1>
    <p className="text-lg desktop:text-xl text-gray-300 mb-8">
      Optimize your restaurant profitability
    </p>
    <button className="bg-[#29E7CD] px-8 py-4 rounded-lg text-white">
      Get Started
    </button>
  </div>
</section>
```

**After (Landing Page Hero):**

```typescript
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getSectionClasses } from '@/lib/landing-styles';

<section className={`${getSectionClasses({ padding: 'xlarge' })} relative overflow-hidden`}>
  {/* Background Glow */}
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="h-[500px] w-[500px] rounded-full bg-[#29E7CD]/10 blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-4xl px-6 text-center">
    <ScrollReveal variant="fade-up">
      <h1 className="text-fluid-4xl font-bold tracking-tight text-white mb-6">
        Welcome to PrepFlow
      </h1>
      <p className="text-fluid-xl text-gray-400 mb-12">
        Optimize your restaurant profitability
      </p>
    </ScrollReveal>

    <ScrollReveal variant="fade-up" delay={0.2}>
      <MagneticButton
        className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] rounded-2xl px-10 py-5 text-white font-medium"
        scaleOnHover={true}
      >
        Get Started
      </MagneticButton>
    </ScrollReveal>
  </div>
</section>
```

**Key Changes:**

- ✅ Added background glow effect
- ✅ Used `getSectionClasses()` for responsive padding
- ✅ Wrapped content in `ScrollReveal` with staggered delays
- ✅ Updated typography to fluid classes
- ✅ Replaced button with `MagneticButton` with gradient
- ✅ Added `relative` positioning for background effects

---

## Component Patterns

### Pattern 1: Standard Landing Section

```typescript
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getSectionClasses } from '@/lib/landing-styles';

export function StandardSection() {
  return (
    <section className={getSectionClasses({ padding: 'large' })}>
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <h2 className="text-fluid-3xl font-bold text-white mb-6">
            Section Title
          </h2>
          <p className="text-fluid-base text-gray-400">
            Section description
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

### Pattern 2: Feature Grid with GlowCards

```typescript
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LANDING_COLORS } from '@/lib/landing-styles';

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-8">
      {features.map((feature, index) => (
        <ScrollReveal
          key={feature.id}
          variant="fade-up"
          delay={index * 0.1}
        >
          <GlowCard
            glowColor={LANDING_COLORS.glow.primary}
            className="p-8"
          >
            <h3 className="text-fluid-xl font-bold text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-fluid-base text-gray-400">
              {feature.description}
            </p>
          </GlowCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
```

### Pattern 3: CTA Section with MagneticButtons

```typescript
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getSectionClasses } from '@/lib/landing-styles';

export function CTASection() {
  return (
    <section className={`${getSectionClasses({ padding: 'xlarge' })} relative overflow-hidden`}>
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-[#29E7CD]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal variant="fade-up">
          <h2 className="text-fluid-4xl font-bold tracking-tight text-white mb-6">
            Ready to get started?
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="tablet:flex-row mt-12 flex flex-col items-center justify-center gap-4">
            <MagneticButton
              className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] rounded-2xl px-10 py-5 text-white font-medium"
              scaleOnHover={true}
            >
              Get Started
            </MagneticButton>
            <MagneticButton
              className="bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl px-10 py-5 text-white font-medium hover:bg-[#2a2a2a]/80"
              scaleOnHover={true}
            >
              Learn More
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

### Pattern 4: Metric Display with Animated Counters

```typescript
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getGlowColor } from '@/lib/landing-styles';

export function MetricDisplay({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid gap-12">
      {metrics.map((metric, index) => (
        <ScrollReveal
          key={metric.label}
          variant="fade-up"
          delay={index * 0.1}
        >
          <GlowCard
            glowColor={getGlowColor(metric.color)}
            className="p-10 text-center"
          >
            <AnimatedCounter
              value={metric.value}
              suffix={metric.suffix}
              color={metric.color}
            />
            <h3 className="text-fluid-2xl mt-6 font-light text-white">
              {metric.label}
            </h3>
            <p className="text-fluid-base mt-3 text-gray-400 leading-relaxed">
              {metric.description}
            </p>
          </GlowCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
```

---

## Common Pitfalls

### ❌ Pitfall 1: Mixing Webapp and Landing Styles

**Don't:**

```typescript
// Mixing webapp table styles with landing page components
<GlowCard className="p-8">
  <table className="min-w-full divide-y divide-[#2a2a2a]">
    {/* Table content */}
  </table>
</GlowCard>
```

**Do:**

```typescript
// Use landing page components for landing pages
<GlowCard className="p-8">
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id} className="border-b border-[#2a2a2a] pb-4">
        {/* Item content */}
      </div>
    ))}
  </div>
</GlowCard>
```

### ❌ Pitfall 2: Using Fixed Typography Instead of Fluid

**Don't:**

```typescript
<h2 className="text-2xl desktop:text-3xl font-bold">Title</h2>
```

**Do:**

```typescript
<h2 className="text-fluid-3xl font-bold">Title</h2>
```

### ❌ Pitfall 3: Forgetting ScrollReveal Animations

**Don't:**

```typescript
<section>
  <h2>Title</h2>
  <p>Content</p>
</section>
```

**Do:**

```typescript
<section>
  <ScrollReveal variant="fade-up">
    <h2>Title</h2>
    <p>Content</p>
  </ScrollReveal>
</section>
```

### ❌ Pitfall 4: Using Standard Buttons Instead of MagneticButton

**Don't:**

```typescript
<button className="bg-[#29E7CD] px-6 py-3 rounded-lg">
  Get Started
</button>
```

**Do:**

```typescript
<MagneticButton
  className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] rounded-2xl px-8 py-4"
>
  Get Started
</MagneticButton>
```

### ❌ Pitfall 5: Not Using Style Utilities

**Don't:**

```typescript
<section className="py-16 tablet:py-20 relative bg-transparent">
  <div className="mx-auto max-w-7xl px-6">
    {/* Content */}
  </div>
</section>
```

**Do:**

```typescript
import { getSectionClasses } from '@/lib/landing-styles';

<section className={getSectionClasses({ padding: 'large' })}>
  <div className="mx-auto max-w-7xl px-6">
    {/* Content */}
  </div>
</section>
```

---

## Best Practices

### 1. Always Use Style Utilities

**Use centralized utilities from `lib/landing-styles.ts`:**

- `LANDING_COLORS` - Color constants
- `LANDING_TYPOGRAPHY` - Typography classes
- `LANDING_SPACING` - Spacing classes
- `getGlowColor()` - Glow color generator
- `getSectionClasses()` - Section class generator

### 2. Consistent Animation Patterns

**Stagger animations for grid items:**

```typescript
{items.map((item, index) => (
  <ScrollReveal key={item.id} variant="fade-up" delay={index * 0.1}>
    {/* Item content */}
  </ScrollReveal>
))}
```

**Use appropriate variants:**

- `fade-up` - Most common, works for most content
- `fade-in` - Subtle, for text-heavy sections
- `scale-up` - For cards and feature highlights
- `slide-left` / `slide-right` - For directional emphasis

### 3. Responsive Typography

**Always use fluid typography:**

```typescript
// Good
<h2 className="text-fluid-3xl font-bold">Title</h2>

// Better (with responsive fine-tuning)
<h2 className="text-fluid-2xl tablet:text-fluid-3xl desktop:text-fluid-4xl font-bold">
  Title
</h2>
```

### 4. Glow Effect Consistency

**Use consistent glow colors:**

```typescript
import { LANDING_COLORS, getGlowColor } from '@/lib/landing-styles';

// Use predefined colors
<GlowCard glowColor={LANDING_COLORS.glow.primary}>

// Or generate from hex
<GlowCard glowColor={getGlowColor('#29E7CD')}>
```

### 5. Performance Optimization

**Lazy load heavy components:**

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton variant="card" />,
});
```

**Respect reduced motion:**

```typescript
import { useReducedMotion } from 'framer-motion';

const prefersReducedMotion = useReducedMotion();
const animationDuration = prefersReducedMotion ? 0 : 0.5;
```

### 6. Accessibility

**Always include ARIA labels:**

```typescript
<MagneticButton
  aria-label="Get started with PrepFlow"
  onClick={handleClick}
>
  Get Started
</MagneticButton>
```

**Use semantic HTML:**

```typescript
<section aria-labelledby="features-heading">
  <h2 id="features-heading" className="text-fluid-3xl font-bold">
    Features
  </h2>
  {/* Features content */}
</section>
```

---

## Style Utilities Reference

### Color Utilities

```typescript
import { LANDING_COLORS, getGlowColor } from '@/lib/landing-styles';

// Predefined colors
LANDING_COLORS.primary; // '#29E7CD'
LANDING_COLORS.secondary; // '#3B82F6'
LANDING_COLORS.accent; // '#D925C7'
LANDING_COLORS.glow.primary; // 'rgba(41, 231, 205, 0.15)'

// Generate glow color from hex
const glowColor = getGlowColor('#29E7CD'); // 'rgba(41, 231, 205, 0.15)'
```

### Typography Utilities

```typescript
import { LANDING_TYPOGRAPHY } from '@/lib/landing-styles';

// Typography classes
LANDING_TYPOGRAPHY.hero.headline; // 'text-fluid-4xl font-bold tracking-tight'
LANDING_TYPOGRAPHY.hero.subheading; // 'text-fluid-xl text-gray-400'
LANDING_TYPOGRAPHY.section.title; // 'text-fluid-3xl font-bold'
LANDING_TYPOGRAPHY.section.body; // 'text-fluid-base text-gray-400'
LANDING_TYPOGRAPHY.card.title; // 'text-fluid-xl font-bold'
LANDING_TYPOGRAPHY.card.body; // 'text-fluid-base text-gray-400'
LANDING_TYPOGRAPHY.button; // 'text-fluid-base font-medium'
```

### Spacing Utilities

```typescript
import { LANDING_SPACING, getSectionClasses } from '@/lib/landing-styles';

// Spacing classes
LANDING_SPACING.section.small; // 'py-12 tablet:py-16'
LANDING_SPACING.section.medium; // 'py-16 tablet:py-20'
LANDING_SPACING.section.large; // 'py-16 tablet:py-20'
LANDING_SPACING.section.xlarge; // 'py-24 tablet:py-32'
LANDING_SPACING.button; // 'px-8 py-4'
LANDING_SPACING.card; // 'p-8'

// Section classes with options
getSectionClasses({ padding: 'large' }); // 'py-16 tablet:py-20 relative bg-transparent'
getSectionClasses({ padding: 'xlarge' }); // 'py-24 tablet:py-32 relative bg-transparent'
```

### Animation Utilities

```typescript
import { LANDING_ANIMATIONS } from '@/lib/landing-styles';

// Animation durations
LANDING_ANIMATIONS.duration.fast; // 0.3
LANDING_ANIMATIONS.duration.normal; // 0.5
LANDING_ANIMATIONS.duration.slow; // 0.8

// Stagger delays
LANDING_ANIMATIONS.stagger.small; // 0.05
LANDING_ANIMATIONS.stagger.medium; // 0.1
LANDING_ANIMATIONS.stagger.large; // 0.15
```

---

## Additional Resources

- **Style Guide:** `docs/LANDING_PAGE_STYLE_GUIDE.md` - Complete style reference
- **Design System:** `.cursor/rules/design.mdc` - Cyber Carrot Design System guidelines
- **Style Utilities:** `lib/landing-styles.ts` - Centralized style constants
- **Component Examples:** `app/components/landing/` - Reference implementations

---

## Checklist for Migration

When migrating a component to landing page styles, ensure:

- [ ] Using fluid typography classes (`text-fluid-*`)
- [ ] Wrapped content in `ScrollReveal` for animations
- [ ] Using `MagneticButton` for CTAs
- [ ] Using `GlowCard` for feature cards
- [ ] Using style utilities from `lib/landing-styles.ts`
- [ ] Following section structure pattern
- [ ] Using correct breakpoints (`tablet:`, `desktop:`)
- [ ] Including background glow effects where appropriate
- [ ] Respecting `prefers-reduced-motion`
- [ ] Including ARIA labels for accessibility
- [ ] Testing on mobile, tablet, and desktop
- [ ] Verifying performance impact

---

**Remember:** Landing page styles are optimized for conversion and visual impact. Use webapp styles for functional interfaces and data management.
