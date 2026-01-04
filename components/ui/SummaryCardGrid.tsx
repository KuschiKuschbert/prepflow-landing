'use client';

import React from 'react';

interface SummaryCardGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * SummaryCardGrid - Standardized grid for summary cards with dynamic column widths
 *
 * Grid layout uses auto-fit with minmax() to dynamically expand columns:
 * Updated to support 3 columns at tablet (481px+) - modern industry standard (2024-2025)
 * - Mobile: min 280px per card (fits mobile screens with proper padding)
 * - Tablet: min ~320px per card (supports 3 columns at 481px+)
 * - Desktop: min ~300px per card (supports 4 columns at 1025px+)
 * - Large Desktop: min 380px per card (allows more columns while maintaining width)
 * - XL/2XL: min 380px per card
 *
 * Columns automatically expand to fill available width while maintaining minimum sizes.
 */
export function SummaryCardGrid({ children, className = '', gap = 'md' }: SummaryCardGridProps) {
  const gapClasses = {
    sm: 'gap-2 tablet:gap-2 desktop:gap-3 large-desktop:gap-3 xl:gap-4 2xl:gap-4',
    md: 'gap-4 tablet:gap-4 desktop:gap-6 large-desktop:gap-6 xl:gap-8 2xl:gap-8',
    lg: 'gap-6 tablet:gap-6 desktop:gap-8 large-desktop:gap-8 xl:gap-10 2xl:gap-10',
  };

  return (
    <div
      className={`grid w-full ${gapClasses[gap]} tablet:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] large-desktop:[grid-template-columns:repeat(auto-fit,minmax(380px,1fr))] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] xl:[grid-template-columns:repeat(auto-fit,minmax(380px,1fr))] 2xl:[grid-template-columns:repeat(auto-fit,minmax(380px,1fr))] ${className}`}
    >
      {children}
    </div>
  );
}
