/**
 * Critical CSS optimization utilities
 * Helps identify and inline critical CSS for above-the-fold content
 */

export interface CriticalCSSOptions {
  includeAboveFold?: boolean;
  includeFonts?: boolean;
  includeLayout?: boolean;
  includeComponents?: string[];
}

export class CriticalCSSOptimizer {
  private criticalCSS: string = '';
  private nonCriticalCSS: string = '';

  constructor() {
    this.extractCriticalCSS();
  }

  private extractCriticalCSS() {
    // Critical CSS for above-the-fold content
    this.criticalCSS = `
      /* Critical CSS for PrepFlow */
      
      /* Reset and base styles */
      *, *::before, *::after {
        box-sizing: border-box;
      }
      
      html {
        line-height: 1.15;
        -webkit-text-size-adjust: 100%;
      }
      
      body {
        margin: 0;
        font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #0a0a0a;
        color: #ffffff;
        overflow-x: hidden;
      }
      
      /* Critical layout styles */
      .min-h-screen {
        min-height: 100vh;
      }
      
      .flex {
        display: flex;
      }
      
      .flex-col {
        flex-direction: column;
      }
      
      .items-center {
        align-items: center;
      }
      
      .justify-center {
        justify-content: center;
      }
      
      .text-center {
        text-align: center;
      }
      
      /* Critical typography */
      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }
      
      .text-5xl {
        font-size: 3rem;
        line-height: 1;
      }
      
      .text-6xl {
        font-size: 3.75rem;
        line-height: 1;
      }
      
      .font-bold {
        font-weight: 700;
      }
      
      /* Critical colors */
      .text-white {
        color: #ffffff;
      }
      
      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }
      
      .from-\\[\\#29E7CD\\] {
        --tw-gradient-from: #29E7CD;
        --tw-gradient-to: rgba(41, 231, 205, 0);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      
      .to-\\[\\#D925C7\\] {
        --tw-gradient-to: #D925C7;
      }
      
      /* Critical spacing */
      .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .py-8 {
        padding-top: 2rem;
        padding-bottom: 2rem;
      }
      
      .py-16 {
        padding-top: 4rem;
        padding-bottom: 4rem;
      }
      
      .mb-4 {
        margin-bottom: 1rem;
      }
      
      .mb-8 {
        margin-bottom: 2rem;
      }
      
      /* Critical button styles */
      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }
      
      .rounded-2xl {
        border-radius: 1rem;
      }
      
      .px-8 {
        padding-left: 2rem;
        padding-right: 2rem;
      }
      
      .py-4 {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
      
      .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }
      
      .font-semibold {
        font-weight: 600;
      }
      
      /* Critical container styles */
      .max-w-7xl {
        max-width: 80rem;
      }
      
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
      
      /* Critical responsive styles */
      @media (max-width: 768px) {
        .text-4xl {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
        
        .text-5xl {
          font-size: 2.25rem;
          line-height: 2.5rem;
        }
        
        .text-6xl {
          font-size: 2.5rem;
          line-height: 2.75rem;
        }
        
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        .py-8 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }
        
        .py-16 {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
      }
      
      /* Critical animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out;
      }
      
      /* Critical loading states */
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `;

    // Non-critical CSS (can be loaded later)
    this.nonCriticalCSS = `
      /* Non-critical CSS for PrepFlow */
      
      /* Hover effects */
      .hover\\:scale-105:hover {
        transform: scale(1.05);
      }
      
      .hover\\:shadow-xl:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      
      /* Transitions */
      .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
      
      .duration-200 {
        transition-duration: 200ms;
      }
      
      /* Complex animations */
      @keyframes slideInFromLeft {
        from {
          opacity: 0;
          transform: translateX(-100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-slideInFromLeft {
        animation: slideInFromLeft 0.8s ease-out;
      }
      
      /* Advanced styling */
      .backdrop-blur {
        backdrop-filter: blur(8px);
      }
      
      .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      /* Non-critical responsive styles */
      @media (min-width: 1024px) {
        .lg\\:text-6xl {
          font-size: 3.75rem;
          line-height: 1;
        }
        
        .lg\\:px-16 {
          padding-left: 4rem;
          padding-right: 4rem;
        }
      }
    `;
  }

  public getCriticalCSS(): string {
    return this.criticalCSS;
  }

  public getNonCriticalCSS(): string {
    return this.nonCriticalCSS;
  }

  public injectCriticalCSS(): void {
    if (typeof document === 'undefined') return;

    // Check if critical CSS is already injected
    if (document.querySelector('#critical-css')) return;

    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = this.criticalCSS;
    document.head.appendChild(style);
  }

  public loadNonCriticalCSS(): void {
    if (typeof document === 'undefined') return;

    // Check if non-critical CSS is already loaded
    if (document.querySelector('#non-critical-css')) return;

    const style = document.createElement('style');
    style.id = 'non-critical-css';
    style.textContent = this.nonCriticalCSS;

    // Load after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild(style);
      });
    } else {
      document.head.appendChild(style);
    }
  }

  public optimizeCSSLoading(): void {
    // Inline critical CSS immediately
    this.injectCriticalCSS();

    // Load non-critical CSS after page load
    this.loadNonCriticalCSS();

    // Preload external CSS files
    this.preloadExternalCSS();
  }

  private preloadExternalCSS(): void {
    if (typeof document === 'undefined') return;

    // Preload external CSS files
    const externalCSS = [
      'https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap',
    ];

    externalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'style';
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }

  public getCSSMetrics(): { criticalSize: number; nonCriticalSize: number; totalSize: number } {
    return {
      criticalSize: this.criticalCSS.length,
      nonCriticalSize: this.nonCriticalCSS.length,
      totalSize: this.criticalCSS.length + this.nonCriticalCSS.length,
    };
  }
}

// Singleton instance
export const criticalCSSOptimizer = new CriticalCSSOptimizer();

// Utility functions
export const injectCriticalCSS = () => criticalCSSOptimizer.injectCriticalCSS();
export const loadNonCriticalCSS = () => criticalCSSOptimizer.loadNonCriticalCSS();
export const optimizeCSSLoading = () => criticalCSSOptimizer.optimizeCSSLoading();
export const getCSSMetrics = () => criticalCSSOptimizer.getCSSMetrics();
