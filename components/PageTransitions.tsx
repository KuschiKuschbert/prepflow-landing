// PrepFlow Personality System - Page Transitions (knife slice effect)

'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/personality/utils';

interface PageTransitionsProps {
  children: ReactNode;
}

export function PageTransitions({ children }: PageTransitionsProps) {
  const pathname = usePathname();
  const shouldReduceMotion = prefersReducedMotion();

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
}
