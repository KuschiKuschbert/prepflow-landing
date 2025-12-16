# PrepFlow Color Legend

**Last Updated:** December 2024
**Design System:** Cyber Carrot
**Use Across:** Web, Mobile, Marketing Materials, Social Media, Documentation

---

## 🎨 Primary Color Palette

### Electric Cyan (Primary)

- **Hex:** `#29E7CD`
- **RGB:** `rgb(41, 231, 205)`
- **HSL:** `hsl(171, 78%, 53%)`
- **Usage:** Primary CTAs, links, highlights, icons, primary actions
- **CSS Variable:** `--primary`
- **Tailwind:** `text-[#29E7CD]`, `bg-[#29E7CD]`
- **Accessibility:** ✅ WCAG AA compliant on dark backgrounds

### Blue (Secondary)

- **Hex:** `#3B82F6`
- **RGB:** `rgb(59, 130, 246)`
- **HSL:** `hsl(217, 91%, 60%)`
- **Usage:** Secondary actions, supporting elements, informational content
- **CSS Variable:** `--secondary`
- **Tailwind:** `text-[#3B82F6]`, `bg-[#3B82F6]`
- **Accessibility:** ✅ WCAG AA compliant on dark backgrounds

### Vibrant Magenta (Accent)

- **Hex:** `#D925C7`
- **RGB:** `rgb(217, 37, 199)`
- **HSL:** `hsl(307, 71%, 50%)`
- **Usage:** Accent elements, special highlights, gradient borders
- **CSS Variable:** `--accent`
- **Tailwind:** `text-[#D925C7]`, `bg-[#D925C7]`
- **Accessibility:** ✅ WCAG AA compliant on dark backgrounds

### Cyber Orange (Tertiary)

- **Hex:** `#FF6B00`
- **RGB:** `rgb(255, 107, 0)`
- **HSL:** `hsl(24, 100%, 50%)`
- **Usage:** Warm accents, special callouts, gradient borders (Cyber Carrot pattern), hover effects
- **CSS Variable:** `--tertiary`
- **Tailwind:** `text-[#FF6B00]`, `bg-[#FF6B00]`
- **Accessibility:** ✅ WCAG AA compliant on dark backgrounds

---

## 🌑 Background & Surface Colors

### Dark Background

- **Hex:** `#0A0A0A`
- **RGB:** `rgb(10, 10, 10)`
- **HSL:** `hsl(0, 0%, 4%)`
- **Usage:** Main background color for entire application
- **CSS Variable:** `--background`
- **Tailwind:** `bg-[#0a0a0a]`
- **Accessibility:** ✅ Primary background for dark theme

### White Foreground

- **Hex:** `#FFFFFF`
- **RGB:** `rgb(255, 255, 255)`
- **HSL:** `hsl(0, 0%, 100%)`
- **Usage:** Primary text color, icons, high-contrast elements
- **CSS Variable:** `--foreground`
- **Tailwind:** `text-white`, `bg-white`
- **Accessibility:** ✅ WCAG AAA compliant on dark backgrounds

### Muted (Cards & Containers)

- **Hex:** `#1F1F1F`
- **RGB:** `rgb(31, 31, 31)`
- **HSL:** `hsl(0, 0%, 12%)`
- **Usage:** Card backgrounds, container backgrounds, elevated surfaces
- **CSS Variable:** `--muted`
- **Tailwind:** `bg-[#1f1f1f]`
- **Accessibility:** ✅ Provides subtle contrast from background

### Border Gray

- **Hex:** `#2A2A2A`
- **RGB:** `rgb(42, 42, 42)`
- **HSL:** `hsl(0, 0%, 16%)`
- **Usage:** Borders, dividers, subtle separators
- **CSS Variable:** `--border`
- **Tailwind:** `border-[#2a2a2a]`
- **Accessibility:** ✅ Subtle but visible borders

### Surface (Elevated Elements)

- **Hex:** `#2A2A2A`
- **RGB:** `rgb(42, 42, 42)`
- **HSL:** `hsl(0, 0%, 16%)`
- **Usage:** Elevated surfaces, modals, dropdowns
- **CSS Variable:** `--surface`
- **Tailwind:** `bg-[#2a2a2a]`
- **Accessibility:** ✅ Provides depth and hierarchy

### Surface Variant (Subtle Backgrounds)

