/**
 * Skill Learning - Automatic skill evolution from error-learning and RSI
 */

export { loadConfig, loadSkillMapping } from './config';
export { getSkillForErrorPattern, getSkillForRsiType } from './skill-mapper';
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
