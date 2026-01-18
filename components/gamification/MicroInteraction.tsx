/**
 * Micro Interaction Component
 *
 * Brief success animations for small interactions.
 * Used for button clicks, form submissions, etc.
 */

'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface MicroInteractionProps {
  /**
   * Whether to show the interaction
   */
  show: boolean;

  /**
   * Optional message
   */
  message?: string;

  /**
   * Optional icon (defaults to Check)
   */
  icon?: React.ComponentType<{ className?: string }>;

  /**
   * Duration in milliseconds (default: 1500)
   */
  duration?: number;

  /**
   * Optional callback when interaction completes
   */
  onComplete?: () => void;
}

export function MicroInteraction({
  show,
  message,
  icon: IconComponent = Check,
  duration = 1500,
  onComplete,
}: MicroInteractionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="animate-in fade-in zoom-in-95 pointer-events-none fixed top-1/2 left-1/2 z-[70] -translate-x-1/2 -translate-y-1/2 duration-200">
      <div className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[#3B82F6] p-4 shadow-xl">
        {IconComponent && <IconComponent className="h-6 w-6 text-[var(--button-active-text)]" />}
      </div>
      {message && (
        <div className="mt-2 text-center text-sm font-medium text-[var(--button-active-text)]">
          {message}
        </div>
      )}
    </div>
  );
}
