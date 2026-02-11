import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useEffect, useState } from 'react';

/**
 * Hook for managing header visibility (auto-hide on mobile/tablet scroll)
 */
export function useHeaderVisibility() {
  const { direction, isAtTop } = useScrollDirection();
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Always show on desktop (1025px+)
    if (isDesktop) {
      setIsVisible(true);
      return;
    }

    // Auto-hide on mobile/tablet (< 1025px): show at top, hide on scroll down, show on scroll up
    if (isAtTop) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
    } else if (direction === 'up') {
      setIsVisible(true);
    }
  }, [direction, isAtTop, isDesktop]);

  return {
    isVisible,
    isDesktop,
    isScrolled: !isAtTop,
  };
}
