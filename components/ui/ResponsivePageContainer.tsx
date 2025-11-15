'use client';

import React from 'react';

interface ResponsivePageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

/**
 * ResponsivePageContainer - Wrapper for page-level content with responsive max-width constraints
 *
 * Max-width constraints:
 * - Mobile: full width
 * - Tablet (md:): max-w-2xl mx-auto
 * - Desktop (lg:): max-w-7xl mx-auto
 * - Large Desktop: max-w-[1440px] mx-auto
 * - XL: max-w-[1920px] mx-auto
 * - 2XL: max-w-[2560px] mx-auto
 */
export function ResponsivePageContainer({
  children,
  className = '',
  fullWidth = false,
}: ResponsivePageContainerProps) {
  if (fullWidth) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`w-full mx-auto px-4 md:px-6 lg:px-8 large-desktop:px-12 xl:px-16 2xl:px-20 md:max-w-2xl lg:max-w-7xl large-desktop:max-w-[1440px] xl:max-w-[1920px] 2xl:max-w-[2560px] ${className}`}
    >
      {children}
    </div>
  );
}
