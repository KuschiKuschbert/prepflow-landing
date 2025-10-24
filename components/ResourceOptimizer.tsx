'use client';

import { useEffect } from 'react';
import { CSSOptimizer } from '@/lib/css-optimization';

/**
 * ResourceOptimizer - Prevents unused resource preload warnings
 *
 * This component optimizes resource loading by:
 * 1. Removing unused preload links
 * 2. Adding proper preload hints for critical resources
 * 3. Managing resource loading timing
 * 4. Using sophisticated CSS optimization strategies
 */
export default function ResourceOptimizer() {
  useEffect(() => {
    // Only run in production to avoid development interference
    if (process.env.NODE_ENV !== 'production') return;

    const optimizer = CSSOptimizer.getInstance();

    // Initialize the CSS optimizer
    optimizer.initialize();

    // Track CSS resources as they're loaded
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'LINK') {
                const link = element as HTMLLinkElement;
                const href = link.href;

                if (link.rel === 'stylesheet' && href) {
                  // Mark CSS as used when stylesheet is loaded
                  optimizer.markAsUsed(href);
                } else if (link.rel === 'preload' && link.as === 'style' && href) {
                  // Register preloaded CSS resources
                  optimizer.registerResource(href, href.includes('layout.css'));
                }
              }
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      observer.disconnect();
      optimizer.destroy();
    };
  }, []);

  return null; // This component doesn't render anything
}
