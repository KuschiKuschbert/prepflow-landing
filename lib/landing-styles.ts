/**
 * Landing Page Style Constants and Utilities (Cyber Carrot Design System)
 *
 * Centralized style constants for the PrepFlow landing page.
 * Part of the Cyber Carrot Design System - use these constants to maintain consistency across landing page components.
 *
 * @see docs/LANDING_PAGE_STYLE_GUIDE.md for complete style guide
 */

/**
 * Color palette matching CSS variables and inline styles
 */
export const LANDING_COLORS = {
  // Primary colors
  primary: '#29E7CD', // Electric Cyan
  secondary: '#3B82F6', // Blue
  accent: '#D925C7', // Vibrant Magenta
  tertiary: '#FF6B00', // Cyber Orange - Warm Accents & Carrot Theme

  // Background colors
  background: '#0a0a0a', // Dark background
  foreground: '#ffffff', // White text

  // Gray scale
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',

  // Semantic colors
  muted: '#1f1f1f', // Dark gray for cards
  border: '#2a2a2a', // Border gray
} as const;

/**
 * RGBA color helpers for transparency effects
 */
export const LANDING_COLORS_RGBA = {
  primary: {
    default: 'rgba(41, 231, 205, 1)',
    '10': 'rgba(41, 231, 205, 0.1)',
    '15': 'rgba(41, 231, 205, 0.15)',
    '20': 'rgba(41, 231, 205, 0.2)',
    '25': 'rgba(41, 231, 205, 0.25)',
    '50': 'rgba(41, 231, 205, 0.5)',
  },
  secondary: {
    default: 'rgba(59, 130, 246, 1)',
    '10': 'rgba(59, 130, 246, 0.1)',
    '15': 'rgba(59, 130, 246, 0.15)',
    '20': 'rgba(59, 130, 246, 0.2)',
  },
  accent: {
    default: 'rgba(217, 37, 199, 1)',
    '10': 'rgba(217, 37, 199, 0.1)',
    '15': 'rgba(217, 37, 199, 0.15)',
    '20': 'rgba(217, 37, 199, 0.2)',
  },
  tertiary: {
    default: 'rgba(255, 107, 0, 1)',
    '10': 'rgba(255, 107, 0, 0.1)',
    '15': 'rgba(255, 107, 0, 0.15)',
    '20': 'rgba(255, 107, 0, 0.2)',
  },
  white: {
    '5': 'rgba(255, 255, 255, 0.05)',
    '10': 'rgba(255, 255, 255, 0.1)',
    '20': 'rgba(255, 255, 255, 0.2)',
  },
} as const;

/**
 * Fluid typography scale mapping
 * Maps semantic names to Tailwind fluid classes
 */
export const LANDING_TYPOGRAPHY = {
  xs: 'text-fluid-xs',
  sm: 'text-fluid-sm',
  base: 'text-fluid-base',
  lg: 'text-fluid-lg',
  xl: 'text-fluid-xl',
  '2xl': 'text-fluid-2xl',
  '3xl': 'text-fluid-3xl',
  '4xl': 'text-fluid-4xl',
  // Extended classes (defined inline, not as CSS utilities)
  '5xl': 'text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl',
  '6xl': 'text-fluid-6xl tablet:text-fluid-7xl desktop:text-fluid-8xl',
  '7xl': 'text-fluid-7xl tablet:text-fluid-8xl',
  '8xl': 'text-fluid-8xl',
} as const;

/**
 * Font weights
 */
export const LANDING_FONT_WEIGHTS = {
  light: 'font-light', // 300 - For headings
  normal: 'font-normal', // 400 - For body text
  semibold: 'font-semibold', // 600 - For labels and CTAs
  bold: 'font-bold', // 700 - For emphasis
} as const;

/**
 * Button style presets for MagneticButton
 */
export const LANDING_BUTTON_STYLES = {
  primary: {
    base: 'rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none',
    withFluid:
      'text-fluid-base tablet:text-fluid-lg rounded-full border border-white/20 bg-white px-8 py-4 font-normal text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none',
  },
  secondary: {
    base: 'rounded-full border border-white/20 bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none',
    withFluid:
      'text-fluid-base tablet:text-fluid-lg rounded-full border border-white/20 bg-transparent px-8 py-4 font-normal text-white transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none',
  },
} as const;

/**
 * GlowCard style presets
 */
export const LANDING_CARD_STYLES = {
  base: 'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20',
  padding: {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
    xl: 'p-12',
  },
} as const;

/**
 * Container and layout presets
 */
