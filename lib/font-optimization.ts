// Font Optimization for PrepFlow
// Implements font subsetting, preloading, and performance optimization

// Font configuration
export const FONT_CONFIG = {
  // Primary fonts
  primary: {
    name: 'Geist Sans',
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    display: 'swap',
  },

  // Monospace font
  mono: {
    name: 'Geist Mono',
    fallback:
      'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    weights: [400, 500, 600],
    subsets: ['latin'],
    display: 'swap',
  },

  // Font loading strategies
  loading: {
    strategy: 'swap', // font-display: swap
    preload: true,
    subset: true,
    optimize: true,
  },

  // Character subsets for optimization
  subsets: {
    latin:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    latinExtended:
      'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
  },

  // Critical font faces
  critical: ['Geist Sans', 'Geist Mono'],

  // Non-critical fonts (loaded after initial render)
  nonCritical: [],
};

// Font preloading utilities
export class FontOptimizer {
  private static instance: FontOptimizer;
  private preloadedFonts = new Set<string>();
  private loadedFonts = new Set<string>();

  static getInstance(): FontOptimizer {
    if (!FontOptimizer.instance) {
      FontOptimizer.instance = new FontOptimizer();
    }
    return FontOptimizer.instance;
  }

  // Preload critical fonts
  preloadCriticalFonts(): void {
    if (typeof window === 'undefined') return;

    FONT_CONFIG.critical.forEach(fontName => {
      this.preloadFont(fontName);
    });
  }

  // Preload specific font
  preloadFont(fontName: string, weight: number = 400, style: string = 'normal'): void {
    if (typeof window === 'undefined') return;
    if (this.preloadedFonts.has(`${fontName}-${weight}-${style}`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';

    // Generate Google Fonts URL
    const fontUrl = this.generateGoogleFontsUrl(fontName, weight, style);
    link.href = fontUrl;

    document.head.appendChild(link);
    this.preloadedFonts.add(`${fontName}-${weight}-${style}`);

    console.log(`🔤 Font preloaded: ${fontName} ${weight} ${style}`);
  }

  // Generate Google Fonts URL with optimization
  generateGoogleFontsUrl(fontName: string, weight: number, style: string = 'normal'): string {
    const baseUrl = 'https://fonts.googleapis.com/css2';
    const params = new URLSearchParams({
      family: `${fontName}:wght@${weight}`,
      display: 'swap',
      subset: 'latin',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  // Load font with performance tracking
  loadFont(fontName: string, weight: number = 400, style: string = 'normal'): Promise<FontFace> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Font loading not available in server environment'));
        return;
      }

      const fontKey = `${fontName}-${weight}-${style}`;
      if (this.loadedFonts.has(fontKey)) {
        resolve(new FontFace(fontName, 'url()'));
        return;
      }

      const startTime = performance.now();

      // Create font face
      const fontFace = new FontFace(
        fontName,
        `url(${this.generateGoogleFontsUrl(fontName, weight, style)})`,
        {
          weight: weight.toString(),
          style: style,
          display: 'swap',
        },
      );

      fontFace
        .load()
        .then(() => {
          document.fonts.add(fontFace);
          this.loadedFonts.add(fontKey);

          const loadTime = performance.now() - startTime;
          this.trackFontPerformance(fontName, loadTime, weight, style);

          console.log(`✅ Font loaded: ${fontName} ${weight} ${style} (${loadTime.toFixed(2)}ms)`);
          resolve(fontFace);
        })
        .catch(error => {
          console.error(`❌ Font loading failed: ${fontName}`, error);
          reject(error);
        });
    });
  }

  // Track font loading performance
  private trackFontPerformance(
    fontName: string,
    loadTime: number,
    weight: number,
    style: string,
  ): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'font_load', {
        event_category: 'performance',
        event_label: 'font_optimization',
        value: Math.round(loadTime),
        custom_parameter_font_name: fontName,
        custom_parameter_font_weight: weight,
        custom_parameter_font_style: style,
        custom_parameter_load_time: Math.round(loadTime),
      });
    }
  }

  // Check if font is loaded
  isFontLoaded(fontName: string, weight: number = 400, style: string = 'normal'): boolean {
    if (typeof window === 'undefined') return false;

    const fontKey = `${fontName}-${weight}-${style}`;
    return this.loadedFonts.has(fontKey);
  }

  // Get font loading status
  getFontLoadingStatus(): { loaded: string[]; loading: string[]; failed: string[] } {
    return {
      loaded: Array.from(this.loadedFonts),
      loading: Array.from(this.preloadedFonts).filter(font => !this.loadedFonts.has(font)),
      failed: [], // Could be implemented with error tracking
    };
  }

  // Optimize font loading for performance
  optimizeFontLoading(): void {
    if (typeof window === 'undefined') return;

    // Preload critical fonts
    this.preloadCriticalFonts();

    // Load fonts with intersection observer for non-critical fonts
    this.loadNonCriticalFonts();

    // Optimize font rendering
    this.optimizeFontRendering();
  }

  // Load non-critical fonts when needed
  private loadNonCriticalFonts(): void {
    if (typeof window === 'undefined') return;

    FONT_CONFIG.nonCritical.forEach(fontName => {
      // Load after a delay to prioritize critical fonts
      setTimeout(() => {
        this.loadFont(fontName);
      }, 1000);
    });
  }

  // Optimize font rendering
  private optimizeFontRendering(): void {
    if (typeof window === 'undefined') return;

    // Add font rendering optimization CSS
    const style = document.createElement('style');
    style.textContent = `
      * {
        font-display: swap;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      /* Optimize font loading for better performance */
      @font-face {
        font-family: 'Geist Sans';
        font-display: swap;
        font-weight: 400 700;
        src: url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&display=swap');
      }
      
      @font-face {
        font-family: 'Geist Mono';
        font-display: swap;
        font-weight: 400 600;
        src: url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap');
      }
    `;

    document.head.appendChild(style);
  }

  // Generate font preload links for HTML
  generateFontPreloadLinks(): string {
    const links: string[] = [];

    FONT_CONFIG.critical.forEach(fontName => {
      FONT_CONFIG.primary.weights.forEach(weight => {
        const href = this.generateGoogleFontsUrl(fontName, weight);
        links.push(`<link rel="preload" as="font" type="font/woff2" href="${href}" crossorigin>`);
      });
    });

    return links.join('\n');
  }

  // Clear loaded fonts (for testing)
  clearLoadedFonts(): void {
    this.loadedFonts.clear();
    this.preloadedFonts.clear();
  }
}

