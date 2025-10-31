import { useState, useEffect, useRef } from 'react';

/**
 * Smart loading hook that prevents skeleton flash during rapid navigation
 * Only shows loading state if the component stays mounted for a minimum duration
 */
export function useSmartLoading(initialLoading = false, minLoadingDelay = 100) {
  const [loading, setLoading] = useState(initialLoading);
  const [isMounted, setIsMounted] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedTimeRef = useRef<number>(0);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setIsMounted(true);
      mountedTimeRef.current = Date.now();
    }, 0);

    return () => {
      setIsMounted(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const setSmartLoading = (newLoading: boolean) => {
    if (!isMounted) return;

    if (newLoading) {
      // Only show loading if component has been mounted for minimum time
      const timeSinceMount = Date.now() - mountedTimeRef.current;
      if (timeSinceMount >= minLoadingDelay) {
        setLoading(true);
      } else {
        // Delay showing loading state
        loadingTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            setLoading(true);
          }
        }, minLoadingDelay - timeSinceMount);
      }
    } else {
      // Clear any pending loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setLoading(false);
    }
  };

  return [loading, setSmartLoading] as const;
}
