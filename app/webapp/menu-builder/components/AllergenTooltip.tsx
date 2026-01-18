/**
 * Allergen Tooltip Component
 * Simple hover tooltip for allergen information
 */

'use client';

import { useState, useRef } from 'react';
import { getAllergen } from '@/lib/allergens/australian-allergens';

interface AllergenTooltipProps {
  allergenCode: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function AllergenTooltip({
  allergenCode,
  children,
  position = 'top',
}: AllergenTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const allergen = getAllergen(allergenCode);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--surface)] border-l-transparent border-r-transparent border-b-transparent',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--surface)] border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--surface)] border-t-transparent border-r-transparent border-b-transparent',
    right:
      'right-full top-1/2 -translate-y-1/2 border-r-[var(--surface)] border-t-transparent border-l-transparent border-b-transparent',
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        {children}
      </div>

      {isVisible && allergen && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="mb-1 text-sm font-semibold text-[var(--foreground)]">
            {allergen.displayName}
          </div>
          <div className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
            {allergen.description}
          </div>
          <div className={`absolute h-0 w-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}
