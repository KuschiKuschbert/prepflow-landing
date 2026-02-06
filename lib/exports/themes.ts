/**
 * Export Theme Definitions
 * Defines aesthetic themes for PDF exports
 */

export type ExportTheme = 'cyber-carrot' | 'electric-lemon' | 'phantom-pepper' | 'cosmic-blueberry';

export interface ThemeConfig {
  name: string;
  label: string;
  description: string;
  cssVariables: Record<string, string>;
}

export const themes: Record<ExportTheme, ThemeConfig> = {
  'cyber-carrot': {
    name: 'cyber-carrot',
    label: 'Cyber Carrot',
    description: 'Signature PrepFlow style. High contrast, neon accents, tech-forward.',
    cssVariables: {
      '--pf-color-primary': '#29E7CD', // Neon Teal
      '--pf-color-secondary': '#d925c7', // Magenta Pulse (PrepFlow Brand)
      '--pf-color-text-main': '#E8E8E8', // Light text for dark BG
      '--pf-color-text-muted': '#A1A1AA',
      '--pf-color-border': '#3F3F46',
      '--pf-color-bg-header': '#18181B', // Darker header
      '--pf-color-text-header': '#29E7CD', // Teal Header Text
      '--pf-color-accent': '#d925c7', // Magenta Accent
      '--pf-font-family-header': "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
      '--pf-font-family-body': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      '--pf-border-radius': '16px',
      '--pf-border-width': '1px',
      '--pf-header-style': 'solid', // solid
      '--pf-color-bg-page': '#09090b', // Deep dark background
      '--pf-color-bg-content': 'rgba(24, 24, 27, 0.85)', // Card background (85% opacity)
      '--pf-shadow-content': '0 0 40px rgba(41, 231, 205, 0.1)', // Teal glow
      '--pf-logo-filter': 'none', // Original logo colors
      '--pf-logo-mix-blend': 'normal',
    },
  },
  'electric-lemon': {
    name: 'electric-lemon',
    label: 'Electric Lemon',
    description: 'CurbOS inspired. Industrial dark mode with high-voltage yellow.',
    cssVariables: {
      '--pf-color-primary': '#FACC15', // High-vis Yellow
      '--pf-color-secondary': '#FFFFFF',
      '--pf-color-text-main': '#FFFFFF',
      '--pf-color-text-muted': '#A1A1AA',
      '--pf-color-border': '#27272A',
      '--pf-color-bg-header': '#000000',
      '--pf-color-text-header': '#FACC15',
      '--pf-color-accent': '#FACC15',
      '--pf-font-family-header': "'JetBrains Mono', 'Courier New', monospace", // Technical/Industrial
      '--pf-font-family-body': "'Inter', sans-serif",
      '--pf-border-radius': '0px',
      '--pf-border-width': '1px',
      '--pf-header-style': 'solid',
      '--pf-color-bg-page': '#000000', // Pitch black
      '--pf-color-bg-content': 'rgba(9, 9, 11, 0.85)', // Zin-950 (85% opacity)
      '--pf-shadow-content': '4px 4px 0px #FACC15', // Hard yellow shadow
      '--pf-logo-filter': 'none', // Original logo colors
      '--pf-logo-mix-blend': 'normal',
    },
  },
  'phantom-pepper': {
    name: 'phantom-pepper',
    label: 'Phantom Pepper',
    description: 'Minimalist stealth. High-contrast monochrome with ghost-white undertones.',
    cssVariables: {
      '--pf-color-primary': '#18181B', // Zinc-900
      '--pf-color-secondary': '#F4F4F5', // Zinc-100
      '--pf-color-text-main': '#18181B',
      '--pf-color-text-muted': '#52525B', // Zinc-600
      '--pf-color-border': '#E4E4E7', // Zinc-200
      '--pf-color-bg-header': '#FFFFFF',
      '--pf-color-text-header': '#18181B',
      '--pf-color-accent': '#18181B',
      '--pf-font-family-header': "'Inter', sans-serif",
      '--pf-font-family-body': "'Inter', sans-serif",
      '--pf-border-radius': '6px',
      '--pf-border-width': '1px',
      '--pf-header-style': 'border-bottom',
      '--pf-color-bg-page': '#FFFFFF',
      '--pf-color-bg-content': 'rgba(255, 255, 255, 0.82)', // (82% opacity)
      '--pf-shadow-content': 'none',
      '--pf-logo-filter': 'invert(1)', // Invert colors: Black BG -> White, White Text -> Black
      '--pf-logo-mix-blend': 'multiply', // Knock out white background if present
    },
  },
  'cosmic-blueberry': {
    name: 'cosmic-blueberry',
    label: 'Cosmic Blueberry',
    description: 'Futuristic premium. Deep space purple with starlight accents.',
    cssVariables: {
      '--pf-color-primary': '#4C1D95', // Violet-900
      '--pf-color-secondary': '#0F172A', // Slate-900
      '--pf-color-text-main': '#F8FAFC', // Slate-50
      '--pf-color-text-muted': '#94A3B8', // Slate-400
      '--pf-color-border': '#334155', // Slate-700
      '--pf-color-bg-header': '#4C1D95',
      '--pf-color-text-header': '#FFFFFF',
      '--pf-color-accent': '#C084FC', // Violet-400 (Starlight)
      '--pf-font-family-header': "'Exo 2', sans-serif", // Sci-fi feel
      '--pf-font-family-body': "'Inter', sans-serif",
      '--pf-border-radius': '24px', // Smooth curves
      '--pf-border-width': '0px',
      '--pf-header-style': 'solid',
      '--pf-color-bg-page': '#0F172A', // Deep space
      '--pf-color-bg-content': 'rgba(30, 41, 59, 0.75)', // Slate-800 (75% opacity)
      '--pf-shadow-content': '0 0 50px rgba(139, 92, 246, 0.15)', // Purple glow
      '--pf-logo-filter': 'none', // Original logo colors
      '--pf-logo-mix-blend': 'normal',
    },
  },
};

export function getThemeCSS(theme: ExportTheme = 'cyber-carrot'): string {
  const config = themes[theme] || themes['cyber-carrot'];

  return `
    :root {
      ${Object.entries(config.cssVariables)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n      ')}
    }
  `;
}
