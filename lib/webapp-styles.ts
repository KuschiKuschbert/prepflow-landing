/**
 * Webapp Style Decision Helpers
 *
 * Utilities to determine when to use landing page styles vs Material Design 3
 * in the webapp context. Follows the hybrid approach: landing styles for
 * user-facing elements (headers, CTAs, empty states), Material Design 3 for
 * data interfaces (tables, forms, dashboards).
 *
 * @see docs/WEBAPP_LANDING_STYLE_USAGE.md for usage guidelines
 */

/**
 * Component types in the webapp
 */
export type WebappComponentType =
  | 'header'
  | 'navigation'
  | 'cta'
  | 'actionButton'
  | 'emptyState'
  | 'table'
  | 'form'
  | 'dashboard'
  | 'card'
  | 'modal'
  | 'toast';

/**
 * Style variant options
 */
export type StyleVariant = 'landing' | 'material' | 'hybrid';

/**
 * Component context for style decisions
 */
export interface ComponentContext {
  page?: string; // e.g., 'dashboard', 'ingredients', 'recipes'
  section?: string; // e.g., 'header', 'content', 'sidebar'
  userFacing?: boolean; // Is this a user-facing element?
  dataHeavy?: boolean; // Is this a data-heavy interface?
}

/**
 * Determine if landing page styles should be used for a component
 *
 * @param componentType - Type of component
 * @param context - Component context
 * @returns true if landing styles should be used
 *
 * @example
 * ```typescript
 * shouldUseLandingStyles('header', { userFacing: true }) // true
 * shouldUseLandingStyles('table', { dataHeavy: true }) // false
 * ```
 */
export function shouldUseLandingStyles(
  componentType: WebappComponentType,
  context?: ComponentContext,
): boolean {
  // Always use Material Design 3 for data-heavy interfaces
  if (context?.dataHeavy) {
    return false;
  }

  // Always use landing styles for user-facing elements
  if (context?.userFacing) {
    return true;
  }

  // Component-specific decisions
  switch (componentType) {
    case 'header':
    case 'navigation':
    case 'cta':
    case 'actionButton':
    case 'emptyState':
      // User-facing elements - use landing styles
      return true;

    case 'table':
    case 'form':
    case 'dashboard':
      // Data interfaces - use Material Design 3
      return false;

    case 'card':
      // Cards can use either - check context
      return context?.userFacing === true;

    case 'modal':
    case 'toast':
      // Use Material Design 3 for consistency
      return false;

    default:
      // Default to Material Design 3
      return false;
  }
}

/**
 * Get appropriate style variant for a component
 *
 * @param componentType - Type of component
 * @param context - Component context
 * @returns Style variant to use
 *
 * @example
 * ```typescript
 * getComponentStyleVariant('header', { userFacing: true }) // 'landing'
 * getComponentStyleVariant('table', { dataHeavy: true }) // 'material'
 * getComponentStyleVariant('card', { userFacing: true, dataHeavy: false }) // 'hybrid'
 * ```
 */
export function getComponentStyleVariant(
  componentType: WebappComponentType,
  context?: ComponentContext,
): StyleVariant {
  const useLanding = shouldUseLandingStyles(componentType, context);

  if (!useLanding) {
    return 'material';
  }

  // Hybrid approach: landing styles for visual elements, Material Design 3 for structure
  if (componentType === 'card' || componentType === 'emptyState') {
    return 'hybrid';
  }

  return 'landing';
}

/**
 * Style mapping for webapp component types
 * Maps component types to their recommended style approach
 */
export const WEBAPP_STYLE_MAP: Record<WebappComponentType, StyleVariant> = {
  header: 'landing',
  navigation: 'hybrid', // Landing typography, Material Design 3 structure
  cta: 'landing',
  actionButton: 'landing',
  emptyState: 'hybrid', // Landing visual, Material Design 3 container
  table: 'material',
  form: 'material',
  dashboard: 'material',
  card: 'hybrid', // Context-dependent
  modal: 'material',
  toast: 'material',
} as const;

/**
 * Get recommended style variant from style map
 *
 * @param componentType - Type of component
 * @returns Recommended style variant
 */
export function getRecommendedStyleVariant(componentType: WebappComponentType): StyleVariant {
  return WEBAPP_STYLE_MAP[componentType] || 'material';
}

/**
 * Check if a component should use landing page animations
 *
 * @param componentType - Type of component
 * @param context - Component context
 * @returns true if animations should be used
 */
export function shouldUseLandingAnimations(
  componentType: WebappComponentType,
  context?: ComponentContext,
): boolean {
  // Only animate user-facing elements
  if (!context?.userFacing && !shouldUseLandingStyles(componentType, context)) {
    return false;
  }

  // Animate these component types
  const animatedTypes: WebappComponentType[] = [
    'header',
    'cta',
    'actionButton',
    'emptyState',
    'card',
  ];

  return animatedTypes.includes(componentType);
}

/**
 * Get animation configuration for a component
 *
 * @param componentType - Type of component
 * @param context - Component context
 * @returns Animation configuration object
 */
export function getAnimationConfig(
  componentType: WebappComponentType,
  context?: ComponentContext,
): {
  enabled: boolean;
  variant: 'fade-up' | 'fade-in' | 'scale-up' | 'none';
  delay: number;
  duration: number;
} {
  if (!shouldUseLandingAnimations(componentType, context)) {
    return {
      enabled: false,
      variant: 'none',
      delay: 0,
      duration: 0,
    };
  }

  // Component-specific animation configs
  switch (componentType) {
    case 'header':
      return {
        enabled: true,
        variant: 'fade-in',
        delay: 0,
        duration: 0.3,
      };

    case 'cta':
    case 'actionButton':
      return {
        enabled: true,
        variant: 'scale-up',
        delay: 0.1,
        duration: 0.2,
      };

    case 'emptyState':
      return {
        enabled: true,
        variant: 'fade-up',
        delay: 0.1,
        duration: 0.4,
      };

    case 'card':
      return {
        enabled: true,
        variant: 'fade-up',
        delay: 0,
        duration: 0.3,
      };

    default:
      return {
        enabled: false,
        variant: 'none',
        delay: 0,
        duration: 0,
      };
  }
}


