'use client';

import { Icon } from '@/components/ui/Icon';
import { Cherry, Flame, Receipt } from 'lucide-react';

interface ArcadeStats {
  tomatoes: number;
  dockets: number;
  fires: number;
}

interface AchievementsDropdownArcadeTabProps {
  stats: ArcadeStats;
}

export function AchievementsDropdownArcadeTab({ stats }: AchievementsDropdownArcadeTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <div className="flex items-center gap-3">
          <Icon icon={Cherry} size="xl" aria-hidden={true} />
          <div>
            <div className="font-semibold text-[var(--foreground)]">Tomatoes Thrown</div>
            <div className="text-fluid-sm text-[var(--foreground-muted)]">Frustration splats.</div>
          </div>
        </div>
        <div className="text-fluid-2xl font-bold text-[#4CAF50]">{stats.tomatoes}</div>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <div className="flex items-center gap-3">
          <Icon icon={Receipt} size="xl" aria-hidden={true} />
          <div>
            <div className="font-semibold text-[var(--foreground)]">Dockets Caught</div>
            <div className="text-fluid-sm text-[var(--foreground-muted)]">Orders snatched.</div>
          </div>
        </div>
        <div className="text-fluid-2xl font-bold text-[#4CAF50]">{stats.dockets}</div>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <div className="flex items-center gap-3">
          <Icon icon={Flame} size="xl" aria-hidden={true} />
          <div>
            <div className="font-semibold text-[var(--foreground)]">Fires Extinguished</div>
            <div className="text-fluid-sm text-[var(--foreground-muted)]">Crises averted.</div>
          </div>
        </div>
        <div className="text-fluid-2xl font-bold text-[#4CAF50]">{stats.fires}</div>
      </div>
    </div>
  );
}
