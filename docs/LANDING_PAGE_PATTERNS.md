# Landing Page Performance & Structure Patterns

## Overview

This document captures the cleaner, more performant patterns learned from the copy folder that should be applied consistently across the landing page and entire codebase.

## Core Principles

### 1. **Simplicity Over Complexity**

- Prefer direct DOM events over heavy animation libraries where possible
- Use CSS animations for simple effects (e.g., `animate-bounce` instead of Framer Motion)
- Static CSS glows over animated Spotlight components for background effects

### 2. **Performance First**

- No `willChange` hints unless absolutely necessary (copy folder doesn't use them)
- Direct `y`/`x` transforms in Framer Motion instead of `transform` property
- Throttle mouse events with `requestAnimationFrame` only when needed
- Reduce particle/effect counts on mobile devices

### 3. **Clean Component Structure**

- Remove heavy background effects from individual sections (Hero, FinalCTA, etc.)
- Use global `LandingBackground` for shared background effects
- Keep individual sections focused on content, not decoration

## Component Patterns

### GlowCard Pattern

**✅ Correct (Simple & Performant):**

```typescript
'use client';
import React, { useRef, useState } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // Accepts rgba string directly
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(41, 231, 205, 0.15)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};
```

**Key Points:**

- Direct `onMouseMove`/`onMouseLeave` events (no Framer Motion for glow)
- Simple state management (`position`, `opacity`)
- CSS `transition-opacity` for smooth fade
- No throttling needed (browser handles it efficiently)

### ScrollReveal Pattern

**✅ Correct (Simple & Clean):**

```typescript
'use client';
import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 0.5,
  offset = 0.2,
  once = true,
}) => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once,
    amount: offset,
    margin: '0px 0px -100px 0px',
  });

  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    // ... other variants
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{
        duration: reducedMotion ? 0.2 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

**Key Points:**

- Use `y`/`x` directly (not `transform` property)
- No `willChange` hints (browser optimizes automatically)
- Keep `useReducedMotion` for accessibility
- Simple, clean variants

### Background Effects Pattern

**✅ Correct (Static CSS Glows):**

```typescript
// In FinalCTA.tsx or similar sections
<section className="relative overflow-hidden bg-transparent py-24">
  {/* Background Glow - Static CSS */}
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="h-[500px] w-[500px] rounded-full bg-[#29E7CD]/10 blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-4xl px-6">
    {/* Content */}
  </div>
</section>
```

**❌ Avoid (Heavy Animated Components):**

```typescript
// Don't use Spotlight, FloatingParticles, AnimatedGradient in individual sections
<Spotlight color="cyan" size={600} opacity={0.15} />
<FloatingParticles count={25} />
<AnimatedGradient opacity={0.15} />
```

**Key Points:**

- Use static CSS `blur` divs for background glows
- Keep heavy effects in `LandingBackground` component only
- Individual sections should be content-focused

### LandingBackground Pattern

**✅ Correct (Simple Mouse-Following Spotlight):**

```typescript
'use client';
import React from 'react';

const LandingBackground = React.memo(function LandingBackground() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Base gradient */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%)',
      }} />

      {/* Simple CSS spotlight that follows mouse */}
      <div className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300" style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(41, 231, 205, 0.06), transparent 40%)`,
      }} />

      {/* Grid, corner glows, etc. */}
    </>
  );
});
```

**Key Points:**

- Simple `useState` + `useEffect` for mouse tracking
- CSS `radial-gradient` directly in style (no Framer Motion)
- No `AnimatedGradient` or `FloatingParticles` components
- Static effects only (no keyframe animations)

### Hero Section Pattern

**✅ Correct (Clean & Content-Focused):**

```typescript
export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-transparent">
      {/* NO background effects here - handled by LandingBackground */}

      <div className="mx-auto w-full max-w-7xl px-6 py-16 text-center">
        <ScrollReveal variant="fade-up">
          <h1>Headline</h1>
        </ScrollReveal>

        {/* Content */}
      </div>
    </section>
  );
}
```

**❌ Avoid:**

```typescript
// Don't add Spotlight, FloatingParticles, AnimatedGradient to Hero
<Spotlight color="cyan" size={600} />
<FloatingParticles count={25} />
<AnimatedGradient opacity={0.15} />
```

### Simple Animations Pattern

**✅ Correct (CSS Animations):**

```typescript
// Use Tailwind's animate-bounce for simple animations
<div className="animate-bounce">
  <svg>...</svg>
