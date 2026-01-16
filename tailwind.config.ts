import type { Config } from 'tailwindcss';

/**
 * HARDCODED BREAKPOINT SYSTEM - DO NOT MODIFY
 *
 * This configuration OVERRIDES Tailwind's default breakpoints to enforce
 * our custom breakpoint system across the entire application.
 *
 * Standard Tailwind breakpoints (sm, md, lg) are DISABLED and will not work.
 * Only the custom breakpoints below are available.
 *
 * Breakpoint System:
 * - Base (Mobile): 0-480px (default styles, no prefix)
 * - tablet: 481px+ (small tablets and up)
 * - desktop: 1025px+ (desktop screens)
 * - large-desktop: 1440px+ (large desktop screens)
 * - xl: 1920px+ (extra-large desktop)
 * - 2xl: 2560px+ (ultra-wide screens)
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // OVERRIDE (not extend) to disable standard Tailwind breakpoints
    screens: {
      // Custom breakpoint system (HARDCODED - REQUIRED)
      // Mobile: default (base styles, max-width: 480px)
      // Tablet: 481px - 1024px
      tablet: '481px',
      // Desktop: 1025px - 1439px
      desktop: '1025px',
      // Large Desktop: 1440px - 1919px
      'large-desktop': '1440px',
      // Extra-Large Desktop: 1920px - 2559px
      xl: '1920px',
      // Ultra-Wide / 2XL: ≥ 2560px (full dashboard expansion tier)
      '2xl': '2560px',
      // Standard Tailwind breakpoints (sm, md, lg) are DISABLED
      // They will not work - use custom breakpoints above instead
    },
    extend: {
      colors: {
        landing: {
          primary: '#29E7CD', // Electric Cyan
          secondary: '#3B82F6', // Blue
          accent: '#D925C7', // Vibrant Magenta
          tertiary: '#FF6B00', // Cyber Orange
          muted: '#1f1f1f',
          border: '#2a2a2a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