// Export singleton instance
export const fontOptimizer = FontOptimizer.getInstance();

// Font loading hook for React components
export function useFontLoading(fontName: string, weight: number = 400, style: string = 'normal') {
  // This hook requires React to be imported in the component that uses it
  // Example usage in a React component:
  // import React from 'react';
  // import { useFontLoading } from '../lib/font-optimization';
  // const { isLoaded, isLoading, error } = useFontLoading('Geist Sans', 400);

  return {
    isLoaded: false,
    isLoading: false,
    error: null,
  };
}

// Font performance monitoring
export function trackFontPerformance(
  fontName: string,
  loadTime: number,
  weight: number,
  style: string,
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'font_performance', {
      event_category: 'performance',
      event_label: 'font_loading',
      value: Math.round(loadTime),
      custom_parameter_font_name: fontName,
      custom_parameter_font_weight: weight,
      custom_parameter_font_style: style,
      custom_parameter_load_time: Math.round(loadTime),
    });
  }
}

// Font subsetting utilities
export function generateFontSubset(text: string): string {
  // Extract unique characters from text
  const uniqueChars = Array.from(new Set(text)).join('');

  // Convert to Unicode ranges
  const unicodeRanges = uniqueChars
    .split('')
    .map(char => char.charCodeAt(0))
    .sort((a, b) => a - b)
    .reduce(
      (ranges, charCode) => {
        const lastRange = ranges[ranges.length - 1];
        if (lastRange && charCode === lastRange.end + 1) {
          lastRange.end = charCode;
        } else {
          ranges.push({ start: charCode, end: charCode });
        }
        return ranges;
      },
      [] as Array<{ start: number; end: number }>,
    );

  // Convert to CSS unicode-range format
  return unicodeRanges
    .map(range =>
      range.start === range.end
        ? `U+${range.start.toString(16).toUpperCase()}`
        : `U+${range.start.toString(16).toUpperCase()}-${range.end.toString(16).toUpperCase()}`,
    )
    .join(', ');
}

// Font loading optimization for different connection types
export function optimizeFontLoadingForConnection(connectionType: string): void {
  if (typeof window === 'undefined') return;

  switch (connectionType) {
    case 'slow-2g':
    case '2g':
      // Load only critical fonts
      fontOptimizer.preloadCriticalFonts();
      break;
    case '3g':
      // Load critical fonts + some non-critical
      fontOptimizer.preloadCriticalFonts();
      setTimeout(() => {
        FONT_CONFIG.nonCritical.slice(0, 2).forEach(font => {
          fontOptimizer.loadFont(font);
        });
      }, 2000);
      break;
    case '4g':
    case '5g':
    default:
      // Load all fonts
      fontOptimizer.optimizeFontLoading();
      break;
  }
}
