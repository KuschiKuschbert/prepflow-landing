'use client';

import { Icon } from '@/components/ui/Icon';
import { LucideIcon } from 'lucide-react';

interface BulkActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

/** Renders a single action button in the bulk actions menu */
export function BulkActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'default',
}: BulkActionButtonProps) {
  const baseClasses =
    'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors disabled:opacity-50';

  const variantClasses =
    variant === 'danger'
      ? 'text-[var(--color-error)] hover:bg-[var(--color-error)]/10'
      : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)]';

  const iconClasses = variant === 'danger' ? 'text-[var(--color-error)]' : 'text-current';

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses}`}>
      <Icon icon={icon} size="xs" className={iconClasses} aria-hidden />
      <span>{label}</span>
    </button>
  );
}
