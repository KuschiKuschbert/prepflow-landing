/**
 * Spacing Hierarchy Utilities
 *
 * Centralized spacing scale and utilities
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md for complete hierarchy standards
 */

/**
 * Spacing Scale (4px base unit)
 * Maps semantic names to Tailwind spacing classes
 */
export const SPACING_SCALE = {
  // Tight - Minimal spacing for compact layouts
  tight: {
    value: 4, // 0.25rem
    class: 'gap-1 space-y-1',
    usage: 'Icon groups, tight inline elements',
  },
  // Compact - Small spacing for dense content
  compact: {
    value: 8, // 0.5rem
    class: 'gap-2 space-y-2',
    usage: 'Form fields, compact lists',
  },
  // Normal - Standard spacing for most content
  normal: {
    value: 16, // 1rem
    class: 'gap-4 space-y-4',
    usage: 'Standard content spacing, card padding',
  },
  // Comfortable - Generous spacing for readability
  comfortable: {
    value: 24, // 1.5rem
    class: 'gap-6 space-y-6',
    usage: 'Section spacing, comfortable reading',
  },
  // Spacious - Large spacing for major sections
  spacious: {
    value: 32, // 2rem
    class: 'gap-8 space-y-8',
    usage: 'Major section spacing, page sections',
  },
  // Generous - Maximum spacing for hero sections
  generous: {
    value: 48, // 3rem
    class: 'gap-12 space-y-12',
    usage: 'Hero sections, landing page spacing',
  },
} as const;

/**
 * Get spacing classes for a semantic level
 */
export function getSpacingClasses(level: keyof typeof SPACING_SCALE): string {
  return SPACING_SCALE[level].class;
}

/**
 * Get spacing value in pixels
 */
export function getSpacingValue(level: keyof typeof SPACING_SCALE): number {
  return SPACING_SCALE[level].value;
}

/**
 * Section spacing presets
 */
export const SECTION_SPACING = {
  // Page header spacing
  header: {
    mobile: 'mb-4',
    tablet: 'tablet:mb-6',
    desktop: 'desktop:mb-8',
    full: 'mb-4 tablet:mb-6 desktop:mb-8',
  },
  // Section spacing
  section: {
    mobile: 'py-12',
    tablet: 'tablet:py-16',
    desktop: 'desktop:py-20',
    full: 'py-12 tablet:py-16 desktop:py-20',
  },
  // Component spacing
  component: {
    mobile: 'mb-4',
    tablet: 'tablet:mb-6',
    desktop: 'desktop:mb-6',
    full: 'mb-4 tablet:mb-6 desktop:mb-6',
  },
} as const;

/**
 * Get section spacing classes
 */
export function getSectionSpacing(type: keyof typeof SECTION_SPACING): string {
  return SECTION_SPACING[type].full;
}

/**
 * Component spacing presets
 */
export const COMPONENT_SPACING = {
  // Card padding
  card: {
    mobile: 'p-4',
    tablet: 'tablet:p-6',
    desktop: 'desktop:p-6',
    full: 'p-4 tablet:p-6 desktop:p-6',
  },
  // Form field spacing
  formField: {
    mobile: 'mb-4',
    tablet: 'tablet:mb-4',
    desktop: 'desktop:mb-4',
    full: 'mb-4',
  },
  // Button padding
  button: {
    sm: 'px-3 py-1.5',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  },
} as const;

/**
 * Get component spacing classes
 */
export function getComponentSpacing(
  type: keyof typeof COMPONENT_SPACING,
  variant?: string,
): string {
  const spacing = COMPONENT_SPACING[type];
  if (variant && 'full' in spacing) {
    return spacing.full;
  }
  if (variant && variant in spacing) {
    return spacing[variant as keyof typeof spacing] as string;
  }
  return spacing.full || spacing.mobile || '';
}
