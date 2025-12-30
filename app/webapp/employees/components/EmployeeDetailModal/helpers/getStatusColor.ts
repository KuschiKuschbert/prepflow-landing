/**
 * Get status color classes for employee status badge
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20';
    case 'inactive':
      return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20';
    case 'terminated':
      return 'bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20';
    default:
      return 'bg-gray-500/10 text-[var(--foreground-muted)] border-gray-500/20';
  }
}


