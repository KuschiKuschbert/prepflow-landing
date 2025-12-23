/**
 * Large Screen Layout Utilities (2024/2025 Best Practices)
 *
 * Modern UX/UI utilities for optimal large screen layouts following current best practices:
 * - Optimal content width: 1200-1400px for readability
 * - Optimal reading width: 60-75 characters per line (~65ch)
 * - Content-first approach: Don't stretch content, use space for sidebars/complementary content
 * - CSS Grid auto-fit patterns for truly responsive layouts
 * - Generous white space for visual breathing room
 */

/**
 * Optimal content width classes for different screen sizes
 */
export const CONTENT_WIDTH_CLASSES = {
  // Optimal content width (1200-1400px) - best for readability
  content: 'max-w-[1400px]',
  // Optimal for text-heavy content (1200px)
  text: 'max-w-[1200px]',
  // Narrower for focused content (1000px)
  narrow: 'max-w-[1000px]',
  // Standard container (1280px)
  standard: 'max-w-7xl',
} as const;

/**
 * Optimal reading width classes
 */
export const READING_WIDTH_CLASSES = {
  // Optimal reading width (~65ch, 60-75 characters per line)
  prose: 'max-w-prose',
  // Slightly wider text (~48rem)
  wide: 'max-w-3xl',
  // No constraint (use sparingly)
  full: '',
} as const;

/**
 * CSS Grid auto-fit template column classes
 * Uses repeat(auto-fit, minmax()) for truly responsive layouts
 */
export const AUTO_FIT_GRID_CLASSES = {
  // Cards: min 280px mobile, 300px tablet, 320px desktop
  cards:
    '[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]',
  // Feature cards: min 300px mobile, 320px tablet, 340px desktop
  features:
    '[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] tablet:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]',
  // Stats/metrics: min 200px mobile, 220px tablet, 240px desktop
  stats:
    '[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] tablet:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]',
} as const;

/**
 * Enhanced gap classes for large screens
 * More space = more breathing room (modern UX best practice)
 */
export const ENHANCED_GAP_CLASSES = {
  sm: 'gap-4 tablet:gap-6 desktop:gap-8 large-desktop:gap-10 xl:gap-12',
  md: 'gap-6 tablet:gap-8 desktop:gap-10 large-desktop:gap-12 xl:gap-14 2xl:gap-16',
  lg: 'gap-8 tablet:gap-10 desktop:gap-12 large-desktop:gap-14 xl:gap-16 2xl:gap-20',
} as const;

/**
 * Enhanced padding classes for large screens
 */
export const ENHANCED_PADDING_CLASSES = {
  container:
    'px-4 tablet:px-6 desktop:px-8 large-desktop:px-12 xl:px-20 2xl:px-24',
  section:
    'py-16 tablet:py-20 desktop:py-24 large-desktop:py-28 xl:py-32 2xl:py-36',
} as const;

/**
 * Card max-width constraints to prevent stretching
 */
export const CARD_MAX_WIDTH_CLASSES = {
  // Feature cards: max 400px to prevent stretching
  feature: 'max-w-[400px]',
  // Standard cards: max 450px
  standard: 'max-w-[450px]',
  // Wide cards: max 500px
  wide: 'max-w-[500px]',
} as const;

/**
 * Get optimal content width class based on content type
 *
 * @param {keyof typeof CONTENT_WIDTH_CLASSES} type - Content type
 * @returns {string} Tailwind class for optimal content width
 */
export function getContentWidthClass(
  type: keyof typeof CONTENT_WIDTH_CLASSES = 'content',
): string {
  return CONTENT_WIDTH_CLASSES[type];
}

/**
 * Get optimal reading width class
 *
 * @param {keyof typeof READING_WIDTH_CLASSES} variant - Reading width variant
 * @returns {string} Tailwind class for optimal reading width
 */
export function getReadingWidthClass(
  variant: keyof typeof READING_WIDTH_CLASSES = 'prose',
): string {
  return READING_WIDTH_CLASSES[variant];
}

/**
 * Get CSS Grid auto-fit class based on content type
 *
 * @param {keyof typeof AUTO_FIT_GRID_CLASSES} type - Grid type
 * @returns {string} Tailwind class for auto-fit grid
 */
export function getAutoFitGridClass(
  type: keyof typeof AUTO_FIT_GRID_CLASSES = 'cards',
): string {
  return AUTO_FIT_GRID_CLASSES[type];
}

/**
 * Get enhanced gap class for large screens
 *
 * @param {keyof typeof ENHANCED_GAP_CLASSES} size - Gap size
 * @returns {string} Tailwind class for enhanced gaps
 */
export function getEnhancedGapClass(size: keyof typeof ENHANCED_GAP_CLASSES = 'md'): string {
  return ENHANCED_GAP_CLASSES[size];
}

/**
 * Get card max-width class to prevent stretching
 *
 * @param {keyof typeof CARD_MAX_WIDTH_CLASSES} type - Card type
 * @returns {string} Tailwind class for card max-width
 */
export function getCardMaxWidthClass(
  type: keyof typeof CARD_MAX_WIDTH_CLASSES = 'standard',
): string {
  return CARD_MAX_WIDTH_CLASSES[type];
}



