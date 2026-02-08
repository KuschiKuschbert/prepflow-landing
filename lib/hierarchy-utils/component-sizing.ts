/**
 * Component Sizing Hierarchy Utilities
 *
 * Centralized component sizing definitions and utilities
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md for complete hierarchy standards
 */

/**
 * Component Size Hierarchy
 */
export const COMPONENT_SIZES = {
  // Button sizes
  button: {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-xs',
      height: 'min-h-[32px]',
      usage: 'Compact buttons, inline actions',
    },
    md: {
      padding: 'px-6 py-3',
      text: 'text-sm',
      height: 'min-h-[44px]',
      usage: 'Standard buttons, primary actions',
    },
    lg: {
      padding: 'px-8 py-4',
      text: 'text-base',
      height: 'min-h-[52px]',
      usage: 'Large buttons, prominent CTAs',
    },
  },
  // Card sizes
  card: {
    sm: {
      padding: 'p-4',
      gap: 'gap-2',
      usage: 'Compact cards, list items',
    },
    md: {
      padding: 'p-6',
      gap: 'gap-4',
      usage: 'Standard cards, content cards',
    },
    lg: {
      padding: 'p-8',
      gap: 'gap-6',
      usage: 'Large cards, feature cards',
    },
  },
  // Modal sizes
  modal: {
    sm: {
      width: 'max-w-md',
      padding: 'p-4',
      usage: 'Small modals, confirmations',
    },
    md: {
      width: 'max-w-lg',
      padding: 'p-6',
      usage: 'Standard modals, forms',
    },
    lg: {
      width: 'max-w-2xl',
      padding: 'p-8',
      usage: 'Large modals, detailed content',
    },
  },
  // Input sizes
  input: {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      height: 'h-8',
      usage: 'Compact inputs, inline forms',
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-base',
      height: 'h-10',
      usage: 'Standard inputs, most forms',
    },
    lg: {
      padding: 'px-4 py-3',
      text: 'text-lg',
      height: 'h-12',
      usage: 'Large inputs, prominent forms',
    },
  },
} as const;

/**
 * Get component size classes
 */
export function getComponentSize(
  component: keyof typeof COMPONENT_SIZES,
  size: 'sm' | 'md' | 'lg',
): string {
  const componentSizes = COMPONENT_SIZES[component];
  const sizeConfig = componentSizes[size];
  // Extract CSS class values, excluding the 'usage' property
  const classes: string[] = [];
  if ('padding' in sizeConfig) classes.push(sizeConfig.padding);
  if ('text' in sizeConfig) classes.push(sizeConfig.text);
  if ('height' in sizeConfig) classes.push(sizeConfig.height);
  if ('width' in sizeConfig) classes.push(sizeConfig.width);
  if ('gap' in sizeConfig) classes.push(sizeConfig.gap);
  return classes.join(' ');
}
