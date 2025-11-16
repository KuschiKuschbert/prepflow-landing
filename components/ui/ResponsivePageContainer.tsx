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
 * - Mobile: full width (0-480px)
 * - Tablet (tablet:): max-w-2xl mx-auto (481px-1024px)
 * - Desktop (desktop:): max-w-7xl mx-auto (1025px-1439px)
 * - Large Desktop (large-desktop:): max-w-[1440px] mx-auto (1440px-1919px)
 * - XL: max-w-[1920px] mx-auto (1920px-2559px)
 * - 2XL: max-w-[2560px] mx-auto (2560px+)
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
      className={`tablet:px-6 desktop:px-8 large-desktop:px-12 tablet:max-w-2xl desktop:max-w-7xl large-desktop:max-w-[1440px] mx-auto w-full px-4 xl:max-w-[1920px] xl:px-16 2xl:max-w-[2560px] 2xl:px-20 ${className}`}
    >
      {children}
    </div>
  );
}
