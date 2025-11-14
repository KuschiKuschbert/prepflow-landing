import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Custom breakpoint system (Final - Required)
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
      },
    },
  },
  plugins: [],
};

export default config;
