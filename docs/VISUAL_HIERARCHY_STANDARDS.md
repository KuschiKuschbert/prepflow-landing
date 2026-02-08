# Visual Hierarchy Standards

**Last Updated:** February 2025

This document defines the visual hierarchy standards for the PrepFlow application, ensuring consistent typography, spacing, color contrast, and component sizing across all pages and components.

## Table of Contents

1. [Overview](#overview)
2. [Typography Hierarchy](#typography-hierarchy)
3. [Spacing Hierarchy](#spacing-hierarchy)
4. [Color & Contrast Hierarchy](#color--contrast-hierarchy)
5. [Component Sizing Hierarchy](#component-sizing-hierarchy)
6. [Usage Guidelines](#usage-guidelines)
7. [Implementation Examples](#implementation-examples)

---

## Overview

Visual hierarchy is the arrangement of visual elements to show their order of importance. A well-designed hierarchy guides users' attention, improves readability, and creates a more appealing and professional user experience.

### Key Principles

1. **Consistency** - Use the same hierarchy levels for similar content types
2. **Contrast** - Create clear visual distinction between hierarchy levels
3. **Progression** - Maintain logical size/weight progression from most to least important
4. **Accessibility** - Ensure WCAG AA contrast compliance (4.5:1 minimum)

### Implementation

- **Utilities:** Use `lib/hierarchy-utils.ts` for consistent hierarchy application
- **Standards:** Follow this document for all new components and pages
- **Audit:** Run `npm run audit:hierarchy` to check for violations

---

## Typography Hierarchy

### Hierarchy Levels

The typography hierarchy consists of 7 levels, from largest (Display) to smallest (Caption):

#### 1. Display

- **Size:** `text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl`
- **Weight:** `font-light` (300)
- **Line Height:** `leading-tight`
- **Usage:** Hero headlines, landing page titles, major announcements
- **Example:** Landing page hero title "PrepFlow"

#### 2. Headline

- **Size:** `text-fluid-3xl tablet:text-fluid-4xl`
- **Weight:** `font-bold` (700)
- **Line Height:** `leading-tight`
- **Usage:** Page titles (H1), major section headers
- **Example:** Page header "Ingredients", "Recipes", "Dashboard"

#### 3. Title

- **Size:** `text-fluid-xl tablet:text-fluid-2xl`
- **Weight:** `font-semibold` (600)
- **Line Height:** `leading-snug`
- **Usage:** Section headers (H2), card titles, modal titles
- **Example:** Section header "Add New Ingredient", card title "Chicken Breast"

#### 4. Subtitle

- **Size:** `text-fluid-base tablet:text-fluid-lg`
- **Weight:** `font-normal` (400)
- **Line Height:** `leading-relaxed`
- **Usage:** Subheadings (H3), supporting text for titles
- **Example:** Page subtitle "Manage your ingredient inventory"

#### 5. Body

- **Size:** `text-fluid-base`
- **Weight:** `font-normal` (400)
- **Line Height:** `leading-relaxed`
- **Usage:** Body text, paragraphs, descriptions
- **Example:** Ingredient description, recipe instructions

#### 6. Label

- **Size:** `text-fluid-sm`
- **Weight:** `font-medium` (500)
- **Line Height:** `leading-normal`
- **Usage:** Form labels, metadata, secondary information
- **Example:** Form label "Ingredient Name", metadata "Added: 2025-01-15"

#### 7. Caption

- **Size:** `text-fluid-xs`
- **Weight:** `font-normal` (400)
- **Line Height:** `leading-normal`
- **Usage:** Captions, hints, fine print, timestamps
- **Example:** Timestamp "2 hours ago", hint text "Enter ingredient name"

### Typography Usage Guidelines

1. **Use semantic HTML** - Use `<h1>`, `<h2>`, `<h3>` tags appropriately
2. **Maintain progression** - Don't skip hierarchy levels (e.g., Display → Title)
3. **Consistent sizing** - Use the same hierarchy level for similar content types
4. **Responsive typography** - Always use fluid typography classes (`text-fluid-*`)

### Implementation

```typescript
import { getTypographyClasses } from '@/lib/hierarchy-utils';

// Page header
<h1 className={getTypographyClasses('headline')}>Page Title</h1>

// Section header
<h2 className={getTypographyClasses('title')}>Section Title</h2>

// Body text
<p className={getTypographyClasses('body')}>Body content</p>
```

---

## Spacing Hierarchy

### Spacing Scale (4px Base Unit)

All spacing uses a 4px base unit for consistency:

| Level       | Value | Tailwind Class      | Usage                                  |
| ----------- | ----- | ------------------- | -------------------------------------- |
| Tight       | 4px   | `gap-1 space-y-1`   | Icon groups, tight inline elements     |
| Compact     | 8px   | `gap-2 space-y-2`   | Form fields, compact lists             |
| Normal      | 16px  | `gap-4 space-y-4`   | Standard content spacing, card padding |
| Comfortable | 24px  | `gap-6 space-y-6`   | Section spacing, comfortable reading   |
| Spacious    | 32px  | `gap-8 space-y-8`   | Major section spacing, page sections   |
| Generous    | 48px  | `gap-12 space-y-12` | Hero sections, landing page spacing    |

### Spacing Usage Guidelines

1. **Use semantic spacing** - Choose spacing level based on content relationship
2. **Consistent spacing** - Use the same spacing level for similar content types
3. **Progressive spacing** - Increase spacing for more important sections
4. **Responsive spacing** - Adjust spacing for mobile/tablet/desktop breakpoints

### Section Spacing Presets

#### Page Header Spacing

- Mobile: `mb-4` (16px)
- Tablet: `tablet:mb-6` (24px)
- Desktop: `desktop:mb-8` (32px)

#### Section Spacing

- Mobile: `py-12` (48px)
- Tablet: `tablet:py-16` (64px)
- Desktop: `desktop:py-20` (80px)

#### Component Spacing

- Mobile: `mb-4` (16px)
- Tablet: `tablet:mb-6` (24px)
- Desktop: `desktop:mb-6` (24px)

### Implementation

```typescript
import { getSpacingClasses, getSectionSpacing } from '@/lib/hierarchy-utils';

// Section spacing
<section className={getSectionSpacing('section')}>
  {/* Content */}
</section>

// Component spacing
<div className={getSpacingClasses('comfortable')}>
  {/* Content */}
</div>
```

---

## Color & Contrast Hierarchy

### Text Color Levels

The color hierarchy defines 4 levels of text importance:

#### 1. Primary Text

- **Color:** `text-[var(--foreground)]`
- **Opacity:** 1.0 (100%)
- **Contrast:** High (WCAG AAA)
- **Usage:** Headings, primary content, important text
- **WCAG Compliance:** Exceeds 4.5:1 contrast ratio

#### 2. Secondary Text

- **Color:** `text-[var(--foreground-secondary)]`
- **Opacity:** 0.9 (90%)
- **Contrast:** High (WCAG AA)
- **Usage:** Supporting text, descriptions, secondary content
- **WCAG Compliance:** Meets 4.5:1 contrast ratio

#### 3. Muted Text

- **Color:** `text-[var(--foreground-muted)]`
- **Opacity:** 0.75 (75%)
- **Contrast:** Medium (WCAG AA for large text)
- **Usage:** Labels, metadata, timestamps, less important text
- **WCAG Compliance:** Meets 3:1 contrast ratio for large text (18pt+)

#### 4. Subtle Text

- **Color:** `text-[var(--foreground-subtle)]`
- **Opacity:** 0.6 (60%)
- **Contrast:** Low (WCAG AA for large text only)
- **Usage:** Hints, fine print, disabled states, placeholder text
- **WCAG Compliance:** Meets 3:1 contrast ratio for large text (18pt+)

### Color Usage Guidelines

1. **Use semantic colors** - Choose color level based on content importance
2. **Maintain contrast** - Ensure WCAG AA compliance (4.5:1 for body text)
3. **Consistent application** - Use the same color level for similar content types
4. **Theme awareness** - Colors adapt to dark/light theme automatically

### Implementation

```typescript
import { getTextColor } from '@/lib/hierarchy-utils';

// Primary text
<h1 className={getTextColor('primary')}>Important Heading</h1>

// Muted text
<span className={getTextColor('muted')}>Metadata</span>
```

---

## Component Sizing Hierarchy

### Button Sizes

| Size   | Padding       | Text Size   | Min Height     | Usage                             |
| ------ | ------------- | ----------- | -------------- | --------------------------------- |
| Small  | `px-3 py-1.5` | `text-xs`   | `min-h-[32px]` | Compact buttons, inline actions   |
| Medium | `px-6 py-3`   | `text-sm`   | `min-h-[44px]` | Standard buttons, primary actions |
| Large  | `px-8 py-4`   | `text-base` | `min-h-[52px]` | Large buttons, prominent CTAs     |

### Card Sizes

| Size   | Padding | Gap     | Usage                         |
| ------ | ------- | ------- | ----------------------------- |
| Small  | `p-4`   | `gap-2` | Compact cards, list items     |
| Medium | `p-6`   | `gap-4` | Standard cards, content cards |
| Large  | `p-8`   | `gap-6` | Large cards, feature cards    |

### Modal Sizes

| Size   | Max Width   | Padding | Usage                          |
| ------ | ----------- | ------- | ------------------------------ |
| Small  | `max-w-md`  | `p-4`   | Small modals, confirmations    |
| Medium | `max-w-lg`  | `p-6`   | Standard modals, forms         |
| Large  | `max-w-2xl` | `p-8`   | Large modals, detailed content |

### Input Sizes

| Size   | Padding       | Text Size   | Height | Usage                         |
| ------ | ------------- | ----------- | ------ | ----------------------------- |
| Small  | `px-3 py-1.5` | `text-sm`   | `h-8`  | Compact inputs, inline forms  |
| Medium | `px-4 py-2`   | `text-base` | `h-10` | Standard inputs, most forms   |
| Large  | `px-4 py-3`   | `text-lg`   | `h-12` | Large inputs, prominent forms |

### Component Sizing Guidelines

1. **Use standard sizes** - Stick to small, medium, large sizes
2. **Consistent sizing** - Use the same size for similar components
3. **Touch targets** - Ensure minimum 44px height for interactive elements
4. **Responsive sizing** - Adjust sizes for mobile/tablet/desktop breakpoints

### Implementation

```typescript
import { getComponentSize } from '@/lib/hierarchy-utils';

// Button
<button className={getComponentSize('button', 'md')}>Click Me</button>

// Card
<div className={getComponentSize('card', 'md')}>
  {/* Content */}
</div>
```

---

## Usage Guidelines

### Landing Page vs Webapp

**Landing Page:**

- Use Display typography for hero headlines
- Use Generous spacing for hero sections
- Use Large buttons for primary CTAs
- Emphasize visual hierarchy for conversion

**Webapp:**

- Use Headline typography for page titles
- Use Comfortable spacing for sections
- Use Medium buttons for primary actions
- Focus on functional hierarchy for usability

### Common Patterns

#### Page Header Pattern

```tsx
<PageHeader
  title="Page Title"
  subtitle="Page description"
  // Uses headline + subtitle typography
  // Uses header spacing preset
/>
```

#### Card Pattern

```tsx
<div className={getComponentSize('card', 'md')}>
  <h3 className={getTypographyClasses('title')}>Card Title</h3>
  <p className={getTypographyClasses('body')}>Card content</p>
  <span className={getTypographyClasses('caption')}>Metadata</span>
</div>
```

#### Form Pattern

```tsx
<label className={getTypographyClasses('label')}>Field Label</label>
<input className={getComponentSize('input', 'md')} />
<span className={getTypographyClasses('caption')}>Hint text</span>
```

---

## Implementation Examples

### Example 1: Page Header

```tsx
import { getTypographyClasses, getSectionSpacing } from '@/lib/hierarchy-utils';

export function PageHeader({ title, subtitle }: Props) {
  return (
    <div className={getSectionSpacing('header')}>
      <h1 className={getTypographyClasses('headline')}>{title}</h1>
      {subtitle && <p className={getTypographyClasses('subtitle')}>{subtitle}</p>}
    </div>
  );
}
```

### Example 2: Card Component

```tsx
import { getTypographyClasses, getComponentSize } from '@/lib/hierarchy-utils';

export function IngredientCard({ ingredient }: Props) {
  return (
    <div className={getComponentSize('card', 'md')}>
      <h3 className={getTypographyClasses('title')}>{ingredient.ingredient_name}</h3>
      <p className={getTypographyClasses('body')}>{ingredient.description}</p>
      <span className={getTypographyClasses('caption')}>
        Added: {formatDate(ingredient.created_at)}
      </span>
    </div>
  );
}
```

### Example 3: Form Component

```tsx
import { getTypographyClasses, getComponentSize, getComponentSpacing } from '@/lib/hierarchy-utils';

export function IngredientForm() {
  return (
    <form>
      <div className={getComponentSpacing('formField')}>
        <label className={getTypographyClasses('label')}>Ingredient Name</label>
        <input className={getComponentSize('input', 'md')} type="text" />
        <span className={getTypographyClasses('caption')}>Enter the ingredient name</span>
      </div>
    </form>
  );
}
```

---

## Related Documentation

- **Hierarchy Utilities:** `lib/hierarchy-utils.ts` - Implementation utilities
- **Landing Page Styles:** `lib/landing-styles.ts` - Landing page specific styles
- **Design System:** `.cursor/rules/design.mdc` - Cyber Carrot Design System
- **Audit Report:** `docs/VISUAL_HIERARCHY_AUDIT_REPORT.md` - Current state analysis
