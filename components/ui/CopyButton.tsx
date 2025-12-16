'use client';

/**
 * Standardized copy-to-clipboard button component
 * Provides visual feedback on copy success
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { useState } from 'react';
import { Icon } from './Icon';
import { Copy, Check, Loader2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { copyToClipboard } from '@/lib/share/share-utils';

export interface CopyButtonProps {
  text: string;
  label?: string;
  successMessage?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({
  text,
  label = 'Copy',
  successMessage = 'Copied to clipboard',
  className = '',
  variant = 'secondary',
  size = 'md',
}: CopyButtonProps) {
  const { showSuccess, showError } = useNotification();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const success = await copyToClipboard(text);
    setLoading(false);

    if (success) {
      setCopied(true);
      showSuccess(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } else {
      showError('Failed to copy. Please try again.');
    }
  };

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
    icon: 'p-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--surface-variant)]',
  };

  const iconSize = variant === 'icon' ? 'md' : 'sm';

  return (
    <button
      onClick={handleCopy}
      disabled={loading}
      className={`${baseClasses} ${variant === 'icon' ? '' : sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        loading ? 'cursor-not-allowed opacity-50' : ''
      }`}
      aria-label={label}
      title={label}
    >
      {loading ? (
        <Icon icon={Loader2} size={iconSize} className="animate-spin" aria-hidden={true} />
      ) : copied ? (
        <>
          <Icon icon={Check} size={iconSize} className="text-[var(--primary)]" aria-hidden={true} />
          {variant !== 'icon' && <span className="tablet:inline hidden">Copied!</span>}
        </>
      ) : (
        <>
          <Icon icon={Copy} size={iconSize} aria-hidden={true} />
          {variant !== 'icon' && <span className="tablet:inline hidden">{label}</span>}
        </>
      )}
    </button>
  );
}
