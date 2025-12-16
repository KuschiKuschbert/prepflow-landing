export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return 'text-[var(--foreground-muted)] bg-gray-400/10';
    case 'sent':
      return 'text-[var(--color-info)] bg-[var(--color-info)]/10';
    case 'received':
      return 'text-[var(--color-success)] bg-[var(--color-success)]/10';
    case 'cancelled':
      return 'text-[var(--color-error)] bg-[var(--color-error)]/10';
    default:
      return 'text-[var(--foreground-muted)] bg-gray-400/10';
  }
}
