/**
 * Helper functions for large screen layout utilities
 */

import {
  CONTENT_WIDTH_CLASSES,
  READING_WIDTH_CLASSES,
  AUTO_FIT_GRID_CLASSES,
  ENHANCED_GAP_CLASSES,
  CARD_MAX_WIDTH_CLASSES,
  FIXED_GRID_PATTERNS,
} from './large-screen-utils';

/**
 * Get optimal content width class based on content type
 */
export function getContentWidthClass(type: keyof typeof CONTENT_WIDTH_CLASSES = 'content'): string {
  return CONTENT_WIDTH_CLASSES[type];
}

/**
 * Get optimal reading width class
 */
export function getReadingWidthClass(
  variant: keyof typeof READING_WIDTH_CLASSES = 'prose',
): string {
  return READING_WIDTH_CLASSES[variant];
}

/**
 * Get CSS Grid auto-fit class based on content type
 */
export function getAutoFitGridClass(type: keyof typeof AUTO_FIT_GRID_CLASSES = 'cards'): string {
  return AUTO_FIT_GRID_CLASSES[type];
}

/**
 * Get enhanced gap class for large screens
 */
export function getEnhancedGapClass(size: keyof typeof ENHANCED_GAP_CLASSES = 'md'): string {
  return ENHANCED_GAP_CLASSES[size];
}

/**
 * Get card max-width class to prevent stretching
 */
export function getCardMaxWidthClass(
  type: keyof typeof CARD_MAX_WIDTH_CLASSES = 'standard',
): string {
  return CARD_MAX_WIDTH_CLASSES[type];
}

/**
 * Get fixed-column grid pattern based on content type
 */
export function getFixedGridPattern(type: keyof typeof FIXED_GRID_PATTERNS = 'cards'): string {
  return FIXED_GRID_PATTERNS[type];
}
