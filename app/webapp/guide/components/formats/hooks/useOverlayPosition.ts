import { useCallback, useEffect, useRef, useState } from 'react';

export function useOverlayPosition(targetSelector: string) {
  const [highlighted, setHighlighted] = useState(false);
  const [elementFound, setElementFound] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const updatePositionRef = useRef<(() => void) | null>(null);

  const updateOverlayPosition = useCallback(() => {
    const element = document.querySelector(targetSelector);
    const overlay = overlayRef.current;

    if (!element || !overlay) {
      setElementFound(false);
      setHighlighted(false);
      return;
    }

    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Position overlay over the target element
    overlay.style.position = 'absolute';
    overlay.style.left = `${rect.left + scrollX}px`;
    overlay.style.top = `${rect.top + scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    setElementFound(true);
    setHighlighted(true);
  }, [targetSelector]);

  useEffect(() => {
    updatePositionRef.current = updateOverlayPosition;
    updateOverlayPosition();

    // Update position on scroll and resize
    const handleUpdate = () => {
      updateOverlayPosition();
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    // Use IntersectionObserver to detect when element is visible
    const element = document.querySelector(targetSelector);
    let observer: IntersectionObserver | null = null;

    if (element) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              handleUpdate();
            }
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(element);
    }

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      if (observer) observer.disconnect();
    };
  }, [targetSelector, updateOverlayPosition]);

  return { overlayRef, highlighted, elementFound };
}