- **Hex:** `#2A2A2A` with 30% opacity
- **RGB:** `rgba(42, 42, 42, 0.3)`
- **HSL:** `hsla(0, 0%, 16%, 0.3)`
- **Usage:** Subtle backgrounds, overlays, hover states
- **CSS Variable:** `--surface-variant`
- **Tailwind:** `bg-[#2a2a2a]/30`
- **Accessibility:** ✅ Subtle visual feedback

---

## 📊 Gray Scale (Text Hierarchy)

### Gray 300 (Primary Text)

- **Hex:** `#D1D5DB`
- **RGB:** `rgb(209, 213, 219)`
- **HSL:** `hsl(214, 16%, 84%)`
- **Usage:** Primary body text, main content
- **Tailwind:** `text-gray-300`
- **Accessibility:** ✅ WCAG AA compliant on dark backgrounds

### Gray 400 (Secondary Text)

- **Hex:** `#9CA3AF`
- **RGB:** `rgb(156, 163, 175)`
- **HSL:** `hsl(215, 16%, 65%)`
- **Usage:** Secondary text, labels, metadata
- **Tailwind:** `text-gray-400`
- **Accessibility:** ✅ WCAG AA compliant on dark backgrounds

### Gray 500 (Muted Text)

- **Hex:** `#6B7280`
- **RGB:** `rgb(107, 114, 128)`
- **HSL:** `hsl(215, 13%, 50%)`
- **Usage:** Muted text, captions, fine print
- **Tailwind:** `text-gray-500`
- **Accessibility:** ⚠️ Use sparingly - lower contrast

### Gray 600 (Disabled Text)

- **Hex:** `#4B5563`
- **RGB:** `rgb(75, 85, 99)`
- **HSL:** `hsl(215, 16%, 34%)`
- **Usage:** Disabled states, placeholder text
- **Tailwind:** `text-gray-600`
- **Accessibility:** ⚠️ Use only for disabled/placeholder states

### Gray 700 (Subtle Borders)

- **Hex:** `#374151`
- **RGB:** `rgb(55, 65, 81)`
- **HSL:** `hsl(215, 19%, 25%)`
- **Usage:** Subtle borders, dividers
- **Tailwind:** `border-gray-700`
- **Accessibility:** ✅ Subtle visual separation

### Gray 800 (Dark Surfaces)

- **Hex:** `#1F2937`
- **RGB:** `rgb(31, 41, 55)`
- **HSL:** `hsl(215, 28%, 17%)`
- **Usage:** Dark surfaces, alternative backgrounds
- **Tailwind:** `bg-gray-800`
- **Accessibility:** ✅ Provides contrast from main background

---

## 🎭 Semantic Colors

### Success (Green)

- **Hex:** `#10B981` (Tailwind green-500)
- **RGB:** `rgb(16, 185, 129)`
- **HSL:** `hsl(160, 84%, 39%)`
- **Usage:** Success messages, positive feedback, completed states
- **Tailwind:** `text-green-400`, `bg-green-500/10`, `border-green-500/30`
- **Accessibility:** ✅ WCAG AA compliant

### Error (Red)

- **Hex:** `#EF4444` (Tailwind red-500)
- **RGB:** `rgb(239, 68, 68)`
- **HSL:** `hsl(0, 84%, 60%)`
- **Usage:** Error messages, destructive actions, warnings
- **Tailwind:** `text-red-400`, `bg-red-500/10`, `border-red-500/30`
- **Accessibility:** ✅ WCAG AA compliant

### Warning (Yellow)

- **Hex:** `#F59E0B` (Tailwind yellow-500)
- **RGB:** `rgb(245, 158, 11)`
- **HSL:** `hsl(38, 92%, 50%)`
- **Usage:** Warning messages, caution states
- **Tailwind:** `text-yellow-400`, `bg-yellow-500/10`, `border-yellow-500/30`
- **Accessibility:** ✅ WCAG AA compliant

### Info (Cyan - Uses Primary)

- **Hex:** `#29E7CD` (Same as Primary)
- **RGB:** `rgb(41, 231, 205)`
- **HSL:** `hsl(171, 78%, 53%)`
- **Usage:** Informational messages, tips, guidance
- **Tailwind:** `text-[#29E7CD]`, `bg-[#29E7CD]/10`, `border-[#29E7CD]/30`
- **Accessibility:** ✅ WCAG AA compliant

---

## 🌈 Cyber Carrot Gradient Patterns

