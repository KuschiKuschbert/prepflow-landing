'use client';

import { useEffect, useState } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, triggerOnce = true, delay = 0, duration = 600 } = options;
  const [ref, isIntersecting] = useIntersectionObserver<T>({
    threshold,
    triggerOnce,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isIntersecting, hasAnimated, delay]);

  const shouldAnimate = hasAnimated || isIntersecting;
  const reduceMotion = prefersReducedMotion();
  const actualDuration = reduceMotion ? 0 : duration;

  return {
    ref,
    isIntersecting,
    shouldAnimate,
    animationStyle: reduceMotion
      ? {}
      : {
          transition: `opacity ${actualDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${actualDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
        },
  };
}
