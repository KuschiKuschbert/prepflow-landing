'use client';

import React from 'react';

interface AsymmetricLayoutProps {
  children: React.ReactNode;
  /**
   * Main content area (constrained width for readability)
   */
  main: React.ReactNode;
  /**
   * Sidebar content (uses remaining space)
   */
  sidebar?: React.ReactNode;
  /**
   * Main content max width
   * - 'content': max-w-[1400px] - optimal content width
   * - 'text': max-w-[1200px] - optimal for text-heavy content
   * - 'narrow': max-w-[1000px] - narrower for focused content
   */
  mainWidth?: 'content' | 'text' | 'narrow';
  /**
   * Sidebar width
   * - 'auto': Flexible width (300-400px)
   * - 'fixed': Fixed 300px width
   * - 'wide': Fixed 400px width
   */
  sidebarWidth?: 'auto' | 'fixed' | 'wide';
  /**
   * Layout alignment
   * - 'center': Main content centered, sidebar on right
   * - 'left': Main content left-aligned, sidebar on right
   */
  align?: 'center' | 'left';
  /**
   * Gap between main and sidebar
   */
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * AsymmetricLayout - Modern large screen layout pattern
 *
 * Modern UX Best Practice: Uses main content area (constrained for readability) + sidebar
 * (uses remaining space) to make better use of large screens without stretching content.
 *
 * This follows the content-first approach: don't stretch content to fill space,
 * instead add complementary content (sidebars, related items, additional context).
 *
 * @param {AsymmetricLayoutProps} props - Component props
 * @returns {JSX.Element} Asymmetric layout with main content and optional sidebar
 *
 * @example
 * ```tsx
 * <AsymmetricLayout
 *   main={<ArticleContent />}
 *   sidebar={<TableOfContents />}
 *   mainWidth="text"
 *   sidebarWidth="fixed"
 * />
 * ```
 */
export function AsymmetricLayout({
  main,
  sidebar,
  mainWidth = 'content',
  sidebarWidth = 'auto',
  align = 'center',
  gap = 'md',
  className = '',
}: AsymmetricLayoutProps) {
  const mainWidthClasses = {
    content: 'max-w-[1400px]', // Optimal content width
    text: 'max-w-[1200px]', // Optimal for text-heavy content
    narrow: 'max-w-[1000px]', // Narrower for focused content
  };

  const sidebarWidthClasses = {
    auto: 'w-[300px] desktop:w-[350px] xl:w-[400px]', // Flexible, responsive
    fixed: 'w-[300px]', // Fixed 300px
    wide: 'w-[400px]', // Fixed 400px
  };

  const gapClasses = {
    sm: 'gap-6',
    md: 'gap-8 desktop:gap-10 xl:gap-12',
    lg: 'gap-10 desktop:gap-12 xl:gap-16',
  };

  const alignClasses = {
    center: 'justify-center',
    left: 'justify-start',
  };

  // If no sidebar, just render main content with constraints
  if (!sidebar) {
    return (
      <div className={`mx-auto ${mainWidthClasses[mainWidth]} ${className}`}>
        {main}
      </div>
    );
  }

  return (
    <div
      className={`desktop:flex-row flex flex-col ${gapClasses[gap]} ${alignClasses[align]} ${className}`}
    >
      {/* Main content area - constrained width */}
      <div className={`flex-1 ${mainWidthClasses[mainWidth]}`}>{main}</div>

      {/* Sidebar - uses remaining space */}
      <aside
        className={`desktop:flex-shrink-0 flex-shrink-0 ${sidebarWidthClasses[sidebarWidth]}`}
      >
        {sidebar}
      </aside>
    </div>
  );
}



