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
    <div className="flex items-center gap-1 text-white/80 sm:gap-1.5 md:gap-2">
      <div
        title="Tomatoes Thrown"
        className="flex items-center gap-0.5 sm:gap-1"
        style={{ fontSize: '14px' }}
      >
        <span className="text-sm leading-none sm:text-base md:text-lg">🍅</span>
        <span className="text-[10px] leading-none sm:text-[11px] md:text-xs">{stats.tomatoes}</span>
      </div>
      <div
        title="Dockets Caught"
        className="flex items-center gap-0.5 sm:gap-1"
        style={{ fontSize: '14px' }}
      >
        <span className="text-sm leading-none sm:text-base md:text-lg">🧾</span>
        <span className="text-[10px] leading-none sm:text-[11px] md:text-xs">{stats.dockets}</span>
      </div>
      <div
        title="Fires Extinguished"
        className="flex items-center gap-0.5 sm:gap-1"
        style={{ fontSize: '14px' }}
      >
        <span className="text-sm leading-none sm:text-base md:text-lg">🔥</span>
        <span className="text-[10px] leading-none sm:text-[11px] md:text-xs">{stats.fires}</span>
      </div>
    </div>
  );
};
