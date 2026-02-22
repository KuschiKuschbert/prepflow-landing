/**
 * Typography Hierarchy Utilities
 *
 * Centralized typography hierarchy definitions and utilities
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md for complete hierarchy standards
 */

/**
 * Typography Hierarchy Levels
 * Maps semantic names to CSS classes and properties
 */
export const TYPOGRAPHY_HIERARCHY = {
  // Display - Largest, hero sections, landing page headlines (globals.css defines xs-4xl only)
  display: {
    size: 'text-fluid-4xl',
    weight: 'font-light',
    lineHeight: 'leading-tight',
    usage: 'Hero headlines, landing page titles',
  },
  // Headline - Page titles, major section headers
  headline: {
    size: 'text-fluid-3xl tablet:text-fluid-4xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
    usage: 'Page titles (H1), major section headers',
  },
  // Title - Section headers, card titles
  title: {
    size: 'text-fluid-xl tablet:text-fluid-2xl',
    weight: 'font-semibold',
    lineHeight: 'leading-snug',
    usage: 'Section headers (H2), card titles, modal titles',
  },
  // Subtitle - Supporting text for titles
  subtitle: {
    size: 'text-fluid-base tablet:text-fluid-lg',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
    usage: 'Subheadings (H3), supporting text for titles',
  },
  // Body - Main content text
  body: {
    size: 'text-fluid-base',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
    usage: 'Body text, paragraphs, descriptions',
  },
  // Label - Form labels, metadata
  label: {
    size: 'text-fluid-sm',
    weight: 'font-medium',
    lineHeight: 'leading-normal',
    usage: 'Form labels, metadata, secondary information',
  },
  // Caption - Smallest text, hints, fine print
  caption: {
    size: 'text-fluid-xs',
    weight: 'font-normal',
    lineHeight: 'leading-normal',
    usage: 'Captions, hints, fine print, timestamps',
  },
} as const;

/**
 * Get typography classes for a hierarchy level
 */
export function getTypographyClasses(level: keyof typeof TYPOGRAPHY_HIERARCHY): string {
  const hierarchy = TYPOGRAPHY_HIERARCHY[level];
  return `${hierarchy.size} ${hierarchy.weight} ${hierarchy.lineHeight}`;
}
