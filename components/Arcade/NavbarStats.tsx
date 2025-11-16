/**
 * Navbar Stats Badges
 *
 * Session stats display in the navbar showing current session arcade game scores.
 * These reset on logout but persist during the current browser session.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { getSessionStats, ArcadeStats } from '@/lib/arcadeStats';

export const NavbarStats: React.FC = () => {
  // Always initialize with zeros to match SSR and prevent hydration mismatch
  const [stats, setStats] = useState<ArcadeStats>({ tomatoes: 0, dockets: 0, fires: 0 });

  useEffect(() => {
    // Update stats from sessionStorage after mount to avoid hydration mismatch
    setStats(getSessionStats());

    const handleStatsUpdate = () => {
      setStats(getSessionStats());
    };

    window.addEventListener('arcade:sessionStatsUpdated', handleStatsUpdate);

    return () => {
      window.removeEventListener('arcade:sessionStatsUpdated', handleStatsUpdate);
    };
  }, []);

  return (
    <div className="tablet:gap-1.5 desktop:gap-2 flex items-center gap-1 text-white/80">
      <div
        title="Tomatoes Thrown"
        className="tablet:gap-1 flex items-center gap-0.5"
        style={{ fontSize: '14px' }}
      >
        <span className="text-fluid-sm tablet:text-fluid-base desktop:text-fluid-lg leading-none">
          🍅
        </span>
        <span className="tablet:text-[11px] desktop:text-fluid-xs text-[10px] leading-none">
          {stats.tomatoes}
        </span>
      </div>
      <div
        title="Dockets Caught"
        className="tablet:gap-1 flex items-center gap-0.5"
        style={{ fontSize: '14px' }}
      >
        <span className="text-fluid-sm tablet:text-fluid-base desktop:text-fluid-lg leading-none">
          🧾
        </span>
        <span className="tablet:text-[11px] desktop:text-fluid-xs text-[10px] leading-none">
          {stats.dockets}
        </span>
      </div>
      <div
        title="Fires Extinguished"
        className="tablet:gap-1 flex items-center gap-0.5"
        style={{ fontSize: '14px' }}
      >
        <span className="text-fluid-sm tablet:text-fluid-base desktop:text-fluid-lg leading-none">
          🔥
        </span>
        <span className="tablet:text-[11px] desktop:text-fluid-xs text-[10px] leading-none">
          {stats.fires}
        </span>
      </div>
    </div>
  );
};
