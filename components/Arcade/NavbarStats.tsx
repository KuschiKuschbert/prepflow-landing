/**
 * Navbar Stats Badges
 *
 * Session stats display in the navbar showing current session arcade game scores,
 * achievement count, and streak indicator. Clickable to open AchievementsDropdown.
 * These reset on logout but persist during the current browser session.
 */

'use client';

import { useGamification } from '@/hooks/useGamification';
import { ArcadeStats, getSessionStats } from '@/lib/arcadeStats';
import { usePersonality } from '@/lib/personality/store';
import React, { useEffect, useState } from 'react';

interface NavbarStatsProps {
  onClick?: () => void;
}

export const NavbarStats: React.FC<NavbarStatsProps> = ({ onClick }) => {
  // Always initialize with zeros to match SSR and prevent hydration mismatch
  const [stats, setStats] = useState<ArcadeStats>({ tomatoes: 0, dockets: 0, fires: 0 });
  const { achievementProgress } = useGamification();
  const { settings } = usePersonality();
  const [streakDays, setStreakDays] = useState(0);
  // Track if component is mounted to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to enable client-only content
    setIsMounted(true);

    // Update stats from sessionStorage after mount to avoid hydration mismatch
    setStats(getSessionStats());

    const handleStatsUpdate = () => {
      setStats(getSessionStats());
    };

    window.addEventListener('arcade:sessionStatsUpdated', handleStatsUpdate);
    window.addEventListener('gamification:statsUpdated', handleStatsUpdate);
    window.addEventListener('gamification:achievementUnlocked', handleStatsUpdate);

    // Load streak days from achievement tracker
    try {
      const stored = localStorage.getItem('prepflow_achievement_stats');
      if (stored) {
        const achievementStats = JSON.parse(stored);
        setStreakDays(achievementStats.streakDays || 0);
      }
    } catch {
      // Ignore errors
    }

    return () => {
      window.removeEventListener('arcade:sessionStatsUpdated', handleStatsUpdate);
      window.removeEventListener('gamification:statsUpdated', handleStatsUpdate);
      window.removeEventListener('gamification:achievementUnlocked', handleStatsUpdate);
    };
  }, []);

  const achievementCount = achievementProgress.unlocked || 0;
  const hasStreak = streakDays > 0;
  // Only check gamification after mount to prevent hydration mismatch
  const gamificationEnabled = isMounted && settings.enabled;

  return (
    <button
      onClick={onClick}
      className="tablet:gap-1.5 desktop:gap-2 flex items-center gap-1 rounded-lg px-2 py-1 text-white/80 transition-colors hover:bg-[#2a2a2a]/50 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
      aria-label="Open achievements and stats"
      title="Click to view achievements and stats"
    >
      {/* Arcade Stats */}
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

      {/* Achievement Count Badge - Only render after mount to prevent hydration mismatch */}
      {gamificationEnabled && achievementCount > 0 && (
        <div
          title={`${achievementCount} achievements unlocked`}
          className="tablet:gap-1 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 px-2 py-0.5"
        >
          <span className="text-fluid-sm tablet:text-fluid-base desktop:text-fluid-lg leading-none">
            🏆
          </span>
          <span className="tablet:text-[11px] desktop:text-fluid-xs text-[10px] leading-none font-semibold text-[#29E7CD]">
            {achievementCount}
          </span>
        </div>
      )}

      {/* Streak Indicator - Only render after mount to prevent hydration mismatch */}
      {gamificationEnabled && hasStreak && (
        <div title={`${streakDays} day streak`} className="tablet:gap-1 flex items-center gap-0.5">
          <span className="text-fluid-sm tablet:text-fluid-base desktop:text-fluid-lg leading-none">
            🔥
          </span>
          <span className="tablet:text-[11px] desktop:text-fluid-xs text-[10px] leading-none font-semibold text-[#FF6B00]">
            {streakDays}
          </span>
        </div>
      )}
    </button>
  );
};
