/**
 * Tailwind CSS utility classes for consistent styling
 */

// Button styles
export const BUTTON_STYLES = {
  primary:
    'flex min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none',
  secondary:
    'flex min-h-[48px] items-center justify-center rounded-2xl bg-[#2a2a2a] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2a2a2a]/80 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none',
  ghost:
    'flex min-h-[48px] items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 hover:bg-[#2a2a2a]/50 hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none',
} as const;

// Card styles
export const CARD_STYLES = {
  default: 'rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg',
  elevated: 'rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl',
  subtle: 'rounded-2xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50',
} as const;

// Input styles
export const INPUT_STYLES = {
  default:
    'w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none',
  large:
    'w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-3 text-lg text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none',
} as const;

// Text styles
export const TEXT_STYLES = {
  heading: 'text-2xl font-bold text-white',
  subheading: 'text-lg font-semibold text-white',
  body: 'text-base text-gray-300',
  caption: 'text-sm text-gray-400',
  link: 'text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors',
} as const;

// Layout styles
export const LAYOUT_STYLES = {
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  section: 'py-16 sm:py-24',
  grid: 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3',
} as const;
