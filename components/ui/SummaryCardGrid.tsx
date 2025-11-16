'use client';

import React from 'react';

interface SummaryCardGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * SummaryCardGrid - Standardized grid for summary cards across all breakpoints
 *
 * Grid layout:
 * - Mobile (<1024px): 1 column
 * - Desktop (≥1024px): 3 columns
 * - Large Desktop (≥1440px): 6 columns
 * - XL (≥1920px): 8 columns
 * - 2XL (≥2560px): 8 columns
 */
export function SummaryCardGrid({ children, className = '', gap = 'md' }: SummaryCardGridProps) {
  const gapClasses = {
    sm: 'gap-2 tablet:gap-2 desktop:gap-3 large-desktop:gap-3 xl:gap-4 2xl:gap-4',
    md: 'gap-4 tablet:gap-4 desktop:gap-6 large-desktop:gap-6 xl:gap-8 2xl:gap-8',
    lg: 'gap-6 tablet:gap-6 desktop:gap-8 large-desktop:gap-8 xl:gap-10 2xl:gap-10',
  };

  return (
    <div
      className={`tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-6 grid grid-cols-1 xl:grid-cols-8 2xl:grid-cols-8 ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}
