/**
 * Progress Ring Component
 *
 * Small circular progress indicator for compact spaces.
 * Used in navbar badges, achievement cards, etc.
 */

'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  /**
   * Current progress value (0-100)
   */
  progress: number;

  /**
   * Size of the ring (diameter in pixels)
   */
  size?: number;

  /**
   * Stroke width
   */
  strokeWidth?: number;

  /**
   * Optional color variant
   */
  variant?: 'primary' | 'success' | 'warning' | 'info';

  /**
   * Optional className
   */
  className?: string;

  /**
   * Optional animated fill
   */
  animated?: boolean;
}

const variantColors = {
  primary: '#29E7CD',
  success: '#10B981',
  warning: '#FF6B00',
  info: '#3B82F6',
};

export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 3,
  variant = 'primary',
  className = '',
  animated = true,
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const duration = 500;
      const startTime = Date.now();
      const startProgress = displayProgress;
      const targetProgress = Math.max(0, Math.min(100, progress));

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = startProgress + (targetProgress - startProgress) * eased;
        setDisplayProgress(current);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayProgress(targetProgress);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayProgress(Math.max(0, Math.min(100, progress)));
    }
  }, [progress, animated, displayProgress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
    </div>
  );
}
