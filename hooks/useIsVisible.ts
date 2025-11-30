import { useEffect, useRef, useState } from 'react';

interface UseIsVisibleOptions extends IntersectionObserverInit {}

/**
 * Hook to determine if an element is visible in the viewport.
 * Uses Intersection Observer API.
 *
 * @param {UseIsVisibleOptions} options - Intersection Observer options (e.g., `threshold`, `rootMargin`)
 * @returns {[React.RefObject<HTMLElement>, boolean]} A ref to attach to the element and a boolean indicating visibility
 */
export function useIsVisible<T extends HTMLElement = HTMLElement>(
  options?: UseIsVisibleOptions,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if element is already visible immediately (synchronous check first)
    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      // Element is visible if any part of it is in the viewport
      const isInViewport =
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < viewportHeight &&
        rect.left < viewportWidth;

      return isInViewport;
    };

    // Check synchronously first (element should be in DOM by now)
    if (checkVisibility()) {
      setIsVisible(true);
    }

    // Also check after a frame to catch any layout changes
    requestAnimationFrame(() => {
      if (checkVisibility()) {
        setIsVisible(true);
      }
    });

    // Use Intersection Observer for dynamic changes and more accurate detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? '0px',
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.rootMargin]); // Only re-run if threshold or rootMargin change

  return [ref, isVisible];
}
