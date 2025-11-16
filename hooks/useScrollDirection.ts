'use client';

import { useEffect, useState } from 'react';

interface UseScrollDirectionReturn {
  direction: 'up' | 'down' | null;
  isAtTop: boolean;
}

/**
 * Hook to track scroll direction and position
 * Used for auto-hiding navigation elements
 */
export function useScrollDirection(): UseScrollDirectionReturn {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Check if at top
      setIsAtTop(scrollY <= 10);

      // Determine direction
      if (Math.abs(scrollY - lastScrollY) < 5) {
        // Ignore small movements to prevent jitter
        ticking = false;
        return;
      }

      if (scrollY > lastScrollY && scrollY > 10) {
        setDirection('down');
      } else if (scrollY < lastScrollY) {
        setDirection('up');
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Initial check
    setIsAtTop(window.scrollY <= 10);
    setLastScrollY(window.scrollY);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollY]);

  return { direction, isAtTop };
}
