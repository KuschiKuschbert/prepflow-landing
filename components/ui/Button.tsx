'use client';

import React from 'react';
import { MagneticButton } from './MagneticButton';
import { LANDING_COLORS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
  /**
   * Enable magnetic button behavior (follows mouse cursor)
   */
  magnetic?: boolean;
  /**
   * Enable glow effect on hover
   */
  glow?: boolean;
  /**
   * Apply full landing page styling (colors, typography)
   */
  landingStyle?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  magnetic = false,
  glow = false,
  landingStyle = false,
  ...props
}) => {
  // Base classes - use landing typography if landingStyle is enabled
  const baseClasses = landingStyle
    ? `inline-flex items-center justify-center ${LANDING_TYPOGRAPHY.base} font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]`
    : 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]';

  // Variant classes - use landing colors if landingStyle is enabled
  const variantClasses = landingStyle
    ? {
        primary: `bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--button-active-text)] shadow-lg hover:shadow-xl hover:shadow-[var(--primary)]/25`,
        secondary: `bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-[var(--button-active-text)] shadow-lg hover:shadow-xl hover:shadow-[var(--accent)]/25`,
        outline: `border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]`,
      }
    : {
        primary:
          'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--button-active-text)] shadow-lg hover:shadow-xl hover:shadow-[var(--primary)]/25',
        secondary:
          'bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-[var(--button-active-text)] shadow-lg hover:shadow-xl hover:shadow-[var(--accent)]/25',
        outline:
          'border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
      };

  // Size classes - use landing typography if landingStyle is enabled
  const sizeClasses = landingStyle
    ? {
        sm: `px-4 py-2 ${LANDING_TYPOGRAPHY.sm} rounded-lg`,
        md: `px-6 py-3 ${LANDING_TYPOGRAPHY.base} rounded-xl`,
        lg: `px-8 py-4 ${LANDING_TYPOGRAPHY.lg} rounded-2xl`,
      }
    : {
        sm: 'px-4 py-2 text-fluid-sm rounded-lg',
        md: 'px-6 py-3 text-fluid-base rounded-xl',
        lg: 'px-8 py-4 text-fluid-lg rounded-2xl',
      };

  // Glow effect classes
  const glowClasses = glow
    ? `hover:shadow-[0_0_20px_rgba(41,231,205,0.5)] hover:shadow-[var(--primary)]/50`
    : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses} ${className}`;

  // Render loading spinner
  const loadingSpinner = loading && (
    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
  );

  // Button content
  const buttonContent = (
    <>
      {loadingSpinner}
      {children}
    </>
  );

  // If href is provided, render as link
  // Note: MagneticButton only works with button elements, not links
  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} {...props}>
        {buttonContent}
      </a>
    );
  }

  // Render button
  const buttonElement = (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {buttonContent}
    </button>
  );

  // Wrap with MagneticButton if magnetic is enabled
  if (magnetic) {
    return (
      <MagneticButton
        onClick={onClick}
        disabled={disabled || loading}
        className={classes}
        aria-label={ariaLabel}
        {...props}
      >
        {buttonContent}
      </MagneticButton>
    );
  }

  return buttonElement;
};
