/**
 * Skill Learning Config Loader
 */

import fs from 'fs';
import path from 'path';
import type { SkillLearningConfig, SkillMapping } from './types';

const CONFIG_PATH = path.join(process.cwd(), 'docs/skill-learning/config.json');
const MAPPING_PATH = path.join(process.cwd(), 'docs/skill-learning/skill-mapping.json');

const DEFAULT_CONFIG: SkillLearningConfig = {
  minFixCount: 3,
  minRsiConfidence: 0.8,
  skillsDir: '.agent/skills',
  proposedDir: 'docs/skill-learning/proposed',
};

export function loadConfig(): SkillLearningConfig {
  try {
    const content = fs.readFileSync(CONFIG_PATH, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function loadSkillMapping(): SkillMapping {
  try {
    const content = fs.readFileSync(MAPPING_PATH, 'utf8');
    return JSON.parse(content);
  } catch {
    return { errorPatterns: {}, rsiTypes: {} };
  }
}
