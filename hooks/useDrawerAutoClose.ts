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
  const touchStartYRef = useRef(0);
  const touchStartScrollTopRef = useRef(0);

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      lastScrollTopRef.current = 0;
      touchStartYRef.current = 0;
      touchStartScrollTopRef.current = 0;
      return;
    }

    const handleScroll = () => {
      if (!contentRef.current) return;
      lastScrollTopRef.current = contentRef.current.scrollTop;
    };

    // Detect upward scroll gesture when at top (wheel events)
    const handleWheel = (e: WheelEvent) => {
      if (!contentRef.current) return;
      const isAtTop = contentRef.current.scrollTop === 0;

      // User is scrolling up while at top - close drawer
      if (isAtTop && e.deltaY < 0) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          if (contentRef.current?.scrollTop === 0) {
            onClose();
          }
        }, 100);
      }
    };

    // Detect upward touch gesture when at top (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      if (!contentRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartScrollTopRef.current = contentRef.current.scrollTop;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!contentRef.current) return;
      const isAtTop = contentRef.current.scrollTop === 0;
      const touchY = e.touches[0].clientY;
      const touchDeltaY = touchStartYRef.current - touchY; // Positive when scrolling up

      // User is making upward touch gesture while at top - close drawer
      if (isAtTop && touchStartScrollTopRef.current === 0 && touchDeltaY > 30) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          if (contentRef.current?.scrollTop === 0) {
            onClose();
          }
        }, 100);
      }
    };

    const content = contentRef.current;
    content.addEventListener('scroll', handleScroll, { passive: true });
    content.addEventListener('wheel', handleWheel, { passive: true });
    content.addEventListener('touchstart', handleTouchStart, { passive: true });
    content.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      content.removeEventListener('scroll', handleScroll);
      content.removeEventListener('wheel', handleWheel);
      content.removeEventListener('touchstart', handleTouchStart);
      content.removeEventListener('touchmove', handleTouchMove);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isOpen, contentRef, onClose]);
}
