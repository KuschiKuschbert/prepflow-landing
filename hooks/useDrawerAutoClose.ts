import { useEffect, useRef } from 'react';

interface UseDrawerAutoCloseOptions {
  isOpen: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function useDrawerAutoClose({
  isOpen,
  contentRef,
  onClose,
}: UseDrawerAutoCloseOptions): void {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      lastScrollTopRef.current = 0;
      return;
    }

    // Detect upward scroll gesture when at top (wheel events for desktop)
    // Touch events are handled by useDrawerSwipe hook to avoid conflicts
    const handleWheel = (e: WheelEvent) => {
      if (!contentRef.current) return;
      const isAtTop = contentRef.current.scrollTop === 0;

      // User is scrolling up while at top - close drawer immediately
      if (isAtTop && e.deltaY < 0) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        onClose();
      }
    };

    // Track scroll position for potential upward scroll detection
    const handleScroll = () => {
      if (!contentRef.current) return;
      lastScrollTopRef.current = contentRef.current.scrollTop;
    };

    const content = contentRef.current;
    content.addEventListener('wheel', handleWheel, { passive: true });
    content.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      content.removeEventListener('wheel', handleWheel);
      content.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isOpen, contentRef, onClose]);
}
