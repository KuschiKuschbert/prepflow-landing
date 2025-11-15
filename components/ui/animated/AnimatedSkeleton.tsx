/**
 * Animated Loading Skeleton
 */

'use client';

interface AnimatedSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'rect';
  className?: string;
}

export function AnimatedSkeleton({
  variant = 'card',
  className = '',
}: AnimatedSkeletonProps) {
  const variants = {
    card: 'h-32 rounded-2xl',
    text: 'h-4 rounded',
    circle: 'w-12 h-12 rounded-full',
    rect: 'h-20 rounded-xl',
  };

  return <div className={`animate-shimmer bg-[#2a2a2a] ${variants[variant]} ${className} `} />;
}
