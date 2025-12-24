'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';

export function PerformanceClassificationLegend() {
  return (
    <div className="tablet:p-4 desktop:p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20 p-3">
      <div className="tablet:mb-2 mb-1.5 flex items-center gap-2">
        <h3 className="tablet:text-sm text-xs font-semibold text-[var(--button-active-text)]">
          Menu Item Classifications
        </h3>
        <HelpTooltip
          content="Dishes are categorized based on profit and popularity. Chef's Kiss: High profit AND high sales - your stars. Hidden Gem: High profit but low sales - market these better. Bargain Bucket: Popular but low profit - consider raising price. Burnt Toast: Low profit AND low sales - consider removing."
          title="Understanding Classifications"
        />
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)]"></span>
          <span className="text-[var(--foreground-secondary)]">
            Chef&apos;s Kiss: High profit & high popularity
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-[var(--color-info-border)] bg-[var(--color-info-bg)]"></span>
          <span className="text-[var(--foreground-secondary)]">
            Hidden Gem: High profit, low sales
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]"></span>
          <span className="text-[var(--foreground-secondary)]">
            Bargain Bucket: Popular, low profit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-[var(--color-error-border)] bg-[var(--color-error-bg)]"></span>
          <span className="text-[var(--foreground-secondary)]">
            Burnt Toast: Low profit & low sales
          </span>
        </div>
      </div>
    </div>
  );
}
