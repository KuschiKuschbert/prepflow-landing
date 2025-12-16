export const SEVERITY_COLORS = {
  safety: 'bg-[var(--color-error)]/20 text-[var(--color-error)] border-[var(--color-error)]/30',
  critical: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  high: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border-[var(--color-warning)]/30',
  medium: 'bg-[var(--color-info)]/20 text-[var(--color-info)] border-[var(--color-info)]/30',
  low: 'bg-gray-500/20 text-[var(--foreground-muted)] border-gray-500/30',
} as const;