</div>
```

**❌ Avoid (Framer Motion for Simple Things):**

```typescript
// Don't use Framer Motion for simple bounce animations
<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  <svg>...</svg>
</motion.div>
```

## Page-Level Patterns

### Lazy Loading Pattern

**✅ Correct (Wrap Lazy Sections in ScrollReveal):**

```typescript
// In page.tsx
<Suspense fallback={<LandingSectionSkeleton />}>
  <ScrollReveal variant="fade-up" offset={0.1}>
    <Performance />
  </ScrollReveal>
</Suspense>
```

**Key Points:**

- Wrap lazy-loaded sections in `ScrollReveal` at page level
- Provides consistent animation timing
- Reduces component-level animation complexity

## Color Handling Patterns

### GlowCard Color Pattern

**✅ Correct (Accept rgba Directly):**

```typescript
// In Highlights.tsx or similar
<GlowCard glowColor="rgba(41, 231, 205, 0.15)">
  {/* Content */}
</GlowCard>
```

**Key Points:**

- Convert hex colors to rgba in the component that uses GlowCard
- GlowCard accepts rgba strings directly
- No color name mapping needed (simpler)

## Performance Optimizations

### What NOT to Do

1. **Don't add `willChange` hints** - Browser optimizes automatically
2. **Don't throttle mouse events unnecessarily** - Browser handles it
3. **Don't use Framer Motion for simple CSS animations** - Use Tailwind classes
4. **Don't add heavy effects to individual sections** - Keep them in LandingBackground

### What TO Do

1. **Use direct DOM events** - Simpler and faster
2. **Use CSS transitions** - Browser-optimized
3. **Keep animations simple** - Less is more
4. **Respect `prefers-reduced-motion`** - Always check and disable animations

## Migration Checklist

When updating components to follow these patterns:

- [ ] Remove `Spotlight`, `FloatingParticles`, `AnimatedGradient` from individual sections
- [ ] Replace Spotlight with static CSS glow divs
- [ ] Simplify GlowCard to use direct mouse events (if not already done)
- [ ] Remove `willChange` hints from ScrollReveal (if present)
- [ ] Use CSS animations (`animate-bounce`) instead of Framer Motion for simple effects
- [ ] Ensure `LandingBackground` uses simple CSS effects, not heavy components
- [ ] Wrap lazy-loaded sections in `ScrollReveal` at page level
- [ ] Convert hex colors to rgba when passing to GlowCard

## Examples

### Before (Heavy & Complex)

```typescript
<section>
  <Spotlight color="cyan" size={600} opacity={0.15} />
  <FloatingParticles count={25} />
  <AnimatedGradient opacity={0.15} />
  <motion.div
    style={{ willChange: 'transform, opacity' }}
    animate={{ y: [0, 10, 0] }}
  >
    Content
  </motion.div>
</section>
```

### After (Clean & Simple)

```typescript
<section className="relative overflow-hidden">
  {/* Static CSS glow */}
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="h-[500px] w-[500px] rounded-full bg-[#29E7CD]/10 blur-[120px]" />
  </div>

  <ScrollReveal variant="fade-up">
    Content
  </ScrollReveal>
</section>
```

## Summary

The copy folder's approach prioritizes:

1. **Simplicity** - Direct events, CSS animations, static effects
2. **Performance** - No unnecessary optimizations, browser handles it
3. **Cleanliness** - Content-focused sections, effects in background only
4. **Consistency** - ScrollReveal everywhere, same patterns throughout

Apply these patterns consistently across the entire codebase for a snappier, smoother experience.