export const LANDING_LAYOUT = {
  container:
    'mx-auto max-w-7xl px-6 tablet:px-8 desktop:px-10 large-desktop:px-12 xl:px-20 2xl:px-24',
  containerNarrow: 'mx-auto max-w-4xl px-6 tablet:px-8 desktop:px-10',
  sectionPadding: 'py-16 tablet:py-20 desktop:py-24 large-desktop:py-28 xl:py-32',
  sectionPaddingLarge: 'py-24 tablet:py-32 desktop:py-36 large-desktop:py-40 xl:py-44',
  // Modern large screen optimizations (2024/2025 best practices)
  contentMaxWidth: 'max-w-[1400px]', // Optimal content width for readability
  textMaxWidth: 'max-w-prose', // Optimal reading width (~65ch, 60-75 characters)
  textMaxWidthWide: 'max-w-3xl', // Slightly wider text (~48rem)
} as const;

/**
 * Grid layout presets
 * Updated to use 3 columns at tablet (481px+) - modern industry standard (2024-2025)
 *
 * @deprecated '1-2-3' and '1-2-4' - Use '1-3-4' instead for 3 columns at tablet
 */
export const LANDING_GRIDS = {
  /** @deprecated Use '1-3-4' instead - 1 mobile, 2 tablet, 3 desktop */
  '1-2-3': 'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3',
  /** @deprecated Use '1-3-4' instead - 1 mobile, 2 tablet, 4 desktop */
  '1-2-4': 'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4',
  /** Standard pattern: 1 mobile, 3 tablet, 4 desktop */
  '1-3-4': 'grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4',
  /** Dense pattern: 1 mobile, 3 tablet, 4 desktop, 5 large desktop */
  '1-3-4-5': 'grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5',
  /** Wide pattern: 1 mobile, 2 tablet, 3 desktop (for larger card content) */
  '1-2-3-wide': 'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3',
  /** Skip tablet: 1 mobile, 3 desktop */
  '1-3': 'grid grid-cols-1 desktop:grid-cols-3',
  /** Skip tablet: 1 mobile, 4 desktop */
  '1-4': 'grid grid-cols-1 desktop:grid-cols-4',
} as const;

/**
 * Animation configuration constants
 */
export const LANDING_ANIMATIONS = {
  // ScrollReveal defaults
  scrollReveal: {
    defaultDelay: 0,
    defaultDuration: 0.5,
    staggerDelay: 0.1, // Delay increment for staggered animations
  },
  // MagneticButton defaults
  magneticButton: {
    defaultStrength: 0.3,
    defaultMaxDistance: 20,
    ctaStrength: 0.4, // Stronger for CTAs
    ctaMaxDistance: 15,
  },
  // Hover effects
  hover: {
    scale: 1.05,
    duration: 0.3,
  },
  // Spring animation config
  spring: {
    stiffness: 150,
    damping: 15,
  },
} as const;

/**
 * Helper function to get glow color for GlowCard
 */
export function getGlowColor(color: string): string {
  // If already rgba, return as-is
  if (color.startsWith('rgba')) {
    return color;
  }

  // Convert hex to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  // Default to primary color
  return LANDING_COLORS_RGBA.primary['15'];
}

/**
 * Helper function to get responsive typography classes
 * Returns the base class from LANDING_TYPOGRAPHY - responsive variants are handled via Tailwind breakpoints
 */
export function getResponsiveTypography(size: keyof typeof LANDING_TYPOGRAPHY): string {
  return LANDING_TYPOGRAPHY[size];
}

/**
 * Helper function to create staggered delay for ScrollReveal
 */
export function getStaggerDelay(index: number, baseDelay: number = 0): number {
  return baseDelay + index * LANDING_ANIMATIONS.scrollReveal.staggerDelay;
}

/**
 * Helper function to get section classes with consistent padding and layout
 */
export function getSectionClasses(options?: {
  padding?: 'small' | 'medium' | 'large';
  background?: 'transparent' | 'muted';
  border?: boolean;
}): string {
  const classes: string[] = ['relative'];

  // Padding
  switch (options?.padding) {
    case 'small':
      classes.push('py-12 tablet:py-16');
      break;
    case 'large':
      classes.push(LANDING_LAYOUT.sectionPaddingLarge);
      break;
    case 'medium':
    default:
      classes.push(LANDING_LAYOUT.sectionPadding);
      break;
  }

  // Background
  if (options?.background === 'muted') {
    classes.push('bg-[#1f1f1f]/50');
  } else {
    classes.push('bg-transparent');
  }

  // Border
  if (options?.border) {
    classes.push('border-t border-gray-700');
  }

  return classes.join(' ');
}

/**
 * Webapp-specific landing page style presets
 * Used to enhance webapp components with landing page visual styles
 * Note: Uses direct hex color values for Tailwind JIT compilation
 */
