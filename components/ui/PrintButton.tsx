'use client';

/**
 * Standardized print button component
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { Icon } from './Icon';
import { Printer, Loader2 } from 'lucide-react';

export interface PrintButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function PrintButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Print',
  className = '',
  variant = 'primary',
  size = 'md',
}: PrintButtonProps) {
  const baseClasses =
    'flex items-center gap-2 rounded-lg font-medium text-[var(--foreground)] transition-all duration-200';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-lg hover:shadow-[var(--primary)]/30 text-[var(--button-active-text)]',
    secondary: 'bg-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--surface-variant)]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled || loading ? 'cursor-not-allowed opacity-50' : ''
      }`}
      aria-label={label}
      title={label}
    >
      {loading ? (
        <>
          <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
          <span className="tablet:inline hidden">Printing...</span>
        </>
      ) : (
        <>
          <Icon icon={Printer} size="sm" aria-hidden={true} />
          <span className="tablet:inline hidden">{label}</span>
        </>
      )}
    </button>
  );
}