### Primary Gradient (Cyan → Magenta)

- **From:** `#29E7CD` (Electric Cyan)
- **To:** `#D925C7` (Vibrant Magenta)
- **Usage:** Primary buttons, CTAs, hero sections
- **CSS:** `linear-gradient(to right, #29E7CD, #D925C7)`
- **Tailwind:** `bg-gradient-to-r from-[#29E7CD] to-[#D925C7]`

### Cyber Carrot Gradient Border (Full Pattern)

- **Colors:** Cyan → Orange → Magenta → Cyan
- **From:** `#29E7CD` (20% opacity)
- **Via:** `#FF6B00` (20% opacity)
- **Via:** `#D925C7` (20% opacity)
- **To:** `#29E7CD` (20% opacity)
- **Usage:** Popups, modals, dropdowns, elevated components
- **CSS:** `linear-gradient(to right, rgba(41, 231, 205, 0.2), rgba(255, 107, 0, 0.2), rgba(217, 37, 199, 0.2), rgba(41, 231, 205, 0.2))`
- **Tailwind:** `bg-gradient-to-r from-[#29E7CD]/20 via-[#FF6B00]/20 via-[#D925C7]/20 to-[#29E7CD]/20`

### Warm Gradient (Cyan → Orange → Magenta)

- **From:** `#29E7CD` (Electric Cyan)
- **Via:** `#FF6B00` (Cyber Orange)
- **To:** `#D925C7` (Vibrant Magenta)
- **Usage:** Special CTAs, hero sections, featured content
- **CSS:** `linear-gradient(to right, #29E7CD, #FF6B00, #D925C7)`
- **Tailwind:** `bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7]`

---

## 📱 Platform-Specific Formats

### CSS Variables (Web)

```css
:root {
  --primary: #29e7cd;
  --secondary: #3b82f6;
  --accent: #d925c7;
  --tertiary: #ff6b00;
  --background: #0a0a0a;
  --foreground: #ffffff;
  --muted: #1f1f1f;
  --border: #2a2a2a;
  --surface: #2a2a2a;
  --surface-variant: rgba(42, 42, 42, 0.3);
}
```

### Tailwind CSS Classes

```typescript
// Primary colors
'text-[#29E7CD]'; // Electric Cyan
'bg-[#3B82F6]'; // Blue
'border-[#D925C7]'; // Vibrant Magenta
'bg-[#FF6B00]'; // Cyber Orange

// Backgrounds
'bg-[#0a0a0a]'; // Dark background
'bg-[#1f1f1f]'; // Muted (cards)
'bg-[#2a2a2a]'; // Surface

// Text colors
'text-white'; // Primary text
'text-gray-300'; // Primary body text
'text-gray-400'; // Secondary text
'text-gray-500'; // Muted text
```

### React Native / Mobile

```typescript
const colors = {
  primary: '#29E7CD',
  secondary: '#3B82F6',
  accent: '#D925C7',
  tertiary: '#FF6B00',
  background: '#0A0A0A',
  foreground: '#FFFFFF',
  muted: '#1F1F1F',
  border: '#2A2A2A',
  surface: '#2A2A2A',
  surfaceVariant: 'rgba(42, 42, 42, 0.3)',
};
```

### Figma / Design Tools

```
Primary: #29E7CD
Secondary: #3B82F6
Accent: #D925C7
Tertiary: #FF6B00
Background: #0A0A0A
Foreground: #FFFFFF
Muted: #1F1F1F
Border: #2A2A2A
```

### Adobe / Print

```
CMYK Values (approximate):
- Primary (Cyan): C:82% M:0% Y:11% K:9%
- Secondary (Blue): C:76% M:47% Y:0% K:4%
- Accent (Magenta): C:0% M:83% Y:8% K:15%
- Tertiary (Orange): C:0% M:58% Y:100% K:0%
- Background: C:0% M:0% Y:0% K:96%
```

---

## 🎯 Usage Guidelines

### Color Hierarchy

1. **Primary (Cyan)** - Most important actions, primary CTAs
2. **Secondary (Blue)** - Supporting actions, informational content
3. **Accent (Magenta)** - Special highlights, accent elements
4. **Tertiary (Orange)** - Warm accents, special callouts, hover effects

### Do's ✅

- Use Primary (Cyan) for main CTAs and primary actions
- Use gradients for special emphasis (buttons, hero sections)
- Maintain consistent color usage across platforms
- Use gray scale for text hierarchy
- Use semantic colors for feedback (success, error, warning)