export const WEBAPP_LANDING_PRESETS = {
  header: {
    container: 'relative',
    title: `${LANDING_TYPOGRAPHY['3xl']} ${LANDING_FONT_WEIGHTS.bold} text-white tracking-tight`,
    subtitle: `${LANDING_TYPOGRAPHY.base} text-gray-400`,
    breadcrumb: `${LANDING_TYPOGRAPHY.sm} text-gray-400 transition-colors hover:text-[#29E7CD]`,
    breadcrumbActive: `${LANDING_TYPOGRAPHY.sm} text-[#29E7CD]`,
  },
  cta: {
    primary: `rounded-2xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] px-6 py-3 ${LANDING_TYPOGRAPHY.base} ${LANDING_FONT_WEIGHTS.semibold} text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:via-[#FF6B00]/80 hover:to-[#D925C7]/80 hover:shadow-xl hover:shadow-[#FF6B00]/25`,
    secondary: `rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 ${LANDING_TYPOGRAPHY.base} ${LANDING_FONT_WEIGHTS.semibold} text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl`,
    outline: `rounded-xl border border-[#29E7CD]/60 bg-gradient-to-br from-[#29E7CD]/10 via-[#FF6B00]/10 to-[#D925C7]/10 px-4 py-2.5 text-gray-300 transition-all duration-200 hover:border-[#FF6B00]/60 hover:from-[#29E7CD]/20 hover:via-[#FF6B00]/20 hover:to-[#D925C7]/20 hover:text-white hover:shadow-lg hover:shadow-[#FF6B00]/20`,
  },
  emptyState: {
    container: 'overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]',
    icon: 'mx-auto mb-4 h-16 w-16 text-gray-400',
    title: `${LANDING_TYPOGRAPHY.xl} ${LANDING_FONT_WEIGHTS.semibold} mb-2 text-white`,
    message: `${LANDING_TYPOGRAPHY.base} text-gray-400`,
    actionContainer: 'mt-6 flex flex-wrap justify-center gap-3',
  },
} as const;

/**
 * Webapp animation presets for subtle enhancements
 */
export const WEBAPP_ANIMATIONS = {
  header: {
    fadeIn: {
      duration: 0.3,
      delay: 0,
    },
  },
  cta: {
    hover: {
      scale: 1.05,
      duration: 0.2,
    },
    tap: {
      scale: 0.95,
      duration: 0.1,
    },
  },
  emptyState: {
    fadeUp: {
      duration: 0.4,
      delay: 0.1,
    },
  },
} as const;

/**
 * Get webapp header classes with optional landing page enhancements
 *
 * @param {Object} options - Header styling options
 * @param {boolean} [options.useLandingStyles=false] - Apply landing page typography and colors
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} Combined CSS classes
 */
export function getWebappHeaderClasses(options?: {
  useLandingStyles?: boolean;
  className?: string;
}): string {
  const classes: string[] = [WEBAPP_LANDING_PRESETS.header.container];

  if (options?.useLandingStyles) {
    // Add landing page enhancements
    classes.push('transition-all duration-200');
  }

  if (options?.className) {
    classes.push(options.className);
  }

  return classes.join(' ');
}

/**
 * Get webapp CTA button classes with optional landing page enhancements
 *
 * @param {Object} options - CTA styling options
 * @param {'primary' | 'secondary' | 'outline'} [options.variant='primary'] - Button variant
 * @param {boolean} [options.magnetic=false] - Enable magnetic effect (requires MagneticButton wrapper)
 * @param {boolean} [options.glow=false] - Enable glow effect on hover
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} Combined CSS classes
 */
export function getWebappCTAClasses(options?: {
  variant?: 'primary' | 'secondary' | 'outline';
  magnetic?: boolean;
  glow?: boolean;
  className?: string;
}): string {
  const variant = options?.variant || 'primary';
  const classes: string[] = [WEBAPP_LANDING_PRESETS.cta[variant]];

  if (options?.glow) {
    classes.push('hover:shadow-[#29E7CD]/25');
  }

  if (options?.className) {
    classes.push(options.className);
  }

  return classes.join(' ');
}

/**
 * Get webapp empty state classes with optional landing page enhancements
 *
 * @param {Object} options - Empty state styling options
 * @param {boolean} [options.useLandingStyles=true] - Apply landing page typography and colors
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} Combined CSS classes
 */
export function getWebappEmptyStateClasses(options?: {
  useLandingStyles?: boolean;
  className?: string;
}): string {
  const useLandingStyles = options?.useLandingStyles !== false; // Default to true
  const classes: string[] = [];

  if (useLandingStyles) {
    classes.push(WEBAPP_LANDING_PRESETS.emptyState.container);
  } else {
    // Material Design 3 fallback
    classes.push('overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]');
  }

  if (options?.className) {
    classes.push(options.className);
  }

  return classes.join(' ');
}
