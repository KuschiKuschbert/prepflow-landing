/**
 * Stats Grid Component
 * Displays processing statistics
 */

'use client';

interface StatsGridProps {
  activeProcessing: number;
  queueLength: number;
  totalProcessed: number;
  totalRecipes: number;
}

export function StatsGrid({
  activeProcessing,
  queueLength,
  totalProcessed,
  totalRecipes,
}: StatsGridProps) {
  return (
    <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4">
      <div className="rounded-xl bg-[var(--background)] p-4">
        <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Active</div>
        <div className="text-2xl font-bold text-[#29E7CD]">{activeProcessing}</div>
      </div>
      <div className="rounded-xl bg-[var(--background)] p-4">
        <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">In Queue</div>
        <div className="text-2xl font-bold text-[var(--foreground)]">{queueLength}</div>
      </div>
      <div className="rounded-xl bg-[var(--background)] p-4">
        <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Processed</div>
        <div className="text-2xl font-bold text-[var(--foreground)]">{totalProcessed}</div>
      </div>
      <div className="rounded-xl bg-[var(--background)] p-4">
        <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">To Format</div>
        <div className="text-2xl font-bold text-[var(--foreground)]">{totalRecipes}</div>
      </div>
    </div>
  );
}
