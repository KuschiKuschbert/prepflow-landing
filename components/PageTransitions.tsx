// PrepFlow Personality System - Page Transitions (knife slice effect)

'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/personality/utils';

interface PageTransitionsProps {
  children: ReactNode;
}

// Lazy load framer-motion to reduce initial bundle size
const PageTransitionsContent = dynamic(
  () =>
    import('framer-motion').then(mod => ({
      default: function PageTransitionsContent({ children }: PageTransitionsProps) {
        const pathname = usePathname();
        const shouldReduceMotion = prefersReducedMotion();
        const { AnimatePresence, motion } = mod;

        if (shouldReduceMotion) {
          return <>{children}</>;
        }

        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        );
      },
    })),
  {
    ssr: false,
    loading: () => <>{/* No loading state - transitions are non-critical */}</>,
  },
);

export function PageTransitions({ children }: PageTransitionsProps) {
  const shouldReduceMotion = prefersReducedMotion();

  // Skip transitions entirely if reduced motion is preferred
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return <PageTransitionsContent>{children}</PageTransitionsContent>;
}
