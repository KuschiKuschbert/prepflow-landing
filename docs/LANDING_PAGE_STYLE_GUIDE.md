# Landing Page Style Guide

**Last Updated:** January 2025

This guide documents the design system used on the PrepFlow landing page (`/`). These styles are distinct from the webapp styles and should be used exclusively for marketing/landing pages.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Component Styles](#component-styles)
4. [Layout Patterns](#layout-patterns)
5. [Animation Guidelines](#animation-guidelines)
6. [Background Effects](#background-effects)
7. [Performance Considerations](#performance-considerations)
8. [Accessibility](#accessibility)

---

## Color System

### CSS Variables

The landing page uses CSS variables defined in `app/globals.css` and inline styles in `app/page.tsx`:

```css
:root {
  --background: #0a0a0a; /* Dark background */
  --foreground: #ffffff; /* White text */
  --primary: #29e7cd; /* Electric Cyan - Primary Actions */
  --secondary: #3b82f6; /* Blue - Secondary Actions */
  --accent: #d925c7; /* Vibrant Magenta - Accent Elements */
  --muted: #1f1f1f; /* Dark gray - Cards & Containers */
  --border: #2a2a2a; /* Border gray - Subtle borders */
}
```

### Inline Style Variables

Additional color variables are set inline in `app/page.tsx`:

```typescript
style={{
  '--primary-color': '#29E7CD',
  '--secondary-color': '#3B82F6',
  '--accent-color': '#D925C7',
  '--bg-color': '#0a0a0a',
  '--text-color': '#ffffff',
  '--gray-300': '#d1d5db',
  '--gray-400': '#9ca3af',
  '--gray-500': '#6b7280',
  '--gray-600': '#4b5563',
  '--gray-700': '#374151',
  '--gray-800': '#1f2937',
} as React.CSSProperties
```

### Color Usage Guidelines

- **Primary (`#29E7CD`)**: Primary CTAs, links, highlights, icons
- **Secondary (`#3B82F6`)**: Secondary actions, supporting elements
- **Accent (`#D925C7`)**: Accent elements, special highlights
- **Background (`#0a0a0a`)**: Main background color
- **Gray Scale**: Use for text hierarchy (`gray-300` for primary, `gray-400` for secondary, `gray-500` for muted)

### Color Examples

```tsx
// Primary CTA button
<MagneticButton className="bg-white text-black hover:bg-gray-100">
  Get Started
</MagneticButton>

// Secondary button
<MagneticButton className="bg-transparent border border-white/20 text-white hover:bg-white/10">
  Sign In
</MagneticButton>

// Text colors
<h1 className="text-white">Heading</h1>
<p className="text-gray-300">Primary text</p>
<span className="text-gray-400">Secondary text</span>
```

---

## Typography

### Fluid Typography System

The landing page uses a fluid typography system that scales smoothly from mobile (360px) to 4K displays. Classes are defined in `app/globals.css`:

```css
.text-fluid-xs {
  font-size: clamp(0.625rem, 1.4vw, 0.75rem);
}
.text-fluid-sm {
  font-size: clamp(0.75rem, 1.4vw, 0.875rem);
}
.text-fluid-base {
  font-size: clamp(0.875rem, 1.4vw, 1rem);
}
.text-fluid-lg {
  font-size: clamp(1rem, 2vw, 1.25rem);
}
.text-fluid-xl {
  font-size: clamp(1.25rem, 2.4vw, 1.875rem);
}
.text-fluid-2xl {
  font-size: clamp(1.5rem, 2.4vw, 2.25rem);
}
.text-fluid-3xl {
  font-size: clamp(1.875rem, 3vw, 3rem);
}
.text-fluid-4xl {
  font-size: clamp(2.25rem, 3.6vw, 4rem);
}
```

### Extended Fluid Classes

For hero sections, extended classes are used inline:

```tsx
// Hero heading (extends beyond text-fluid-4xl)
<h1 className="text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl large-desktop:text-fluid-7xl xl:text-fluid-8xl">
  PrepFlow
</h1>
```

**Note:** Extended classes (`text-fluid-5xl` through `text-fluid-8xl`) are defined inline using responsive Tailwind classes, not as CSS utilities.

### Font Weights

- **Headings**: `font-light` (300) - Creates elegant, modern look
- **Body Text**: `font-normal` (400) - Standard readability
- **Bold Text**: `font-bold` (700) - For emphasis
- **Semibold**: `font-semibold` (600) - For labels and CTAs

### Typography Hierarchy

```tsx
// Hero Title
<h1 className="text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl font-light tracking-tight text-white">
  Main Heading
</h1>

// Section Title
<h2 className="text-fluid-4xl tablet:text-fluid-5xl desktop:text-fluid-6xl font-light text-white">
  Section Title
</h2>

// Subheading
<p className="text-fluid-xl tablet:text-fluid-2xl text-gray-300">
  Subheading text
</p>

// Body Text
<p className="text-fluid-base text-gray-400 leading-relaxed">
  Body text content
</p>

// Small Text
<span className="text-fluid-sm text-gray-500">
  Caption or fine print
</span>
```

### Responsive Typography Pattern

Always use responsive classes with custom breakpoints:

```tsx
// Mobile-first approach
className = 'text-fluid-base tablet:text-fluid-lg desktop:text-fluid-xl';
```

---

## Component Styles

### MagneticButton

**Location:** `components/ui/MagneticButton.tsx`

**Purpose:** Interactive button with magnetic mouse-following effect

**Props:**

- `strength?: number` - Magnetic pull strength (0-1, default: 0.3)
- `maxDistance?: number` - Maximum movement distance in pixels (default: 20)
- `scaleOnHover?: boolean` - Enable scale on hover (default: true)
- `hoverScale?: number` - Scale value on hover (default: 1.05)

**Usage:**

```tsx
<MagneticButton
  onClick={handleClick}
  className="rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100"
  aria-label="Get Started"
  strength={0.4}
  maxDistance={15}
>
  Get Started
</MagneticButton>
```

**Style Variants:**

```tsx
// Primary (white background)
className =
  'rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100';

// Secondary (transparent with border)
className =
  'rounded-full border border-white/20 bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white/10';

// With fluid typography
className = 'text-fluid-base tablet:text-fluid-lg rounded-full ...';
```

### GlowCard

**Location:** `components/ui/GlowCard.tsx`

**Purpose:** Glass-morphism card with hover glow effect

**Props:**

- `glowColor?: string` - Glow color (hex or rgba, default: primary cyan)
- `className?: string` - Additional classes

**Usage:**

```tsx
<GlowCard glowColor="rgba(41, 231, 205, 0.15)" className="p-8">
  <h3 className="text-fluid-xl font-light text-white">Feature Title</h3>
  <p className="text-fluid-base text-gray-400">Feature description</p>
</GlowCard>
```

**Style Pattern:**

```tsx
// Base card styles (applied automatically)
className =
  'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20';

// Content padding
className = 'p-8'; // or p-10, p-12 for larger cards
```

**Glow Color Examples:**

```tsx
// Primary cyan
glowColor = 'rgba(41, 231, 205, 0.15)';

// Magenta accent
glowColor = 'rgba(217, 37, 199, 0.15)';

// Blue secondary
glowColor = 'rgba(59, 130, 246, 0.15)';

// Hex color (auto-converted to rgba)
glowColor = '#29E7CD';
```

### ScrollReveal

**Location:** `components/ui/ScrollReveal.tsx`

**Purpose:** Entrance animations triggered on scroll

**Props:**

- `variant?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right'` - Animation type
- `delay?: number` - Delay in seconds (default: 0)
- `duration?: number` - Animation duration (default: 0.5)
- `offset?: number` - Intersection threshold (default: 0.2)
- `once?: boolean` - Animate only once (default: true)

**Usage:**

```tsx
<ScrollReveal variant="fade-up" delay={0.2}>
  <h2>Section Title</h2>
</ScrollReveal>;

// Staggered animations
{
  items.map((item, index) => (
    <ScrollReveal key={item.id} variant="fade-up" delay={index * 0.1}>
      <ItemCard item={item} />
    </ScrollReveal>
  ));
}
```

**Variants:**

- `fade-up`: Fades in and slides up (most common)
- `fade-in`: Simple fade in
- `scale-up`: Scales from 0.8 to 1.0
- `slide-left`: Slides in from left
- `slide-right`: Slides in from right

**Accessibility:** Automatically respects `prefers-reduced-motion` by simplifying animations.

---

## Layout Patterns

### Container Width

**Standard Pattern:**

```tsx
<div className="mx-auto max-w-7xl px-6">{/* Content */}</div>
```

**Responsive Padding:**

```tsx
// Header/Footer padding
className = 'px-4 tablet:px-6 tablet:py-4 py-3';

// Section padding
className = 'py-16 tablet:py-20';

// Card padding
className = 'p-8 tablet:p-10 desktop:p-12';
```

### Grid Layouts

**Responsive Grid:**

```tsx
// 1 column mobile, 2 tablet, 4 desktop
<div className="grid grid-cols-1 gap-12 tablet:grid-cols-2 desktop:grid-cols-4">
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

**Common Grid Patterns:**

```tsx
// 2 columns tablet+
grid-cols-1 tablet:grid-cols-2

// 3 columns desktop+
grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3

// 4 columns desktop+
grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4
```

### Spacing

**Vertical Spacing:**

```tsx
// Section spacing
className = 'py-16 tablet:py-20';

// Element spacing
className = 'mt-6'; // or mt-8, mt-12 for larger gaps
className = 'mb-12'; // or mb-16, mb-20 for sections
```

**Gap Spacing:**

```tsx
// Grid gaps
className = 'gap-8'; // or gap-12 for larger gaps

// Flex gaps
className = 'gap-4'; // or gap-6, gap-8
```

### Background

**Base Background:**

```tsx
// Transparent (for overlay effects)
className = 'bg-transparent';

// Solid dark
className = 'bg-[#0a0a0a]';

// Semi-transparent (for headers/footers)
className = 'bg-[#0a0a0a]/95 backdrop-blur-md';
```

---

## Animation Guidelines

### Framer Motion Patterns

**Hover Effects:**

```tsx
import { motion } from 'framer-motion';

<motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
  <Card />
</motion.div>;
```

**Spring Animations:**

```tsx
// Smooth spring for magnetic effects
transition={{
  type: 'spring',
  stiffness: 150,
  damping: 15,
}}
```

**Staggered Animations:**

```tsx
{
  items.map((item, index) => (
    <ScrollReveal key={item.id} variant="fade-up" delay={index * 0.1}>
      <ItemCard item={item} />
    </ScrollReveal>
  ));
}
```

### Performance Optimizations

**CSS Optimizations:**

```css
/* Use will-change for animated elements */
will-change: transform, opacity;

/* Use content-visibility for large sections */
content-visibility: auto;
contain-intrinsic-size: auto 500px;
```

**React Optimizations:**

```tsx
// Memoize expensive components
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Component code
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => expensiveCalculation(data), [data]);
```

### Reduced Motion Support

All animations automatically respect `prefers-reduced-motion`:

```tsx
// ScrollReveal automatically simplifies animations
<ScrollReveal variant="fade-up">
  {/* Animation is simplified if user prefers reduced motion */}
</ScrollReveal>
```

---

## Background Effects

### LandingBackground Component

**Location:** `app/components/landing/LandingBackground.tsx`

**Features:**

- Mouse-following spotlight
- Logo watermarks
- Tron-like neon grid
- Corner glows (cyan and magenta)
- Fine noise texture

**Configuration:**

Background theme is configured in `lib/theme.ts`:

```typescript
export const backgroundTheme: BackgroundTheme = {
  gridSizePx: 48,
  gridCyanOpacity: 0.08,
  gridBlueOpacity: 0.06,
  cornerCyanOpacity: 0.18,
  cornerMagentaOpacity: 0.16,
};
```

**Usage:**

```tsx
import LandingBackground from '@/app/components/landing/LandingBackground';

<LandingBackground />;
```

**Performance Notes:**

- Uses CSS-only effects where possible
- Mouse tracking is throttled
- Grid uses CSS gradients (no canvas)
- All effects are `pointer-events-none` to avoid interaction blocking

### Custom Background Effects

**Spotlight Effect:**

```tsx
<div
  className="pointer-events-none fixed inset-0 -z-10"
  style={{
    background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(41, 231, 205, 0.06), transparent 40%)`,
  }}
/>
```

**Gradient Background:**

```tsx
<div
  className="fixed inset-0 -z-20"
  style={{
    background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%)',
  }}
/>
```

---

## Performance Considerations

### Image Optimization

**Next.js Image Component:**

```tsx
import Image from 'next/image';

<Image
  src="/images/screenshot.png"
  alt="Description"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  className="rounded-xl"
/>;
```

**Sizing Strategy:**

- Use `sizes` attribute for responsive images
- Set explicit `width` and `height` to prevent layout shift
- Use `loading="lazy"` for below-fold images

### Code Splitting

**Dynamic Imports:**

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // If component doesn't need SSR
});
```

### CSS Performance

**Optimize Animations:**

```css
/* Use transform and opacity for animations */
transform: translateY(0);
opacity: 1;

/* Avoid animating layout properties */
/* ❌ Don't animate: width, height, margin, padding */
/* ✅ Do animate: transform, opacity */
```

**Containment:**

```css
/* Isolate rendering */
contain: layout style paint;

/* Optimize scrolling */
-webkit-overflow-scrolling: touch;
```

---

## Accessibility

### Keyboard Navigation

**Focus States:**

```tsx
// Visible focus rings
className =
  'focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none';
```

**ARIA Labels:**

```tsx
<MagneticButton onClick={handleClick} aria-label="Get Started with PrepFlow">
  Get Started
</MagneticButton>
```

### Screen Readers

**Semantic HTML:**

```tsx
// Use proper heading hierarchy
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<nav aria-label="Main navigation">
<main>
<footer>
```

**Icon Accessibility:**

```tsx
import { Icon } from '@/components/ui/Icon';

// Decorative icons (auto-hidden)
<Icon icon={Sparkles} size="xl" aria-hidden="true" />

// Interactive icons (with labels)
<Icon icon={Menu} size="md" aria-label="Open navigation menu" />
```

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```tsx
// ScrollReveal automatically handles this
<ScrollReveal variant="fade-up">
  {/* Animation is simplified if user prefers reduced motion */}
</ScrollReveal>
```

---

## Style Application Rules

### When to Use Landing Page Styles

✅ **Use landing page styles for:**

- Marketing/landing pages (`/`)
- Public-facing pages
- Marketing components
- Hero sections
- Feature showcases

❌ **Don't use landing page styles for:**

- Webapp pages (`/webapp/**`)
- Dashboard components
- Data tables
- Forms (use Material Design 3 styles)
- Admin interfaces

### Style System Decision Tree

```
Is this a landing/marketing page?
├─ Yes → Use Landing Page Styles
│   ├─ MagneticButton
│   ├─ GlowCard
│   ├─ ScrollReveal
│   ├─ Fluid typography
│   └─ Landing background effects
│
└─ No → Use Material Design 3 Styles
    ├─ Standard Button component
    ├─ Card component
    ├─ Fixed typography scale
    └─ Material Design 3 patterns
```

---

## Examples

### Complete Hero Section

```tsx
<section className="relative flex min-h-screen items-center justify-center">
  <LandingBackground />

  <div className="relative mx-auto max-w-7xl px-6 text-center">
    <ScrollReveal variant="fade-up">
      <h1 className="text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl font-light tracking-tight text-white">
        PrepFlow
      </h1>
      <p className="text-fluid-xl tablet:text-fluid-2xl mt-8 font-light text-gray-300">
        Know your costs. Price with confidence.
      </p>
    </ScrollReveal>

    <ScrollReveal
      variant="fade-up"
      delay={0.2}
      className="mt-16 flex flex-col items-center justify-center gap-4 tablet:flex-row"
    >
      <MagneticButton
        onClick={handleRegister}
        className="text-fluid-base tablet:text-fluid-lg rounded-full border border-white/20 bg-white px-10 py-4 font-normal text-black transition-all hover:bg-gray-100"
        aria-label="Register for PrepFlow"
        strength={0.4}
        maxDistance={15}
      >
        Get Started
      </MagneticButton>
      <MagneticButton
        onClick={handleSignIn}
        className="text-fluid-base tablet:text-fluid-lg rounded-full border border-white/20 bg-transparent px-10 py-4 font-normal text-white transition-all hover:bg-white/10"
        aria-label="Sign in to PrepFlow"
        strength={0.4}
        maxDistance={15}
      >
        Sign In
      </MagneticButton>
    </ScrollReveal>
  </div>
</section>
```

### Feature Card Grid

```tsx
<section className="py-16 tablet:py-20">
  <div className="mx-auto max-w-7xl px-6">
    <ScrollReveal variant="fade-up" className="mb-12 text-center">
      <h2 className="text-fluid-4xl tablet:text-fluid-5xl font-light text-white">Features</h2>
    </ScrollReveal>

    <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
      {features.map((feature, index) => (
        <ScrollReveal key={feature.id} variant="fade-up" delay={index * 0.1}>
          <GlowCard glowColor={feature.color} className="p-8">
            <Icon
              icon={feature.icon}
              size="xl"
              className="mb-6 text-[#29E7CD]"
              aria-hidden="true"
            />
            <h3 className="text-fluid-xl mb-3 font-light text-white">{feature.title}</h3>
            <p className="text-fluid-base leading-relaxed text-gray-400">{feature.description}</p>
          </GlowCard>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

---

## Related Documentation

- [Material Design 3 Design System](.cursor/rules/design.mdc) - Webapp design system
- [Landing Style Migration Guide](LANDING_STYLE_MIGRATION.md) - Migration examples
- [Tailwind Utilities](lib/tailwind-utils.ts) - Shared style constants
- [Landing Styles](lib/landing-styles.ts) - Landing page style utilities

---

**Note:** This style guide is specific to the landing page. For webapp styling, refer to the Material Design 3 design system documentation.


