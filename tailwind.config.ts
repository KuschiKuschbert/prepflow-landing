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
      tablet: '481px',
      desktop: '1025px',
      'large-desktop': '1440px',
      xl: '1920px',
      '2xl': '2560px',
    },
    extend: {
      // Colors are now handled by @theme in globals.css
    },
  },
  plugins: [],
};

export default config;
