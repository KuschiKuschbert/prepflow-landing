'use client';

import React from 'react';

interface MobileSectionDividerProps {
  className?: string;
  showOnDesktop?: boolean;
}

/**
 * MobileSectionDivider - Visual divider for mobile layouts
 * Hidden on desktop by default, can be shown with showOnDesktop prop
 * Consistent styling with Material Design 3
 */
export function MobileSectionDivider({
  className = '',
  showOnDesktop = false,
}: MobileSectionDividerProps) {
  const visibilityClass = showOnDesktop ? 'block' : 'block tablet:hidden';

  return (
    <div
      className={`${visibilityClass} tablet:my-6 my-4 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent ${className}`}
      aria-hidden="true"
    />
  );
}
