import { loadStats, saveStats } from './storage';

export function updateStreak(): number {
  const stats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (stats.lastActiveDate === today) {
    // Already updated today
    return stats.streakDays;
  }

  if (stats.lastActiveDate === yesterday) {
    // Consecutive day
    stats.streakDays += 1;
  } else {
    // Streak broken
    stats.streakDays = 1;
  }

  stats.lastActiveDate = today;
  saveStats(stats);

  return stats.streakDays;
}
