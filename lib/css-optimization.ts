import { logger } from '@/lib/logger';

export interface CSSResource {
  href: string;
  isCritical: boolean;
  isUsed: boolean;
}

export class CSSOptimizer {
  private static instance: CSSOptimizer;
  private resources: Map<string, CSSResource> = new Map();
  private cleanupTimers: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): CSSOptimizer {
    if (!CSSOptimizer.instance) {
      CSSOptimizer.instance = new CSSOptimizer();
    }
    return CSSOptimizer.instance;
  }

  registerResource(href: string, isCritical: boolean = false): void {
    this.resources.set(href, {
      href,
      isCritical,
      isUsed: false,
    });
  }

  markAsUsed(href: string): void {
    const resource = this.resources.get(href);
    if (resource) {
      resource.isUsed = true;
    }
  }

  cleanupUnusedPreloads(): void {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');

    preloadLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const resource = this.resources.get(href);
      const isStylesheetLoaded = document.querySelector(`link[href="${href}"][rel="stylesheet"]`);

      if (!resource?.isCritical && !resource?.isUsed && !isStylesheetLoaded) {
        const timer = setTimeout(() => {
          const stillUnused = !document.querySelector(`link[href="${href}"][rel="stylesheet"]`);
          if (stillUnused) {
            link.remove();
            logger.dev('🗑️ Removed unused CSS preload:', href);
          }
        }, 2000);
        this.cleanupTimers.set(href, timer);
      }
    });
  }

  addCriticalPreloads(): void {
    const criticalResources = [
      '/_next/static/css/app/layout.css',
      '/_next/static/css/app/webapp/layout.css',
    ];

    criticalResources.forEach(resource => {
      const existingPreload = document.querySelector(`link[href="${resource}"][rel="preload"]`);
      const existingStylesheet = document.querySelector(
        `link[href="${resource}"][rel="stylesheet"]`,
      );

      if (!existingPreload && !existingStylesheet) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = resource;
        preloadLink.as = 'style';
        preloadLink.crossOrigin = 'anonymous';
        document.head.appendChild(preloadLink);

        this.registerResource(resource, true);
        logger.dev('✅ Added critical CSS preload:', resource);
      }
    });
  }

  initialize(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.addCriticalPreloads();
        this.cleanupUnusedPreloads();
      });
    } else {
      this.addCriticalPreloads();
      this.cleanupUnusedPreloads();
    }
    setInterval(() => this.cleanupUnusedPreloads(), 5000);
  }

  destroy(): void {
    this.cleanupTimers.forEach(timer => {
      clearTimeout(timer);
    });
    this.cleanupTimers.clear();
    this.resources.clear();
  }
}

export function useCSSOptimization() {
  const optimizer = CSSOptimizer.getInstance();

  return {
    registerResource: optimizer.registerResource.bind(optimizer),
    markAsUsed: optimizer.markAsUsed.bind(optimizer),
    cleanupUnusedPreloads: optimizer.cleanupUnusedPreloads.bind(optimizer),
  };
}
