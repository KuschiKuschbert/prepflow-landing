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
 * Modern 2024/2025 UX Best Practices:
 * - Optimal content width: 1200-1400px for readability and visual balance
 * - Text reading width: 60-75 characters per line (~65ch)
 * - Content-first approach: Don't stretch content, use space for sidebars/complementary content
 *
 * Max-width constraints:
 * - Mobile: full width (0-480px)
 * - Tablet (tablet:): max-w-2xl mx-auto (481px-1024px)
 * - Desktop (desktop:): max-w-7xl mx-auto (1025px-1439px) - 1280px (optimal)
 * - Large Desktop (large-desktop:): max-w-[1400px] mx-auto (1440px-1919px) - slightly wider
 * - XL: max-w-[1400px] mx-auto (1920px-2559px) - optimal reading width, don't go wider
 * - 2XL: max-w-[1600px] mx-auto (2560px+) - only slightly wider, use space for sidebars
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
      className={`tablet:px-6 desktop:px-8 large-desktop:px-12 tablet:max-w-2xl desktop:max-w-7xl large-desktop:max-w-[1400px] mx-auto w-full px-4 xl:max-w-[1400px] xl:px-20 2xl:max-w-[1600px] 2xl:px-24 ${className}`}
    >
      {children}
    </div>
  );
}
