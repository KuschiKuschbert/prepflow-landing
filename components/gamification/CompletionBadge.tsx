/**
 * Completion Badge Component
 *
 * Small contextual badges showing progress hints.
 * Example: "Add 3 more ingredients to unlock Stock Master 🥬"
 */

'use client';

interface CompletionBadgeProps {
  /**
   * Badge message
   */
  message: string;

  /**
   * Optional icon/emoji
   */
  icon?: string;

  /**
   * Optional variant
   */
  variant?: 'info' | 'hint' | 'milestone';

  /**
   * Optional className
   */
  className?: string;
}

const variantStyles = {
  info: 'border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]',
  hint: 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)]',
  milestone: 'border-[var(--tertiary)]/30 bg-[var(--tertiary)]/10 text-[var(--tertiary)]',
};

export function CompletionBadge({
  message,
  icon,
  variant = 'hint',
  className = '',
}: CompletionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{message}</span>
    </div>
  );
}
