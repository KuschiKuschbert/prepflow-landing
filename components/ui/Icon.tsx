'use client';

import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<IconSize, string> = {
  xs: 'h-3 w-3', // 12px
  sm: 'h-4 w-4', // 16px
  md: 'h-5 w-5', // 20px
  lg: 'h-6 w-6', // 24px
  xl: 'h-8 w-8', // 32px
};

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  style?: React.CSSProperties;
  title?: string;
}

/**
 * Standardized icon component wrapper for Lucide React icons.
 * Provides consistent sizing and accessibility support.
 *
 * @component
 * @param {IconProps} props - Icon component props
 * @returns {JSX.Element} Rendered icon
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size = 'md',
      className = '',
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...props
    },
    ref,
  ) => {
    return (
      <IconComponent
        ref={ref}
        className={`${sizeMap[size]} ${className}`}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden !== undefined ? ariaHidden : !ariaLabel}
        role={ariaLabel ? 'img' : undefined}
        {...props}
      />
    );
  },
);

Icon.displayName = 'Icon';
