import type { Milestone } from '../types';

const MILESTONE_STORAGE_KEY = 'prepflow-milestones-shown';

export { MILESTONE_STORAGE_KEY };

/**
 * Arcade milestones (trigger confetti at thresholds)
 */
export const ARCADE_MILESTONES = [10, 25, 50, 100] as const;

/**
 * Usage milestones (subtle celebrations)
 */
export const USAGE_MILESTONES: Milestone[] = [
  {
    id: 'usage:10-recipes',
    type: 'usage',
    name: 'Recipe Collection',
    description: 'Created 10 recipes',
    threshold: 10,
    icon: '📝',
  },
  {
    id: 'usage:50-ingredients',
    type: 'usage',
    name: 'Stock Master',
    description: 'Added 50 ingredients',
    threshold: 50,
    icon: '🥬',
  },
  {
    id: 'usage:100-saves',
    type: 'usage',
    name: 'Save Master',
    description: 'Saved 100 times',
    threshold: 100,
    icon: '💾',
  },
];

/**
 * Achievement milestones
 */
export const ACHIEVEMENT_MILESTONES: Milestone[] = [
  {
    id: 'achievement:first',
    type: 'achievement',
    name: 'First Achievement',
    description: 'Unlocked your first achievement',
    threshold: 1,
    icon: '🏆',
  },
  {
    id: 'achievement:halfway',
    type: 'achievement',
    name: 'Halfway There',
    description: 'Unlocked 50% of achievements',
    threshold: 5,
    icon: '⭐',
  },
  {
    id: 'achievement:complete',
    type: 'achievement',
    name: 'Achievement Master',
    description: 'Unlocked all achievements',
    threshold: 10,
    icon: '👑',
  },
];

