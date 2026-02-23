# Landing Page DOM & Layout Improvement Plan

**Date:** 2026-02-23  
**Source:** Browser DOM audit + screenshot analysis

## Summary

This plan addresses layout issues identified from a live DOM inspection and visual review of the landing page at `localhost:3000`. The focus is on vertical rhythm, section transitions, alignment, and responsive consistency.

---

## Issues Identified

### 1. Hero-to-Highlights Vertical Spacing

**Symptom:** The hero CTA and the "Everything you need" section below appear too close, creating visual tension.

**Root cause:** Hero uses `min-h-[85vh]` with internal `py-16 tablet:py-20`. Highlights uses `py-24 tablet:py-32`. The combined padding may not provide enough breathing room between the main CTA and the features grid.

**Recommendation:**

- Add `pb-12 tablet:pb-16` to the Hero section’s inner container (below the CTA block) or increase the bottom padding of the Hero.
- Alternatively, add `pt-8 tablet:pt-12` to the Highlights section to create a clearer break.
- Align with design tokens: `py-24 tablet:py-32` for section spacing.

### 2. Section Transition Consistency

**Symptom:** Abrupt visual cutoffs between sections (e.g. landing background → content blocks).

**Root cause:** Sections use `bg-transparent` over a fixed background. Transitions between sections are uniform; contrast in content density makes some boundaries feel harsh.

**Recommendation:**

- Standardize section padding via `getSectionClasses({ padding: 'large' })` or equivalent from `lib/landing-styles.ts`.
- Ensure all sections use the same vertical rhythm: e.g. `tablet:py-32` for major sections.
- Add a subtle top border or gradient divider to heavier content blocks (e.g. TechnicalSpecs, FinalCTA) if design allows.

### 3. Highlights Grid Alignment

**Symptom:** Grid uses `auto-fit` with `minmax(280px, 1fr)` etc., which can produce uneven column counts and slight misalignment on mid-size viewports.

**Recommendation:**

- Keep `auto-fit` for flexibility but enforce `justify-items-center` or `place-items-stretch` so cards align consistently.
- Add `align-items: stretch` (or Tailwind equivalent) to ensure equal card heights within each row.
- Review `minmax` values: `minmax(280px, 1fr)` on mobile, `minmax(300px, 1fr)` tablet, `minmax(320px, 1fr)` desktop — verify these match the design system breakpoints.

### 4. Content Width & Centering

**Symptom:** Need to confirm main content is centered horizontally across breakpoints.

**Recommendation:**

- Ensure all sections use `mx-auto max-w-7xl px-6` (or `LANDING_LAYOUT.container`) consistently.
- Verify `Hero`, `Highlights`, `CloserLook`, `Performance`, `HowItWorksSection`, `TechnicalSpecs`, `FinalCTA`, and `LandingFooter` all use the same max-width and horizontal padding.

### 5. Mobile Bottom Navigation Overlap

**Symptom:** `ModernMobileNav` (and possibly `MobileMenuDrawer`) may overlap content near the bottom.

**Recommendation:**

- Confirm `main` has `pb-20` or equivalent to reserve space for the bottom nav.
- Ensure sticky/fixed elements (e.g. ScrollProgress, ScrollToTop) do not overlap the bottom nav on mobile.

---

## Implementation Priority

| Priority | Item                                       | Effort | Impact |
| -------- | ------------------------------------------ | ------ | ------ |
| P0       | Hydration fixes (ScrollReveal, HowItWorks) | Done   | High   |
| P1       | Hero → Highlights vertical spacing         | Low    | Medium |
| P2       | Standardize section padding classes        | Low    | Medium |
| P3       | Highlights grid alignment                  | Low    | Low    |
| P4       | Verify centering and mobile bottom padding | Low    | Low    |

---

## Files to Update

- `app/components/landing/Hero.tsx` – Increase bottom padding or inner container spacing
- `app/components/landing/Highlights.tsx` – Adjust grid alignment, add section top padding if needed
- `app/components/landing/LandingPageClient.tsx` – Verify `main` padding (`pb-20`) for mobile nav
- `lib/landing-styles.ts` – Confirm `getSectionClasses` and `LANDING_LAYOUT.container` usage across sections

---

## Console Issues (Resolved)

1. **Hydration mismatch** – Fixed by gating `ScrollReveal` with `hasMounted` so server and initial client render both use `animate="hidden"`.
2. **`Cannot read properties of null (reading 'removeChild')`** – Expected to be resolved by fixing hydration; caused by React’s hydration recovery when server/client trees differ.
3. **React DevTools suggestion** – Dev-only; optional to suppress.
4. **Analytics/AB test `logger.dev` logs** – Development noise; consider reducing verbosity in dev if desired.

---

## Verification Steps

1. Run `npm run dev`, open `http://localhost:3000`, and confirm:
   - No hydration errors in the console
   - No `removeChild` errors
2. Resize viewport (mobile, tablet, desktop) and check:
   - Hero → Highlights spacing
   - Grid alignment in Highlights
   - Section padding consistency
   - Mobile bottom nav not overlapping content
3. Run `npm run build` and smoke-test production build.
