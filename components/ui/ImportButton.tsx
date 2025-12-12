'use client';

/**
 * Standardized import button component
 * Opens CSV import modal
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { Icon } from './Icon';
import { Upload, Loader2 } from 'lucide-react';

export interface ImportButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ImportButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Import CSV',
  className = '',
  variant = 'primary',
  size = 'md',
}: ImportButtonProps) {
  const baseClasses =
    'flex items-center gap-2 rounded-lg font-medium text-white transition-all duration-200';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-lg hover:shadow-[#29E7CD]/30',
    secondary: 'bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]',
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
          <span className="tablet:inline hidden">Importing...</span>
        </>
      ) : (
        <>
          <Icon icon={Upload} size="sm" aria-hidden={true} />
          <span className="tablet:inline hidden">{label}</span>
        </>
      )}
    </button>
  );
}




