import { checkAchievementMilestone, dispatchMilestoneReached } from '@/lib/gamification/milestones';
import { type Achievement, type AchievementId, ACHIEVEMENTS } from '../../achievements';
import { loadAchievements, saveAchievements } from './storage';

export function unlockAchievement(id: AchievementId): void {
  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map((a: Achievement) => a.id));

  if (unlockedIds.has(id)) return; // Already unlocked

  const achievement: Achievement = {
    ...ACHIEVEMENTS[id],
    unlockedAt: Date.now(),
  };

  achievements.push(achievement);
  saveAchievements(achievements);

  // Dispatch event for UI to show celebration
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('personality:achievement', {
        detail: { achievement },
      }),
    );
  }

  // Check for achievement milestones (first achievement, halfway, complete)
  const achievementMilestone = checkAchievementMilestone(achievements.length);
  if (achievementMilestone) {
    dispatchMilestoneReached(achievementMilestone);
  }
}
