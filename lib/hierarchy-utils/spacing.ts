/**
 * Spacing Hierarchy Utilities
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md for complete hierarchy standards
 */

/**
 * Spacing Scale (4px base unit)
 */
export const SPACING_SCALE = {
  tight: { value: 4, class: 'gap-1 space-y-1', usage: 'Icon groups, tight inline elements' },
  compact: { value: 8, class: 'gap-2 space-y-2', usage: 'Form fields, compact lists' },
  normal: { value: 16, class: 'gap-4 space-y-4', usage: 'Standard content spacing, card padding' },
  comfortable: {
    value: 24,
    class: 'gap-6 space-y-6',
    usage: 'Section spacing, comfortable reading',
  },
  spacious: { value: 32, class: 'gap-8 space-y-8', usage: 'Major section spacing, page sections' },
  generous: { value: 48, class: 'gap-12 space-y-12', usage: 'Hero sections, landing page spacing' },
} as const;

export function getSpacingClasses(level: keyof typeof SPACING_SCALE): string {
  return SPACING_SCALE[level].class;
}

export function getSpacingValue(level: keyof typeof SPACING_SCALE): number {
  return SPACING_SCALE[level].value;
}

/**
 * Section spacing presets
 */
export const SECTION_SPACING = {
  header: {
    mobile: 'mb-4',
    tablet: 'tablet:mb-6',
    desktop: 'desktop:mb-8',
    full: 'mb-4 tablet:mb-6 desktop:mb-8',
  },
  section: {
    mobile: 'py-12',
    tablet: 'tablet:py-16',
    desktop: 'desktop:py-20',
    full: 'py-12 tablet:py-16 desktop:py-20',
  },
  component: {
    mobile: 'mb-4',
    tablet: 'tablet:mb-6',
    desktop: 'desktop:mb-6',
    full: 'mb-4 tablet:mb-6 desktop:mb-6',
  },
} as const;

export function getSectionSpacing(type: keyof typeof SECTION_SPACING): string {
  return SECTION_SPACING[type].full;
}

/**
 * Component spacing presets
 */
export const COMPONENT_SPACING = {
  card: {
    mobile: 'p-4',
    tablet: 'tablet:p-6',
    desktop: 'desktop:p-6',
    full: 'p-4 tablet:p-6 desktop:p-6',
  },
  formField: {
    mobile: 'mb-4',
    tablet: 'tablet:mb-4',
    desktop: 'desktop:mb-4',
    full: 'mb-4',
  },
  button: {
    sm: 'px-3 py-1.5',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  },
} as const;

export function getComponentSpacing(
  type: keyof typeof COMPONENT_SPACING,
  variant?: string,
): string {
  const spacing = COMPONENT_SPACING[type];
  if (type === 'button') {
    const buttonSpacing = spacing as typeof COMPONENT_SPACING.button;
    if (variant && variant in buttonSpacing) {
      return buttonSpacing[variant as 'sm' | 'md' | 'lg'];
    }
    return buttonSpacing.md;
  }
  if ('full' in spacing) {
    const responsiveSpacing = spacing as {
      mobile: string;
      tablet: string;
      desktop: string;
      full: string;
    };
    if (variant && variant in responsiveSpacing) {
      return responsiveSpacing[variant as keyof typeof responsiveSpacing];
    }
    return responsiveSpacing.full;
  }
  return '';
}
