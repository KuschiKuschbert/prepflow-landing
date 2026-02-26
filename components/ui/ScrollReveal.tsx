'use client';

import { type Variants, motion, useInView, useReducedMotion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right';
  delay?: number;
  duration?: number;
  offset?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 0.5,
  offset = 0.2,
  once = true,
}) => {
  const ref = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once,
    amount: offset,
    margin: '0px 0px -100px 0px',
  });

  // Prevent hydration mismatch: useInView can differ between server (false) and client (true for above-fold).
  // Gate animation until after mount so server and initial client render both use "hidden".
  useEffect(() => setHasMounted(true), []);

  const variants: Record<string, Variants> = {
    'fade-up': {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    'fade-in': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'scale-up': {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    'slide-left': {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    'slide-right': {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },
  };

  // Simplified variants for reduced motion
  const reducedVariants: Record<string, Variants> = {
    'fade-up': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'fade-in': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'scale-up': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'slide-left': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'slide-right': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  };

  const activeVariants = reducedMotion ? reducedVariants : variants;

  const animateTo = hasMounted && isInView ? 'visible' : 'hidden';

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animateTo}
      variants={activeVariants[variant]}
      transition={{
        duration: reducedMotion ? 0.2 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
