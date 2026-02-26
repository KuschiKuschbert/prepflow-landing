/**
 * Skill Learning - Automatic skill evolution from error-learning and RSI
 */

export {
  maybeUpdateSkillFromPattern,
  maybeUpdateSkillFromRsi,
  proposeSkillUpdate,
} from './skill-updater';
export type {
  SkillLearningConfig,
  SkillMapping,
  SkillUpdateInput,
  SkillUpdateResult,
} from './types';
