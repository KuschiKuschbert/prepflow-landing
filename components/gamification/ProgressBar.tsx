/**
 * Progress Bar Component
 *
 * Reusable progress bar for displaying achievement progress, milestone progress, etc.
 * Follows Cyber Carrot Design System with subtle animations.
 */

'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  progress: number;

  /**
   * Optional label text
   */
  label?: string;

  /**
   * Optional show percentage text
   */
  showPercentage?: boolean;

  /**
   * Optional color variant
   */
  variant?: 'primary' | 'success' | 'warning' | 'info';

  /**
   * Optional size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Optional className for custom styling
   */
  className?: string;

  /**
   * Optional animated fill
   */
  animated?: boolean;
}

const variantColors = {
  primary: 'bg-gradient-to-r from-[var(--primary)] to-[#3B82F6]',
  success: 'bg-gradient-to-r from-[var(--primary)] to-[#10B981]',
  warning: 'bg-gradient-to-r from-[#FF6B00] to-[#F59E0B]',
  info: 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  progress,
  label,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
  className = '',
  animated = true,
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      // Animate progress fill
      const duration = 500; // 500ms animation
      const startTime = Date.now();
      const startProgress = displayProgress;
      const targetProgress = Math.max(0, Math.min(100, progress));

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        // Ease-out animation
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

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="text-[var(--foreground-secondary)]">{label}</span>}
          {showPercentage && (
            <span className="text-[var(--foreground-muted)]">{Math.round(displayProgress)}%</span>
          )}
        </div>
      )}
      <div className={`${sizeClasses[size]} w-full overflow-hidden rounded-full bg-[var(--muted)]`}>
        <div
          className={`${variantColors[variant]} h-full transition-all duration-300 ease-out`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
