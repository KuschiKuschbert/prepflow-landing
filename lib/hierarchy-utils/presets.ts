/**
 * Hierarchy Presets Utilities
 *
 * Pre-configured combinations for common use cases
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md for complete hierarchy standards
 */

import { getTypographyClasses } from './typography';
import { getSectionSpacing, getComponentSpacing } from './spacing';

/**
 * Hierarchy Presets
 * Pre-configured combinations for common use cases
 */
export const HIERARCHY_PRESETS = {
  // Page header preset
  pageHeader: {
    title: getTypographyClasses('headline'),
    subtitle: getTypographyClasses('subtitle'),
    spacing: getSectionSpacing('header'),
  },
  // Card preset
  card: {
    title: getTypographyClasses('title'),
    body: getTypographyClasses('body'),
    caption: getTypographyClasses('caption'),
    spacing: getComponentSpacing('card'),
  },
  // Form preset
  form: {
    label: getTypographyClasses('label'),
    input: getTypographyClasses('body'),
    hint: getTypographyClasses('caption'),
    spacing: getComponentSpacing('formField'),
  },
  // Section preset
  section: {
    title: getTypographyClasses('title'),
    subtitle: getTypographyClasses('subtitle'),
    body: getTypographyClasses('body'),
    spacing: getSectionSpacing('section'),
  },
} as const;

/**
 * Get hierarchy preset
 */
export function getHierarchyPreset(
  preset: keyof typeof HIERARCHY_PRESETS,
): (typeof HIERARCHY_PRESETS)[keyof typeof HIERARCHY_PRESETS] {
  return HIERARCHY_PRESETS[preset];
}
