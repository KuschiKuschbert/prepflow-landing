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
  const hasScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      hasScrolledRef.current = false;
      return;
    }

    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop } = contentRef.current;

      // Track if user has scrolled down
      if (scrollTop > 10) {
        hasScrolledRef.current = true;
      }

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Auto-close when scrolled back to top (with small delay to prevent accidental closes)
      if (hasScrolledRef.current && scrollTop === 0) {
        scrollTimeoutRef.current = setTimeout(() => {
          if (contentRef.current?.scrollTop === 0) {
            onClose();
          }
        }, 100);
      }
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
