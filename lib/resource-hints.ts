// Resource Hints Implementation for PrepFlow
// Implements preload, prefetch, and preconnect optimization

// Resource hints configuration
export const RESOURCE_HINTS_CONFIG = {
  // Critical resources to preload
  critical: [
    {
      href: '/images/dashboard-screenshot.png',
      as: 'image',
      type: 'image/png',
      priority: 'high' as 'high' | 'low' | 'auto',
    },
    {
      href: '/images/prepflow-logo.png',
      as: 'image',
      type: 'image/png',
      priority: 'high' as 'high' | 'low' | 'auto',
    },
    {
      href: '/manifest.json',
      as: 'manifest',
      type: 'application/manifest+json',
      priority: 'high' as 'high' | 'low' | 'auto',
    },
  ],
  
  // Resources to prefetch
  prefetch: [
    {
      href: '/images/recipe-screenshot.png',
      as: 'image',
      type: 'image/png',
    },
    {
      href: '/images/settings-screenshot.png',
      as: 'image',
      type: 'image/png',
    },
    {
      href: '/images/stocklist-screenshot.png',
      as: 'image',
      type: 'image/png',
    },
  ],
  
  // External domains to preconnect
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-insights.com',
  ],
  
  // DNS prefetch domains
  dnsPrefetch: [
    'https://dulkrqgjfohsuxhsmofo.supabase.co',
    'https://api.stripe.com',
    'https://js.stripe.com',
  ],
  
  // Module preload for critical JavaScript
  modulePreload: [
    '/_next/static/chunks/vendors.js',
    '/_next/static/chunks/webpack.js',
    '/_next/static/chunks/main.js',
  ],
};

// Resource hints manager
export class ResourceHintsManager {
  private static instance: ResourceHintsManager;
  private loadedHints = new Set<string>();
  
  static getInstance(): ResourceHintsManager {
    if (!ResourceHintsManager.instance) {
      ResourceHintsManager.instance = new ResourceHintsManager();
    }
    return ResourceHintsManager.instance;
  }
  
  // Initialize all resource hints
  initializeResourceHints(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🔗 Initializing resource hints...');
    
    // Preconnect to external domains
    this.preconnectDomains();
    
    // DNS prefetch for external domains
    this.dnsPrefetchDomains();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Prefetch non-critical resources
    this.prefetchResources();
    
    // Module preload for critical JavaScript
    this.modulePreloadResources();
    
    console.log('✅ Resource hints initialized');
  }
  
  // Preconnect to external domains
  private preconnectDomains(): void {
    RESOURCE_HINTS_CONFIG.preconnect.forEach(domain => {
      this.preconnect(domain);
    });
  }
  
  // DNS prefetch for external domains
  private dnsPrefetchDomains(): void {
    RESOURCE_HINTS_CONFIG.dnsPrefetch.forEach(domain => {
      this.dnsPrefetch(domain);
    });
  }
  
  // Preload critical resources
  private preloadCriticalResources(): void {
    RESOURCE_HINTS_CONFIG.critical.forEach(resource => {
      this.preload(resource.href, resource.as, resource.type, resource.priority as 'high' | 'low' | 'auto');
    });
  }
  
  // Prefetch non-critical resources
  private prefetchResources(): void {
    // Load after a delay to prioritize critical resources
    setTimeout(() => {
      RESOURCE_HINTS_CONFIG.prefetch.forEach(resource => {
        this.prefetch(resource.href, resource.as, resource.type);
      });
    }, 1000);
  }
  
  // Module preload for critical JavaScript
  private modulePreloadResources(): void {
    RESOURCE_HINTS_CONFIG.modulePreload.forEach(module => {
      this.modulePreload(module);
    });
  }
  
