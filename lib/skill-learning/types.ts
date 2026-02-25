/**
 * Skill Learning Types
 */

export interface SkillLearningConfig {
  minFixCount: number;
  minRsiConfidence: number;
  skillsDir: string;
  proposedDir: string;
}

export interface SkillMapping {
  errorPatterns: Record<string, string>;
  rsiTypes: Record<string, string>;
}

export interface SkillUpdateInput {
  patternId: string;
  patternName: string;
  description: string;
  detection: string;
  fix: string;
  prevention: string;
  source: 'error-learning' | 'rsi';
}

export interface SkillUpdateResult {
  skillName: string;
  proposed: boolean;
  path: string;
  error?: string;
}