### Don'ts ❌

- Don't use more than 2-3 accent colors per component
- Don't use orange as primary action color (use cyan)
- Don't mix light and dark themes in same view
- Don't use low-contrast colors for important text
- Don't create new colors - use the defined palette

---

## 🔍 Color Combinations

### High Contrast (Accessible)

- White text on `#0A0A0A` background ✅ AAA
- Cyan (`#29E7CD`) on dark backgrounds ✅ AA
- White text on primary gradient ✅ AA

### Medium Contrast

- Gray-300 text on `#1F1F1F` background ✅ AA
- Gray-400 text on `#2A2A2A` background ✅ AA

### Low Contrast (Use Sparingly)

- Gray-500 text on dark backgrounds ⚠️ Use only for muted/secondary content
- Gray-600 text ⚠️ Use only for disabled/placeholder states

---

## 📐 Opacity Variations

### Common Opacity Levels

- **10%** (`/10`): Subtle backgrounds, hover states
- **20%** (`/20`): Gradient borders, subtle overlays
- **30%** (`/30`): Surface variants, card backgrounds
- **50%** (`/50`): Semi-transparent overlays
- **80%** (`/80`): Backdrop blur overlays

### Examples

```css
/* Subtle background */
background: rgba(41, 231, 205, 0.1); /* #29E7CD at 10% */

/* Gradient border */
background: linear-gradient(
  to right,
  rgba(41, 231, 205, 0.2),
  rgba(255, 107, 0, 0.2),
  rgba(217, 37, 199, 0.2)
);
```

---

## 🎨 Quick Reference Table

| Color Name       | Hex       | RGB                  | Usage             | CSS Variable   |
| ---------------- | --------- | -------------------- | ----------------- | -------------- |
| Electric Cyan    | `#29E7CD` | `rgb(41, 231, 205)`  | Primary actions   | `--primary`    |
| Blue             | `#3B82F6` | `rgb(59, 130, 246)`  | Secondary actions | `--secondary`  |
| Vibrant Magenta  | `#D925C7` | `rgb(217, 37, 199)`  | Accent elements   | `--accent`     |
| Cyber Orange     | `#FF6B00` | `rgb(255, 107, 0)`   | Warm accents      | `--tertiary`   |
| Dark Background  | `#0A0A0A` | `rgb(10, 10, 10)`    | Main background   | `--background` |
| White Foreground | `#FFFFFF` | `rgb(255, 255, 255)` | Primary text      | `--foreground` |
| Muted            | `#1F1F1F` | `rgb(31, 31, 31)`    | Cards/containers  | `--muted`      |
| Border Gray      | `#2A2A2A` | `rgb(42, 42, 42)`    | Borders           | `--border`     |
| Surface          | `#2A2A2A` | `rgb(42, 42, 42)`    | Elevated surfaces | `--surface`    |

---

## 📋 Export Formats

### JSON (For APIs/Configs)

```json
{
  "colors": {
    "primary": "#29E7CD",
    "secondary": "#3B82F6",
    "accent": "#D925C7",
    "tertiary": "#FF6B00",
    "background": "#0A0A0A",
    "foreground": "#FFFFFF",
    "muted": "#1F1F1F",
    "border": "#2A2A2A"
  }
}
```

### SCSS Variables

```scss
$primary: #29e7cd;
$secondary: #3b82f6;
$accent: #d925c7;
$tertiary: #ff6b00;
$background: #0a0a0a;
$foreground: #ffffff;
$muted: #1f1f1f;
$border: #2a2a2a;
```

### TypeScript Constants

```typescript
export const COLORS = {
  primary: '#29E7CD',
  secondary: '#3B82F6',
  accent: '#D925C7',
  tertiary: '#FF6B00',
  background: '#0A0A0A',
  foreground: '#FFFFFF',
  muted: '#1F1F1F',
  border: '#2A2A2A',
} as const;
```

---

## 🔗 Related Documentation

- **Design System:** `.cursor/rules/design.mdc`
- **Landing Page Styles:** `docs/LANDING_PAGE_STYLE_GUIDE.md`
- **Style Utilities:** `lib/landing-styles.ts`
- **CSS Variables:** `app/globals.css`

---

**Last Updated:** December 2024
**Maintained By:** PrepFlow Design Team




