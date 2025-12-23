'use client';

import React from 'react';

interface TextContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Width variant for text content
   * - 'prose': Optimal reading width (~65ch, 60-75 characters per line) - default
   * - 'wide': Slightly wider text (~48rem) - for longer content
   * - 'full': No width constraint - use sparingly
   */
  variant?: 'prose' | 'wide' | 'full';
}

/**
 * TextContainer - Optimal reading width container for text content
 *
 * Modern UX Best Practice: Maintains 60-75 characters per line for optimal readability.
 * Research shows this line length maximizes reading comprehension and reduces eye strain.
 *
 * @param {TextContainerProps} props - Component props
 * @returns {JSX.Element} Text container with optimal reading width
 *
 * @example
 * ```tsx
 * <TextContainer variant="prose">
 *   <p>Long-form article content...</p>
 * </TextContainer>
 * ```
 */
export function TextContainer({
  children,
  className = '',
  variant = 'prose',
}: TextContainerProps) {
  const widthClasses = {
    prose: 'max-w-prose', // ~65ch, optimal reading width
    wide: 'max-w-3xl', // ~48rem, slightly wider
    full: '', // No constraint
  };

  return (
    <div className={`mx-auto ${widthClasses[variant]} ${className}`}>{children}</div>
  );
}




