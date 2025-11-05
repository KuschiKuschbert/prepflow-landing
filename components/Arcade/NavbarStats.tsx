/**
 * Navbar Stats Badges
 *
 * Persistent stats display in the navbar showing all arcade game scores.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { getArcadeStats, ArcadeStats } from '@/lib/arcadeStats';

export const NavbarStats: React.FC = () => {
  const [stats, setStats] = useState<ArcadeStats>(() => getArcadeStats());

  useEffect(() => {
    const handleStatsUpdate = () => {
      setStats(getArcadeStats());
    };

    window.addEventListener('arcade:statsUpdated', handleStatsUpdate);
    setStats(getArcadeStats()); // Initial load

    return () => {
      window.removeEventListener('arcade:statsUpdated', handleStatsUpdate);
    };
  }, []);

  return (
    <div className="flex gap-3 text-xs text-white/80">
      <div title="Tomatoes Thrown" className="flex items-center gap-1">
        <span>🍅</span>
        <span>{stats.tomatoes}</span>
      </div>
      <div title="Dockets Caught" className="flex items-center gap-1">
        <span>🧾</span>
        <span>{stats.dockets}</span>
      </div>
      <div title="Fires Extinguished" className="flex items-center gap-1">
        <span>🔥</span>
        <span>{stats.fires}</span>
      </div>
      <div title="Best Docket Run" className="flex items-center gap-1">
        <span>⭐</span>
        <span>{stats.bestRun}</span>
      </div>
    </div>
  );
};