  // Preconnect to a domain
  preconnect(href: string): void {
    if (typeof window === 'undefined') return;
    if (this.loadedHints.has(`preconnect-${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.loadedHints.add(`preconnect-${href}`);
    
    console.log(`🔗 Preconnected to: ${href}`);
  }
  
  // DNS prefetch for a domain
  dnsPrefetch(href: string): void {
    if (typeof window === 'undefined') return;
    if (this.loadedHints.has(`dns-prefetch-${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    
    document.head.appendChild(link);
    this.loadedHints.add(`dns-prefetch-${href}`);
    
    console.log(`🔗 DNS prefetched: ${href}`);
  }
  
  // Preload a resource
  preload(href: string, as: string, type?: string, priority: 'high' | 'low' | 'auto' = 'auto'): void {
    if (typeof window === 'undefined') return;
    if (this.loadedHints.has(`preload-${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (type) {
      link.type = type;
    }
    
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    } else if (priority === 'low') {
      link.setAttribute('fetchpriority', 'low');
    }
    
    // Add crossorigin for fonts and other cross-origin resources
    if (as === 'font' || href.startsWith('http')) {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
    this.loadedHints.add(`preload-${href}`);
    
    console.log(`🔗 Preloaded: ${href} (${as})`);
  }
  
  // Prefetch a resource
  prefetch(href: string, as: string, type?: string): void {
    if (typeof window === 'undefined') return;
    if (this.loadedHints.has(`prefetch-${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    
    if (type) {
      link.type = type;
    }
    
    document.head.appendChild(link);
    this.loadedHints.add(`prefetch-${href}`);
    
    console.log(`🔗 Prefetched: ${href} (${as})`);
  }
  
  // Module preload for JavaScript modules
  modulePreload(href: string): void {
    if (typeof window === 'undefined') return;
    if (this.loadedHints.has(`module-preload-${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    
    document.head.appendChild(link);
    this.loadedHints.add(`module-preload-${href}`);
    
    console.log(`🔗 Module preloaded: ${href}`);
  }
  
  // Preload font with optimization
  preloadFont(fontFamily: string, weight: number, style: string = 'normal'): void {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weight}&display=swap`;
    this.preload(fontUrl, 'style', 'text/css', 'high');
  }
  
  // Preload image with responsive hints
  preloadImage(src: string, sizes: string, priority: 'high' | 'low' | 'auto' = 'auto'): void {
    this.preload(src, 'image', undefined, priority);
    
    // Add responsive image hints
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.setAttribute('imagesizes', sizes);
    link.setAttribute('imagesrcset', this.generateImageSrcSet(src));
    
    document.head.appendChild(link);
  }
  
  // Generate responsive image srcset
  private generateImageSrcSet(src: string): string {
    const widths = [640, 750, 828, 1080, 1200, 1920];
    return widths
      .map(width => `${src}?w=${width} ${width}w`)
      .join(', ');
  }
  
  // Optimize resource hints based on connection
  optimizeForConnection(connectionType: string): void {
    if (typeof window === 'undefined') return;
    
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        // Only preload critical resources
        this.preloadCriticalResources();
        break;
      case '3g':
        // Preload critical + some prefetch
        this.preloadCriticalResources();
        setTimeout(() => {
          RESOURCE_HINTS_CONFIG.prefetch.slice(0, 2).forEach(resource => {
            this.prefetch(resource.href, resource.as, resource.type);
          });
        }, 2000);
        break;
      case '4g':
      case '5g':
      default:
        // Load all resource hints
        this.initializeResourceHints();
        break;
    }
  }
  
  // Get loaded hints status
  getLoadedHints(): string[] {
    return Array.from(this.loadedHints);
  }
  
  // Clear all hints (for testing)
  clearAllHints(): void {
    if (typeof window === 'undefined') return;
    
    const hints = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="preconnect"], link[rel="dns-prefetch"], link[rel="modulepreload"]');
    hints.forEach(hint => hint.remove());
    
    this.loadedHints.clear();
  }
  
  // Track resource hint performance
  trackResourceHintPerformance(hintType: string, resource: string, loadTime: number): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'resource_hint', {
        event_category: 'performance',
        event_label: 'resource_optimization',
        value: Math.round(loadTime),
        custom_parameter_hint_type: hintType,
        custom_parameter_resource: resource,
        custom_parameter_load_time: Math.round(loadTime),
      });
    }
  }
}

// Export singleton instance
export const resourceHintsManager = ResourceHintsManager.getInstance();

// Resource hints for specific pages
export function getPageResourceHints(pageType: 'landing' | 'webapp' | 'auth'): Array<{
  href: string;
  as: string;
  type?: string;
  priority: 'high' | 'low' | 'auto';
}> {
  const baseHints = RESOURCE_HINTS_CONFIG.critical;
  
  switch (pageType) {
    case 'landing':
      return [
        ...baseHints,
        {
          href: '/images/dashboard-screenshot.png',
          as: 'image',
          type: 'image/png',
          priority: 'high',
        },
        {
          href: '/sw.js',
          as: 'script',
          type: 'application/javascript',
          priority: 'high',
        },
      ];
    
    case 'webapp':
      return [
        ...baseHints,
        {
          href: '/webapp/ingredients',
          as: 'document',
          priority: 'low',
        },
        {
          href: '/webapp/recipes',
          as: 'document',
          priority: 'low',
        },
      ];
    
    case 'auth':
      return [
        ...baseHints,
        {
          href: '/auth/login',
          as: 'document',
          priority: 'low',
        },
        {
          href: '/auth/register',
          as: 'document',
          priority: 'low',
        },
      ];
    
    default:
      return baseHints;
  }
}

// Generate resource hints HTML
export function generateResourceHintsHTML(pageType: 'landing' | 'webapp' | 'auth'): string {
  const hints = getPageResourceHints(pageType);
  const preconnectDomains = RESOURCE_HINTS_CONFIG.preconnect;
  const dnsPrefetchDomains = RESOURCE_HINTS_CONFIG.dnsPrefetch;
  
  let html = '';
  
  // Preconnect domains
  preconnectDomains.forEach(domain => {
    html += `<link rel="preconnect" href="${domain}" crossorigin>\n`;
  });
  
  // DNS prefetch domains
  dnsPrefetchDomains.forEach(domain => {
    html += `<link rel="dns-prefetch" href="${domain}">\n`;
  });
  
  // Resource hints
  hints.forEach(hint => {
    html += `<link rel="preload" href="${hint.href}" as="${hint.as}"`;
    if (hint.type) html += ` type="${hint.type}"`;
    if (hint.priority === 'high') html += ' fetchpriority="high"';
    if (hint.priority === 'low') html += ' fetchpriority="low"';
    html += '>\n';
  });
  
  return html;
}

// Performance monitoring for resource hints
export function trackResourceHintPerformance(hintType: string, resource: string, loadTime: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'resource_hint_performance', {
      event_category: 'performance',
      event_label: 'resource_optimization',
      value: Math.round(loadTime),
      custom_parameter_hint_type: hintType,
      custom_parameter_resource: resource,
      custom_parameter_load_time: Math.round(loadTime),
    });
  }
}
