import { useCallback } from 'react';

export function useNavigationActive(pathname: string) {
  // Memoize isActive to prevent hydration mismatches
  // During SSR, always return false for hash-based checks to ensure consistency
  const isActive = useCallback(
    (href: string) => {
      if (href === '/webapp') return pathname === '/webapp';
      // Handle hash URLs (e.g., /webapp/recipes#ingredients)
      if (href.includes('#')) {
        const [path, hash] = href.split('#');
        if (pathname === path) {
          // Only check hash on client side after mount to prevent hydration mismatch
          if (typeof window !== 'undefined' && window.location) {
            return window.location.hash === `#${hash}`;
          }
          // During SSR or before mount, return false for hash checks
          return false;
        }
        return pathname.startsWith(path);
      }
      return pathname.startsWith(href);
    },
    [pathname],
  );

  return isActive;
}
