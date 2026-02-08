/**
 * Color Hierarchy Utilities
 *
 * Centralized color hierarchy definitions and utilities
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md for complete hierarchy standards
 */

/**
 * Color Hierarchy Levels
 * Maps semantic text colors to CSS variables
 */
export const COLOR_HIERARCHY = {
  // Primary - Main headings, important content
  primary: {
    color: 'text-[var(--foreground)]',
    opacity: 1.0,
    usage: 'Headings, primary content, important text',
    contrast: 'High',
  },
  // Secondary - Supporting text, descriptions
  secondary: {
    color: 'text-[var(--foreground-secondary)]',
    opacity: 0.9,
    usage: 'Supporting text, descriptions, secondary content',
    contrast: 'High',
  },
  // Muted - Labels, metadata, less important text
  muted: {
    color: 'text-[var(--foreground-muted)]',
    opacity: 0.75,
    usage: 'Labels, metadata, timestamps, less important text',
    contrast: 'Medium',
  },
  // Subtle - Hints, fine print, disabled states
  subtle: {
    color: 'text-[var(--foreground-subtle)]',
    opacity: 0.6,
    usage: 'Hints, fine print, disabled states, placeholder text',
    contrast: 'Low',
  },
} as const;

/**
 * Get text color class for a hierarchy level
 */
export function getTextColor(level: keyof typeof COLOR_HIERARCHY): string {
  return COLOR_HIERARCHY[level].color;
}
