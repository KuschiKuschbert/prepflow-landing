/**
 * Modern Animation System for PrepFlow
 * Subtle, performant animations that enhance UX without being distracting
 */

'use client';

import { useEffect, useState, useRef } from 'react';

// Animation variants for different components
export const animationVariants = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Card hover effects
  cardHover: {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    tap: { scale: 0.98 },
  },

  // Button interactions
  buttonPress: {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2 },
  },

  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },

  // Loading states
  loading: {
    animate: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    },
  },

  // Stagger animations for lists
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Custom hook for intersection observer animations
export function useIntersectionAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible] as const;
}

// Smooth scroll utility
export function smoothScrollTo(element: HTMLElement, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

// Animation classes for Tailwind
export const animationClasses = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeInLeft: 'animate-fade-in-left',
  fadeInRight: 'animate-fade-in-right',

  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',

  // Slide animations
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',

  // Bounce animations
  bounce: 'animate-bounce',
  bounceIn: 'animate-bounce-in',

  // Pulse animations
  pulse: 'animate-pulse',
  pulseSlow: 'animate-pulse-slow',

  // Rotate animations
  rotate: 'animate-spin',
  rotateSlow: 'animate-spin-slow',

  // Hover effects
  hoverLift: 'hover:animate-lift',
  hoverScale: 'hover:animate-scale',
  hoverGlow: 'hover:animate-glow',

  // Loading states
  loading: 'animate-loading',
  shimmer: 'animate-shimmer',
};

// Performance-optimized animation component
export function AnimatedDiv({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration = 300,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  animation?: keyof typeof animationClasses;
  delay?: number;
  duration?: number;
  [key: string]: any;
}) {
  const [ref, isVisible] = useIntersectionAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-${duration} ease-out ${isVisible ? animationClasses[animation] : 'opacity-0'} ${className} `}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Staggered animation wrapper
export function StaggeredContainer({
  children,
  className = '',
  staggerDelay = 100,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const [ref, isVisible] = useIntersectionAnimation();

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className={`transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
          style={{
            transitionDelay: `${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Loading spinner with smooth animation
export function LoadingSpinner({
  size = 'md',
  color = 'primary',
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-[#29E7CD]',
    secondary: 'text-[#3B82F6]',
    white: 'text-white',
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]}`}>
      <svg
        className="animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// Shimmer effect for loading states
export function ShimmerEffect({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`}
    />
  );
}

// Floating animation for special elements
export function FloatingElement({
  children,
  intensity = 'subtle',
}: {
  children: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
}) {
  const intensityClasses = {
    subtle: 'animate-float-subtle',
    medium: 'animate-float-medium',
    strong: 'animate-float-strong',
  };

  return <div className={intensityClasses[intensity]}>{children}</div>;
}

export default {
  animationVariants,
  animationClasses,
  useIntersectionAnimation,
  smoothScrollTo,
  AnimatedDiv,
  StaggeredContainer,
  LoadingSpinner,
  ShimmerEffect,
  FloatingElement,
};
