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
  const [stats, setStats] = useState<ArcadeStats>(() => getSessionStats());

  useEffect(() => {
    const handleStatsUpdate = () => {
      setStats(getSessionStats());
    };

    window.addEventListener('arcade:sessionStatsUpdated', handleStatsUpdate);
    setStats(getSessionStats()); // Initial load

    return () => {
      window.removeEventListener('arcade:sessionStatsUpdated', handleStatsUpdate);
    };
  }, []);

  return (
    <div className="flex gap-1.5 text-[10px] text-white/80 md:gap-3 md:text-xs">
      <div title="Tomatoes Thrown" className="flex items-center gap-0.5 md:gap-1">
        <span>🍅</span>
        <span className="text-[9px] md:text-xs">{stats.tomatoes}</span>
      </div>
      <div title="Dockets Caught" className="flex items-center gap-0.5 md:gap-1">
        <span>🧾</span>
        <span className="text-[9px] md:text-xs">{stats.dockets}</span>
      </div>
      <div title="Fires Extinguished" className="flex items-center gap-0.5 md:gap-1">
        <span>🔥</span>
        <span className="text-[9px] md:text-xs">{stats.fires}</span>
      </div>
    </div>
  );
};
