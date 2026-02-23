# Landing Page Guide

## Landing v2 (Sign‑in + Tour)

### Information Architecture

- **Hero:** Concise value prop; CTAs: Sign in, Register, Tour
- **Tour:** 3–5 steps (Ingredients → Recipes → COGS → Performance → Temperature)
- **Capabilities:** 4 cards linking to tour anchors
- **How it works:** Add → Analyze → Act
- **Security:** Auth0, Supabase, privacy

### Components

- `app/components/landing/Hero.tsx` - Hero section
- `app/components/landing/TourModal.tsx` - Tour modal component
- `app/components/landing/LandingPageClient.tsx` - Main landing page (Hero, Highlights, CloserLook, Performance, HowItWorksSection, TechnicalSpecs, FinalCTA, Footer)
- `app/components/landing/sections/HowItWorksSection.tsx` - Process explanation (Add → Analyze → Act)

### QA Checklist

- Auth: NextAuth + Auth0 working; allowlist enforced on `/webapp/**` routes
- Tour modal: focus trap, Escape closes, arrows navigate
- Performance: Lighthouse ≥ 90; CLS < 0.1; LCP < 2.5s
- Analytics: tour_open/close, step navigation, CTA clicks

## Landing Page Style System (Cyber Carrot)

**Style System Decision Tree:**

1. **Is this a public marketing page?** → Use landing page styles
2. **Is this an authenticated webapp page?** → Use webapp styles
3. **Is this a conversion-focused component?** → Use landing page styles
4. **Is this a data management interface?** → Use webapp styles

**Landing Page Style Resources:**

- **Style Guide:** `docs/LANDING_PAGE_STYLE_GUIDE.md` - Complete landing page style reference
- **Migration Guide:** `docs/LANDING_STYLE_MIGRATION.md` - Examples and best practices for applying landing styles
- **Style Utilities:** `lib/landing-styles.ts` - Centralized style constants and utilities
- **Design System:** `.cursor/rules/design.mdc` - Landing page style system documentation

**Key Landing Page Components:**

- `components/ui/MagneticButton.tsx` - Interactive button with magnetic hover effect
- `components/ui/GlowCard.tsx` - Card component with radial gradient glow effect
- `components/ui/ScrollReveal.tsx` - Scroll-triggered animation component
- `components/landing/LandingBackground.tsx` - Dynamic background effects system

**When to Use Landing Page Styles:**

- ✅ Marketing pages (`/`, `/pricing`, `/features`, etc.)
- ✅ Public-facing content (landing pages, marketing sections)
- ✅ Conversion-focused components (CTAs, hero sections, feature showcases)
- ✅ Marketing emails and promotional content

**When to Use Webapp Styles:**

- ✅ Authenticated webapp pages (`/webapp/**`)
- ✅ Data-heavy interfaces (tables, forms, dashboards)
- ✅ Internal tools and admin interfaces
- ✅ Functional components (navigation, settings, data management)

**Quick Reference:**

```typescript
// Import style utilities
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  LANDING_SPACING,
  getGlowColor,
  getSectionClasses,
} from '@/lib/landing-styles';

// Use landing page components
import { MagneticButton } from '@/components/ui/MagneticButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

// Apply fluid typography
<h2 className="text-fluid-3xl font-bold text-white">Title</h2>

// Structure sections
<section className={getSectionClasses({ padding: 'large' })}>
  <div className="mx-auto max-w-7xl px-6">
    <ScrollReveal variant="fade-up">
      {/* Content */}
    </ScrollReveal>
  </div>
</section>
```

**See Also:**

- `docs/LANDING_PAGE_STYLE_GUIDE.md` - Complete style guide with all patterns
- `docs/LANDING_STYLE_MIGRATION.md` - Migration examples and best practices
- `.cursor/rules/design.mdc` (Landing Page Style System - Cyber Carrot) - Design system documentation

## See Also

- [Project Architecture](PROJECT_ARCHITECTURE.md) - Technical architecture overview
- [Design System](.cursor/rules/design.mdc) - Cyber Carrot design system
- [Landing Page Style Guide](LANDING_PAGE_STYLE_GUIDE.md) - Complete style reference
