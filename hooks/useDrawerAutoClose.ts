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
  const hasScrolledDownRef = useRef(false);
  const scrollToTopCountRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);
  const wasAtTopRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      hasScrolledDownRef.current = false;
      scrollToTopCountRef.current = 0;
      lastScrollTopRef.current = 0;
      wasAtTopRef.current = false;
      return;
    }

    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop } = contentRef.current;
      const isAtTop = scrollTop === 0;

      // Track if user has scrolled down (more than 10px from top)
      if (scrollTop > 10) {
        hasScrolledDownRef.current = true;
        wasAtTopRef.current = false;
      }

      // Detect when user reaches top after scrolling down
      // Only increment counter once per "scroll to top" event
      if (
        hasScrolledDownRef.current &&
        isAtTop &&
        !wasAtTopRef.current &&
        lastScrollTopRef.current > 0
      ) {
        scrollToTopCountRef.current += 1;
        wasAtTopRef.current = true;
      }

      // Reset counter when user scrolls down again (after being at top)
      if (scrollTop > 10 && wasAtTopRef.current) {
        wasAtTopRef.current = false;
      }

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Auto-close on second scroll to top (with small delay to prevent accidental closes)
      if (hasScrolledDownRef.current && isAtTop && scrollToTopCountRef.current >= 2) {
        scrollTimeoutRef.current = setTimeout(() => {
          if (contentRef.current?.scrollTop === 0) {
            onClose();
          }
        }, 100);
      }

      lastScrollTopRef.current = scrollTop;
    };

    const content = contentRef.current;
    content.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      content.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isOpen, contentRef, onClose]);
}
