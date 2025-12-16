'use client';

import { getArcadeStats } from '@/lib/arcadeStats';
import { useEffect, useState } from 'react';
import { AdaptiveNavSettingsPanel } from '../AdaptiveNavSettingsPanel';
import { SystemInformationPanel } from '../SystemInformationPanel';

/**
 * Advanced section component.
 * Combines system information, experimental features, and arcade stats.
 *
 * @component
 * @returns {JSX.Element} Advanced section
 */
export function AdvancedSection() {
  const [arcadeStats, setArcadeStats] = useState({ tomatoes: 0, dockets: 0, fires: 0 });

  // Load arcade stats after hydration and update when they change
  useEffect(() => {
    // Load stats from localStorage only on client after hydration
    setArcadeStats(getArcadeStats());

    // Keep existing event listener for updates
    const handleStatsUpdate = () => {
      setArcadeStats(getArcadeStats());
    };

    window.addEventListener('arcade:statsUpdated', handleStatsUpdate);
    return () => window.removeEventListener('arcade:statsUpdated', handleStatsUpdate);
  }, []);

  return (
    <div className="space-y-6">
      <SystemInformationPanel />

      {/* Experimental Features */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Experimental Features</h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Try out new features that are still in development. These may change or be removed in
            future updates.
          </p>
        </div>

        {/* Adaptive Navigation Optimization */}
        <AdaptiveNavSettingsPanel />
      </div>

      {/* Arcade Stats - Fun Feature */}
      <div className="mt-8 rounded-2xl border border-[var(--border)]/30 bg-[var(--surface)]/30 p-6">
        <h2 className="mb-2 text-lg font-semibold text-[var(--foreground-muted)]">Arcade Stats</h2>
        <p className="mb-4 text-sm text-[var(--foreground-subtle)]">
          Your all-time stats across all sessions. Just for fun! 🎮
        </p>
        <div className="desktop:grid-cols-3 desktop:gap-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--muted)]/20 p-4">
            <div className="mb-1 text-2xl">🍅</div>
            <div className="mb-1 text-xs text-[var(--foreground-subtle)]">Tomatoes Thrown</div>
            <div className="text-xl font-bold text-[var(--primary)]">{arcadeStats.tomatoes}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--muted)]/20 p-4">
            <div className="mb-1 text-2xl">📋</div>
            <div className="mb-1 text-xs text-[var(--foreground-subtle)]">Dockets Caught</div>
            <div className="text-xl font-bold text-[var(--color-info)]">{arcadeStats.dockets}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--muted)]/20 p-4">
            <div className="mb-1 text-2xl">🔥</div>
            <div className="mb-1 text-xs text-[var(--foreground-subtle)]">Fires Extinguished</div>
            <div className="text-xl font-bold text-[#E74C3C]">{arcadeStats.fires}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
